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
