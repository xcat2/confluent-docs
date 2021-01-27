---
layout: page
title: Troubleshooting issues with confluent OS deployment
permalink: /documentation/confluentosdeploymenttroubleshooting.html
---
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

