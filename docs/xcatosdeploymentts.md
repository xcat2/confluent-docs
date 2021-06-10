---
layout: page
title: Troubleshooting issues with xCAT OS deployment
permalink: /documentation/xcatosdeploymenttroubleshooting.html
---
# xCAT OS deployment or diskless image boot fails with message regarding ib=dhcp

The ib=dhcp kernel command line argument is added by default to the bootloader configuration files on the xCAT management server at /tftpboot/xcat/xnba/nodes/<node>* .  When a kernel command line paramer is set to set the ip= argument more explicitly, for example using bootparams.addkcmdline for boot over IB, then the ip=dhcp argument in the kernel command line arguments in the bootloader configuration file is superfluous and can cause problems.  To work-around this error the "ip=dhcp" entry in the bootloader configuration file should be removed.  Note, this will have to be re-done, after performing nodeset.

