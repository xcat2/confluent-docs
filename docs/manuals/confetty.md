---
title: Manual for confetty
---

confetty(8) --- Interactive confluent client
=================================================

## SYNOPSIS

`confetty`  
`confetty <var>confetty command line</var>`

## DESCRIPTION

**confetty** launches an interactive CLI session to the
confluent service.  It provides a filesystem-like
view of the confluent interface.  It is intended to
be mostly an aid for developing client software, with
day to day administration generally being easier with
the various function specific commands.

## OPTIONS

* `-s SERVER:PORT`, `--server=SERVER:PORT`:
  Confluent instance to connect to

* `-c PATH`, `--control=PATH`:
  Path to offer terminal control

* `-m MINTIME`, `--mintime=MINTIME`:
  Minimum time to run or else pause for input (used to
  keep a terminal from closing quickly on error)
  
* `-h`, `--help`:
  Show help message and exit  

## COMMANDS

The CLI may be navigated by shell commands and some other
commands.

* `cd`:
  Change the location within the tree
* `ls`:
  List the elements within the current directory/tree
* `show` **ELEMENT**, `cat` **ELEMENT**:
  Display the result of reading a specific element (by full or relative path)
* `unset` **ELEMENT** **ATTRIBUTE**
  For an element with attributes, request to clear the value of the attribue
* `set` **ELEMENT** **ATTRIBUTE**=**VALUE**
  Set the specified attribute to the given value
* `start` **ELEMENT**
  Start a console session indicated by **ELEMENT** (e.g. /nodes/n1/console/session)
* `rm` **ELEMENT**
  Request removal of an element.  (e.g. rm events/hardware/log clears log from a node)


[SYNOPSIS]: #SYNOPSIS "SYNOPSIS"
[DESCRIPTION]: #DESCRIPTION "DESCRIPTION"
[OPTIONS]: #OPTIONS "OPTIONS"
[COMMANDS]: #COMMANDS "COMMANDS"


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
