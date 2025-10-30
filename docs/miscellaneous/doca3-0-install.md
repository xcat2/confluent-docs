---
layout: page
title: DOCA 3.0 Installation/Upgrade on RHEL 9.5 and Ubuntu 24.04.2
permalink: /documentation/doca3-0-install.html
---

# DOCA 3.0 Installation/Upgrade on RHEL 9.5

The following procedure is for installing or upgrading the NVIDIA DOCA stack (doca-ofed profile) on RHEL 9.5. 

 **NOTE** This is for a single-node install.  Scale with nodeshell and arguments to make these steps unattended as needed. 

## Uninstall previous version of DOCA
 If upgrading from a previous version of DOCA, make sure to uninstall the previous version first, using the followoing steps (the following is an example for uninstalling DOCA 2.10):
```
for f in $(rpm -qa | grep -i doca ) ; do yum -y remove $f; done
```
Note, the previous step doesn't uninstall all of the packages installed by DOCA, also run the following:
```
rpm -e kmod-mlnx-ofa_kernel-25.01-OFED.25.01.0.6.0.1.1.rhel9u5.x86_64 kmod-mlnx-nvme-25.01-OFED.25.01.0.6.0.1.1.rhel9u5.x86_64 mlnx-fw-updater-25.01-0.6.0.0.x86_64
```
Next run:
```
dnf autoremove
dnf makecache
```
Finally reboot the system to complete the uninstallation:
```
reboot
```

Also, note running
```
yum upgrade <doca-profile>
```
isn't sufficient to upgrade DOCA if the doca-extras step has been used during installation of the currently installed version of DOCA.  Starting with the full uninstall as mentioned above should be done in this case.

Additionally, running
```
/usr/sbin/ofed_uninstall.sh --force
```
has been found to not work after running the "for f in $(rpm -qa | grep -i doca ) ; do yum -y remove $f; done" step to uninstall DOCA 2.10 as the ofed_uninstall.sh script then does not exist.  The steps above though do remove the DOCA package, so the ofed_uninstall.sh command can be omitted.

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


## Enable update repos
 These should be enabled already after the previous registration step, but this step will ensure this and is useful as a reference if these repos are disabled later.
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

  
## Disable update repos
 This step is optional, and is intended to keep all but the kernel packages at the base RHEL 9.5 levels.  This is mainly for reproducibility of environment, but leaving this step out to allow all of the OS packages to be at the latest level is equally valid.
 ```
 subscription-manager repos --disable=rhel-9-for-x86_64-appstream-rpms
 subscription-manager repos --disable=rhel-9-for-x86_64-baseos-rpms
 ```

## Reboot the system using the newly installed kernel
 ```
 reboot
 ```


## Install DOCA host local repo
 ```
 rpm -ivh <path to local doca repo RPM>/doca-host-3.0.0-058000_25.04_rhel95.x86_64.rpm
 ```


## Clean DNF/YUM cache 
 ```
 dnf makecache
 ```


## Install DOCA extra package for building against errata kernel
 ```
 dnf install doca-extra
 ```


## Patch the doca-kernel-support script 
 This step is required since without it the mlnx-ofa_kernel-devel and mlnx-ofa_kernel-source packages will effectively be down-leveled to the ones not built for the errata kernel when installing the doca-ofed metapackage later.
 ```
 cd /opt/mellanox/doca/tools
 ```

 ```
cat << 'EOF' > doca-kernel-support.patch
--- doca-kernel-support.ORIG    2025-06-02 11:03:46.181072259 -0400
+++ doca-kernel-support 2025-06-02 11:05:00.002757229 -0400
@@ -353,7 +353,7 @@
 	(
 	exec >$log_file 2>&1
 	set -x
-	$gcc_toolset; rpmbuild --rebuild --define "_topdir $top_dir" --define "KVERSION $KVERS" --define "_kmp_build_num .1" --define "K_SRC $KSRC" --define "KMP $KMP" "${find_requires[@]}" "$@" "$srpm"
+	$gcc_toolset; rpmbuild --rebuild --define "_dist .rhel9u5" --define "_topdir $top_dir" --define "KVERSION $KVERS" --define "_kmp_build_num .1" --define "K_SRC $KSRC" --define "KMP $KMP" "${find_requires[@]}" "$@" "$srpm"
 	)
 	rc=$?
 	$restore_errexit # set -e
EOF
 ```

 ```
 patch -p0 < doca-kernel-support.patch

 cd -
 ```


