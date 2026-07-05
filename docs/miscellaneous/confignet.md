---
title: Confluent multi interface configuration
tags:
  - networking
---

Confluent profiles initialized as of 3.3 or later contain the `confignet` network configuration facility. It is invoked
in the default firstboot sections of scripted install profiles and onboot sections of diskless profiles.

## Specifiying multiple network interface configuration

Every `net.*` attribute may optionally be qualified with a name between `net` and the attribute itself. For example,
it's possible to specify `net.management.ipv4_address=172.16.0.{n1}/16` and `net.compute.ipv4_address=172.17.0.{n1}/16`.
The name between `net` and the specific attribute (`management` and `compute` above) is chosen freely by the
administrator; confluent does not interpret it, it exists only to group together the attributes that describe one
logical network interface so they can be set and referenced as a unit. The unqualified, bare form of an attribute (e.g.
`net.ipv4_address`) is equivalent to using a blank name, and by convention describes the primary interface used for
deployment.

Any `net.*` attribute documented in [Node Attributes](../user_reference/node_attributes.md) (`hostname`,
`interface_names`, `ipv4_address`, `ipv4_gateway`, `ipv6_address`, `ipv6_gateway`, `mtu`, `vlan_id`, `team_mode`, and so
on) can be qualified this way, and a node may have any number of named interfaces defined independently of one another,
e.g. `net.management.*` and `net.compute.*` describe two entirely separate interfaces on the same node.

It is recommended to pick a name that documents the interface's purpose, for example `ib1-io` for a second InfiniBand
port dedicated to an "io" fabric. Here is a more complete example, setting up such an interface on a group of nodes:

```console
# nodegroupattrib compute net.ib1-io.hostname='{node}-ib1-io' net.ib1-io.interface_names=ibp35s0 \
    net.ib1-io.ipv4_address='10.10.{201+(87+4*n1)/256}.{(87+4*n1)%256}/20' net.ib1-io.vlan_id=0x0001
```

Listing the group afterwards shows the expressions as stored on the group (they are only evaluated per node, so the
group listing shows them unevaluated):

```console
# nodegroupattrib compute
compute: net.ib1-io.hostname:  (will derive from expression {node}-ib1-io)
compute: net.ib1-io.interface_names: ibp35s0
compute: net.ib1-io.ipv4_address:  (will derive from expression 10.10.{201+(87+4*n1)/256}.{(87+4*n1)%256}/20)
compute: net.ib1-io.vlan_id: 0x0001
```

Breaking down what each attribute is doing:

* `net.ib1-io.hostname` derives a distinct hostname per node for this interface from the node name, using the `{node}`
  [attribute expression](../user_reference/attributeexpressions.md) syntax, e.g. node `n12` gets `n12-ib1-io`.
* `net.ib1-io.interface_names` pins this network definition to a specific device name (`ibp35s0`) instead of relying on
  autosense, which is necessary when the interface is not on a subnet a confluent server can autodetect (see below).
* `net.ib1-io.ipv4_address` derives an address, with a `/20` prefix, from an expression based on the numeric portion of
  the node name, spreading nodes across a contiguous range of addresses.
* `net.ib1-io.vlan_id` sets the InfiniBand PKEY to place the interface on the correct partition; either hexadecimal (as
  shown) or decimal is accepted.

For node `n12`, `nodeattrib n12 --blame` would show the resolved values actually applied:

```console
# nodeattrib n12 --blame
n12: net.ib1-io.hostname: n12-ib1-io (inherited from group compute, derived from expression "{node}-ib1-io")
n12: net.ib1-io.interface_names: ibp35s0 (inherited from group compute)
n12: net.ib1-io.ipv4_address: 10.10.201.135/20 (inherited from group compute, derived from expression
"10.10.{201+(87+4*n1)/256}.{(87+4*n1)%256}/20")
n12: net.ib1-io.vlan_id: 0x0001 (inherited from group compute)
```

## Configuring additional interfaces with autosense

If a confluent deployment server is configured for a given subnet, the deploying server will autosense the correct IP
subnet and match the group automatically.
```text
net.deployment.ipv4_address=1.2.3.4/16
```

## Configuring additional interfaces manually

If autosense is not feasible or not desired, specify `net.name.interface_names` to indicate the interface to use with
this network configuration.  For example:
```text
net.infiniband.interface_names=ib0
net.infiniband.ipv4_address=1.2.3.4/16
```


## Configuring a network interface bond/team

`confignet` supports configuring bonded/teamed interfaces by specifying the mode via, for example,
`net.compute.team_mode=lacp`. The `team_mode` name is used regardless of whether the resulting OS configuration will be
a Linux "bond" or a "team"; confluent picks the mechanism appropriate for the deployed OS. If the member interfaces are
on the same subnet as a confluent deployment server, the members may be autodetected. If the member interfaces do not
share a subnet with a confluent server, then the member device names must be explicitly specified in
`net.*.interface_names`, e.g. `ib0,ib1`.

Example of a bond/team that shares a network segment with a confluent server:
```text
net.example.team_mode=lacp
net.example.ipv4_address=1.2.3.4/16
```

Example of a bond/team that does not share a network with a confluent server, explicitly naming its two member
interfaces:
```text
net.example.team_mode=lacp
net.example.ipv4_address=4.3.2.1/16
net.example.interface_names=eno1,eno2
```

## Features not implemented

The current features are not currently implemented as of this writing:

* Bridging/vSwitch configuration
* Static routes apart from default gateway
