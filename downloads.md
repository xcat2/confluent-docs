---
layout: page
title: Downloads
permalink: /downloads/
---

Lenovo provides yum repositories of relevant software for managing HPC as well
as scale out Linux installations in general.  This includes Lenovo utilities
such as those found under ToolsCenter, as well as xCAT and confluent.

Adding Repository for Red Hat Enterprise Linux 7
============================
{% highlight bash %}
rpm --import https://hpc.lenovo.com/gpgkey.asc
yum-config-manager --add-repo https://hpc.lenovo.com/yum/16a/el7/x86_64/
{% endhighlight %}
Adding Repository for SuSE Linux Enterprise 12
============================
{% highlight bash %}
zypper as -t yum https://hpc.lenovo.com/yum/16a/sles12/x86_64/ lenovo-hpc
{% endhighlight %}
