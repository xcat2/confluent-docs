---
layout: page
title: Configuring network port attributes
permalink: /documentation/switchportattribs.html
---

In xCAT and confluent, the [discovery process]({{site.baseurl}}/documentation/confluentdisco.html) can use ethernet switch connectivity to assess real node identity to use in deploying configuration and gathering info such as mac addresses.

Both support a variety of switches, using snmp v1/v2c/v3.  Using v3 is recommended where feasible.  In xCAT if using SNMPv1, you can indicate your community globally in site:
```xcat
chtab key=snmpc site.value=public
```

SNMPv3 and an alternative method to specify SNMPv1 is through the switches table:

```xcat
nodegrpch switches switches.snmpversion=3 switches.username=snmp3user switches.password=Passw0rd12 switches.privacy=des switches.auth=sha
```

For confluent, the relevant attributes are `secret.hardwaremanagementuser` and `secret.hardwaremanagementpassword` for SNMPv3, and `secret.snmpcommunity` if SNMPv1.

```confluent
nodegroupattrib switches secret.hardwaremanagementuser=snmp3user secret.hardwaremanagementpassword=Passw0rd12
```



Also in both cases, the software will try to determine the correct interface name from the given description.  For example, if the switch offers `Ethernet17`, then either the literal value `Ethernet17` or simply `17` will suffice.  However, caution is warranted when using breakout cables as you may do with a switch like a G8332 to connect 4 systems to a single QSFP port.  If you simply specify `3`, it would not only consider `Ethernet3` a match, but also `Ethernet1/3`, `Ethernet2/3`, and so forth.  In such a case, it is required to provide the full string `Ethernet3` to avoid confusion between breakout and non-breakout connections.  For the breakout connections, either `2/3` or `Ethernet2/3` would be valid values that are unambiguous.

Note that in in confluent, the interface names that a particular switch uses can be found using the following command:
```confluent
confetty show /networking/macs/by-switch/<switch name>/by-port/
```


For xCAT, this values are in the `switch` table.  The following command is an example of setting the values for a single node:

```xcat
nodech n1 switch.switch=switch1 switch.port=1
```

This can be set at a group level, leveraging formulaic expansion to indicate 42 nodes per switch connected sequentially (n1-n42 on switch1, n43-n84 on switch2, etc):

```xcat
nodegrpch compute switch.switch='|switch(($1-1)/42+1)|' switch.port='|(($1-1)%42+1)|'
```

Note that in order to repeatedly count from 1 to 42 while skipping 0, the above arithmetic is required.  If the node naming scheme were r{rack}u{u}, an alternative may be:

```xcat
nodegrpch compute switch.switch='|switch($1)|' switch.port='|($2)|'
```

To migrate this data to confluent, `makeconfluentcfg` will copy the data over.  Alternatively, the attribute names with confluent can be directly set as follows:

```confluent
nodeattrib n1 net.switch=switch1 net.switchport=1
```

Additionally, if wanting to potentially indicate multiple interfaces and grouping the data together, you can elect to inject a network name of your choosing into the attribute:

```confluent
nodeattrib n1 net.xcc.switch=mgtsw1 net.xcc.switchport=1
```

The same group inheritance and expansion is supported, albeit with a slightly different syntax:

```confluent
nodegroupattrib compute net.switch=switch{(n1-1)/42+1} net.switchport={(n1-1)%42+1}
```

As with xCAT, a different name scheme can be used and extract distinct numbers from the name into different values:

```confluent
nodegroupattrib compute net.switch=switch{n1} net.switchport={n2}
```
