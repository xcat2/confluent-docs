---
layout: page
title: Confluent Discovery/Autosense setting
permalink: /documentation/confluentdiscoverysetting.html
---

Confluent has a setting called "discovery/autosense" which acts to enable or disable scanning network switches for MAC addresses, but also has the effect of enabling or disabling network booting of systems from Confluent. Having the setting disabled has the effect of preventing network booting of systems from Confluent (including for OS deployment), but will not affect systems booting from operating systems installed on local storage.

If no network booting or node discovery using switch port information for node identification is required, disabling the setting can be done to improve the performance of Confluent.

The setting must be defined for each Confluent management node, including all members of the collective if collective mode is in use.

In order to view the current value of the setting for a particular Confluent management node, run the following command locally:

    # confetty show discovery/autosense
    enabled: True

In order to define the value of the setting for a particular Confluent management node, run the following command locally:

    # confetty set discovery/autosense enabled=False

    # confetty show discovery/autosense
    enabled: False

Note that the setting defaults to "True".