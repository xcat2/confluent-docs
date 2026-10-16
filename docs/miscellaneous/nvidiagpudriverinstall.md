---
title: NVIDIA GPU Driver Install on RHEL 9 and Ubuntu 24.04
tags:
  - drivers
---

## NVIDIA GPU Driver Install on RHEL 9

The following procedure is for installing NVIDIA GPU driver 580.126.09 on RHEL 9.6.  Note that this is for a single-node install.  Scale with `nodeshell` and arguments to make these steps unattended as needed.

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
rpm -ivh <path to nvidia local repo RPM>/nvidia-driver-local-repo-rhel9-580.126.09-1.0-1.x86_64.rpm
```

**Clean DNF/YUM cache:**

```bash
dnf clean all
dnf makecache
```

**Install GPU drivers:**

```bash
dnf module enable nvidia-driver:open-dkms/fm
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
rpm -ivh /cluster/software/cuda/13.0.2/cuda-repo-rhel9-13-0-local-13.0.2_580.95.05-1.x86_64.rpm
```

**Clean DNF/YUM cache:**

```bash
dnf clean all
dnf makecache
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
Since for large core count systems (i.e., >= 256 cores) IOMMU can't be disabled or interrupt handling can be impacted, it is recommended to set IOMMU to pass-through. One way to do this is to include "intel_iommu=on iommu=pt" or "amd_iommu=on iommu=pt" on the kernel command line (depending on if the system has Intel or AMD CPUs). This method is recommended since if IOMMU, even if disabled from the UEFI settings perspective, if it is enabled from a Linux kernel perspective, then Linux kernel can also enable ACS. Adding this in a persistent way to the kernel command line can be achieved by modifying the "GRUB_CMDLINE_LINUX_DEFAULT" entry in the `/etc/default/grub` file. For example, change:

```bash
GRUB_CMDLINE_LINUX_DEFAULT="console=tty0 console=ttyS0,115200"
```

to

```bash
GRUB_CMDLINE_LINUX_DEFAULT="console=tty0 console=ttyS0,115200 intel_iommu=on iommu=pt"
```

in `/etc/default/grub` and then run

```bash
grub2-mkconfig -o /boot/grub2/grub.cfg --update-bls-cmdline
```

!!! note
    It is recommended also to back up the `/boot/grub2/grub.cfg` file before running the grub2-mkconfig command.

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

The following procedure installs NVIDIA GPU driver 595.71.05 and CUDA Toolkit 13.2.1 on Ubuntu 24.04.4.

!!! note
    This is for a single-node install. Scale with `nodeshell`. Arguments to make these steps unattended are included.

### Install the NVIDIA GPU drivers

**Install the NVIDIA driver local repo:**

The NVIDIA driver repo allows you to select a driver version independently of the version supplied by the CUDA repo.

```bash
dpkg -i /cluster/drivers/nvidia/595.71.05/nvidia-driver-local-repo-ubuntu2404-595.71.05_1.0-1_amd64.deb
```

**Enroll the NVIDIA driver local repo GPG key and update the package cache:**

```bash
cp /var/nvidia-driver-local-repo-ubuntu2404-595.71.05/nvidia-driver-local-0EC8F1BA-keyring.gpg /usr/share/keyrings/
DEBIAN_FRONTEND=noninteractive apt-get update -y
```

**Pin the NVIDIA GPU driver version:**

The Ubuntu repositories contain several driver versions. Install the pinning package to select 595.71.05 from the local NVIDIA repo:

```bash
DEBIAN_FRONTEND=noninteractive apt-get install -V -y nvidia-driver-pinning-595.71.05
```

**Install the NVIDIA GPU driver packages:**

!!! warning
    Install [DOCA](doca3-0-install.md) before the GPU drivers so that the `nvidia-peermem` module is compiled with the correct InfiniBand support.

The open drivers are used for Ubuntu 24.04.4 and driver 595.71.05. These packages provide a minimal installation for a compute node:

```bash
DEBIAN_FRONTEND=noninteractive apt-get install -V -y libnvidia-compute nvidia-dkms-open
```

**Set up the `nvidia_peermem` DKMS dependency:**

