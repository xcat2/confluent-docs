---
layout: page
title: Manual discovery with nodediscover assign
permalink: /documentation/confluentnodeassign.html
---

Note that discovery in confluent is an optional process intended to aid with automatic gathering of mac addresses,
configuring IP addresses and authentication of management controllers (e.g. xClarity Controller) when they may not have
a viable or known IP address. If wanting to use confluent in an environment where the onboarding is otherwise handled,
you may want to skip ahead to [managing hardware using confluent](../miscellaneous/manageconfluent.md).

Once parameters have been [configured](../getting_started/configureconfluent.md) such as desired username and password,
discovery can be performed to push that configuration from the confluent configuration into the actual configuration on the devices.

Confluent is capable of fully automated onboarding of equipment based on either [ethernet switch](confluentswitchdisco.md) or [server enclosure](confluentenclosuredisco.md). However, sometimes
this would require things that are either not applicable, not known, or not allowed. In such circumstancecs, there are manual
methods to aid in simplified onboarding kicked off by manual data despite those devices still not yet having viable configuration.

# Showing currently known data

By default confluent is always trying to passively gather data about a network. It is however prudent to request that confluent actively scan the environment to recognize new devices or update stale information.  If wanting to purge all data to ensure no stale data
is visible, clearing the discovery information can be done by executing:

    # nodediscover clear

Asking for confluent to merge new devices and data with already detected information can be done with:

    # nodediscover rescan

In order to examine detected systems, `nodediscover` can provide a view of detected device information:
```
# nodediscover list -f node,model,serial,mac,type,ip
 Node|      Model|     Serial|               Mac|          Type|                                           IP
-----|-----------|-----------|------------------|--------------|---------------------------------------------
     | 7X2104Z023|   DVJJ9986| 08:94:ef:2f:2b:c7|    lenovo-xcc|                fe80::a94:efff:fe2f:2bc7%eth0
     | 7X2106Z009|   DVJJ1086| 08:94:ef:2f:2e:9d|    lenovo-xcc|    172.30.66.1,fe80::a94:efff:fe2f:2e9d%eth0
     | 7X2104Z000|   DVJJ1042| 08:94:ef:3f:e0:af|    lenovo-xcc|    172.30.66.3,fe80::a94:efff:fe3f:e0af%eth0
     | 7X2104Z000|   DVJJ1003| 08:94:ef:40:89:31|    lenovo-xcc|                fe80::a94:efff:fe40:8931%eth0
```
To start, we will just configure one of the systems. First we define a new node to the confluent configuration. This doesn't change
anything and merely declares an intent to use a particular name:

    # nodedefine t1

Further attributes may be defined on this line, in this example we are taking advantage of group inheritance to provide all information about a node. See [configuring confluent](../getting_started/configureconfluent.md) for more information on how to configure data such as username and password. With a node defined, we can associate a specific system with the system, using data such as serial number or mac address. Here we associate the serial number DVJJ1003 with the name t1:

    # nodediscover assign -s DVJJ1003 -n t1
    Assigned: t1

The specified node at this point can be [managed by confluent](../miscellaneous/manageconfluent.md).

# Bulk manual discovery

The `nodediscover` command can accept a csv file of data and handle defining and associating devices. Here we will use nodediscover
list to create a starting point:

    # nodediscover list -f serial,node -t lenovo-xcc -c > nodes.csv

This will produce a CSV that appears as:

    Serial,Node
    DVJJ9986,
    DVJJ1086,
    DVJJ1042,
    DVJJ1003,

We will manually fill in our desired node names, in this case we will just number them n1 through n4, top to bottom, and will use the address already detected to communicate with the systems:

    Serial,Node
    DVJJ9986,n1
    DVJJ1086,n2
    DVJJ1042,n3
    DVJJ1003,n4

If also desiring to reconfigure networking as the procedure executes, then
add a `bmc` column to the CSV to specify the desired IP (which need not be the same as the current IP address, the discovery process will change whatever the current IP is to the one specified in the file):

    Serial,Node,bmc
    DVJJ9986,n1,172.30.170.1
    DVJJ1086,n2,172.30.170.2
    DVJJ1042,n3,172.30.170.3
    DVJJ1003,n4,172.30.170.4

Note that if you receive an error like `Nodename is a required field`, check for any completely blank lines, for example at the
end of the file. Delete any such lines and try again.
    

This file can be processed by nodediscover to associate all the serial numbers with node names:

    # nodediscover assign -i nodes.csv 
    Defined n1
    Discovered n1
    Defined n2
    Discovered n2
    Defined n3
    Discovered n3
    Defined n4
    Discovered n4

Within a few moments of this output, it should be possible to move on to [managing the devices using confluent](../miscellaneous/manageconfluent.md)


