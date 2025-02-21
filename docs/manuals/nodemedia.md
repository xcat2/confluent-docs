---
title: Manual for nodemedia
---

nodemedia(8) -- Manage server remote media
=========================================================

## SYNOPSIS

`nodemedia <var>noderange</var> [attach|detachall|list|upload] [options] <var>media</var>`

## DESCRIPTION

**nodemedia** manages the remote media functionality of supported BMCs.

`list` shows all the current remote media the BMCs of the noderange are
providing to the host platform.  The string (insecure) is appended to URLs that
are mounted in an insecure fashion.  http is insecure, and https is also
insecure when no meaningful certificate validation is performed.  Currently
there is no action that can change this, and this is purely informational.  A
future version of software may provide a means to increase security of attached
remote media.  If no media is mounted, this will provide no output, error
conditions will result in output to standard error.

`detachall` removes all the currently provided media to the host.  This unlinks
remote media from urls and deletes uploaded media from the BMC.

`upload` takes the given media image and uploads it to the BMC.  This causes
the remote media to reside internally to the system without having to go
to the network after the upload.  This is more constrained, for example the
Lenovo xClarity Controller has a limit of 50 megabytes, but it has zero ongoing
load on the media source.

`attach` takes a URL to a remote media as an argument, and has the given
BMCs map a virtual USB device to that url.  Content is loaded on demand, and
as such that URL is referenced potentially once for every IO operation that
the host platform attempts.

## OPTIONS

* `-h`, `--help`:
  Show help message and exit

## EXAMPLES
* Listing currently mounted media:
  `# nodemedia s1-s4 list`  
  `s1: boot.img`  
  `s2: boot.img`  
  `s4: boot.img`  

* Uploading a small boot image to the BMC:
  `# nodemedia s1-s4 upload boot.img`  
  `s1:complete: 100%     s2:complete: 100%     s3:complete: 100%     s4:complete: 100%`  
  `s1: boot.img`  
  `s4: boot.img`  
  `s2: boot.img`  

* Attaching a larger ISO for on-demand access:
  `# nodemedia s1,s4 attach http://172.30.0.6/install/rhel74.iso`  
  `s4: http://172.30.0.6/install/rhel74.iso (insecure)`  
  `s1: http://172.30.0.6/install/rhel74.iso (insecure)`


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