## Buid DOCA kernel packages errata kernel
 ```
 /opt/mellanox/doca/tools/doca-kernel-support
 ```

## Install DOCA kernel packages repo built against errata kernel
 **Note** The <temporary directory> name used in this step will be the one shown in the output of the previous step.
 ```
 rpm -ivh /tmp/<temporary directory>/doca-kernel-repo-25.04.0.6.1.0-1.kver.5.14.0.503.26.1.el9.5.x86.64.x86_64.rpm
 ```


## Clean DNF/YUM cache
 ```
 dnf makecache
 ```


## Install the DOCA ofed-userspace meta package
 ```
 dnf install doca-ofed-userspace
 ```

## Install the kmod-mlnx-ofa_kernel package before installing the doca-kernel metapackage.
 This step is required to avoid an issue where the kmod-srp package installs before the kmod-mlnx-ofa_kernel package is installed when the doca-kernel metapackage is installed, resulting in symbol error output from the install of the kmod-srp package.
 ```
 dnf install --disablerepo=doca  --setopt=install_deps=False kmod-mlnx-ofa_kernel
 ```

## Install the DOCA doca-kernel meta package specifically from DOCA kernel packages repo built against errata kernel
 ```
 dnf install --disablerepo=doca doca-kernel-5.14.0.503.26.1.el9.5.x86.64.noarch
 ```

## Install the DOCA kmod-mlnx-nvme package specifically from DOCA kernel packages repo built against errata kernel
 **Note** This step is optional and is only needed if using NVMeoF storage.
 ```
 dnf install --disablerepo=doca kmod-mlnx-nvme
 ```

## Install the doca-ofed meta package
 ```
 dnf install doca-ofed
 ```


## Install the mlnx-fw-updater package
 ```
 dnf install mlnx-fw-updater
 ```

## Restart the system
Note, restarting the system after the DOCA install or upgrade has been found to be more reliable then just restarting the openibd service (particularly on upgrade as restarting the openibd service has been found to cause system hangs in some cases).
 ```
 reboot
 ```

## Check nvlsm
For configurations where nvlsm was installed prior to upgrading DOCA, check to make sure it is still installed after the DOCA upgrade--in some cases the DOCA upgrade has been observed to remove nvlsm, in which case nvlsm will need to be re-installed after the DOCA upgrade.

<br>
<br>
<br>
<br>


# DOCA 3.0 Installation on Ubuntu 24.04.2

 The following procedure is for installing the NVIDIA DOCA stack (doca-ofed profile) on Ubuntu 24.04.2.

 **NOTE** This is for a single-node install. Scale with nodeshell.  Arguments to make these steps unattended have been included.

## Install `make`
 An environment able to build kernel modules is necessary for installing DOCA with updated kernels on Ubuntu 24.04.  The DOCA packages don't include a dependency on `make`, though it is needed, so run the following to install `make`:
 ```
 DEBIAN_FRONTEND=noninteractive apt-get install -y make
 ```

## Install the DOCA host repo package:
 Install the DOCA host repo packaage:
 ```
 DEBIAN_FRONTEND=noninteractive dpkg -i <path to>/doca-host_3.0.0-058000-25.04-ubuntu2404_amd64.deb
 ```

 and update the apt repo cache to include the newly installed DOCA repo:
 ```
 DEBIAN_FRONTEND=noninteractive apt-get update -y
 ```

