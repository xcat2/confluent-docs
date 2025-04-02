# Home

## Confluent

Confluent is a software package to handle essential bootstrap and operation of scale-out
server configurations. It incorporates a variety of functions relevant to that end:

## Features

* Console Management
    * Arbitrate multi-user access
    * Full logging with fine grained timestamps
    * VT-aware buffering for quality reconstitution of a console after reconnect
* Hardware Control: Essential operations using ipmi, redfish, and/or implementation specific plugins to implement features including:
    * Power on/off
    * Set next boot device (e.g. force network boot)
    * Configure BIOS/UEFI/BMC settings
    * Configure hardware storage controllers (e.g. create/delete raid arrays and set drive usage)
    * Health check
    * Telemetry (temperature, voltages, power, energy, etc)
    * Virtual USB device mount management
    * Retrieve support data
* OS Deployment including:
    * Stateless images and stateful OS deployment
    * Sample profiles for ESXi 6.7/7.0, RedHat/CentOS/Alma/Rocky 7.x/8.x/9.x, SuSE 15.x, RHV-H 4.3/4.4 and Ubuntu 20.04/22.04/24.04
    * Deployment over PXE, HTTP(S)boot, or removable media (real or virtual)
    * Does not require a DHCP server, nor does it conflict with an external DHCP server for all deployment methods
    * Support customization during phases of deployment (e.g. post, firstboot, onboot) by local commands or automatically launched remote ansible playbooks.
* Centralized access to network topology information
    * Access mac address table and lldp information across all switches in one interface
* Rich device on-boarding capabilities
    * Detect generic PXE systems and Lenovo hardware management devices at a glance
    * Rapidly onboard devices manually, based on data such as serial number or mac address, or based on where things are physically plugged in to chassis or switches.
* Scalability and Availability
    * Powerful noderange syntax to describe target systems simply but with great flexibility
    * An attribute database with group inheritance and formulaic attribute derivation for structured data-centers
    * Collective mode enables scaling a single confluent interface across multiple servers or virtual machines for HA and/or to manage thousands of systems
    * Tools to quickly analyze data and highlight inconsistencies or to do quick statistical analysis
* Security
    * Designed with secure default behaviors with opt-in to reduced security
    * Use of fully validated TLS to protect collective, deployment and hardware management
    * Take advantage of TPM2 to protect boot volumes for supported profiles
    * Use TPM2 to persist node trust across reboots in stateless environments
    * Node authentication options to balance convenience versus hardening to protect potentially sensitive data such as encrypted root password
    * SSH PKI strategy to securely enable convenient SSH without users having to self-curate SSH keys or having to update known_hosts
    * SecureBoot is supported for media and HTTP boot methods
* Flexible usage scenarios
    * Collection of straightforward Linux commands
    * Command line API browser that is like browsing a file-system
    * Python client library
    * REST API over HTTP

## Installation

Generally speaking, there are two suggested approaches:

* Using confluent - It is strongly recommended for most of those without existing xCAT installations to use confluent directly.
* Using xCAT and confluent together (not recommended) - When you are used to xCAT or another currently xCAT exclusive feature and want to use it in conjunction with confluent.  For this situation, start with the xCAT documentation under Advanced topics.

!!! note
    For specific topics, it may be easier to use the Search function of this site.
