---
layout: page
title: Confluent Installation for SUSE
permalink: /documentation/installconfluent_suse.html
---
#Confluent Installation for SUSE

After adding the correct repository as indicated in the [download page]({{ site.baseurl }}/downloads/), you can install confluent by doing:
```sh 
zypper install lenovo-confluent
```	
If you already installed lenovo confluent and want to update , you can run: 
```sh 
    zypper up lenovo-confluent
```	
At which point go ahead and enable it and start it.
```sh 
chkconfig confluent on
service confluent start
```
At this point, source the script below for confluent commandline functionality or logout and log back in. 
```sh 
source /etc/profile.d/confluent_env.sh
```
#Enabling the Web UI
====================

Enable Secure WebServer with SSL : 
For more information see https://www.suse.com/documentation/sles-12/book_sle_admin/data/sec_apache2_ssl.html. 

For quick start generating dummy ssl cert: 
```sh 
# Run gensslcert -n somename if you do not have a domain set
gensslcert
```	
For Enabling SSL on Apache 	
```sh 
cd /etc/apache2/conf.d/
cp vhost-ssl.template mySSL.conf 
```
Edit mySSL.conf 
```sh      
#Update SSLCertificateFile and SSLCertificateKeyFile lines to point to server
SSLCertificateFile /etc/apache2/ssl.crt/server.crt
SSLCertificateKeyFile /etc/apache2/ssl.key/server.key

Enable Apache with SSL
```sh 
a2enflag SSL
service apache2 start
```

In terms of confluent itself, it is by default set up without any user access.  To create a user than may be used from the web interface:
```sh 
confetty create /users/demouser password=password
```
This will create a user named 'demouser' that will be able to use the password 'password'

