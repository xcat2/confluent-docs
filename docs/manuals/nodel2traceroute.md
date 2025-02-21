---
title: Manual for nodel2traceroute
---

nodel2traceroute(8) -- returns the layer 2 route through an Ethernet network managed by confluent given 2 end points.
==============================
## SYNOPSIS
`nodel2traceroute [options] <var>start_node</var> <var>end_noderange</var>`  

## DESCRIPTION  
**nodel2traceroute** is a command that returns the layer 2 route for the configered interfaces in nodeattrib.
It can also be used with the -i and -e options to check against specific interfaces on the endpoints. If the 
--interface or --eface option are not used then the command will check for routes against all the defined 
interfaces in nodeattrib (net.*.switch) for the nodes.



## PREREQUISITES
**nodel2traceroute** the net.<var>interface</var>.switch attributes have to be set on the end points if endpoint is not a switch


## OPTIONS
* ` -e` EFACE, --eface=INTERFACE
   interface to check against for the second end point or end points if using checking against multiple nodes 
* ` -i` INTERFACE, --interface=INTERFACE
   interface to check against for the first end point  
* ` -c` CUMULUS, --cumulus=CUMULUS
   return layer 2 route through cumulus switches only 
* `-h`, `--help`:  
  Show help message and exit      

   
## EXAMPLES
 * Checking route between two nodes:  
  `# nodel2traceroute n244 n1851`  
  `n244 to n1851: ['switch114']`    
    
* Checking route from one node to multiple nodes:  
  `# nodel2traceroute n244 n1833,n1851`    
  `n244 to n1833: ['switch114', 'switch7', 'switch32', 'switch253', 'switch85', 'switch72', 'switch21', 'switch2', 'switch96', 'switch103', 'switch115']
   n244 to n1851: ['switch114']`  



 



[SYNOPSIS]: #SYNOPSIS "SYNOPSIS"
[DESCRIPTION]: #DESCRIPTION "DESCRIPTION"
[PREREQUISITES]: #PREREQUISITES "PREREQUISITES"
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
[nodel2traceroute(8)]: nodel2traceroute.html
