---
layout: page
title: OS Deployments Notes for CentOS
permalink: /documentation/centosdeploy.html
---

When deploying CentOS, the default behavior is to have the CentOS
internet repositories available.  If it is desired to not receive
updates from CentOS' internet site, create a postscript to execute
one of the following commands:

Disable the repositories (requires yum-utils package to be installed):

    yum-config-manager --disable CentOS-*

If yum-utils is not available, the repositories may instead be removed:

    rm /etc/yum.repos.d/CentOS-*repo

