---
layout: page
title: Configuring network port attributes
permalink: /documentation/switchportattribs.html
---

In xCAT and confluent, the [discovery process]({{site.baseurl}}/documentation/confluentdisco.html) can use ethernet switch connectivity to assess real node identity to use in deploying configuration and gathering info such as mac addresses.

Both support a variety of switches, using snmp v1/v2c/v3.  Using v3 is recommended where feasible.

Also in both cases, the software will try to determine the correct interface name from the given value.  For example, if the switch offers `Ethernet17`, then either the literal value `Ethernet17` or simply `17` will suffice.  However, caution is warranted particularly when using breakout cables as you may do with a switch like a G8332 to connect 4 systems to a single QSFP.  `Ethernet14/3` would be confsed with `Ethernet3` if merely `3` is specified.  In such a case, it is required to provide the full string `Ethernet3` to avoid confusion in the non-breakout cable connection.  Either `14/3` or `Ethernet14/3` would work for the breakout. 
