---
layout: page
title: Confluent API Documentation
permalink: /documentation/developer/api.html
exclude: true
---

Confluent models functionality in a hierarchical structure.  It is a RESTful or
filesystem like structure, depending on how you want to think of it.  With
respect to REST there are a couple of exceptional resources that are not
strictly RESTful, which shall be explained.

This document will review the available resources as they are structured.
It is suggested to browse the API using confetty (without arguments) or using
a web browser pointed at http://[mgt]:4005/ (once remote HTTP usage has been
  enabled)

## Enabling remote usage over HTTP
By default, confluent API is only accessible locally over a unix domain socket.
To enable a remote user for HTTP access, the quickest method is to use confetty
to create a local account:

    # confetty create /users/apiuser password=apipassword

With the above example, using 'apiuser' and 'apibrowser' in the user/password
prompt will provide access.

## /noderange/

The noderange top level structure appears empty.  However, if the client
requests a subcollection, it will try to auto-create a matching collection
based on the confluent noderange syntax.  Strictly speaking, this is not
RESTful, but consider it as an auto-mounting filesystem.  For a given
collection, the structure of a 'nodes/' is reproduced, but are considered
to apply to all nodes matching the noderange rather than just one.
Additionally, a noderange has a 'nodes/' sub collection to allow client software
to list the nodes that match the noderange.

## /nodes/

The nodes collection lists all defined nodes in confluent.  Every operation
that can be done against a node is represented in the nodes collection.
Functionality is further subdivided into categories under the top level
nodes location for a given node

## /nodes/[nodename]/shell/sessions/

This is a non-RESTful resource, used to create a stateful ssh session suitable
for use in a web browser.  See the source of consolewindow.js for an example of
how to interact.  RESTful style interaction allows listing currently active
shell sessions, but the primary role of translating HTTP to SSH is not something
that fits the RESTful models

## /nodes/[nodename]/power/state

This resource allows query and setting of the power state.  Reading this value
provides the current state, and writing {'state': [newstate]} will request a
state change.  The recognized states are:

* boot - Request system to take appropriate action to immediately start booting.
         If a system is on, this is effectively 'reset'.  If a system is off, it
         has the same effect as 'on'
* on - Request system to be on.  Has no effect if system is already on.
* off - Request system to be off, without waiting for OS to shutdown.  This is
        an immediate power down.  Has no effect if system is already off
* reset - Request a running system to immediately start booting without regard
          for current OS.  This has no effect with the system off.
* shutdown - Send a request to the running OS to gracefully shutdown.  This
            returns asynchronously to notify that the request has been relayed,
            but has no guarantee that the OS will react or that the OS will
            react as desired (e.g. an OS could present a shutdown dialog on
            console, or ignore such requests completely)

## /nodes/[nodename]/identify

This controls the behavior of the server to provide a means of making its
physical location known.  Generally, this is an LED that illuminates on request.
Sending {'identify': [newstate]} requests activation/deactivation of the LED.
It is common for this data not to be readable, so querying the value is not
generally promised to produce useful information (the server would return an
empty value in such a case).

* on - The LED is illuminated (in some implementations, it will blink)
* off -The LED is deactivated

## /nodes/[nodename]/sensors/hardware/[category]/

This presents a collection of 'sensors' relevant to a node.  These are
current point-in-time indication of both numeric values (e.g. wattage, fanspeed,
temperature) and discrete states (missing hard drive, failed DIMM).  sensors
include the following fields:

* health - An assessment of whether the value should be considered normal or a
           concern.  The following states are declared:
  * ok - Sensor indicates no problem
  * warning - Sensor indicates an abnormal condition exists, but not
             one that is currently impacting workload.  For example,
             excess correctable memory errors.
  * critical - Sensor indicates a severe problem exists that is
              impacting workload or presents an imminent risk
              of catastrophic data loss.  For example, a degraded
              RAID array
  * failed - Indicates a severe problem that has caused disruption of
            resource or data loss.  For example, a fatal memory error
            resulting in a reboot, or loss of non-redundant storage.
