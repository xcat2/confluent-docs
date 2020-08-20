---
layout: page
title: Using a Cumulus switch with confluent
permalink: /documentation/confluentcumulus.html
---

In order to use a Cumulus switch with confluent, it requires
installation of the `affluent` agent.  Install the .deb file
from /opt/confluent/share/affluent/ onto the switch:

    # scp /opt/confluent/share/affluent/*.deb cumulus@r4c1:~
    lenovo-affluent_1.0.2.deb                                                                                      100% 8476     4.4MB/s   00:00    
    # ssh -t cumulus@r4c1 sudo apt install ~cumulus/lenovo-affluent_1.0.2.deb


With that installation complete, the switch merely
has to be added to confluent.  Use the resolvable hostname or ip address
as thte nodename(s):

    # nodedefine r4c1 type=switch hardwaremanagement.method=affluent

If the user and password is not set by the group (e.g. everything), then set those attributes as well:

    # nodeattrib r4c1 -p switchuser switchpass

The user and password would be the same that you would use to ssh into the switch.

With a managed switch, `nodehealth`, `nodesensors`, `nodefirmware`, and `nodeinventory` work:

    # nodehealth r4c1
    r4c1: critical (PSU1:status is all_not_ok, 1, 1, installed)
    # nodesensors r4c1
    r4c1: Fan Tray 3: 3863 RPM
    r4c1: Fan Tray 2: 3977 RPM
    r4c1: Fan Tray 1: 4204 RPM
    r4c1: PSU2:
    r4c1: PSU1: critical,status is all_not_ok, 1, 1, installed
    r4c1: CPU board: 37.50000 °C
    r4c1: Fan board: 33.00000 °C
    r4c1: Ambient 2: 47.00000 °C
    r4c1: Ambient 1: 36.50000 °C
    r4c1: Networking ASIC Die Temp Sensor: 50.10000 °C
    r4c1: Networking ASIC Die Temp Sensor: 51.30000 °C
    r4c1: Networking ASIC Die Temp Sensor: 50.10000 °C
    r4c1: Core 1: 29.00000 °C
    r4c1: Core 0: 29.00000 °C
    # nodeinventory r4c1
    r4c1: System Manufacturer: Lenovo
    r4c1: System Serial Number: NNNNNNNN
    r4c1: System Product name: Lenovo ThinkSystem NE0152T RackSwitch
    r4c1: System Model: 7Y81CTO1WW
    r4c1: System Board manufacture date: 03/05/2019 13:33:34
    r4c1: System Revision: 4
    # nodefirmware r4c1 
    r4c1: Cumulus Linux: 4.2.0
    
Also, the /networking API and dependent discovery functionality is enabled.
    
    
