---
title: Manual for nodefirmware
---

nodefirmware(8) -- Report firmware information on confluent nodes
=================================================================

## SYNOPSIS

`nodefirmware <var>noderange</var> [list][update [--backup <var>file</var>]]|[<var>components</var>]`

## DESCRIPTION

`nodefirmware` reports and updates various firmware on nodes.  By default it
will retrieve all firmware, but can be directed to fetch specific firmware by
calling out the name of the firmware (e.g. uefi or xcc) or request reading only
core firmware firmware by using the word 'core', which is generally a quicker
operation.  Different hardwaremanagement.method indicated plugins may have
different capabilities available.  For example, the 'core' distinction may
not be relevant to redfish.  Additionally, the Lenovo XCC makes certain
information available over IPMI that is not otherwise available (for example
the FPGA version where applicable).

In the update form, it accepts a single file and attempts to update it using
the out of band facilities.  Firmware updates can end in one of three states:

* `error`: The attempted update encountered an error that prevented successful install.  Nodes experiencing this state will be reported at the end and more detail on the error will be given
* `pending`:  The firmware update process has completed, but the firmware will not be active until the relevant component next resets.  Generally speaking, for UEFI update the system will need a reboot, and for BMC updates, the `nodebmcreset` command will begin the process to activate the firmware.
* `complete`:  The firmware update process has completed and activation has proceeded.  Note that while the activation process has commenced, the component may still be in the process of rebooting when nodefirmware exits.

## OPTIONS

* `-b`, `--backup`:
  Target a backup bank rather than primary
  
* `-m MAXNODES`, `--maxnodes=MAXNODES`:
  When updating, prompt if more than the specified number of servers will 
  be affected  
  
* `-h`, `--help`:
  Show help message and exit    

## EXAMPLES

* Pull firmware from a node:
`# nodefirmware r1`  
`r1: IMM: 3.70 (TCOO26H 2016-11-29T05:09:51)`  
`r1: IMM Backup: 1.71 (TCOO10D 2015-04-17T00:00:00)`  
`r1: IMM Trusted Image: TCOO26H`  
`r1: UEFI: 2.31 (TCE128I 2016-12-13T00:00:00)`  
`r1: UEFI Backup: 2.20 (TCE126O)`  
`r1: FPGA: 3.2.0`  
`r1: Broadcom NetXtreme Gigabit Ethernet Controller Bootcode: 1.38`  
`r1: Broadcom NetXtreme Gigabit Ethernet Controller MBA: 16.8.0`  
`r1: Broadcom NetXtreme Gigabit Ethernet Controller Firmware Package: 0.0.0a`  
`r1: ServeRAID M1215 MegaRAID Controller Firmware: 24.12.0-0038 (2016-10-20T00:00:00)`  
`r1: ServeRAID M1215 Disk 28 MBF2600RC: SB2C`  
`r1: ServeRAID M1215 Disk 29 MBF2600RC: SB2C`  
`r1: ServeRAID M5210 Disk 0 MBF2600RC: SB2C`  
`r1: ServeRAID M5210 Disk 1 MBF2600RC: SB2C`  
`r1: ServeRAID M5210 Disk 2 MBF2600RC: SB2C`  


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