* name - A string identifying the sensors
* state_ids - Numeric values representing the observed states.  Generally
              this field can be ignored.
* states - A list of textual descriptions of currently active states.  Examples
           include Present, Failed, Non-Redundant, and are intended to be
           self-explanatory and can be presented directly to an administrator
           without processing.  Progrmatic understanding of the severity is
           acheived through examining the 'health' field above.
* units -  Optional indicator of the units to use when evaluating 'value' field
* value - A numeric value representing the current reading of the sensors.  It
          is null when the sensor is a non-numeric sensor.

## /nodes/[nodename]/configuration/

This is where the ability to view and manipulate various configuration active on
the node.  This is distinguished from 'attributes' which are values stored
about the node by confluent, but are not directly active on the system.

### /nodes/[nodename]/configuration/management_controller/reset

This can be used to request the management controller for the node be reset.
PUT {'state': 'reset'} in order to initiate a restart of the management
controller

### /nodes/[nodename]/configuration/management_controller/users/

This is a list of accounts considered local to the management controller.  This
excludes accounts provided by a central authentication provider, such as LDAP.
It is indexed by an arbitrary index value that might not correlate to user names.
For IPMI systems, it represents the 'user slot' of the user account.  Each account
provides the following fields:

* username - The username associated with this account names
* privilege_level - The level of access afforded the account:
  * user - Ability to read most sensor data
  * operator - Ability to manipulate the running system, rebooting, console access
  * administrator - Ability to change the configuration of the management controller,
                    including authentication data, ip addresses, alert destinations,
                    and so forth

### /nodes/[nodename]/configuration/management_controller/ntp/

Configure and control the NTP functionality of supported management controllers.
For management controllers implementing NTP in a manner supported by confluent,
this provides a mechanism to enable/disable as well as specify servers to use.
Note that in confluent, efforts are made to correct timestamps with detectable
systematic errors, so local time on the management controller may not necessarily
impact accuracy of data such as event log timestamps.

### /nodes/[nodename]/configuration/management_controller/alerts/destinations/

Manage the list of destinations that the management controller will *directly*
send alerts to.  Alert information may be in turn propogated by
the respective destination to more destinations and formats.  Each item contains
the following fields:

* ip - The ip address to transmit to
* retries - If acknowledge is enabled, the number of attempts to perform before
            giving up
* acknowledge_timeout - When waiting for an acknowledgement from the target,
                        how long to wait before evaluating the need to retrytime
* acknowledge - Whether to expect an explicit acknowledgement.  For example, SNMP
                traps do not have an SNMP mechanism to acknowledge receipt, so
                this would be disabled for normal SNMP traps.  However, IPMI
                PET alerts are SNMP traps, but provide a mechanism a receiver
                can use to confirm receipt.  If uncertain, this should be false
                unless otherwise indicated by the alert destination software.

### /nodes/[nodename]/configuration/management_controller/net_interfaces/management

IP configuration data for the management controller.  Note that changing this
value without coordinating changes in the associated hardwaremanagement.manager
attribute may cause disruption.  The fields available:

* ipv4_address - The ipv4 address and netmask length in CIDR notation.  this
                 should provide the current value regardless of whether it is
                 DHCP or static, but should not be PUT if the ipv4_configuration
                 is not Static.
* ipv4_configuration - The method to use to assign the IPv4 address, either
                       'Static' or 'DHCP'
* ipv4_gateway - The gateway to use for non-local traffic.  As in ipv4_address,
                 PUT is only supported for this field if 'Static'
* hw_addr - The ethernet mac address of the interface

## /nodes/[nodename]/console/session

This is a non-RESTful interface.  It provides a mechanism for javascript
code in a browser to present a terminal-in-a-browser proxying an HTTP based
protocol to the appropriate console protocol for the node.  The console is the
single, authoritatitve text based console of the node.  A node's console is
active independent of having any clients connected, and multiple clients
connecting always share a single view and input.  Upon open, a console session
may stream older data from log to client to help recreate the console.

## /nodes/[nodename]/console/license

Describes the availability of potentially licensed functionality pertaining
to remote console, for example remote graphics console is frequently a premium
feature provided at additional cost.

