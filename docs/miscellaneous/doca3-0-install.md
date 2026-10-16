---
title: DOCA 3 Installation/Upgrade on RHEL 9 and Ubuntu 24.04
tags:
  - drivers
---

## DOCA 3.3.0 Installation/Upgrade on RHEL 9

The following procedure is for installing or upgrading the NVIDIA DOCA stack (`doca-all` profile) on RHEL 9.6.

!!! note
    This is for a single-node install.  Scale with `nodeshell` and arguments to make these steps unattended as needed.

    These instructions have changed significantly from previous versions of DOCA since the drivers are now provided in DKMS format as of DOCA 3.2.0.

### Uninstall the previous version of DOCA

If upgrading from a previous version of DOCA, make sure to uninstall the previous version first, using the following steps (the following is an example for uninstalling DOCA 3.1.0):

```bash
for f in $(rpm -qa | grep -i doca )
do
       dnf -y remove $f
done
/usr/sbin/ofed_uninstall.sh --force
dnf autoremove
dnf makecache
```

The previous step doesn't uninstall all of the packages installed by DOCA. Also run the following, substituting the installed versions as appropriate. This example removes packages from DOCA 3.2.0:

```bash
dnf remove mlnx-ofa_kernel-source-25.10-OFED.25.10.1.2.2.1.el9.x86_64 mlnx-ofa_kernel-dkms-25.10-OFED.25.10.1.2.2.1.el9.x86_64 mlnx-fw-updater-25.10-1.2.8.0.x86_64 mlnx-nvme-dkms-25.10-OFED.25.10.1.2.2.1.el9.x86_64
```

Finally reboot the system to complete the uninstallation:

```bash
reboot
```

Also, note running

```bash
yum upgrade <doca-profile>
```

isn't sufficient to upgrade DOCA if the doca-extras step has been used during installation of the currently installed version of DOCA.  Starting with the full uninstall as mentioned above should be done in this case.

### Prepare the system

**Register and subscribe a RHEL system to the Red Hat Customer Portal using Red Hat Subscription-Manager:**
This is required because some of the packages required are only available for registered systems.

```bash
subscription-manager register --username <username> --password <password>
subscription-manager release --set=9.6
subscription-manager repos --enable codeready-builder-for-rhel-9-x86_64-rpms
dnf install -y wget
wget https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
rpm -ivh epel-release-latest-9.noarch.rpm
dnf install dnf-plugin-config-manager
crb enable
```

**Enable update repos:**
These should be enabled already after the previous registration step, but this step will ensure this and is useful as a reference if these repos are disabled later.

```bash
subscription-manager repos --enable=rhel-9-for-x86_64-baseos-rpms
subscription-manager repos --enable=rhel-9-for-x86_64-appstream-rpms
```

**Install newer kernel packages:**

!!! note
    These steps install a new version as opposed to replacing the older kernel version(s), so the system can be booted to the older kernel version(s) if needed.

```bash
dnf install kernel kernel-core kernel-modules-core kernel-modules
```

**Install newer kernel devel packages:**

!!! note
    These steps install a new version as opposed to replacing the older kernel version(s), so the system can be booted to the older kernel version(s) if needed.

```bash
dnf install kernel-devel kernel-devel-matched kernel-headers kernel-modules-extra
```

**Update kernel tools and kernel abi stablelists:**

!!! note
    This still will update the existing kernel tools packages, as multiple versions of these kernel tools will exist on the system at the same time.

```bash
dnf install kernel-tools kernel-tools-libs kernel-abi-stablelists
```

**Disable update repos:**
This step is optional, and is intended to keep all but the kernel packages at the base RHEL 9.6 levels.  This is mainly for reproducibility of environment, but leaving this step out to allow all of the OS packages to be at the latest level is equally valid.

```bash
subscription-manager repos --disable=rhel-9-for-x86_64-appstream-rpms
subscription-manager repos --disable=rhel-9-for-x86_64-baseos-rpms
```

**Reboot the system using the newly installed kernel:**

```bash
reboot
```

### Install DOCA

**Work around `chkconfig` installation failures:**

