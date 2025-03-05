---
layout: page
title: Using xCAT to install EL7 on Intel RSTe
permalink: /documentation/el7rste.html
---

# Directing xCAT to install to the RSTe array

The disk to specify would be `/dev/md/Volume0_0`.  To do this in xCAT, create a file called  /install/custom/el7rste.partitions containing the following:

    ignoredisk --only-use=/dev/md/Volume0_0
    part /boot/efi --size 50 --ondisk /dev/md/Volume0_0 --fstype efi
    part /boot --size 512 --fstype xfs --ondisk /dev/md/Volume0_0
    part swap --recommended --ondisk /dev/md/Volume0_0
    part pv.01 --size 1 --grow --ondisk /dev/md/Volume0_0
    volgroup system pv.01
    logvol / --vgname=system --name=root --size 1 --grow --fstype xfs
    bootloader  --boot-drive=Volume0_0

Modify the osimage to use this file, for example:

     chdef -t osimage centos7.5-x86_64-install-compute partitionfile=/install/custom/el7rste.partitions

Future nodeset commands will target the RSTe volume.

# Adding support to 7.4 (not needed for 7.5 or newer)


EL 7.5 and newer include support, for 7.4 it is required to download the RSTe software from Lenovo [support site](https://datacentersupport.lenovo.com/us/en/products/SERVERS/THINKSYSTEM/SD530/7X21/downloads/DS504607)

Then, extract the archive to get the install iso:

    $ tar xf intc-lnvgy_dd_iastor_rste5.3-693_linux_x86_64.tgz

Then extract updates.img from the iso.  You could loop mount or use isoinfo to extract:

    $ isoinfo -i intc-lnvgy_dd_iastor_5.3-693_linux_x86_64/rste-5.3_rhel7.4.iso -R -x /updates.img > /install/rste.img

Set bootparams.addkcmdline to pull in the given update:

    $ nodegrpch rste bootparams.addkcmdline=" updates=http://<xcatmgt.name>/install/rste.img"

From this point forward, any members of the rste group will pull in the RSTe software on install.