This dependency rebuilds the peer-memory module when DOCA is updated:

```bash
echo 'BUILD_DEPENDS[4]="mlnx-ofed-kernel"' >> /etc/dkms/nvidia.conf
echo 'BUILD_DEPENDS_REBUILD=yes' >> /etc/dkms/nvidia.conf
```

**Install the fabric manager packages for HGX 8-GPU systems (optional):**

```bash
lspci | grep -i nvswitch && DEBIAN_FRONTEND=noninteractive apt-get install -V -y nvidia-fabricmanager libnvidia-nscq nvidia-imex
```

**Install additional fabric manager packages for HGX 8-GPU B200 systems (optional):**

```bash
lspci | grep -i mell | cut -f 1 -d ' ' | xargs -i /bin/bash -c "lspci -vvn -s {}" | grep -i umbriel > /dev/null && DEBIAN_FRONTEND=noninteractive apt-get install -V -y nvidia-fabricmanager libnvidia-nscq nvidia-imex libnvsdm nvlsm
```

**Load the peer-memory module on boot, update the initramfs, and reboot:**

```bash
echo "nvidia-peermem" >> /etc/modules-load.d/nvidia-peermem.conf
update-initramfs -u
reboot
```

### Verify the GPU drivers

After reboot, run the following script with Bash. It checks DKMS installation, loaded modules, the driver version, and service state. It also displays GPU inventory and NVLink status. Fabric manager checks apply only to systems with NVSwitch hardware.

