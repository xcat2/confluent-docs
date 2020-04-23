---
layout: page
title: Confluent Installation for SUSE Linux Enterprise
permalink: /documentation/installconfluent_suse.html
---

After adding the correct repository as indicated in the [download page]({{ site.baseurl }}/downloads/), you can install confluent by doing:

    zypper install lenovo-confluent

At which point go ahead and enable it and start it.

    systemctl enable confluent
    systemctl start confluent

At this point, source the script below for confluent command line functionality or logout and log back in. 

    source /etc/profile.d/confluent_env.sh


## Enabling the Web UI

### Enable Secure WebServer with SSL

For more information see [https://www.suse.com/documentation/sles-12/book_sle_admin/data/sec_apache2_ssl.html](https://www.suse.com/documentation/sles-12/book_sle_admin/data/sec_apache2_ssl.html). 

For quick start generating dummy ssl certificate: 

    # Run gensslcert -n somename if you do not have a domain set
    gensslcert

Create SSL conf on Apache 	

    cd /etc/apache2/vhosts.d/
    cp vhost-ssl.template mySSL.conf 

Edit mySSL.conf according to this example, replacing server.crt and server.key with the filenames specific to your server:

    #Update SSLCertificateFile and SSLCertificateKeyFile lines to point to server
    SSLCertificateFile /etc/apache2/ssl.crt/server.crt
    SSLCertificateKeyFile /etc/apache2/ssl.key/server.key

Enable SSL on Apache

    a2enflag SSL
    service apache2 restart


In terms of confluent itself, it is by default set up without any user access.  To enable a user that can ssh into your server to access the web interface:

    confetty create /users/demouser role=admin

The user 'demouser' may now use his login password to access the confluent web interface as an administrator.  The available roles are:

* Administrator: Full access apart from reading 'secret.' attributes for all data and operations
* Operator: Removes the ability to change or add usernames or passwords in various contexts
* Monitor: Suitable for health check programs, unable to do anything to effect operation of systems, but can get power state, health, and sensor data.


After these steps, the GUI should be available at:

    https://[server]/lenovo-confluent/

# Getting ready to use confluent
 
Proceed to [configuring confluent ]({{ site.baseurl }}/documentation/configconfluent.html) for information on
adding groups and nodes.
