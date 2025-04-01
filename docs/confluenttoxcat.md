---
layout: page
title: Using confluent discovery to feed xCAT configuration
permalink: /documentation/confluenttoxcat.html
toc: true
---

While xCAT has its own discovery mechanism, in some scenarios confluent
discovery may be desirable in an otherwise xCAT environment.  For example,
confluent does not require a dynamic range and does not require net-snmp-perl.
Additionally, confluent supports standby power discovery in a number of scenarios,
enabling management and console access prior to turning on the system.

# Preparing for PXE mac collection

In order to direct confluent to retain PXE mac addresses, simply set the `net.bootable` attribute to 1 and ensure that `discovery.policy` includes PXE:

    # nodegroupattrib everything discovery.policy=permissive,pxe net.bootable=1

# Perform normal confluent discovery

Confluent discovery may be done against the BMC device or against PXE attempts. If using the network switch as a reference for discovery, be sure
to use the dedicated management port switch and port for standby power discovery, and the network boot port switch and port if doing PXE. Detailed
procedures on a few strategies for discovery are:

* [Discovering systems attached to ethernet switches]({{site.baseurl}}/documentation/confluentswitchdisco.html)
* [Discovering systems in enclosures]({{site.baseurl}}/documentation/confluentenclosuredisco.html)
* [Discovering systems manually]({{site.baseurl}}/documentation/confluentnodeassign.html)

# Populating xCAT with node information

Confluent has a command called `confluent2xcat` to export confluent data to xCAT. It can generate one of two files.

In order to generate a 'stanza' format file for mkdef (pulling in confluent group membership and other information):

    # confluent2xcat d1-d8 -o nodes.stanza

In order to generate a CSV of node and mac addresses suitable for tabrestore mac:

    # confluent2xcat d1-d8 -m mac.csv


