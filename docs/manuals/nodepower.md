---
title: Manual for nodepower
---

nodepower(8) -- Check or change power state of confluent nodes
=========================================================

## SYNOPSIS

`nodepower [options] <var>noderange</var> ([status|on|off|shutdown|boot|reset])`

## DESCRIPTION

**nodepower** with only a noderange will retrieve current power state of nodes
through confluent.  When given an additional argument, it will request a change
to the power state of the nodes.  The following arguments are recognized:

* `on`: Turn on the specified noderange.  Nothing will happen to nodes of
the noderange that are already on.
* `off`:  Immediately turn off the specified noderange, without waiting for OS
to shutdown.  Nothing will happen to nodes of the noderange that are already on.
* `boot`:  Immediately boot a system.  This will power on nodes of the noderange
that are off, and reset nodes of the noderange that are on.  The previous state
will be reflected in the output.
* `shutdown`:  Request the OS gracefully shut down.  Nothing will happen for
nodes that are off, and nodes will not shutdown if the OS fails to gracefully
respond.
* `reset`:  Request immediate reset of nodes of the noderange.  Nodes that are
off will not react to this request.
* `status`:  Behave identically to having no argument passed at all.
* `pdu_status`: Query state of associated PDU outlets, if configured.
* `pdu_on`: Energize all PDU outlets associated with the noderange.
* `pdu_off`: De-energize all PDU outlets associated with the noderange.

## OPTIONS

* `-p`, `--showprevious`:
   Show previous power state for all directives that may change power state.
   
* `-m MAXNODES`, `--maxnodes=MAXNODES`:
   Specify a maximum number of nodes to change power state, prompting if
   over the threshold
   
* `-h`, `--help`:
  Show help message and exit   

## EXAMPLES
* Get power state of nodes n1 through n4:
  `# nodepower n1-n4`  
  `n1: on`  
  `n2: on`  
  `n3: on`  
  `n4: off`  


* Forcing a reboot of nodes n1-n4:
    `# nodepower n1-n4 boot`  
    `n3: on->reset`  
    `n1: on->reset`  
    `n2: on->reset`  
    `n4: off->on`  


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
