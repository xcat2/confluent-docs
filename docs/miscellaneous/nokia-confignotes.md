---

title: Confluent configuration and troubleshooting notes for Nokia Ethernet switches
---

## Applicable Nokia Ethernet switches and switch OS

The following refers to Nokia Ethernet switch models:

- 7215 IXS-A1
- 7220 IXR-D2L
- 7220 IXR-D3L

running SR Linux 25.10.1.

## Setting up Nokia switches to be managed by confluent
 For Nokia switches to be managed by confluent, the JSON RPC service has to be enabled on the switches.  The steps to do this can be done interactively in SR Linux, however this does require saving the output from some commands to input into others.  To make this easier to set up, the following utility is available for this:

 https://github.com/xcat2/confluent/blob/master/misc/setupnokia.sh


## Configuring Nokia switches for normal L2 operation
 With Nokia SR Linux, configuring switches in normal L2 mode can be more complex than some other switches OS.  The following are some tips on regarding this particular scenario.
 
 To configure the Nokia switches in normal L2 mode, it is recommended to set tagging enabled on the Ethernet interface, and set tagging or no tagging on the subinterfaces.  This is because if tagging is not set on the parent interface, both tagged and untagged frames are accepted, but their association to a VLAN isn't well defined.

### Untagged ports
 With the Ethernet interface set to tagged, then for ports intended for untagged traffic only, then set up only one subinterface and set it as untagged.

### Hybrid ports
 For ports intended as hybrid traffic, setup one subinterface as untagged, and one or more additional subinterfaces as tagged.  Note that the values available to be set for the VLAN when tagged on a subinterface are a single VLAN number, or "optional" or "any".  For the case of "option" untagged traffic is accepted to the subinterface as well, and again this can result in a non-well defined VLAN association for the frame.  For the "any" value, that can be useful for carrying all VLANs, particularly for ISLs, but to carry a subset of all VLANs then a separate subinterface has to be defined for each tagged VLAN.

### Trunk ports
 Ports intended as "trunk" (tagged) only traffic are configured the same as the hybrid case above, except no untagged subinterface is defined.

### MAC Network instances
 Note that for the subinterfaces to then be allowed to pass L2 traffic between each other, they have to be configured onto a common MAC network instance.

