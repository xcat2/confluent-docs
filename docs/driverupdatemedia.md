---
layout: page
title: Using driver update media for RedHat/CentOS
permalink: /documentation/driverupdatemedia.html
---

Occasionally for network deployment of a RHEL or CentOS the modules included in the install initrd for the OS aren’t sufficient to work with the network device being installed over (for example, if the network device is very new and the driver support hasn’t been added to the OS yet).  In that scenario a driver update media package for that network device can be used to provide support for that network device during and after the OS installation.  In order to do that, the following should be done:

1. The driver update media package will typically be provided as a `*.iso` file.  This need to be wrapped into a cpio file, which may be done as follows:

    echo <driver update media package filename>.iso | cpio -H newc -o > <driver update media package filename>.cpio

2. Place the driver update package cpio file into the OS profile being deployed, in the `boot/initramfs` directory:

    cp <driver update media package filename>.cpio /var/lib/confluent/public/os/<OS profile name>/boot/initramfs

3. In the `profile.yaml` file in the `var/lib/confluent/public/os/<OS profile name>` directory, add the following to the kernelargs line:

    dd=/<driver update media package filename>.iso

4. Update the profile (this updates the boot.ipxe and boot.img contents with the driver update media package file and kernelargs updates):

    osdeploy updateboot <OS profile name>
    
    
[Preparing for Operating System Deployment](http://taurus.labs.lenovo.com/users/documentation/confluentosdeploy.html)