DOCA 3.3.0 uses the `doca-all` metapackage. If `/etc/init.d` already exists as an empty directory, it can prevent the required `chkconfig` package from installing. Run this script with Bash to remove the directory only if it is empty, then install `chkconfig`:

```bash
#!/bin/bash
if [ -d /etc/init.d ] && [ ! -L /etc/init.d ]; then
    rmdir /etc/init.d || exit 1
fi
dnf -y install chkconfig
```

**Install dkms:**

!!! note
    dkms >= 3.2 is required

```bash
dnf install dkms
```

**Install DOCA host local repo:**

```bash
rpm -ivh <path to local doca repo RPM>/doca-host-3.3.0-088000_26.01_rhel9.x86_64.rpm
```

**Enable CRB for the builds performed during DOCA installation:**

```bash
crb enable
```

**Clean DNF/YUM cache:**

```bash
dnf makecache
```

**Install the DOCA all metapackage:**

```bash
dnf install doca-all
```

**Disable CRB (optional):**

Disable CRB after the builds if you want to limit subsequent package updates. Leave it enabled if you want packages from that repository to remain available.

```bash
crb disable
```

**Install the mlnx-fw-updater package:**

```bash
dnf install mlnx-fw-updater
```

**Install the DOCA kmod-mlnx-nvme package specifically from DOCA kernel packages repo (optional):**

!!! note
    This step is optional and is only needed if using NVMeoF storage.

```bash
dnf install mlnx-nvme-dkms
```

and make sure the nvme-rdma module loads on boot by adding the following *.conf file to `/etc/modules-load.d`:

```bash
echo "nvme-rdma" > /etc/modules-load.d/nvme-rdma.conf
```

**Install DOCA extra package:**
While installing the doca-extra package is no longer necessary for installing and running the tools to rebuild the drivers against a newer kernel, it also contains the doca-info script, so its still useful to install the doca-extra package:

```bash
dnf install doca-extra
```

### Finish the installation

**Update the initramfs:**
Make sure all of the new kernel modules in particular are loaded on boot:

```bash
dracut -f
```

**Restart the system:**

!!! warning
    Restarting the system after the DOCA install or upgrade has been found to be more reliable than just restarting the openibd service (particularly on upgrade as restarting the openibd service has been found to cause system hangs in some cases).

```bash
reboot
```

**Check nvlsm:**
For configurations where nvlsm was installed prior to upgrading DOCA, check to make sure it is still installed after the DOCA upgrade--in some cases the DOCA upgrade has been observed to remove nvlsm, in which case nvlsm will need to be re-installed after the DOCA upgrade.

## DOCA 3.3.0 Installation on Ubuntu 24.04

The following procedure is for installing the NVIDIA DOCA stack (`doca-all` profile) on Ubuntu 24.04.4.

!!! note
    This is for a single-node install. Scale with `nodeshell`.  Arguments to make these steps unattended have been included.

    These instructions have changed significantly from previous versions of DOCA since the drivers are now provided in DKMS format as of DOCA 3.2.0.

### Uninstall the previous version of DOCA

If upgrading from a previous version of DOCA, make sure to uninstall the previous version first, using the following steps (the following is an example for uninstalling DOCA 3.1.0):

```bash
for f in $( dpkg --list | grep -E 'doca|flexio|dpa-gdbserver|dpa-stats|dpa-resource-mgmt|dpaeumgmt' | awk '{print $2}' )
do
       echo $f
       apt-get remove --purge $f -y
done

/usr/sbin/ofed_uninstall.sh --force

DEBIAN_FRONTEND=noninteractive apt-get autoremove -y
```

Finally reboot the system to complete the uninstallation:

```bash
reboot
```

Also, note running

```bash
apt-get upgrade <doca-profile>
```

isn't sufficient to upgrade DOCA if the doca-extras step has been used during installation of the currently installed version of DOCA.  Starting with the full uninstall as mentioned above should be done in this case.

### Install DOCA

