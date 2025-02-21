---
title: Manual for confluentdbutil
---

confluentdbutil(8) -- Backup or restore confluent database
=========================================================

## SYNOPSIS

`confluentdbutil [options] [dump|restore] <var>path</var>`

## DESCRIPTION

**confluentdbutil** is a utility to export/import the confluent attributes
to/from json files.  The path is a directory that holds the json version.
In order to perform restore, the confluent service must not be running.  It
is required to indicate how to treat the usernames/passwords are treated in
the json files (password protected, removed from the files, or unprotected).

## OPTIONS

* `-p PASSWORD`, `--password=PASSWORD`:
  If specified, information such as usernames and passwords will be encrypted
  using the given password.
  
* `-i`, `--interactivepassword`:
  Prompt for password.  
  
* `-r`, `--redact`:
  Indicates to replace usernames and passwords with a dummy string rather
  than included.
  
* `-u`, `--unprotected`:
  The keys.json file will include the encryption keys without any protection.
  
* `-s`, `--skipkeys`:
  This specifies to dump the encrypted data without
  dumping the keys needed to decrypt it.  This is
  suitable for an automated incremental backup, where an
  earlier password protected dump has a protected
  keys.json file, and only the protected data is needed.
  keys do not change and as such they do not require
  incremental backup.
  
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
