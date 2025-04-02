---
layout: page
title: xCAT Installation for Red Hat Enterprise Linux 7
permalink: /documentation/installxcat_rhel.html
---

After adding the correct repository as indicated in the [download page](../downloads.md), you can install xCAT by running:

    yum install xCAT

It is strongly recommended to also install lenovo-onecli:

    yum install lenovo-onecli

The default assures ability to use a local SQLite database.  If you want to use PostgreSQL you will also need:

    yum install perl-DBD-Pg

If you wish to use MySQL instead, then:

    yum install perl-DBD-MySQL

To verify that you have installed xCAT

    service xcatd status

At this point, source the script below for xCAT command line functionality or logout and log back in. 

    source /etc/profile.d/xcat.sh

For some notes on configuring certain Lenovo equipment in xCAT, see [xCAT configuration notes](xcatconfignotes.md)

For more information on installing xCAT, go to [xCAT Install Guide](http://xcat-docs.readthedocs.io/en/stable/guides/install-guides/index.html)

To continue to install confluent go to [install confluent](../getting_started/installconfluent_rhel.md)

