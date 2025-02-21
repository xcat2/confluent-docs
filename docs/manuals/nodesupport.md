---
title: Manual for nodesupport
---

nodesupport(8) -- Utilities for interacting with vendor support
=================================================================

## SYNOPSIS

`nodesupport <var>noderange</var> servicedata <var>directory or filename</var>`  

## DESCRIPTION

`nodesupport` provides capabilities associated with interacting with support.
Currently it only has the `servicedata` subcommand.  `servicedata` takes
an argument that is either a directory name (that can be used for a single node
or multiple nodes) or a file name (only to be used with single node noderange).
Note that the file will be downloaded to the confluent server that actually
connects to the managed system, so it will download to the remote system if running
remotely and will download to the collective.manager indicated system if
running in collective mode.

Note that due to vendor filename requirements, any filename may have vendor
specific suffixes added to any file produced.

## OPTIONS

* `-m MAXNODES`, `--maxnodes=MAXNODES`:
  Specify a maximum number of nodes to download diagnostic data from, prompting
  if over the threshold
  
* `-h`, `--help`:
  Show help message and exit  

## EXAMPLES

* Download support data from a single node to a specific filename  
`# nodesupport d1 servicedata svcdata.out`  
`d1:initializing:  15%`  

* Download support data from multiple nodes to a directory  
`# nodesupport d1-d4 servicedata service/`    
`d1:initializing:   0% d2:initializing:   0% d3:initializing:   0% d4:initializing:   0%`  
`# ls service/`  
`d1.svcdata d2.svcdata  d3.svcdata  d4.svcdata`  


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
