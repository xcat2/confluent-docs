---
title: Manual for nodesetboot
---

nodesetboot(8) -- Check or set next boot device for noderange
====================================================

## SYNOPSIS
  
`nodesetboot [options] <var>noderange</var> [default|cd|network|setup|hd|usb|floppy]`

## DESCRIPTION

Requests that the next boot occur from the specified device.  Unless otherwise
specified, this is a one time boot option, and does not change the normal boot
behavior of the system.  This is useful for taking a system that normally boots
to the hard drive and startking a network install, or to go into the firmware
setup menu without having to hit a keystroke at the correct time on the console.

Generally, it's a bit more convenient and direct to use the nodeboot(8) command,
which will follow up the boot device with an immediate power directive to take
effect.  The `nodesetboot` command is still useful, particularly if you want
to use `nodesetboot <var>noderange</var> setup` and then initiate a reboot from within
the operating system with ssh or similar rather than using the remote hardware
control.

Running the command with no target queries the current setting.

## OPTIONS

* `-b`, `--bios`:
  For a system that supports both BIOS and UEFI style boot, request BIOS style
  boot if supported (some platforms will UEFI boot with this flag anyway).

* `-p`, `--persist`:
  For a system that supports it, mark the boot override to persist rather than
  be a one time change.  Many systems do not support this functionality.

* `-u`, `--uefi`:
  This flag does nothing, it is for command compatibility with xCAT's rsetboot
  
* `-m MAXNODES`, `--maxnodes=MAXNODES`:
  Specify a maximum number of nodes to modify next boot device, prompting if
  over the threshold
  
* `-h`, `--help`:
  Show help message and exit  

* `default`:
  Request a normal default boot with no particular device override

* `cd`:
  Request boot from media.  Note that this can include physical CD,
  remote media mounted as CD/DVD, and detachable hard disks drives such as usb
  key devices.
  
* `floppy`:
  Request boot from floppy.  Generally speaking firmware uses this to mean a USB
  flash drive or similar (whether virtual or physical).

* `usb`:
  Request boot from usb.  Generally speaking firmware uses this to mean a USB
  flash drive or similar (whether virtual or physical).

* `network`:
  Request boot to network
  
* `setup`:
  Request to enter the firmware configuration menu (e.g. F1 setup) on next boot.

* `hd`:
  Boot straight to hard disk drive

## EXAMPLES

* Set next boot to setup for four nodes:
  `# nodesetboot n1-n4 setup`  
  `n1: setup`  
  `n3: setup`  
  `n2: setup`  
  `n4: setup`  

* Check boot override settings on four nodes:
  `# nodesetboot n1-n4`  
  `n1: setup`  
  `n2: setup`  
  `n3: setup`  
  `n4: setup`  
  
## SEE ALSO

nodeboot(8)


[SYNOPSIS]: #SYNOPSIS "SYNOPSIS"
[DESCRIPTION]: #DESCRIPTION "DESCRIPTION"
[OPTIONS]: #OPTIONS "OPTIONS"
[EXAMPLES]: #EXAMPLES "EXAMPLES"
[SEE ALSO]: #SEE-ALSO "SEE ALSO"


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
