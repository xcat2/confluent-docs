---
title: Confluent Installation
tags:
  - installation
---

First add the Lenovo HPC repository appropriate to your environment according to the procedure on the [download page](../downloads.md).

## Installing the package

=== "RHEL and similar"

    Enterprise Linux 8.6, 9.0, or 10.0 and higher is required for installation.

    It is suggested to first make sure there are no updates in the repository for your existing software:

    ```bash
    yum --disablerepo=* --enablerepo=lenovo-hpc update
    ```

    At this point, the package may be installed:

    ```bash
    yum install lenovo-confluent
    ```

=== "SUSE"

    SuSE Linux Enterprise 15 SP4 or higher is currently required for installation.

    ```bash
    zypper install lenovo-confluent
    ```

=== "Ubuntu"

    Ubuntu Linux 22.04 or 24.04 is supported for installation.

    ```bash
    apt install lenovo-confluent
    ```

Next, enable it and start the confluent service:

```bash
systemctl enable confluent --now
```

At this point, source the script below for confluent command line functionality or logout and log back in.

```bash
source /etc/profile.d/confluent_env.sh
```

## Enabling http connectivity for OS Deployment, REST API usage, and the Web UI

=== "RHEL and similar"

    If you have SELinux enforcing, you need to allow `httpd` to make network
    connections:

    ```bash
    setsebool -P httpd_can_network_connect=on
    ```

    Use `osdeploy` to create the TLS certificate the web server presents:

    ```bash
    osdeploy initialize -t
    ```

    If the web server is not already started, enable the web server:

    ```bash
    systemctl enable httpd --now
    ```

    A default install also will have firewall restrictions preventing https use, and OS deployment needs a number of
    further ports. Open the ports confluent binds, alongside the web service:

    ```bash
    firewall-cmd --permanent --zone=public --add-port=13001/tcp   # confluent API and node credential handout
    firewall-cmd --permanent --zone=public --add-service=dhcp     # 67/udp, DHCPv4, for network boot
    firewall-cmd --permanent --zone=public --add-port=1900/udp    # SSDP, discovery and nodes finding the server
    firewall-cmd --permanent --zone=public --add-service=https    # 443/tcp, deployment payload, node API, web UI
    firewall-cmd --reload
    ```

    The remaining boot ports depend on how the nodes boot. Add whichever apply:

    ```bash
    firewall-cmd --permanent --zone=public --add-service=http     # 80/tcp, PXE boot
    firewall-cmd --permanent --zone=public --add-service=tftp     # 69/udp, PXE boot
    firewall-cmd --permanent --zone=public --add-service=dhcpv6   # 547/udp, network boot over IPv6
    firewall-cmd --permanent --zone=public --add-port=4011/udp    # ProxyDHCP, with a separate DHCP server
    firewall-cmd --reload
    ```

    !!! note
        This opens the ports in `public`, the default zone, which applies to every interface that is not assigned
        elsewhere. [Firewall and Network Ports](../miscellaneous/firewall.md) shows a tighter configuration that
        splits the external, deployment and BMC networks across separate zones.

    If wanting to use nginx instead of Apache, then see this [document](../advanced_topics/switchtonginx.md) for details.

=== "SUSE"

    If not otherwise enabling and configuring TLS, then the following will activate a TLS configuration:

    ```bash
    cd /etc/apache2/vhosts.d/
    cp vhost-ssl.template mySSL.conf
    ```

    Use `osdeploy` to create TLS certificate:

    ```bash
    osdeploy initialize -t
    ```

    Enable SSL on Apache:

    ```bash
    a2enmod rewrite
    a2enflag SSL
    systemctl enable apache2 --now
    ```

    If `firewalld` is active, open the ports confluent binds, along with the web service:

    ```bash
    firewall-cmd --permanent --zone=public --add-port=13001/tcp   # confluent API and node credential handout
    firewall-cmd --permanent --zone=public --add-service=dhcp     # 67/udp, DHCPv4, for network boot
    firewall-cmd --permanent --zone=public --add-port=1900/udp    # SSDP, discovery and nodes finding the server
    firewall-cmd --permanent --zone=public --add-service=https    # 443/tcp, deployment payload, node API, web UI
    firewall-cmd --reload
    ```

    The remaining boot ports depend on how the nodes boot. Add whichever apply:

    ```bash
    firewall-cmd --permanent --zone=public --add-service=http     # 80/tcp, PXE boot
    firewall-cmd --permanent --zone=public --add-service=tftp     # 69/udp, PXE boot
    firewall-cmd --permanent --zone=public --add-service=dhcpv6   # 547/udp, network boot over IPv6
    firewall-cmd --permanent --zone=public --add-port=4011/udp    # ProxyDHCP, with a separate DHCP server
    firewall-cmd --reload
    ```

    !!! note
        This opens the ports in `public`, the default zone, which applies to every interface that is not assigned
        elsewhere. [Firewall and Network Ports](../miscellaneous/firewall.md) shows a tighter configuration that
        splits the external, deployment and BMC networks across separate zones.

