---
layout: page
title: Confluent configuration and troubleshooting notes for Lenovo hardware
permalink: /documentation/confluentconfignotes.html
---

## SN2010 rack view

The SN2010* Ethernet switch is half-wide and 1U tall, but also doesn’t install into an enclosure.  Due to this, it doesn’t fit into the normal way of setting up location information for the confluent nodeattributes for it so that it would be displayed in the rack view in the confluent GUI.  In order to get it to be displayed properly in the confluent GUI rack view (when there are two installed side-by-side in the same rack unit), a dummy enclosure node has to be setup, and the two switches in that rack unit have to have their enclosure node attributes set to that enclosure.  The enclosure.bay nodeattribute should be set to 1 for the switch installed to the left (as seen from the front of the rack) and to 2 for the switch installed in the right.  The following is an example of the confluent nodeattributes to set for this:

    mn10:/opt/exerciser # nodeattrib switch90
    switch90: discovery.policy: open
    switch90: dns.domain: cluster1.e1350
    switch90: enclosure.bay: 1
    switch90: enclosure.manager: switch9091
    switch90: groups: everything

    mn10:/opt/exerciser # nodeattrib switch91
    switch91: discovery.policy: open
    switch91: dns.domain: cluster1.e1350
    switch91: enclosure.bay: 2
    switch91: enclosure.manager: switch9091
    switch91: groups: everything

    mn10:/opt/exerciser # nodeattrib switch9091
    switch9091: discovery.policy: open
    switch9091: dns.domain: cluster1.e1350
    switch9091: groups: everything
    switch9091: location.height: 1
    switch9091: location.rack: CR021.2
    switch9091: location.row: 2
    switch9091: location.u: 41

And here is the result of this in the confluent rack view:

![Confluent rack view]({{site.baseurl}}/assets/confluent_rack_view.png)


## nodeconfig may take a few seconds to reflect submitted changes

When using nodeconfig to submit a system configuration change, it exits when
the target device has accepted the change. However, an endpoint may take some time
to activate the change so that it will be visible when showing the configuration.

## IPv6 and Domain name resolution may not work for Redfish-managed nodes

For SR655 nodes configured to be managed with Redfish, IPv6 and domain name resolution may not work for node attribute values. For example, it is known to not work in the case of the `hardwaremanagement.manager` attribute. In the example below:

    # nodeattrib node1 hardwaremanagement.method
    node1:  hardwaremanagement.method:  redfish

    # nodeattrib node1 hardwaremanagement.manager
    node1:  hardwaremanagement.manager: node1-mgt

Or:
    
    # nodeattrib node1 hardwaremanagement.manager
    node1:  hardwaremanagement.manager: fe80::3ee1:a1ff:fec7:e627%eno1

The domain name `node1-mgt1` will trigger an error on the target TSM, causing the following error:

    # nodefirmware node1
    
    Traceback (most recent call last):
      File "/opt/confluent/bin/nodefirmware", line 166, in <module>
        show_firmware(session)
      File "/opt/confluent/bin/nodefirmware", line 152, in show_firmware
        exitcode |= client.printerror(res['databynode'][node], node)
      File "/opt/confluent/lib/python/confluent/client.py", line 116, in printerror
        sys.stderr.write('{0}: {1}\n'.format(node, res['error']))
    UnicodeEncodeError: 'ascii' codec can't encode characters in position 175-254: ordinal not in range(128)

Or IPv6 will trigger this error:

     # nodefirmware node1
     node1: Unexpected Error: /redfish/v1/Managers/Self:<pre style="font-size:12px; font-family:monospace; color:#8B0000;">[web.lua] Error in RequestHandler, thread: 0x758476e8 is dead.

There are two options to address the problem:


* Use a literal IP address for the node attribute in question:

```
    nodeattrib node1 hardwaremanagement.manager=10.19.67.83
    node1:  10.19.67.13
```

* Switch to IPMI management:

```
    nodeattrib node1 hardwaremanagement.method=ipmi
    node1:  ipmi
```

## Redfish management method not supported on FPC, SMM or SMM2

The Lenovo FPC, SMM and SMM2 chassis management modules do not support redfish--use ipmi for their hardwaremanagement methods.

## xCAT genesis does not include support for Intel E810 or Mellanox ConnectX-6 Lx Ethernet adapters

xCAT genesis does not currently include support for Intel E810 or Mellanox ConnectX-6 Lx Ethernet adapters--confluent genesis should be used instead.

## Occasional privilege errors from confluent commands

Occasionally confluent out-of-band management commands may report "Error: Insufficient privilege level or firmware firewall".  If this occurs, the hardwaremanagement.manager node attribute on the node that the problem occurred on to something other than the actual IP or hostname of the hardwaremanagement manager for that node, and then set it back to the previous (correct) value.  After that the problem should no longer occur.

## XCC web interfaces opened from the confluent web GUI may spontaneously log out when entering the firwmare update page

When opening the XCC web interface for more than one XCC from the confluent GUI web interface, so that the URLs for those XCC web interfaces are forwarded ports with the same IP (the IP of the confluent server), when entering the firmware update page on the XCC web interface, the XCC web interface on one or more of the XCC web interfaces opened this way may spontaneously log out.  To work aruond this issue, either open just one XCC web interface through the confluent GUI or setup a socks proxy to access the XCC web interfaces (or access them directly if the network configuration allows for this) so that each XCC web interface is accessed through a separate IP address.
