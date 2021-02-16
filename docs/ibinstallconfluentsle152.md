---
layout: page
title: InfiniBand install with confluent on SLE 15.2
permalink: /documentation/ibinstallconfluentsle152.html
---

#### Please refer to the following link for the confluent OS deployment process:

[Preparing for Operating System Deployment](http://taurus.labs.lenovo.com/users/documentation/confluentosdeploy.html)

#### The confluent deployment process for installing over InfiniBand requires the following modifications:

#### Net config fixup postscript

InfiniBand network configuration does not work as expected out of the box.  If not installing Mellanox OFED, the following is an example of a
postscript that can be added to correct that behavior:

    # cat /install/postscripts/fixipoib
    echo 'install mlx5_core /sbin/modprobe --ignore-install mlx5_core; /sbin/modprobe mlx5_ib; /sbin/modprobe ib_ipoib' >> /<profile dir>/scripts/post.d/mlx.conf
    echo 'add_drivers+="mlx5_ib ib_ipoib"' > /<profile dir>/scripts/post.d/mlx.conf
    dracut -f

#### Kernel command line configuration

Change the profile.yaml file in the the OS profile to be deployed to add:

    # insmod="ib_ipoib"

and run

    # osdeploy updateboot <OS profile name>
