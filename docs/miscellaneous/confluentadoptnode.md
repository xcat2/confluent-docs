---
layout: page
title: Adding an installed node to confluent SSH setup
permalink: /documentation/confluentadoptnode.html
---

This procedure will provide confluent SSH configuration to a node that was not installed by confluent.

It is recommended to backup /etc/ssh on the target system before proceeding.

First, have an OS profile available in confluent that roughly matches the distribution running on the target.
For example, if the target is running any version or variant of Red Hat Enterprise Linux 7, then select
a confluent profile based on an 'el7' distribution.

Download three scripts to the confluent deployment server:
```
https://raw.githubusercontent.com/xcat2/confluent/refs/heads/master/misc/adoptnode.sh
https://raw.githubusercontent.com/xcat2/confluent/refs/heads/master/misc/finalizeadopt.sh
https://raw.githubusercontent.com/xcat2/confluent/refs/heads/master/misc/prepadopt.sh
```


Invoke the adoptnode.sh script as follows:
```
sh adoptnode.sh <nodename> <profilename>
```

This may prompt to accept the current host key and may prompt for password.

After this procedure, ssh to and from the indicated nodename should behave as if it were installed
by confluent, without having to reinstall the system.
