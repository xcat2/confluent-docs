---
title: Kernel upgrade with DOCA installed
tags:
  - drivers
---

When upgrading the kernel (on RHEL or Ubuntu) with DOCA installed (using the dkms kernel module packages), the following should be run before the kernel update to prevent the build of the iser, isert, or mlnx-nvme dkms modules from failing, which occurs if those builds happen before the mlnx-ofed-kernel dkms module is built.  These settings will force the mlnx-ofed-kernel dkms module to be build first, avoiding this issue:

```
echo '# Force DKMS to build "parent-module" before this one' > /etc/dkms/iser.conf
echo 'BUILD_DEPENDS[0]="mlnx-ofed-kernel"' >> /etc/dkms/iser.conf
echo '# Force DKMS to build "parent-module" before this one' > /etc/dkms/isert.conf
echo 'BUILD_DEPENDS[0]="mlnx-ofed-kernel"' >> /etc/dkms/isert.conf
echo '# Force DKMS to build "parent-module" before this one' > /etc/dkms/mlnx-nvme.conf
echo 'BUILD_DEPENDS[0]="mlnx-ofed-kernel"' >> /etc/dkms/mlnx-nvme.conf
```
