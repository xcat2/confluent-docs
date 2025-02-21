---
title: Creating a custom confluent OS image
layout: page
permalink: /documentation/customosimage.html
---

Sometimes the options available for `osdeploy import` are too limited and an additional boot payload is
desired. In such a scenario, it is feasible to create a custom OS install image payload.
The requirements for a confluent OS payload are, ultimately:

* Must be a directory located in /var/lib/confluent/public/os/
* Has a `profile.yaml` file that at least says 'label: Friendly label here` in it.

While more options are possible, it is most straightforward to consider a 'custom' payload to be either
a generic linux based OS payload or an utterly generic payload that is not linux based.

For a custom Linux payload that is too different from a stock profile to start from a copy, the following additional
requirements should be considered to be compatible with `osdeploy updateboot`:
* Add desired kernel command line arguments to profile.yaml, e.g. `kernelargs: quiet`
* Place the kernel in boot/kernel
* Place any initramfs content into boot/initramfs/ directory.
* Optionally, you may wish to link /var/lib/confluent/public/site/initramfs.cpio to the image sub-directory to get the site TLS and SSH certificates during initrd
* It is highly recommended to put an appropriate grub and optionally shim into boot/efi/boot/grubx64.efi and efi/boot/BOOTX64.efi


For a more generic OS payload (e.g. Windows), osdeploy updateboot cannot be supported, and the following must be done for the image, 
* Contains a boot.ipxe file that is a valid ipxe script if wanting to support PXE boot (for Windows PE, this would generally include wimboot and the wim file that you want to boot)
* Contains a boot.img file if wanting to support HTTP/HTTPS boot that is a VFAT filesystem with efi/boot/BOOTx64.efi file in it.