<br>
<br>
<br>
 Given all of the above, here is a typical case--this has ports 1/1 and 1/2 as untagged interfaces, ports 1/3 and 1/4 as hybrid interfaces, and ports 1/5 and 1/6 as trunk interfaces.  Ports 1/1 and 1/3 untagged traffic is routed to VLAN 101, ports 1/2 and 1/4 untagged traffic is routed to VLAN 102, and ports 1/3 and 1/4 tagged traffic is enabled for VLANs 103 and n109 (depending on the VLAN tag in the ingress frames).  Finally ports 1/5 and 1/6 are configured to carry VLANs 101, 102, 103 and n109, all tagged only:

 Note, using the subinterface name corresponding to the VLAN with which it would be associated isn't necessary, but is used as a useful convention in the example below.

    set / interface ethernet-1/1 admin-state enable
    set / interface ethernet-1/1 vlan-tagging true
    set / interface ethernet-1/1 subinterface 101 type bridged
    set / interface ethernet-1/1 subinterface 101 admin-state enable
    set / interface ethernet-1/1 subinterface 101 vlan encap untagged
    set / interface ethernet-1/2 admin-state enable
    set / interface ethernet-1/2 vlan-tagging true
    set / interface ethernet-1/2 subinterface 102 type bridged
    set / interface ethernet-1/2 subinterface 102 admin-state enable
    set / interface ethernet-1/2 subinterface 102 vlan encap untagged
    set / interface ethernet-1/3 admin-state enable
    set / interface ethernet-1/3 vlan-tagging true
    set / interface ethernet-1/3 subinterface 101 type bridged
    set / interface ethernet-1/3 subinterface 101 admin-state enable
    set / interface ethernet-1/3 subinterface 101 vlan encap untagged
    set / interface ethernet-1/3 subinterface 103 type bridged
    set / interface ethernet-1/3 subinterface 103 admin-state enable
    set / interface ethernet-1/3 subinterface 103 vlan encap single-tagged vlan-id 103
    set / interface ethernet-1/3 subinterface 109 type bridged
    set / interface ethernet-1/3 subinterface 109 admin-state enable
    set / interface ethernet-1/3 subinterface 109 vlan encap single-tagged vlan-id 109
    set / interface ethernet-1/4 admin-state enable
    set / interface ethernet-1/4 vlan-tagging true
    set / interface ethernet-1/4 subinterface 102 type bridged
    set / interface ethernet-1/4 subinterface 102 admin-state enable
    set / interface ethernet-1/4 subinterface 102 vlan encap untagged
    set / interface ethernet-1/4 subinterface 103 type bridged
    set / interface ethernet-1/4 subinterface 103 admin-state enable
    set / interface ethernet-1/4 subinterface 103 vlan encap single-tagged vlan-id 103
    set / interface ethernet-1/4 subinterface 109 type bridged
    set / interface ethernet-1/4 subinterface 109 admin-state enable
    set / interface ethernet-1/4 subinterface 109 vlan encap single-tagged vlan-id 109
    set / interface ethernet-1/5 admin-state enable
    set / interface ethernet-1/5 vlan-tagging true
    set / interface ethernet-1/5 subinterface 101 type bridged
    set / interface ethernet-1/5 subinterface 101 admin-state enable
    set / interface ethernet-1/5 subinterface 101 vlan encap single-tagged vlan-id 101
    set / interface ethernet-1/5 subinterface 102 type bridged
    set / interface ethernet-1/5 subinterface 102 admin-state enable
    set / interface ethernet-1/5 subinterface 102 vlan encap single-tagged vlan-id 102
    set / interface ethernet-1/5 subinterface 103 type bridged
    set / interface ethernet-1/5 subinterface 103 admin-state enable
    set / interface ethernet-1/5 subinterface 103 vlan encap single-tagged vlan-id 103
    set / interface ethernet-1/5 subinterface 109 type bridged
    set / interface ethernet-1/5 subinterface 109 admin-state enable
    set / interface ethernet-1/5 subinterface 109 vlan encap single-tagged vlan-id 109
    set / interface ethernet-1/6 admin-state enable
    set / interface ethernet-1/6 vlan-tagging true
    set / interface ethernet-1/6 subinterface 101 type bridged
    set / interface ethernet-1/6 subinterface 101 admin-state enable
    set / interface ethernet-1/6 subinterface 101 vlan encap single-tagged vlan-id 101
    set / interface ethernet-1/6 subinterface 102 type bridged
    set / interface ethernet-1/6 subinterface 102 admin-state enable
    set / interface ethernet-1/6 subinterface 102 vlan encap single-tagged vlan-id 102
    set / interface ethernet-1/6 subinterface 103 type bridged
    set / interface ethernet-1/6 subinterface 103 admin-state enable
    set / interface ethernet-1/6 subinterface 103 vlan encap single-tagged vlan-id 103
    set / interface ethernet-1/6 subinterface 109 type bridged
    set / interface ethernet-1/6 subinterface 109 admin-state enable
    set / interface ethernet-1/6 subinterface 109 vlan encap single-tagged vlan-id 109
    set / network-instance bridge-vlan101 type mac-vrf
    set / network-instance bridge-vlan101 admin-state enable
    set / network-instance bridge-vlan101 interface ethernet-1/1.101
    set / network-instance bridge-vlan101 interface ethernet-1/3.101
    set / network-instance bridge-vlan101 interface ethernet-1/5.101
    set / network-instance bridge-vlan101 interface ethernet-1/6.101
    set / network-instance bridge-vlan102 type mac-vrf
    set / network-instance bridge-vlan102 admin-state enable
    set / network-instance bridge-vlan102 interface ethernet-1/2.102
    set / network-instance bridge-vlan102 interface ethernet-1/4.102
    set / network-instance bridge-vlan102 interface ethernet-1/5.102
    set / network-instance bridge-vlan102 interface ethernet-1/6.102
    set / network-instance bridge-vlan103 type mac-vrf
    set / network-instance bridge-vlan103 admin-state enable
    set / network-instance bridge-vlan103 interface ethernet-1/3.103
    set / network-instance bridge-vlan103 interface ethernet-1/4.103
    set / network-instance bridge-vlan103 interface ethernet-1/5.103
    set / network-instance bridge-vlan103 interface ethernet-1/6.103
    set / network-instance bridge-vlan109 type mac-vrf
    set / network-instance bridge-vlan109 admin-state enable
    set / network-instance bridge-vlan109 interface ethernet-1/3.109
    set / network-instance bridge-vlan109 interface ethernet-1/4.109
    set / network-instance bridge-vlan109 interface ethernet-1/5.109
    set / network-instance bridge-vlan109 interface ethernet-1/6.109

