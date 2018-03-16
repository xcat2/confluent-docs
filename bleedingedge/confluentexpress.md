---
layout: page
title: Confluent Express
permalink: /bleedingedge/confluentexpress.html
---

This is a windows executable with a slimmed down confluent implementation.  It
is primarily intended to provide a laptop with an ethernet port 'crash cart' 
capability of accessing IMMs, XCCs, SMMs, CMMs, and Lenovo ethernet switches in rackmount, flex, and dense platforms without knowing or matching network configuration.

It works with default Windows networking configuration.  If you have unchecked 'ipv6' on your ethernet device, you would have to check it back on (though otherwise may leave it unconfigured).

Note that some 'proactive' threat analysis will flag this application, as it opens a local network port to load the UI in a web browser.  If your malware software is triggered, you may either whitelist the application or alternatively reduce severity to 'proactive' threats.  For users with Symantec Endpoint Protection, a [guide]({{site.baseurl}}/bleedingedge/symantecguide.html) is provided.

Additionally, VPN software may interfere with functionality, so you may need
to disconnect from VPNs while using this software.

Upon the software running and a link established between the laptop and the
dedicated management port of the server or chassis, a screen like the following
should be visible:
![Express Welcome]({{site.baseurl}}/assets/0welcomescreen.png)

The links on the left side may now be used to access the individual device
web interfaces without knowing the IP addresses in advance.  You may use this
to configure the ip address freely.

Alternatively, you may enter a username and password on the right to bring up all the detected systems in a GUI.  This should present health information with
details available on mouseover.  Additionally, you will be able to open the text console to access the UEFI setup menu, regardless of whether you have a remote
video license, as well as enable/disable the SMM in ThinkSystem D2 enclosures.

[Windows Executable]({{site.baseurl}}/assets/confluentexpress-0.61.zip)

