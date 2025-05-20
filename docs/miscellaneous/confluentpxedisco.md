---
layout: page
title: Using PXE driven discovery
permalink: /documentation/confluentpxedisco.html
toc: true
---

While the best experience is through discovering the xClarity Controller first and having full management
prior to PXE booting, sometimes this is not feasible. Two such scenarios would be:

* The management controller may not be a supported device for discovery (xClarity Controller, ThinkSystem Server Manager, and System Management Module are supported devices.
* The configuration has the management controller unavailable (for example, needing to move the management controller onto a port shared with the operating system)

In such a scenario, doing discovery PXE first is a strategy to move forward.  Note that prior to confluent performing a PXE driven discovery, confluent must have
[OS deployment capability initialized](../advanced_topics/confluentosdeploy.md)

# Specifying a deployment target in advance

In confluent, the deployment may be directed before MAC addresses are yet known. For example to boot to Genesis (a provided diskless image for basic servicing and setup):

    # nodedeploy n1 -n -p genesis-x86_64

Or to boot into the installer on first viable boot attempt:

    # nodedeploy d4 -n -p rhel-8.2-x86_64-default 

Doing this in advance provides the earliest possible entry into a manageable operating system.

# Specifying known mac address

It is supported to use a well known mac address without going through the discovery process.  Simply do:

    # nodedefine n1 net.hwaddr=00:01:02:03:04:05

To use it directly if mac address(es) are already known.

# Manual discovery of unknown mac addresses

The relevant system(s) must attempt a network boot. Generally new servers will tend to do this by default, so this is
likely a matter of pressing the power button once.

Once attempted, nodediscover will list all detected mac addresses:
```
# nodediscover list -t pxe-client
 Node| Model| Serial|                                 UUID|       Mac Address|       Type| Current IP Addresses
-----|------|-------|-------------------------------------|------------------|-----------|---------------------
     |      |       | 58962b3d-088b-11e7-b8b8-9e59e5cf61db| 08:94:ef:41:01:f0| pxe-client|                     
```
An entry can be associated with a node in the same fashion as [manual discovery](../advanced_topics/confluentnodeassign.md)

    # nodediscover assign -e 08:94:ef:41:01:f0 -n n1
    Assigned: n1


# Automatic discovery of mac addresses

The same mechanisms that may be used for management controller and enclosure controller discovery in [using switch based discovery](../advanced_topics/confluentswitchdisco.md) may be used to help gather the PXE information automatically.  The difference being that `nodediscover rescan` will not work for PXE attempts, and confluent must simply wait for an attempt before it can proceed.

One example to designate the system cabled to a switch named `r4e1` on port `34` as `n1` and enable fully automatic mac gathering would be:

    # nodedefine n1 discovery.policy=permissive,pxe net.switch=r4e1 net.switchport=34

# Using PXE driven discovery to locally configure BMCs

In this scenario it is generally desired to configure the BMC automatically, setting IP configuration and if applicable, moving it to the appropriate network port. The desired network port may be specified by the `hardwaremanagement.port` attribute. The most commonly desired values for PXE driven discovery would be `lom` to use the network port built into the system board of the device, or `ocp` to
use an OCP card to provide BMC access.


    # nodeattrib n1 hardwaremanagement.port=lom

There are systems that have two `lom` ports that are configurable for hardware management. In this case it is possible to choose which port to use by specifying either the port number or the connecter type. 

    # nodeattrib n1 hardwaremanagement.port=lom_1
    # nodeattrib n3 hardwaremanagement.port=low_sfp28

In order for this setting to be applied by the OS profile, the OS profile must invoke the configbmc script. For genesis, see `/var/lib/confluent/public/os/genesis-x86_64/scripts/onboot.sh` file for information on how to configure BMC locally, for OS install, see `/var/lib/confluent/public/os/<profilename>/scripts/pre.custom`


After configbmc runs, then out of band discovery can pick up newly available management controllers and finish configuration as needed for ipmi or setting username or passwords. Do a rescan to induce discovery of the newly available devices:

    # nodediscover rescan

