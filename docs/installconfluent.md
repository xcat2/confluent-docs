---
layout: page
title: Confluent Installation
permalink: /documentation/installconfluent.html
---

After adding the correct repository as indicated in the [download page]({{ site.baseurl }}/downloads/), you can install confluent by doing:

	yum install lenovo-confluent

At which point go ahead and enable it and start it.

	chkconfig confluent on
	service confluent start

At this point, log out and log back in to have the confluent commands functional.

Enabling the Web UI
====================

First, if you have SELinux enforcing, you need to allow httpd to make network
connections:

	setsebool -P httpd_can_network_connect=on

Note that a default install also will have firewall restrictions preventing
https use.  You may remedy this by doing the following:

	firewall-cmd --zone=public --add-service=https --permanent

In terms of confluent itself, it is by default set up without any user access.  To create a user than may be used from the web interface:

	confetty create /users/demouser password=password

This will create a user named 'demouser' that will be able to use the password
'password'

