---
layout: page
title: Installing EL7 over OmniPath
permalink: /documentation/el7opainstall.html
---

It is possible with the Lenovo xCAT and confluent software to install
EL7 over Omnipath.

## Preparing for OPA install

It is recommended to make groups to describe the required changes.  For example, this
document will assume an 'opa' group.

### Net config fixup postscript

OPA network configuration does not work as expected out of the box.  Here is a postscript to fix:

    # cat /install/postscripts/opaboot 
    #!/bin/sh
    echo 'install hfi1 /sbin/modprobe --ignore-install hfi1; sleep 10; /sbin/modprobe ib_ipoib' > /etc/modprobe.d/hfi.conf
    echo 'ACTION=="add", SUBSYSTEM=="net", ATTR{type}=="32", RUN+="/sbin/ifup %E{INTERFACE}"' > /etc/udev/rules.d/60-ib.rules

### xCAT configuration

Define the opa group to have the required install argument changes, interface name, and to invoke
the postscript shown above:

    # nodegrpch opa bootparams.addkcmdline="rd.driver.pre=ib_ipoib rd.net.timeout.carrier=80 rd.bootif=0" noderes.primarynic=ib0 postscripts.postscripts=opaboot

### confluent configuration

xCAT does not understand how to collect addresses for omnipath.  Enable confluent collection of the
omnipath mac addresses:

    # nodegroupdefine opa net.opa.bootable=1 discovery.policy=permissive,pxe

### Modifying the install image

The EL install media is missing required hotplug firmware.  Here you can donate firmware present on your deployment server to the installer:  

    # ls /usr/lib/firmware/hfi1_* | cpio -H newc -o | xz -9 -C crc32 >> /install/centos7.4/x86_64/images/pxeboot/initrd.img

## Gathering OPA hardware addresses and putting into xCAT

When confluent is configured to do 'zero power' discovery, it can collect mac addresses for boot devices
such as OmniPath without having to describe the fabric topology.  This document assumes familiarity with [Node discovery and autoconfiguration with confluent]({{ site.baseurl }}/documentation/confluentdisco.html) and that the management network discovery has been configured..

Have the systems attempt to network boot over OPA.  For example:

    # nodeboot opa net

After the system attempts PXE boot, the discovery mechanism should provide attributes suitable for feeding to xCAT:

    # nodeattrib d6 net.opa.hwaddr
    d6: net.opa.hwaddr: 00:11:75:01:01:0d:cd:c7

To actually populate xCAT, create a list of nodech commands to run:

    # nodeattrib opa net.opa.hwaddr|awk '{print $1 "mac.mac=" $3}'|sed -e 's/^/nodech /' -e 's/:/ /' > setopamacs.sh
    # source setopamacs.sh

## Performing the install

At this point, install can proceed as any normal install:

    # nodeset d6 osimage=centos7.4-x86_64-install-compute
    # nodeboot d6 net


