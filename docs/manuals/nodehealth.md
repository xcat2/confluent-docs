---
title: Manual for nodehealth
---

nodehealth(8) -- Show health summary of confluent nodes
========================================================

## SYNOPSIS

`nodehealth <var>noderange</var>`  

## DESCRIPTION

`nodehealth` reports the current health assessment of a confluent node.  It
will report either `ok`, `warning`, `critical`, or `failed`, along with
a string explaining the reason for any result other than `ok`.

## EXAMPLES

* Pull health summary of 5 nodes:
  `# nodehealth n1-n4,r1`  
  `n1: critical (Mezz Exp 2 Fault:Critical)`  
  `n3: ok`  
  `n2: ok`  
  `r1: ok`  
  `n4: ok`


[SYNOPSIS]: #SYNOPSIS "SYNOPSIS"
[DESCRIPTION]: #DESCRIPTION "DESCRIPTION"
[EXAMPLES]: #EXAMPLES "EXAMPLES"


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
