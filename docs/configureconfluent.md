---
layout: page
title: Configuring confluent
permalink: /documentation/configconfluent.html
---

If you are using an xCAT environment, see the `makeconfluentcfg` command for populating
confluent configuration based on xCAT configuration.  This should handle full confluent
configuration needs.  This document is more applicable to users working with confluent
standalone.


In confluent, configuration is organized as attributes on nodes.  The 
attributes may be directly configured on a node or inherited from a group.
Values may be a straightforward string or an expression as documented in 
the [attribute expressions]({{ site.baseurl }}/documentation/attributeexpressions.html)
documentation.

To get started, it is suggested to use the `everything` group to set universal attributes.
Usually a cluster uses the same username/password across the IMMs.  In such a case, it is
suggested to set this data as attributes on the `everything` group:

	confetty set /nodegroups/everything/attributes/current secret.hardwaremanagementuser=immusername secret.hardwaremanagementpassword=immpassword console.method=ipmi

From there, adding a specific node using values from the group `everything` combined with node specific attributes could involve the following:

	confetty create /nodes/n3 hardwaremanagement.manager=n3-imm

Note that a complete list of attributes that may be set can be found  in [Node attributes]({{ site.baseurl }}/documentation/nodeattributes.html)


Another common task is to create a custom group, with particular meaning to a specific environment.  For example:

	confetty create /nodegroups/rack1 location.rack=1
	confetty create /nodegroups/compute hardwaremanagement.manager={nodename}-imm

These groups, like the `everything` group can hold any attribute, and may also use expressions or normal values.  The process to create a node can include these groups:

	confetty create /nodes/n1 groups=rack1,compute

At which point, `n1` has location and IMM address configured just by virtue of the nodes it was assigned to.  Note that membership in
the `everything` group is automatic, even if not listed in the groups for a node to be in, it will nevertheless land in that group.

For information on using confluent to aid in autoconfiguration and mac address collection (whether automatic or manual), see [Node discovery and autoconfiguration with confluent]({{ site.baseurl }}/documentation/confluentdisco.html).

