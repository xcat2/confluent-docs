---
layout: page
title: Node discovery and autoconfiguration with confluent
permalink: /documentation/confluentdisco.html
---

While it is possible to use confluent by directly specifying the pre-configured 
address, username, and password of a BMC, confluent also has the ability to 
automate the deployment of configuration of Integrated Management Module
and xClarity Controller devices without knowing the addresses ahead of time.
It is even possible to avoid ever provisioning a viable network configuration
at all.

For optimal results, the confluent server should be on the same network as
the management ports.  Additionally, it is more robust if IPv6 is enabled,
though no IPv6 addresses need to be configured (it can use the fe80::
 addresseses that appear by default on network interfaces). Also, the general default
configuration for Lenovo servers is to only have the dedicated management port
enabled. As such, servers wired such that only the interface available to the OS
is available will be unlikely to complete this procedure.


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

### Using the `nodediscover` command

The `nodediscover` command is intended to aid in exploring available endpoints
that may be discovered:

```
# nodediscover  list
           Node|          Model|         Serial|                                UUID|      Mac Address|        Type|                            Current IP Addresses
---------------|---------------|---------------|------------------------------------|-----------------|------------|------------------------------------------------
               |        5462AC1|        E2YV870|15e55533-8f37-300f-a5f6-f4954e1fec66|08:94:ef:00:f5:0d| lenovo-imm2|      10.240.38.58,fe80::a94:efff:fe00:f50d%eth0
               |        8869AC1|        J110D40|89fdadbc-3d0c-11e6-b9fa-0894ef1b4ed7|08:94:ef:1b:4e:dc| lenovo-imm2|     10.240.38.193,fe80::a94:efff:fe1b:4edc%eth0
               |        8869AC1|        J10VEKX|8be3221c-49e9-11e6-a963-0894ef222409|08:94:ef:22:24:0e| lenovo-imm2|                                   10.240.37.211
               |               |               |4980a05b-f2ec-e611-86af-c3c7e68a9e00|08:94:ef:3b:de:d4|  lenovo-smm|       172.30.33.1,fe80::a94:efff:fe3b:ded4%eth1
               |     7X07CTO1WW|       J30002HG|2b44751a-3481-11e7-bc9b-0a94ef3c8185|08:94:ef:3c:81:83|  lenovo-xcc|    172.30.254.244,fe80::a94:efff:fe3c:8183%eth1
               |     7X2104Z000|       DEV00003|cc099cf9-f9a5-11e6-84c7-db06face6280|08:94:ef:3f:e0:af|  lenovo-xcc|    172.30.254.193,fe80::a94:efff:fe3f:e0af%eth1
               |     7X2104Z000|       DEV00001|00b043c4-029b-11e7-ad41-c7027e3a94d2|08:94:ef:40:87:21|  lenovo-xcc|    172.30.254.251,fe80::a94:efff:fe40:8721%eth1
               |     7X2104Z000|       DEV00002|78b36a03-0356-11e7-9043-a5a2961a0e5c|08:94:ef:40:89:31|  lenovo-xcc|       172.30.34.2,fe80::a94:efff:fe40:8931%eth1
               |     7X2104Z000|       DEV00001|00b043c4-029b-11e7-ad41-c7027e3a94d2|08:94:ef:40:8a:96|  pxe-client|                                                
               |     7X2104Z000|       DEV00004|58962b3d-088b-11e7-b8b8-9e59e5cf61db|08:94:ef:41:01:b5|  lenovo-xcc|        172.30.92.4,fe80::a94:efff:fe41:1b5%eth1
               |     7X18CTO1WW|       J30007Y4|4dce618a-82f5-11e7-badd-0a94ef4a132f|08:94:ef:4a:13:2d|  lenovo-xcc|       172.30.78.2,fe80::a94:efff:fe4a:132d%eth1
```

Note in the above we have examples of Integrated Management Module 2, xClarity Controller, D2 SMM, and PXE client.  Also note that
it recognizes the relationship between a pxe-client and the managing xcc.

#### Assigning from a spreadsheet (.csv) based on serial numbers

One common scenario is having a spreadsheet of desired configuration together with the serial number.  To do this, create a csv file with
a header describing the available data followed by records to import.  For example:

```
node,serial,bmc,bmcuser,bmcpass
r1,J30002HG,172.30.30.1,admin,Passw0rd12
r2,J30007Y4,172.30.30.2,admin,Passw0rd12
```

Then use the `nodediscover assign` command to deploy the requested configuration:

```
# nodediscover assign -i serials.csv 
Defined r1
Discovered r1
Defined r2
Discovered r2
```

At this point, the systems are ready for management:

```
# nodehealth everything|collate
====================================
r1,r2
====================================
ok
```

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


You may also use this to get the mac addresses from an ethernet port, if you do not know the mac address:

```
/ -> show /networking/macs/by-switch/r8e1/by-port/Ethernet13/by-mac
08-94-ef-41-01-f0
```

This can help provide additional context to a mac address observed in `nodediscover`
or to debug or help formulate a way to use [automatic discovery](#automatic-discovery).

## Automatic discovery

As a prelude for automatic discovery, first define the node using the values
that it should be configured with at the end, regardless of current configuration.
For example, we will define 42 nodes (`n1` through `n42`) that upon completion should have an
xClarity Controller with the address '10.2.3.(node number)', the username `admin`, and the
password `Passw0rd12`.  Here we will use a group to hold the patterns and just define the nodes
with just the single group membership:

    nodegroupdefine compute bmc=10.2.3.{n1} bmcuser=admin bmcpass=$YOURPASS
    nodedefine n1-n42 groups=compute

If no value is provided for `bmc` it will not try to program IPv4 addresses, but will instead collect fe80:: ip addresses.  This is
useful to have confluent commands work regardless of IPv4 misconfiguration, but may not be obvious to all users.
If using xCAT's `makeconfluentcfg` and you want to mandate IPv4 configuration rather than configuring confluent directly, ensure that `ipmi.bmc` is set on nodes in xCAT.
This is normally a natural thing to do, but might not be done for certain nodes like ThinkSystem D2 SMMs.

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

    nodedefine r8e1 secret.snmpcommunity=otherpublic

Or for SNMPv3:

    nodedefine r8e1 secret.hardwaremanagementuser=snmpv3user secret.hardwaremanagementpassword=snmpv3password

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
