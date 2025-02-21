---
layout: page
title: OS Deployment Notes for SLE/SUSE 15
permalink: /documentation/suse15deploy.html
---

Note that if using xCAT and wanting to use the `reboot` postscript, it must be specified as
in `postbootscripts` rather than `postscripts`.

If executing genimage multiple times, it may be required to delete the image between runs. This
is due to certain assumptions that, among other things, could erase /etc/passwd without
recreating the pertinent accounts.

