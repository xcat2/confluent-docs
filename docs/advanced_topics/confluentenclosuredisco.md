---
layout: page
title: Confluent discovery of Enclosure based systems
permalink: /documentation/confluentenclosuredisco.html
---

When discovering SD530 servers with an SMM, the enclosure may be used as an indication
of how location based discovery should go.

For the SD530, ensure that `enclosure.manager` indicates a node meant to represent the SMM in the chassis, and
that `enclosure.bay`  is set to indicate the bay in the chassis. For example:

    # nodeattrib n1 enclosure.manager=smm1 enclosure.bay=1

As with all attributes, this may be set at group level using formulaic expansion to vary the values per node if desired.

The SMM node could in turn have `net.switch` and `net.switchport` set according to its location if directly connected to switches:

    # nodeattrib smm1 net.switch=r4e1 net.switchport=35

For chained enclosures, for all enclosures not directly connected to the switch, use the `enclosure.extends` to indicate the next
enclosure the SMM would need to use to reach the switch:

    # nodeattrib smm2 enclosure.extends=smm1
    # nodeattrib smm3 enclosure.extends=smm2

With that, discovery will proceed identically to the procedure in [using switch based discovery]({{site.baseurl}}/documentation/confluentswitchdisco.html)
