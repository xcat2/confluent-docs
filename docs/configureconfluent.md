---
layout: page
title: Configuring confluent
permalink: /documentation/configconfluent.html
---

If you wish to use xCAT to create the confluent configuration, see
[Configuring confluent from xCAT]({{site.baseurl}}/documentation/configconfluent_xcat.html)
The remainder of this document is more applicable to users working with confluent
standalone.


In confluent, configuration is organized as attributes on nodes.  The 
attributes may be directly configured on a node or inherited from a group.
Values may be a straightforward string or an expression as documented in 
the [attribute expressions]({{ site.baseurl }}/documentation/attributeexpressions.html)
documentation.

To get started, it is suggested to use the `everything` group to set universal attributes.
Usually a cluster uses the same username/password across the IMMs.  In such a case, it is
suggested to set this data as attributes on the `everything` group:

	nodegroupattrib everything bmcuser=USERID bmcpass=$YOURPASSWORD console.method=ipmi

If wanting to use the autodiscovery features, you may wish to opt into the less strict discovery policy `permissive,pxe`.  The `permissive` policy
instructs confluent to take a node discovery at face value if there is no known TLS certificate.  Adding `,pxe` further relaxes the policy to allow
MAC and UUID gathering from PXE requests, but does not allow replacing out of band devices that conflict weth stored TLS certificates as `open` would:

	nodegroupattrib everything discovery.policy=permissive,pxe

From there, adding a specific node using values from the group `everything` combined with node specific attributes could involve the following:

	nodedefine n3 bmc=n3-imm

Note that a complete list of attributes that may be set can be found  in [Node attributes]({{ site.baseurl }}/documentation/nodeattributes.html)

Another common task is to create a custom group, with particular meaning to a specific environment.  For example:

	nodegroupdefine rack1 location.rack=1
	nodegroupdefine compute bmc={nodename}-imm

These groups, like the `everything` group can hold any attribute, and may also use expressions or normal values.  The process to create a node can include these groups:

	nodedefine n1 groups=rack1,compute

At which point, `n1` has location and IMM address configured just by virtue of the nodes it was assigned to.  Note that membership in
the `everything` group is automatic, even if not listed in the groups for a node to be in, it will nevertheless be considered a member of that group.

For information on using confluent to aid in autoconfiguration and mac address collection (whether automatic or manual), see [Node discovery and autoconfiguration with confluent]({{ site.baseurl }}/documentation/confluentdisco.html).

