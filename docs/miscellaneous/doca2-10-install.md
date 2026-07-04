---
title: DOCA 2.10 Installation on RHEL 9.5
tags:
  - drivers
---

The following procedure is for installing the NVIDIA DOCA stack (`doca-ofed` profile) on RHEL 9.5.

!!! note
    This is for a single-node install.  Scale with `nodeshell` and arguments to make these steps unattended as needed.

### Prepare the system

**Register and subscribe a RHEL system to the Red Hat Customer Portal using Red Hat Subscription-Manager:**
This is required because some of the packages required are only available for registered systems.
```bash
subscription-manager register --username <username> --password <password>
subscription-manager release --set=9.5
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
This step is optional, and is intended to keep all but the kernel packages at the base RHEL 9.5 levels.  This is mainly for reproducibility of environment, but leaving this step out to allow all of the OS packages to be at the latest level is equally valid.
```bash
subscription-manager repos --disable=rhel-9-for-x86_64-appstream-rpms
subscription-manager repos --disable=rhel-9-for-x86_64-baseos-rpms
```

**Reboot the system using the newly installed kernel:**
```bash
reboot
```


### Install DOCA

**Install DOCA host local repo:**
```bash
rpm -ivh <path to local doca repo RPM>/doca-host-2.10.0-093000_25.01_rhel95.x86_64.rpm
```


**Clean DNF/YUM cache:**
```bash
dnf makecache
```


**Install DOCA extra package for building against errata kernel:**
```bash
dnf install doca-extra
```


**Patch the doca-kernel-support script:**
This step is required since without it the mlnx-ofa_kernel-devel and mlnx-ofa_kernel-source packages will effectively be down-leveled to the ones not built for the errata kernel when installing the `doca-ofed` metapackage later.
```bash
cd /opt/mellanox/doca/tools
```

```bash
cat << 'EOF' > doca-kernel-support.patch
--- doca-kernel-support~        2025-03-18 09:21:43.450159170 -0400
+++ doca-kernel-support 2025-03-18 09:23:02.860806460 -0400
@@ -323,7 +323,7 @@
 	(
 	exec >$log_file 2>&1
 	set -x
-	$gcc_toolset; rpmbuild --rebuild --define "_topdir $top_dir" --define "KVERSION $KVERS" --define "_kmp_build_num .1" --define "K_SRC $KSRC" --define "KMP $KMP" "${find_requires[@]}" "$@" SRPMS/$base_name-[0-9]*.src.rpm
+	$gcc_toolset; rpmbuild --rebuild --define "_dist .rhel9u5" --define "_topdir $top_dir" --define "KVERSION $KVERS" --define "_kmp_build_num .1" --define "K_SRC $KSRC" --define "KMP $KMP" "${find_requires[@]}" "$@" SRPMS/$base_name-[0-9]*.src.rpm
 	)
 	rc=$?
 	$restore_errexit # set -e
EOF
```

```bash
patch -p0 < doca-kernel-support.patch

cd -
```


**Build DOCA kernel packages errata kernel:**
```bash
/opt/mellanox/doca/tools/doca-kernel-support
```

**Install DOCA kernel packages repo built against errata kernel:**
!!! note
    The <temporary directory> name used in this step will be the one shown in the output of the previous step.
```bash
rpm -ivh /tmp/<temporary directory>/doca-kernel-repo-25.01.0.6.0.0-1.kver.5.14.0.503.26.1.el9.5.x86.64.x86_64.rpm
```


**Clean DNF/YUM cache:**
```bash
dnf makecache
```


**Install the DOCA ofed-userspace meta package:**
```bash
dnf install doca-ofed-userspace
```


**Install the DOCA doca-kernel meta package specifically from DOCA kernel packages repo built against errata kernel:**
```bash
dnf install --disablerepo=doca doca-kernel-5.14.0.503.26.1.el9.5.x86.64.noarch
```


**Install the DOCA kmod-mlnx-nvme package specifically from DOCA kernel packages repo built against errata kernel:**
!!! note
    This step is optional and is only needed if using NVMeoF storage.
```bash
dnf install --disablerepo=doca kmod-mlnx-nvme
```


**Install the `doca-ofed` meta package:**
```bash
dnf install doca-ofed
```


**Install the mlnx-fw-updater package:**
```bash
dnf install mlnx-fw-updater
```


### Finish the installation

**Restart the openibd service:**
```bash
/etc/init.d/openibd restart
```


**Restart the mst service:**
```bash
mst restart
```


**Check the mst service status:**
```bash
mst status
```
