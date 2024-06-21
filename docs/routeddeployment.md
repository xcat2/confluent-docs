---
layout: page
title: Deployment through a routed network
permalink: /documentation/routed-deployment.html
toc: true
---
While it is most straightforward to do OS deployment when on the same network, sometimes there is a need to deploy through
a routed network.  Note that regardless of the strategy, the routed network will incur more manual configuration and have more
chances for a failure to occur, so it is strongly advised, if at all possible, to have confluent on the local network, or use
the confluent collective mechanism to have confluent instances on the same network to have the highest chance of success
with the least network.

That said, there are a number of strategies to perform deployment through a router:

# Remote media boot

You can use the remote media to boot a confluent image, in conjunction with an 'identity' image.

Benefits of this approach:
- Requires no particular coordination with the network administration responsibilities
- More hardened mechanism for authenticating the node during the OS deployment.

Drawbacks:
- Additional license keys may be required or the node BMC may not support at all
- It may be slower to boot compared to traditional network boot
- The network configuration may not be as robust as a network deployment, causing longer network configuration times or failure


To proceed:

- Generate an identity image for the node.

```

# confetty set /noderange/rackmount/deployment/ident_image=create
created: nodes/r3u21/deployment/ident_image
created: nodes/r3u24/deployment/ident_image
created: nodes/r3u22/deployment/ident_image
created: nodes/r3u23/deployment/ident_image
created: nodes/r3u25/deployment/ident_image

```

- Upload the identity images to the xClarity controllers:

```
noderun rackmount nodemedia {node} upload /var/lib/confluent/private/identity_images/{node}.img
```
Be aware that use of `nodemedia attach` is likely to insecurely expose the contents of the image file, which contains an API token that can be used to get SSH certificates,
so it is advised to only use `upload`.

- Attach or upload the `boot.img` file from the profile.

```
# nodemedia rackmount attach https://172.30.193.20/confluent-public/os/rocky-9.4-x86_64-default/boot.img
```
Note that attach is frequently needed, as boot.img is often larger than the space allowed by the xClarity Controller for upload. However, the boot.img should contain
no particularly confidential information.

# URL driven remote boot using iPXE

This approach has the local DHCP server handle chainloading iPXE and sending a URL parameter only to iPXE.

Benefits:
- Provides maximum flexibility for the DHCP configuration to own more of the boot process

Drawbacks:
- Requires the most DHCP configuration to be sorted out in the DHCP configuration
- It does not support direct UEFI HTTP boot, and thus currently is incompatible with confluent SecureBoot support
- Requires the administrator to modiy an OS image profile to indicate the location of the confluent server
- Requires the administrator to designate remote network as "trusted"

To proceed:

- Ensure you have collected either node UUIDs (id.uuid) or mac addresses (net.*hwaddr), depending on your preference.
- Set the remote network to be a trusted network for the node: `nodeattrib [nodes] trusted.subnets=172.20.0.0/24`
- Modify the profile.yaml of the OS profile(s) and add `confluent=[ip.of.confluent.server]` to the kernel arguments
- osdeploy updateboot [osimagename]
- Have the local DHCP configuration ultimately tell iPXE to boot `http://[ip.of.confluent.server]/confluent-api/boot/by-uuid/${uuid}/ipxe` or `http://[ip.of.confluent.server]/confluent-api/boot/by-mac/${mac:hexhyp}/ipxe`, depending on whether you collected UUID or mac addresses previously

# DHCP delegation of PXE

This approach has the local DHCP server only handling addressing, and pointing the booting system towards confluent for further instructions

Benefits:
- Requires relatively light DHCP configuration

Drawbacks:
- Still requires some DHCP configuration
- Requires the administrator to modiy an OS image profile to indicate the location of the confluent server
- It only supports PXE boot, and thus currently is incompatible with confluent SecureBoot support
- Requires the administrator to designate remote network as "trusted"

To proceed:

- Ensure you have collected either node UUIDs (id.uuid) or mac addresses (net.*hwaddr), depending on your preference.
- Set the remote network to be a trusted network for the node: `nodeattrib [nodes] trusted.subnets=172.20.0.0/24`
- Modify the profile.yaml of the OS profile(s) and add `confluent=[ip.of.confluent.server]` to the kernel arguments
- osdeploy updateboot [osimagename]
- Have the DHCP server send option 67 "PXEClient".  As an example, here is an exceprt from an ISC DHCP configuration file 

```
     class "PXE" {
       match if substring(option vendor-class-identifier, 0, 9) ="PXEClient"; 
       option vendor-class-identifier "PXEClient"; 
       vendor-option-space PXE; 
       next-server 172.26.129.213;
       filename = "";
    }
```
