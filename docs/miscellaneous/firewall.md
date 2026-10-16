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
| 13001 | TCP | Deployment, and external if native TLS API clients connect there | Node credential handout during deployment, TLS client API, and [collective](../advanced_topics/collective.md) peer traffic |
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
| 22 | TCP | External, and deployment if `osdeploy initialize -l` was used | sshd | Administrative access, and node to server access if `osdeploy initialize -l` was used |
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

### Native TLS API (optional)

[Remote confluent clients](../advanced_topics/remoteconfluent.md) connect directly to TCP port 13001. If those clients
reach the server through its external address, allow that port on the external interface too. Restrict the allowance
to the client addresses or subnet, as shown in the firewall examples below. HTTPS on port 443 does not replace this
native TLS connection.

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

    Each interface gets a zone of its own. Without an explicit `--zone`, `firewall-cmd` writes to the default zone,
    which would open the deployment ports on your external interface too. Fill the zones with rules first and assign
    the interfaces last, as shown at the end of this section, so no interface ever sits in a zone that is still
    missing rules:

    ```bash
    # external: administration only
    firewall-cmd --permanent --zone=public --add-service=ssh              # 22/tcp, administrative access

    # deployment: a new, empty zone for the ports confluent binds, plus the web server
    firewall-cmd --permanent --new-zone=deployment
    firewall-cmd --permanent --zone=deployment --add-port=13001/tcp       # confluent API and node credential handout
    firewall-cmd --permanent --zone=deployment --add-service=dhcp         # 67/udp, DHCPv4, for network boot
    firewall-cmd --permanent --zone=deployment --add-port=1900/udp        # SSDP, discovery and nodes finding the server
    firewall-cmd --permanent --zone=deployment --add-service=https        # 443/tcp, deployment payload and node API
    ```

    If the nodes were set up with `osdeploy initialize -l`, they log in to this server over SSH, so allow that on the
    deployment network as well. Leaving the `public` zone takes SSH away from them otherwise:

    ```bash
    firewall-cmd --permanent --zone=deployment --add-service=ssh          # 22/tcp, node to server login
    ```

    If you use the [native TLS API](#native-tls-api-optional) externally, add this optional rule. Replace
    `10.1.0.50/32` with the client address or subnet. For IPv6 clients, use `family="ipv6"` and an IPv6 address or
    subnet in a separate rule:

    ```bash
    firewall-cmd --permanent --zone=public --add-rich-rule='rule family="ipv4" source address="10.1.0.50/32" port port="13001" protocol="tcp" accept'
    ```

    The remaining boot ports depend on how the nodes boot. Add whichever apply:

    ```bash
    firewall-cmd --permanent --zone=deployment --add-service=http         # 80/tcp, PXE boot, HTTP boot without TLS
    firewall-cmd --permanent --zone=deployment --add-service=tftp         # 69/udp, PXE boot
    firewall-cmd --permanent --zone=deployment --add-service=dhcpv6       # 547/udp, network boot over IPv6
    firewall-cmd --permanent --zone=deployment --add-service=proxy-dhcp   # 4011/udp, ProxyDHCP, with a separate DHCP server
    ```

    Port 1900 is opened by number rather than with the built-in `ssdp` service, and the BMC interface is trusted so
    that discovery works. [Discovery needs more than open ports](#discovery-needs-more-than-open-ports) explains both,
    and what to do if you cannot trust the BMC interface.

    Add `--zone=public --add-service=https` as well if you use the web interface. Optional cluster services belong in
    the deployment zone:

    ```bash
    firewall-cmd --permanent --zone=deployment --add-service=dns          # 53, only if this server resolves for the cluster
    firewall-cmd --permanent --zone=deployment --add-service=ntp          # 123/udp, only if this server is the time source
    ```

    [Node log forwarding](#node-log-forwarding-optional) needs only the port of the transport actually in use:

    ```bash
    firewall-cmd --permanent --zone=deployment --add-port=514/tcp         # syslog, logging.method=rsyslog without TLS
    firewall-cmd --permanent --zone=deployment --add-port=6514/tcp        # syslog over TLS, rsyslog with logging.tls
    firewall-cmd --permanent --zone=deployment --add-port=19532/tcp       # logging.method=journal-remote
    ```

    The built-in `syslog` and `syslog-tls` services do not fit these: `syslog` opens 514/udp while the receiver
    listens on 514/tcp, and `syslog-tls` opens 6514/udp alongside the tcp port.

    !!! warning
        `firewalld` does not forward traffic between zones by default. If this server also routes for its
        deployment network, that traffic crosses from `deployment` to `public` and is dropped. Permit it with a policy
        (firewalld 0.9 or later), and add `--zone=public --add-masquerade` as well if the deployment network is NATed:

        ```bash
        firewall-cmd --permanent --new-policy=deploy-out
        firewall-cmd --permanent --policy=deploy-out --add-ingress-zone=deployment
        firewall-cmd --permanent --policy=deploy-out --add-egress-zone=public
        firewall-cmd --permanent --policy=deploy-out --set-target=ACCEPT
        ```

    Once the zones hold every rule you need, load them and assign the interfaces. Where NetworkManager manages an
    interface, `firewall-cmd` stores the zone in its connection profile and the change takes effect at once.
    Elsewhere, such as on SUSE with wicked, firewalld keeps the assignment itself and applies it on the next reload.
    Substitute your own interface names:

    ```bash
    firewall-cmd --reload                                                 # load the rules before assigning interfaces
    firewall-cmd --permanent --zone=public --change-interface=eno1        # external
    firewall-cmd --permanent --zone=deployment --change-interface=eno2    # deployment
    firewall-cmd --permanent --zone=trusted --change-interface=eno3       # BMC, trusted, see below
    firewall-cmd --reload                                                 # apply where NetworkManager is not in use
    ```

    !!! warning
        If you opened ports in `public` while following
        [Confluent Installation](../getting_started/installconfluent.md), they stay open on the external interface
        until you remove them. Do this only after the interfaces have moved, since until then the deployment
        interface still relies on those rules. Remove both service rules and legacy numeric port rules. Keep `https`
        there only if you use the web interface. The source-restricted native TLS API rule above stays in place:

        ```bash
        for svc in https http dhcp dhcpv6 proxy-dhcp tftp; do   # leave out https if you use the web interface
            firewall-cmd --permanent --zone=public --remove-service=$svc
        done
        for port in 13001/tcp 1900/udp 427/udp 67/udp 69/udp 4011/udp 547/udp; do
            firewall-cmd --permanent --zone=public --remove-port=$port
        done
        firewall-cmd --reload
        ```

=== "ufw"

    Ubuntu ships `ufw`, inactive by default, so nothing here applies unless you enable it. Every rule names its port
    directly, so it works whichever web server you use.

    Scope each rule to an interface with `in on`. A bare `ufw allow` applies to every interface, which would open the
    deployment ports externally too. Allow SSH before enabling `ufw`, or it will refuse new SSH connections, including
    your next login.
    Substitute your own interface names:

    ```bash
    # external: administration only
    ufw allow in on eno1 to any port 22 proto tcp     # SSH, administrative access

    # deployment: the ports confluent binds, plus the web server
    ufw allow in on eno2 to any port 13001 proto tcp  # confluent API and node credential handout
    ufw allow in on eno2 to any port 67 proto udp     # DHCPv4, for network boot
    ufw allow in on eno2 to any port 1900 proto udp   # SSDP, discovery and nodes finding the server
    ufw allow in on eno2 to any port 443 proto tcp    # HTTPS, deployment payload and node API

    # BMC: trusted, see below
    ufw allow in on eno3

    ufw enable
    ```

    If the nodes were set up with `osdeploy initialize -l`, they log in to this server over SSH, so allow that on the
    deployment interface as well. The cleanup below removes the rule they relied on otherwise:

    ```bash
    ufw allow in on eno2 to any port 22 proto tcp     # SSH, node to server login
    ```

    If you use the [native TLS API](#native-tls-api-optional) externally, add this optional rule. Replace
    `10.1.0.50/32` with the client address or subnet, and add a separate rule for any IPv6 clients:

    ```bash
    ufw allow in on eno1 from 10.1.0.50/32 to any port 13001 proto tcp
    ```

    The remaining boot ports depend on how the nodes boot. Add whichever apply:

    ```bash
    ufw allow in on eno2 to any port 80 proto tcp     # HTTP, PXE boot, HTTP boot without TLS
    ufw allow in on eno2 to any port 69 proto udp     # TFTP, PXE boot
    ufw allow in on eno2 to any port 547 proto udp    # DHCPv6, network boot over IPv6
    ufw allow in on eno2 to any port 4011 proto udp   # ProxyDHCP, with a separate DHCP server
    ```

    If you use the web interface, allow HTTPS on the external interface as well:

    ```bash
    ufw allow in on eno1 to any port 443 proto tcp    # HTTPS, web interface
    ```

    The BMC interface is allowed wholesale so that discovery works, see
    [Discovery needs more than open ports](#discovery-needs-more-than-open-ports). Optional cluster services belong
    on the deployment interface:

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

    !!! warning
        If you added rules while following [Confluent Installation](../getting_started/installconfluent.md), they apply
        to every interface, external included, until you delete them. Delete them only once every scoped rule you
        need is in place, so SSH, the web interface and any native TLS API clients stay reachable on `eno1`, and
        network boot, deployment and SSH from nodes set up with `osdeploy initialize -l` keep working on `eno2`.
        Earlier versions of that guide used the `OpenSSH`, `Apache Secure` and `Apache` application profiles, so the
        loop removes those as well. `ufw` reports and skips any rule that does not exist:

        ```bash
        for rule in 22/tcp 443/tcp 80/tcp 13001/tcp 67/udp 1900/udp 69/udp 547/udp 4011/udp OpenSSH 'Apache Secure' Apache; do
            ufw delete allow "$rule"
        done
        ```

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
| `eno1` | External, for example `10.1.0.0/24`, routed to the rest of your site | Everyone at your site, plus your gateway, corporate DNS, LDAP, NTP and monitoring | Restricted: 22 for administration, 443 if the web interface is used, and source-restricted 13001 if native TLS API clients connect here |
| `eno2` | Deployment, for example `172.30.1.0/24`, private and unrouted | The nodes, and therefore **every user with a shell on a node** | Restricted: the port rules only, never trusted |
| `eno3` | BMC, for example `172.30.2.0/24`, isolated | Only BMCs, PDUs and switch management ports. No user reaches it, and admins normally only through the confluent server | Trusted, so discovery replies arrive |
| `ib0` | High speed (optional), an InfiniBand, OmniPath or RoCE fabric | The nodes, as on the deployment network | None. No confluent port belongs here, unless you deploy over it, in which case the deployment rules apply |

Putting the BMC interface in the `trusted` zone, as
[Configuring the firewall](#configuring-the-firewall) already does, is what makes active discovery work. No
additional rule is needed. If you cannot trust it, see
[If you cannot trust the BMC interface](#if-you-cannot-trust-the-bmc-interface) below.

!!! warning
    Do not give the deployment interface the same treatment. Anyone with a shell on a node can send packets from
    that network, so trusting it would expose every service on the server to every cluster user, not just
    confluent's ports. Leave it on the port rules from
    [Configuring the firewall](#configuring-the-firewall).

    It does not need trusting anyway: traffic arriving there is node-initiated, so a deploying node's SSDP search and
    the server's reply are part of one exchange that connection tracking already permits.

    The exception is a BMC that shares a physical port with the node's operating system NIC (a shared LOM or NC-SI
    port) and therefore sits on the deployment network rather than on a separate BMC network. Confluent's active
    scans then have to reach it there, and their replies are dropped just as on an untrusted BMC network.
    [PXE driven discovery](confluentpxedisco.md) commonly ends up here: the boot attempt itself is node-initiated,
    but it then moves each BMC onto the `lom` port and finds it with `nodediscover rescan`, which is an active scan.
    Exempt only the addresses the BMCs use rather than the whole interface, which is easiest when they have a range
    of their own:

    === "firewalld"

        ```bash
        firewall-cmd --permanent --zone=trusted --add-source=172.30.1.192/26   # BMC addresses on the deployment network
        firewall-cmd --reload
        ```

    === "ufw"

        ```bash
        ufw allow in on eno2 from 172.30.1.192/26   # BMC addresses on the deployment network
        ```

    Anyone with root on a node can still claim one of those addresses. Where that is not acceptable, use one of the
    alternatives under [If you cannot trust the BMC interface](#if-you-cannot-trust-the-bmc-interface).

!!! note
    Do not narrow SSDP down to the multicast destination address. The `ssdp` service that ships with `firewalld`
    restricts traffic to `239.255.255.250` and `ff02::c`, but a node searching for its deployment server also sends
    to the subnet broadcast address. With the built-in service in place only the multicast search is answered, and
    the broadcast search is dropped. That is why
    [Configuring the firewall](#configuring-the-firewall) opens port 1900 by number rather than adding the built-in
    service.

### If you cannot trust the BMC interface

Open only the two discovery ports on it instead. Devices announcing themselves are still heard, which BMCs do when
they power on, but replies to confluent's active scans are dropped:

=== "firewalld"

    ```bash
    firewall-cmd --permanent --new-zone=bmc
    firewall-cmd --permanent --zone=bmc --add-port=427/udp     # SLP, BMC discovery
    firewall-cmd --permanent --zone=bmc --add-port=1900/udp    # SSDP, BMC discovery
    firewall-cmd --reload                                      # load the zone and rules before assigning it
    firewall-cmd --permanent --zone=bmc --change-interface=eno3
    firewall-cmd --reload                                      # apply where NetworkManager is not in use
    ```

=== "ufw"

    ```bash
    ufw allow in on eno3 to any port 427 proto udp    # SLP, BMC discovery
    ufw allow in on eno3 to any port 1900 proto udp   # SSDP, BMC discovery
    ufw delete allow in on eno3                       # then remove the wholesale rule
    ```

With `firewalld`, you can receive the scan replies as well by matching them with an ipset, as described next.
`ufw` has no equivalent, so there the replies stay dropped.

### Matching scan replies with an ipset

`firewalld` can single out the replies to confluent's active scans. The rules below record the source address and port
of each outgoing scan in an ipset for three seconds, and accept the packets that come back to it. They only add the
replies, so open the discovery ports as described above as well.

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
