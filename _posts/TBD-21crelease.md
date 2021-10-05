---
layout: post
title:  3.3.0 Confluent release
categories: hpc update
---
# New diskless and cloning deployment support

A new utility `imgutil` is provided to create diskless and cloning OS profiles.  The diskless support differs from xCAT in the following ways:
-By default, a new tethered mode is used, where OS is retrieved block by block on demand, greatly reducing memory usage for large images. A new multipath http filesystem was created for this task.
-All writes are compressed to mitigate memory usage, and untethered mode no longer decompresses the root filesystem up front.
-Diskless images are no longer 'pruned', making it easier to build an image and using an image is less unusual, facilitated by memory savings above
-Greater emphasis is placed on consistent behavior with a disk-installed system (e.g. network management and network names)
-Initramfs now persists after boot, allowing administrator to ssh using port 2222 to debug and fix potential issues in the root filesystem
-By default, diskless and captured images are encrypted, and nodes must use confluent node API to get decryption key
-SSH, image decryption key, crypted root password are now by default linked to the server TPM2 to improve security on reboot
-The image no longer contains even an encrypted root password.
-Common changes to scripted install also apply to diskless and cloning (e.g. no private SSH keys are transferred).
-The product of `build` now naturally creates the correct initramfs, no need for a `geninitrd` to apply a kernel update.
-A new capability `imgutil exec` is provided to launch the `imgutil build` product into a container-style environment for customization and updating with better protection of the build host.

# Improved discovery performance and reliability

A number of issues were identified and resolved to dramatically improve discovery initial scan and rescan, both in terms of speed and reliability of results being correctly recognized.

# Alternative target names for nodeshell

A new argument `-s` has been added to nodeshell to allow an expression or suffix to specify something other than nodename as target for ssh.

# Updated OS deployment support

SUSE Enterprise 15 SP3 and LEAP 15.3 are now supported.

# Support multiple password prompts in web gui (e.g. TOTP 2FA)

If configured, confluent gui will manifest the conversation prompts and support use of multiple fields for password.

# Confluent no uses a disntinct TLS CA from webserver certificate instead of self-signed

This change enables regenerating webserver certificates due to ip reconfiguration without disrupting trust in site.cpio, boot.img, and existing nodes. It also is
compatible with some software that expcilitly forbids self signed certificates.

# Noderange [] syntax now supports a step

For example n[1:200:2] will indicate all odd numbered nodes, and n[2:200:2] will do all even numbered systems between n1 and n200.

# Improve boot attempt logging information

More information is now in /var/log/confluent/events to aid in diagnosing configuration issues.

# syncfiles now supports merging into a single file from multiple sources

If two files comprise distinct amendments for /etc/passwd, for example, they may now both point directly to /etc/passwd

# Partial IPv6 deployment support

HTTP over IPv6 is now supported for the initial kernel/ramdisk and genesis can now boot with ipv6 along with or instead of ipv4.

# New utility `confluent2hosts` to aid in creating and updating /etc/hosts

The utility works in lieu of xCAT's `makehosts` for IPv4 and IPv6 addresses without requiring ip be in an attribute first.


