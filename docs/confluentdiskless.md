---
layout: page
title: Using confluent diskless support
permalink: /documentation/confluentdiskless.html
---

Confluent offers the ability to create diskless images to boot operating systems. This facility is managed through the `imgutil` command.

# Importing from installation media

When going to build a diskless image, the default is to pull from the same repositories that the current operating system is using. However,
it is possible to deploy from imported media.  If wanting to use this strategy, import the media as normal:

    # osdeploy import AlmaLinux-8.5-x86_64-dvd.iso 
    Importing from /root/AlmaLinux-8.5-x86_64-dvd.iso to /var/lib/confluent/distributions/alma-8.5-x86_64
    complete: 100.00%    
    Deployment profile created: alma-8.5-x86_64-default

# Creating initial root filesystem tree

In confluent, the root filesystem can be built wherever you like and does not need to be retained after packing.  To build a new
image from scratch:

    # imgutil build -s alma-8.5-x86_64 /tmp/scratchdir

The `-s` argument is optional, but when used should refer to a distribution in `osdeploy list`.  Tab completion also will work to help
see the applicable options.  The /tmp/scratchdir directory tree is now ready for customization.

# Customizing the root filesystem tree

`imgutil` provides an `exec` facility to help customize an root filesystem tree.  It starts the tree specified using container technologies (namespaces and chroot).
It is possible to make a directory available from the build system into the exec environment with the -v argument.  For example, to have root's home directory available:

    # imgutil exec -v /root:- /tmp/scratchdir
    [IMGUTIL EXEC scratchdir /]$ ls /root/
    MLNX_OFED_LINUX-5.4-3.1.0.0-rhel8.5-x86_64  MLNX_OFED_LINUX-5.4-3.1.0.0-rhel8.5-x86_64.tgz

This can be used to execute arbitrary commands in a scripted fashion:

    # imgutil exec /tmp/scratchdir -- yum -y install perl
    # imgutil exec -v /root:- /tmp/scratchdir -- /root/MLNX_OFED_LINUX-5.4-3.1.0.0-rhel8.5-x86_64/mlnxofedinstall --distro rhel8.5

# Packing the image for boot

Once the tree has been prepared, it needs to be packed to a profile name of your chosing, e.g.:

    # imgutil pack /tmp/scratchdir/ alma-8.5-diskless

Once packed, the /tmp/scratchdir may be deleted if desired:

    # rm -rf /tmp/scratchdir

# Unpacking image for modification

If at any point a modification or update is required, `imgutil` can unpack a profile to a new location:

    # imgutil unpack alma-8.5-diskless /tmp/newscratchdir
    Parallel unsquashfs: Using 24 processors
    29355 inodes (40094 blocks) to write

    [=======================================================================/] 40094/40094 100%
    
    created 24563 files
    created 4940 directories
    created 2916 symlinks
    created 0 devices
    created 0 fifos

At which point modifications using imgutil exec or otherwise modifying the directory tree can be done.  If wanting to pack a new 'version' of an image while preserving customizations to scripts:

    # imgutil pack -b alma-8.5-diskless /tmp/newscratchdir alma-8.5-disklesss-v2

This is a recommended method to preserve both copies until the new image is determined to be correctly working

# Duplicating an image without repacking

If wanting to copy a diskless profile for reasons that do not require repacking, then you must copy both /var/lib/confluent/private/os/<profilename> and /var/lib/confluent/public/os/<profilename>.
The private portion usually contains an encryption key needed for the packed image to boot.

# Login delays

If accounts suffer a one-time delay after initial login, this is likely due to systemd user slice failing to actually function.
To mitigate, it is possible to modify thte TimeoutStopSec value in /usr/lib/systemd/system/user@.service to a smaller value, like 10s

# SELinux labelling issues

If errors arise during booting suggesting that, for example, sshd_config is not writable, it may be due to a mislabeled image. By default,
the image should be labeled correctly, but if the scratch filesystem use did not support proper labelling, this can be a problem.
To fix the labeling, select an appropriate filesystem (e.g. the root filesystem generally is well equipped) and do:

```
imgutil unpack image-name /tmp/scratchdir
cd /tmp/scratchdir
setfiles -r . /etc/selinux/targeted/contexts/files/file_contexts .
imgputil pack /tmp/scratchdir -b image-name new-image-name
```

# Moving an image between confluent servers

A diskless image is comprised of private and public directories in /var/lib/confluent. To archive an image for moving between different confluent instances, tar will suffice:
```
[root@mgt1 confluent]# cd /var/lib/confluent/
[root@mgt1 confluent]# tar cf stream-image.tar public/os/stream86-diskless private/os/stream86-diskless
```

On the server importing:
```
[root@mgt2 confluent]# tar f stream-image.tar
[root@mgt2 confluent]# osdeploy updateboot stream86-diskless

```

This will preserve permissions and owner as well as leave symbolic links in a state to pick up the new confluent server addons and site specific content.

# Using another host to build diskless images

If building an image is easier on another system, this is possible. For example, if the operating system mismatches or some software requires specific hardware to install. This is best accomplished
by installing confluent on the 'build' system, but not bothering to define any nodes. This will include osdeploy initialize to have the profiles be complete, but the TLS and SSH data will not be carried over by the tar file and will take the site data from the target confluent instance. In this scenario, simply build
as documented here and then use the procedure for moving an image between confluent servers to place the image into your deployment infrastructure.
