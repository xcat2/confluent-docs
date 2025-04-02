---
layout: page
title: Applying software updates to RedHat/CentOS
permalink: /documentation/updatesw_rhel.html
---

After adding the correct repository as indicated in the [download page](../downloads.md), you can
update all the software provided by the repository using yum.  If you want to restrict updates only to the HPC
related software, you may instruct yum to do so by:

    yum --disablerepo=* --enablerepo=lenovo-hpc update

