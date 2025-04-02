---
layout: page
title: xCAT configuration notes
permalink: /documentation/xcatconfignotes.html
---

* [Installing EL7 with RSTe support](el7rste.md)
* [Installing SLES12 with RSTe support](sles12rste.md)

If using xCAT's bmcsetup to manage the service processor port on Lenovo systems, that is, whether the dedicated management port will be used or the service processor management traffic will be carried over the same port as what is used for "normal" network traffic (shared mode), this can be set by the `bmcport` attribute in `chdef` or `ipmi.bmcport` in `nodech`.

Generally speaking, a value of `1` will refer to the dedicated port on Lenovo equipment, and `0` will refer to shared, with some exceptions:
  * For SD650 systems, the shared on-board port is designated by `0 2`
  * If using an ML2 adapter, the shared port is `2 0`
  * For SR645 systems, the shared OCP port (port 1) is designated by `2 0`