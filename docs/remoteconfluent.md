---
layout: page
title: Remote confluent
permalink: /documentation/remoteconfluent.html
---

Note this method for xCAT usage is largely superseded by using a [collective]({{site.baseurl}}/documentation/collective.html) instead,
and using nodeconsole rather than rcons. There remain scenarios however where remote access is expected.

Confluent CLI access is normally local, after using SSH to access a management node.
However, it also supports remote access, and this is a key functionality when used
in conjunction with xCAT in a service node setup.

First, on every confluent server you want to access, a user must be created, using the
same procedure as creating a user for the Web API:

    confetty create /users/demouser password=password role=admin

Additionally, a TLS certificate must be provided, with the private key in /etc/confluent/privkey.pem and
the certificate in /etc/confluent/srvcert.pem.  You can generate such certificates using the collective command:

    collective gencert

At this point, xCAT's rcons will take care of connecting to the correct server.  However, it will
prompt for your confluent user and passphrase each time.  The user and password may alternatively
be provided via environment variables:

    CONFLUENT_USER=demouser
    CONFLUENT_PASSPHRASE="password"
    export CONFLUENT_USER CONFLUENT_PASSPHRASE

Additionally, while rcons automatically connects to the relevant confluent server, other confluent commands
currently do not get automatically routed.  If you want to run a confluent command such as nodepower explicitly
against another host, this can be done by setting the CONFLUENT_HOST variable:

    CONFLUENT_HOST=10.1.0.1
    export CONFLUENT_HOST

