---
title: xCAT OS Deployment Notes for RedHat Enterprise Linux 7
tags:
  - xcat
  - deployment
---

If executing `genimage` multiple times, it may be required to delete the image between runs. This
is due to certain assumptions that, among other things, could erase `/etc/passwd` without
recreating the pertinent accounts.
