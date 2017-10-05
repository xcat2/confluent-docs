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
the management ports.  Additionally, it is more robust if IPv6 is enabled,
though no IPv6 addresses need to be configured (it can use the fe80:: addresseses that appear by default on network interfaces). Also, the general default
configuration for Lenovo servers is to only have the dedicated management port
enabled.  As such, a server without the management port wired is likely to not
complete the discovery process.

As a prelude for discovering a node, first define the node using the values
that it should be configured with at the end, regardless of current configuration.
For example, we will define 42 nodes (`n1` through `n42`) that upon completion should have an
xClarity Controller with the address '10.2.3.(node number)', the username `admin`, and the
password `Passw0rd12`:

    confetty create /noderange/n1-n42 hardwaremanagement.manager=10.2.3.{n1} secret.hardwaremanagementuser=admin secret.hardwaremanagementpassword=Passw0rd12

If the hardwaremanagement.manager value is not provided, it will attempt to instead collect fe80:: ip addresses.  As a consequence,
if using xCAT and makeconfluentcfg rather than configuring confluent directly, ensure that `ipmi.bmc` is set on nodes in xCAT if you
want to force IPv4 configuration down.

With the node definition complete, discovery can now be approached in one of two ways, [automatic](#automatic-discovery)
or [manual](#manual-discovery).  The automatic approach is good for environments that have a well defined map
of servers or server enclosures to ethernet switch ports, and the manual approach
is good for scenarios like matching nodes up by serial numbers or having a small number of
servers to configure or replacing a server or system board.

## Following the discovery process

Discovery can be followed by examining `/var/log/confluent/events`, Using `tail -f` for example:

    May 25 16:28:25 {"info": "Discovered n1 (XCC)"} 
    May 25 16:28:37 {"info": "Discovered n4 (XCC)"}
    May 25 16:28:38 {"info": "Discovered n2 (XCC)"} 
    May 25 16:28:40 {"info": "Discovered n3 (XCC)"}
    

## Manual discovery

Manual discovery provides a more interactive approach to deploying systems.
This can also aid in debugging attempts at setting up automatic discovery, or
repairing the discovery state of a few miswired or misconfigured systems in an
otherwise automatic, but locked down discovery configuration.

### Exploring `/discovery`

The view of elements of the network as viewed by confluent in the context of
discovery can be viewed using `confetty`.  Any command samples in this document
featuring `->` in the prompt represents commands ran from the interactive mode 
of confetty accessed by simply typing `confetty`:

    # confetty
    / ->
    
`/discovery` can be examined much like a directory in `/proc` or `/sys`, and 
tab completion will function:

    /discovery/ -> cd /discovery/by-
    by-mac/     by-model/   by-node/    by-serial/  by-state/   by-type/    
    /discovery/ -> cd /discovery/by-

The various criteria can be mixed and matched to narrow down a search:

    / -> show discovery/by-model/5463AC1/by-serial/06
    06BFWCC/  06DPMDF/  
    / -> show discovery/by-model/5463AC1/by-serial/06DPMDF/by-mac/40-f2-e9-b9-10-1d
    nodename: 
    ipaddrs=[
     "fe80::42f2:e9ff:feb9:101d%eth1", 
     "172.30.254.62"
    ]
    serialnumber: 06DPMDF
    modelnumber: 5463AC1
    macs=[
     "40:f2:e9:b9:10:1d"
    ]
    types=[
     "lenovo-imm2"
    ]
    / -> 

### Using `/networking/macs`

If there are switches defined, their mac address tables can be navigated through the `/networking/macs` interface.  Using the mac address example from above:

    / -> show /networking/macs/by-mac/40-f2-e9-b9-10-1d
    possiblenode=""
    mac: 40:f2:e9:b9:10:1d
    ports=[
     {
      "switch": "r8e1", 
      "macsonport": 1, 
      "port": "Ethernet28"
     }
    ]
    / -> 

This can help provide additional context to a mac address observed in `/discovery`,
or to debug or help formulate a way to use [automatic discovery](#automatic-discovery).

### Assigning a node

Once the identity of a node is determined, it can be manually assigned.  In this
case, the desired node that correlates to that mac address is r2.  We use `set` in the 
`confetty` interface to make the change.  We can operate against any location the mac address is seen:

    / -> set /discovery/by-model/5463AC1/by-serial/06DPMDF/by-mac/40-f2-e9-b9-10-1d node=r2
    assigned: r2

Is the same as:

    / -> set /discovery/by-mac/40-f2-e9-b9-10-1d node=r2
    assigned: r2

This will kick off the process to automatically configure r2.  The node may take a moment to configure, but it should soon be possible to verify that the node discovered:

    / -> show /nodes/r2/power/state
    state="on"

## Automatic discovery

### Selecting a discovery policy

The first step is to opt into an automatic discovery policy.  There are three
policies:

* `manual` disables automatic discovery, this is the default behavior.
* `open` will always allow a candidate node to be configured as the actual node, regardless of current certificate.  This allows the most hands off automation
in the face of actions such as replacing a server or system board, but if an attacker can spoof the mac address of a valid management device they could use the discovery process to get the username and password intended for a management device as well as install a certificate
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

In this example, we have [4 ThinkSystem SD530 servers in a D2 enclosure](http://www3.lenovo.com/us/en/data-center/servers/high-density/Lenovo-ThinkSystem-SD530/p/77XX7DSSD53).  That enclosure 
has a management port plugged into a switch called `r8e1` on port 8.

First we set the enclosure attributes on the nodes:

    nodeattrib n1-n4 enclosure.manager=enc1 enclosure.bay={n1}
    
We then make sure the enclosure manager is a node and configure the location of
it's switch port:

    nodeattrib enc1 net.switchport=8 net.switch=r8e1
    
By default, confluent will assume it can use SNMPv1/v2c, community string `public`
to communicate with the switch.  To use a different SNMP community string:

    confetty create /nodes/r8e1 secret.snmpcommunity=otherpublic

Or for SNMPv3:

    confetty create /nodes/r8e1 secret.hardwaremanagementuser=snmpv3user secret.hardwaremanagementpassword=snmpv3password

In the event of a rackmount system, such as the [Thinksystem SD650](http://www3.lenovo.com/us/en/data-center/servers/racks/Lenovo-ThinkSystem-SR650/p/77XX7SRSR65),
simply assign net attributes directly to the node:

    nodeattrib n1-n20 net.switchport={n1} net.switch=r8e1


### Resetting automatic discovery process for nodes

If the wiring or configuration of set of nodes was incorrect at time of discovery,
the situation can be corrected by doing [manual discovery](#manual-discovery) or by resetting the discovery process for the nodes.  Resetting the automatic discovery process can be done by clearing the `pubkeys.tls_hardwaremanager` attribute:

    nodeattrib n1-n4 pubkeys.tls_hardwaremanager=
    
This can be combined with a configuration change.  For example, if we decide that the previous scheme of 10.2.3.{n1} really should be 10.2.4.{n1}:

    nodeattrib n1-n42 hardwaremanagement.manager=10.2.4.{n1} pubkeys.tls_hardwaremanager=

This will change the desired ip address and reset the discovery process for those nodes
to apply the requested change.
