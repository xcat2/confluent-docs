---
date: 2022-06-13
categories:
  - hpc
  - update
---

# 3.5.0 Confluent release

3.5.0 has been released with the following changes:
<!-- more -->

## nodeping command has been added

The `nodeping` allows easy invocation of ping against a node range, with options to use suffixes or expressions to ping alternate interfaces.

## XCC and SMM passwords are now unexpired on discovery if expired

Discovery will now work even if the password on the endpoint is already set, but expired.

## `nodeconsole` now has a `-l` option to replay logs

The nodeconsole now has a flag to initiate a log replay of a node. Arrow keys can navigate the console and the titlebar is updated to show time of on-screen content.  Further, any screen clears force a pause in navigation to clearly show errors before they would normally be cleared from the screen.  Search is also supported.

## Web UI now supports passwordless authentication using webathn

If logged in, a user may select 'Register authenticator' to enroll an authenticator. Then if they skip entering password, it will begin the authenticator based login.

## Improve web UI performance

Consoles and most large scale queries are now performed over a shared socket,
resulting in smoother experience and more consoles on screen at a time.

## OS deployment additions

Ubuntu 22.04, SuSE 15 SP4, Leap 15.4, RedHat 9, Rocky 9, and Alma 9 support has been added.

## Diskless EL8 now has local repositories after boot

Site repositories are now made available to newly built diskless images.

## Support for select PDUs have been added

Outlet status and control for select Delta, Eaton, and Vertiv PDUs has been added.

## Add RedHat 9 management node support

RedHat 9 (and related) platforms can now install and run confluent

## Implement VROC support in SuSE scripted deployment

Pre-existing VROC arrays are now properly auto-handled in scripted deployment of SUSE

## Change to bond from team in SuSE distributions

SuSE never naturally used team, follow their standard behavior and go for bond instead.

## Updates to the TLS CA

New installations will backdate the start validity of certificates and
RedHat nodes will retain the internal trust across updates

## Add routed support for RedHat CoreOS deployment

CoreOS may now be deployed through a router through pairing an identity image
with a deployment image.

## Confluent expression can now slice a variable

For example, a node named `node123` with {node[-4:]} would show `e123`

