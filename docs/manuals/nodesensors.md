---
title: Manual for nodesensors
---

nodesensors(8) --- Retrieve telemetry for sensors of confluent nodes
====================================================================

## SYNOPSIS

`nodesensors <var>noderange</var> [-c] [-i <var>interval</var>] [-n <var>samplecount</var>]  [<var>sensor name  or category</var>...]`  


## DESCRIPTION

**nodesensors** queries the confluent server to get telemetry from nodes.  Telemetry can include
data such as temperature, power, and so forth.  Without arguments, it lists all available sensors
and their current values.  If `-c` is specified, CSV format is used for output.  Normally
nodesensors outputs once and exits.  Repeated periodic gathering can be done with `-i` to specify
interval and `-n` to specify number of requests.  If `-i` is specified without `-n`, then it will
retrieve data at the requested interval indefinitely.  If '-n' is specified without `-i`, an
interval of 1 second is used.

## OPTIONS

* `-c`, `--csv`:
  Organize output into CSV format, one sensor per column.

* `-i`, `--interval`=**SECONDS**:
  Repeat data gathering waiting, waiting the specified time between samples.  Unless `-n` is
  specified, indefinite retrieval is assumed.

* `-n`, `--numreadings`=**SAMPLES**:
  Perform the specified number of readings, waiting `-i` indicated interval or 1 second if not
  otherwise indicated.

* `-s`, `--skipnumberless`:
  Return only sensors that provide numeric data (e.g. temperature, fanspeed),
  ignoring sensors that do not provide numeric data.

## EXAMPLES
* Retrieving all temperature related sensors from one system  
  `# nodesensors n1 temperature`  
  `n1: CPU 1 Overtemp: Ok`  
  `n1: CPU 2 Overtemp: Ok`  
  `n1: Inlet Temp: 16.0 °C`  
  `n1: PCH Overtemp: Ok`  
  `n1: LOM Temp: Ok`  

* Retrieving a sensor named "Inlet Temp" for 4 systems over a 3 second period of time:  
   `# nodesensors n1-n4 'Inlet Temp' -c -n 3`  
   `time,node,Inlet Temp (°C)`  
   `2016-10-04T15:09:20,n1,19.0`  
   `2016-10-04T15:09:20,n2,18.0`  
   `2016-10-04T15:09:20,n3,18.0`  
   `2016-10-04T15:09:20,n4,17.0`  
   `2016-10-04T15:09:21,n1,19.0`  
   `2016-10-04T15:09:21,n2,18.0`  
   `2016-10-04T15:09:21,n3,18.0`  
   `2016-10-04T15:09:21,n4,17.0`  
   `2016-10-04T15:09:22,n1,19.0`  
   `2016-10-04T15:09:22,n2,18.0`  
   `2016-10-04T15:09:22,n3,18.0`  
   `2016-10-04T15:09:22,n4,17.0`  


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
