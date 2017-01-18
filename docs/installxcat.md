---
layout: page
title: xCAT Installation
permalink: /documentation/installxcat.html
---

After adding the correct repository as indicated in the [download page]({{ site.baseurl }}/downloads/), you can install xCAT by running:
```sh
	yum install xCAT
```
It is possible to require additional packages when installing xCAT. 
For RHEL, connect to the RedHat Subscription Manager and download the following packages: 
* net-snmp-perl
* perl-Net-Telnet
* perl-Crypt-CBC
* perl-Digest
* perl-Digest-MD5

```sh
	rpm -ivh packagenames
```

To verify that you have installed xCAT
```sh
    service xcatd status
```
At this point, log out and log back in to have xCAT commands functional.

