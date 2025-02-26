---
layout: page
title: Deploying servers using the xClarity Controller
permalink: /documentation/xccdeployment.html
---

This procedure will leverage the Virtual USB function on appropriately licensed
xClarity Controllers to aid in deployment, which is particularly useful
when doing deployment over a routed network with minimal external configuration.

### Ensure net attributes contain the networking configuration

For static IP deployments, it is important that confluent be given the prefix
length and the gateway.

    # nodeattrib d1 net.ipv4_address=192.168.16.35/24 net.ipv4_gateway=192.168.16.254
    d1: 192.168.16.35/24
    d1: 192.168.16.254

### Set the desired profile to be pending

    # nodeattrib d1-d4 deployment.pendingprofile=rocky-8.7-x86_64-default
    d1: rocky-8.7-x86_64-default
    d2: rocky-8.7-x86_64-default
    d3: rocky-8.7-x86_64-default
    d4: rocky-8.7-x86_64-default

### Create an identity image

The identity image contains credentials, network configuration, and information
about the deployment server.

    # confetty set /noderange/d1-d4/deployment/ident_image=create
    created: nodes/d2/deployment/ident_image
    created: nodes/d4/deployment/ident_image
    created: nodes/d3/deployment/ident_image
    created: nodes/d1/deployment/ident_image

### Upload the identity image to the xClarity Controller

    # noderun d1-d4 nodemedia {node} upload /var/lib/confluent/private/identity_images/{node}.img
    d1: d1: initializing:   0%
    d2: d2: initializing:   0%
    d4: d4: initializing:   0%
    d3: d3: initializing:   0%
    d1: d1: upload: 100%
    d2: d2: upload: 100%
    d4: d4: upload: 100%
    d3: d3: upload: 100%
    d4: d4: complete: 100%
    d3: d3: complete: 100%
    d1: d1: complete: 100%
    d2: d2: complete: 100%
    d4: d4: d4.img
    d3: d3: d3.img
    d2: d2: d2.img
    d1: d1: d1.img

### Attach the boot image for the desired profile

    # nodemedia d1-d4 attach http://172.30.1.5/confluent-public/os/rocky-8.7-x86_64-default/boot.img
    d1: http://172.30.1.5/confluent-public/os/rocky-8.7-x86_64-default/boot.img (insecure)
    d1: d1.img
    d2: http://172.30.1.5/confluent-public/os/rocky-8.7-x86_64-default/boot.img (insecure)
    d2: d2.img
    d3: http://172.30.1.5/confluent-public/os/rocky-8.7-x86_64-default/boot.img (insecure)
    d3: d3.img
    d4: http://172.30.1.5/confluent-public/os/rocky-8.7-x86_64-default/boot.img (insecure)
    d4: d4.img

### Boot nodes to usb to commence deployment

    # nodeboot d1-d usb
    d1: usb
    d1: reset
    d2: usb
    d2: reset
    d3: usb
    d3: reset
    d4: usb
    d4: reset

### Deployment should proceed to completion

From this point forward, deployment should proceed automatically, similar to
how it would progress with a network based deployment.
