---
layout: page
title: Broadcom NIC driver install on Ubuntu 24.04.2
permalink: /documentation/broadcom-nic-driver-install.html
---

# Broadcom NIC Driver Installation on Ubuntu 24.04.2

The following procedure is for installing the out-of-box Broadcom NIC driver and RoCE libraries on Ubuntu 24.04.2.

 **NOTE** This is for a single-node install. Scale with nodeshell.  Arguments to make these steps unattended have been included.

## Install dependencies for using RoCE with Broadcom NICs
 ```
 DEBIAN_FRONTEND=noninteractive apt-get install -V -y rdma-core rdmacm-utils infiniband-diags libibverbs-dev ibverbs-utils
 ```

## Install the Broadcom netxtreme-peer-mem-dkms package
 Note that the Broadcom bnxt_en and bnxt_re dkms modules are included in the netxtreme-peer-mem-dkms package do they don't have to be installed separately (in fact, if they are, `dkms status` will complain about the built and installed versions of those modules not matching).
 ```
 DEBIAN_FRONTEND=noninteractive apt-get install -V -y /cluster/drivers/bnxt_en/drum_40687/tmp/ubuntu/drivers_linux/peer_mem/dkms/netxtreme-peer-mem-dkms_232.0.155.5_all.deb
 ```
## Install the Broadcom bnxt_re_conf package
 ```
 DEBIAN_FRONTEND=noninteractive apt-get install -V -y /cluster/drivers/bnxt_en/drum_40687/tmp/ubuntu/drivers_linux/bnxt_re/bnxt_re_conf/bnxt_re_conf_232.0.155.5-1_all.deb
 ```
 
## Build and install libbnxt_re
 ```
 cd /cluster/drivers/bnxt_en/drum_40687/tmp/ubuntu/drivers_linux/bnxt_rocelib/tmp/libbnxt_re-232.0.155.5
 make clean
 sh autogen.sh
 ./configure --sysconfdir=/etc
 make
 make install all
 cd
 ```
 
## Prevent bnxt_en from being included in initramfs
 The out-of-box Broadcom kernel modules will be installed under /lib/modules in the root filesystem, but, by default, won't be included in the initramfs when it is updated.  This has the effect of the in-box bnxt_en module being loaded on boot instead of the out-of-box version and also preventing the out-of-box versions of the bnxt_en and Broadcom peer mem modules from loading.  The following will cause the bnxt_en module to be omitted from the initramfs when the initramfs is updated, so the bnxt_en module will instead be loaded from the root filesystem, enabling the Broadcom out-of-box drivers to be loaded on boot.  This approach works at least for Ubuntu 24.04.2 installed to local storage where the Broadcom NIC drivers aren't necessary to mount the root filesystem.
  
 ```
 install -m 0755 /dev/null /etc/initramfs-tools/hooks/omit
 cat <<'EOF' > /etc/initramfs-tools/hooks/omit
 #!/bin/sh
 PREREQ=""
 prereqs()
 {
     echo "$PREREQ"
 }
 case $1 in
 prereqs)
     prereqs
     exit 0
     ;;
 esac
 . /usr/share/initramfs-tools/hook-functions
 # Begin real processing below this line
 OMIT_DRIVERS="bnxt_en.ko.zst"
 for i in ${OMIT_DRIVERS}; do
     find ${DESTDIR} -name ${i} -delete
 done
 EOF
 ```
 
## Update library path
 ```
 echo "/usr/local/lib" >> /etc/ld.so.conf
 ldconfig
 ```

## Update the initramfs
 ```
 update-initramfs -u
 ```

## Reboot
 ```
 reboot
 ```

### Check to make sure updated Broadcom NIC drivers are loaded
 ```
 root@n928:~# cat /sys/module/bnxt_en/version
 1.10.3-232.0.155.5
 root@n928:~# cat /sys/module/bnxt_re/version
 232.0.155.5
 root@n928:~# cat /sys/module/ib_peer_mem/version
 232.0.155.5
 ```