---
layout: page
title: Preparing for Operating System Deployment
permalink: /documentation/confluentosdeploy.html
toc: true
---

If opting to use the confluent OS deployment mechanism, some additional preparation steps are suggested.

Some [node attributes](../user_reference/node_attributes.md) that may be particularly relevant are:

* `crypted.grubpassword` - By default, no boot loader password is used, specify one here to configure deployed OS to require a password to modify grub configuration.
* `crypted.rootpassword` - By default, password based login as root is disabled in deployed operating systems. Set this to a desired value to enable password login. If this is not set, then
there will be no way to log into the console of the target system by default. Note that some OSes default to blocking password from root on ssh by default, and confluent by default honors the OS choice on this matter.  See 'PermitRootLogin' in sshd_config.
* `deployment.encryptboot` - Only supported for RHEL or CentOS 8.2 or higher with TPM 2.0. This will cause the boot volume to be encrypted. If the system board is replaced or the TPM2 is otherwise unavailable or cleared, then the contents of the disk will be lost.
* `deployment.useinsecureprotocols` - To support PXE boot or HTTP boot without HTTPS, set this to `firmware`.
* `dns.domain` - Set this to the appropriate DNS domain for search path. It may in some scenarios be omitted, but it is highly recommended to have a domain.
* `dns.servers` - Set to IP addresses that will provide name resolution services, separated by commas if more than one specified.
* `hardwaremanagement.port` - If needing to change the XCC (xClarity Controller) network port to be shared with an OCP card or onboard network, set to 'ocp' or 'lom' respectively. Ignore for using the dedicated management port or the SMM (System Management Module) in dense, enclosure hosted systems.  Also ignore if you do not use the `configbmc` script.
* `hardwaremanagement.vlan` - If needing to set the XCC to be on a tagged vlan, set this to the desired VLAN. Ignore if using the native VLAN. Again, this only applies if you use the `configbmc` script.
* `net.hostname` - If wanting to include other aliases for an interface to use to SSH in, use this attribute to indicate aliases other than the nodename itself, using commas as needed to indicate multiple values. This attribute is not needed if the node name is the only desired hostname. Note that this setting may be done for multiple interfaces, e.g. `net.compute.hostname={node}-compute`, `net.fabric.hostname={node}-ib`.  See [Confluent multi interface configuration
](../miscellaneous/confignet.md) for more details on configuring multiple interfaces.
* `net.ipv4_gateway` - Set to the gateway IP for the deployed system to use.  This also supports the multiple interface scheme as mentioned above.
* `net.ipv4_method` - This defaults to `static`, based on a name lookup of the node.  Use `firmwaredhcp` if there is an external DHCP server that serves addresses during PXE, but static is desired in the OS.  Set to `dhcp` to delegate OS addresses entirely to a DHCP server.  This also supports the multiple interface scheme as mentioned above.
* `ntp.servers` - NTP servers to use by deployed operating system, separated by commas if more than one specified.

A somewhat minimalist example would be:

    # nodegroupattrib everything deployment.useinsecureprotocols=firmware dns.domain=mycluster.example dns.servers=172.30.0.1 net.ipv4_gateway=17.30.0.254

Again, if root login by password is desired (if unspecified, only key based login over SSH will be allowed):

    # nodegroupattrib everything -p crypted.rootpassword

Keep in mind that the OS being deployed may prohibit ssh password login by root as a default, see `PermitRootLogin` in sshd_config for your distribution for more details.

# IPv6 configuration

Deployment interfaces must have IPv6 enabled, with at least an automatic fe80:: address.  Generally this is default network interface configuration.  IPv6 need only be enabled, it need not be given any address manually, by DHCP, or by route advertisements, the automatic fe80:: addresses suffice.  Full IPv6 and IPv6 exclusive deployment is supported if desired, but even a "pure" IPv4 network will leverage the automatic IPv6 fe80:: for some key features.

# Name resolution (optional)

An existing or otherwise manually configured DNS solution is fine for a confluent managed cluster. If such a solution is unavailable, this section provides a strategy to quickly generate IP addresses and use
`dnsmasq` as a name server.

The [`confluent2hosts`](../manuals/confluent2hosts.md) command may be used to manage entries in an /etc/hosts file. This can use [attribute expressions](../user_reference/attributeexpressions.md) to help form entries for a range. Here is an example to generate 8 entries for nodes d1 through d8:

```
# nodegroupattrib everything dns.domain=cluster.lan
# confluent2hosts d1-d8 -i 172.30.100.{n1}
# grep d5 /etc/hosts
172.30.100.5                            d5 d5.cluster.lan
```

Additionally, confluent2hosts can use the `net.*` attributes to derive entries based on `net.*hostname`, `net.*ipv4_address`, and `net.*ipv6_address`.  Here is an example mixing and matching behaviors to address multiple names
on multiple interfaces with ipv6 on one of the interfaces:

