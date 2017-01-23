---
layout: page
title: Confluent Installation for Red Hat Enterprise Linux 7
permalink: /documentation/installconfluent_rhel.html
---

After adding the correct repository as indicated in the [download page]({{ site.baseurl }}/downloads/), you can install confluent by doing:
```sh
yum install lenovo-confluent
```	
If you already installed lenovo confluent and want to update , you can run: 
```sh    
yum update lenovo-confluent
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

First, if you have SELinux enforcing, you need to allow httpd to make network
connections:
```sh
setsebool -P httpd_can_network_connect=on
```
Note that a default install also will have firewall restrictions preventing
https use.  You may remedy this by doing the following:
```sh
firewall-cmd --zone=public --add-service=https --permanent
```
In terms of confluent itself, it is by default set up without any user access.  To create a user than may be used from the web interface:
```sh
confetty create /users/demouser password=password
```
This will create a user named 'demouser' that will be able to use the password
'password'

