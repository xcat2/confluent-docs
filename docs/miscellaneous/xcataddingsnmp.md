---
title: Adding snmp support to xCAT
layout: page
permalink: /documentation/xcataddingsnmp.html
---

Due to changes in RedHat/CentOS 8, net-snmp-perl is no longer provided in either the vendor repository nor the lenovo repository.
As such, xCAT support for SNMP is now considered optional.

It is recommended to either [use confluent to do PXE discovery and feed the data into xCAT]({{site.baseurl}}/documentation/confluenttoxcat.html) or [use confluent for the OS deployment]({{site.baseurl}}/documentation/confluentosdeploy.html). However,
if wanting to use xCAT discovery with SNMP support, builds of the net-snmp rpms are [available](/downloads/snmp/).

Installing net-snmp-perl will add SNMP support to xCAT. Note that every rpm beginning with net-snmp must be exactly the same version, so it may be required to upgrade multiple rpms.

If the most recent download is still old enough to create issues trying to apply updates from RedHat or CentOS, you may build your own packages instead of using packages from an archive:

    $ git clone https://git.centos.org/rpms/net-snmp.git
    $ cd net-snmp
    $ git checkout c8
    $ cp SOURCES/* ~/rpmbuild/SOURCES
    $ rpmbuild -ba SPECS/net-snmp.spec --define 'netsnmp_check 0'  --undefine '_disable_source_fetch'

