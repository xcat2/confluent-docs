---
layout: page
title: Confluent OS Deployment and Syslog
permalink: /documentation/confluentosdeployment.html
---

Current and previous users of xCAT may be aware that xCAT configures syslog on deployed systems to do its logging on the xCAT management node instead of the default behavior of logging locally on each system.

It should be noted that Confluent does NOT currently configure syslog in this fashion as part of its OS deployment of systems. Users wishing this functionality will need to configure it themselves, perhaps using the xCAT postscript `/install/postscripts/syslog` as an example.

Confluent may add the syslog configuration feature in a future version.