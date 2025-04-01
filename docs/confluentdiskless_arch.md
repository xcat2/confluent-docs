---
layout: page
title: Confluent diskless architecture
permalink: /documentation/confluentdiskless_arch.html
toc: true
---

The confluent diskless implementation has a number of design points of interest compared to other diskless implementations or scripted install.

# Build process

In confluent, the `imgutil` command handles building, packing, unpacking, and modifying diskless images as well as cloning. Building and
unpacking create a chroot-style directory. The `exec` subcommand allows spawning a specified directory in a new mount and process namespace with workable
new filesystems mounted such as /proc and /sys. The images are generated in such a way as to naturally produce a diskless initramfs. As a result, a normal
rpm upgrade that would generate an updated initramfs for a disk-installed system now also works in the `exec` environment of a diskless image. Additionally,
the normal mkinitramfs/dracut/mkinitrd commands serve to generate the correct diskless filesystem.  Finally, packing an image produces a squashfs of the root
filesystem, as well as extracting the appropriate kernel and initramfs.

# Tethered diskless

The default behavior is tethered diskless, where the diskless system detects paths to all relevant collective members and registers a filesystem
to download from them in a multipath fashion on-demand. This avoids the up-front penalty in time and memory for downloading an entire diskless image,
and avoids downloading unused portions of the image entirely. However, this precludes the ability of repacking in-place, and thus one must avoid
packing over an in-use tethered diskless image.

# Untethered diskless

If wanting to uncouple from the filesystem, changing profile.yaml to untethered will alter the behavior. Rather than download on demand,
the filesystem will be entirely downloaded to ram up-front. This will result in slower boot and larger memory consumption, but the memory
consumption is still mitigated by leaving the filesystem compressed.

# Writing to root filesystem in diskless mode

The root filesystem is combined through overlay with a compressed ram xfs filesystem, with discard enabled. This means writes are compressed
to mitigate memory cost and memory may be reclaimed through deleting written files. All data written in this manner will be lost on reboot.
As of this writing, selective persistence of writable files to a remote filesystem is up to the user to implement.

# Sensitive information in diskless images and encryption

All effort is made to avoid writing sensitive information to the images, but rpms and exec may result in sensitive data in the filesystem
beyond confluent's awareness.  Since the image is served over a public web server, it is therefore encrypted by default, with the private key
stored in the 'private' directory alongside the 'public' directory.  This key is only provided through the confluent api

# Node authentication using TPM2

No persistence to disk is possible to maintain node credentials such as ssh keys or the confluent node api key.  By default confluent diskless requires
the use of a TPM2 to persist and protect the node api key.  During the diskless boot, an attempt is made to retrieve the Confluent Node API key from the TPM.
If this fails it falls back to network attempt to get api key, and if that succeeds installs the new api key into the TPM.

The TPM has a concept of 'Platform Configuration Registers', which may be used to measure various facets of the system and allow for certain data to be locked
unless the registers are a certain value.  Prior to booting the OS, confluent diskless by default extends PCR 15 to lock the data such that the TPM is unable to provide the API key again until
a system reboot.  This protects the node api key even if a user gains access to the TPM after boot.

The api key is then used to retrieve information from the confluent service, such as the crypted root password. New ssh keys are generated every boot, and the api key is used
to request a confluent server sign the new key, providing trust persistence for known_hosts despite a frequently changing host key.  This avoids transmission of any host or
user private key in the confluent diskless environment, and enables secure trust persistence across reboots in a diskless environment.
