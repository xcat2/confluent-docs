---
layout: page
title: Confluent Express with Symantec Endpoint Protection
permalink: /bleedingedge/symantecguide.html
---

Particularly updates to confluent express do not have reputation, and since it is unknown, then 
Symantec's SONAR is exceedingly suspicious of the port it opens to give the web browser access and
can block and quarantine or remove the binary.  It is possible to temporarily disable the service altogether,
but this is a more targeted guide to leave the protection in place, but avoid disrupting confluent express.

First from Symantec's tray icon, select 'Open Symantec Endpoint Protection'.

Then select options button next to Proactive Threat Protection
![SEP screen]({{site.baseurl}}/assets/proactive.jpg)

Under the presented SONAR tab, select 'Quarantine' for High risk detection and check 'Prompt before terminating a process'
![SONAR tab]({{site.baseurl}}/assets/sonar.jpg)


Under Suspicious Behavior Detection tab, change High risk detection to 'Prompt':
![Suspicious Behavior Detection tab]({{site.baseurl}}/assets/susipcious.jpg)


When you run confluent express, you may see the executable flagged.  Ensure that the risk is SONAR.Heuristic.159, and if so
you can select Other Actions, and select Exclude.
![SEP Results]({{site.baseurl}}/assets/detection.jpg)
