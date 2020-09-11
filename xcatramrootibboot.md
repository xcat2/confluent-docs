---
layout: page
title: Booting xCAT ramroot over InfiniBand
permalink: /documentation/xcatramrootibboot.html
---
In the case of xCAT stateless images which network boot from infiniband, the ordering of the interfaces (ib0, ib1, etc) may change during the booting of the ramroot image. The lower order port (typically comparing MAC address) would normally be assigned the interface name ib0. This example assumes that a static DHCP lease was created for the lower order port.

If the image is configured to boot from the lower order port, the port may instead be assigned the interface name ib1, causing the boot to fail. 

If this happens, the solution is to make an addition to the image kernel command line by modifying the bootparams.addkcmdline for the node to include "ip=ib1:dhcp".