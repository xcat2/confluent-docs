---
title: Manual for nodelicense
---

nodelicense(8) -- Manage license keys on BMC
=================================================================

## SYNOPSIS

`nodelicense <var>noderange</var> [list][install <var>license_filename</var>|save <var>directory</var>|delete <var>license_feature_name</var>]`

## DESCRIPTION

`nodelicense` manages license keys on supported BMCs. Without an argument, the command
lists currently installed license.  Using `delete` will remove the specified license name
from the BMC.  The `save` subcommand will take the passed directory (which may be in the form
of /path/to/{node}/ to have the node name substituted for each node) and back up installed licenses
to that directory. The `install` command will take the specified filename and install.  The filename
argument may be of the form  xcc_fod_0034_7X21{id.serial}.key to have the serial number substituted
to allow unique licenses to be specified in a single command.

## OPTIONS

* `-m MAXNODES`, `--maxnodes=MAXNODES`:
  Specify a maximum number of nodes to delete licenses from, prompting if over the threshold
  
* `-h`, `--help`:
  Show help message and exit


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
