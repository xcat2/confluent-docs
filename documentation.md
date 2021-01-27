---
layout: page
title: Documentation
permalink: /documentation/
toplevel: yes
---

For specific topics, it may be easier to use the [search]({{site.baseurl}}/search.html) function of this site.

Generally speaking, there are two suggested approaches:
* Using confluent - It is now recommended for most of those without existing xCAT installations to use confluent directly.
* Using xCAT and confluent together - When you are used to xCAT or need stateless deployment or another currently xCAT exclusive feature and want to use it in conjunction with confluent.  For this situation, start with the xCAT documentation under Advanced topics.

Getting started:
* [Quick start guide for confluent under RedHat/CentOS]({{site.baseurl}}/documentation/confluentquickstart_el8.html)
* [Detailed installation guide for confluent under RedHat/CentOS]({{ site.baseurl }}/documentation/installconfluent_rhel.html)
* [Detailed installation guide for confluent under SuSE]({{ site.baseurl }}/documentation/installconfluent_suse.html)
* [Detailed configuration guide for confluent]({{ site.baseurl }}/documentation/configconfluent.html)

User reference documentation:

* [Node discovery and autoconfiguration with confluent]({{ site.baseurl }}/documentation/confluentdisco.html)
* [Discovery with chained ThinkSystem D2 enclosures]({{site.baseurl}}/documentation/chainedsmmdiscovery.html)
* [Setting up the confluent racvkview]({{site.baseurl}}/documentation/confluentrackview.html)
* [Man pages]({{ site.baseurl }}/documentation/man/)
* [Noderange syntax]({{ site.baseurl }}/documentation/noderange.html)
* [Node attributes]({{ site.baseurl }}/documentation/nodeattributes.html)
* [Attribute expressions]({{ site.baseurl }}/documentation/attributeexpressions.html)
* [Specifying connected switch ports for nodes]({{site.baseurl}}/documentation/switchportattribs.html)
* [Confluent configuration notes for Lenovo hardware]({{ site.baseurl }}/documentation/confluentconfignotes.html)
* [OS Deployment Notes for CentOS]({{site.baseurl}}/documentation/centosdeploy.html)
* [OS Deployment Notes for Red Hat Enterprise Linux 7]({{site.baseurl}}/documentation/el7deploy.html)
* [OS Deployment Notes for SUSE Linux Enterprise 15]({{site.baseurl}}/documentation/suse15deploy.html)
* [Applying software updates of only Lenovo repository under RedHat/CentOS]({{ site.baseurl }}//documentation/updatesw_rhel.html)
* [Power and cooling monitoring with confluent]({{ site.baseurl }}/documentation/thermalpowerconfluent.html)

Advanced topics:

* [Configuring confluent with xCAT]({{ site.baseurl }}/documentation/configconfluent_xcat.html)
* [Installing xCAT on SuSE platforms]({{ site.baseurl }}/documentation/installxcat_suse.html)
* [Installing xCAT on RedHat/CentOS platforms]({{ site.baseurl }}/documentation/installxcat_rhel.html)
* [Remote confluent access (for xCAT rcons with service nodes)]({{ site.baseurl }}/documentation/remoteconfluent.html)
* [xCAT configuration notes for Lenovo hardware]({{site.baseurl}}/documentation/xcatconfignotes.html)
* [Using xCAT service nodes with a shared tftpboot directory]({{site.baseurl}}/documentation/sharedtftpnotes.html)
* [Installing RedHat/CentOS 8 over InfiniBand]({{site.baseurl}}/documentation/el8ibinstall.html)
* [Installing SLE 15.2 over InfiniBand]({{site.baseurl}}/documentation/sle152ibinstall.html)
* [Booting xCAT ramroot over InfiniBand]({{site.baseurl}}/documentation/xcatramrootibboot.html)
* [nodemedia caveats]({{site.baseurl}}/documentation/nodemedia_caveats.html)
* [Using xCAT nodes with a shared install directory]({{site.baseurl}}/documentation/sharedinstallnotes.html)
* [Using driver update media for RedHat/CentOS]({{site.baseurl}}/documentation/driverupdatemedia.html)
* [Using confluent discovery for xCAT]({{site.baseurl}}/documentation/confluenttoxcat.html)
* [Confluent OS Deployment and Syslog]({{site.baseurl}}/documentation/confluentosdeployment.html)
* [Confluent Discovery/Autosense setting]({{site.baseurl}}/documentation/confluentdiscoverysetting.html)
* [Limitations of usage of Confluent osdeploy initialize across multiple management nodes]({{site.baseurl}}/documentation/confluentlimitationsosdeploy.html)
* [Adding snmp support to xCAT]({{site.baseurl}}/documentation/xcataddingsnmp.html)

For developers:

* [API reference]({{ site.baseurl }}/documentation/developer/api.html)
