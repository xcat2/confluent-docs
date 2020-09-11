---
layout: page
title: Using switch based discovery
permalink: /documentation/confluentswitchdisco.html
---

Confluent can identify unknown devices based on what network port they are connected to.

# SNMP
For many industry switches, standard SNMP mibs are supported (QBRIDGE, BRIDGE, IF) to get the information.  If wanting to use SNMPv1/SNMPv2c, use the
attribute 'secret.snmpcommunity' instead of `switchuser` and `switchpass` referenced below.

# Cumulus
For cumulus switches, install the affluent agent as documented in ['Using a Cumulus switch with confluent']({{site.baseurl}}/documentation/confluentcumulus.html)

# Adding the ethernet switch

Adding an ethernet switch is done simply by adding the IP or a name that resolves to the switch:

    # nodedefine r4e1 type=switch

If the username and password are not inherited from a group like everything, be sure to set the username and password:

    # nodeattrib r4e1 -p switchuser switchpass

With the switch added, run:

    # nodediscover rescan

Watching `/var/log/confluent/events` should indicate any problems that may be encountered.

With that, the `nodediscover` command now can present data about network connectivity:

    # nodediscover list -f model,serial,type,mac,switch,port -o port | grep -v lenovo-switch| head 
          Model|     Serial|          Type|               Mac| Switch|       Port
    -----------|-----------|--------------|------------------|-------|-----------
        5466AC1|    DVJICDA|   lenovo-imm2| 40:f2:e9:75:1f:bd|   r4e1| Ethernet14
        5463AC1|    DVJPDPM|   lenovo-imm2| 40:f2:e9:b9:10:1d|   r4e1| Ethernet17
        5462AC1|    DVJ3821|   lenovo-imm2| 40:f2:e9:af:45:a5|   r4e1| Ethernet27
     7Z01CTOLWW|   DVJ328J5|    lenovo-tsm| 3c:e1:a1:c7:ea:79|   r4e1| Ethernet29
     7Y0XCTOLWW|   DVJJ3891|    lenovo-tsm| 3c:e1:a1:c7:e6:27|   r4e1| Ethernet32
     7Y02CTOLWW|   DVJJ8699|    lenovo-xcc| 08:94:ef:49:c3:55|   r4e1| Ethernet34
     7X21CTOLWW|   DVJJ1086|    lenovo-xcc| 08:94:ef:2f:2e:9d|   r4e1| Ethernet35

The data can be used to guide a manual discovery, but nodes may also be defined to automatically configure devices based on
where they are plugged in. This can either be based on where the management controller is connected (recommended
for situtions where a port dedicated to management is connected) or the port that the system will be used
to execute a network boot (required for scenarios where the management controller will be shared with the
operating system). If using the network boot port, then discovery is delayed until PXE boot is attempted. For example,
here is a node that has a TSM connected to switch port 29 of a switch:

    # nodedefine example1 net.switch=r4e1 net.switchport=29 discovery.policy=permissive,pxe
    example1: created
    # nodediscover rescan
    Rescan complete

Results can be seen by following `/var/log/confluent/events` or by watching `nodediscover list`:

    # grep example1 /var/log/confluent/events
    Sep 02 13:53:51 {"info": "Discovered example1 (TSM)"}
    # nodediscover list -f node,model,serial,mac|egrep 'J100GZG5|Node|----'
         Node|      Model|     Serial|               Mac
    ---------|-----------|-----------|------------------
     example1| 7Z01CTO1WW|   J100GZG5| 3c:e1:a1:c7:ea:79

Once the node has reported as 'Discovered', commands may be run against the node:

    # nodehealth example1
    example1: ok

To scale out such a strategy to a structured environment easily, it makes sense to take advantage of the group inheritance
and formulaic expansion.  In this example, we will have a name scheme of r{rack}u{u in rack} and we will plug u1 into port 1, u 2 in port 2, and so on:

    # nodegroupdefine rackmount net.switch=r{n1}e1 net.switchport={n2}
    # nodedefine r4u29 groups=rackmount
    # nodeattrib r4u29 net.switch net.switchport --blame
    r4u29: net.switch: r4e1 (inherited from group rackmount, derived from expression "r{n1}e1")
    r4u29: net.switchport: 29 (inherited from group rackmount, derived from expression "{n2}")
    # nodediscover rescan
    Rescan complete

As above, after some time the node may be seen in nodediscover list or `/var/log/confluent/events`

    # nodediscover list -f node,model,serial,mac|egrep 'J100GZG5|Node|----'
      Node|      Model|     Serial|               Mac
    ------|-----------|-----------|------------------
     r4u29| 7Z01CTO1WW|   J100GZG5| 3c:e1:a1:c7:ea:79



    
