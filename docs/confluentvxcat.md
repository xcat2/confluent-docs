---
layout: page
title: xCAT and confluent comparison
permalink: /documentation/confluentvxcat.html
---

As of confluent 3.0, the scope of Confluent has increased to cover much of xCAT functionality. There will
remain some differences and some gaps.

# Features not currently in confluent

Confluent does not cover all functionality of xCAT. Some functions of xCAT that are currently not in confluent are:

* Virtualization management
* Deployment to networks through routers
* Stateless image generation
* Support for platforms other than x86
* Configuration of additional networks

# Interoperability

xCAT generally is an all or nothing proposition. For full functionality, it must control DHCP, OS deployment, the BMC, and any data that is used in discovery can only
be used to feed xCAT workflows.

Confluent is designed for improved interoperability. It does not require control of services like DHCP, is less particular about DNS, and provides data more transparently
to feed discovery data to alternative OS deployment software if desired rather than using the built in facilities.

# Security

xCAT generally expects a trusted network and offers material unencrypted in various contexts. It does not support running under SELinux and it does not support SecureBoot.

The default configuration of confluent protects sensitive data. Even after opting into more convenient behavior, confluent will still protect sensitive data more than xCAT. Notably:
* Fully encrypted deployment over HTTPS is supported (Firmware configuration required)
* tftp is now optional (Can use HTTP or HTTPS boot instead)
* SecureBoot deployment is supported (HTTP or HTTPS boot only)
* For RHEL/CentOS 8.2 or higher, encrypting the boot volume using the TPM is supported
* For network deployments, a node api token is acquired by a node only once
* All TLS communication is meaningfully validated against certificate authorities or stored fingerprints
* System root password and grub passwords are stored only as non-recoverable hashes
* Passwords are afforded greater protection when they must be stored (e.g. for accessing switches or BMCs)
* Non-recoverable hash of root password is no longer trivially retrieved from default kickstart files or images
* Default SSH configuration is more hardened, no private key of any sort is sent across the network

# Name resolution

In xCAT, makedns is provided as an aid to generate ISC BIND configuration. However, it does not require this be used,
and is content so long as forward and reverse lookup works exactly as expected.

In confluent, no helper facility is provided for name configuration, documentation instead mentions how to use dnsmasq
if no other name resolution is otherwise in use. It is strongly recommended for forward resolution to function, though
not required, and reverse lookup no longer has an impact on identifying nodes and will not cause problem identifying
nodes if missing or not particularly configured.

# DHCP

In xCAT, control of DHCP is mandatory for discovery and deployment functionality. No other DHCP server may be running
on a network that xCAT needs to do discovery or deployment on.

In Confluent, DHCP is optional and even when present is not managed by Confluent. No dynamic range is required for
any discovery. The default behavior is to use static IP address. It may also be configured to always defer IP configuration
to an external DHCP server or to do so only for the firmware phase (PXE/HTTP boot) but use static for the OS.

# Discovery

In xCAT, discovery requires that xCAT generate a dhcp configuration with a pool of dynamic addresses and boot into Linux on the
nodes to begin the process.

In Confluent, discovery no longer has this requirement. For many scenarios, discovery can occur without the server ever powering
on. If PXE driven discovery is required, the discovery occurs when firmware attempts the network boot, even if no DHCP answer
will be sent. A genesis environment is provided, though no longer required. `configbmc` may be used from either genesis `scripts/onboot.sh`
or see `scripts/pre.custom` for an example to run it during application of an OS installation profile.

# Deployment profiles

In xCAT, deployment profiles  are comprised of content distributed
across various directories combined and enhanced by data from various tables. This is powerful for having script content
shared across images, but makes things complicated to follow and the implications of upgrading unclear.

In Confluent, OS 'images' are simply the directories in /var/lib/confluent/public/os. All content is either a symbolic
link or copy. If confluent is upgraded, no existing profiles will be altered in terms of kickstart, autoyast, autoinstall,
or script content.  While it is encouraged to modify 'custom' files to keep it simple to pull in potential future enhancements,
no content will be replaced automatically on upgrade unless it is a symbolic link.

Additionally, all nodes download the exact same set of boot configuration files and kickstart (or similar) files. All per-node
specialization takes place on the target system rather than on the deployment server, as was the case in xCAT.

# Postscripts

In xCAT, postscripts are in /install/postscripts and referenced by either osimage or per node entries across the pertinent tables.

In confluent, scripts are always in the OS image profile itself, and invoking them is a matter of modifying the appropriate script
for the phase of boot. Most commonly, scripts/firstboot.custom, scripts/post.custom. Unlike xCAT, having distinct postscripts per
node sharing a common OS profile is not supported, and delegating that complexity to a facility such as salt or ansible is
recommended.

# SSH Infrastructure

In xCAT, known_hosts was mitigated through disabling strict host key checking and copying down a common private host key to all nodes.
This means that the host key was not well protected and also not unique (which mattered for some applications that presumed unique keys).

In confluent, strict host key checking is left at default, and host keys are managed through certificate authorities. Whenever a redeploy occurs,
the node will generate brand new keys privately and the public key is given a certificate.

In xCAT, root's public key from a head node is placed in authorized_keys on all nodes. Further it is popular to copy down root's private key
to facilitate node to node ssh. On the other hand, this optional behavior puts root's private key at risk.  Non-root users receive no accommodations.

In Confluent, each collective member root public key is added to deployed authorized_keys, to enable ssh from any collective member to any node.
root's private key is never sent across the wire under any circumstance, instead the work to fix known_hosts across the board is leveraged to
enable host-based authentication within a confluent cluster. This extends to both the root user and all other users on the systems.

