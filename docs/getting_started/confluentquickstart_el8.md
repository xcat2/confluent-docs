---
layout: page
title: Confluent quickstart
permalink: /documentation/confluentquickstart_el8.html
toc: true
---

This document provides one example flow from installation to capable cluster. Confluent is very flexible and there are
multiple ways to do things. For example, this document is going to skip configuring automatic IP addresses, working with
an external DHCP server, automatic configuration based on physical location, and other topics. See the more detailed
documentation for more detail and alternative strategies for particular areas.

# Installing confluent

To install confluent as well as optional requirements, after adding a yum repository according to [download page](../downloads.md):

    # yum install lenovo-confluent tftp-server
    # systemctl enable confluent --now
    # systemctl enable httpd --now # if wanting to deploy operating systems and/or the web gui
    # systemctl enable tftp.socket --now  # If wanting to support PXE install

More details, including firewall rules and enabling GUI login may be found in the dedicated install page.

# Specifying some global behavior

In confluent, most all configuration is node oriented and can be derived from a group. A default group
called 'everything` is automatically added to every node. It provides a method to indicate global settings.

Attributes may all be specified on the command line, and an example set could be:

    # nodegroupattrib everything deployment.useinsecureprotocols=firmware console.method=ipmi dns.servers=172.30.0.254 dns.domain=mydomain.example net.ipv4_gateway=172.30.0.254


The deployment.useinsecureprotocols=firmware enables PXE support (HTTPS only mode is by default the only allowed mode), console.method=ipmi may be skipped but if specified instructs
confluennt to use IPMI to access the text console to enable the `nodeconsole` command.

While passwords and similar may be specified the same way, it is recommended to use the '-p' argument to prompt for values, to keep them out of your command history. Note that if
unspecified, default root password behavior is to disable password based login and for grub omitting the password will allow console to edit grub at boot without a password:

    # nodegroupattrib everything -p bmcuser bmcpass crypted.rootpassword crypted.grubpassword
    Enter value for bmcuser: 
    Confirm value for bmcuser: 
    Enter value for bmcpass: 
    Confirm value for bmcpass: 
    Enter value for crypted.rootpassword: 
    Confirm value for crypted.rootpassword: 
    Enter value for crypted.grubpassword: 
    Confirm value for crypted.grubpassword: 
    everything: crypted.grubpassword: ********
    everything: crypted.rootpassword: ********
    everything: secret.hardwaremanagementpassword: ********
    everything: secret.hardwaremanagementuser: ********

# Leave IPv6 enabled

Even if you are not using it explicitly, IPv6 needs to be enabled on interfaces. Generally this is default, but if you have disabled IPv6 on an interface, then re-enable it.
No address needs to be assigned explicitly, no DHCPv6 server is needed.  The only thing required is that deployment interfaces have an automatic IPv6 address beginning with
fe80::

# Defining nodes


Nodes may contain any number of attributes. In this document, everything is defined at the group level, so we only need define the names. Here we
will use a simple n[number] scheme, though any scheme may be used.

    # nodedefine n1-n4 


# Establishing hardware management through confluent discovery

It is possible to skip discovery and manually configure the xClarity Controllers and define them to confluent. On the other extreme, it is possible to configure
fully automatic discovery based on physical location.

For this guide we will use the manual confluent discovery process, which works with xClarity controllers without having an ip address or username/password configured in advance.

A command to examine what was detected:
    
    # nodediscover rescan
    Rescan complete
    # nodediscover list -t lenovo-xcc -f node,model,serial,mac -o model 
     Node|      Model|   Serial|               Mac
    -----|-----------|---------|------------------
         | 7D2VCTO1WW| J301VETT| 08:94:ef:aa:93:b7
         | 7X21CTO1WW| J100M79E| 08:94:ef:41:01:b5
         | 7X21CTO1WW| J1001PNE| 08:94:ef:50:1c:6b
         | 7X21CTO1WW| J1001PNG| 08:94:ef:50:9b:3b
         | 7X2104Z000| DVJJ1042| 08:94:ef:3f:e0:af
         | 7X2104Z000| DVJJ1003| 08:94:ef:40:89:31
         | 7X2104Z023| DVJJ9986| 08:94:ef:2f:2b:c7
         | 7X2106Z009| DVJJ1086| 08:94:ef:2f:2e:9d
         | 7Y02RCZ000| DVJJ8699| 08:94:ef:49:c3:55

This can be used to create a .csv file for manual discovery input:

    # nodediscover list -t lenovo-xcc -f node,serial -c -o model > input.csv

After manually editing in the desired names and deleting rows not of interest, input.csv looks like:

    # cat input.csv
    Node,Serial
    n1,J100M79E
    n2,J301VETT
    n3,J1001PNE
    n4,J1001PNG

Which can then be passed to nodediscover assign:

    # nodediscover assign -i input.csv 
    Defined n1
    Discovered n1
    Defined n2
    Discovered n2
    Defined n3
    Discovered n3
    Defined n4
    Discovered n4

