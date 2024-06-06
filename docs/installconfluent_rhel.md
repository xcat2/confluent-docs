---
layout: page
title: Confluent Installation for Red Hat Enterprise Linux
permalink: /documentation/installconfluent_rhel.html
---

Enterprise Linux 8.6 or 9.0 and higher is required for installation.

First add the Lenovo HPC yum repository appropriate to your environment according to the procedure on the  [download page]({{ site.baseurl }}/downloads/).  It is suggested to then make sure there are no updates in the repository for your existing software:

    yum --disablerepo=* --enablerepo=lenovo-hpc update

At this point, the package may be installed:

    yum install lenovo-confluent

Next, enable it and start the confluent service:

    systemctl enable confluent --now

At this point, source the script below for confluent command line functionality or logout and log back in. 

    source /etc/profile.d/confluent_env.sh

# Enabling http connectivity for OS Deployment, REST API usage, and the Web UI

If you have SELinux enforcing, you need to allow httpd to make network
connections:

    setsebool -P httpd_can_network_connect=on

Note that a default install also will have firewall restrictions preventing
https use.  You may remedy this by doing the following:

    firewall-cmd --zone=public --add-service=https --permanent
    firewall-cmd --zone=public --add-service=https

Further, OS deployment uses some more ports, depending on scenario.  

If doing any sort of network based boot (PXE/HTTP) without using an 'identity image' mounted over virtual USB, then the following is required to facilitate the API arming mechanism, as
well as the SSDP port (udp port 1900) to allow deploying systems to scan for confluent servers:

    firewall-cmd --permanent --zone=public --add-port=13001/tcp
    firewall-cmd --permanent --zone=public --add-port=1900/udp

If doing HTTP boot with `deployment.useinsecureprotocols' set to firmware, you will need plain http (port 80):

    firewall-cmd --permanent --zone=public --add-service=http

If doing PXE boot, then you will need PXE and TFTP opened:

    firewall-cmd --permanent --zone=public --add-port=13001/tcp
    firewall-cmd --permanent --zone=public --add-port=13001/tcp



If the web server is not already started, enable the web server:

    systemctl enable httpd --now


# Web UI Forwarding feature

The WebUI offers dynamic port forwarding.  To enable this feature, ensure TCP ports starting from port 3900 through however many ports you anticipate concurrently using.
Otherwise, you may opt to disable the firewall:

    systemctl stop firewalld
    systemctl disable firewalld

# Web UI Login

In terms of confluent itself, it is by default set up without any user access.  To enable a user that can ssh into your server to access the web interface:

    confetty create /users/demouser role=admin

The user 'demouser' may now use his login password to access the confluent web interface as an administrator.  The available roles are:

* Administrator: Full access apart from reading 'secret.' attributes for all data and operations
* Operator: Removes the ability to change or add usernames or passwords in various contexts
* Monitor: Suitable for health check programs, unable to do anything to effect operation of systems, but can get power state, health, and sensor data.

After these steps, the GUI should be available at:

    https://[server]/lenovo-confluent/


# Preparing for discovery if firewall enabled

If wanting to use the confluent discovery capabilities and you have a firewall enabled, further firewall configuration
is required. First, check /etc/firewalld/firewalld.conf and ensure that the FirewallBackend is set to iptables,
as the multicast reply rules require it.  With that configured, here are example commands to allow discovery to work when managed by firewalld:

    firewall-cmd --permanent --new-ipset=confluentv4 --type=hash:ip,port --option timeout=3
    firewall-cmd --permanent --new-ipset=confluentv6 --type=hash:ip,port --option timeout=3 --family inet6
    firewall-cmd --reload
    firewall-cmd --permanent --direct --add-rule ipv6 filter OUTPUT 1 -p udp -m udp --dport 427 -j SET --add-set confluentv6 src,src --exist
    firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 1 -p udp -m udp --dport 427 -j SET --add-set confluentv4 src,src --exist
    firewall-cmd --permanent --direct --add-rule ipv6 filter OUTPUT 1 -p udp -m udp --dport 1900 -j SET --add-set confluentv6 src,src --exist
    firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 1 -p udp -m udp --dport 1900 -j SET --add-set confluentv4 src,src --exist
    firewall-cmd --permanent --direct --add-rule ipv4 filter INPUT 1 -p udp -m set --match-set confluentv4 dst,dst -j ACCEPT
    firewall-cmd --permanent --direct --add-rule ipv6 filter INPUT 1 -p udp -m set --match-set confluentv6 dst,dst -j ACCEPT
    firewall-cmd --zone=public --add-port=427/udp --permanent
    firewall-cmd --zone=public --add-port=1900/udp --permanent
    firewall-cmd --zone=public --add-service=dhcp --permanent
    firewall-cmd --reload


# Getting ready to use confluent
 
Proceed to [configuring confluent]({{ site.baseurl }}/documentation/configconfluent.html) for information on
adding groups and nodes.
