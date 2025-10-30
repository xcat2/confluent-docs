---
layout: page
title: NVIDIA GPU Driver Install on RHEL 9.5 and Ubuntu 24.04.2
permalink: /documentation/nvidiagpudriverinstall.html
---

# NVIDIA GPU Driver Install on RHEL 9.5

## Notes
 The following procedure is for installing the NVIDIA GPU drivers on RHEL 9.5.  Note that this is for a single-node install.  Scale with nodeshell and arguments to make these steps unattended as needed.


## Register and subscribe a RHEL system to the Red Hat Customer Portal using Red Hat Subscription-Manager
 This is required because some of the packages required are only available for registered systems. 
 ```
 subscription-manager register --username <username> --password <password> 
 subscription-manager release --set=9.5
 subscription-manager repos --enable codeready-builder-for-rhel-9-x86_64-rpms
 dnf install -y wget
 wget https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
 rpm -ivh epel-release-latest-9.noarch.rpm
 dnf install dnf-plugin-config-manager
 crb enable
 ```


## Prerequisites
 DOCA must be installed ***before*** installing the GPU drivers to make sure the nvidia-peermem kernel module gets the right Infiniband symbols.

## Enable update repos
 ```
 subscription-manager repos --enable=rhel-9-for-x86_64-baseos-rpms
 subscription-manager repos --enable=rhel-9-for-x86_64-appstream-rpms
 ```


## Install newer kernel packages
 Note that these steps install a new version as opposed to replacing the older kernel version(s), so the system can be booted to the older kernel version(s) if needed.
 ```
 dnf install kernel kernel-core kernel-modules-core kernel-modules 
 ```


## Install newer kernel devel packages
 Note that these steps install a new version as opposed to replacing the older kernel version(s), so the system can be booted to the older kernel version(s) if needed.
 ```
 dnf install kernel-devel kernel-devel-matched kernel-headers kernel-modules-extra
 ```


## Update kernel tools and kernel abi stablelists
 Note that this still will update the existing kernel tools packages, as multiple versions of these kernel tools on the system as the same time.
 ```
 dnf install kernel-tools kernel-tools-libs kernel-abi-stablelists
 ```


## Install dkms
 ```
 dnf install dkms
 ```


## Disable update repos
 ```
 subscription-manager repos --disable=rhel-9-for-x86_64-appstream-rpms
 subscription-manager repos --disable=rhel-9-for-x86_64-baseos-rpms
 ```


## Reboot the system using the newly installed kernel
 ```
 reboot
 ```


## Install GPU driver local repo
 ```
 rpm -ivh <path to nvidia local repo RPM>/nvidia-driver-local-repo-rhel9-570.124.06-1.0-1.x86_64.rpm
 ```


## Clean DNF/YUM cache
 ```
 dnf clean all
 ```


## Backup grub.cfg from ESP
 When installing the nvidia-kmod-common package from the NVIDIA 570.124.06 local driver repo on RHEL 9.5 on an EFI-booted system, the /boot/efi/EFI/redhat/grub.cfg file, which is a "stub" grub.cfg in the EFI system partition (ESP) that only points to /boot/grub2 for the full grub.cfg, is overwritten with a full grub.cfg and the grub.cfg in /boot/grub2 is not updated.  To work around this, backup the grub.cfg in the ESP (this will be restored and the grub.cfg file in /boot/grub2 fixed after installing the GPU drivers):
 ```
 cp /boot/efi/EFI/redhat/grub.cfg ~/grub.cfg.PRE-NVIDIA
 ```


## Install GPU drivers
 **Note** The nvidia-fabric-manager package is only necesssary on 8-GPU HGX configs.
 ```
 dnf install nvidia-driver-cuda kmod-nvidia-open-dkms nvidia-fabric-manager
 ```


## Restore backed up stub grub.cfg and fix grub.cfg in /boot/grub2
 ```
 cp -f /boot/efi/EFI/redhat/grub.cfg /boot/grub2
 cp -f ~/grub.cfg.PRE-NVIDIA /boot/efi/EFI/redhat95/grub.cfg
 ```


## Reboot
 ```
 reboot
 ```


## Check driver status
 The following should show the correct driver version installed for the correct kernel version:
 ```
 dkms status
 ```
 The nvidia driver should be loaded and the nouveau driver should not be loaded:

 ```
 lsmod | grep -i nvidia
 lsmod | grep -i nouveau
 ```

 Make sure the nouveau driver never loaded during the boot process:

 ```
 dmesg | grep -i nouveau
 ```


## Make sure the version of the nvidia driver running is correct:
 ```
 cat /sys/module/nvidia/version
 ```


