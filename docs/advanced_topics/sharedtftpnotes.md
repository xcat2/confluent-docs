---
layout: page
title: Using xCAT service nodes with a shared tftpboot directory
permalink: /documentation/sharedtftpnotes.html
---

When using a shared tftp directory, the Genesis image generated in an rpm update
applied across master and service nodes concurrently may drive uncertainty as to which
xCAT server has credentials that can connect to a node booted into genesis using ssh.

Two strategies are suggested:
* Have all management nodes have the same keys in /root/.ssh/ so that they are consistent
* Run rpm updates or `mknb x86_64` on the preferred management server.
