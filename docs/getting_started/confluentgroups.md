---
layout: page
title: Confluent Groups
permalink: /documentation/confluentgroups.html
---

In confluent, there is a concept of node groups to provide convenient shorthand for noderanges as well as 
a way to group attributes together.  This may be ignored and everything be individually managed directly,
but the groups may provide for easier configuration management at larger scale of components.

# Use in noderanges

Node groups can be used the same as nodes in [noderange syntax]({{ site.baseurl }}/documentation/noderange.html).  

Additionally, a group can be used to be shorthand for a noderange.  For example, to make a group `all` to represent every node
excluding `switches` and `pdus`, without having to continually update the `all` group as nodes are added or removed:

    nodegroupdefine all noderange=everything,-switches,-pdus

Note that `noderange` groups do not contribute to providing attributes to the node attributes.

# Attribute inheritence

Attributes on a group will flow into specific node attributes.  A node may inherit attributes from multiple groups at the same time.  If a node is in multiple groups, and more than one group offers an attribute value, the highest priority group overrides the lower priority group.  Priority proceeds from the first listed group to last group for highest to lower priority when looking at the `groups` attribute on a node.  Attributes defined on a node specifically will always supersede anything from groups.  A
large number of attributes require individual values, but proceed in a predictable fashion.  These may be defined on a group level, leveraging [attribute expressions]({{site.baseurl}}/documentation/attributeexpressions.html) to individualize the
group setting accordingly.

# Using `nodeattrib` versus `nodegroupattrib`

A point of confusion is using `nodeattrib [group] [attribute]=[value]` versus `nodegroupattrib [group] [attribute]=[value]`.
The `nodeattrib [group]` command sets attributes individually on every *current* member of [group].  This means that the attribute will override anything from groups, even if there's a higher priority group.  It means that the attribute will not be set
on future members of the group, as it wasn't targeted by nodeattrib.  The `nodegroupattrib` command specifically ensures the attribute is set on the group.  It will avoid overriding higher priority groups and it will be inherited as appropriate on any
future nodes added to the group going forward.

# The `everything` group

There is an implicit group called `everything`, intended to provide a shorthand in lieu of global settings.  Anything set
on a node can be set on `everything`, and attributes set on `everything` will be inherited by all nodes, unless the specific attribute is superseded by a higher priority group or the node itself.

# Bringing it together

Now a sample will be presented leveraging groups to define a representative configuration.

First will set the 'global' username and password that is preferred in this site.  This will use the interactive prompt to
keep the values out of the shell history and ps output for other users.

    # nodegroupattrib everything -p secret.hardwaremanagementuser secret.hardwaremanagementpassword
    Enter value for secret.hardwaremanagementuser:
    Confirm value for secret.hardwaremanagementuser:
    Enter value for secret.hardwaremanagementpassword:
    Confirm value for secret.hardwaremanagementpassword:
    everything: secret.hardwaremanagementpassword: ********
    everything: secret.hardwaremanagementuser: ********

A group will be created to explain the configurations naming scheme and how it influences network connectivity:

    # nodegroupdefine rackmount location.rack={n1} location.u={n2} \
      net.switch=r{location.rack}eth net.switchport=swp{location.u} \
      discovery.nodeconfig=bmc.ipv4_address=172.30.{location.rack}.{location.u} \
      discovery.policy=permissive \
      power.outlet='{(n2-1)%12+1}' power.pdu=r{n1}pdu'{(n2-1)/12+1}'

A group will be created to declare the method to manage how to manage pdus:

    # nodegroupdefine pdus hardwaremanagement.method=geist

A group to explain method to manage ethernet switches:

    # nodegroupdefine switches hardwaremanagement.method=affluent

A group to have a shorthand for all server devices excluding infrastructure equipment when using noderanges:

    # nodegroupdefine all noderange=everything,-pdus,-switches

Then define nodes according to what is expected for an eight rack configuration with 42 1U servers each:

    # nodedefine r[1:8]eth groups=switches
    # nodedefine r[1:8]pdu[1:4] groups=pdus
    # nodedefine r[1:8]u[1:42] groups=rackmount

With this in place, `nodeattrib --blame` can be used to see the results of the sequence of commands:

    # nodeattrib r3u32 --blame
    r3u32: discovery.nodeconfig: bmc.ipv4_address=172.30.3.32 (inherited from group rackmount, derived from expression "bmc.ipv4_address=172.30.{location.rack}.{location.u}")
    r3u32: discovery.policy: permissive (inherited from group rackmount)
    r3u32: groups: rackmount,everything
    r3u32: location.rack: 3 (inherited from group rackmount, derived from expression "{n1}")
    r3u32: location.u: 32 (inherited from group rackmount, derived from expression "{n2}")
    r3u32: net.switch: r3eth (inherited from group rackmount, derived from expression "r{location.rack}eth")
    r3u32: net.switchport: swp32 (inherited from group rackmount, derived from expression "swp{location.u}")
    r3u32: power.outlet: 8 (inherited from group rackmount, derived from expression "{(n2-1)%12+1}")
    r3u32: power.pdu: r3pdu3 (inherited from group rackmount, derived from expression "r{n1}pdu{(n2-1)/12+1}")
    r3u32: secret.hardwaremanagementpassword: ******** (inherited from group everything)
    r3u32: secret.hardwaremanagementuser: ******** (inherited from group everything)


