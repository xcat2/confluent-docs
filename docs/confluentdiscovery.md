---
layout: page
title: Node discovery and autoconfiguration with confluent
permalink: /documentation/confluentdisco.html
---

While it is possible to use confluent by directly specifying the pre-configured 
address, username, and password of a BMC, confluent also has the ability to 
automate the deployment of configuration of Integrated Management Module
and xClarity Controller devices without knowing the addresses ahead of time.

For optimal results, the confluent server should be on the same network as
the management ports.  Additionally, it is more robust if IPv6 is not disabled,
though no IPv6 addresses need to be configured. Also, the general default
configuration for Lenovo servers is to only have the dedicated management port
enabled.  As such, a server without the management port wired is likely to not
complete the discovery process.

As a prelude for discovering a node, first define the node using the values
that it should be configured with at the end, regardless of current configuration.
For example, we will define 42 nodes (`n1` through `n42`) that upon completion should have an
xClarity Controller with the address '10.2.3.(node number)', the username `admin`, and the
password `Passw0rd12`:

    confetty create /noderange/n1-n42 hardwaremanagement.manager=10.2.3.{n1} secret.hardwaremanagementuser=admin secret.hardwaremanagementpassword=Passw0rd12

With this in mind, discovery can be approached in one of two ways, automatic
or manual.  The automatic approach is good for environments that have a well defined map
of servers or server enclosures to ethernet switch ports, and the manual approach
is good for scenarios like matching nodes up by serial numbers or having a small number of
servers to configure or replacing a system board.

## Automatic discovery

### Selecting a discovery policy

The first step is to opt into an automatic discovery policy.  There are three
policies:

* `manual` disables automatic discovery. 
* `open` will always allow a candidate node to be configured as the actual node, regardless of current certificate.  This allows the most hands off automation
in the face of actions such as replacing a planar, but if an attacker can spoof the mac address of a valid management device they could use the discovery process to get the username and password intended for a management device as well as install a certificate
of their choosing as trusted to be that node.
* `permissive` will allow automatic discovery only if the proposed node identity does not already have a known certificate (in the nodes `pubkeys.tls_hardwaremanager` attribute), allowing new nodes to
fill out defined nodes not yet bound to an actual node.  Note that nodes that
are defined, but not yet discovered are a risk to the same scenario as described in `open`

The policy can be defined on a per node basis or by group.  Here we will select `permissive` across the board:

    nodegroupattrib everything discovery.policy=permissive

The policy can be changed on the fly, if for example you want `open` or `permissive`
during initial deployment, but change to `manual` after systems are up:

    nodegroupattrib everything discovery.policy=manual

If you have a system that needs to be replaced, you can use manual discovery as
documented in the next section or temporarily override the policy for just the
one node:

    nodeattrib n3 discovery.policy=open

### Defining required attributes on the nodes, enclosure managers, and switches

In this example, we have 4 ThinkSystem SD530 servers in an enclosure.  That enclosure 
has a management port plugged into a switch called `r8e1` on port 8.

First we set the enclosure attributes on the nodes:

    nodeattrib n1-n4 enclosure.manager=enc1 enclosure.bay=8
    
We then make sure the enclosure manager is a node and configure the location of
it's switch port:

    nodeattrib enc1 net.switch=8 net.switch=r8e1
    
By default, confluent will assume it can use SNMPv1/v2c, community string `public`
to communicate with the switch.  To use a different SNMP community string:

    confetty create /nodes/r8e1 secret.snmpcommunity=otherpublic

Or for SNMPv3:

    confetty create /nodes/r8e1 secret.hardwaremanagementuser=snmpv3user secret.hardwaremanagementpassword=snmpv3password

### Following the automatic discovery process

The automatic process can be followed by examining `/var/log/confluent/events`.
For example:

    May 25 16:28:25 {"info": "Discovered n1 (XCC)"} 
    May 25 16:28:37 {"info": "Discovered n4 (XCC)"}
    May 25 16:28:38 {"info": "Discovered n2 (XCC)"} 
    May 25 16:28:40 {"info": "Discovered n3 (XCC)"}
    
### Resetting discovery process for nodes

If the wiring or configuration of set of nodes was incorrect at time of discovery,
the situation can be corrected through resetting the discovery process for the nodes.  This can be done by clearing the `pubkeys.tls_hardwaremanager` attribute:

    nodeattrib n1-n4 pubkeys.tls_hardwaremanager=
    
This can be combined with a configuration change.  For example, if we decide that the previous scheme of 10.2.3.{n1} really should be 10.2.4.{n1}:

    nodeattrib n1-n42 hardwaremanagement.manager=10.2.4.{n1} pubkeys.tls_hardwaremanager=

This will change the desired ip address and reset the discovery process for those nodes
to apply the requested change.

## Manual discovery
