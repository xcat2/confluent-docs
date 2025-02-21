---
title: Manual for nodeshell
---

nodeshell(8) -- Execute command on many nodes in a noderange through ssh
=========================================================================

## SYNOPSIS

`nodeshell [options] <var>noderange</var> <var>command to execute on each node</var>`

## DESCRIPTION

Allows execution of a command on many nodes in parallel.  Like noderun(8), it
accepts and interpolates confluent attribute expressions as documented in 
nodeattribexpressions(5).  `nodeshell` provides stdout as stdout and stderr
as stderr, unlike psh which combines all stdout and stderr into stdout.

## OPTIONS
  
* `-c COUNT`, `-f COUNT`, `--count=COUNT`
  Specify the maximum number of instances to run concurrently

* `-l LOGINNAME`, `--loginname=LOGINNAME`
  Username to use when connecting, defaults to current user.

* `-m MAXNODES`, `--maxnodes=MAXNODES`
  Specify a maximum number of nodes to run remote ssh command to, prompting
  if over the threshold
 
* `-n`, `--nonodeprefix`
  Do not prefix output with node names  

* `-p PORT`, `--port=PORT`
  Specify a custom port for ssh

* `-s SUBSTITUTION`, `--substitutename=SUBSTITITUTION`
  Specify a substitution name instead of the nodename.  If no {} are in the substitution,
  it is considered to be an append.  For example, '-s -ib' would produce 'node1-ib' from 'node1'.
  Full expression syntax is supported, in which case the substitution is considered to be the entire
  new name. {node}-ib would be equivalent to -ib.  For example, nodeshell -s {bmc} node1 
  would ssh to the BMC instead of the node.

## EXAMPLES

* Running `echo hi` on for nodes:
  `# nodeshell n1-n4 echo hi`  
  `n1: hi`  
  `n2: hi`  
  `n3: hi`  
  `n4: hi`  

* Setting a new static ip address temporarily on secondary interface of four nodes:
  `# nodeshell n1-n4 ifconfig eth1 172.30.93.{n1}`

* If wanting to use literal {} in the command, they must be escaped by doubling:
  `# nodeshell n1-n4 "ps | awk '{{print $1}}'"`
  
## SEE ALSO

noderun(8)


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
