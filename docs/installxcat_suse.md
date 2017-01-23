---
layout: page
title: xCAT Installation for SUSE
permalink: /documentation/installxcat_suse.html
---

#xCAT Installation for SUSE

After adding the correct repository as indicated in the [download page]({{ site.baseurl }}/downloads/), you can install xCAT by running:
```sh
zypper install xCAT
```
To verify that you have installed xCAT
```sh
service xcatd status
```
At this point, source the script below for xCAT commandline functionality or logout and log back in. 
```sh 
source /etc/profile.d/xcat.sh
```
For more information on installing xCAT, go to http://xcat-docs.readthedocs.io/en/stable/guides/install-guides/index.html

To continue to install confluent go to [install confluent]({{ site.baseurl }}/documentation/installconfluent_suse.html)



