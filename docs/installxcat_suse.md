---
layout: page
title: xCAT Installation for SUSE Linux Enterprise Server 12
permalink: /documentation/installxcat_suse.html
---

After adding the correct repository as indicated in the [download page]({{ site.baseurl }}/downloads/), you can install xCAT by running:

    zypper install xCAT

To verify that you have installed xCAT

    service xcatd status

At this point, source the script below for xCAT command line functionality or logout and log back in. 

    source /etc/profile.d/xcat.sh

For more information on installing xCAT, go to [xCAT Install Guide](http://xcat-docs.readthedocs.io/en/stable/guides/install-guides/index.html "xCAT Install Guide")

To continue to install confluent go to [install confluent]({{ site.baseurl }}/documentation/installconfluent_suse.html "Install Confluent")



