---
title: Confluent Installation
tags:
  - installation
---

First add the Lenovo HPC repository appropriate to your environment according to the procedure on the [download page](../downloads.md).

## Installing the package

=== "RHEL and similar"

    Enterprise Linux 8.6, 9.0, or 10.0 and higher is required for installation.

    It is suggested to first make sure there are no updates in the repository for your existing software:

    ```bash
    yum --disablerepo=* --enablerepo=lenovo-hpc update
    ```

    At this point, the package may be installed:

    ```bash
    yum install lenovo-confluent
    ```

=== "SUSE"

    SuSE Linux Enterprise 15 SP4 or higher is currently required for installation.

    ```bash
    zypper install lenovo-confluent
    ```

=== "Ubuntu"

    Ubuntu Linux 22.04 or 24.04 is supported for installation.

    ```bash
    apt install lenovo-confluent
    ```

Next, enable it and start the confluent service:

```bash
systemctl enable confluent --now
```

At this point, source the script below for confluent command line functionality or logout and log back in.

```bash
source /etc/profile.d/confluent_env.sh
```

## Enabling http connectivity for OS Deployment, REST API usage, and the Web UI

=== "RHEL and similar"

    If you have SELinux enforcing, you need to allow `httpd` to make network
    connections:

    ```bash
    setsebool -P httpd_can_network_connect=on
    ```

    !!! note
        A default install also will have firewall restrictions preventing
        https use.  You may remedy this by doing the following:

        ```bash
        firewall-cmd --zone=public --add-service=https --permanent
        firewall-cmd --zone=public --add-service=https
        ```

    Further, OS deployment uses some more ports, depending on scenario.

    If doing any sort of network based boot (PXE/HTTP) without using an 'identity image' mounted over virtual USB, then the following is required to facilitate the API arming mechanism, as
    well as the SSDP port (udp port 1900) to allow deploying systems to scan for confluent servers:

    ```bash
    firewall-cmd --permanent --zone=public --add-port=13001/tcp
    firewall-cmd --permanent --zone=public --add-port=1900/udp
    ```

    If doing HTTP boot with `deployment.useinsecureprotocols` set to firmware, you will need plain http (port 80):

    ```bash
    firewall-cmd --permanent --zone=public --add-service=http --permanent
    firewall-cmd --permanent --zone=public --add-service=http
    ```

    If doing PXE boot, then you will need PXE and TFTP opened:

    ```bash
    firewall-cmd --permanent --zone=public --add-port=67/udp
    firewall-cmd --permanent --zone=public --add-port=69/udp
    firewall-cmd --permanent --zone=public --add-port=4011/udp
    ```

    Further, if doing network boot over IPv6:

    ```bash
    firewall-cmd --permanent --zone=public --add-port=547/udp
    ```

    If the web server is not already started, enable the web server:

    ```bash
    systemctl enable httpd --now
    ```

    If wanting to use nginx instead of Apache, then see this [document](../advanced_topics/switchtonginx.md) for details.

=== "SUSE"

    If not otherwise enabling and configuring TLS, then the following will activate a TLS configuration:

    ```bash
    cd /etc/apache2/vhosts.d/
    cp vhost-ssl.template mySSL.conf
    ```

    Use `osdeploy` to create TLS certificate:

    ```bash
    osdeploy initialize -t
    ```

    Enable SSL on Apache:

    ```bash
    a2enmod rewrite
    a2enflag SSL
    systemctl enable apache2 --now
    ```

=== "Ubuntu"

    Prior to running `osdeploy`, it is suggested to install a tftp server to support PXE.  The following will install a tftp server
    with socket activation, which is generally adequate:

    ```bash
    apt install tftpd-hpa
    ```

    If not otherwise enabling and configuring TLS, then the following will activate a TLS configuration:

    ```bash
    a2enmod ssl
    a2ensite default-ssl.conf
    ```

    Also, enable the confluent web configuration:

    ```bash
    a2enconf confluent
    ```

    Use `osdeploy` to create TLS certificate:

    ```bash
    osdeploy initialize -t
    ```

## Web UI Forwarding feature

The WebUI offers dynamic port forwarding.  To enable this feature when using `firewalld`, ensure TCP ports starting from port 3900 through however many ports you anticipate concurrently using.
Otherwise, you may opt to disable the firewall:

```bash
systemctl stop firewalld
systemctl disable firewalld
```

## Web UI Login

In terms of confluent itself, it is by default set up without any user access.  To enable a user that can ssh into your server to access the web interface:

```bash
confetty create /users/demouser role=admin
```

The user 'demouser' may now use his login password to access the confluent web interface as an administrator.  The available roles are:

* Administrator: Full access apart from reading 'secret.' attributes for all data and operations
* Operator: Removes the ability to change or add usernames or passwords in various contexts
* Monitor: Suitable for health check programs, unable to do anything to effect operation of systems, but can get power state, health, and sensor data.

After these steps, the GUI should be available at:

```text
https://[server]/lenovo-confluent/
```

## Preparing for discovery if firewall enabled

If wanting to use the confluent discovery capabilities and you have a firewall enabled (`firewalld`), further firewall configuration
is required. First, check `/etc/firewalld/firewalld.conf` and ensure that the FirewallBackend is set to iptables,
as the multicast reply rules require it.  With that configured, here are example commands to allow discovery to work when managed by `firewalld`:

```bash
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
```

## Getting ready to use confluent

Proceed to [configuring confluent](configureconfluent.md) for information on
adding groups and nodes.