```bash
#!/bin/bash

# Define text coloring for clean output
RED='\033[0;31m'
RED2=$'\e[0;31m'
GREEN='\033[0;32m'
GREEN2=$'\e[0;32m'
NC='\033[0m' # No Color
NC2=$'\e[0m' # No Color

NVIDIA_DRIVER_VERSION="595.71.05"

dkms status | grep 'nvidia/'${NVIDIA_DRIVER_VERSION} | grep -q "installed" && \
    printf "%-40s %s\n" "dkms nvidia driver status:" ${GREEN2}installed${NC2} || \
    printf "%-40s %s\n" "dkms nvidia driver status:" ${RED2}FAIL${NC2}

for i in nvidia nvidia_peermem nvidia_modeset nvidia_drm nvidia_uvm; do
    lsmod | grep -q '^'${i} && \
        printf "%-40s %s\n" "${i} driver loaded:" ${GREEN2}loaded${NC2} || \
        printf "%-40s %s\n" "${i} driver loaded:" ${RED2}FAIL${NC2}
done

echo

lsmod | grep -q '^nouveau' && \
    printf "%-40s %s\n" "nouveau driver not currently loaded:" ${RED2}loaded${NC2} || \
    printf "%-40s %s\n" "nouveau driver not currently loaded:" ${GREEN2}"not loaded"${NC2}

echo

dmesg | grep -q 'nouveau' && \
    printf "%-40s %s\n" "nouveau driver never loaded this boot:" ${RED2}loaded${NC2} || \
    printf "%-40s %s\n" "nouveau driver never loaded this boot:" ${GREEN2}"never loaded"${NC2}

echo

[ ! -d "/sys/module/nvidia" ] && LNDV="NONE" || LNDV=$(cat /sys/module/nvidia/version)

echo ${LNDV} | grep -q ${NVIDIA_DRIVER_VERSION} && \
    printf "%-40s %s\n" "loaded nvidia driver version:" ${GREEN2}${LNDV}${NC2} || \
    printf "%-40s %s\n" "loaded nvidia driver version:" ${RED2}${LNDV}${NC2}

echo

systemctl is-active nvidia-persistenced | grep -q '^active' && \
    printf "%-40s %s\n" "nvidia-persistenced active:" ${GREEN2}$(systemctl is-active nvidia-persistenced)${NC2} || \
    printf "%-40s %s\n" "nvidia-persistenced active:" ${RED2}$(systemctl is-active nvidia-persistenced)${NC2}

systemctl is-enabled nvidia-persistenced | grep -q '^enabled' && \
    printf "%-40s %s\n" "nvidia-persistenced enabled:" ${GREEN2}$(systemctl is-enabled nvidia-persistenced)${NC2} || \
    printf "%-40s %s\n" "nvidia-persistenced enabled:" ${RED2}$(systemctl is-enabled nvidia-persistenced)${NC2}

echo

## For Pre-Blackwell HGX 8
if lspci | grep -qi nvswitch; then
    systemctl is-active nvidia-fabricmanager | grep -q '^active' && \
        printf "%-40s %s\n" "nvidia-fabricmanager active:" ${GREEN2}$(systemctl is-active nvidia-fabricmanager)${NC2} || \
        printf "%-40s %s\n" "nvidia-fabricmanager active:" ${RED2}$(systemctl is-active nvidia-fabricmanager)${NC2}

    systemctl is-enabled nvidia-fabricmanager | grep -q '^enabled' && \
        printf "%-40s %s\n" "nvidia-fabricmanager enabled:" ${GREEN2}$(systemctl is-enabled nvidia-fabricmanager)${NC2} || \
        printf "%-40s %s\n" "nvidia-fabricmanager enabled:" ${RED2}$(systemctl is-enabled nvidia-fabricmanager)${NC2}

## For Blackwell (NVLink5)
elif lspci | grep -i mell | cut -f 1 -d ' ' | xargs -i /bin/bash -c "lspci -vvn -s {}" | grep -i umbriel > /dev/null; then
    systemctl is-active nvidia-fabricmanager | grep -q '^active' && \
        printf "%-40s %s\n" "nvidia-fabricmanager active:" ${GREEN2}$(systemctl is-active nvidia-fabricmanager)${NC2} || \
        printf "%-40s %s\n" "nvidia-fabricmanager active:" ${RED2}$(systemctl is-active nvidia-fabricmanager)${NC2}

    systemctl is-enabled nvidia-fabricmanager | grep -q '^enabled' && \
        printf "%-40s %s\n" "nvidia-fabricmanager enabled:" ${GREEN2}$(systemctl is-enabled nvidia-fabricmanager)${NC2} || \
        printf "%-40s %s\n" "nvidia-fabricmanager enabled:" ${RED2}$(systemctl is-enabled nvidia-fabricmanager)${NC2}
else

    echo -e "\e[1mnvidia-fabric manager not applicable for this system\e[0m"

fi

echo

echo -e "\e[1mnvidia-smi -L output:\e[0m"
echo -e "\e[1m=====================\e[0m"

[ -f "/usr/bin/nvidia-smi" ] && \
    nvidia-smi -L ||
    echo -e "${RED}nvidia-smi not found${NC}"

echo

echo -e "\e[1mnvidia-smi nvlink -s output:\e[0m"
echo -e "\e[1m============================\e[0m"

[ -f "/usr/bin/nvidia-smi" ] && \
    nvidia-smi nvlink -s ||
    echo -e "${RED}nvidia-smi not found${NC}"

echo

echo -e "\e[1mnvidia-smi -q -i 0 | grep -i -A 2 Fabric -s output:\e[0m"
echo -e "\e[1m===================================================\e[0m"

[ -f "/usr/bin/nvidia-smi" ] && \
    nvidia-smi -q -i 0 | grep -i -A 2 Fabric ||
    echo -e "${RED}nvidia-smi not found${NC}"

exit
```

### Install the CUDA toolkit and GPU Direct Storage

**Prioritize the CUDA local repo:**

In this example, the repository pin file is available under `/cluster/software/cuda/13.2.1/`:

```bash
cp /cluster/software/cuda/13.2.1/cuda-ubuntu2404.pin /etc/apt/preferences.d/cuda-repository-pin-600
```

**Install the CUDA local repo package:**

The CUDA repo supplies the toolkit and GPU Direct Storage packages:

```bash
dpkg -i /cluster/software/cuda/13.2.1/cuda-repo-ubuntu2404-13-2-local_13.2.1-595.58.03-1_amd64.deb
```

**Enroll the CUDA local repo GPG key and update the package cache:**

```bash
cp /var/cuda-repo-ubuntu2404-13-2-local/cuda-50F9113D-keyring.gpg /usr/share/keyrings/
DEBIAN_FRONTEND=noninteractive apt-get update -y
```