At which point we can demonstrate power control through the everything group:

    # nodepower everything
    n1: on
    n2: on
    n3: on
    n4: off

# Preparing for OS deployment

If desiring only to prepare for hardware management, then the guide has completed. However, confluent also optionally supports OS deployment.

# Preparing name resolution

Note that no particular name resolution solution is required, but this document suggests a basic strategy if no strategy is already in place.

We start by building /etc/hosts. This may be done manually, or noderun can be used to quickly generate lines for /etc/hosts. First a dry run to make sure it looks correct:

    # noderun -n n1-n4 echo 172.30.0.{n1} {node} {node}.{dns.domain}
    172.30.0.1 n1 n1.mydomain.example
    172.30.0.2 n2 n2.mydomain.example
    172.30.0.3 n3 n3.mydomain.example
    172.30.0.4 n4 n4.mydomain.example

And then append to /etc/hosts when it looks correct:

    # noderun -n n1-n4 echo 172.30.0.{n1} {node} {node}.{dns.domain} >> /etc/hosts

Finally, to quickly have a dns server, installing and starting dnsmasq can make /etc/hosts available through dns:

    # yum install dnsmasq
    # systemctl enable dnsmasq --now

Any time /etc/hosts is updated, restart dnsmasq to have it pick up changes.

# Initializing confluent OS deployment.

The osdeploy command has an initialize subcommand to help set up requirements for OS deployment. Here the `-i` flag is used
to interactively prompt on the options that are available:
```
# osdeploy initialize -i
Add root user key to be authorized to log into nodes (-u)? (y/n): y
Initialize a profile to boot Genesis on target systems (a small Linux environment for rescue and staging use)? (y/n): y
Set up an SSH authority to help manage known_hosts and node to node ssh for all users (-s)? (y/n): y
Update global known hosts on this server to trust local CA certificates (-k)? (y/n): y
Allow managed nodes to ssh to this management node without a password (-l)? (y/n): y
Update tftp directory with binaries to support PXE (-p) (y/n): y
Generate new TLS certificates for HTTP, replacing any existing certificate (-t)? (y/n): y
HTTP server has been restarted if it was running
Generating public/private ed25519 key pair.
Your identification has been saved in /etc/confluent/ssh/ca.
Your public key has been saved in /etc/confluent/ssh/ca.pub.
The key fingerprint is:
SHA256:hnSBJPUL2tET7Djkdd3jP9zabTdGiefjuWnaNTvajec mgt3 SSH CA
The key's randomart image is:
+--[ED25519 256]--+
|    .oooo  . .   |
|     .oooo. . o  |
|     o++=.   . . |
|     ++=.o    .  |
|    . o.S     o.o|
|       .     . *o|
|              +++|
|              +O&|
|             oB%E|
+----[SHA256]-----+
TFTP service is enabled and running
Signed host key /tmp/tmpnc184l43/hostkey-cert.pub: id "mgt3" serial 0 for mgt3,mgt3.mycluster.example valid forever
Signed host key /tmp/tmp0y1oyp46/hostkey-cert.pub: id "mgt3" serial 0 for mgt3,mgt3.mycluster.example valid forever
Signed host key /tmp/tmp2i8lgmu_/hostkey-cert.pub: id "mgt3" serial 0 for mgt3,mgt3.mycluster.example valid forever
10 blocks
Updated: genesis-x86_64
Site initramfs content packed successfully
```

# Importing Install media

The iso of a supported OS may be imported by using the `osdeploy import` command, for example:

    # osdeploy import RHEL-8.2.0-20200404.0-x86_64-dvd1.iso 
    Importing from /root/RHEL-8.2.0-20200404.0-x86_64-dvd1.iso to /var/lib/confluent/distributions/rhel-8.2-x86_64
    complete: 100.00%    
    Deployment profile created: rhel-8.2-x86_64-default

Note that a new directory exists in /var/lib/confluent/public/os/rhel-8.2-x86_64-default. This is intended to be freely editable for customization
as desired.

# Deploying a node

To initiate network deployment of the profile above, the nodedeploy command may be used (TIP: the profile name like many other things may be tab completed when used interactively):

    # nodedeploy n1-n2 -n rhel-8.2-x86_64-default 
    n1: network
    n2: network
    n1: reset
    n2: reset

At this point, the boot and install progress may be watched interactively through the video console or by the text console available via nodeconsole:

    # nodeconsole n1

Also `nodedeploy` may be used to check the current status of a deployment:

    # nodedeploy n1-n2
    n1: pending: centos-8.2-x86_64-default (node authentication armed)
    n2: pending: centos-8.2-x86_64-default (node authentication armed)

When install is complete:

    [root@mgt1 ~]# nodedeploy d3,d4
    n1: completed: centos-8.2-x86_64-default
    n2: completed: centos-8.2-x86_64-default

Additionally, ssh to nodes will work:

    # nodeshell n1,n2 echo test
    n1: test
    n2: test

As will ssh between nodes:

    # ssh n1 ssh n2 echo test
    test



