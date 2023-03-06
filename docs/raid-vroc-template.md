---
layout: page
title: Template for RAID/ VROC boot device 
permalink: /documentation/raid-vroc-template.html
---

#Synopsys:
---------------

Add RAID and VROC support for booting devices for RHEL and SLES. 

#Solution:
---------------

Confluent has a built in feature to be able to load custom made files in different parts of the booting process.

Please, after editing the sample file, place it in **` /var/lib/confluent/public/os//scripts/pre.d `.**


For RAID instances please find below as a sample file you may use but need to edit for your needs:

#Example file for RAID:
---------------


    DEVICES="/dev/sda /dev/sdb"
    RAIDLEVEL=1
    mdadm --detail /dev/md*|grep 'Version : 1.0' >& /dev/null && exit 0
    lvm vgchange -a n
    mdadm -S -s
    NUMDEVS=$(for dev in $DEVICES; do
       echo wipefs -a $dev
    done|wc -l)
    for dev in $DEVICES; do
       wipefs -a $dev
    done
    # must use older metadata format to leave disks looking normal for uefi
    mdadm -C /dev/md/raid $DEVICES -n $NUMDEVS -e 1.0 -l $RAIDLEVEL
    # shut and restart array to prime things for anaconda
    mdadm -S -s
    mdadm --assemble --scan
    readlink /dev/md/raid|sed -e 's/.*\///' > /tmp/installdisk


Reference  <https://github.com/lenovo/confluent/blob/master/misc/swraid> 


For VROC instances, please apply same principle as above (edit with needed info) :

#Example file for VROC:
---------------


    DEVICES="/dev/sda /dev/sdb"
    RAIDLEVEL=1
    mdadm --detail /dev/md* | grep imsm >& /dev/null && exit 0
    lvm vgchange -a n
    mdadm -S -s
    NUMDEVS=$(for dev in $DEVICES; do
       echo wipefs -a $dev
    done|wc -l)
    for dev in $DEVICES; do
       wipefs -a $dev
    done
    mdadm -C /dev/md/imsm0 $DEVICES -n $NUMDEVS -e imsm
    mdadm -C /dev/md/md0_0 /dev/md/imsm0 -n $NUMDEVS -l $RAIDLEVEL
    mdadm -S -s
    mdadm --assemble --scan


Reference <https://github.com/lenovo/confluent/blob/master/misc/vroc> 

Please **remember** to put the file for the corresponding system in **/var/lib/confluent/public/os//scripts/pre.d ** to run the script on the install of the profile. 
