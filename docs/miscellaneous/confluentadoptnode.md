---
title: Adding an installed node to confluent SSH setup
tags:
  - security
---

This procedure will provide confluent SSH configuration to a node that was not installed by confluent.

It is recommended to backup `/etc/ssh` on the target system before proceeding.

First, have an OS profile available in confluent that roughly matches the distribution running on the target.
For example, if the target is running any version or variant of Red Hat Enterprise Linux 7, then select
a confluent profile based on an 'el7' distribution.

!!! note
    The profile must contain `setupssh`, which was added in Confluent 3.7.1. If the profile was imported before that version, you may need to reimport it before adopting the node.

Download three scripts to the confluent deployment server:
```text
https://raw.githubusercontent.com/xcat2/confluent/refs/heads/master/misc/adoptnode.sh
https://raw.githubusercontent.com/xcat2/confluent/refs/heads/master/misc/finalizeadopt.sh
https://raw.githubusercontent.com/xcat2/confluent/refs/heads/master/misc/prepadopt.sh
```


!!! warning
    Adoption clears a node-level `deployment.useinsecureprotocols` setting to reduce the risk of accidentally deploying a full OS during onboarding. If you later deploy a full OS to the node, you may need to restore that setting unless it is inherited from a group.

Invoke the adoptnode.sh script as follows:

```bash
sh adoptnode.sh <nodename> <profilename>
```

This may prompt to accept the current host key and may prompt for password.

After this procedure, ssh to and from the indicated nodename should behave as if it were installed
by confluent, without having to reinstall the system.