=== "Ubuntu"

    Prior to running `osdeploy`, it is suggested to install a tftp server to support PXE.  The following will install a tftp server
    with socket activation, which is generally adequate:

    ```bash
    apt install tftpd-hpa
    ```

    If not otherwise enabling and configuring TLS, then the following will activate a TLS configuration:

    ```bash
    a2enmod ssl
    a2ensite default-ssl.conf
    ```

    Also, enable the confluent web configuration:

    ```bash
    a2enconf confluent
    ```

    Use `osdeploy` to create TLS certificate:

    ```bash
    osdeploy initialize -t
    ```

    Ubuntu ships `ufw` inactive by default, so no firewall configuration is required unless you enable it. If you do,
    allow SSH, the ports confluent binds and the web server:

    ```bash
    ufw allow OpenSSH          # 22/tcp, administrative access
    ufw allow 13001/tcp        # confluent API and node credential handout
    ufw allow 67/udp           # DHCPv4, for network boot
    ufw allow 1900/udp         # SSDP, discovery and nodes finding the server
    ufw allow 'Apache Secure'  # 443/tcp, deployment payload, node API, web UI
    ufw enable
    ```

    The remaining boot ports depend on how the nodes boot. Add whichever apply:

    ```bash
    ufw allow 'Apache'         # 80/tcp, PXE boot
    ufw allow 69/udp           # TFTP, PXE boot
    ufw allow 547/udp          # DHCPv6, network boot over IPv6
    ufw allow 4011/udp         # ProxyDHCP, with a separate DHCP server
    ```

    !!! warning
        Allow `OpenSSH` before enabling `ufw`, or you will lose your session. Note also that `ufw` denies routed
        traffic by default, which stops this server routing for its deployment network.

    !!! note
        A bare `ufw allow` applies to every interface, including the external one.
        [Firewall and Network Ports](../miscellaneous/firewall.md) shows a tighter configuration that scopes each
        rule to the external, deployment or BMC interface it belongs on.

!!! note
    Plain http (port 80) is required for PXE boot, and the `deployment.useinsecureprotocols` attribute must be set to
    `firmware` or `always` for confluent to answer a PXE boot request at all. UEFI HTTP boot is the path that can stay
    on https only. TFTP is likewise only needed for PXE boot.

See [Firewall and Network Ports](../miscellaneous/firewall.md) for the full port reference, a more advanced
configuration that places the external, deployment and BMC networks in separate zones, and the optional DNS, NTP and
log forwarding services.

## Web UI Forwarding feature

The WebUI offers dynamic port forwarding, which relays a node's BMC web interface and remote console through the
confluent server. Port 3900 relays KVM video, and one further port starting at 3901 is allocated per concurrent BMC
session, so open a range sized to the number of sessions you expect:

These ports face the browser rather than the nodes:

```bash
firewall-cmd --permanent --zone=public --add-port=3900-3999/tcp   # KVM video plus one port per BMC session
firewall-cmd --reload
```

See [Web UI forwarding](../miscellaneous/firewall.md#web-ui-forwarding-optional) for details.

## Web UI Login

In terms of confluent itself, it is by default set up without any user access.  To enable a user that can ssh into your server to access the web interface:

```bash
confetty create /users/demouser role=admin
```

The user 'demouser' may now use his login password to access the confluent web interface as an administrator.  The available roles are:

* Administrator: Full access apart from reading 'secret.' attributes for all data and operations
* Operator: Removes the ability to change or add usernames or passwords in various contexts
* Monitor: Suitable for health check programs, unable to do anything to effect operation of systems, but can get power state, health, and sensor data.

After these steps, the GUI should be available at:

```text
https://[server]/lenovo-confluent/
```

## Preparing for discovery if firewall enabled

If wanting to use the confluent discovery capabilities and you have a firewall enabled (`firewalld`), further
firewall configuration is required. Confluent's active scans go out to multicast and broadcast addresses, and the
replies arrive as unicast packets from a different address than the request was sent to, so connection tracking does
not associate them with the outgoing request and drops them as unsolicited.

First open the discovery ports themselves:

```bash
firewall-cmd --permanent --zone=public --add-port=427/udp    # SLP, BMC discovery
firewall-cmd --permanent --zone=public --add-port=1900/udp   # SSDP, BMC and node discovery
firewall-cmd --permanent --zone=public --add-service=dhcp    # 67/udp, discovery of nodes as they boot
firewall-cmd --reload
```

That covers devices that announce themselves, such as a BMC when it powers on. Confluent's own active scans need
more: place the interface facing your BMC network in the `trusted` zone. That is safe for an isolated management
network and needs no further rules. See
[Discovery needs more than open ports](../miscellaneous/firewall.md#discovery-needs-more-than-open-ports), which
also explains why the deployment interface must not be given the same treatment.

Where trusting that interface is not acceptable, an ipset and direct rules can match the replies instead. See
[Matching scan replies with an ipset](../miscellaneous/firewall.md#matching-scan-replies-with-an-ipset).

## Getting ready to use confluent

Proceed to [configuring confluent](configureconfluent.md) for information on
adding groups and nodes.
