---
layout: page
title: Confluent Installation for SUSE
permalink: /documentation/installconfluent_suse.html
---
#Confluent Installation for SUSE

After adding the correct repository as indicated in the [download page]({{ site.baseurl }}/downloads/), you can install confluent by doing:

	zypper lenovo-confluent
	
If you are missing the GPG key, run the following comand. 
    rpm --import https://hpc.lenovo.com/gpgkey.asc

If you already installed lenovo confluent and want to update , you can run: 

    zypper up lenovo-confluent
	
At which point go ahead and enable it and start it.

	chkconfig confluent on
	service confluent start

At this point, run the script below for confluent commands functional

    . /etc/profile.d/confluent_env.sh

#Enabling the Web UI
====================
	
Enable Secure WebServer with SSL : 

For more information see https://www.suse.com/documentation/sles-12/book_sle_admin/data/sec_apache2_ssl.html. 

For quick start generating dummy ssl cert: 
	# Run gensslcert -n somename if you do not have a domain set
	gensslcert
	
For Enabling SSL on Apache 	
	cd /etc/apache2/conf.d/
	cp vhost-ssl.template mySSL.conf 

Edit mySSL.conf 
     
	 #Update SSLCertificateFile and SSLCertificateKeyFile lines to point to server
	 SSLCertificateFile /etc/apache2/ssl.crt/server.crt
	 SSLCertificateKeyFile /etc/apache2/ssl.key/server.key

Enable Apache with SSL
    a2enflag SSL
	service apache2 start
	
Note that a default install also will have firewall restrictions preventing
https use.  You may remedy this by doing the following:

	firewall-cmd --zone=public --add-service=https --permanent

In terms of confluent itself, it is by default set up without any user access.  To create a user than may be used from the web interface:

	confetty create /users/demouser password=password

This will create a user named 'demouser' that will be able to use the password 'password'

