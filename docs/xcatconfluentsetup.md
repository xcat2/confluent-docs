---
layout: page
title: Confluent setup in existing xCAT configuration
permalink: /documentation/configconfluent_xcat.html
---

Current xCAT versions include a command called `makeconfluentcfg`.  This command can be used without arguments to try
to define or update all node configuration in confluent based on xCAT configuration.

   # makeconfluentcfg

To create or update only a subset:

   # makeconfluentcfg rack1

Note that the confluent network model does not currently map directly to the xCAT model.  Notably, if wanting to indicate
a static gateway for the sake of autodiscovery, you would want to set the `net.ipv4_gateway` attribute on a confluent group
or confluent nodes.  For example:

   # nodegroupattrib everything net.mgt.ipv4_gateway=172.20.0.1

The `mgt` value in the above example can be any name.  It is used to group distinct network settings together if multiple network
interfaces are specified.  It's also possible to omit the name if there is only a single interface to configure.

