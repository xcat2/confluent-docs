---
layout: page
title: xCAT Installation for Red Hat Enterprise Linux 7
permalink: /documentation/installxcat_rhel.html
---

After adding the correct repository as indicated in the [download page]({{ site.baseurl }}/downloads/), you can install xCAT by running:
```sh
yum install xCAT
```
To verify that you have installed xCAT
```sh
service xcatd status
```
At this point, source the script below for xCAT commandline functionality or logout and log back in. 
```sh 
source /etc/profile.d/xcat.sh
```

For more information on installing xCAT, go to [link](http://xcat-docs.readthedocs.io/en/stable/guides/install-guides/index.html "xCAT Installation")

To continue to install confluent go to [install confluent]({{ site.baseurl }}/documentation/installconfluent_rhel.html)

## *Issues:*

It is possible to require additional packages when installing xCAT. 
For RHEL, connect to the RedHat Subscription Manager and connect to the optional channel 
```sh
subscription-manager repos --enable=rhel-7-server-optional-rpms
```
If you are NOT able to connect to the optional repository,download the following packages and install them with rpm: 
* net-snmp-perl
* perl-Net-Telnet
* perl-Crypt-CBC
* perl-Digest
* perl-Digest-MD5

```sh
rpm -ivh packagenames
```


