---
layout: page
title: xCAT Installation for Red Hat Enterprise Linux 7
permalink: /documentation/installxcat_rhel.html
---

After adding the correct repository as indicated in the [download page]({{ site.baseurl }}/downloads/), you can install xCAT by running:
    yum install xCAT

To verify that you have installed xCAT
    service xcatd status

At this point, source the script below for xCAT command line functionality or logout and log back in. 
    source /etc/profile.d/xcat.sh


For more information on installing xCAT, go to [xCAT Install Guide](http://xcat-docs.readthedocs.io/en/stable/guides/install-guides/index.html "xCAT Install Guide")

To continue to install confluent go to [install confluent]({{ site.baseurl }}/documentation/installconfluent_rhel.html "Install Confluent")

## *Issues:*

Additional packages may be required when installing xCAT. 
For RHEL, connect to the RedHat Subscription Manager and connect to the optional channel 
    subscription-manager repos --enable=rhel-7-server-optional-rpms

If you are NOT able to connect to the optional repository, download the following packages and install them with rpm: 
* net-snmp-perl
* perl-Net-Telnet
* perl-Crypt-CBC
* perl-Digest
* perl-Digest-MD5

