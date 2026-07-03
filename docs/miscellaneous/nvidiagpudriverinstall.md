---
title: NVIDIA GPU Driver Install on RHEL 9 and Ubuntu 24.04
---

## NVIDIA GPU Driver Install on RHEL 9

The following procedure is for installing the NVIDIA GPU drivers on RHEL 9.6.  Note that this is for a single-node install.  Scale with nodeshell and arguments to make these steps unattended as needed.

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

**Prerequisites:**

!!! warning
    DOCA must be installed before installing the GPU drivers to make sure the nvidia-peermem kernel module gets the right Infiniband symbols.

**Enable update repos:**

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

**Install dkms:**

```bash
 dnf install dkms
```

**Disable update repos:**

```bash
 subscription-manager repos --disable=rhel-9-for-x86_64-appstream-rpms
 subscription-manager repos --disable=rhel-9-for-x86_64-baseos-rpms
```

**Reboot the system using the newly installed kernel:**

```bash
 reboot
```

### Install the GPU drivers

**Install GPU driver local repo:**

```bash
 rpm -ivh <path to nvidia local repo RPM>/nvidia-driver-local-repo-rhel9-580.65.06-1.0-1.x86_64.rpm
```

**Clean DNF/YUM cache:**

```bash
 dnf clean all
```

**Install GPU drivers:**

```bash
 dnf install nvidia-driver-cuda kmod-nvidia-open-dkms
```

**Install nvidia-fabric manager packages (optional):**

!!! note
    The nvidia-fabric-manager package is only necessary on 8-GPU HGX configs.

```bash
 dnf install nvidia-fabric-manager libnvidia-nscq libnvsdm nvidia-imex
```

**Install nvidia-fabric manager packages for B200 (optional):**

!!! note
    The nvidia-fabric-manager packages for B200 are only necessary on B200 8-GPU HGX configs.

```bash
 dnf install nvidia-fabric-manager libnvidia-nscq libnvsdm nvidia-imex collectx-bringup mft-autocomplete mft-oem nvlsm
```

### Install GPU Direct Storage (GDS) support

**Extract the contents of the CUDA local repo package:**
The CUDA repo is required to install the GPU Direct Storage (GDS) kernel module and utility packages.

```bash
 rpm -ivh /cluster/software/cuda/13.0.0/cuda-repo-rhel9-13-0-local-13.0.0_580.65.06-1.x86_64.rpm
```

**Clean DNF/YUM cache:**

```bash
 dnf clean all
```

**Install the GDS kernel module package:**

```bash
 dnf install nvidia-fs
```

**Install the GDS utility packages:**

```bash
 dnf install nvidia-gds
```

### Reboot and verify

**Reboot:**

```bash
 reboot
```

**Check driver status:**
The following should show the correct driver version installed for the correct kernel version:

```bash
 dkms status
```

The nvidia driver should be loaded and the nouveau driver should not be loaded:

```bash
 lsmod | grep -i nvidia
 lsmod | grep -i nouveau
```

Make sure the nouveau driver never loaded during the boot process:

```bash
 dmesg | grep -i nouveau
```

**Make sure the version of the nvidia driver running is correct:**

```bash
 cat /sys/module/nvidia/version
```

**Start the nvidia-persistenced service and make sure its running OK:**

```bash
 systemctl start nvidia-persistenced
 systemctl status nvidia-persistenced
```

Start the nvidia-fabricmanager service and make sure its running OK (note, this is only necessary for and should only be run on 8-GPU HGX systems only):

```bash
 systemctl start nvidia-fabricmanager
 systemctl status nvidia-fabricmanager
```

**Check that nvidia-smi reports all expected GPUs:**

```bash
 nvidia-smi
```

**Check the NVLINKs (where applicable--this applies to all HGX systems and systems with PCIe GPUs with NVLINK bridge cards installed).  All expected links should show up at expected bandwidth:**

```bash
 nvidia-smi nvlink -s
```

**Check the NVLINK fabric status (applicable for HGX 8-way configurations):**

```bash
 nvidia-smi -q -i 0 | grep -i -A 2 Fabric
```

The output from that command should appear as follows:

```text
        GPU Fabric GUID                   : 0x7215545ecf79e88f
    Inforom Version
        Image Version                     : G525.0225.00.05
--
    Fabric
        State                             : Completed
        Status                            : Success
```

### Configure IOMMU and PCIe ACS

**For best GPU direct and GPU storage direct performance, IOMMU needs to be disabled or set to pass-through and PCIe Access Control Services (ACS) need to be disabled.**
Since for large core count systems (i.e., >= 256 cores) IOMMU can't be disabled or interrupt handling can be impacted, it is recommended to set IOMMU to pass-through. One way to do this is to include "intel_iommu=on iommu=pt" or "amd_iommu=on iommu=pt" on the kernel command line (depending on if the system has Intel or AMD CPUs). This method is recommended since if IOMMU, even if disabled from the UEFI settings perspective, if it is enabled from a Linux kernel perspective, then Linux kernel can also enable ACS. Adding this in a persistent way to the kernel command line can be achieved by modifying the "GRUB_CMDLINE_LINUX_DEFAULT" entry in the /etc/default/grub file. For example, change:

