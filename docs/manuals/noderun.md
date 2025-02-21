---
title: Manual for noderun
---

noderun(8) -- Run arbitrary commands per node in a noderange
=============================================================

## SYNOPSIS

`noderun [options] <var>noderange</var> <var>command expression</var>`

## DESCRIPTION

`noderun` will take a given command and execute it in parallel once per node
in the specified noderange.  Attribute expressions as documented in
nodeattribexpressions(5) are expanded prior to execution of the command.  For
noderun, the commands are locally executed.  To execute commands on the nodes
themselves, see nodeshell(8).

## OPTIONS

* `-f COUNT`, `-c COUNT`, `--count=COUNT`:
  Number of commands to run at a time
  
* `-n`, `--nonodeprefix`:
  Do not prefix output with node names
  
* `-m MAXNODES`, `--maxnodes=MAXNODES`:
  Specify a maximum number of nodes to run the command with, prompting if over
  the threshold
  
* `-h`, `--help`:
  Show help message and exit

## EXAMPLES

* Run ping against nodes n1 through n4:
  `# noderun n1-n4 ping -c 1 {nodename}`  
  `n3: PING n3 (172.30.2.3) 56(84) bytes of data.`  
  `n3: 64 bytes from n3 (172.30.2.3): icmp_seq=1 ttl=64 time=0.387 ms`  
  `n3: `  
  `n3: --- n3 ping statistics ---`  
  `n3: 1 packets transmitted, 1 received, 0% packet loss, time 0ms`  
  `n3: rtt min/avg/max/mdev = 0.387/0.387/0.387/0.000 ms`  
  `n4: PING n4 (172.30.2.4) 56(84) bytes of data.`  
  `n4: 64 bytes from n4 (172.30.2.4): icmp_seq=1 ttl=64 time=0.325 ms`  
  `n4: `  
  `n4: --- n4 ping statistics ---`  
  `n4: 1 packets transmitted, 1 received, 0% packet loss, time 0ms`  
  `n4: rtt min/avg/max/mdev = 0.325/0.325/0.325/0.000 ms`  
  `n2: PING n2 (172.30.2.2) 56(84) bytes of data.`  
  `n2: From odin (172.30.0.6) icmp_seq=1 Destination Host Unreachable`  
  `n2: `  
  `n2: --- n2 ping statistics ---`  
  `n2: 1 packets transmitted, 0 received, +1 errors, 100% packet loss, time 3000ms`  
  `n2: `  
  `n1: PING n1 (172.30.2.1) 56(84) bytes of data.`  
  `n1: `  
  `n1: --- n1 ping statistics ---`  
  `n1: 1 packets transmitted, 0 received, 100% packet loss, time 10000ms`  
  `n1: `  

* Run an ipmitool raw command against the management controllers of n1 through n4:
  `# noderun n1-n4 ipmitool -I lanplus -U USERID -E -H {hardwaremanagement.manager} raw 0 1`  
  `n3:  01 10 00`  
  `n1:  01 10 00`  
  `n4:  01 10 00`  
  `n2:  01 10 00`  


* If wanting to use literal {} in the command, they must be escaped by doubling:
  `# noderun n1-n4 "echo {node} | awk '{{print $1}}'"`

## SEE ALSO

nodeshell(8)


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
