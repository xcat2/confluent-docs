---
title: Using confluent diskless support
tags:
  - diskless
---

Confluent offers the ability to create diskless images to boot operating systems. This facility is managed through the `imgutil` command.

## Importing from installation media

When going to build a diskless image, the default is to pull from the same repositories that the current operating system is using. However,
it is possible to deploy from imported media.  If wanting to use this strategy, import the media as normal:

```console
# osdeploy import AlmaLinux-8.5-x86_64-dvd.iso
Importing from /root/AlmaLinux-8.5-x86_64-dvd.iso to /var/lib/confluent/distributions/alma-8.5-x86_64
complete: 100.00%
Deployment profile created: alma-8.5-x86_64-default
```

## Creating initial root filesystem tree

In confluent, the root filesystem can be built wherever you like and does not need to be retained after packing.  To build a new
image from scratch:

```bash
imgutil build -s alma-8.5-x86_64 /tmp/scratchdir
```

The `-s` argument is optional, but when used should refer to a distribution in `osdeploy list`.  Tab completion also will work to help
see the applicable options.  The `/tmp/scratchdir` directory tree is now ready for customization.

## Building images for a foreign architecture

`imgutil build` can build an image for a different architecture than the build
host (e.g. an aarch64 image on an x86_64 host) using qemu user-mode emulation.
For EL, the target architecture is detected automatically when building from a
`-s` source tree; it may also be requested explicitly:

```bash
imgutil build --arch aarch64 /tmp/scratchdir
```

Architecture names are `x86_64` and `aarch64`; for Ubuntu, the Debian-style
names `amd64` and `arm64` are accepted as aliases. `imgutil exec` on a
foreign-architecture tree uses the same emulation.

This requires a statically linked qemu-user emulator registered in
binfmt_misc with the F (fix-binary) flag, so that the emulator remains
reachable inside the image chroot. `imgutil` verifies this up front and
reports what is missing. To set it up (shown for an aarch64 target on an
x86_64 host — swap architectures for the reverse):

=== "Enterprise Linux"

    EL and EPEL do not package the static emulator, but the Fedora package
    installs directly on EL — it contains only the statically linked
    emulator and its binfmt registration (with the F flag), and requires
    nothing beyond `/bin/sh`. Install it from the Fedora 44 repository:

    ```bash
    dnf install --repofrompath=fedora,https://dl.fedoraproject.org/pub/fedora/linux/releases/44/Everything/x86_64/os/ --repo=fedora --nogpgcheck qemu-user-static-aarch64
    systemctl restart systemd-binfmt.service
    ```

    !!! note
        Newer Fedora releases might work as well; adjust the release number
        in the repository URL.

    For the reverse direction (x86_64 emulation on an aarch64 host), the
    subpackage is named `qemu-user-static-x86` and the repository URL uses
    `aarch64` in place of `x86_64`.

=== "Ubuntu 24.04 and earlier"

    The qemu-user-static package registers all emulators with the F flag:

    ```bash
    apt-get install qemu-user-static
    ```

    If a handler was disabled, re-enable it with
    `update-binfmts --enable qemu-aarch64`.

    !!! warning
        When cross-building, the build host's repository URLs probably
        cannot be used: archive.ubuntu.com only hosts x86 packages, all
        other architectures are served from ports.ubuntu.com.

=== "Ubuntu 26.04 and later"

    qemu-user-static became a virtual package; the statically linked
    emulators are provided by qemu-user-binfmt:

    ```bash
    apt-get install qemu-user-binfmt
    ```

Verify the registration — it must report `enabled` and the flags must
include `F` (interpreter path and additional flags vary by distribution):

```console
# cat /proc/sys/fs/binfmt_misc/qemu-aarch64
enabled
interpreter /usr/bin/qemu-aarch64-static
flags: F
```

!!! tip
    With `imgutil` foreign architecture building, package scriptlets and similar steps run
    through `/usr/bin/qemu-<arch>-static`.
    Emulated compilation can be around 25× slower than native, so building large components like
    DOCA or DKMS modules may take a long time. Consider compiling these natively and
    copying the results into the image afterwards.

## Customizing the root filesystem tree

`imgutil` provides an `exec` facility to help customize an root filesystem tree.  It starts the tree specified using container technologies (namespaces and chroot).
It is possible to make a directory available from the build system into the exec environment with the -v argument.  For example, to have root's home directory available:

