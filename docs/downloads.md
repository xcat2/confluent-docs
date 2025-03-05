# Downloads

Lenovo provides yum repositories of relevant software for managing HPC as well
as scale out Linux installations in general.  This includes xCAT and confluent.

Adding Repository for Red Hat Enterprise Linux
============================

Select the repository appropriate for the major version, for Red Hat Enterprise Linux 8:

    rpm -ivh https://hpc.lenovo.com/yum/latest/el8/x86_64/lenovo-hpc-yum-1-1.x86_64.rpm

For Red Hat Enterprise Linux 9:

    rpm -ivh https://hpc.lenovo.com/yum/latest/el9/x86_64/lenovo-hpc-yum-1-1.x86_64.rpm
    
On a new Minimal Install without Red Hat Subscription Manager configured. You will need additional packages from the install media. 
Follow instuctions to add the install media as a repository on [https://access.redhat.com/solutions/1355683](https://access.redhat.com/solutions/1355683 "https://access.redhat.com/solutions/1355683"). 

Adding Repository for Ubuntu Linux
============================

Download our gpg key:

    # wget -O /etc/apt/trusted.gpg.d/confluent.gpg https://hpc.lenovo.com/apt/latest/lenovo-hpc.key

Create the following apt configuration if running Ubuntu 24.04 (noble), substitute the distribution name for other editions (e.g. jammy instead of noble):

    Types: deb
    URIs: https://hpc.lenovo.com/apt/latest/noble
    Suites: noble
    Components: main
    Signed-By: /etc/apt/trusted.gpg.d/confluent.gpg

Then run `apt update` to pull the repository information.

Adding Repository for SuSE Linux Enterprise 15
============================
    rpm --import https://hpc.lenovo.com/yum/latest/suse15/x86_64/lenovohpckey.pub
    zypper install https://hpc.lenovo.com/yum/latest/suse15/x86_64/lenovo-hpc-zypper-1-1.x86_64.rpm

Adding Local Repository
============================    
If you cannot reach the repository from your target system, you can download the package from a system that can reach [https://hpc.lenovo.com/downloads/]( https://hpc.lenovo.com/downloads/ "https://hpc.lenovo.com/downloads/" ) and then transfer and install the repositories locally on your target system. 

The files may be browsed at [https://hpc.lenovo.com/downloads/]( https://hpc.lenovo.com/downloads/ "https://hpc.lenovo.com/downloads/" ):

    #On a system that can reach https://hpc.lenovo.com/downloads/
    #Download the package for your specific OS version
    wget https://hpc.lenovo.com/downloads/latest-el9.tar.xz
    #or
    wget https://hpc.lenovo.com/downloads/latest-el8.tar.xz
    #or
    wget https://hpc.lenovo.com/downloads/latest-suse15.tar.xz
    
    #On your local system 
    #Create folder for the local repository
    mkdir /mnt/local_repo
    
    #Extract the repository 
    tar -xf latest-el8.tar.xz -C /mnt/local_repo
    #or
    tar -xf latest-suse15.tar.xz -C /mnt/local_repo
    
    #Create lenovo-hpc.repo to point to the local repository
    cd /mnt/local_repo/lenovo-hpc-el8/
    #or
    cd /mnt/local_repo/lenovo-hpc-suse15/
    ./mklocalrepo.sh
    
Further information
=======================
See the [documentation]({{ site.baseurl }}/documentation) for information on how to install and configure software provided in these repositories.

Sources are available at [https://hpc.lenovo.com/downloads/sources/](https://hpc.lenovo.com/downloads/sources/)
    
