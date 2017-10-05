---
layout: page
title: Remote confluent
permalink: /documentation/remoteconfluent.html
---

Confluent CLI access is normally local, after using SSH to access a management node.
However, it also supports remote access, and this is a key functionality when used
in conjunction with xCAT in a service node setup.

First, on every confluent server you want to access, a user must be created, using the
same procedure as creating a user for the Web API:

    confetty create /users/demouser password=password

Additionally, a TLS certificate must be provided, with the private key in /etc/confluent/privkey.pem and
the certificate in /etc/confluent/srvcert.pem. One quick solution in an xCAT configuration is to use the xCAT
key and certificate pair:

    cp /etc/xcat/cert/server-key.pem /etc/confluent/privkey.pem
    cp /etc/xcat/server-cert.pem /etc/confluent/srvcert.pem

At this point, xCAT's rcons will take care of connecting to the correct server.  However, it will
prompt for your confluent user and passphrase each time.  The user and password may alternatively
be provided via environment variables:

    CONFLUENT_USER=demouser
    CONFLUENT_PASSPHRASE="password"

Additionally, while rcons automatically connects to the relevant confluent server, other confluent commands
currently do not get automatically routed.  If you want to run a confluent command such as nodepower explicitly
against another host, this can be done by setting the CONFLUENT_HOST variable:

    CONFLUENT_HOST=10.1.0.1

