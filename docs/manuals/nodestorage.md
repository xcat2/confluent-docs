---
title: Manual for nodestorage
---

nodestorage(8) -- Examine/Modify storage configuration of a node
============================================

## SYNOPSIS

`nodestorage <var>noderange</var> [show|create|delete|diskset] [hotspare|jbod|unconfigured] [options]`  

## DESCRIPTION

`nodestorage` provides access to the remote storage configuration of
the noderange. The `show` subcommand will show current storage configuration,
`create` can be used to create new arrays or volumes, `delete` can be used to
remove volumes and arrays, and `diskset` can modify the usage of disks
indicated by `-d` to either be `unconfigured`, `jbod`, or `hotspare`.

## OPTIONS
* `-r` **RAIDLEVEL**, `--raidlevel`=**RAIDLEVEL**:
  RAID level to use when creating an array

* `-d` **DISKS**, `--disks`=**DISKS**:
   Comma separated list of disks to use, or the word "rest" to
   indicate use of all available disks

* `-s` **SIZE**, `--size`=**SIZE**:
  Comma separated list of sizes to use when creating
  volumes.  The sizes may be absolute size (e.g. 16gb),
  percentage (10%) or the word "rest" to use remaining
  capacity, default behavior is to use all capacity to
  make a volume
* `-n` **NAME**, `--name`=**NAME**:
  Comma separated list of names to use when naming
  volumes, or selecting a volume for delete.  Default
  behavior is to use implementation provided default

* `-z` **STRIPSIZES**, `--stripsizes`=**STRIPSIZES**:
  Comma separated list of stripsizes to use when creating volumes.
  This value is in kilobytes.  The default behavior is to allow the
  storage controller to decide

* `-m` **MAXNODES**, `--maxnodes`=**MAXNODES**:
  Specify a maximum number of nodes to configure storage on, prompting
  if over the threshold

## EXAMPLES

* Deleting the volume `somedata`:
    `$ nodestorage d5 delete somedata`  
    `Deleted: somedata`  

* Creating a raid5 of 4 disks and a volume named `somedata`:
    `$ nodestorage d5 create -r 5 -d drive0,drive_1,drive_2,drive_3 -n somedata`  
    `d5: Volume somedata: Size: 1.905 TB`  
    `d5: Volume somedata: State: Optimal`  
    `d5: Volume somedata: Array 1-2`  

* Showing current storage configuration of `d3`:
    `$ nodestorage d3`  
    `d3: Disk m.2-0 Description: 128GB M.2 SATA SSD`  
    `d3: Disk m.2-0 State: online`  
    `d3: Disk m.2-0 FRU: 00LF428`  
    `d3: Disk m.2-0 Serial Number: H6B80054`  
    `d3: Disk m.2-0 Array: 0-0`  
    `d3: Disk m.2-1 Description: 128GB M.2 SATA SSD`  
    `d3: Disk m.2-1 State: online`  
    `d3: Disk m.2-1 FRU: 00LF428`  
    `d3: Disk m.2-1 Serial Number: H6B80059`  
    `d3: Disk m.2-1 Array: 0-0`  
    `d3: Array 0-0 Available Capacity: 0.000 MB`  
    `d3: Array 0-0 Total Capacity: 131.072 GB`  
    `d3: Array 0-0 RAID: RAID 1`  
    `d3: Array 0-0 Disks: m.2-0,m.2-1`  
    `d3: Array 0-0 Volumes: new_vd`  
    `d3: Volume new_vd: Size: 122.040 GB`  
    `d3: Volume new_vd: State: Optimal`  
    `d3: Volume new_vd: Array 0-0`  




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
