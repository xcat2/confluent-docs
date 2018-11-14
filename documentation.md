---
layout: page
title: Documentation
permalink: /documentation/
toplevel: yes
---

Generally speaking, there are two suggested approaches:
* Using xCAT and confluent together - When you are used to xCAT or want to use xCAT for OS deployment and/or service nodes.  For this situation, start with the xCAT documentation.
* Using confluent standalone - If you do not have service nodes and do not have to deploy OSes, then skip xCAT and go straight to confluent documentation.

Getting started for EL7:
* [Installing xCAT]({{ site.baseurl }}/documentation/installxcat_rhel.html)
* [xCAT configuration notes for Lenovo hardware]({{site.baseurl}}/documentation/xcatconfignotes.html)
* [Installing confluent]({{ site.baseurl }}/documentation/installconfluent_rhel.html)
* [Configuring confluent standalone]({{ site.baseurl }}/documentation/configconfluent.html)
* [Configuring confluent with xCAT]({{ site.baseurl }}/documentation/configconfluent_xcat.html)
* [Applying software updates of only Lenovo repository under EL7]({{ site.baseurl }}//documentation/updatesw_rhel.html)
* [Node discovery and autoconfiguration with confluent]({{ site.baseurl }}/documentation/confluentdisco.html)
* [OS Deployment Notes for CentOS]({{site.baseurl}}/documentation/centosdeploy.html)

Getting started for SUSE Linux Enterprise Server 12:
* [Installing xCAT]({{ site.baseurl }}/documentation/installxcat_suse.html)
* [xCAT configuration notes for Lenovo hardware]({{site.baseurl}}/documentation/xcatconfignotes.html)
* [Installing confluent ]({{ site.baseurl }}/documentation/installconfluent_suse.html)
* [Configuring confluent standalone]({{ site.baseurl }}/documentation/configconfluent.html)
* [Configuring confluent with xCAT]({{ site.baseurl }}/documentation/configconfluent_xcat.html)
* [Node discovery and autoconfiguration with confluent]({{ site.baseurl }}/documentation/confluentdisco.html)

General documentation:

* [Discovery with chained ThinkSystem D2 enclosures]({{site.baseurl}}/documentation/chainedsmmdiscovery.html)
* [Configuring confluent from xCAT]({{ site.baseurl }}/documentation/configconfluent_xcat.html)
* [Man pages]({{ site.baseurl }}/documentation/man/)
* [Noderange syntax]({{ site.baseurl }}/documentation/noderange.html)
* [Node attributes]({{ site.baseurl }}/documentation/nodeattributes.html)
* [Attribute expressions]({{ site.baseurl }}/documentation/attributeexpressions.html)
* [Specifying connected switch ports for nodes]({{site.baseurl}}/documentation/switchportattribs.html)


Power and Cooling Monitoring:

* [Power Histogram]({{ site.baseurl }}/documentation/energyhistogram.html)
* [Power and cooling monitoring with confluent]({{ site.baseurl }}/documentation/thermalpowerconfluent.html)

Advanced topics:

* [Remote confluent access (for xCAT rcons with service nodes)]({{ site.baseurl }}/documentation/remoteconfluent.html)

For developers:

* [API reference]({{ site.baseurl }}/documentation/developer/api.html)
