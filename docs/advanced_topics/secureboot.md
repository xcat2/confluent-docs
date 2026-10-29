---
title: Secureboot and compiled kernel modules
tags:
  - secureboot
---

When using Secureboot, kernel modules that are compiled must be signed, and the signing key somehow enrolled.  This may come up particularly with DOCA, 
GPU drivers, and filesystem modules.  Instructions are broadly available on various approaches.  It may be done in the straightforward way of having a keypair on each node, which is the most widely documented approach, but leaves the system able to sign drivers for itself which may undermine the point of SecureBoot, or you may use a build system and curate
the drivers offline and distribute as desired.  These details are generally available elsewhere and beyond the scope of this document.

However, confluent does offer assistance with automatically enrolling the keys if using MOK, the usual way of providing public keys for signing kernel custom content.

First, the relevant public key must be present on each node in an appropriate location.  If using an offline build system, nodersync it to a well known location.

If, for example, using dkms on-node, the public key will be in a location like `/var/lib/dkms/mok.pub` or `/var/lib/shim-signed/mok/MOK.der`.  For this document, we will go with `/var/lib/dkms/mok.pub` as the example.

Scripts are available to help with adding and removing MOK on confluent's github [repository](https://github.com/xcat2/confluent/tree/master/misc/secureboot).

## Prerequisites

UEFI must be configured such that nodeconsole works with text console.  `console.method` should be set to a reasonable value such as openbmc, ipmi, or proxmox, and
firmware/virtualization configuration needs to have the firmware output working, being careful to ensure that even output from network boot and grub appear.

## Indicate the root password that will be used for enrollment

```
read -s MOKPASS
export MOKPASS
```

## Stage the key for enrollment on next reboot

We will invoke mokutil from within the Linux OS to stage the key for enrollment on next reboot.

```
nodeshell <noderange> mokutil --import /var/lib/dkms/mok.pub --root-pw
```
## Reboot the nodes to commence the key enrollment

With the content staged, we must begin a boot attempt.
```
nodeshell <noderange> reboot
```
## Have nodeshell automate the enrollment on your behalf

We will use nodeconsole to navigate the required console interaction.  Be sure to download `enrollmok.nca` from the git link above and do:

```
nodeconsole <noderange> -ea enrollmok.nca
```

You can now watch as nodeconsole navigates the menu to complete MOK enrollment.

## Removing a key from MOK

The process is the same as above, except mokutil needs to do --delete and the script is `deletetemok.nca` to remove a key.