**Install the CUDA runtime, compiler, and development libraries:**

Install these metapackages instead of the full CUDA toolkit metapackage to avoid its GUI dependencies on headless compute nodes:

```bash
DEBIAN_FRONTEND=noninteractive apt-get install -V -y cuda-runtime-13-2 cuda-compiler-13-2 cuda-libraries-dev-13-2
```

**Install GPU Direct Storage:**

This also installs the `nvidia-fs` kernel module:

```bash
DEBIAN_FRONTEND=noninteractive apt-get install -V -y nvidia-gds
```

### Configure IOMMU and PCIe ACS

For GPU Direct and GPU Direct Storage performance, configure IOMMU pass-through and disable PCIe Access Control Services (ACS). On systems with at least 256 cores, disabling IOMMU entirely can affect interrupt handling, so use pass-through instead.

**Configure IOMMU pass-through:**

Run the following script with Bash. It selects the Intel or AMD IOMMU parameter, backs up `/etc/default/grub`, and updates GRUB. If IOMMU settings already exist, it stops so that you can review them manually.

```bash
#!/bin/bash

### Script to setup IOMMU pass-through for Ubuntu 24.04

# Define text coloring for clean output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

## Attempt to get raw Vendor ID from /proc/cpuinfo
if [ -f /proc/cpuinfo ]; then
    VENDOR_ID=$(grep -m 1 'vendor_id' /proc/cpuinfo | awk -F: '{print $2}' | tr -d '[:space:]')
fi

## Fallback to lscpu if /proc/cpuinfo didn't yield a vendor string
if [ -z "$VENDOR_ID" ] && command -v lscpu >/dev/null 2>&1; then
    VENDOR_ID=$(lscpu | grep -i 'Vendor ID:' | awk -F: '{print $2}' | tr -d '[:space:]')
fi

## Fallback to lscpu Model Name if Vendor ID is still empty (common on ARM/Raspberry Pi)
if [ -z "$VENDOR_ID" ] && command -v lscpu >/dev/null 2>&1; then
    VENDOR_ID=$(lscpu | grep -i 'Model name:' | awk -F: '{print $2}' | tr -d '[:space:]')
fi

## Process the identified vendor ID
case "$VENDOR_ID" in
    *GenuineIntel*)
        echo -e "Result: ${GREEN}Intel Corporation${NC} ($VENDOR_ID)"
        IOMMU_CMD="intel_iommu=on"
        ;;
    *AuthenticAMD*)
        echo -e "Result: ${GREEN}AMD (Advanced Micro Devices)${NC} ($VENDOR_ID)"
        IOMMU_CMD="amd_iommu=on"
        ;;
    *Apple*)
        echo -e "Result: ${RED}Apple Silicon${NC} ($VENDOR_ID)"
        exit 1
        ;;
    *Ampere*|*ARM*|*Cortex*)
        echo -e "Result: ${RED}ARM Architecture${NC} ($VENDOR_ID)"
        exit 1
        ;;
    "")
        echo -e "${RED}Error: Could not detect CPU vendor.${NC}"
        exit 1
        ;;
    *)
        echo -e "Result: ${RED}Unknown / Other Vendor${NC} ($VENDOR_ID)"
        exit 1
        ;;
esac

GRUB_FILE="/etc/default/grub"
BACKUP_FILE="${GRUB_FILE}.bak.$(date +%Y%m%d%H%M%S)"
PARAM="iommu=pt"


if ! grep -q '^GRUB_CMDLINE_LINUX_DEFAULT="' "$GRUB_FILE"; then
    echo "GRUB_CMDLINE_LINUX_DEFAULT is missing. Configure IOMMU manually."
    exit 1
fi

## Check if any iommu settings are already set in GRUB_CMDLINE_LINUX_DEFAULT
if grep -qE '^GRUB_CMDLINE_LINUX_DEFAULT=".*iommu.*"' "$GRUB_FILE"; then
    echo -e "${RED}IOMMU settings in place already--check manually.${NC}"
    exit 1
else
    ## Back up original config
    cp "$GRUB_FILE" "$BACKUP_FILE" || exit 1
    echo "grub file backup created at $BACKUP_FILE"

    echo "Adding $IOMMU_CMD to GRUB_CMDLINE_LINUX_DEFAULT..."

    ## Append the CPU-specific IOMMU parameter and iommu=pt
    sed -i 's/^GRUB_CMDLINE_LINUX_DEFAULT="\(.*\)"/GRUB_CMDLINE_LINUX_DEFAULT="\1 '"$IOMMU_CMD"' '"$PARAM"'"/g' "$GRUB_FILE"
    ## Update the bootloader
    if command -v update-grub2 &> /dev/null; then
        echo "Updating GRUB..."
        update-grub2
    else
        echo -e "${RED}Error: Could not find grub update utility.  Restoring backup grub file.   Please update manually.${NC}"
        cp "$BACKUP_FILE" "$GRUB_FILE"
        exit 1
    fi
fi
```