```bash
 GRUB_CMDLINE_LINUX_DEFAULT="console=tty0 console=ttyS0,115200"
```

to

```bash
 GRUB_CMDLINE_LINUX_DEFAULT="console=tty0 console=ttyS0,115200 intel_iommu=on iommu=pt"
```

in /etc/default/grub and then run

```bash
 grub2-mkconfig -o /boot/grub2/grub.cfg --update-bls-cmdline
```

!!! note
    It is recommended also to back up the /boot/grub2/grub.cfg file before running the grub2-mkconfig command.

Disabling ACS can on some systems be done using UEFI settings, since the OS can enable this despite the value of the UEFI setting, it is recommended to disable ACS using the following script:

```bash
#!/bin/bash

for BDF in `lspci -d "*:*:*" | awk '{print $1}'`; do
  # skip if it doesn't support ACS
  sudo setpci -v -s ${BDF} ECAP_ACS+0x6.w > /dev/null 2>&1
  if [ $? -ne 0 ]; then
    continue
  fi
  sudo setpci -v -s ${BDF} ECAP_ACS+0x6.w=0000
done
```

This script should be set to run on boot.

Checking the iommu status can be checked with

```bash
 cat /proc/cmdline
```

and checking the ACS status can be checked by running

```bash
 /usr/local/cuda/gds/tools/gdscheck -p
```

## NVIDIA GPU Driver Install on Ubuntu 24.04

The following procedure is for installing the NVIDIA GPU drivers on Ubuntu 24.04.3.

!!! note
    This is for a single-node install. Scale with nodeshell.  Arguments to make these steps unattended have been included.

### Install the NVIDIA GPU drivers

**Install the NVIDIA driver local repo:**
Note that while this can be redundant with the CUDA local repo package, since the CUDA local repo package also contains the NVIDIA drivers, there can be cases where a different version of the NVIDIA driver from that contained in the version of CUDA that is being used is desired.  Because of that, this procedure details installing the NVIDIA GPU drivers from the NVIDIA driver local repo.

```bash
 dpkg -i /cluster/drivers/nvidia/580.65.06/nvidia-driver-local-repo-ubuntu2404-580.65.06_1.0-1_amd64.deb
```

**Enroll the NVIDIA driver local repo GPG key:**

```bash
 cp /var/nvidia-driver-local-repo-ubuntu2404-580.65.06/nvidia-driver-local-C9531D52-keyring.gpg /usr/share/keyrings/
```

**Pin the NVIDIA GPU driver version to that from the NVIDIA GPU driver local repo:**
The Ubuntu 24.04 OS repos contain many versions of the NVIDIA GPU drivers.  To make sure the version installed is the one from the NVIDIA GPU driver local repo installed above, pin the version as follows (note that in this case the 580.65.06 NVIDIA GPU driver version is being used):

```bash
 cat << EOF > /etc/apt/preferences.d/nvidia
 Package: src:*nvidia*:any src:cuda-drivers:any src:cuda-compat:any
 Pin: version 580.65.06-0ubuntu1
 Pin-Priority: 1000
 EOF
```

**Update the apt repo cache:**
Update the apt repo cache for the newly installed NVIDIA driver local repo:

```bash
 DEBIAN_FRONTEND=noninteractive apt-get update -y
```

**Install the NVIDIA GPU driver packages:**
Install the NVIDIA GPU driver packages.  The following examples will install the minimal number of packages necessary, suitable for a light-weight compute node install.

!!! warning
    This step should be done after DOCA is installed, otherwise the nvidia-peermem module will not be compiled with the correct InfiniBand support and may fail to load.

In most cases the open drivers should be installed, as follows:

```bash
 DEBIAN_FRONTEND=noninteractive apt-get install -V -y libnvidia-compute-580 nvidia-dkms-580-open nvidia-compute-utils-580 nvidia-utils-580 libnvidia-cfg1-580
```

However, in some cases issues have been observed with the open drivers (*e.g.*, when using 5th Generation AMD EPYC(TM) Processors).  In this case the proprietary drivers should be installed instead:

```bash
 DEBIAN_FRONTEND=noninteractive apt-get install -V -y libnvidia-compute-580 nvidia-dkms-580 nvidia-compute-utils-580 nvidia-utils-580 libnvidia-cfg1-580
```

### Install GPU Direct Storage (GDS) support

**Install the CUDA local repo package:**
The CUDA repo is required to install the GPU Direct Storage (GDS) kernel module and utility packages.

```bash
 dpkg -i /cluster/software/cuda/13.0.0/cuda-repo-ubuntu2404-13-0-local_13.0.0-580.65.06-1_amd64.deb
```

**Enroll the CUDA local repo GPG key:**

```bash
 cp /var/cuda-repo-ubuntu2404-13-0-local/cuda-BFD0EC79-keyring.gpg /usr/share/keyrings/
```

