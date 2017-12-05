---
layout: page
title: Confluent Installation for Red Hat Enterprise Linux 7
permalink: /documentation/installconfluent_rhel.html
---

First add the Lenovo HPC yum repository appropriate to your environment according to the procedure on the  [download page]({{ site.baseurl }}/downloads/).  It is suggested to then make sure there are no updates in the repository for your existing software:

    yum --disablerepo=* --enablerepo=lenovo-hpc update

Additionally, as of this writing there is a [bug](https://bugzilla.redhat.com/show_bug.cgi?id=1459947) in their python-cryptography package that requires the following workaround:

    yum install python-setuptools

At this point, the package may be installed:

    yum install lenovo-confluent

Next, enable it and start the confluent service:

    chkconfig confluent on
    service confluent start

At this point, source the script below for confluent command line functionality or logout and log back in. 

    source /etc/profile.d/confluent_env.sh

# Enabling the Web UI

If you have SELinux enforcing, you need to allow httpd to make network
connections:

    setsebool -P httpd_can_network_connect=on

Note that a default install also will have firewall restrictions preventing
https use.  You may remedy this by doing the following:

    firewall-cmd --zone=public --add-service=https --permanent

In terms of confluent itself, it is by default set up without any user access.  To create a user that may be used from the web interface:

    confetty create /users/demouser password=password

This will create a user named 'demouser' that will be able to use the password 'password'.

After these steps, the GUI should be available at:

    https://[server]/lenovo-confluent/

# Getting ready to use confluent
 
Proceed to [configuring confluent]({{ site.baseurl }}/documentation/configconfluent.html) for information on
adding groups and nodes.
