---
title: Manual for nodeapply
---

nodeapply(8) -- Execute command on many nodes in a noderange through ssh
=========================================================================

## SYNOPSIS

`nodeapply [options] <var>noderange</var>`

## DESCRIPTION

Provides shortcut access to a number of common operations against deployed
nodes.  These operations include refreshing ssh certificates and configuration,
rerunning syncflies, and executing specified postscripts.

## OPTIONS
  
* `-k`, `--security`
  Refresh SSH configuration (hosts.equiv and node SSH certificates)
  
* `-F`, `--sync`
  Rerun syncfiles from deployed profile
  
* `-P SCRIPTS`, `--scripts=SCRIPTS`
  Re-run specified scripts, with full path under scripts specified, e.g. post.d/scriptname,firstboot.d/otherscriptname
 
* `-c COUNT`, `-f COUNT`, `--count=COUNT`
  Specify the maximum number of instances to run concurrently

* `-m MAXNODES`, `--maxnodes=MAXNODES`
  Specify a maximum number of nodes to run remote ssh command to, prompting
  if over the threshold


[SYNOPSIS]: #SYNOPSIS "SYNOPSIS"
[DESCRIPTION]: #DESCRIPTION "DESCRIPTION"
[OPTIONS]: #OPTIONS "OPTIONS"


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