## Start the nvidia-persistenced service and make sure its running OK:
 ```
 systemctl start nvidia-persistenced
 systemctl status nvidia-persistenced
 ```
 Start the nvidia-fabricmanager service and make sure its running OK (note, this is only necessary for and should only be run on 8-GPU HGX systems only):
 ```
 systemctl start nvidia-fabricmanager
 systemctl status nvidia-fabricmanager
 ```


## Check that nvidia-smi reports all expected GPUs:
 ```
 nvidia-smi
 ```


## Check the NVLINKs (where applicable--this applies to all HGX systems and systems with PCIe GPUs with NVLINK bridge cards installed).  All expected links should show up at expected bandwidth:
 ``` 
 nvidia-smi nvlink -s
 ```


## Check the NVLINK fabric status (applicable for HGX 8-way configurations)
 ```
 nvidia-smi -q -i 0 | grep -i -A 2 Fabric
 ```
 The output from that command should appear as follows:
 ```
         GPU Fabric GUID                   : 0x7215545ecf79e88f
     Inforom Version
         Image Version                     : G525.0225.00.05
 --
     Fabric
         State                             : Completed
         Status                            : Success
 ```

<br>
<br>
<br>
<br>


# NVIDIA GPU Driver Install on Ubuntu 24.04.2

## Notes
 The following procedure is for installing the NVIDIA GPU drivers on Ubuntu 24.04.2.
 
 **NOTE** This is for a single-node install. Scale with nodeshell.  Arguments to make these steps unattended have been included.

## Install the NVIDIA driver local repo
 Install the NVIDIA driver local repo package.  Note that while this can be redundant with the CUDA local repo package, since the CUDA local repo package also contains the NVIDIA drivers, there can be cases where a different version of the NVIDIA driver from that contained in the version of CUDA that is being used is desired.  Because of that, this procedure details installing the NVIDIA GPU drivers from the NVIDIA driver local repo.
 ```
 dpkg -i /cluster/drivers/nvidia/570.124.06/nvidia-driver-local-repo-ubuntu2404-570.124.06_1.0-1_amd64.deb
 ```

## Enroll the NVIDIA driver local repo GPG key
 Enroll the GPG key for the NVIDIA driver local repo:
 ```
 cp /var/nvidia-driver-local-repo-ubuntu2404-570.124.06/nvidia-driver-local-D67F55A1-keyring.gpg /usr/share/keyrings/
 ```

## Pin the NVIDIA GPU driver version to that from the NVIDIA GPU driver local repo
 The Ubuntu 24.04 OS repos contain many versions of the NVIDIA GPU drivers.  To make sure the version installed is the one from the NVIDIA GPU driver local repo installed above, pin the version as follows (note that in this case the 570.124.06 NVIDIA GPU driver version is being used):
 ```
 cat << EOF > /etc/apt/preferences.d/nvidia
 Package: src:*nvidia*:any src:cuda-drivers:any src:cuda-compat:any
 Pin: version 570.124.06-0ubuntu1
 Pin-Priority: 1000
 EOF
 ```

## Update the apt repo cache
 Update the apt repo cache for the newly installed NVIDIA driver local repo:
 ```
 DEBIAN_FRONTEND=noninteractive apt-get update -y
 ```

## Install the NVIDIA GPU driver packages
 Install the NVIDIA GPU driver packages.  The following examples will install the minimal number of packages necessary, suitable for a light-weight compute node install.  **Note** that this step should be done **after** DOCA is installed, otherwise the nvidia-peermem module will not be compiled with the correct InfiniBand support and may fail to load.

 In most cases the open drivers should be installed, as follows:
 ```
 DEBIAN_FRONTEND=noninteractive apt-get install -V -y libnvidia-compute-570 nvidia-dkms-570-open nvidia-compute-utils-570 nvidia-utils-570 libnvidia-cfg1-570
 ```
 However, in some cases issues have been observed with the open drivers (*e.g.*, when using 5th Generation AMD EPYC(TM) Processors).  In this case the proprietary drivers should be installed instead:
 ```
 DEBIAN_FRONTEND=noninteractive apt-get install -V -y libnvidia-compute-570 nvidia-dkms-570 nvidia-compute-utils-570 nvidia-utils-570 libnvidia-cfg1-570
 ```

## Extract the contents of the CUDA local repo package
 The CUDA repo is required to install the GPU Direct Storage (GDS) kernel module and utility packages. While the CUDA local repo package can simply be installed locally on each compute node, this can take up a lot of local storage space.  A more efficient way of making the CUDA local repo available to all compute nodes is to extract the files from the CUDA local repo package to a network share available to all compute nodes.  In the following example, the `/cluster` directory is the network share mounted on all compute notes, the CUDA local repo package has been placed in the `/cluster/software/cuda/12.8.1` directory, and the `/cluster/software/cuda/12.8.1/ubuntu-repo` directory is the location where the CUDA local repo contents will reside.
 ```
 cd /cluster/software/cuda/12.8.1
 mkdir ubuntu-repo
 dpkg-deb -x cuda-repo-ubuntu2404-12-8-local_12.8.1-570.124.06-1_amd64.deb ubuntu-repo
 ```

