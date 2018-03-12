---
layout: page
title: Discovery with chained ThinkSystem D2 enclosures
permalink: /documentation/chainedsmmdiscovery.html
---

The ThinkSystem D2 enclosure (which houses SD530 servers) has a variant of System Management Module (SMM) that supports chaining
enclosures together.  For the usual discovery flow in confluent, it is not obvious how this should work.  

There are two strategies.  The [first](#fully-out-of-band-discovery) is more resilient and easier, but requires confluent 1.8.0 together with SMM firmware 1.04.

The [other](#pxe-driven-discovery) works with older chained SMM firmware, but requires nodes to attempt PXE boot.

# Fully out of band discovery

* The ethernet switch must have LLDP enabled
* Confirm that you have confluent version 1.8.0, and that all SMMs will at
  least have firmware 1.04
* Set the `net.switch` and `net.switchport` attributes *only* on the SMM directly connected to a switch.
* For other SMMs, set `enclosure.extends` attribute to a directly connected adjacent SMM.  For example, with
  three SMMs, smm1 would have `net` attributes to describe connecting to switch, smm2 would have 
  `enclosure.extends==smm1`, and smm3 would have `enclosure.extends==smm2`
* It is *not* required to have `net` attributes defined for any of the nodes.
* Discovery proceeds normally in accordance with the general documentiation of
  discovery [here]({{site.baseurl}}/documentaction/confluentdisco.html)


# PXE Driven Discovery
If using older SMM firmware in a chain, or else wanting to drive discovery from the node network side
rather than the SMM side, the method with PXE may be used.

* Do *not* set any switch attributes for any SMM (verify by running `nodeattrib <noderange> net` and seeing they are all empty).
* Ensure that all the nodes have correct enclosure.manager/enclosure.bay attribute (`nodeattrib <noderange> enclosure`)
* All the nodes must have either `permissive,pxe` or `open` as the `discovery.policy` attribute (`nodeattrib <noderange> discovery.policy=permissive,pxe`) to enable
  PXE discovery.  The recommended discovery policy is `permissive,pxe` for a balance of automatic behavior versus security.
* Provide net.\*.switch/net.\*.switchport values for the ethernet ports that will PXE boot of the SD530 servers
* Induce the servers to PXE boot (generally by turning them on).  The PXE attempt need not be able to succeed, but confluent must be on the same VLAN (regardless of IP configuration).

The procedure will then automaticly proceed as follows:

* As a matter of course, `nodediscover list` should show `lenovo-xcc` devices, without identifying them.
* When the server transmits the DHCPDISCOVER packet to initiate PXE, confluent will detect the packet and begin a search of the ethernet switches for a match
* When the node identity is determined, it will commit to that node attribute the UUID of the node as the attribute `id.uuid`
* If there is a detected XCC that matches the uuid, that XCC gets discovered and configured appropriately, and the SMM is enabled, if not previously enabled.
* When an SMM is detected that has a UUID that matches the enclosure UUID indicated by a relevant XCC, that SMM is discovered and autoconfigured.

Trobuleshooting:

* If no lenovo-smm devices are appearing, it may be worth doing `nodediscover rescan`
* It may be the case that the XCCs were otherwise configured without enabling SMM.  To rediscover XCC to try to enable SMM, `nodeattrib <noderange> pubkeys.tls_hardwaremanager=`.  This will induce the SMM enablement process that is normally part of XCC discovery.
* If using older SD530 firmware, confluent may not be able to link XCC and SMM.  If this is the case, XCC discovery sholud still work and enable XCC firmware updates to proceed.
