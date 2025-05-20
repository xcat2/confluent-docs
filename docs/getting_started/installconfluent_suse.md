---
layout: page
title: Confluent Installation for SUSE Linux Enterprise
permalink: /documentation/installconfluent_suse.html
toc: true
---

SuSE Linux Enterprise 15 SP4 or higher is currently required for installation.

After adding the correct repository as indicated in the [download page](../downloads.md), you can install confluent by doing:

    zypper install lenovo-confluent

At which point go ahead and enable it and start it.

    systemctl enable confluent --now

At this point, source the script below for confluent command line functionality or logout and log back in. 

    source /etc/profile.d/confluent_env.sh


## Enabling the Web UI

### Enable Secure WebServer with SSL

If not otherwise enabling and configuring TLS, then the following will activate a TLS configuration:	

    cd /etc/apache2/vhosts.d/
    cp vhost-ssl.template mySSL.conf 

Use osdeploy to create TLS certificate:

    osdeploy initialize -t

Enable SSL on Apache

    a2enmod rewrite
    a2enflag SSL
    systemctl enable apache2 --now


In terms of confluent itself, it is by default set up without any user access.  To enable a user that can ssh into your server to access the web interface:

    confetty create /users/demouser role=admin

The user 'demouser' may now use his login password to access the confluent web interface as an administrator.  The available roles are:

* Administrator: Full access apart from reading 'secret.' attributes for all data and operations
* Operator: Removes the ability to change or add usernames or passwords in various contexts
* Monitor: Suitable for health check programs, unable to do anything to effect operation of systems, but can get power state, health, and sensor data.


After these steps, the GUI should be available at:

    https://[server]/lenovo-confluent/

# Getting ready to use confluent
 
Proceed to [configuring confluent ](configureconfluent.md) for information on
adding groups and nodes.
