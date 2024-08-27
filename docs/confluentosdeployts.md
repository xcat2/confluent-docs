---
layout: page
title: Troubleshooting issues with confluent OS deployment
permalink: /documentation/confluentosdeploymenttroubleshooting.html
toc: true
---
# IPv6 configuration

Deployment interfaces must have IPv6 enabled, with at least an automatic fe80:: address.  Generally this is default network interface configuration.  IPv6 need only be enabled, it need not be given any address manually, by DHCP, or by route advertisements, the automatic fe80:: addresses suffice.

# Unable to import media after aborting with control-C or an error being encountered

An attempt to import media after an error or abort may result in:

    {u'errorcode': 500, u'error': u'Unexpected error - Media import already in progress for this media'}

In order to proceed, the older import activity must be stopped. This can be done by listing current import activity,
and removing it using confetty:

    # osdeploy import CentOS-Stream-8-x86_64-20210118-dvd1.iso 
    {'errorcode': 500, 'error': 'Unexpected error - Media import already in progress for this media'}
    # confetty show /deployment/importing
    centos_stream-8.4-x86_64
    # confetty rm /deployment/importing/centos_stream-8.4-x86_64
    Deleted: deployment/importing/centos_stream-8.4-x86_64

# Can't ssh from the management node to a managed node after deployment, or from a managed node to another managed node after deployment

If the ssh ca certificate is changed on the management node, then confluent needs to be updated with this by running "osdeploy initialize -k".  This will allow for ssh from the management node to the managed nodes to work.

To make sure ssh from one confluent-deployed managed node to another works, after the ssh ca certificate is changed on the management node, if using image-based (versus separate kernel and initrd downloads) deployment, then the OS profile image needs to be updated with "osdeploy updateboot <profile name>" prior to OS deployment.

# Can't access OS repos from managed nodes after confluent deployment

The OS repo URLs are set to the specific profile used to perform the deployment with confluent on a managed node.  If that profile is moved, renamed, or deleted on the management node, then the managed node will not longer be able to access those repos.  This is different from how this was done with xCAT where different install profiles pointed to a common install source location (this actually is deduplicated in confluent as well, but the URLs on the managed nodes are specific to the deployment profile).

# Managed node may hang during confluent OS deployment

When performing OS deployment with confluent, the managed node may hang, for example at "Started cancel waiting for multipath siblings of <drive>" when deploying RHEL 8.3.  This can be caused by the collective.managercandidates nodattribute containing a management node that is not actually defined as a node in the confluent database.  Note that this has to be defined exactly as it appears in the "collective show" command output.  For example, if the management node is shown in "collective show" as "mn.domain" then that management node has to be defined with the nodename "mn.domain" in confluent, as opposed to just "mn".


# Issues with SSH within a cluster after adding an additional collective member

After adding a collective member, it is necessary to run `nodeapply -k <noderange>` on existing nodes, as well as `osdeploy initialize -k` on existing collective members after setting up SSH on the new collective member.

# Regenerating SSH host certificates

If there is a requiremennt to regenerate SSH keys after installation and new
certificates are needed, this can be addressed by running `nodeapply <noderange> -k`

# Unable to ssh from one managed node to another on an interface which has a DNS hostname that doesn't match the confluent nodename

In some cases ssh from one managed node to another will fail with the following error:

```
Certificate invalid: name is not a listed principal
```

This can occur if the net.<name>.hostname nodeattribute is not set properly on the managed nodes, and can occur if there was a non-existing managed node so that the ssh configuration on the already existing managed nodes couldn't setup for those nodes at that time.  The ssh configuration for those existing nodes would not be fixed on deployment of the new managed nodes, even if the net.<name>.hostname was set correctly on addition and deployment of the new managed node.  To address this, the following script should be run on each managed node that should be able to ssh without a password prompt to others on the interface with a DNS hostname that doesn't match the confluetn nodename:

This can be addressed by running `nodeapply -k <noderange>'



# Confluent OS profile updates are not automatically applied on confluent updates

The default confluent profiles for OSes (e.g. RHEL 8.4, SLE 15.3, etc., including genesis) do occasionally get updates as part of a confluent update.  However, these aren't applied automatically.  To opt into updates, run

```
osdeploy rebase <profile name>
```

Note this will try to preserve customization, but heavy customization may make files incompatible.

# Confluent does not support secure boot with PXE. 

The ipxe boot loader that confluent uses in not signed, because of this an attempt to do secure boot with PXE will result in a secure boot violation. To do a network boot using confluent with secure boot enabled either http or https boot must be used. 

# KVM virtual machines immediately fail to netboot when using UEFI firmware with confluent

This is due to iPXE not being compatible with secureboot.  For now, disable secureboot when using UEFI with KVM virtualization, since the KVM firmware does not support HTTP boot.

# System gets non-desired IP address when being deployed or booting genesis

One possible reason for this to occur is if the net.\<inteface name\>.hostname and net.\<interface name\>.ipv4_address nodeattributes for a node are defined, and the network configuration of the confluent server and network are such that there more than one set of net.\<interface name\>.hostname and net.\<interface name\>.ipv4_address settings that could match a particular L2 network.  In this case which of the net.\<interface name\>.* settings would be applied to the boot interface on the netbooting node may not be consistent from boot to boot.

A scenario in which multiple net.\<interface name\>.hostname and net.\<interface name\>.ipv4_address nodeattributes would be set up this way would be if the XCC on a Lenovo server is configured with the XCC in shared NIC mode, and the interface of the XCC setup on the same L2 network as the NIC the XCC is sharing with, but with the XCC set to use a different IP subnet as the NIC being shared with the XCC.  One reason to set these values would be so that the "confluent2hosts" command can be used with the "-a" switch to populate /etc/hosts with the information from the nodeattributes.  However, this can be done as follows instead (once the hardwaremanagement.manager nodeattribute is defined):

```
confluent2hosts compute -n {node}-<suffix> -i {hardwaremanagement.manager}
```

In this way the net.\<interface name\>.hostname and net.\<interface name\>.ipv4_address nodeattributes don't have to be defined, leaving only one set of net.\<interface name\>.hostname and net.\<interface name\>.ipv4_address nodeattributes that match the network configuration for the L2 network that the managed node(s) is/are booting from, eliminating the ambiguity and ensuring that the netbooting nodes get the right address on each boot.



