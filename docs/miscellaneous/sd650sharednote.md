---
layout: page
title: Configured for shared port in SD650 in xCAT
permalink: /documentation/sd650sharednote.html
---

The SD650 water cooled system requires the following value for the `ipmi.bmcport` field of the node
to induce bmcsetup to correctly move the XCC to the shared port.

The value can be set by the following command, if your SD650 are in a group called `dwc`:

    nodegrpch dwc ipmi.bmcport=`0 2'