## /nodes/[nodename]/boot/nextdevice

Check and modify boot device override for next boot.  Frequently used for an
OS deployment or diagnostic boot to prepare for an exceptional boot case where
the default OS boot is not desired, but only for one boot.  Parameters are:

* bootmode - Allows requesting the firmware personality.  Recognized values are
  * bios - Force a BIOS style boot in the style that x86 systems have
           historically booted from their initial release
  * uefi - Force the boot to be UEFI style
  * unspecified - Allow platform to choose.
* persistent - True/False indication of whether to request the platform leave
               the override in place.  For example, a request to network boot
               with persistent set to True should reboot from network from that
               point on, rather than reverting to default boot order after next
               boot
* nextdevice - The device/psuedo device to use in the next boot attempt.  This
               is a single device and not an order of devices.  The Recognized
               devices are:
  * default - Use the usual boot sequence behavior without any overrides
  * setup - Boot the system into a configuration menu provided by firmware.
            Generally the same menu that results from pressing a special key
            during boot like 'F1'.  If this is active, no keypress during boot
            should be required.
  * network - Boot the system using a network protocol, generally PXE
  * hd - Attempt to boot straight to a hard disk in a system
  * cd - Boot from a CD/DVD/BD device.  In practice, this is frequently a
         virtual instance of a CD provided by remote media capability of a
         server.

## /nodes/[nodename]/health/hardware

An overall assessment of the health of the hardware associated with a node.
It provides a 'health' field summarizing the most severe detected state, as
well as a 'sensors' list of relevant readings to explain the reason for the
health assessment.  The content of the sensors is identical to the items in
'/sensors'

## /nodes/[nodename]/inventory/hardware/[category]/

A list of devices that are possible and whether they are present and associated
data.  The inventory field is a list of objects with the following fields:

* information - A set of free form key-value structured information about
                the inventory item.  Though free-form, similar devices should
                resemble each other to the extent feasible.
* name - A human friendly name describing the item
* present - A true/false value indicated whether the specified device actually
            is populated in this specific node.

## /nodes/[nodename]/inventory/firmware/[category]/

Items containing firmware, and the current version information.  May contain:

* date - The date that the firmware was created by the vendor
* version - The version designation as indicated by the vendor
* build - A freeform build identification string vendors may use to more
          fully describe firmware.  For example, 1.2 may mean different things
          on different products, but a vendor may elect to have unique build ids
          to embed the product family into a single value, without worrying
          about making clear what version is newer than another, as is the case
          with version

## /nodes/[nodename]/attributes/

Attributes in confluent's datastore pertaining to nodes.  This may contain
information that confluent needs to function (e.g. address of management
controllers), helpful metadata about a node (node location, admin notes), or
cached data for performance enhancement or post-mortem (last health state,
serial numbers, et al).

* all - Provide all possible attributes as well as current values
* current - Provides only those attributes that have been given values.

When doing UPDATE, all and current will behave identically.  The fields are
defined in the [attributes] document.  Each attribute has:

* value - The current value of the attribute, after any potential expressions and
          inheritance have been performed.
* inheritedfrom - Present and set if the current value is derived from a group
                  level attribute rather than directly set on the node.
* expression - Present and set if the current value is calculated from an expressions

## /nodes/[nodename]/events/hardware/log

An enumeration of events and timestamps that have happened to the indicated node.
Each event has:

* component - A textual description of a physical or logical entity related to
              the event.
* component_type - A description of what sort of entity the component is
* event - An english text description of the event that occured
* id - A numerical value representing the id, useful for looking up the id
       against a database
* record_id - An identifier associated with the event by the providing device
* severity - An assessment of any health state changes that would be caused by
             this event.  The values are the same as the 'health' values.
* timestamp - When available, ISO-8601 timestamp of when the event happened,
              in local time relative to the confluent server.

## /nodes/[nodename]/events/hardware/decode

This provides a facility for decoding and enriching alert data from a target.
For example, an SNMP trap handler can use this to decode a PET alert from an
IPMI source.  TODO: Document this further                  
