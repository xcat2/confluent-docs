---
layout: page
title: Confluent SSH Configuration
permalink: /documentation/sshdesign.html
toc: true
---
# SSH authentication architecture as configured by confluent

In confluent, some more advanced SSH features are leveraged to tighten secure use of passwordless SSH and
known_hosts.  Generally speaking, the details are handled and the operator need not worry about the details.  This
document is provided to help show the details for those who need to know the mechanisms at work and how they are manipulated.

# SSH certificate authority

SSH supports the concept of a certificate authority, allowing one SSH key to vouch for another.  In confluent, `osdeploy initialize -s` requests initialization of such an authority on the local management server.  The private key of that authority is stored as /etc/confluent/ssh/ca and the public key is in /etc/confluent/ssh/ca.pub.  Additionally, the public key is copied to /var/lib/confluent/public/site/ssh/{name}.ca for inclusion for nodes to trust.  Note that
in a confluent collective, each collective member will generate their own.  When doing a deployment, the deployed node will have a certificate signed by whatever collective member deployed it.  Notably, when a node that will one day be a collective member is installed, it will be signed by the system that provided deployment, *not* itself.

# Certificate authority and role in host key trust

In traditional ssh usage, each time the user connects to a new host, they are prompted and that specific key is added to ~/.ssh/known_hosts.  This may also be done in /etc/ssh/ssh_known_hosts, to provide that repository system-wide.
A certificate authority being added to /etc/ssh/ssh_known_hosts extends it's trust over any matching host that has been vouched for by that authority. Here is an example where a 4 collective members get added, and the
authorities are configured to be allowed to vouch for any name or ip address at all:

```
# cat /etc/ssh/ssh_known_hosts
@cert-authority * ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGysD2cqWwwkVFvPePgtGkRKrgmFPdjKbXyN1oFFGMlm d5 SSH CA
@cert-authority * ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGnF5/iTUmAGY7WZ80rY/Ko1D77HIoa32G1NjBMXozO4 d6 SSH CA
@cert-authority * ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBLCdA9ONJjk/ai2XZJqHDF+lN9Nvs4TMnz8h2HYbmSE d7 SSH CA
@cert-authority * ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICqOJB/ksETgYDj7bRLRO0ZCOZ1UVsBdIBRx23Fs5XCb d8 SSH CA
```

The `*` wildcard refers to the names the authority is allowed to issue certificates for and be trusted.  By default, confluent instructs the nodes to trust the confluent authorities to generate any name.
This effectively replaces the requirement to use ~/.ssh/known_hosts for users within a site, as the global known hosts file covers all the host keys that have or will be generated.  Note that `/var/lib/confluent/public/site/ssh/*.ca` will be incorporated,
whether confluent or other software or manual placement has created the files. This permits custom SSH certificate authorities to be added without confluent being aware of the operational details.


# Host key certificate
During deployment, a node is granted a certificate, and the certificates are stored along the key files in `/etc/ssh/ssh_host_*_key-cert.pub`.  HostCertificate entries are also added to /etc/ssh/sshd_config, for example:
```
HostCertificate /etc/ssh/ssh_host_ecdsa_key-cert.pub
HostCertificate /etc/ssh/ssh_host_ed25519_key-cert.pub
HostCertificate /etc/ssh/ssh_host_rsa_key-cert.pub
```

# Host based authentication

When doing ssh key based authentication, there are two general strategies.  The most popular method involves each user having a ~/.ssh/authorized_keys file enumerating the specific keys that are allowed to authenticate.  
Confluent focuses on enabling use of the host key.  The first step is for the host key to be recognized by way of known_hosts.  Per the above section, this is handled.  All that is left is enabling host based authentication and specifying which hosts are trusted to vouch for users that connect from them.

# sshd configuration changes for host based authentication

The following configuration changes are placed into sshd_config:
```
HostbasedAuthentication yes
HostbasedUsesNameFromPacketOnly yes 
```

The latter permits the client to specify it's own name, rather than relying on reverse DNS.  This means that the client node will do the equivalent of `getent hosts <ip of client nic>` and that result will be the name seen by
the server.

# ssh client configuration changes for host based authentication

This is an example configuration change made for ssh_config to dictate client behavior, enabling use of the host key to authenticate, and limiting ed25519 toward the end of minimizing key based authentication
attempts in a system with many key types:
```
Host *
    HostbasedAuthentication yes
    EnableSSHKeysign yes
    HostbasedKeyTypes *ed25519*
```

# Specifying permitted peer nodes

Confluent provides an attribute called `ssh.trustnodes` to designate which managed nodes are allowed to authenticate.  If unspecified, all nodes are assumed to be trusted.  The specified noderange will be expanded during deployment or, as of confluent 3.7.1, refresh of the ssh configuration using `run_remote setupssh`.  The expanded set will be placed into two files, `/etc/ssh/shosts.equiv` to enable users other than root, and `/root/.shosts` to enable node to node ssh as root.  The contents of those two files are the only things effected by this attribute.

# User based authentication for root

In addition to the host based configuration specified above, the root user on target system is generally given two user keys for `/root/.ssh/authorized_keys` per collective member.  When using `osdeploy initialize -u`, a suitable ssh public key from `/root/.ssh/*.pub` will be copied to `/var/lib/confluent/public/ssh/site/{host}.rootpubkey`.  This key is not used by confluent, but this service is provided as a convenience for operators using root user on the management node.  Note that any other files matching `/var/lib/confluent/public/ssh/site/*.rootpubkey` will also be added, whether confluent added them or not, so other users may be added in this manner as desired.

# User based authentication for confluent

confluent is not permitted to read ssh keys in `/root/.ssh`.  Therefore, running `osdeploy initialize -a` generates a separate user keypair in `/etc/confluent/ssh/`.  This key is used for tasks such as executing ansible plays, or 
synchronizing files in the `syncfiles` of an OS profile.  The public portion is placed into `/var/lib/confluent/public/site/ssh/*.automationpubkey`