**Install `make`:**
An environment able to build kernel modules is necessary for installing DOCA with updated kernels on Ubuntu 24.04.  The DOCA packages don't include a dependency on `make`, though it is needed, so run the following to install `make`:

```bash
DEBIAN_FRONTEND=noninteractive apt-get install -V -y make
```

**Install the DOCA host repo package:**

```bash
DEBIAN_FRONTEND=noninteractive dpkg -i <path to>/doca-host_3.3.0-088000-26.01-ubuntu2404_amd64.deb
```

and update the apt repo cache to include the newly installed DOCA repo:

```bash
DEBIAN_FRONTEND=noninteractive apt-get update -y
```

**Install the `doca-all` metapackage:**

```bash
DEBIAN_FRONTEND=noninteractive apt-get install -V -y doca-all
```

**Install the mlnx-fw-updater package:**

!!! note
    This package will not contain firmware for Lenovo-customized adapters--the firmware on those adapters will have to be updated separately.

```bash
DEBIAN_FRONTEND=noninteractive apt-get install -V -y mlnx-fw-updater
```

**Install mlnx-nvme-dkms (optional):**
If using NVMeoF, install the mlnx-nvme-dkms package:

```bash
DEBIAN_FRONTEND=noninteractive apt-get install -V -y mlnx-nvme-dkms
```

and make sure the nvme-rdma module loads on boot up by adding the following *.conf file to `/etc/modules-load.d`:

```bash
echo "nvme-rdma" > /etc/modules-load.d/nvme-rdma.conf
```

**Install the doca-extra package:**
While installing the doca-extra package is no longer necessary for installing and running the tools to rebuild the drivers against a newer kernel, it also contains the doca-info script, so its still useful to install the doca-extra package:

```bash
DEBIAN_FRONTEND=noninteractive apt-get install -V -y doca-extra
```

### Patch the boot-service scripts

Patch `/etc/init.d/openibd` and `/usr/share/mlnx_ofed/mod_load_funcs` to address intermittent failures when the `openibd` service starts at boot. The first patch forwards all arguments to `global_init`. The second waits for a loaded module's source version before comparing it with the installed module.

```bash
cd /etc/init.d
cat << 'EOF' > openibd.patch
--- openibd.ORIG        2026-07-23 16:23:11.932067473 -0400
+++ openibd     2026-07-23 16:23:28.160504984 -0400
@@ -45,7 +45,7 @@
 fi
 . "$MLNX_OFED_FUNCS_FILE"

-global_init "$1"
+global_init "$@"

 RC=0
 case "$ACTION" in
EOF
patch -p0 < openibd.patch
cd -

cd /usr/share/mlnx_ofed
cat << 'EOF' > mod_load_funcs.patch
--- mod_load_funcs.ORIG 2026-07-23 16:28:05.383454368 -0400
+++ mod_load_funcs      2026-07-23 16:30:09.113334115 -0400
@@ -985,9 +985,13 @@
     for loaded_module in $loaded_modules
     do
         loaded_srcver=$(/bin/cat /sys/module/$loaded_module/srcversion 2>/dev/null)
+        while [ -z "$loaded_srcver" ]
+        do
+                loaded_srcver=$(/bin/cat /sys/module/$loaded_module/srcversion 2>/dev/null)
+        done
         curr_srcver=$(/sbin/modinfo -Fsrcversion $loaded_module 2>/dev/null)
         if [ "X$loaded_srcver" != "X$curr_srcver" ]; then
-            log_msg "start(): Detected loaded old version of module '$loaded_module'."
+            log_msg "start(): Detected loaded old version of module '$loaded_module', '$loaded_srcver' vs '$curr_srcver'."
             return 0
         fi
     done
EOF
patch -p0 < mod_load_funcs.patch
cd -
```

### Finish the installation

**Update the initramfs:**
Make sure all of the new kernel modules in particular are loaded on boot:

```bash
update-initramfs -u
```

**Restart the system:**

!!! warning
    Restarting the system after the DOCA install or upgrade has been found to be more reliable than just restarting the openibd service (particularly on upgrade as restarting the openibd service has been found to cause system hangs in some cases).

```bash
reboot
```
