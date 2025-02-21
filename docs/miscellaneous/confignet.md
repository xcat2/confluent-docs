---
layout: page
title: Confluent multi interface configuration
permalink: /documentation/confignet.html
---

Confluent profiles initialized as of 3.3 or later contain the `confignet` network configuration facility. It is invoked
in the default firstboot sections of scripted install profiles and onboot sections of diskless profiles.

# Specifiying multiple network interface configuration

The `net.*` attributes may be qualified by name. For example, it's possible to specify `net.management.ipv4_address=172.16.0.{n1}/16` and `net.compute.ipv4_address=172.17.0.{n1}/16`.
The name between `net` and the specific attribute is up to the user and has no particular meaning to confluent apart from the name being used to group settings together.

# Configuring additional interfaces with autosense

If a confluent deployment server is configured for a given subnet, the deploying server will autosense the correct IP subnet and match the group automatically.
```
net.deployment.ipv4_address=1.2.3.4/16
```

# Configuring additional interfacces manually

If autosense is not feasible or not desired, specifiy `net.name.interface_names` to indicate the interface to use with this network configuration.  For example:
```
net.infiniband.interface_names=ib0
net.infiniband.ipv4_address=1.2.3.4/16
```


# Configuring a network interface team

confignet supports configuring teams by specifiying the team mode by, for example, `net.compute.team_mode=lacp`. If the team members are on the same subnet as a confluent deployment servers, the members
may be autodetected. If the member interfaces do not share a subnet with a confluent server, then the names must be explicitly specified in `net.*.interface_names`, e.g. `ib0,ib1`. 

Example of a team that shares a network segment with a confluent server:
```
net.example.team_mode=lacp
net.example.ipv4_address=1.2.3.4/16
```

Example of a team that does not share a network with a confluent server:
```
net.example.team_mode=lacp
net.example.ipv4_address=4.3.2.1/16
net.example.interface_names=eno1,eno2
```

# Features not implemented

The current features are not currently implemented as of this writing:

* VLAN tagging
* Bridging/vSwitch configuration
* Static routes apart from default gateway
