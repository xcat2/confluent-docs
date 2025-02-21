---
title: Manual for nodeconfig
---

nodeconfig(8) -- Show or change node configuration
==================================================

## SYNOPSIS

`nodeconfig [options] <var>noderange</var> [setting|setting=value]`

## DESCRIPTION

**nodeconfig** manages the configuration of nodes managed by confluent.
Rather than manipulating the confluent database, this actually modifies the
running configuration on the node firmware.  Calling without '=' will show the
current value, and '=' will change the value.  Network information can be
given as a node expression, as documented in the man page for nodeattribexpressions(5).

Note that when using nodeconfig to submit changes, it will exit when the change
is accepted, but the endpoint may not have fully processed it. Doing a show
immediately after doing a set may reflect older information. Also, if changing
BIOS/UEFI settings, the change may appear in output, but generally won't
actually be in effect until a reboot.

## OPTIONS

* `-c`, `--comparedefault`:
  Take the given settings and compare against default value, if available.  If
  no configuration values are specified, it will show only those that differ.
  If combined with `-x`, will show all differing values except those indicated
  by `-x`
  
* `-b settings.batch`, `--batch=settings.batch`:
   Provide arguments as lines of a file, rather than the command line.  
   
* `-d`, `--detail`:
  Provide detailed data as available.  This can include help text and valid
  values for a setting.   

* `-e`, `--extra`:
   Read settings that are generally not needed, but may be slow to retrieve.
   Notably this includes the IMM category of Lenovo systems.  The most popular
   IMM settings are available through faster 'bmc' attributes.

* `-x`, `--exclude`:
  Rather than listing only the specified configuration parameters, list all
  attributes except for the specified ones

* `-a`, `--advanced`:
  Include advanced settings, which are normally not intended to be used
  without direction from the relevant server vendor.

* `-r COMPONENT`, `--restoredefault=COMPONENT`:
  Request that the specified component of the targeted nodes will have its
  configuration reset to default.  Currently the only component implemented
  is uefi.

* `-m MAXNODES`, `--maxnodes=MAXNODES`:
  Specify a maximum number of nodes to configure, prompting if over 
  the threshold  
  
* `-h`, `--help`:
  Show help message and exit  

## EXAMPLES
* Showing the current IP configuration of noderange BMC/IMM/XCC:
    `# nodeconfig s3,s4 bmc`  
    `s3: bmc.ipv4_address: 172.30.254.193/16`  
    `s3: bmc.ipv4_method: DHCP`  
    `s3: bmc.ipv4_gateway: 172.30.0.6`  
    `s4: bmc.ipv4_address: 172.30.254.192/16`  
    `s4: bmc.ipv4_method: DHCP`  
    `s4: bmc.ipv4_gateway: 172.30.0.6`  

* Changing nodes `s3` and `s4` to have the ip addressess 10.1.2.3 and 10.1.2.4 with a 16 bit subnet mask:
    `# nodeconfig s3,s4 bmc.ipv4_address=10.1.2.{n1}/16`  

## SEE ALSO

nodeattribexpressions(5)



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
