---
layout: page
title: Confluent API Documentation
permalink: /documentation/developer/api.html
---

Confluent models functionality in a hierarchical structure.  It is a RESTful or
filesystem-like structure, depending on how you want to think of it.  With
respect to REST there are a couple of exceptional resources that are not
strictly RESTful, which shall be explained.

This document will review the available resources as they are structured.
It is suggested to browse the API using confetty (without arguments) or using
a web browser pointed at http://[mgt]:4005/ (once remote HTTP usage has been
  enabled)

## **Enabling remote usage over HTTP**
By default, confluent API is only accessible locally over a unix domain socket.
To enable a remote user for HTTP access, the quickest method is to use confetty
to create a local account:

    # confetty create /users/apiuser password=apipassword

With the above example, using 'apiuser' and 'apipassword' in the user/password
prompt will provide access when accessing the management server by http://servername:14005/.

## **Using python to access the API**
All of the confluent command lines are implemented in python.  They serve
as a good reference to review accessing the API.  For example, reviewing
the source code of 'nodepower' can be very informative.  In general, a
python developer will want to start by importing the client library:

	import confluent.client as client

Next, you'll want to create a client session:

	session = client.Command()

By default, this will reach out to the local instance.  If you want to reach
out to a remote server, you may pass that as a string to the `Command()` call,
as in `Command('172.20.0.1')`. Also you would have to enable remote native
confluent protocol, as described in [remote confluent]({{site.baseurl}}/documentation/remoteconfluent.html).


For many common interactions, there is a convenient method on the session
object called 'simple_noderange_command()'. To accomodate more complex
scenarios and map more directly to the underlying REST structure, the
functions `create()`, `read()`, `update()`, and `delete()` are provided.
See the client.py python API documentaion for more details.

<!--
## /discovery/

The discovery collection gathers functionality related to detecting and scanning
for new systems.

## /discovery/detected/

A collection of systems that have been detected (through scan or otherwise) but
not yet a node or related to a node.

## /discovery/log

A log of discovery related activity including things being detected and things
promoting to being a managed node.

## /discovery/scan

A resource to request an active scan.  Generally confluent will scan on startup
and then passively listen for changes.  This resource can be used to explicitly
request a scan be performed.  Results from such a scan will appear in the detected/
collection.

-->

## **API Structure**

The Confluent API structure is set up like a psuedo file system. Reading these paths
will list the respective data. To update, the same path is given, along with the data to
be used in the update, such as *{'state' : [newstate]}*. 

### **Accessing Nodes: /nodes/ and /noderange/**

#### **/nodes/**

