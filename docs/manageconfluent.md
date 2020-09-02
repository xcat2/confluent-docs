---
layout: page
title: Managing hardware using confluent
permalink: /documentation/manageconfluent.html
---

As mentioned in the [configuring confluent]({{site.baseurl}}/documentation/configconfluent.html) section,
confluent manages nodes through a few [node attributes]({{site.baseurl}}/documentation/nodeattributes.html).

The most critical attributes for this section are:

* `hardwaremanagement.method` with the following options:
  * `ipmi` (default) - Most widely implemented and quick, the plugin may use non-IPMI protocols as needed to get additional information.
  * `redfish` - A newer standard that generally offers richer information, at the cost of generally being slower.
  * `affluent` - Communicate with a network switch with the affluent agent (see [using a cumulus switch with confluent]({{site.baseurl}}/documentation/confluentcumulus.html))
  * `cnos` - Communicate with a Lenovo network switch running CNOS
* `console.method` - currently only provides ipmi.  Leave blank to opt out of [`nodeconsole`]({{site.baseurl}}/documentation/man/nodeconsole.html) and console logging, or set to `ipmi` to opt into `ipmi` console.
* `hardwaremanagement.manager` - May alternatively be referred by alias `bmc`: The name or IP address of the xClarity Controller or equivalent associated with this node.
* `enclosure.bay` - For systems that are installed into an enclosure, the bay the node is located (which can help with [`nodereseat`]({{site.baseurl}}/documentation/man/nodereseat.html) as well as discovery)
* `enclosure.manager` - The resolveable name or ip address of the device managing the enclosure that would ultimately perform commands like [`nodereseat`]({{site.baseurl}}/documentation/man/nodereseat.html) on behalf of a node.)
* `secret.hardwaremanagementpassword` - May alternatively be referred to by alias `bmcpass`: The password to log into the xClarity Controller or equivalent
* `secret.hardwaremanagementuser` - May alternatively be referred to by alias `bmcuser`: The user to log into the xClarity Controller or equivalent

Once a node has the necessary attributes defined, most commands that begin with node become functional.

Some examples are provided here, see the list of [man pages]({{site.baseurl}}/documentation/man/) for more possibilities and more detail on each command.

Hard resetting nodes:

    # nodepower d3-d6 boot
    d3: on->reset
    d5: on->reset
    d6: on->reset
    d4: on->reset

Forcing a boot into firmware configuration menu:

    # nodeboot d3-d6 setup
    d3: setup
    d4: setup
    d5: setup
    d6: setup
    d3: reset
    d4: reset
    d5: reset
    d6: reset

Accessing the console of a node:

    # nodeconsole d4

Forcing a boot to network (e.g. to do a PXE or HTTP based deployment)

    # nodeboot d3-d6 net
    d3: network
    d4: network
    d5: network
    d6: network
    d3: reset
    d4: reset
    d5: reset
    d6: reset

Examining firmware on a system:

    # nodefirmware d5
    d5: XCC: 4.00 (TEI3A4L 2020-07-13T23:58:08)
    d5: XCC Backup: 1.20 (TEI316A 2017-10-30T00:00:00)
    d5: XCC Trusted Image: TEI3A4L
    d5: XCC Pending Update: 4.00 (TEI3A4L 2020-07-13T00:00:00)
    d5: UEFI: 2.70 (TEE160L 2020-07-13T00:00:00)
    d5: LXPM: 1.10 (PDL110O 2017-10-17T00:00:00)
    d5: LXPM Windows Driver Bundle: 1.10 (PDL310P 2017-10-25T00:00:00)
    d5: LXPM Linux Driver Bundle: 1.10 (PDL210O 2017-10-17T00:00:00)
    d5: FPGA: 5.3.0
    d5: Intel X722 LOM Combined Option ROM Image: 1.1767.0
    d5: Intel X722 LOM Etrack ID: 80000D24
    d5: ThinkSystem RAID 530-8i Dense MegaRAID Controller Firmware: 50.0.1-0378 (2017-08-01T00:00:00)
    d5: ThinkSystem M.2 with Mirroring Enablement Kit Marvell Firmware: 2.3.10.1194 (2018-07-13T00:00:00)
    d5: ThinkSystem M.2 with Mirroring Enablement Kit MRVL UEFI AHCI Driver and BIOS: 0.0.10.1024 (2017-10-25T00:00:00)
    d5: Disk 0 ST1000NX0423: LE43
    d5: Disk 1 ST1000NX0423: LE43
    d5: Disk 2 ST1000NX0423: LE43
    d5: Disk 3 ST1000NX0423: LE43
    d5: Disk M.2-1 LITEON CV3-8D128: T87RA31 
    d5: Disk M.2-2 LITEON CV3-8D128: T87RA31 
    
