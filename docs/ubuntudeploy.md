---
layout: page
title: OS Deployment Notes for Ubuntu 
permalink: /documentation/ubuntudeploy.html
---

When the `nameserver` nodeattribute is set on a node/nodegroup and Ubuntu OS is deployed to the node(s), the Confluent server 
will add the `nameserver` argument to all the interfaces that are configured in the `etc/netplan` file on the 
managed node(s). If all the interfaces cannot reach the nameservers this might result in name resolution failures. 
To fix this issue identify the interface that can reliably reach the `nameserver` and then remove the nameserver
argument from all the other interfaces.