---
layout: page
title: Diskless image build and boot for EL8 under confluent
permalink: /documentation/el8diskless.html
---

Confluent provides a facility to create and boot servers without local disks.
The procedure consists of the following steps:

1. Either use the host repositories or import media using `osdeploy import`
2. Build a `chroot` type of environment by `imgutil build [-s distroname] /some/transient/path`
3. Perform any desired modifications to /some/transient path, either by externally scripting or using `imgutil exec /some/transient/path` to run 'inside' the prospective image.
4. Pack the image to a profile name, `imgutil pack /some/transient/path osprofilename`
5. Deploy the osprofilename as one would deploy a scripted install, e.g. `nodedeploy n1 -n osprofilename`

This will result in a tethered boot, where the diskless nodes may failover from any deployment server to any other dynamically during operation. Rather than hosting the diskless image
in memory, the filesystem is not retrieved except when the relevant blocks are required, and then are cached as the kernel would cache any data from a disk.  Due to this ongoing relationship,
it is important to not update the rootimg.sfs file in place, but instead to copy it elsewhere.  Here is an example flow of using yum to update an existing image, without retaining the build directory:

1. Extract the profile named 'osprofilename' to work on it: `imgutil unpock osprofilename /some/transient/path`
2. Execute yum update in the image: `imgutil exec /some/transient/path yum update`
3. Pack a new profile based on osprofile name, but with /some/transient/path: `imgutil pack -b osprofilename /some/transient/path osprofilename-v2`
4. Deploy nodes to new version on their next reboot: `nodedeploy n1-n12 -n -p osprofilename-v2`
5. Once migrated to new profile, you may delete osprofilename (`rm -rf /var/lib/confluent/public/os/osprofilename`)
