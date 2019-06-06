---
layout: page
title: Confluent collective mode
permalink: /documentation/collective.html
---

The collective mode of confluent allows multiple confluent servers to act as one, providing
both high availability as well as scaling out to cover a larger number of servers with better
performance.
# Creating a collective

To begin, select a confluent server to begin constructing the collective from.  This page will use `mgt1`
as the server to start from.  All other
confluent servers will lose their configuration and the starting server configuration will replace it.
On this server, generate an invitation for another server:

    [root@mgt1 ~]# collective invite mgt2
    bWd0MkD/e95FBKP6NrBP4VSZFbZkwDmH5XqiIi8kpf3B0hGWuP6bfAcimUrs/7mKfI78+sGOHz7+YFg5zBm7Ubzzpx2j

On mgt2, use the data above to join the collective:

    [root@mgt2 ~]# collective join mgt1 -i bWd0MkD/e95FBKP6NrBP4VSZFbZkwDmH5XqiIi8kpf3B0hGWuP6bfAcimUrs/7mKfI78+sGOHz7+YFg5zBm7Ubzzpx2j
    Certificate generated successfully
    Success

On any member, `collective show` will show current status of the collective:

    [root@mgt2 ~]# collective show
    Quorum: True
    Leader: mgt1
    Active collective members:
        mgt2

Note that a two server collective is actually not redundant, as a minimun of 3 servers is required for redundancy.  Any member of a collective
can invite an additional member.  For example, extending the collective above to include mgt3 could be done from mgt1, but we will do it from mgt2
in this case:

    [root@mgt2 ~]# collective invite mgt3
    bWd0M0Bur9G7oFs31jkHiNeFNIoMI7lz8O354e7OhJ5Scqq6goztkoZsSnThbNxih45c3UYs5vc33F1gJ8XX+9FJCw51

    [root@mgt3 ~]# collective join mgt2 -i bWd0M0Bur9G7oFs31jkHiNeFNIoMI7lz8O354e7OhJ5Scqq6goztkoZsSnThbNxih45c3UYs5vc33F1gJ8XX+9FJCw51
    Certificate generated successfully
    Success
    
    [root@mgt3 ~]# collective show
    Quorum: True
    Leader: mgt1
    Active collective members:
        mgt2
        mgt3

# Managing the nodes' active manager

Once in a collective, each managed system must have a designated manager.  This can be changed on the fly.  If unspecified and a node goes through the discovery process, the member that performs the discovery claims the node by default. 
Here are examples of setting it
for a node or a group.  Issuing the same commands with different collective.manager is all that is required to move a node.

    # nodeattrib n1 collective.manager=mgt1
    # nodegroupattrib rack1 collective.manager=mgt1

# Restoring a missing collective member by restoring files

If a collective member is reinstalled, it's role in the cluster can be repaired by restoring the following four files:

    /etc/confluent/privkey.pem
    /etc/confluent/srvcert.pem
    /etc/confluent/cfg/collective
    /etc/confluent/cfg/myname


# Restoring a missing collective member by repeating the invite process

At any point, the invite process can be repeated for a member as if it were joining new, and it will replace the stale entry.

# Limitations

Note that currently most functions are enabled to be identical across a collective,
however /networking and /discovery apis are currently distinct per collective member.  This means
that nodediscover commands and automatic discovery activity must be directly managed on the respective
collective member.