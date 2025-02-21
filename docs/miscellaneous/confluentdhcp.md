---
layout: page
title: Confluent and DHCP interaction
permalink: /documentation/confluentdhcp.html
---

For confluent OS deployment, a specific design goal is improved interoperability with DHCP infrastructure. The result is that a DHCP server
is not required, but also an independent DHCP server can be used on a network.

For a standalone deployment without specific need for a dynamic pool, this doesn't require much consideration, the network will 'just work'.
However, there are some considerations in various scenarios.

# Working with an uncoordinated DHCP server offering dynamic addresses

The node attribute `net.ipv4_method` supports two possible modes for working with a DHCP server on the same network.

 * `firmwaredhcp` delegates address management to the external DHCP server during Network boot by firmware, but static addressing will be used in the OS
 * `dhcp` fully delegates address management to the external DHCP server

In a mostly static environment with a need for dynamic addressing, it is possible to use firmwaredhcp and setting dnsmasq or similar to serve up a dynamic range
without having to coordinate the configuration.

# Working with xCAT configured DHCP server

With xCAT, the biggest potential for conflict is the dynamic range, where xCAT will offer any network boot device a boot payload and potentially conflict.  There are a few strategies:

 * Disabling the dynamic range.  Remove the dynamic ranges entirely from networks table, and either makedhcp -n to recreate dhcpd.conf, or manually comment out the range statements in dhcpd.conf
 * Having devices only do HTTP boot.  xCAT does not support HTTP boot, so nodes doing HTTP boot will not receive offers from xCAT
 * Removing the boot payload from dynamic offers.  In dhcpd.conf, comment/remove the gpxe.no-pxedhcp option as well as filename entries to make the xCAT dhcp server no longer offer boot direction to unknown systems

# How confluent works without a dynamic range

xCAT uses a dynamic range to boot linux on all unknown systems, and then in that linux environment work is done to try to discover the system.  In confluent, there are two discovery strategies:

 * BMC first discovery: Confluent can do discovery based on accessing/configuring BMCs first, allowing traditional discovery and configuration to be possible, even when the system off.  This can succeed even without IPv4 configuration by use of IPv6 link-local addressing.
 * IP-free PXE discovery: When doing PXE driven discovery when the BMC option is unavailable, confluent uses the contents of the DHCPDISCOVER packet to drive discovery, rather than a Linux payload.  This gathers UUID and MAC addresses, which is enough to drive discovery.

