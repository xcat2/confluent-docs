---
layout: page
title: Downloads
permalink: /downloads/
toplevel: yes
---

Lenovo provides yum repositories of relevant software for managing HPC as well
as scale out Linux installations in general.  This includes Lenovo utilities
such as those found under ToolsCenter, as well as xCAT and confluent.

Adding Repository for Red Hat Enterprise Linux 7
============================
    yum install https://hpc.lenovo.com/yum/latest/el7/x86_64/lenovo-hpc-yum-1-1.x86_64.rpm

Adding Repository for SuSE Linux Enterprise 12
============================
    zypper install http://hpc.lenovo.com/yum/latest/sles12/x86_64/lenovo-hpc-zypper-1-1.x86_64.rpm
    
Adding Local Repository
============================    
If you cannot reach the repository, you can download and install the repositories locally on your system. 

The files are located at [https://hpc.lenovo.com/downloads/]( https://hpc.lenovo.com/downloads/ "https://hpc.lenovo.com/downloads/" ):

    #download the package for your specific OS version
    #ex: For RHEL , xcat-2.13.0.lenovo1_confluent-1.4.0_lenovo-confluent-0.3-el7.tar.bz2
    wget xcat-<xcat version>.lenovo1_confluent-<confluent client/server version>_lenovo-confluent-<confluent web ui version>-<osver>.tar.bz2
    
    #create folder for the local repository
    mkdir /mnt/local_repo
    
    #extract the repository 
    tar -xjvf <name of package> -C /mnt/local_repo
    
    #create lenovo-hpc.repo to point to the local repository
    cd /mnt/local_repo/lenovo-hpc-<osver>/
    ./mklocalrepo.sh
    
