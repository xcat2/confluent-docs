---
layout: page
title: Confluent TLS Configuration
permalink: /documentation/tlsdesign.html
---
# Challenges of using TLS in a private network

Using TLS in a private network configuration can be daunting. The usual approach requires that DNS be in order and resolving the way that is intended and imposes a requirement that the user explicitly tell the software correctly the name that will be used.  Further, when faced with multihomed systems, it adds more complexity, as the certificate must cover all possible names and the software must use the correct name at the correct time, depending on context.

# Confluent TLS strategy

Due to the challenges with relying upon and configuration of DNS, Confluent steers towards use of IP addresses as it goes.  In typical confluent environments, the IP addresses of the management nodes are fixed, and easy to programatically detect the correct one without user guidance.  Thus `osdeploy initialize -t` focuses on enabling IP addresses, for example, here is a typical SAN field for a confluent generated certificate:

```
X509v3 Subject Alternative Name:
    IP Address:172.30.1.5, IP Address:FDEC:46F7:9B7F:3001:0:0:2:5, IP Address:FE80:0:0:0:A94:EFFF:FE50:BEC2, DNS:172.30.1.5, DNS:fdec:46f7:9b7f:3001::2:5, DNS:fe80::a94:efff:fe50:bec2, DNS:d5
```

Note that every possible ip address is added, and added both properly as IP address fields, and as DNS fields, due to certain TLS clients incorrectly skipping IP address fields.

# The confluent TLS authority

To allow easily updating the certificate to accomodate IP address changes, confluent tends to make it's own certificate authority:
```
/etc/confluent/tls/cakey.pem
/etc/confluent/tls/cacert.pem
```
The public certificate of the CA is placed into the site deployment directory, using the server hostname as the filename.  In the case of a collective where each collective member provides an authority, they should all be present:
```
# ls -l /var/lib/confluent/public/site/tls/
total 6
lrwxrwxrwx. 1 root root   6 Mar 16 09:17 0e6578bf.0 -> d8.pem
lrwxrwxrwx. 1 root root   6 May 31 15:34 36e70825.0 -> d5.pem
lrwxrwxrwx. 1 root root   6 Mar 16 09:17 61dc1437.0 -> d6.pem
lrwxrwxrwx. 1 root root   6 Mar 16 09:17 a8959d66.0 -> d7.pem
-rw-r--r--. 1 root root 656 Mar 23  2022 d5.pem
-rw-r--r--. 1 root root 631 Mar 16 09:17 d6.pem
-rw-r--r--. 1 root root 656 Mar 23  2022 d7.pem
-rw-r--r--. 1 root root 656 Mar 23  2022 d8.pem
```

# Using a custom certificate authority

Unfortunately, while this approach makes things easier for those that do not wish to manually sort out the details of DNS and TLS, it poses a challenge for those that wish to use a TLS certificate globally.  There are some options to proceed.

* **Automatically adding a custom CA certificate to your deployment**

No matter the chosen approach, it is generally desirable to add your custom authority to the deployed systems. In addition to methods that you may be accustomed to being viable during post.d or onboot.d, you may also choose to add your organization's CA certificates to /var/lib/confluent/public/site/tls/.  While collective server certificates use the directory, any other .pem and .0 will be consumed as trusted CA certificates for deployment and beyond.  Note this will only add the authority as trusted, this is likely *not* to make things work, as the certificate will generally use DNS names, and the deployment will still use IP addresses.

* **Use the custom CA alongside the confluent CA**

The recommended approach is to use certificates from both certificate authorities on a confluent server.  The organizational CA for those who access by the expected name, and
the confluent one to facilitate access by IP address. In this approach, use the virtual host feature of the webserver to use different certificates in different contexts.  For example in apache, you would want a `<VirtualHost your.name.org>` section to indicate use of your organizational TLS certificate, leaving the `_default_` section to use the confluent authority.  This should enable SNI to select the correct certificate given the context allowing both use cases to proceed.

* **Using the custom CA to issue a confluent friendly certificate.**

In addition to the names desired, you may wish to add the IP addresses as subject alternative names to the certificate.  If this is possible, then confluent should be able to proceed as nomal.  However, this may be onerous at best (having to redo the certificate process with your organization for an ip address change) or impossible at worst (a common policy is to forbid IP address based SAN entries).



