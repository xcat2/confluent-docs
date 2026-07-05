---
title: nodemedia caveats
tags:
  - hardware
---

When using the "redfish" hardware management method, the `nodemedia attach` function
doesn't work with HTTPS or NFS when using the Lenovo XCC service processor.  To use
these protocols with the Lenovo XCC service processor, use the IPMI hardware
management method.  Alternatively, the HTTP protocol can be used with the redfish
hardware management method as well.
