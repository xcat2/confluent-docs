---
title: Manual for nodedeploy
---

nodedeploy(8) -- Request preparation and/or initiating a node deployment
=========================================================================

## SYNOPSIS

`nodedeploy [-h] [-c] [-n] [-p] [-m MAXNODES] <var>noderange</var> [profile]`  

## DESCRIPTION

**nodedeploy** configures attributes and interacts with BMC devices as appropriate
to change the operating system on the noderange to that indicated by `profile`. Tab completion
is supported under bash to help list and select a profile name. `-n` indicates that it
will be a network based deployment (either HTTP or PXE) and `-p` suppresses any activity
that requires the BMC (e.g. setting the next boot device and rebooting the system). Currently
**nodedeploy** only supports `-n` style deployment flows. Without options it shows the current
deployment status.

## OPTIONS

* `-c`, `--clear`:
  Remove any pending deployment action

* `-n`, `--network`:
  Prepare for either an HTTP or PXE based deployment, setting boot device to network and rebooting unless `-p` is specified.

* `-p`, `--prepareonly`:
  Prepare the network services for deployment, but do not interact with BMCs. This is intended for scenarios where
  the boot device control and server restart will be handled outside of confluent.
  
* `-m MAXNODES`, `--maxnodes=MAXNODES`: 
  Specifiy a maximum nodes to be deployed.
  
* `-h`, `--help`:
  Show help message and exit  

## EXAMPLES
* Begin the instalalation of a profile of CentOS 8.2:  
   `# nodedeploy d4 -n centos-8.2-x86_64-default`  
   `d4: network`  
   `d4: reset`  

* Check current deployment state of nodes:
  `# nodedeploy d4`  
  `d4: pending: centos-8.2-x86_64-default (node authentication armed)`  




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
