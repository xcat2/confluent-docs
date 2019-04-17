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

## Gathering OPA hardware addresses and putting into xCAT

When confluent is configured to do 'zero power' discovery, it can collect mac addresses for boot devices
such as OmniPath without having to describe the fabric topology.  This document assumes familiarity with [Node discovery and autoconfiguration with confluent]({{ site.baseurl }}/documentation/confluentdisco.html) and that the management network discovery has been configured..

Have the systems attempt to network boot over OPA.  For example:

    # nodeboot opa net

After the system attempts PXE boot, the discovery mechanism should provide attributes suitable for feeding to xCAT.  The following commands can help show this:

```
# nodediscover list -t pxe-client -f node,serial,mac
 Node|   Serial|                     Mac
-----|---------|------------------------
 opa1| J1001PNE| 00:11:75:01:01:0d:cd:c7
 opa1| J1001PNE|       08:94:ef:50:23:60


# nodeattrib opa1 net.opa.hwaddr
opa1: net.opa.hwaddr: 00:11:75:01:01:0d:cd:c7
```

To actually populate xCAT, the confluent2xcat command may be used.  If the node is not yet defined to xCAT at all:
```
[root@mgt ~]# confluent2xcat opa1 -o opa.stanza
[root@mgt ~]# mkdef -z < opa.stanza 
1 object definitions have been created or modified.
```

Or to add the mac address to existing node, the mac.csv may be useful:
```
[root@mgt ~]# confluent2xcat opa -m mac.csv
[root@mgt ~]# tabrestore -a mac.csv 
```


## Performing the install

At this point, install can proceed as any normal install:

    # nodeset opa1 osimage=centos7.4-x86_64-install-compute
    # nodeboot opa1 net

## Accessing without fabric

If an issue occurs where the server is up, but the fabric is unreachable and login or scp is required,
a backup path is available through the XCC:

    # ssh -p 3389 $(noderun -n opa1 echo {bmc})
    Last login: Wed Apr 16 13:09:47 2017 from 192.168.1.1
    [root@opa1 ~]# 

All ssh capabilities are available, including scp:

    # scp -P 3389 testfile $(noderun -n opa1 echo [{bmc}]):~
    testfile                                        100%   16MB   2.7MB/s   00:06    

As well as rsync:

    # rsync -ave 'ssh -p 3389' testfile $(noderun -n opa1 echo [{bmc}]):/