Applying a single XCC update across nodes d4,d5, and d6

    # nodefirmware d4-d6 update lnvgy_fw_xcc_tei3a4l-4.00_anyos_noarch.uxz 
    d4:upload:   5%       d5:upload:   5%       d6:upload:   6%       
    ...
    # nodebmcreset d4-d6
    d4: BMC Reset Successful
    d6: BMC Reset Successful
    d5: BMC Reset Successful

Checking firmware of XCC and using collate to check consistency:

    # nodefirmware d3-d6 xcc |collate
    ====================================
    d4,d5,d6
    ====================================
    XCC: 4.00 (TEI3A4L 2020-07-13T23:58:08)
    
    ====================================
    d3
    ====================================
    XCC: 4.00 (TEI3A3L 2020-07-10T06:43:45)
    
Using nodeconfig to view uefi settings and collate -d to find deviations:

    # nodeconfig d3-d6 processors | grep -v Processors.Processors13to16coresactive | collate -d
    ====================================
    d3,d5,d6
    ====================================
    Processors.TurboMode: Enable
    Processors.CPUPstateControl: Autonomous
    Processors.CStates: Autonomous
    Processors.C1EnhancedMode: Enable
    Processors.HyperThreading: Enable
    Processors.TrustedExecutionTechnology: Disable
    Processors.IntelVirtualizationTechnology: Enable
    Processors.HardwarePrefetcher: Enable
    Processors.AdjacentCachePrefetch: Enable
    Processors.DCUStreamerPrefetcher: Enable
    Processors.DCUIPPrefetcher: Enable
    Processors.DCA: Enable
    Processors.EnergyEfficientTurbo: Enable
    Processors.UncoreFrequencyScaling: Enable
    Processors.MONITORMWAIT: Enable
    Processors.SnoopResponseHoldOff: 9
    Processors.UPIGateDisable: Enable
    Processors.UPILinkDisable: Enable All Links
    Processors.SNC: Disable
    Processors.SnoopPreference: Home Snoop Plus
    Processors.UPIPrefetcher: Enable
    Processors.Autocstatemapping: Legacy
    Processors.StaleAtoS: Auto
    Processors.LLCdeadlinealloc: Enable
    Processors.AesEnable: Enable
    Processors.IrqThreshold: Auto
    Processors.LLCPrefetch: Disable
    Processors.PackageCstate: Enable
    Processors.L2RFOPrefetchDisable: Auto
    Processors.PECIIsTrusted: Enable
    Processors.UncoreFrequencyLimit: 3F
    Processors.PL2: 1.2
    Processors.CoresinCPUPackage: All
    Processors.MaxPState: P0
    Processors.DisableProcessor: None
    Processors.UPILinkFrequency: Max Performance
    Processors.CPUFrequencyLimits: Full turbo uplift
    Processors.CRCMode: Auto
    Processors.L1: Enable
    Processors.L0p: Enable
    Processors.Processors1to2coresactive:
    Processors.Processors3to4coresactive:
    Processors.Processors5to8coresactive:
    Processors.Processors9to12coresactive:
    
    ====================================
    d4
    ====================================
    @@
      Processors.TurboMode: Enable
    - Processors.CPUPstateControl: Autonomous
    + Processors.CPUPstateControl: Cooperative
      Processors.CStates: Autonomous
      Processors.C1EnhancedMode: Enable
        
Using nodeconfig to change the configuration:

    # nodeconfig d4 set Processors.CPUPstateControl=auto