The /nodes/ collection lists all defined nodes in confluent.  Every operation
that can be done against a node is represented in the /nodes/ collection.
Functionality is further subdivided into categories under the top level
/nodes/ location for a given node. The operations for a specific node are 
accessed with **/nodes/[nodename]/**

#### **/noderange/[noderange]/**

The /noderange/ top level structure appears empty.  However, if the client
requests a subcollection, **[noderange]/**, it will try to auto-create a matching 
collection based on the confluent noderange syntax.  Strictly speaking, this is 
not RESTful, but consider it as an auto-mounting filesystem.  For a given            
collection, the same structure produced by '/nodes/[nodename]/' is reproduced, 
but the operations are considered to apply to all nodes matching the noderange 
rather than just one node. Additionally, a noderange has a 'nodes/' subcollection
to allow client software to list the nodes that match the noderange, but this does
not allow operations on the individual nodes.


*In the following examples, **/nodes/[nodename]/** can be replaced by 
**/noderange/[noderange]/** to execute the operations on multiple nodes.*


### **Querying or setting power state: /nodes/[nodename]/power/state**

This resource allows query and setting of the power state.  Reading this value
provides the current state, and sending *{'state': [newstate]}* will request a
state change.  

The recognized states are:

* **on** - Request system to be powered on.  Has no effect if system is already on.
* **off** - Request system to be powered off, without waiting for OS to shutdown.  
        This is an immediate power down.  Has no effect if system is already off.
* **boot** - Request system to take appropriate action to immediately start booting.
         If a system is on, this is effectively 'reset'.  If a system is off, it
         has the same effect as 'on'
* **reset** - Request a running system to immediately start booting without regard
          for current OS.  This has no effect with the system off.
* **shutdown** - Send a request to the running OS to gracefully shutdown.  This
            returns asynchronously to notify that the request has been relayed,
            but has no guarantee that the OS will react or that the OS will
            react as desired (e.g. an OS could present a shutdown dialog on
            console, or ignore such requests completely)


### **Reseat node: /nodes/[nodename]/power/reseat**

Reseating is equivalent to unplugging the node and plugging it back in. Removes
standby power and reapplies it.

### **Setting next boot device: /nodes/[nodename]/boot/nextdevice**

Check and modify boot device override for next boot.  Frequently used for an
OS deployment or diagnostic boot to prepare for an exceptional boot case where
the default OS boot is not desired, but only for one boot.  Parameters are:

* **bootmode** - Allows requesting the firmware personality.  Recognized values are
  * *bios* - Force a BIOS style boot in the style that x86 systems have
           historically booted from their initial release
  * *uefi* - Force the boot to be UEFI style
  * *unspecified* - Allow platform to choose
* **persistent** - True/False indication of whether to request the platform leave
               the override in place.  For example, a request to network boot
               with persistent set to True should reboot from network from that
               point on, rather than reverting to default boot order after next
               boot
* **nextdevice** - The device/psuedo device to use in the next boot attempt.  This
               is a single device and not an order of devices.  The recognized
               devices are:
  * *default* - Use the usual boot sequence behavior without any overrides
  * *setup* - Boot the system into a configuration menu provided by firmware.
            Generally the same menu that results from pressing a special key
            during boot like 'F1'.  If this is active, no keypress during boot
            should be required.
  * *network* - Boot the system using a network protocol, generally PXE
  * *hd* - Attempt to boot straight to a hard disk in a system
  * *cd* - Boot from a CD/DVD/BD device.  In practice, this is frequently a
         virtual instance of a CD provided by remote media capability of a
         server.

### **Identifying a node: /nodes/[nodename]/identify**

This controls the behavior of the server to provide a means of making its
physical location known.  Generally, this is an LED that illuminates on request.
Sending *{'identify': [newstate]}* requests activation/deactivation of the LED.
It is common for this data not to be readable, so querying the value is not
generally promised to produce useful information (the server would return an
empty value in such a case).

The recognized states are:

* **on** - The LED will be illuminated (in some implementations, it will blink)
* **off** -The LED will be deactivated

### **Monitoring hardware: /nodes/[nodename]/sensors/hardware/[category]/**

This presents a collection of 'sensors' relevant to a node.  These are
current point-in-time indications of both numeric values (e.g. wattage, fanspeed,
temperature) and discrete states (missing hard drive, failed DIMM).  

Supported categories include:

* **all** - Returns all sensors present on the node
* **temperature** - Temperature sensors can include CPU temps, ambient temperatures, 
                  DIMM temperatures, etc. 
* **power** - Power sensors can include AC Power and DC Power, and any other measurements
              of power
* **energy** - Energy sensors can include AC Energy and DC Energy, and any other
              measurements of energy
* **leds** - LED sensors return the state of LEDs on the node, including the identify LED,
            error LEDs, etc.
* **fans** - Fan sensors return the speed of fans such as PSU or CPU fans. This may also
            return discrete sensors such as a fault.

Each sensor may return the following fields:

* **health** - An assessment of whether the state of the component should 
           be considered normal or a concern.  
           The following states are declared:
  * *ok* - Sensor indicates no problem
  * *warning* - Sensor indicates an abnormal condition exists, but not
             one that is currently impacting workload.  For example,
             excess correctable memory errors.
  * *critical* - Sensor indicates a severe problem exists that is
              impacting workload or presents an imminent risk
              of catastrophic data loss.  For example, a degraded
              RAID array.
  * *failed* - Indicates a severe problem that has caused disruption of
            resources or data loss.  For example, a fatal memory error
            resulting in a reboot, or loss of non-redundant storage.
* **name** - A string identifying the sensors
* **state_ids** - Numeric values representing the observed states.  Generally
              this field can be ignored.
* **states** - A list of textual descriptions of currently active states.  Examples
           include Present, Failed, Non-Redundant, and are intended to be
           self-explanatory and can be presented directly to an administrator
           without processing.  Programatic understanding of the severity is
           acheived through examining the 'health' field above.
* **units** -  Optional indicator of the units to use when evaluating 'value' field
* **value** - A numeric value representing the current reading of the sensors.  It
          is null when the sensor is a non-numeric sensor.

### **Configuring a node: /nodes/[nodename]/configuration/**

This is where one can view and manipulate various configurations active on
the node.  This is distinguished from 'attributes' which are values stored
about the node by confluent, but are not directly active on the system.  

#### **Managing system-defined configuration: /nodes/[nodename]/configuration/system/all**

This is where one can read or edit system-defined configuration like BIOS or UEFI settings.  

#### **Resetting the management controller: /nodes/[nodename]/configuration/management_controller/reset**

This can be used to request that the management controller for the node be reset.
PUT {'state': 'reset'} in order to initiate a restart of the management
controller

#### **Viewing user accounts on the management controller: /nodes/[nodename]/configuration/management_controller/users/**

This is a list of accounts considered local to the management controller.  This
excludes accounts provided by a central authentication provider, such as LDAP.
It is indexed by an arbitrary index value that might not correlate to user names.
For IPMI systems, it represents the 'user slot' of the user account.  Each account
provides the following fields:

* **username** - The username associated with this account
* **privilege_level** - The level of access afforded to the account. Levels are:
  * *user* - Able to read most sensor data
  * *operator* - Able to manipulate the running system, reboot, and access console
  * *administrator* - Able to change the configuration of the management controller,
                    including authentication data, ip addresses, alert destinations,
                    and so forth

#### **Configuring NTP: /nodes/[nodename]/configuration/management_controller/ntp/[argument]/**

Configure and control the NTP functionality of supported management controllers.  
For management controllers implementing NTP in a manner supported by confluent,
this provides the following mechanisms:

* **enabled** - Enable or disable NTP
* **servers** - Collection of servers currently configured. Can create new or update existing

Note that in confluent, efforts are made to correct timestamps with detectable
systematic errors, so local time on the management controller may not necessarily
impact accuracy of data such as event log timestamps.

#### **Managing alert destinations: /nodes/[nodename]/configuration/management_controller/alerts/destinations/**

Manage the list of destinations that the management controller will *directly*
send alerts to.  Alert information may be in turn propogated by
the respective destination to more destinations and formats.  Each item contains   
the following fields:

* **ip** - The ip address to transmit to
* **retries** - If acknowledge is enabled, the number of attempts to perform before
            giving up
* **acknowledge_timeout** - When waiting for an acknowledgement from the target,
                        how long to wait before evaluating the need to retrytime
* **acknowledge** - Whether to expect an explicit acknowledgement.  For example, SNMP  <!-- Do all of these acronyms make sense? -->
                traps do not have an SNMP mechanism to acknowledge receipt, so
                this would be disabled for normal SNMP traps.  However, IPMI
                PET alerts are SNMP traps, but provide a mechanism a receiver
                can use to confirm receipt.  If uncertain, this should be false
                unless otherwise indicated by the alert destination software.

#### **Viewing host name used by management controller: /nodes/[nodename]/configuration/management_controller/identifier**

Returns the host name that the management controller uses for DHCP requests.

#### **Manage BMC domain name: /nodes/[nodename]/configuration/management_controller/domain_name/**

Set/view the domain name of the BMC.


#### **Managing IP configuration: /nodes/[nodename]/configuration/management_controller/net_interfaces/management**

IP configuration data for the management controller.  Note that changing this
value without coordinating changes in the associated hardwaremanagement.manager
attribute may cause disruption.  The fields available:

* **ipv4_address** - The ipv4 address and netmask length in CIDR notation.  This
                 should provide the current value regardless of whether it is
                 DHCP or static, but should not be PUT if the ipv4_configuration
                 is not Static.
* **ipv4_configuration** - The method to use to assign the IPv4 address, either
                       'Static' or 'DHCP'
* **ipv4_gateway** - The gateway to use for non-local traffic.  As in ipv4_address,
                 PUT is only supported for this field if 'Static'
* **hw_addr** - The ethernet mac address of the interface

### **Running a shell session: /nodes/[nodename]/shell/sessions/**

This is a non-RESTful resource, used to create a stateful ssh session suitable
for use in a web browser.  See the source of consolewindow.js for an example of
how to interact.  RESTful style interaction allows listing currently active
shell sessions, but the primary role of translating HTTP to SSH is not something
that fits the RESTful models

### **Running a console session: /nodes/[nodename]/console/session**

This is a non-RESTful interface.  It provides a mechanism for javascript
code in a browser to present a terminal-in-a-browser proxying an HTTP based
protocol to the appropriate console protocol for the node.  The console is the
single, authoritatitve text based console of the node.  A node's console is
active independent of having any clients connected, and multiple clients
connecting always share a single view and input.  Upon open, a console session
may stream older data from log to client to help recreate the console.

### **Viewing availability of licensed functionality: /nodes/[nodename]/console/license**

Describes the availability of potentially licensed functionality pertaining
to remote console; for example, remote graphics console is frequently a premium
feature provided at additional cost.

### **Viewing and setting node attributes: /nodes/[nodename]/attributes/[group]/**

Lists attributes in confluent's datastore pertaining to nodes.  This may contain
information that confluent needs to function (e.g. address of management
controllers), helpful metadata about a node (node location, admin notes), or
cached data for performance enhancement or post-mortem (last health state,
serial numbers, et al).

Attributes can be accessed via the following groups:

* **all** - Provides all possible attributes as well as current values
* **current** - Provides only those attributes that have been given values

When doing UPDATE, 'all' and 'current' will behave identically. The fields are    <!-- What fields? -->
defined in the [attributes] document.  Each attribute has:

* **value** - The current value of the attribute, after any potential expressions and
          inheritance have been performed.
* **inheritedfrom** - Present and set if the current value is derived from a group
                  level attribute rather than directly set on the node.
* **expression** - Present and set if the current value is calculated from an expression

### **Viewing hardware health: /nodes/[nodename]/health/hardware**

An overall assessment of the health of the hardware associated with a node.
It provides a 'health' field summarizing the most severe detected state, as
well as a 'sensors' list of relevant readings to explain the reason for the
health assessment.  The content of the sensors is identical to the items in
'/sensors'

### **Viewing hardware information: /nodes/[nodename]/inventory/hardware/[category]/**   

A list of hardware devices that are possible, their presence, and associated data. 

Categories currently supported are:

* **all** - This is currently the only supported category, listing all hardware
            inventories. More categories may be added in the future.

The hardware inventory data is a list of objects with the following fields:    

* **name** - A human friendly name describing the item
* **information** - A set of free-form key-value structured information about
                the inventory item.  Though free-form, similar devices should
                resemble each other to the extent feasible.
* **present** - A true/false value indicated whether the specified device actually
            is populated in this specific node.

### **Viewing firmware information: /nodes/[nodename]/inventory/firmware/[category]/** 

Items containing firmware, and the current version information. 

Categories currently supported are:

* **all** - Lists all firmware items and their current version information.
* **updates/active** - A collection of firmware updates currently in progress.
                      Will hold this information after update completion until removed.

The firmware data may contain: 

* **date** - The date that the firmware was created by the vendor
* **version** - The version designation as indicated by the vendor
* **build** - A freeform build identification string vendors may use to more
          fully describe firmware.  For example, 1.2 may mean different things
          on different products, but a vendor may elect to have unique build ids
          to embed the product family into a single value, without worrying
          about making clear what version is newer than another, as is the case
          with version


### **Viewing log of hardware events: /nodes/[nodename]/events/hardware/log**

An enumeration of events and timestamps that have happened to the indicated node.
Each event has:

* **component** - A textual description of a physical or logical entity related to
              the event. For example, "Progress", "Host Power", "Non Auth DIMMs"
* **component_type** - A description of what type of entity the component is.
                      Examples are: "System Firmware", "Power Unit" and "Memory"
* **event** - A text description of the event that occured
* **id** - A numerical value representing the id, useful for looking up the id
       against a database
* **record_id** - An identifier associated with the event by the providing device 
* **severity** - An assessment of any health state changes that would be caused by
             this event.  The values are the same as the 'health' values.
* **timestamp** - When available, ISO-8601 timestamp of when the event happened,
              in local time relative to the confluent server.


### **Decoding alert data: /nodes/[nodename]/events/hardware/decode**

This provides a facility for decoding and enriching alert data from a target.
For example, an SNMP trap handler can use this to decode a PET alert from an   <!-- Document further. Also what does this mean -->
IPMI source.  TODO: Document this further                  


### **Managing physical and virtual media: /nodes/[nodename]/media/[argument]**

Manage physical and virtual media, such as a USB, CD, or iso image.

Arguments include:

* **current** - A collection of all uploaded and attached media
* **uploads** - Manages process of uploading media to management controller for use in OS.
                Will list current and completed uploads, until told to delete.
* **attach** - Requests that BMC connect to another server and associate that URL with a media device,   <!-- Arguments needed? -->
                instructing BMC to use the file at the URL
* **detach** - Detaches attached media or deletes an uploaded image or file
