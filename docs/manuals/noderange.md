---
title: Manual for noderange
---

noderange(5) -- Indicate a target set of nodes in confluent
=========================================================

## SYNOPSIS

`<var>noderange</var>`  

## DESCRIPTION

<var>noderange</var> is a syntax that can be used in most Confluent commands to conveniently specify a list of nodes. The result is that the command will be applied to a range of nodes, often in parallel.

## EXAMPLES:

The simplest noderange is a single node name:
`n1`

Nodes and groups may be used interchangeably. The following may be used in any context where n1 would be accepted as a noderange:
`rack1`

Commonly, there is a desire to target a range of elements. There are a few identically behaving syntaxes for the purpose.
`n1:n20`
`n1-n20`
`n[1-20]`

Note that numbers may be zero padded or not, it will automatically detect the padding amount and adjust members of the range accordingly. Ranges also can understand multiple numeric values changing:
`r[1-3]u[01-10]`
`r1u01-r3u10`

Ranges can also be applied to group names, and all above syntaxes are compatible:
`rack1-rack10`
`rack[1-10]`

Also, regular expressions may be used to indicate nodes with names matching certain patterns:
`~r1u..`

The other major noderange primitive is indicating nodes by some attribute value:
`location.rack=7`

The attribute name may use a wildcard:
`net.*switch=switch1`

Commas can be used to indicate multiple nodes, and can mix and match any of the above primitives. The following can be a valid single noderange, combining any and all members of each comma separated component
`n1,n2,rack1,storage,location.rack=9,~s1..,n20-n30`

Exclusions can be done by prepending a '-' before a portion of a noderange:
`rack1,-n2`
`compute,-rack1`
`compute,-location.row=12`

To indicate nodes that match multiple selections at once (set intersection), the @ symbol may be used:
`compute@rack1`
`location.rack=10@compute`

For complex expressions, () may be used to indicate order of expanding the noderange to be explicit
`rack1,-(console.logging=full@compute)`

Noderange syntax can also indicate 'pagination', or separating the nodes into well defined chunks. > is used to indicate how many nodes to display at a time, and < is used to indicate how many nodes to skip into a noderange:
`rack1>3<6`

The above would show the seventh through ninth nodes of the rack1 group. Like all other noderange operations, this may be combined with any of the above, but must appear as the very last operation. Ordering is done with a natural sort.


[SYNOPSIS]: #SYNOPSIS "SYNOPSIS"
[DESCRIPTION]: #DESCRIPTION "DESCRIPTION"


[collate(1)]: collate.html
[collective(1)]: collective.html
[confetty(8)]: confetty.html
[confluent2hosts(8)]: confluent2hosts.html
[confluentdbutil(8)]: confluentdbutil.html
[confluent(8)]: confluent.html
[l2traceroute(8)]: l2traceroute.html
[nodeapply(8)]: nodeapply.html
[nodeattribexpressions(5)]: nodeattribexpressions.html
[nodeattrib(8)]: nodeattrib.html
[nodebmcpassword(8)]: nodebmcpassword.html
[nodebmcreset(8)]: nodebmcreset.html
[nodeboot(8)]: nodeboot.html
[nodeconfig(8)]: nodeconfig.html
[nodeconsole(8)]: nodeconsole.html
[nodedefine(8)]: nodedefine.html
[nodedeploy(8)]: nodedeploy.html
[nodediscover(8)]: nodediscover.html
[nodeeventlog(8)]: nodeeventlog.html
[nodefirmware(8)]: nodefirmware.html
[nodegroupattrib(8)]: nodegroupattrib.html
[nodegroupdefine(8)]: nodegroupdefine.html
[nodegrouplist(8)]: nodegrouplist.html
[nodegroupremove(8)]: nodegroupremove.html
[nodehealth(8)]: nodehealth.html
[nodeidentify(8)]: nodeidentify.html
[nodeinventory(8)]: nodeinventory.html
[nodelicense(8)]: nodelicense.html
[nodelist(8)]: nodelist.html
[nodemedia(8)]: nodemedia.html
[nodeping(8)]: nodeping.html
[nodepower(8)]: nodepower.html
[noderange(5)]: noderange.html
[noderemove(8)]: noderemove.html
[nodereseat(8)]: nodereseat.html
[nodersync(8)]: nodersync.html
[noderun(8)]: noderun.html
[nodesensors(8)]: nodesensors.html
[nodesetboot(8)]: nodesetboot.html
[nodeshell(8)]: nodeshell.html
[nodestorage(8)]: nodestorage.html
[nodesupport(8)]: nodesupport.html
[osdeploy(8)]: osdeploy.html
[stats(8)]: stats.html
