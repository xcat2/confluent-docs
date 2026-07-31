---
title: Firewall and Network Ports
tags:
  - networking
  - installation
---

The confluent server binds a small, fixed set of ports. Most of what a deployment needs on the wire is served by other
daemons on the same machine: the web server, a TFTP server, and optionally DNS, NTP and a log receiver. This page
lists every port involved and gives worked `firewalld` and `ufw` configurations for them.

As described in the [architecture overview](architecture.md), a confluent server normally reaches three separate
networks, and which one a port belongs on matters as much as the port number:

* **External**, where administrators and the API live.
* **Deployment**, carrying the operating system NICs of the nodes. Network boot and OS installation happen here.
* **BMC**, a dedicated and fully isolated hardware management network carrying the BMCs, PDUs and the management
  ports of switches. Discovery and out-of-band control happen here.

Clusters usually have a fourth, **high speed** network as well, an InfiniBand, OmniPath or fast RoCE fabric used for
traffic between compute nodes and to parallel storage. Confluent needs nothing open there unless you also deploy
over it.

The deployment and BMC networks are normally completely separate from each other. The tables below name the network
each port belongs to.

## Ports bound by the confluent server

These are opened by `confluentd` itself.

| Port | Protocol | Network | Purpose |
| ---- | -------- | ------- | ------- |
| 13001 | TCP | Deployment | Node credential handout during deployment, TLS client API, and [collective](../advanced_topics/collective.md) peer traffic |
| 67 | UDP | Deployment | DHCPv4 and PXE |
| 547 | UDP | Deployment | DHCPv6, for network boot over IPv6 |
| 4011 | UDP | Deployment | ProxyDHCP, for booting alongside an independent DHCP server |
| 427 | UDP | BMC | SLP [hardware discovery](../user_reference/confluentdiscovery.md) |
| 1900 | UDP | BMC, deployment | SSDP. BMCs are discovered with it, and deploying nodes use it to find their confluent server |

!!! note
    Port 13001 carries three things: deploying nodes collecting their credentials and API key (the mechanism that arms
    a node for deployment), clients such as `confetty` and `nodeshell` using the TLS API, and collective members
    reaching each other. The listener only starts once `/etc/confluent/srvcert.pem` exists, which
    `osdeploy initialize` creates.

The following are bound by confluent as well, but are not opened by the rules further down:

| Port | Protocol | Purpose | Why it is not opened |
| ---- | -------- | ------- | -------------------- |
| 4005 | TCP | HTTP API | Listens on `127.0.0.1` unless `[http] bindhost` in `/etc/confluent/service.cfg` moves it. External access normally goes through the web server on 443 |
| 3900 and up | TCP | Web UI BMC forwarding | Only needed for browser access to BMC web interfaces and KVM. See [Web UI forwarding](#web-ui-forwarding-optional) |

## Ports served by other daemons

| Port | Protocol | Network | Daemon | Needed for |
| ---- | -------- | ------- | ------ | ---------- |
| 443 | TCP | Deployment, and external if the web interface is used | httpd or nginx | Always on the deployment network: the reverse proxy in front of confluent, the deployment payload, and the node API |
| 80 | TCP | Deployment | httpd or nginx | PXE boot, always. UEFI HTTP boot only when `deployment.useinsecureprotocols` is set |
| 69 | UDP | Deployment | tftpd | PXE boot. Confluent has no built-in TFTP server, it only stages the iPXE binaries |
| 22 | TCP | External | sshd | Administrative access, and node to server access if `osdeploy initialize -l` was used |
| 53 | TCP and UDP | Deployment | dnsmasq or named | Optional. Only if this server resolves for the cluster, see [DNS and DHCP with dnsmasq](#dns-and-dhcp-with-dnsmasq-optional) |
| 123 | UDP | Deployment | chronyd or ntpd | Optional. Only if this server is the cluster time source rather than an upstream one |
| 514 | TCP | Deployment | rsyslog | Optional. `logging.method=rsyslog` without TLS, see [node log forwarding](#node-log-forwarding-optional) |
| 6514 | TCP | Deployment | rsyslog | Optional. `logging.method=rsyslog` with `logging.tls` |
| 19532 | TCP | Deployment | systemd-journal-remote | Optional. `logging.method=journal-remote` |
| 2049, 111 | TCP | Deployment | nfsd, rpcbind | Optional. Only if this server exports NFS for shared collective state or node media |

!!! warning
    Plain HTTP on port 80 is required for PXE boot, not optional. Confluent declines to answer a PXE boot request
    unless `deployment.useinsecureprotocols` is set to `firmware` or `always`, and the iPXE chainload URL it then
    hands out is plain `http://`. The whole early boot payload follows over the same port: `boot.ipxe`, the kernel
    and the initramfs. Only once the installer is running does the node switch to HTTPS for the API. UEFI HTTP boot
    is the path that can stay on HTTPS only, by leaving `deployment.useinsecureprotocols` at its default of `never`.

### DNS and DHCP with dnsmasq (optional)

Confluent answers DHCP and PXE itself and needs no DNS server, so port 53 is only required if you choose to run one.
[`confluent2dnsmasq`](../manuals/confluent2dnsmasq.md) and [`confluent2hosts`](../manuals/confluent2hosts.md) can
generate its configuration from the node attribute database. See
[Confluent and DHCP interaction](confluentdhcp.md).

`dnsmasq` then binds port 67 alongside confluent. `confluent2dnsmasq` emits `bind-dynamic` by default so the two can
share it. Without that, confluent cannot bind the DHCP port and stops answering boot requests.

### Node log forwarding (optional)

Nodes forward their logs to the server only when `logging.servers` is set. Leave it unset and none of 514, 6514 or
19532 is needed. The transport depends on `logging.method` and `logging.tls`, so only one of the three is normally in
use. Certificates for the TLS transports are renewed by a daily timer on each node that calls back over HTTPS, so
port 443 stays in use long after deployment finishes.

### Collective (optional)

[Collective](../advanced_topics/collective.md) members reach each other on port 13001, the same port used for the
client API, authenticated with mutual TLS. No additional port is needed to form or run a collective. If members share
state over NFS rather than a synchronized local filesystem, the NFS ports apply as well.

## Outbound connections

Almost all of these go out over the BMC network. They rarely need rules on the server itself, since outgoing traffic
is permitted by default, but they matter for any ACL between the server and the BMC network.

| Port | Protocol | Network | Purpose |
| ---- | -------- | ------- | ------- |
| 443 | TCP | BMC | Redfish, BMC web interfaces, switches, PDUs |
| 623 | UDP | BMC | IPMI, including serial-over-LAN console |
| 161 | UDP | BMC | SNMP, used to read switch MAC address tables for [switch based discovery](../user_reference/switchportattribs.md) |
| 3900 | TCP | BMC | BMC KVM video, when relaying to a browser |
| 8006 | TCP | BMC | Proxmox VE API, for [Proxmox managed nodes](proxmoxguide.md) |
| 22 | TCP | Deployment | `nodeshell`, `nodersync`, Ansible, and file synchronization to deployed nodes |

## Configuring the firewall

The examples below cover `firewalld` (used on Enterprise Linux and SUSE) and `ufw` (used on Ubuntu and Debian). Each
port is opened with a built-in service where one matches it exactly, and by number otherwise.

=== "firewalld"

    Assign each interface to a zone and add the rules there. Without an explicit `--zone`, `firewall-cmd` writes to
    the default zone, which would open the deployment ports on your external interface too. Substitute your own
    interface names:

    ```bash
    # external: administration only
    firewall-cmd --permanent --zone=public --change-interface=eno1
    firewall-cmd --permanent --zone=public --add-service=ssh        # 22/tcp, administrative access

    # deployment: the ports confluent binds, plus the web server
    firewall-cmd --permanent --zone=internal --change-interface=eno2
    firewall-cmd --permanent --zone=internal --add-port=13001/tcp   # confluent API and node credential handout
    firewall-cmd --permanent --zone=internal --add-service=dhcp     # 67/udp, DHCPv4, for network boot
    firewall-cmd --permanent --zone=internal --add-port=1900/udp    # SSDP, discovery and nodes finding the server
    firewall-cmd --permanent --zone=internal --add-service=https    # 443/tcp, deployment payload and node API

    # BMC: trusted, see below
    firewall-cmd --permanent --zone=trusted --change-interface=eno3

    firewall-cmd --reload
    ```

    The remaining boot ports depend on how the nodes boot. Add whichever apply:

    ```bash
    firewall-cmd --permanent --zone=internal --add-service=http     # 80/tcp, PXE boot
    firewall-cmd --permanent --zone=internal --add-service=tftp     # 69/udp, PXE boot
    firewall-cmd --permanent --zone=internal --add-service=dhcpv6   # 547/udp, network boot over IPv6
    firewall-cmd --permanent --zone=internal --add-port=4011/udp    # ProxyDHCP, with a separate DHCP server
    firewall-cmd --reload
    ```

    Port 1900 is opened by number rather than with the built-in `ssdp` service deliberately, and SLP on 427/udp needs
    no rule at all here because the BMC interface is trusted. Both are explained under
    [Discovery needs more than open ports](#discovery-needs-more-than-open-ports). If you do not trust that
    interface, add `--add-service=slp` to its zone instead, bearing in mind that the built-in service also opens
    427/tcp, which confluent does not use.

    Add `--zone=public --add-service=https` as well if you use the web interface. Optional cluster services belong in
    the deployment zone:

    ```bash
    firewall-cmd --permanent --zone=internal --add-service=dns      # 53, only if this server resolves for the cluster
    firewall-cmd --permanent --zone=internal --add-service=ntp      # 123/udp, only if this server is the time source
    firewall-cmd --reload
    ```

    [Node log forwarding](#node-log-forwarding-optional) needs only the port of the transport actually in use:

    ```bash
    firewall-cmd --permanent --zone=internal --add-port=514/tcp     # syslog, logging.method=rsyslog without TLS
    firewall-cmd --permanent --zone=internal --add-port=6514/tcp    # syslog over TLS, rsyslog with logging.tls
    firewall-cmd --permanent --zone=internal --add-port=19532/tcp   # logging.method=journal-remote
    firewall-cmd --reload
    ```

    The built-in `syslog` and `syslog-tls` services do not fit these: `syslog` opens 514/udp while the receiver
    listens on 514/tcp, and `syslog-tls` opens 6514/udp alongside the tcp port.

    !!! note
        The `internal` zone is used here simply as a second zone distinct from `public`. It ships with `mdns` and
        `samba-client` enabled, which a deployment network does not need. Remove them with
        `firewall-cmd --permanent --zone=internal --remove-service=mdns` and likewise for `samba-client`.

=== "ufw"

    Ubuntu ships `ufw`, inactive by default, so nothing here applies unless you enable it. It has an application
    profile for OpenSSH and, once Apache is installed, for the web server. The ports confluent binds are allowed by
    number. `ufw app list` shows which profiles are present on your system.

    Scope each rule to an interface with `in on`. A bare `ufw allow` applies to every interface, which would open the
    deployment ports externally too. Allow SSH before enabling `ufw`, or enabling it will end your session.
    Substitute your own interface names:

    ```bash
    # external: administration only
    ufw allow in on eno1 to any app OpenSSH           # 22/tcp, administrative access

    # deployment: the ports confluent binds, plus the web server
    ufw allow in on eno2 to any port 13001 proto tcp  # confluent API and node credential handout
    ufw allow in on eno2 to any port 67 proto udp     # DHCPv4, for network boot
    ufw allow in on eno2 to any port 1900 proto udp   # SSDP, discovery and nodes finding the server
    ufw allow in on eno2 to any app 'Apache Secure'   # 443/tcp, deployment payload and node API

    # BMC: trusted, see below
    ufw allow in on eno3

    ufw enable
    ```

    The remaining boot ports depend on how the nodes boot. Add whichever apply:

    ```bash
    ufw allow in on eno2 to any app 'Apache'          # 80/tcp, PXE boot
    ufw allow in on eno2 to any port 69 proto udp     # TFTP, PXE boot
    ufw allow in on eno2 to any port 547 proto udp    # DHCPv6, network boot over IPv6
    ufw allow in on eno2 to any port 4011 proto udp   # ProxyDHCP, with a separate DHCP server
    ```

    `Apache Secure` covers port 443 and `Apache` port 80. Add `Apache Secure` on `eno1` as well if you use the web
    interface. TFTP has no profile of its own, hence the explicit `69/udp`. Note that `app` requires a `to` or
    `from`, so `to any` is not optional here. SLP on 427/udp arrives on the BMC interface, which is allowed wholesale
    above. If you do not trust that interface, replace its rule with
    `ufw allow in on eno3 to any port 427 proto udp`. Optional cluster services belong on the deployment interface:

    ```bash
    ufw allow in on eno2 to any port 53               # DNS, only if this server resolves for the cluster
    ufw allow in on eno2 to any port 123 proto udp    # NTP, only if this server is the cluster time source
    ```

    [Node log forwarding](#node-log-forwarding-optional) needs only the port of the transport actually in use:

    ```bash
    ufw allow in on eno2 to any port 514 proto tcp    # syslog, logging.method=rsyslog without TLS
    ufw allow in on eno2 to any port 6514 proto tcp   # syslog over TLS, rsyslog with logging.tls
    ufw allow in on eno2 to any port 19532 proto tcp  # logging.method=journal-remote
    ```

    !!! warning
        `ufw` denies routed traffic by default, so if this server also routes or NATs for its deployment network,
        that stops the moment you enable it. Permit the forwarding you need explicitly, naming your own interfaces:

        ```bash
        ufw route allow in on eno2 out on eno1
        ```

        `firewalld` permits forwarding within a zone by default and needs no equivalent rule.

## Discovery needs more than open ports

Opening 427 and 1900 is enough to receive discovery traffic that nodes and BMCs send to the server. It is not enough
for confluent's own active scans. Those go out to multicast and broadcast addresses, and the answers come back as
unicast packets from a different address than the request was sent to, which connection tracking does not associate
with the outgoing request. The replies are therefore dropped as unsolicited.

Opening a fixed port does not help either: each scan sends from a freshly allocated source port, so there is no
stable port to allow.

This affects the **BMC network** above all, because that is where the devices confluent scans for actually live, and
it is also the one network where trusting an interface is genuinely safe.

### Which device sits on which network

A confluent server typically has three interfaces, and what decides the firewall treatment is not how private the
network looks but **who can put a packet on the wire**:

| Interface | Network | Who can send from it | Treatment |
| --------- | ------- | -------------------- | --------- |
| `eno1` | External, for example `10.1.0.0/24`, routed to the rest of your site | Everyone at your site, plus your gateway, corporate DNS, LDAP, NTP and monitoring | Restricted: 22 for administration, and 443 only if the optional web interface is used |
| `eno2` | Deployment, for example `172.30.1.0/24`, private and unrouted | The nodes, and therefore **every user with a shell on a node** | Restricted: the port rules only, never trusted |
| `eno3` | BMC, for example `172.30.2.0/24`, isolated | Only BMCs, PDUs and switch management ports. No user reaches it, and admins normally only through the confluent server | Trusted, so discovery replies arrive |
| `ib0` | High speed (optional), an InfiniBand, OmniPath or RoCE fabric | The nodes, as on the deployment network | None. No confluent port belongs here, unless you deploy over it, in which case the deployment rules apply |

Putting the BMC interface in the `trusted` zone, as
[Configuring the firewall](#configuring-the-firewall) already does, is what makes active discovery work. No
additional rule is needed. If you cannot trust it, see
[Matching scan replies with an ipset](#matching-scan-replies-with-an-ipset) below.

!!! warning
    Do not give the deployment interface the same treatment. Anyone with a shell on a node can send packets from
    that network, so trusting it would expose every service on the server to every cluster user, not just
    confluent's ports. Leave it on the port rules from
    [Configuring the firewall](#configuring-the-firewall).

    It does not need trusting anyway: traffic arriving there is node-initiated, so a deploying node's SSDP search and
    the server's reply are part of one exchange that connection tracking already permits. Active scanning of the
    deployment network, as used by [PXE driven discovery](confluentpxedisco.md), is the exception. If you need it,
    exempt only the addresses you actually scan rather than the whole interface:

    === "firewalld"

        ```bash
        firewall-cmd --permanent --zone=trusted --add-source=172.30.1.0/24   # the scanned deployment subnet
        firewall-cmd --reload
        ```

    === "ufw"

        ```bash
        ufw allow from 172.30.1.0/24   # the scanned deployment subnet
        ```

    That is still broad if users have shells on those nodes. Where it is not acceptable, either match the replies
    with [an ipset](#matching-scan-replies-with-an-ipset) or keep the port rules and accept that active scans will
    not see replies: discovery then relies on devices announcing themselves, which BMCs do when they power on,
    rather than on confluent polling for them.

!!! note
    Do not narrow SSDP down to the multicast destination address. The `ssdp` service that ships with `firewalld`
    restricts traffic to `239.255.255.250` and `ff02::c`, but a node searching for its deployment server also sends
    to the subnet broadcast address and directly to the server's own address. With the built-in service in place only
    the multicast search is answered, and the broadcast and unicast searches are dropped. That is why
    [Configuring the firewall](#configuring-the-firewall) opens port 1900 by number rather than adding the built-in
    service.

### Matching scan replies with an ipset

Where trusting the BMC interface is not acceptable, `firewalld` can single out the replies instead. The rules below
record the source address and port of each outgoing scan in an ipset for three seconds, and accept the packets that
come back to it. The discovery ports themselves are opened by
[Configuring the firewall](#configuring-the-firewall), and these rules only add the replies.

```bash
firewall-cmd --permanent --new-ipset=confluentv4 --type=hash:ip,port --option timeout=3
firewall-cmd --permanent --new-ipset=confluentv6 --type=hash:ip,port --option timeout=3 --family inet6
firewall-cmd --reload
firewall-cmd --permanent --direct --add-rule ipv6 filter OUTPUT 1 -p udp -m udp --dport 427 -j SET --add-set confluentv6 src,src --exist
firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 1 -p udp -m udp --dport 427 -j SET --add-set confluentv4 src,src --exist
firewall-cmd --permanent --direct --add-rule ipv6 filter OUTPUT 1 -p udp -m udp --dport 1900 -j SET --add-set confluentv6 src,src --exist
firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 1 -p udp -m udp --dport 1900 -j SET --add-set confluentv4 src,src --exist
firewall-cmd --permanent --direct --add-rule ipv4 filter INPUT 1 -p udp -m set --match-set confluentv4 dst,dst -j ACCEPT
firewall-cmd --permanent --direct --add-rule ipv6 filter INPUT 1 -p udp -m set --match-set confluentv6 dst,dst -j ACCEPT
firewall-cmd --reload
```

!!! warning
    This only works with `FirewallBackend=iptables` set in `/etc/firewalld/firewalld.conf`. Direct rules are always
    iptables rules, whatever the backend, but under the default `nftables` backend firewalld evaluates its own rules
    after them, so the `ACCEPT` above does not stop the zone from dropping the reply afterwards.

    Both mechanisms are on the way out: `firewalld` documents the iptables backend and the direct interface as
    deprecated and slated for removal. Prefer the `trusted` zone where you can.

## Web UI forwarding (optional)

The web interface can proxy a node's BMC web interface and remote console through the confluent server, so browsers do
not need direct access to the BMC network. Port 3900 relays KVM video, and one further port starting at 3901 is
allocated for each concurrent BMC session. There is no fixed upper bound, so size a range to the number of sessions
you expect to have open at once.

These ports face the browser, so they belong on the external interface rather than the deployment one:

=== "firewalld"

    ```bash
    firewall-cmd --permanent --zone=public --add-port=3900-3999/tcp   # KVM video plus one port per BMC session
    firewall-cmd --reload
    ```

=== "ufw"

    ```bash
    ufw allow in on eno1 to any port 3900:3999 proto tcp   # KVM video plus one port per BMC session
    ```

## SELinux

On distributions with SELinux enforcing, the web server needs permission to connect to confluent over the network:

```bash
setsebool -P httpd_can_network_connect=on
```

Without this, the reverse proxy on port 443 cannot reach the confluent API, and the web interface and node deployment
both fail even though the firewall is correct.
