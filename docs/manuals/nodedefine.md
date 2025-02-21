---
title: Manual for nodedefine
---

nodedefine(8) -- Define new confluent nodes
===================================================================

## SYNOPSIS

`nodedefine <var>noderange</var> [nodeattribute1=value1> <var>nodeattribute2=value2</var> ...]`  

## DESCRIPTION

`nodedefine` allows the definition of new nodes for the confluent management
system.  It has the same syntax as `nodeattrib(8)`, and the commands differ in
that `nodeattrib(8)` will error if a node does not exist.

## EXAMPLES

* Define two racks of nodes, named r{rack}u{u}:
    `# nodedefine r1u1-r2u4`  
    `r1u4: created`  
    `r1u1: created`  
    `r1u2: created`  
    `r1u3: created`  
    `r2u4: created`  
    `r2u3: created`  
    `r2u2: created`  
    `r2u1: created`  

## SEE ALSO

noderange(5), nodeattribexpressions(8)


[SYNOPSIS]: #SYNOPSIS "SYNOPSIS"
[DESCRIPTION]: #DESCRIPTION "DESCRIPTION"
[EXAMPLES]: #EXAMPLES "EXAMPLES"
[SEE ALSO]: #SEE-ALSO "SEE ALSO"


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
