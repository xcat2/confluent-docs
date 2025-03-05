---
layout: page
title: Using xCAT management nodes with an NFS-mounted install directory
permalink: /documentation/sharedinstallnotes.html
---

When using an NFS-mounted install directory, installing or updating the xCAT RPMs can result in errors (e.g., lsetfilecon errors) due to some files in the xCAT RPM installing to the install directory and certain filesystem operations not supported on NFS.

If multiple xCAT servers need to share an install directory, then it is recommended this be done with a single xCAT master and multiple xCAT service nodes, which avoids this issue, as the xCATsn RPM does not install files into the install directory.