```
# nodegroupattrib dense net.compute.ipv4_address=172.30.100.{n1} net.fabric.ipv4_address=172.20.100.{n1} net.fabric.hostname={node}-ib net.compute.ipv6_address=fd98:8741:ae09::{n1}
# confluent2hosts d1-d8 -a
# grep d5 /etc/hosts
172.30.100.5                            d5 d5.cluster.lan
172.20.100.5                            d5-ib d5-ib.cluster.lan
fd98:8741:ae09::5                       d5 d5.cluster.lan
```


With an /etc/hosts appropriately generated, use the package management software to install dnsmasq and then:

    # systemctl enable dnsmasq --now

If /etc/hosts is updated, restart dnsmasq, as dnsmasq does not automatically update on update of /etc/hosts.


# DHCP (optional)

DHCP is not required or if present, may be externally managed.  Skip this section if either a DHCP server is already in place or if there is no requirement for a dynamic pool of DHCP addresses on the network.  Confluent will not require any DHCP dynamic range if one is not available.  However, if wanting to provide a dynamic DHCP range for various devices that may also exist on the network, `dnsmasq` can provide that functionality.  If using `dnsmasq` on the same system as confluent for DHCP function, add the following to /etc/dnsmasq.conf to allow both dnsmasq and confluent to share the network:

    bind-dynamic

The following lines in /etc/dnsmasq.conf would provide a dynamic DHCP range:

    dhcp-range=172.30.242.1,172.30.242.254

Avoid suggesting to dnsmasq any directives that would influence PXE boot. See the dnsmasq man page and other documentation for more details on use of dnsmasq.

If using a dynamic range on a network, instruct confluent to use `firmwaredhcp` for deployment:

    # nodegroupattrib everything net.ipv4_method=firmwaredhcp

# Having a Genesis network boot environment (optional)

The 'genesis' image is a very small network booted linux environment for servicing/rescue.  When deployed, the node can run linux commands and can be sshed into as if it
were a normal OS, but it won't touch any disks.

In confluent, core discovery and functionality like in-band configuration of BMC devices no longer require a Genesis image.  However, one is available for use if desired.  Install
the package `confluent-genesis-x86_64` if a genesis profile is desired.

`osdeploy initialize` (see next step) has an option to generate a genesis profile. Once used, a genesis based profile would be in /var/lib/confluent/public/os/genesis-x86_64/.  Of particular interest is the
`/var/lib/confluent/public/os/gensis-x86_64/scripts/onboot.sh` file to govern automatic action, or use ssh after nodes boot to manually perform actions.

# Preparing for TFTP (optional)

Note that confluent now supports both PXE and HTTP Boot. If using purely HTTP boot, then you do not need a tftp server at all. Additionally, 
Secureboot is only fully supported with HTTP Boot. To support
clients that are PXE booting, ensure that tftp is installed.  Note that xCAT may have already installed and configured tftp. Otherwise an example of installing tftp for RedHat or CentOS would be:

    # yum install tftp-server

`osdeploy initialize` in an upcoming step will help initialize needed tftp content.

# Configuring nodes for HTTP Boot (optional)

If wanting to use HTTP Boot instead, here is an example to configure Lenovo systems to use HTTP instead of PXE boot:

    # nodeconfig d3-d6 NetworkStackSettings.IPv4PXESupport=disable NetworkStackSettings.IPv4HTTPSupport=enable


# Initializing OS deployment configuration

The `osdeploy initialize` command is used to prepare a confluent server to deploy operating systems.  For first time setup, run osdeploy initialize interactively to be walked through the various options:

    # osdeploy initialize -i

Every option provides a command line flag to use instead of -i if wanting to run osdeploy initialize in a non-interactive fashion opting into the specified options.


# Importing an install source from media

The `osdeploy import` is used to take recognized installation media and produce stock OS deployment profiles:

    # osdeploy import rhel-server-8.2-x86_64-dvd.iso 
    Importing from /var/lib/confluent/iso/rhel-server-8.2-x86_64-dvd.iso to /var/lib/confluent/distributions/rhel-8.2-x86_64
    complete: 100.00%    
    Deployment profile created: rhel-8.2-x86_64-default

# Customizing or copying a profile

A deployment profile is simply the collection of files in /var/lib/confluent/public/os/<profilename>.  The stock profile may be edited in place, however to create a copy for customization, it is as straightforward as:

    # cd /var/lib/confluent/public/os/
    # cp -a rhel-8.2-x86_64-default rhel-8.2-x86_64-custom
    # cd /var/lib/confluent/private/os/
    # cp -a rhel-8.2-x86_64-default rhel-8.2-x86_64-custom

For Ubuntu profiles, you also need to modify profile.yaml to update the profile name embedded in the kernel arguments, and then run `osdeploy updateboot newprofilenamehere`.

Note that not all profiles contain private data, by default diskless images and captured clones have an encryption key in private, but scripted installs do not. Further note that a profile name may experience problems if the profile name is longer than 73 characters.

If having a lot of shared content, it may be wise to employ symbolic links to explicitly share content rather than creating several copies of the same content (scripts or otherwise). It may also be a good idea to use git to manage and track changes as well.

Labels and kernel arguments are in the profile.yaml file in the directory.  If modifying that file or kernel or initramfs content, the boot payloads of a profile can be updated with:

    # osdeploy updateboot rhel-8.2-x86_64-custom

