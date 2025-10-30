---
layout: page
title: Troubleshooting issues with upgrading BlueField-3 BFB using DOCA (host) 3.0
permalink: /documentation/bf3-troubleshooting.html
---


# RHEL/Rocky Linux 9.5
 The following items apply for RHEL/Rocky Linux 9.5.

## Updating the BFB on BlueField-3 adapters using doca-installer requires full path to *.bfb file
 When using the doca-installer utility (newly available in DOCA 3.0), the following errors may occur:
 ```
 Extracting firmware versions from ./bf-bundle-3.0.0-135_25.04_ubuntu-22.04_prod.bfb
 Warning: Failed to extract info-v0 - component may not exist in image or extraction not supported.
 Warning: Failed to extract bl33-v0 - component may not exist in image or extraction not supported.
 Warning: Failed to extract bl2-v0 - component may not exist in image or extraction not supported.
 Warning: info-v0 component could not be extracted from the image.
 Warning: Failed to extract firmware versions from the image bundle - Will not be able to verify post installation versions.
 ```
 This occurs when the path to the *.bfb file is provided to the doca-installer utility as a relative path.  Using the absolute path (from "/") allows doca-installer to run without this error.

## Updating the BFB on BlueField-3 adapters using doca-installer may exit with "Broken pipe"
 When updating the BFB on BlueField-3 adapters using doca-installer, the command may exit with the following text:
 ```
 client_loop: send disconnect: Broken pipe
 ```
 In this case it has been observed that the update does succeed anyway.  Check the code levels on the BlueField-3 adapter after the update to confirm.
