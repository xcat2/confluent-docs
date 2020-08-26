---
layout: page
title: Confluent configuration notes for Lenovo hardware
permalink: /documentation/confluentconfignotes.html
---

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