A profile by default will use symbolic links for some content, but most smaller configuration and script files are simply copied and may be freely edited. Updates to confluent will
not automatically replace any kickstart, autoyast, autoinstall, or script content in existing profiles without manual intervention.  It is recommended to examine
and modify kickstart.custom in CentOS and RedHat profiles, to make decisions about default firewall and SELinux configuration on nodes.

Any content in a profile can be freely edited without worry about an update later overwriting it.  However, if an update is performed and it is desired for a profile to merge in content from the package updates, `osdeploy rebase` can be used:

```
# osdeploy rebase alma-8.7-x86_64-custom
Updated: scripts/confignet
Skipping update of scripts/firstboot.sh as current copy was customized or no manifest data was available
```



# Specifying custom postscripts or ansible plays

A number of phases are opened up for injecting custom scripts or ansible plays.  Scripts are executed directly on the deployment server while ansible plays are executed by the deployment server targeting
the deploying system as if it were specified as a host in the play.

The `pre` phase occurs prior to any disk formatting or installation.  This is a good time to manage RAID configuration, override install disk autodection, specify non-default partition plan, extend package list or
otherwise dynamically modify the scripted install file prior to installation.  To override install disk, write the desired target disk to /tmp/installdisk.  Override default partitioning by writing to /tmp/partitioning.

The `post` phase occurs after the installation has written content to disk, but prior to actually booting into the installation.  This is generally the optimal place to make most on-disk changes to
an installed system to ensure they are in effect from the onset. This phase will be followed by an outage as the system reboots into the installed system.

The `firstboot` phase occurs after the installed system has booted into the target system, has brought up the network and has sshd running. This is useful for changes that may depend upon drivers that would
not have been configured yet in the `post` phase or else must run when the system is effectively immediately ready to be put into use.

The `onboot` phase is only for diskless boots, and behaves similarly to `firstboot`, but runs on every boot, since each diskless boot must start from scratch. Where possible, doing modifications to the image
itself (e.g. using `imgutil exec`) is recommended to keep memory consumption down and boot time down.

All content are simple files stored under the respective profile (/var/lib/confluent/public/os/[profile]). For scripted install profiles and cloning,
scripts may be placed in scripts/pre.d, scripts/post.d, and scripts/firstboot.d.
For diskless installs, scripts/onboot.d is available.  Note that content under /var/lib/confluent/public is considered non-sensitive and must not include any passwords, secret keys, or similarly sensitive information. See the document [Handling of security information in OS deployment](../miscellaneous/osdeploysecurity.md) for guidance.

Additionally check files like kickstart.custom in the top level directory for some suggested alterations.

# Handling xClarity Controller or TSM on shared ports (on board network or OCP)

If wanting to move the xClarity Controller or TSM to be accessed over a port shared with the operating system, see either `pre.custom` of an install profile or `onboot.sh` of the genesis profile for examples of how to
incorporate `configbmc` into a Genesis boot or an install. This will move the network port to allow out of band discovery to continue and set username
and password remotely.

# Requesting os deployment

Even before discovery, nodedeploy is able to request that the next boot be into a profile:

    # nodedeploy <nodes> -p rhel-8.2-x86_64-default

After the xClarity Controller or equivalents are accesible, it can also initiate a boot to network (whether manually configured or if running this after discovery has been done):

    # nodedeploy <nodes> -n rhel-8.2-x86_64-default


# Requesting node identifiers from nodeinventory

If discovery has been skipped and a BMC has been added manually, then the following command will populate attributes needed for deployment for most scenarios:

    # nodeinventory node -s

# Manually indicating node identifiers

For many users, node identifiers will be automatically gathered by node discovery process.  However, the discovery process is optional, and if
not wanting to use the process, or using servers that are not supported by the discovery process, then it is possible to feed the data into the requisite attributes rather than using a discovery process.  For a MAC address:

    # nodeattrib node net.hwaddr=00:01:02:03:04:05

Note that in discovery, we tend to prefer the UUID, as it makes the boot process the most adaptive for dealing with multi-nic booting with only a single identifier.  It's also more commonly available
in nodeinventory across systems.  However, for certain non-Lenovo systems, the UUID may not be reliable and the MAC address can be used.  Also if MAC addresses are more familiar, they may be used.


Alternatively, a system UUID may be used instead:

    # nodeattrib node id.uuid=c70998ec-0585-45da-85f0-f06717ec97e6

# Next steps

With OS deployment ready, depending on circumstances it may be appropriate to move on to:

* Deploying operating systems without disks: [Using confluent diskless support](../miscellaneous/confluentdiskless.md)
* Discovering rackmount systems with dedicated management port in use based on physical location: [Using switch based discovery](confluentswitchdisco.md)
* Discovering systems in server enclosures based on physical location: [Using enclosure based discovery](confluentenclosuredisco.md)
* Discovering systems that have management port shared with the on board network or OCP add-on based on physical location: [PXE driven discovery](../miscellaneous/confluentpxedisco.md)
* Using criteria such as mac address or serial number to manually discover or discover from spreadsheet: [Using nodediscover assign](confluentnodeassign.md)
