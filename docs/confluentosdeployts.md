---
layout: page
title: Troubleshooting issues with confluent OS deployment
permalink: /documentation/confluentosdeploymenttroubleshooting.html
---
# IPv6 configuration

Deployment interfaces must have IPv6 enabled, with at least an automatic fe80:: address.  Generally this is default network interface configuration.  IPv6 need only be enabled, it need not be given any address manually, by DHCP, or by route advertisements, the automatic fe80:: addresses suffice.

# Unable to import media after aborting with control-C or an error being encountered

An attempt to import media after an error or abort may result in:

    {u'errorcode': 500, u'error': u'Unexpected error - Media import already in progress for this media'}

In order to proceed, the older import activity must be stopped. This can be done by listing current import activity,
and removing it using confetty:

    # osdeploy import CentOS-Stream-8-x86_64-20210118-dvd1.iso 
    {'errorcode': 500, 'error': 'Unexpected error - Media import already in progress for this media'}
    # confetty show /deployment/importing
    centos_stream-8.4-x86_64
    # confetty rm /deployment/importing/centos_stream-8.4-x86_64
    Deleted: deployment/importing/centos_stream-8.4-x86_64

# Can't ssh from the management node to a managed node after deployment, or from a managed node to another managed node after deployment

If the ssh ca certificate is changed on the management node, then confluent needs to be updated with this by running "osdeploy initialize -k".  This will allow for ssh from the management node to the managed nodes to work.

To make sure ssh from one confluent-deployed managed node to another works, after the ssh ca certificate is changed on the management node, if using image-based (versus separate kernel and initrd downloads) deployment, then the OS profile image needs to be updated with "osdeploy updateboot <profile name>" prior to OS deployment.

# Can't access OS repos from managed nodes after confluent deployment

The OS repo URLs are set to the specific profile used to perform the deployment with confluent on a managed node.  If that profile is moved, renamed, or deleted on the management node, then the managed node will not longer be able to access those repos.  This is different from how this was done with xCAT where different install profiles pointed to a common install source location (this actually is deduplicated in confluent as well, but the URLs on the managed nodes are specific to the deployment profile).

# Managed node may hang during confluent OS deployment

When performing OS deployment with confluent, the managed node may hang, for example at "Started cancel waiting for multipath siblings of <drive>" when deploying RHEL 8.3.  This can be caused by the collective.managercandidates nodattribute containing a management node that is not actually defined as a node in the confluent database.  Note that this has to be defined exactly as it appears in the "collective show" command output.  For example, if the management node is shown in "collective show" as "mn.domain" then that management node has to be defined with the nodename "mn.domain" in confluent, as opposed to just "mn".

# Regenerating SSH host certificates

If there is a requiremennt to regenerate SSH keys after installation and new
certificates are needed, the following script may be used:

```
#!/bin/bash
nodename=$(cat /etc/confluent/confluent.info | grep NODENAME | awk '{print $2}')
mgr=$(cat /etc/confluent/confluent.info | grep MANAGER | head -n 1 | awk '{print $2}')
for pubkey in /etc/ssh/ssh_host*key.pub
do
        certfile=${pubkey/.pub/-cert.pub}
        curl -f -X POST -H "CONFLUENT_NODENAME: $nodename" -H "CONFLUENT_APIKEY: $(cat /etc/confluent/confluent.apikey)" -d @$pubkey https://[$mgr]/confluent-api/self/sshcert > $certfile
done
```

# Unable to ssh from one managed node to another on an interface which has a DNS hostname that doesn't match the confluent nodename

In some cases ssh from one managed node to another will fail with the following error:

```
Certificate invalid: name is not a listed principal
```

This can occur if the net.<name>.hostname nodeattribute is not set properly on the managed nodes, and can occur if there was a non-existing managed node so that the ssh configuration on the already existing managed nodes couldn't setup for those nodes at that time.  The ssh configuration for those existing nodes would not be fixed on deployment of the new managed nodes, even if the net.<name>.hostname was set correctly on addition and deployment of the new managed node.  To address this, the following script should be run on each managed node that should be able to ssh without a password prompt to others on the interface with a DNS hostname that doesn't match the confluetn nodename:

```
[ -f /lib/confluent/functions ] && . /lib/confluent/functions
[ -f /etc/confluent/functions ] && . /etc/confluent/functions
[ -f /opt/confluent/bin/apiclient ] && confapiclient=/opt/confluent/bin/apiclient
[ -f /etc/confluent/apiclient ] && confapiclient=/etc/confluent/apiclient
for pubkey in /etc/ssh/ssh_host*key.pub; do
    certfile=${pubkey/.pub/-cert.pub}
    rm $certfile
    confluentpython $confapiclient /confluent-api/self/sshcert $pubkey -o $certfile
done
TMPDIR=$(mktemp -d)
cd $TMPDIR
confluentpython $confapiclient /confluent-public/site/initramfs.tgz -o initramfs.tgz
tar xf initramfs.tgz
for ca in ssh/*.ca; do
	LINE=$(cat $ca)
	cp -af /etc/ssh/ssh_known_hosts /etc/ssh/ssh_known_hosts.new
	grep -v "$LINE" /etc/ssh/ssh_known_hosts > /etc/ssh/ssh_known_hosts.new
	echo '@cert-authority *' $LINE >> /etc/ssh/ssh_known_hosts.new
	mv /etc/ssh/ssh_known_hosts.new /etc/ssh/ssh_known_hosts
done
for pubkey in ssh/*.*pubkey; do
	LINE=$(cat $pubkey)
	cp -af /root/.ssh/authorized_keys /root/.ssh/authorized_keys.new
	grep -v "$LINE" /root/.ssh/authorized_keys > /root/.ssh/authorized_keys.new
	echo "$LINE" >> /root/.ssh/authorized_keys.new
	mv /root/.ssh/authorized_keys.new /root/.ssh/authorized_keys
done
confluentpython $confapiclient /confluent-api/self/nodelist | sed -e 's/^- //' > /etc/ssh/shosts.equiv
cat /etc/ssh/shosts.equiv > /root/.shosts
cd -
rm -rf $TMPDIR
```

This script is also available at:

https://raw.githubusercontent.com/lenovo/confluent/master/misc/setupssh.sh



# Confluent OS profile updates are not automatically applied on confluent updates

The default confluent profiles for OSes (e.g. RHEL 8.4, SLE 15.3, etc.) do occasionally get updates as part of a confluent update.  However, these aren't applied automatically unless osdeploy import is re-run.  To make sure the updates available to an OS profile in a confluent update are applied is is recommended to remove (or backup in a directory confluent doesn't use) the existing default profile and re-run:

```
osdeploy import <OS ISO image filename>
```

Any customized profiles based on the default profile may need to be resetup based on the new default profile also.

# Confluent does not support secure boot with PXE. 

The ipxe boot loader that confluent uses in not signed, because of this an attempt to do secure boot with PXE will result in a secure boot violation. To do a network boot using confluent with secure boot enabled either http or https boot must be used. 





