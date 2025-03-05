---
date: 2023-01-17
---

# 3.6.2 Confluent release

3.6.2 of confluent is released, bringing a number of bug fixes:
<!-- more -->

## Restore routed media based deployment

Changes in 3.6.0 had inadvertently broken ability to deploy a routed system using remote media.
This release restores that functionality

## NFS is now available to diskless initramfs

This can be used by custom work to use nfs as a mechanism to access root filesystem content.

## Diskless images now build with r8192 support

This is a popular USB NIC and has been added to newly packed diskless images

## Suppress DSA host key errors during deployment

Deployment would note inconsistencies with DSA key due to differences between install time
and boot time SSH configuration.  The DSA key is no longer carried forward.

## Writing output of nodefirmware/nodemedia/nodersync has been improved

It dramatically reduces output put to screen and interacts better with a running terminal, avoiding
forced clear screns

## Fix imgutil working with ported diskless images

When a diskless image was carried from one environment to another, without the associated distribution
assets, imgutil would have various problems.  imgutil will now properly degrade to allow better function
with such images.

## Prevent `noderename` from attempting to rename multiple nodes to the same target name

If misused, noderename could inadvertently cause loss of nodes by renaming every node to the same
value, losing all but one of the source nodes.  This scenario is now blocked.

## Fix syncfiles and add_local_repositories in IPv4-free environments

Confluent deployments in a pure IPv6 environment would formerly fail to correctly add local repositories
and execute syncfiles.  These issues are addressed in 3.6.2.



