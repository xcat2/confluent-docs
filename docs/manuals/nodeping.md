---
title: Manual for nodeping
---

nodeping(8) -- Pings a node or a noderange.
==============================
## SYNOPSIS
`nodeping [options] noderange`  

## DESCRIPTION  
**nodeping** is a command that pings the default NIC on a node.
It can also be used with the `-s` flag to change the ping location to something that is 'non primary'


## OPTIONS
* ` -f` COUNT, `-c` COUNT, --count=COUNT  
   Number of commands to run at a time  
* `-h`, `--help`:  
  Show help message and exit      
* `-s` SUBSTITUTENAME, --substitutename=SUBSTITUTENAME  
  Use a different name other than the nodename for ping. This may be a 
  expression, such as {bmc} or, if no { character is present, it is treated as a suffix.  -s -eth1 would make n1 become n1-eth1, for example. 

   
## EXAMPLES
 * Pinging a node :  
  `# nodeping <var>node</var>`  
  `node : ping`    
    
* Pinging a group:  
  `# nodeping <var>groupname</var>`    
  `Node1 : ping  
    Node2 : ping  
    Node3 : ping`  

* Pinging BMC on a node:  
  `# nodeping -s {bmc} <var>noderange</var>`  
  ` Node-bmc : ping`  

* Pinging by specifying a suffix:
  `# nodeping d1-d4 -s -eth1`  
  `d2-eth1: no_ping`  
  `d1-eth1: no_ping`  
  `d3-eth1: no_ping`  
  `d4-eth1: no_ping`  

* Fail to ping node:  
  `# nodeping <var>node</var>`  
  `node : no_ping`  
 



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
