---
layout: post
title:  3.6.0 Confluent release
categories: hpc update
---

# Genesis profiles must be re-generated

The new genesis has an incompatibility with existing genesis profile.  `osdeploy initialize -g` must
be done to re-do the genesis profile, after moving or removing the existing genesis profile.

# A self-check has been added to help identify common configuration issues

A new command `confluent_selfcheck` has been added to examine and highlight configuration issues that
are commonly encountered.

# Remote discovery through new affluent version

The new affluent offers expanded capabilities for auto-detect and enhanced security of discovery.  This also enables
the switch to extend the reach of confluent discovery to routed networks.  With this feature, confluent can discover Lenovo SMMv2 and xClarity Controller 2 systems, regardless of VLAN or VRF.
In order to use, update affluent on the switch and use `nodediscover subscribe <switchname>` to subscribe to discovery updates from a switch.

# New `verified` discovery.policy

When using the aforementioned switch driven discovery thrugh `subscribe` on nodediscover, a new policy `verified` is available for discovery.policy.  This allows for a node replacement to be fully automated,
if and only if the new node certificate is vetted by the directly attached ethernet switch running affluent.  This only works with Lenovo SMMv2 and Lenovo xClarity 2 based systems.t

# Registration of remote subnets in discovery

xClarity Controller devices may not be added by IP or Subnet to scan using `nodediscover register`.  This brings such
devices into the nodediscover list for potential assignment.  This can take an IP address, subnet (address/prefix syntax), or
range of IP addresses (address1-address2).

# The hardwaremanagement.manager now accepts CIDR syntax

To facilitate remote setup with static addressing, the `hardwaremanagement.manager` attribute can now have CIDR to indicate
the subnet prefix lingth (1.2.3.4/24).  This can be used with either the `register` or `subscribe` discovery targets.

# Remote networks may now be used for operaing system deployment

A new attribute `trusted.subnets` can be used to indicate remote subnets that are allowed to acquire a node API token when the deployment api is armed.  Additionally, a standalone network may redirect boot services to a remote confluent server by offering the IP of a confluent server as 'next-server', and also sending 'PXEClient' as the vendor client identifier. Alternatively, a
number of URLs have been added to facilitate delegated HTTP boot (confluent-api/boot/by-mac/${mac:hexhyp}/ipxe or confluent-api/boot/by-uuid/${uuid}/ipxe).  In the latter case the DHCP server can offer an ipxe client that url and confluent will handle
routing to the correct profile.  This is supported in select profiles, and currently requires confluent=<confluent ip> in the
profile.yaml indicated kernel arguments.

# New attribute to automatically execute nodeconfig on discovery

The new attribute `discovery.nodeconfig` allows specifying arguments to nodeconfig to automatically apply upon discovery
of a new or replaced system.

# New ipv4_method to suppress any PXE or HTTP boot offers

Setting `net.ipv4_method` to `firmwarenone` will now suppress any offer, even if the deployment situation indicates an offer
should be made. This enables a fully externally managed DHCP configuration including boot filename for those that desire
to externally manage it.

# Support rebase of OS profiles moving forward

When updating confluent, to date there has been no mechanism to help bring updates to existing OS profiles.  From 3.6 forward,
the `osdeploy rebase` facility is added to enable an administrator to ask that the profile be analyzed for updated content
from rpm, skipping any customized files.


# Add support for custom roles on BMC devices

In addition to the defined roles for users on BMCs, support use of 'custom.<rolename>` to enable user to use custom roles created on BMCs.

# Suse 15 confluent is moved to python 3

Migration has been implemented to take Python 2 data and convert to Python 3 on upgrade.  With this, Suse 15 has been changed
to go to python 3 for new and upgraded installations.

# Support for systems with xClarity Controller 2 has been added

New Lenovo servers featuring xClarity Controller 2 are now supported by discovery.

# ESXi 8 deployment added

Confluent can now deploy ESXi 8 systems

# Support opening consoles in standalone windows

The `nodeconsole` command now has a `-w` argument to request that the target nodes be opened in separate windows.

# Fixes for IPv4-free deployment

Deployment was failing for some IPv6-only environments, this has been corrected to enable an IPv6 deployment to fully complete
without an IPv4 address in place at all.

# The Web UI port forwarding feature is now anchored from port 3900

Previously, when doing port forwarding for a GUI client, a random port assignd by the OS was used. The behavior is changed
to now go from port 3900 until the next available port, making firewall rules more reasonable for those that
want to preserve the forwarding feature.  Firewall rules may now specify from port 3900 to some number based on how
many forwards they anticipate needing.

# Package repositories may now be available while modifying a diskless image.

When running `imgutil exec`, an attempt is made to connect the build package repositories to the runtime environment.
Point dnf to the configuration directory in /tmp/ to leverage the external repositories.

# Improve memory consumption in networks with large numbers of misbehaving SSDP implementations

Large numbers of poorly behaving SSDP implementations could induce memory pressure on confluent.  Improve confluent's SSDP
snooping to perform better in such circumstances.


