---
layout: page
title: Configuring confluent
permalink: /documentation/configconfluent.html
---

## When used in conjunction with xCAT

If you wish to use xCAT to create the confluent configuration, see
[Configuring confluent from xCAT]({{site.baseurl}}/documentation/configconfluent_xcat.html)
The remainder of this document is mostly applicable to users working with confluent
standalone directly rather than using xCAT to configure.

## Using Confluent without xCAT

In confluent, configuration is organized as [attributes]({{site.baseurl}}/documentation/nodeattributes.html) on nodes.  The 
attributes may be directly configured on a node or inherited from a group.
Values may be a straightforward string or an expression as documented in 
the [attribute expressions]({{ site.baseurl }}/documentation/attributeexpressions.html)
documentation.

To get started, it is suggested to use the `everything` group to set universal attributes.
The `everything` group automatically exists and all defined nodes are automatically
placed into it, in addition to manually specified and created groups
Usually a cluster uses the same username/password across the XCCs (xClarity Controllers).  In such a case, it is
suggested to set this data as attributes on the `everything` group:

	nodegroupattrib everything console.method=ipmi
	nodegroupattrib everything -p bmcuser bmcpass

The `nodeattrib` and `nodegroupattrib` command can either accept key=value or -p key key format. The former allows fully non-interactive use, while the
latter prompts interactively to prevent the username and password from being inadvertently on screen or stored in your shell history.

From there, adding a specific node using values from the group `everything` combined with node specific attributes could involve the following:

	nodedefine n3 bmc=n3-xcc

Another common task is to create a custom group, with particular meaning to a specific environment.  For example, here is creating a custom group called `rack1` and
using the expression syntax to append '-xcc' to the end of the nodename to use as the XCC address:

	nodegroupdefine rack1 location.rack=1
	nodegroupdefine compute bmc={nodename}-xcc

These groups, like the `everything` group can hold any attribute, and may also use expressions or normal values.  The process to create a node can include these groups:

	nodedefine n1 groups=rack1,compute

At which point, `n1` has location and IMM address configured just by virtue of the nodes it was assigned to.  Note that membership in
the `everything` group is automatic, even if not listed in the groups for a node to be in, it will nevertheless be considered a member of that group.

At this point, there are a few alternative paths to proceed:

* Set up confluent to be able to deploy operating systems (recommended prior to autoconfiguration if planning for OS deployment using confluent): [Preparing for Operating System Deployment]({{site.baseurl}}/documentation/confluentosdeploy.html)
* Discovery is intended to help when IP addresses, usernames, and/or passwords are not configured yet. If these activities are otherwise handled in the environmennt, it is suggested to skip discovery and read: [Managing hardware using confluent]({{site.baseurl}}/documentation/manageconfluent.html)
* If the IP addresses, usernames, and/or passwords need to be configured and it is desired to use physical location of equipment as the key, see: [Using switch based discovery]({{site.baseurl}}/documentation/confluentswitchdisco.html)
* If the IP addresses, usernames, and/or passwords need to be configured and it is desired to either use serial numbers, mac addresses, or otherwise manually review the available data to proceed, see: [Using nodediscover assign]({{site.baseurl}}/documentation/confluentnodeassign.html)

For information on using confluent to aid in autoconfiguration and mac address collection (whether automatic or manual), see [Node discovery and autoconfiguration with confluent]({{ site.baseurl }}/documentation/confluentdisco.html).

