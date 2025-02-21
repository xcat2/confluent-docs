---
title: Manual for confluent2hosts
---

confluent2hosts(8) -- Generate /etc/hosts entries for nodes
========================================================

## SYNOPSIS

`confluent2hosts -i <var>ip expression</var> -n <var>name expression</var> <var>noderange</var>`  
`confluent2hosts -a <var>noderange</var>`  

## DESCRIPTION

`confluent2hosts` can be used to help generate /etc/hosts entries for a 
noderange.  There are two general approaches.

It can be used ad-hoc, using -i and -n to specify the address and name portions respectively.  This accepts the standard confluent expression syntax, allowing for things like 172.30.1.{n1} or {node}.{dns.domain} or {bmc}.

It can also read from the confluent db, using `-a`.  In this mode, each net.<var>value</var>.<var>attribute</var> group is pulled together into hosts lines.  ipv4_address and ipv6_address fields are associated with the corresponding hostname attributes.

## EXAMPLES

* Generate /etc/hosts entries ad-hoc using default name:
  `# confluent2hosts -i 10.2.3.{n1} d9-d12`  

* Generate /etc/hosts entries ad-hoc using alternative name:
  `# confluent2hosts -i 10.2.3.{n1} -n "{node}-alt {node}-alt.{dns.domain}" d9-d12`  

* Generate /etc/hosts entries using the confluent DB as a reference:
  `# confluent2hosts -a d9-d12`  



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