### LACP Link aggregation
 To setup LACP link-aggregations, Ethernet interfaces need to be set to be members of a lag as follows:

    set / interface ethernet-1/49 admin-state enable
    set / interface ethernet-1/49 ethernet aggregate-id lag1
    set / interface ethernet-1/50 admin-state enable
    set / interface ethernet-1/50 ethernet aggregate-id lag1
    set / interface ethernet-1/51 admin-state enable
    set / interface ethernet-1/51 ethernet aggregate-id lag1
    set / interface ethernet-1/52 admin-state enable
    set / interface ethernet-1/52 ethernet aggregate-id lag1

 The name "lag1" is arbitrary--"lag1" is used in this example just as a reminder that this is the first LAG setup on this switch.

 Next, the lag-type has to be set to LACP, the member-speed target has to be set, and the LACP admin-key has to be set:

    set / interface lag1 lag lag-type lacp
    set / interface lag1 lag member-speed 10G
    set / interface lag1 lag lacp admin-key 1

 Then then subinterfaces for the lag have to be defined as described above for Ethernet interfaces.  In this example VLANs 101, 102, 103 and 109 are all set as tagged:

    set / interface lag1 admin-state enable
    set / interface lag1 vlan-tagging true
    set / interface lag1 subinterface 101 type bridged
    set / interface lag1 subinterface 101 admin-state enable
    set / interface lag1 subinterface 101 vlan encap  single-tagged vlan-id 101
    set / interface lag1 subinterface 102 type bridged
    set / interface lag1 subinterface 102 admin-state enable
    set / interface lag1 subinterface 102 vlan encap  single-tagged vlan-id 102
    set / interface lag1 subinterface 103 type bridged
    set / interface lag1 subinterface 103 admin-state enable
    set / interface lag1 subinterface 103 vlan encap  single-tagged vlan-id 103
    set / interface lag1 subinterface 109 type bridged
    set / interface lag1 subinterface 109 admin-state enable
    set / interface lag1 subinterface 109 vlan encap  single-tagged vlan-id 109

 And finally the subinterfaces of the lag have to be associated with a network instance as with the subinterfaces of an Ethernet interface:

    set / network-instance bridge-vlan101 type mac-vrf
    set / network-instance bridge-vlan101 admin-state enable
    set / network-instance bridge-vlan101 interface ethernet-1/10.101
    set / network-instance bridge-vlan101 interface ethernet-1/11.101
    set / network-instance bridge-vlan101 interface ethernet-1/12.101
    set / network-instance bridge-vlan101 interface ethernet-1/13.101
    set / network-instance bridge-vlan101 interface ethernet-1/16.101
    set / network-instance bridge-vlan101 interface ethernet-1/18.101
    set / network-instance bridge-vlan101 interface ethernet-1/19.101
    set / network-instance bridge-vlan101 interface ethernet-1/21.101
    set / network-instance bridge-vlan101 interface ethernet-1/22.101
    set / network-instance bridge-vlan101 interface ethernet-1/23.101
    set / network-instance bridge-vlan101 interface ethernet-1/24.101
    set / network-instance bridge-vlan101 interface ethernet-1/37.101
    set / network-instance bridge-vlan101 interface ethernet-1/40.101
    set / network-instance bridge-vlan101 interface ethernet-1/45.101
    set / network-instance bridge-vlan101 interface ethernet-1/46.101
    set / network-instance bridge-vlan101 interface ethernet-1/47.101
    set / network-instance bridge-vlan101 interface lag1.101

## nodesensors current, voltage and power reporting for Nokia switches
 Currently nodesensors reports 0 for input current, voltage and power for Nokia 7215 IXS-A1, 7220 IXR-D2L and 7220 IXR-D3L switches:

    [root@n790 ~]# nodesensors switch173
    switch173: Slot A Temperature: 36 °C
    switch173: Fan Tray 6: 51 %
    switch173: Fan Tray 6: 51 %
    switch173: Fan Tray 6: 51 %
    switch173: Fan Tray 6: 51 %
    switch173: Fan Tray 6: 51 %
    switch173: Fan Tray 6: 51 %
    switch173: Power Supply 1 Health:
    switch173: Power Supply 1 Temperature: 33 °C
    switch173: Power Supply 1 Current: 0.00 A
    switch173: Power Supply 1 Power: 0.00 W
    switch173: Power Supply 1 Voltage: 0.00 V
    switch173: Power Supply 2 Health:
    switch173: Power Supply 2 Temperature: 30 °C
    switch173: Power Supply 2 Current: 0.00 A
    switch173: Power Supply 2 Power: 0.00 W
    switch173: Power Supply 2 Voltage: 0.00 V

 