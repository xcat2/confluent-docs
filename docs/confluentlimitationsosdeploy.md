---
layout: page
title: Limitations of usage of Confluent osdeploy initialize across multiple management nodes
permalink: /documentation/confluentlimitationsosdeploy.html
---

The Confluent "osdeploy initialize" command provides assistance in setting up facilities relating to deployment and access of managed nodes from one or more management nodes. Setting up these facilities involve accessing one or more shared files.

In order to prevent multiple simultaneous attempts to access the same files, any usage of the Confluent "osdeploy initialize" command should be limited to a single member of a Confluent collective at a time.