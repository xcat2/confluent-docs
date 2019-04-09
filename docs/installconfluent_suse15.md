---
layout: page
title: Confluent Installation for SUSE Linux Enterprise 15
permalink: /documentation/installconfluent_suse15.html
---

After adding the correct repository as indicated in the [download page]({{ site.baseurl }}/downloads/), you can install confluent by doing:

    zypper install lenovo-confluent

At which point go ahead and enable it and start it.

    chkconfig confluent on
    service confluent start

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

In terms of confluent itself, it is by default set up without any user access.  To create a user that may be used from the web interface:

    confetty create /users/demouser password=password

This will create a user named 'demouser' that will be able to use the password 'password'

After these steps, the GUI should be available at:

    https://[server]/lenovo-confluent/

# Getting ready to use confluent
 
Proceed to [configuring confluent ]({{ site.baseurl }}/documentation/configconfluent.html) for information on
adding groups and nodes.
