---
layout: page
title: Configuring network port attributes
permalink: /documentation/switchportattribs.html
---

In xCAT and confluent, the [discovery process]({{site.baseurl}}/documentation/confluentdisco.html) can use ethernet switch connectivity to assess real node identity to use in deploying configuration and gathering info such as mac addresses.

Both support a variety of switches, using snmp v1/v2c/v3.  Using v3 is recommended where feasible.

Also in both cases, the software will try to determine the correct interface name from the given description.  For example, if the switch offers `Ethernet17`, then either the literal value `Ethernet17` or simply `17` will suffice.  However, caution is warranted when using breakout cables as you may do with a switch like a G8332 to connect 4 systems to a single QSFP port.  If you simply specify `3`, it would not only consider `Ethernet3` a match, but also `Ethernet1/3`, `Ethernet2/3`, and so forth.  In such a case, it is required to provide the full string `Ethernet3` to avoid confusion between breakout and non-breakout connections.  For the breakout connections, either `2/3` or `Ethernet2/3` would be valid values that are unambiguous.
