---
layout: page
title: Submit Job Failed on Host Cluster
permalink: /lico/lico5/faq-submit-slurm-job-failed
---
In most cases, submit job fail is because of incorrect slurm status. User can try the following methods to investigate:  

**Check job output on LiCO GUI.**  

**SSH to login node of the cluster, and re-submit the job.**  
- Go to user home directory and find job file.
- Run the command *sbatch jobfile.slurm* to re-submit the job.
> Note: In many job failed cases, resource requested exceeds cluster limitation is the cause. For example, if cluster has 80 cores, jobs which request more than 80 cores will be failed.

```
cat a.slurm
#!/bin/bash
#SBATCH --job-name='test'
#SBATCH --workdir=/home/hpcadmin/test
#SBATCH --partition=compute
#SBATCH --nodes=1
#SBATCH --mincpus=200
mpirun /home/hpcadmin/test/icpi

sbatch a.slurm
sbatch: error: CPU count per node can not be satisfied
sbatch: error: Batch job submission failed: Requested node configuration is not available
```
<br>
  
**SSH to login node in the cluster, and run commands to investigate.**  
Run command *sinfo* to check queues, run command *squeue* to check runnig jobs, run command *scancel* to cancel running jobs.

```
sinfo
PARTITION AVAIL  TIMELIMIT  NODES  STATE NODELIST
compute      up   infinite      1    mix c1
compute      up   infinite      1   idle c2
compute1     up   infinite      1   idle c2
wujq         up   infinite      1    mix c1
wujq         up   infinite      1   idle c2
test         up   infinite      1    mix c1
wujtest      up   infinite      1    mix c1
wujtest      up   infinite      1   idle c2

squeue
JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
7429   compute     test hpcadmin  R       0:05      1 c1

scancel 7429
```
<br>

**If you are the administrator of the cluster, you can also ssh to slurm management node.**   
- Run command *scontrol show nodes* to check the status of compute nodes in the cluster.

```
scontrol show nodes
NodeName=c1 Arch=x86_64 CoresPerSocket=1
   CPUAlloc=0 CPUTot=72 CPULoad=0.01
   AvailableFeatures=(null)
   ActiveFeatures=(null)
   Gres=gpu:2
   NodeAddr=c1 NodeHostName=c1 Version=18.08
   OS=Linux 3.10.0-1062.el7.x86_64 #1 SMP Wed Aug 7 18:08:02 UTC 2019
   RealMemory=200000 AllocMem=0 FreeMem=31158 Sockets=72 Boards=1
   State=IDLE ThreadsPerCore=1 TmpDisk=0 Weight=1 Owner=N/A MCS_label=N/A
   Partitions=compute,wujq,test,wujtest
   BootTime=2020-01-15T09:40:01 SlurmdStartTime=2020-01-15T09:40:30
   CfgTRES=cpu=72,mem=200000M,billing=72
   AllocTRES=
   CapWatts=n/a
   CurrentWatts=0 LowestJoules=0 ConsumedJoules=0
   ExtSensorsJoules=n/s ExtSensorsWatts=0 ExtSensorsTemp=n/s


NodeName=c2 Arch=x86_64 CoresPerSocket=1
   CPUAlloc=0 CPUTot=72 CPULoad=0.01
   AvailableFeatures=(null)
   ActiveFeatures=(null)
   Gres=gpu:2
   NodeAddr=c2 NodeHostName=c2 Version=18.08
   OS=Linux 3.10.0-1062.el7.x86_64 #1 SMP Wed Aug 7 18:08:02 UTC 2019
   RealMemory=200000 AllocMem=0 FreeMem=30217 Sockets=72 Boards=1
   State=IDLE ThreadsPerCore=1 TmpDisk=0 Weight=1 Owner=N/A MCS_label=N/A
   Partitions=compute,compute1,wujq,wujtest
   BootTime=2020-01-15T09:37:50 SlurmdStartTime=2020-01-15T09:38:31
   CfgTRES=cpu=72,mem=200000M,billing=72
   AllocTRES=
   CapWatts=n/a
   CurrentWatts=0 LowestJoules=0 ConsumedJoules=0
   ExtSensorsJoules=n/s ExtSensorsWatts=0 ExtSensorsTemp=n/s

```
- Run command *sinfo* to check the status of queue, and if you find some nodes in **drain** status, you can use the follow command to resume nodes.

```
scontrol update nodename=c1 state=idle
```


Refer to more slurm commands: <https://slurm.schedmd.com/man_index.html>
