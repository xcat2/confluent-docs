---
title: Manual for nodelist
---

nodelist(8) -- List confluent nodes and their attributes
=========================================================

## SYNOPSIS

`nodelist <var>noderange</var>`  
`nodelist <var>noderange</var> [-b] [-d] {string} <var>nodeattribute</var>...`  

## DESCRIPTION

**nodelist** queries the confluent server to get information about nodes.  In
the simplest form, it simply takes the given noderange(5) and lists the
matching nodes, one line at a time.

If a list of node attribute names are given, the value of those are also
displayed.  If `-b` is specified, it will also display information on
how inherited and expression based attributes are defined.  There is more
information on node attributes in nodeattributes(5) man page.

Attributes may be specified by wildcard, for example `net.*switch` will report
all attributes that begin with `net.` and end with `switch`.

## OPTIONS

* `-b`, `--blame`:
  Annotate inherited and expression based attributes to show their base value.
* `-d`, `--delim`:
  Choose a delimiter to separat the values. Default - ENTER.
## EXAMPLES
* Listing matching nodes of a simple noderange:
  `# nodelist n1-n4`  
  `n1`  
  `n2`  
  `n3`  
  `n4`  

* Getting an attribute of nodes matching a noderange:
  `# nodelist n1,n2 hardwaremanagement.manager`  
  `n1: hardwaremanagement.manager: 172.30.3.1`  
  `n2: hardwaremanagement.manager: 172.30.3.2`  

* Getting a group of attributes while determining what group defines them:
  `# nodelist n1,n2 hardwaremanegement --blame`  
  `n1: hardwaremanagement.manager: 172.30.3.1`  
  `n1: hardwaremanagement.method: ipmi (inherited from group everything)`  
  `n1: hardwaremanagement.switch: r8e1`  
  `n1: hardwaremanagement.switchport: 14`  
  `n2: hardwaremanagement.manager: 172.30.3.2`  
  `n2: hardwaremanagement.method: ipmi (inherited from group everything)`  
  `n2: hardwaremanagement.switch: r8e1`  
  `n2: hardwaremanagement.switchport: 2`  


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
