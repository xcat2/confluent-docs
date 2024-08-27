---
layout: page
title: OS Deployment Notes for Ubuntu 
permalink: /documentation/ubuntudeploy.html
---

<b>Troubleshooting name resolution issues</b>  

When the `nameserver` nodeattribute is set on a node/nodegroup and Ubuntu OS is deployed to the node(s), the Confluent server 
will add the `nameserver` argument to all the interfaces that are configured in the `/etc/netplan` folder on the 
managed node(s). If all the interfaces cannot reach the nameservers this might result in name resolution failures. 
To fix this issue identify the interface that can reliably reach the `nameserver` and then remove the nameserver
argument from all the other interfaces.

<b>Troubleshooting Network config issues</b>

Confluent server will setup up interface files in the `/etc/netplan` folder of the deployed node(s). In some cases the
`00-installer-config.yaml` is set up in addition to the `{interface}-confluentcfg.yaml` files that Confluent sets up 
when you deploy. Looking at the `00-installer-config.yaml` file, interfaces that are already defined by confluent will 
also be defined in the installer conflig file. see example below: 

```
root@n866:/etc/netplan# ls -l
total 12
-rw------- 1 root root 263 Aug 12 16:32 00-installer-config.yaml
-rw------- 1 root root 265 Aug 12 16:35 eno1-confluentcfg.yaml
-rw------- 1 root root 185 Aug 12 16:35 eno2-confluentcfg.yaml
```

when we read the `00-installer-config.yaml` file and the `eno1-confluentcfg.yaml` we will see that eno1 interface is 
defined in both files. If you are having issues with the network on the node, we recommend removing the 
`00-installer-config.yaml` file given that you have the right networking config in the interface file configured by 
confluent. 

Note: The values set in the `{interface}-confluentcfg.yaml` file are retrieved from the nodeattributes set for that particular node