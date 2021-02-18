---
layout: page
title: InfiniBand install with confluent on RHEL 8
permalink: /documentation/ibinstallconfluentrhel8.html
---

Please refer to the following link for the confluent OS deployment process:

[Preparing for Operating System Deployment](http://taurus.labs.lenovo.com/users/documentation/confluentosdeploy.html)

The confluent deployment process for installing over InfiniBand requires the following modifications:

Using driver update media for RedHat/CentOS

Occasionally for network deployment of a RHEL or CentOS the modules included in the install initrd for the OS aren’t sufficient to work with the network device being installed over (for example, if the network device is very new and the driver support hasn’t been added to the OS yet).  In that scenario a driver update media package for that network device can be used to provide support for that network device during and after the OS installation. In order to do that, the following should be done:

1. The driver update media package will typically be provided as a `*.iso` file.  This need to be wrapped into a cpio file, which may be done as follows:

    `echo <driver update media package filename>.iso | cpio -H newc -o > <driver update media package filename>.cpio`

2. Place the driver update package cpio file into the OS profile being deployed, in the `boot/initramfs` directory:

    `cp <driver update media package filename>.cpio /var/lib/confluent/public/os/<OS profile name>/boot/initramfs`

3. In the `profile.yaml` file in the `var/lib/confluent/public/os/<OS profile name>` directory, add the following to the kernelargs line:

    `dd=/<driver update media package filename>.iso`

4. Update the profile (this updates the boot.ipxe and boot.img contents with the driver update media package file and kernelargs updates):

    `osdeploy updateboot <OS profile name>`

Net config fixup postscript

InfiniBand network configuration does not work as expected out of the box.  If not installing Mellanox OFED, the following is an example of a
postscript that can be added to correct that behavior:

    # cat /install/postscripts/fixipoib
    echo 'install mlx5_core /sbin/modprobe --ignore-install mlx5_core; /sbin/modprobe mlx5_ib; /sbin/modprobe ib_ipoib' >> /<profile dir>/scripts/post.d/mlx.conf
    echo 'add_drivers+="mlx5_ib ib_ipoib"' > /<profile dir>/scripts/post.d/mlx.conf
    dracut -f

Kernel command line configuration

Change the profile.yaml file in the the OS profile to be deployed to add:

    # rd.driver.pre="mlx5_ib,ib_ipoib rd.net.timeout.carrier=80 rd.bootif=0"

on the kernel.args line

Then run

    # osdeploy updateboot <OS profile name>
