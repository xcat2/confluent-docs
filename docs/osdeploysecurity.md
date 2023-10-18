---
layout: page
title: Handling of security information in OS deployment
permalink: /documentation/osdeploysecurity.html
---

# SSH host and user authentication

In confluent, hosts are given SSH certificates when required to vouch for their identity. /etc/ssh/shosts.equiv and /etc/ssh/ssh_known_hosts
are configured to facilitate node to node ssh without working about known_hosts and to enable host based authentication of users. This
facility may be customized by setting `ssh.trustnodes` to limit the generated hosts.equiv file to a subset of hosts.  For example,
if wanting to limit members of the group `storage` to only trust fellow members of `storage`, then set `ssh.trustnnodes` to `storage`.
Conversely if a compute node has `ssh.trustnodes` set to `compute,storage`, then nodes would trust either group, allowing `storage` to
ssh to `compute`, but not the other way around.

As a result of node to node authentication being enabled from host based authentication, it is frequently possible to forgo managing user ssh keys
within a confluent install (e.g. skipping setting up ~/.ssh/authorized_keys and ~/.ssh/id_\* files).

One exception to this is that root and syncfiles/ansible ssh user keys are added to the local root user to provide management and automation
regardless of host based authentication state.

# syncfiles facility

The syncfiles facility allows content from deployment server to be copied to a target node in flexible ways. The source content may be located
anywhere on the deployment server, but must be accessible by the `confluent` user, as `confluent` does not run as `root`.  It may be convenient
to use `sudo -u confluent bash` to examine files for access if you receive errors about inaccessible files. This may be used to convey more sensitive
data by allowing confluent, but not other users to read the information

# Content in /var/lib/confluent/private/

The confluent api offers material in /var/lib/confluent/private to nodes that authenticate using their node api key. For example, confluent uses
this facility to provide the encryption key for encrypted diskless images and disk cloning. Custom scripts may use this facility. For example, if wanting to provide some sort of /etc/shadow entry for an account using the private facility:
- Place hash of password in private file (substituting [os-profile] for the os profile that you specify in `nodedeploy`): `echo '$5$ssdUjvVexCw50Nvc$5uQMDLlikaiZKsTt4.8Xmlmr/O7qNXTrlBgnc20CQb7' > /var/lib/confluent/private/os/[profilename]/pending/someaccount.passwd'
- When in place, the client may access it either full time if diskless or prior to the conclusion of post by doing:
```
# python3 /opt/confluent/bin/apiclient /confluent-api/self/profileprivate/pending/someaccount.passwd > /tmp/mylocalfile  
# cat /tmp/mylocalfile  
$5$ssdUjvVexCw50Nvc$5uQMDLlikaiZKsTt4.8Xmlmr/O7qNXTrlBgnc20CQb7  
```

# API calls

Confluent API calls provide information for deployment authenticated by the node API key.  For example in conjunction with custom node attributes, data can be stored and
accessed in an authenticated fashion:

    [root@mgt1 ~]# nodeattrib d11 custom.mysecret=area51
    d11: area51
    [root@mgt1 ~]# ssh d11
    [root@d11 ~]# python3 /opt/confluent/bin/apiclient /confluent-api/self/myattribs|grep custom.mysecret
    custom.mysecret: area51

# Content in /var/lib/confluent/public is considered public

Material is published without authentication from /var/lib/confluent/public, and thus sensitive information such as passwords or private keys should be avoided, and instead syncfiles, profile private area, or node attributes should be used.
One borderline scenario is diskless and cloned images.  Confluent attempts to strip well known confidential information during capture or pack (e.g. shadow and private ssh keys), but custom OS content
may contain unrecognized confidential material. To mitigate this issue without incurring logistical or performance penalty of the secure facilities, confluent defaults to encrypt these images and
store the decryption keys in the profile private area on the filesystem.


