---
layout: page
title: Installing EL7 over InfiniBand
permalink: /documentation/el7ibinstall.html
toc: true
---

This covers the process of EL7 deployment on a cluster using only InfiniBand.

## Preparing for InfiniBand install

It is recommended to make groups to describe the required changes.  For example, this
document will assume an 'ib' group.

### Setting static address mode

InfiniBand deployment is only supported in static mode.  Use the following command to have xCAT do static addressing:

   # chtab key=managedaddressmode site.value=static

### Net config fixup postscript

InfiniBand network configuration does not work as expected out of the box.  If not installing Mellanox OFED, the following is an example of a
postscript that can be added to correct that behavior:

    # cat /install/postscripts/fixipoib
    echo 'install mlx5_core /sbin/modprobe --ignore-install mlx5_core; /sbin/modprobe mlx5_ib; /sbin/modprobe ib_ipoib' >> /etc/modprobe.d/mlx.conf
    echo 'add_drivers+="mlx5_ib ib_ipoib"' > /etc/dracut.conf.d/mlx.conf
    dracut -f

### xCAT configuration

Define the ib group to have the required install argument changes, interface name, and to invoke
the postscript shown above:

    # nodegrpch ib bootparams.addkcmdline="rd.driver.pre=mlx5_ib,ib_ipoib rd.net.timeout.carrier=80 rd.bootif=0" noderes.primarynic=ib0 postscripts.postscripts=fixipoib

### confluent configuration

xCAT does not understand how to collect addresses for InfiniBand.  Instead, enable confluent collection of the
InfinBand addresses:

    # nodegroupdefine ib net.ib.bootable=1 discovery.policy=permissive,pxe

## Gathering InfiniBand hardware addresses and putting into xCAT

When confluent is configured to do 'zero power' discovery, it can collect mac addresses for boot devices
such as InfiniBand without having to describe the fabric topology.  This document assumes familiarity with [Node discovery and autoconfiguration with confluent]({{ site.baseurl }}/documentation/confluentdisco.html) and that the management network discovery has been configured.

Have the systems attempt to network boot over infiniBand.  For example:

    # nodeboot ib net

After the system attempts PXE boot, the discovery mechanism should provide attributes suitable for feeding to xCAT.  To examine
addresses seen by confluent and collected into the confluent attributes, the following commands are available:
```
# nodediscover list -t pxe-client
 Node|      Model|   Serial|                                 UUID|       Mac Address|       Type| Current IP Addresses
-----|-----------|---------|-------------------------------------|------------------|-----------|---------------------
  ib1| 7X2104Z000| DVJJ1022| 58962b3d-088b-11e7-b8b8-9e59e5cf61db| 50:6b:4b:09:2a:5c| pxe-client|                     
```

    # nodeattrib ib net.ib.hwaddr
    ib1: net.ib.hwaddr: 50:6b:4b:09:2a:5c

To actually populate xCAT, you can use the confluent2xcat command.  If you have not defined nodes in xCAT at all:

    # confluent2xcat ib -o xcatnodes.def
    # mkdef -z < xcatnodes.def
    1 object definitions have been created or modified.

Alternatively, if you have xCAT nodes already defined, but only want to augment the xCAT definition with the mac data:

    # confluent2xcat ib -m mac.csv
    # tabrestore -a mac.csv

Also, it is possible to use nodeinventory to collect the hardware addresses of the InfiniBand adapters.  Note that Mellanox removes the middle two bytes (03:00) of their address during netboot, so remove it here:

    # nodeinventory d3 mac |grep Mellanox|sed -e s/50:6b:4b:03:00/50:6b:4b/
    d3: Mellanox ConnectX-5 2x100GbE / EDR IB QSFP28 VPI Adapter MAC Address 1: 50:6b:4b:09:2a:ac
    d3: Mellanox ConnectX-5 2x100GbE / EDR IB QSFP28 VPI Adapter MAC Address 2: 50:6b:4b:09:2a:ad


## Performing the install

At this point, install can proceed as any normal install:

    # nodeset ib1 osimage=centos7.4-x86_64-install-compute
    # nodeboot ib1 net

## Accessing without fabric

If an issue occurs where the server is up, but the fabric is unreachable and login or scp is required,
a backup path is available through the XCC:

    # ssh -p 3389 $(noderun -n ib1 echo {bmc})
    Last login: Wed Apr 10 14:23:19 2019 from gateway
    [root@ib1 ~]# 

All ssh capabilities are available, including scp:

    # scp -P 3389 testfile $(noderun -n ib1 echo [{bmc}]):~
    testfile                       75%   48MB   2.6MB/s   00:06 ETA


As well as rsync:

    # rsync -ave 'ssh -p 3389' testfile $(noderun -n ib1 echo [{bmc}]):/
    sending incremental file list
    testfile
    
    sent 67,125,334 bytes  received 35 bytes  2,355,276.11 bytes/sec
    total size is 67,108,864  speedup is 1.00