**Prioritize the CUDA local repo:**
To prioritize the CUDA local repo, run the following (note the cuda-ubuntu-2404.pin file has been placed in the `/cluster/software/cuda/13.0.0/` directory in this case):

```bash
 cp /cluster/software/cuda/13.0.0/cuda-ubuntu2404.pin /etc/apt/preferences.d/cuda-repository-pin-600
```

**Update the apt repo cache:**
Update the apt repo cache for the newly installed CUDA local repo:

```bash
 DEBIAN_FRONTEND=noninteractive apt-get update -y
```

**Install the GDS kernel module package:**

```bash
 yes | DEBIAN_FRONTEND=noninteractive apt-get install -V -y nvidia-fs
```

**Install the GDS utility packages:**

```bash
 DEBIAN_FRONTEND=noninteractive apt-get install -V -y nvidia-gds
```

**Install the nvidia-fabric manager packages (needed for HGX 8 GPU configs) (optional):**

```bash
 DEBIAN_FRONTEND=noninteractive apt-get install -V -y nvidia-fabricmanager-580 libnvidia-nscq-580 nvidia-imex-580
```

**Install additional nvidia-fabric manager packages for B200 (needed for HGX 8 GPU B200 configs) (optional):**

```bash
 DEBIAN_FRONTEND=noninteractive apt-get install -V -y nvlsm
```

### Reboot and verify

**Reboot:**

```bash
 reboot
```

**Check driver status:**
The following should show the correct driver version installed for the correct kernel version:

```bash
 dkms status
```

The nvidia driver should be loaded and the nouveau driver should not be loaded:

```bash
 lsmod | grep -i nvidia
 lsmod | grep -i nouveau
```

Make sure the nouveau driver never loaded during the boot process:

```bash
 dmesg | grep -i nouveau
```

**Make sure the version of the nvidia driver running is correct:**

```bash
 cat /sys/module/nvidia/version
```

**Start the nvidia-persistenced service and make sure its running OK:**

```bash
 systemctl start nvidia-persistenced
 systemctl status nvidia-persistenced
```

Start the nvidia-fabricmanager service and make sure its running OK (note, this is only necessary for and should only be run on 8-GPU HGX systems only):

```bash
 systemctl start nvidia-fabricmanager
 systemctl status nvidia-fabricmanager
```

**Check that nvidia-smi reports all expected GPUs:**

```bash
 nvidia-smi
```

**Check the NVLINKs (where applicable--this applies to all HGX systems and systems with PCIe GPUs with NVLINK bridge cards installed).  All expected links should show up at expected bandwidth:**

```bash
 nvidia-smi nvlink -s
```

**Check the NVLINK fabric status (applicable for HGX 8-way configurations):**

```bash
 nvidia-smi -q -i 0 | grep -i -A 2 Fabric
```

The output from that command should appear as follows:

```text
        GPU Fabric GUID                   : 0x7215545ecf79e88f
    Inforom Version
        Image Version                     : G525.0225.00.05
--
    Fabric
        State                             : Completed
        Status                            : Success
```

### Configure IOMMU and PCIe ACS

**For best GPU direct and GPU storage direct performance, IOMMU needs to be disabled or set to pass-through and PCIe Access Control Services (ACS) need to be disabled.**
Since for large core count systems (i.e., >= 256 cores) IOMMU can't be disabled or interrupt handling can be impacted, it is recommended to set IOMMU to pass-through. One way to do this is to include "intel_iommu=on iommu=pt" or "amd_iommu=on iommu=pt" on the kernel command line (depending on if the system has Intel or AMD CPUs). This method is recommended since if IOMMU, even if disabled from the UEFI settings perspective, if it is enabled from a Linux kernel perspective, then Linux kernel can also enable ACS. Adding this in a persistent way to the kernel command line can be achieved by modifying the "GRUB_CMDLINE_LINUX_DEFAULT" entry in the /etc/default/grub file. For example, change:

```bash
 GRUB_CMDLINE_LINUX_DEFAULT="console=tty0 console=ttyS0,115200"
```

to

```bash
 GRUB_CMDLINE_LINUX_DEFAULT="console=tty0 console=ttyS0,115200 intel_iommu=on iommu=pt"
```

in /etc/default/grub and then run

```bash
 update-grub2
```

!!! note
    It is recommended also to back up the /boot/grub/grub.cfg file before running the update-grub2 command.

Disabling ACS can on some systems be done using UEFI settings, since the OS can enable this despite the value of the UEFI setting, it is recommended to disable ACS using the following script:

```bash
#!/bin/bash

for BDF in `lspci -d "*:*:*" | awk '{print $1}'`; do
  # skip if it doesn't support ACS
  sudo setpci -v -s ${BDF} ECAP_ACS+0x6.w > /dev/null 2>&1
  if [ $? -ne 0 ]; then
    continue
  fi
  sudo setpci -v -s ${BDF} ECAP_ACS+0x6.w=0000
done
```

This script should be set to run on boot.

Checking the iommu status can be checked with

```bash
 cat /proc/cmdline
```

and checking the ACS status can be checked by running

```bash
 /usr/local/cuda/gds/tools/gdscheck -p
```
