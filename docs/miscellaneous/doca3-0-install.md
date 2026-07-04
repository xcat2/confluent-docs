---
title: DOCA 3 Installation/Upgrade on RHEL 9 and Ubuntu 24.04
tags:
  - drivers
---

## DOCA 3.2.0 Installation/Upgrade on RHEL 9

The following procedure is for installing or upgrading the NVIDIA DOCA stack (doca-ofed profile) on RHEL 9.6.

!!! note
    This is for a single-node install.  Scale with nodeshell and arguments to make these steps unattended as needed.

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

Note, the previous step doesn't uninstall all of the packages installed by DOCA, also run the following:

```bash
dnf remove kmod-mlnx-ofa_kernel-25.07-OFED.25.07.0.9.7.1.1.rhel9u6.x86_64 kmod-mlnx-nvme-25.07-OFED.25.07.0.9.7.1.1.rhel9u6.x86_64
dnf remove rdma-core-2507mlnx58-1.2507097.x86_64 mlnx-fw-updater-25.07-0.9.7.0.x86_64
dnf remove mft
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
Note that these steps install a new version as opposed to replacing the older kernel version(s), so the system can be booted to the older kernel version(s) if needed.

```bash
 dnf install kernel kernel-core kernel-modules-core kernel-modules 
```

**Install newer kernel devel packages:**
Note that these steps install a new version as opposed to replacing the older kernel version(s), so the system can be booted to the older kernel version(s) if needed.

```bash
 dnf install kernel-devel kernel-devel-matched kernel-headers kernel-modules-extra
```

**Update kernel tools and kernel abi stablelists:**
Note that this still will update the existing kernel tools packages, as multiple versions of these kernel tools will exist on the system at the same time.

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

**Install dkms:**

!!! note
    dkms >= 3.2 is required

```bash
 dnf install dkms
```

**Install DOCA host local repo:**

```bash
 rpm -ivh <path to local doca repo RPM>/doca-host-3.2.0-125000_25.10_rhel9.x86_64.rpm
```

**Clean DNF/YUM cache:**

```bash
 dnf makecache
```

**Install the DOCA ofed meta package:**

```bash
 dnf install doca-ofed
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

and make sure the nvme-rdma module loads on boot by adding the following *.conf file to /etc/modules-load.d:

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

## DOCA 3.2.0 Installation on Ubuntu 24.04

The following procedure is for installing the NVIDIA DOCA stack (doca-ofed profile) on Ubuntu 24.04.3.

!!! note
    This is for a single-node install. Scale with nodeshell.  Arguments to make these steps unattended have been included.

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
 DEBIAN_FRONTEND=noninteractive apt-get install -y make
```

**Install the DOCA host repo package:**

```bash
 DEBIAN_FRONTEND=noninteractive dpkg -i <path to>/doca-host_3.2.0-125000-25.10-ubuntu2404_amd64.deb
```

and update the apt repo cache to include the newly installed DOCA repo:

```bash
 DEBIAN_FRONTEND=noninteractive apt-get update -y
```

**Install the doca-ofed meta-package:**

```bash
 DEBIAN_FRONTEND=noninteractive apt-get install -y doca-ofed
```

**Install the mlnx-fw-updater package:**
Note that this package will not contain firmware for Lenovo-customized adapters--the firmware on those adapters will have to be updated separately.

```bash
 DEBIAN_FRONTEND=noninteractive apt-get install -y mlnx-fw-updater
```

**Install mlnx-nvme-dkms (optional):**
If using NVMeoF, install the mlnx-nvme-dkms package:

```bash
 DEBIAN_FRONTEND=noninteractive apt-get install -y mlnx-nvme-dkms
```

and make sure the nvme-rdma module loads on boot up by adding the following *.conf file to /etc/modules-load.d:

```bash
 echo "nvme-rdma" > /etc/modules-load.d/nvme-rdma.conf
```

**Install the doca-extra package:**
While installing the doca-extra package is no longer necessary for installing and running the tools to rebuild the drivers against a newer kernel, it also contains the doca-info script, so its still useful to install the doca-extra package:

```bash
 DEBIAN_FRONTEND=noninteractive apt-get install -y doca-extra
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