## Install the doca-extra package
 There are two ways (mutually exclusive) of generating kernel module packages for the kernel modules included with DOCA 3.0.0 in Ubuntu for updated kernels.  One is to use the doca-extra package to build the kernel module packages explicitly against the updated kernel.  Another is to allow the dkms versions of the kernel module packages to be installed, in which case the kernel modules will implicitly be built against the update kernel.  The first of these options will be used here:
 ```
 DEBIAN_FRONTEND=noninteractive apt-get install -y doca-extra
 ```

## Build the DOCA kernel module packages against the updated kernel:
 Run the following script provided by the doca-extra package to build the DOCA kernel module packages against the updated kernel:
 ```
 DEBIAN_FRONTEND=noninteractive /opt/mellanox/doca/tools/doca-kernel-support
 ```

## Install the DOCA kernel repo generated by the doca-kernel-support script
 The doca-kernel-support script will generate a DOCA kernel repo package containing the DOCA kernel module packages built against the updated kernel.  This will be placed in `/tmp/DOCA.<suffix>`, where `<suffix>` is different each time the doca-kernel-support script is run.  If the doca-kernel-support script has been only run once, then using a wild card is sufficient to match this suffix and allows for scripting these install instructions without having to parse what `<suffix>` is in each case.  Note also that the particular updated kernel version will be in the DOCA kernel repo package name.  In this case kernel `6.8.0-63-generic` was used:
 ```
 DEBIAN_FRONTEND=noninteractive dpkg -i /tmp/DOCA.*/doca-kernel-repo-25.04-0.6.1.0-6.8.0.63.generic_25.04.0.6.1.0_amd64.deb
 ```

 Update the apt repo cache to include the newly installed DOCA kernel repo:
 ```
 DEBIAN_FRONTEND=noninteractive apt-get update -y
 ```

## Install the doca-ofed-userspace and doca-kernel-* metapackages
 Install the doca-ofed-userspace and doca-kernel-* metapackages.  Installing the doca-kernel-* metapackage will install the DOCA kernel module packages built against the updated kernel in the previous steps.  Installing the doca-ofed-userspace metapackage will install most of the packages from the doca-ofed DOCA profile, with the exception of the DOCA kernel module dkms packages (which are unnecessary in this case since the DOCA kernel module packages were built in the previous steps, and conflict with the installation of the DOCA kernel module packages when they are installed), and the xpmem package.
 ```
 DEBIAN_FRONTEND=noninteractive apt-get install -y doca-ofed-userspace doca-kernel-6.8.0.63.generic
 ```

## Install the mlnx-fw-updater package
 Install the mlnx-fw-updater package.  Note that this package will not contain firmware for Lenovo-customized adapters--the firmware on those adapters will have to be updated separately.
 ```
 DEBIAN_FRONTEND=noninteractive apt-get install -y mlnx-fw-updater
 ```

## Install xpmem
 Install the xpmem package (this would have normally been installed when the doca-ofed metapackage was installed, but since the doca-ofed-userspace package is used in this case, the xpmem package has to be isntalled separately):
 ```
 DEBIAN_FRONTEND=noninteractive apt-get install -y xpmem
 ```

## **OPTIONAL** Install mlnx-nvme-modules
 If the using NVMeoF, install the mlnx-nvme-modules package:
 ```
 DEBIAN_FRONTEND=noninteractive apt-get install -y mlnx-nvme-modules
 ```
 and make sure the nvme-rdma module loads on boot up by adding the following *.conf file to /etc/modules-load.d:
 ```
 echo "nvme-rdma" > /etc/modules-load.d/nvme-rdma.conf
 ```
 
 ## Update the initramfs
 Update the initramfs to make sure all of the new kernel modules in particular are loaded on boot:
 ```
 update-initramfs -u
 ```

 ## Restart the system
Note, restarting the system after the DOCA install or upgrade has been found to be more reliable then just restarting the openibd service (particularly on upgrade as restarting the openibd service has been found to cause system hangs in some cases).
 ```
 reboot
 ```