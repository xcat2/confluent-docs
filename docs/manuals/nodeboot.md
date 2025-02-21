---
title: Manual for nodeboot
---

nodeboot(8) -- Reboot a confluent node to a specific device
=========================================================

## SYNOPSIS

`nodeboot [options] <var>noderange</var> [default|cd|network|setup|hd]`  

## DESCRIPTION

**nodeboot** reboots nodes in a noderange.  If an additional argument is given,
it sets the node to specifically boot to that as the next boot.  This 
performs an immediate reboot without waiting for the OS.  To set the boot
device without inducing a reboot, see the `nodesetboot` command.

## OPTIONS

* `-b`, `--bios`:
  For a system that supports both BIOS and UEFI style boot, request BIOS style
  boot if supported (some platforms will UEFI boot with this flag anyway).

* `-u`, `--uefi`:
  This flag does nothing, it is for command compatibility with xCAT's rsetboot

* `-p`, `--persist`:
  For a system that supports it, mark the boot override to persist rather than
  be a one time change.  Many systems do not support this functionality.
  
* `-m MAXNODES`, `--maxnodes=MAXNODES`:
  Specify a maximum number of nodes to boot, prompting
  if over the threshold
  
* `-h`, `--help`:
  Show help message and exit  

* `default`:
  Request a normal default boot with no particular device override

* `cd`:
  Request boot from media.  Note that this can include physical CD,
  remote media mounted as CD/DVD, and detachable hard disks drives such as usb
  key devices.
  
* `network`:
  Request boot to network
  
* `setup`:
  Request to enter the firmware configuration menu (e.g. F1 setup) on next boot.

* `hd`:
  Boot straight to hard disk drive

## EXAMPLES
* Booting n3 and n4 to the default boot behavior:
  `# nodeboot n3-n4`  
  `n3: default`  
  `n4: default`  
  `n3: on->reset`  
  `n4: on->reset`  

* Booting n1 and n2 to setup menu:
  `# nodeboot n1-n2 setup`
  `n2: setup`  
  `n1: setup`  
  `n2: on->reset`  
  `n1: on->reset`  

* Booting n3 and n4 to network:
  `# nodeboot n3-n4 net`  
  `n3: network`  
  `n4: network`  
  `n4: on->reset`  
  `n3: off->on`  


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