**Disable ACS at each boot:**

The OS can enable ACS even when it is disabled in UEFI. Run the following script with Bash to create and enable a systemd service that disables ACS at boot:

```bash
#!/bin/bash

cat > /etc/systemd/system/disable-acs.service <<'EOF'
[Unit]
Description=Disable ACS
Requires=network-online.target
After=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/disable-acs.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

cat > /usr/local/bin/disable-acs.sh <<'EOF'
#!/bin/bash
# must be root to access extended PCI config space
if [ "$EUID" -ne 0 ]; then
  echo "ERROR: $0 must be run as root"
  exit 1
fi

for BDF in `lspci -d "*:*:*" | awk '{print $1}'`; do

    # skip if it doesn't support ACS
    setpci -v -s ${BDF} ECAP_ACS+0x6.w > /dev/null 2>&1
    if [ $? -ne 0 ]; then
            #echo "${BDF} does not support ACS, skipping"
            continue
    fi

    echo "Disabling ACS on `lspci -s ${BDF}`"
    setpci -v -s ${BDF} ECAP_ACS+0x6.w=0000
    if [ $? -ne 0 ]; then
        echo "Error disabling ACS on ${BDF}"
            continue
    fi
    NEW_VAL=`setpci -v -s ${BDF} ECAP_ACS+0x6.w | awk '{print $NF}'`
    if [ "${NEW_VAL}" != "0000" ]; then
        echo "Failed to disable ACS on ${BDF}"
            continue
    fi
done
exit 0
EOF

chmod +x /usr/local/bin/disable-acs.sh
systemctl daemon-reload
systemctl enable disable-acs.service

exit 0
```

### Reboot and verify GPU Direct Storage

Update the initramfs and reboot:

```bash
update-initramfs -u
reboot
```

After reboot, run this script with Bash to check the `nvidia-fs` DKMS installation and loaded module, display the IOMMU configuration, and run the GDS checks for IOMMU and ACS:

```bash
#!/bin/bash

# Define text coloring for clean output
RED='\033[0;31m'
RED2=$'\e[0;31m'
GREEN='\033[0;32m'
GREEN2=$'\e[0;32m'
NC='\033[0m' # No Color
NC2=$'\e[0m' # No Color

NVIDIA_FS_DRIVER_VERSION="2.28.4"

dkms status | grep 'nvidia-fs/'${NVIDIA_FS_DRIVER_VERSION} | grep -q "installed" && \
    printf "%-40s %s\n" "dkms nvidia-fs driver status:" ${GREEN2}installed${NC2} || \
    printf "%-40s %s\n" "dkms nvidia-fs driver status:" ${RED2}FAIL${NC2}

echo

lsmod | grep -q '^nvidia_fs' && \
    printf "%-40s %s\n" "nvidia_fs driver loaded:" ${GREEN2}loaded${NC2} || \
    printf "%-40s %s\n" "nvidia_fs driver loaded:" ${RED2}FAIL${NC2}

###
# Setup iommu=pt

cat /proc/cmdline

dmesg | grep -i 'iommu: Default domain type'

#disable acs

/usr/local/cuda-13.2/gds/tools/gdscheck.py -p
```