## Enroll the CUDA local repo GPG key
 Enroll the GPG key for the CUDA local repo:
 ```
 cp /cluster/software/cuda/12.8.1/ubuntu-repo/var/cuda-repo-ubuntu2404-12-8-local/cuda-B2775641-keyring.gpg /usr/share/keyrings/
 ```

## Prioritize the CUDA local repo:
 To prioritize the CUDA local repo, run the following (note the cuda-ubuntu-2404.pin file has been placed in the `/cluster/software/cuda/12.8.1/` directory in this case):
 ```
 cp /cluster/software/cuda/12.8.1/cuda-ubuntu2404.pin /etc/apt/preferences.d/cuda-repository-pin-600
 ```

## Copy the CUDA repo doc files locally
  Installing the CUDA local repo, aside from setting up the repo itself, does install the docs for the repo.  To replicate this in the case that the CUDA local repo package wasn't actually installed, the doc files can be copied into place.  The following command will do that, using the example directories: 
 ```
 cp -a /cluster/software/cuda/12.8.1/ubuntu-repo/usr/share/doc/cuda-repo-ubuntu2404-12-8-local /usr/share/doc
 ```

## Setup apt repo list file for CUDA local repo
 Since the CUDA local repo package wasn't actually installed, an apt repo list file has to be created to enable the CUDA local repo package contents extracted onto the network share in the step above.  The following commands will set that up for the example path:
 ```
 cat << EOF > /etc/apt/sources.list.d/cuda-ubuntu2404-12-8-local.list
 deb [signed-by=/usr/share/keyrings/cuda-B2775641-keyring.gpg] file:///cluster/software/cuda/12.8.1/ubuntu-repo/var/cuda-repo-ubuntu2404-12-8-local /
 EOF
 ```

## Update the apt repo cache
 Update the apt repo cache for the newly installed CUDA local repo:
 ```
 DEBIAN_FRONTEND=noninteractive apt-get update -y
 ```

## Install the GDS kernel module package
 ```
 DEBIAN_FRONTEND=noninteractive apt-get install -V -y nvidia-fs
 ```

## Install the GDS utility packages
 ```
 DEBIAN_FRONTEND=noninteractive apt-get install -V -y nvidia-gds
 ```

## **OPTIONAL** Install the nvidia-fabric manager packages
 ```
 DEBIAN_FRONTEND=noninteractive apt-get install -V -y nvidia-fabricmanager-570 libnvidia-nscq-570 nvidia-imex-570
 ```

## **OPTIONAL** Install additional nvidia-fabric manager packages for B200
 ```
 DEBIAN_FRONTEND=noninteractive apt-get install -V -y /cluster/drivers/nvidia/570.124.06/nvlsm_2025.01.5-1_amd64.deb
 ```

## Reboot
 ```
 reboot
 ```


## Check driver status
 The following should show the correct driver version installed for the correct kernel version:
 ```
 dkms status
 ```
 The nvidia driver should be loaded and the nouveau driver should not be loaded:

 ```
 lsmod | grep -i nvidia
 lsmod | grep -i nouveau
 ```

 Make sure the nouveau driver never loaded during the boot process:

 ```
 dmesg | grep -i nouveau
 ```


## Make sure the version of the nvidia driver running is correct:
 ```
 cat /sys/module/nvidia/version
 ```


## Start the nvidia-persistenced service and make sure its running OK:
 ```
 systemctl start nvidia-persistenced
 systemctl status nvidia-persistenced
 ```
 Start the nvidia-fabricmanager service and make sure its running OK (note, this is only necessary for and should only be run on 8-GPU HGX systems only):
 ```
 systemctl start nvidia-fabricmanager
 systemctl status nvidia-fabricmanager
 ```


## Check that nvidia-smi reports all expected GPUs:
 ```
 nvidia-smi
 ```


## Check the NVLINKs (where applicable--this applies to all HGX systems and systems with PCIe GPUs with NVLINK bridge cards installed).  All expected links should show up at expected bandwidth:
 ``` 
 nvidia-smi nvlink -s
 ```


## Check the NVLINK fabric status (applicable for HGX 8-way configurations)
 ```
 nvidia-smi -q -i 0 | grep -i -A 2 Fabric
 ```
 The output from that command should appear as follows:
 ```
         GPU Fabric GUID                   : 0x7215545ecf79e88f
     Inforom Version
         Image Version                     : G525.0225.00.05
 --
     Fabric
         State                             : Completed
         Status                            : Success
 ```


