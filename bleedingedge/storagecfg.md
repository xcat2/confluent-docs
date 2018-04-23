---
layout: page
title: XCC Raid Configuration utility
permalink: /bleedingedge/storagecfg.html
---

This is a utility for managing raid configuration of xClarity Controller devices.  It is a preview
of future confluent functionality as well as a standalone utility to take advantage of the open source
support we have published in the pyghmi library.

The username and password of the XCC should be passed by environment variable.  For example, if
using powershell:

	$env:XCCUSER='username'
	$env:XCCPASS='password'

Additionally, when using powershell, be mindful that it will transform
arguments with `,` in them, so you may need to quote arguments in that
environment.

Here are some example usage scenarios:
```
# ./storagecfg -x 172.30.254.251 show
Disk	Description			Status	FRU
============================================================
Drive 0	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Unconfigured Good	00LF039
Drive 1	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Unconfigured Good	00LF039
Drive 2	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Unconfigured Good	00LF039
Drive 3	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Unconfigured Good	00LF039

Volume	RAID	Capacity	Status
============================================================
```

```
# ./storagecfg -x 172.30.254.251 makejbod -d 0-2
Disk	Description			Status	FRU
============================================================
Drive 0	1.00TB 7.2K 6Gbps SATA 2.5" HDD	JBOD	00LF039
Drive 1	1.00TB 7.2K 6Gbps SATA 2.5" HDD	JBOD	00LF039
Drive 2	1.00TB 7.2K 6Gbps SATA 2.5" HDD	JBOD	00LF039
Drive 3	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Unconfigured Good	00LF039

Volume	RAID	Capacity	Status
============================================================
```

```
# ./storagecfg -x 172.30.254.251 makehotspare -d rest
Disk	Description			Status	FRU
============================================================
Drive 0	1.00TB 7.2K 6Gbps SATA 2.5" HDD	JBOD	00LF039
Drive 1	1.00TB 7.2K 6Gbps SATA 2.5" HDD	JBOD	00LF039
Drive 2	1.00TB 7.2K 6Gbps SATA 2.5" HDD	JBOD	00LF039
Drive 3	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Global Hot Spare	00LF039

Volume	RAID	Capacity	Status
============================================================
```

```
# ./storagecfg -x 172.30.254.251 clearcfg
Disk	Description			Status	FRU
============================================================
Drive 0	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Unconfigured Good	00LF039
Drive 1	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Unconfigured Good	00LF039
Drive 2	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Unconfigured Good	00LF039
Drive 3	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Unconfigured Good	00LF039

Volume	RAID	Capacity	Status
============================================================
```

```
# ./storagecfg -x 172.30.254.251 create -r 1 -d "0,1"
Disk	Description			Status	FRU
============================================================
Drive 0	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Online	00LF039
Drive 1	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Online	00LF039
Drive 2	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Unconfigured Good	00LF039
Drive 3	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Unconfigured Good	00LF039

Volume	RAID	Capacity	Status
============================================================
VD_1	RAID 1	952720	Optimal
```

```
# ./storagecfg -x 172.30.254.251 create -r 0 -d rest -s 10gb,5%,rest -n name1,name2,name3
Disk	Description			Status	FRU
============================================================
Drive 0	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Online	00LF039
Drive 1	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Online	00LF039
Drive 2	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Online	00LF039
Drive 3	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Online	00LF039

Volume	RAID	Capacity	Status
============================================================
VD_1	RAID 1	952720	Optimal
name1	RAID 0	10000	Optimal
name2	RAID 0	95272	Optimal
name3	RAID 0	1800168	Optimal
```

```
# ./storagecfg -x 172.30.254.251 delete -n name2
Disk	Description			Status	FRU
============================================================
Drive 0	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Online	00LF039
Drive 1	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Online	00LF039
Drive 2	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Online	00LF039
Drive 3	1.00TB 7.2K 6Gbps SATA 2.5" HDD	Online	00LF039

Volume	RAID	Capacity	Status
============================================================
VD_1	RAID 1	952720	Optimal
name1	RAID 0	10000	Optimal
name3	RAID 0	1800168	Optimal
```

* [Windows executable]({{site.baseurl}}/assets/storagecfg-0.5.zip)
* [Python Script (requires python and pyghmi newer than 1.0.28)]({{site.baseurl}}/assets/storagecfg-python-0.5.tgz)