```console
# imgutil exec -v /root:- /tmp/scratchdir
[IMGUTIL EXEC scratchdir /]$ ls /root/
MLNX_OFED_LINUX-5.4-3.1.0.0-rhel8.5-x86_64  MLNX_OFED_LINUX-5.4-3.1.0.0-rhel8.5-x86_64.tgz
```

This can be used to execute arbitrary commands in a scripted fashion:

```bash
imgutil exec /tmp/scratchdir -- yum -y install perl
imgutil exec -v /root:- /tmp/scratchdir -- /root/MLNX_OFED_LINUX-5.4-3.1.0.0-rhel8.5-x86_64/mlnxofedinstall --distro rhel8.5
```

## Packing the image for boot

Once the tree has been prepared, it needs to be packed to a profile name of your chosing, e.g.:

```bash
imgutil pack /tmp/scratchdir/ alma-8.5-diskless
```

Once packed, the `/tmp/scratchdir` may be deleted if desired:

```bash
rm -rf /tmp/scratchdir
```

## Unpacking image for modification

If at any point a modification or update is required, `imgutil` can unpack a profile to a new location:

```console
# imgutil unpack alma-8.5-diskless /tmp/newscratchdir
Parallel unsquashfs: Using 24 processors
29355 inodes (40094 blocks) to write

[=======================================================================/] 40094/40094 100%

created 24563 files
created 4940 directories
created 2916 symlinks
created 0 devices
created 0 fifos
```

At which point modifications using `imgutil exec` or otherwise modifying the directory tree can be done.  If wanting to pack a new 'version' of an image while preserving customizations to scripts, you can use an existing diskless image profile to base a copy on:

```bash
imgutil pack -b alma-8.5-diskless /tmp/newscratchdir alma-8.5-diskless-v2
```

!!! note
    '-b' will not function correctly if the distribution and nature of the
    profile do not match (e.g. using a different major version of linux, or trying to use diskful profile as a base for a diskless image).

This is a recommended method to preserve both copies until the new image is determined to be correctly working

## Duplicating an image without repacking

If wanting to copy a diskless profile for reasons that do not require repacking, then you must copy both `/var/lib/confluent/private/os/<profilename>` and `/var/lib/confluent/public/os/<profilename>`.
The private portion usually contains an encryption key needed for the packed image to boot.

## Login delays

If accounts suffer a one-time delay after initial login, this is likely due to systemd user slice failing to actually function.
To mitigate, it is possible to modify the TimeoutStopSec value in `/usr/lib/systemd/system/user@.service` to a smaller value, like 10s

## SELinux labelling issues

If errors arise during booting suggesting that, for example, sshd_config is not writable, it may be due to a mislabeled image. By default,
the image should be labeled correctly, but if the scratch filesystem use did not support proper labelling, this can be a problem.
To fix the labeling, select an appropriate filesystem (e.g. the root filesystem generally is well equipped) and do:

```bash
imgutil unpack image-name /tmp/scratchdir
cd /tmp/scratchdir
setfiles -r . /etc/selinux/targeted/contexts/files/file_contexts .
imgutil pack /tmp/scratchdir -b image-name new-image-name
```

## Moving an image between confluent servers

A diskless image is comprised of private and public directories in `/var/lib/confluent`. To archive an image for moving between different confluent instances, tar will suffice:
```bash
cd /var/lib/confluent/
tar cf stream-image.tar public/os/stream86-diskless private/os/stream86-diskless
```

On the server importing:
```bash
tar f stream-image.tar
osdeploy updateboot stream86-diskless

```

This will preserve permissions and owner as well as leave symbolic links in a state to pick up the new confluent server addons and site specific content.

## Using another host to build diskless images

If building an image is easier on another system, this is possible. For example, if the operating system mismatches or some software requires specific hardware to install. This is best accomplished
by installing confluent on the 'build' system, but not bothering to define any nodes. This will include `osdeploy initialize` to have the profiles be complete, but the TLS and SSH data will not be carried over by the tar file and will take the site data from the target confluent instance. In this scenario, simply build
as documented here and then use the procedure for moving an image between confluent servers to place the image into your deployment infrastructure.

## SLES 15 diskless image product selection

By default, building a SLES 15 diskless image will be setup as SuSE Linux Enterprise Server.  If the SuSE Linux Enterprise HPC product is desired, an additional package list file, including the SLE_HPC-release package should be created and specified with the `imgutil build -a` switch.
