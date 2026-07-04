---
title: Home
---

# Confluent

Confluent handles the essential bootstrap and day-to-day operation of scale-out
server configurations. It deploys operating systems, controls hardware, manages
consoles, gathers telemetry, and onboards new devices across clusters ranging
from a handful of nodes to many thousands. Confluent supports both x86_64 and
arm64 (aarch64) architectures.

Confluent is the modern successor of [xCAT](https://github.com/xcat2/xcat-core).
If you are coming from xCAT, see
[Confluent vs. xCAT](miscellaneous/confluentvxcat.md).

[Get started :material-rocket-launch:](getting_started/confluentquickstart_el8.md){ .md-button .md-button--primary }
[Download :material-download:](downloads.md){ .md-button }

## Where to begin

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } **Get started**

    ---

    Install confluent and take a single example flow from a bare management
    server to a deployed cluster.

    [:octicons-arrow-right-24: Quickstart (Enterprise Linux)](getting_started/confluentquickstart_el8.md)

-   :material-server:{ .lg .middle } **Install**

    ---

    Set up the confluent management server on your distribution of choice and
    open the required firewall ports.

    [:octicons-arrow-right-24: Red Hat / Alma / Rocky](getting_started/installconfluent_rhel.md)

    [:octicons-arrow-right-24: Ubuntu](getting_started/installconfluent_ubuntu.md)

    [:octicons-arrow-right-24: SUSE](getting_started/installconfluent_suse.md)

-   :material-harddisk:{ .lg .middle } **Deploy operating systems**

    ---

    Provision stateful and stateless images over PXE, HTTP(S) boot, or virtual
    media, with customization at every phase.

    [:octicons-arrow-right-24: OS deployment](user_reference/osdeploy.md)

    [:octicons-arrow-right-24: Diskless / stateless](miscellaneous/confluentdiskless.md)

-   :material-tune:{ .lg .middle } **Reference**

    ---

    The building blocks you use every day: node attributes, the noderange
    language, and attribute expressions.

    [:octicons-arrow-right-24: Node attributes](user_reference/node_attributes.md)

    [:octicons-arrow-right-24: Noderange syntax](user_reference/noderange.md)

    [:octicons-arrow-right-24: Attribute expressions](user_reference/attributeexpressions.md)

-   :material-radar:{ .lg .middle } **Discover & onboard**

    ---

    Detect generic PXE systems or hardware managers, then onboard them
    by serial number, MAC, switch port, or physical location.
    
    [:octicons-arrow-right-24: Discovery](user_reference/confluentdiscovery.md)

    [:octicons-arrow-right-24: PXE boot](advanced_topics/confluentswitchdisco.md)

    [:octicons-arrow-right-24: Switch based](miscellaneous/confluentpxedisco.md)

-   :material-code-braces:{ .lg .middle } **Automate**

    ---

    Drive confluent from the REST API, the Python client library, the
    filesystem-like `confetty` browser or backup and restore its database.

    [:octicons-arrow-right-24: API documentation](developer/api.md)

    [:octicons-arrow-right-24: Backup and restore](miscellaneous/confluentbackup.md)

</div>

## What confluent does

<div class="grid cards" markdown>

-   :material-console-line:{ .lg .middle } __Console management__

    Arbitrate multi-user access with full, fine-grained timestamped logging and
    VT-aware buffering, so a console reconnect reconstitutes cleanly.

-   :material-power:{ .lg .middle } __Hardware control__

    Power, next-boot device, BIOS/UEFI/BMC settings, storage controllers
    (RAID), health checks, telemetry, virtual media, and support data over
    IPMI, Redfish, and vendor plugins.

-   :material-lan:{ .lg .middle } __Network topology__

    Centralized access to MAC address tables and LLDP information across every
    switch through one interface.

-   :material-arrow-expand-all:{ .lg .middle } __Scale & availability__

    Group inheritance and formulaic attribute derivation, plus collective mode
    to span one confluent interface across servers for HA and large fleets.

</div>

## Security by default

Confluent is designed with secure default behaviors and explicit opt-in to
reduced security:

- Fully validated TLS protects collective, deployment, and hardware management
  traffic.
- TPM2 can protect boot volumes and persist node trust across reboots in
  stateless environments.
- Node authentication options balance convenience against hardening for
  sensitive data such as the encrypted root password.
- An SSH PKI strategy enables convenient SSH without users curating their own
  keys or updating `known_hosts`.
- Secure Boot is supported for media and HTTP boot methods.

See [TLS configuration](miscellaneous/tlsdesign.md),
[SSH design](miscellaneous/sshdesign.md), and
[OS deployment security](miscellaneous/osdeploysecurity.md) for details.

## Ways to drive confluent

- A collection of straightforward Linux commands (`nodepower`, `nodeconsole`,
  `nodedeploy`, `nodeattrib`, ...).
- A command-line API browser, `confetty`, that works like browsing a filesystem.
- A Python client library.
- A REST API over HTTP.

## Installation paths

There are two suggested approaches:

- **Confluent directly** *(recommended)* — best for most users, especially
  those without an existing xCAT installation.
- **xCAT and confluent together** — when you rely on an xCAT-exclusive features
  and want to use it alongside confluent. Start with the xCAT material under
  [Advanced topics](advanced_topics/xcatconfluentsetup.md).

!!! tip
    Looking for something specific? Use the search box at the top of the page.
