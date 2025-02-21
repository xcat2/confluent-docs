---
title: Manual for nodeeventlog
---

nodeeventlog(8) -- Pull eventlog from confluent nodes
============================================================

## SYNOPSIS

`nodeeventlog [options] <var>noderange</var> [clear]`  

## DESCRIPTION

`nodeeventlog` pulls and optionally clears the event log from the requested
noderange.

## OPTIONS

* `-m MAXNODES`, `--maxnodes=MAXNODES`:
  Specify a maximum number of nodes to clear if clearing log, prompting if 
  over the threshold 

* `-l LINES`, `--lines=LINES`:
    return the last <var>n</var> entries for each node in the eventlog. 

* `-t TIMEFRAME`, `--timeframe=TIMEFRAME`:
   return entries within a specified timeframe for each node's event log. 
   This will return entries from the last <var>n</var> hours or days. 1h would be 
   entries from with the last one hour. 
                           
  
* `-h`, `--help`:
  Show help message and exit  

## EXAMPLES
* Pull the event log from n2 and n3:
  `# nodeeventlog n2,n3`  
  `n2: 05/03/2017 11:44:25 Event Log Disabled - SEL Fullness - Log clear`  
  `n2: 05/03/2017 11:44:56 System Firmware - Progress - Unspecified`  
  `n3: 05/03/2017 11:44:39 Event Log Disabled - SEL Fullness - Log clear`  
  `n3: 05/03/2017 11:45:00 System Firmware - Progress - Unspecified`  
  `n3: 05/03/2017 11:47:22 System Firmware - Progress - Starting OS boot`  

* Pull and clear the event log from n2 and n3:
`# nodeeventlog n2,n3 clear`  
`n2: 05/03/2017 11:44:25 Event Log Disabled - SEL Fullness - Log clear`  
`n2: 05/03/2017 11:44:56 System Firmware - Progress - Unspecified`  
`n2: 05/03/2017 11:48:29 System Firmware - Progress - Starting OS boot`  
`n3: 05/03/2017 11:44:39 Event Log Disabled - SEL Fullness - Log clear`  
`n3: 05/03/2017 11:45:00 System Firmware - Progress - Unspecified`  
`n3: 05/03/2017 11:47:22 System Firmware - Progress - Starting OS boot`  
`# nodeeventlog n2,n3`  
`n2: 05/03/2017 11:48:48 Event Log Disabled - SEL Fullness - Log clear`  
`n3: 05/03/2017 11:48:52 Event Log Disabled - SEL Fullness - Log clear`  


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
