---
layout: page
title: Downloads
permalink: /downloads/
toplevel: yes
---

Lenovo provides yum repositories of relevant software for managing HPC as well
as scale out Linux installations in general.  This includes xCAT and confluent.

Adding Repository for Red Hat Enterprise Linux 7
============================
    rpm -ivh https://hpc.lenovo.com/yum/latest/el7/x86_64/lenovo-hpc-yum-1-1.x86_64.rpm
    
On a new Minimal Install without Red Hat Subscription Manager configured. You will need additional packages from the install media. 
Follow instuctions to add the install media as a repository on [https://access.redhat.com/solutions/1355683](https://access.redhat.com/solutions/1355683 "https://access.redhat.com/solutions/1355683"). 

Adding Repository for SuSE Linux Enterprise 12
============================
    zypper install http://hpc.lenovo.com/yum/latest/sles12/x86_64/lenovo-hpc-zypper-1-1.x86_64.rpm
    
Adding Local Repository
============================    
If you cannot reach the repository from your target system, you can download the package from a system that can reach [https://hpc.lenovo.com/downloads/]( https://hpc.lenovo.com/downloads/ "https://hpc.lenovo.com/downloads/" ) and then transfer and install the repositories locally on your target system. 

The files may be browsed at [https://hpc.lenovo.com/downloads/]( https://hpc.lenovo.com/downloads/ "https://hpc.lenovo.com/downloads/" ):

    #On a system that can reach https://hpc.lenovo.com/downloads/
    #Download the package for your specific OS version
    wget https://hpc.lenovo.com/downloads/latest-el7.tar.bz2
    #or
    wget https://hpc.lenovo.com/downloads/latest-sles12.tar.bz2
    
    #On your local system 
    #Create folder for the local repository
    mkdir /mnt/local_repo
    
    #Extract the repository 
    tar -xf latest-el7.tar.bz2 -C /mnt/local_repo
    #or
    tar -xf latest-sles12.tar.bz2 -C /mnt/local_repo
    
    #Create lenovo-hpc.repo to point to the local repository
    cd /mnt/local_repo/lenovo-hpc-el7/
    #or
    cd /mnt/local_repo/lenovo-hpc-sles12/
    ./mklocalrepo.sh
    
Further information
=======================
See the [documentation]({{ site.baseurl }}/documentation) for information on how to install and configure software provided in these repositories.

    
