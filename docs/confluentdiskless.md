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



    
