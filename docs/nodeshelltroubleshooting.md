---
layout: page
title: Confluent nodeshell and apt-get command
permalink: /documentation/nodeshelltroubleshooting.html
---

#### Running the `apt-get install` command can be interactive and so not suited for running through Confluent `nodeshell` command. 

Here is an example of a command that requires interaction and the failure output. 
```
[root@n790 ~]# nodeshell bf3 "apt-get install net-tools" | collate
n1812: debconf: unable to initialize frontend: Dialog
n1812: debconf: (TERM is not set, so the dialog frontend is not usable.)
n1812: debconf: falling back to frontend: Readline
n1812: debconf: unable to initialize frontend: Readline
n1812: debconf: (This frontend requires a controlling tty.)
n1812: debconf: falling back to frontend: Teletype
n1812: dpkg-preconfigure: unable to re-open stdin:
```

Modifying the `nodeshell` command to have the DEBIAN_FRONTENT set to noninteractive will fix this issue

`[root@n790 ~]# nodeshell bf3 "DEBIAN_FRONTEND=noninteractive apt-get install net-tools" | collate`