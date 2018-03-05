---
layout: page
title: xCAT configuration notes
permalink: /documentation/xcatconfignotes.html
---

If using xCAT's bmcsetup to manage the port of Lenovo equipment, this can be set by the `bmcport` attribute in `chdef` or `ipmi.bmcport` in `nodech`.

Generally speaking, a value of '1' will refer to the dedicated port on Lenovo equipment, and `0` will refer to shared, with some exceptions:
  * For SD650 systems, the shared onboard port is designated by `0 2`
  * If using an ML2 adapter, the shared port is `2 0`
