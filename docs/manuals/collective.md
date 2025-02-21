---
title: Manual for collective
---

collective(1) -- Check and manage a confluent collective
==============================

## SYNOPSIS

`collective invite <var>server</var>`  
`collective join <var>server</var> [-i TOKEN]`  
`collective show`  
`collective gencert`  
`collective delete`  


## DESCRIPTION

**collective** helps manage the collective mode of confluent, where multiple
confluent servers are linked together to act as one.  For example, the procedure to set up
a collective to run on three servers called mgt1, mgt2, and mgt3, first install and start
confluent as usual on the three servers.  On mgt1, run `collective invite mgt2` and an
invitation token will be output.  On mgt2, either run `collective join mgt1` to paste
the token interactively, or `collective join mgt1 -i <var>token</var>`.  At this point, either
mgt1 or mgt2 can bring in mgt3.  For example on mgt2 run `collective invite mgt3` and
on mgt3 run `collective join mgt2 -i <var>token</var>`

This can be linked together in the following manner with ssh:
on mgt1:
  `# ssh mgt2 collective join mgt1 -i $(collective invite mgt2)`

Note that a collective is only redundant with 3 or more members.  The collective
will function so long as more than half of the members are online.  A collective
of two members is supported, but without redundancy.

Also note that the collective leader role is dynamic, but has no impact on interacting
with confluent.  It is merely an internal role that can dynamically change depending
on circumstances.

## OPTIONS

 * `-i`:
    Provide the token as an argument rather than interactively.
    
* `-h`, `--help`:
  Show help message and exit    
   
## EXAMPLES
 * Inviting a server called mgt2:
  `# collective invite mgt2`  
  `bWd0MkA+BNQ6XAxMXlqJJa+EQRlihL/k9xCXnasgSQXZr989Pa1/ln7G3e1Ncxx6BMzMqqreHJVkPr2FrzjNit/UgHlg`  

* On mgt2, joining mgt1:
  `# collective join mgt1 -i bWd0MkA+BNQ6XAxMXlqJJa+EQRlihL/k9xCXnasgSQXZr989Pa1/ln7G3e1Ncxx6BMzMqqreHJVkPr2FrzjNit/UgHlg`  
  `Success`  

* Showing the collective state:
  `# collective show`  
  `Quorum: True`  
  `Leader: mgt1`  
  `Active collective members:`  
  `  mgt2`  



[SYNOPSIS]: #SYNOPSIS "SYNOPSIS"
[DESCRIPTION]: #DESCRIPTION "DESCRIPTION"
[OPTIONS]: #OPTIONS "OPTIONS"
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
