This will create a certificate authority that is identical, but constrained.

It will also create a certificate with SAN values limited to the authorized scope, as TLS
checks all possible SAN values against the constraints, rather than just the pertinent
subset.



Make a copy of the opensslcfg with a new section:
[san_env]
subjectAltName=${ENV::SAN}


Make a new csr:
openssl req -new -key /etc/pki/tls/private/localhost.key -out /tmp/huh.csr -subj /CN=r3u20.devcluster.net  

Sign it with designated DNS as SAN:

SAN=DNS:r3u20.devcluster.net openssl ca -config /tmp/openssltmp.cfg -in /tmp/huh.csr -out /etc/pki/tls/certs/fqdn.cert -batch -notext -startdate 19700101010101Z -enddate 21000101010101Z -extensions san_env


Add some 'ServerName' directive to the existing virtualhost, do *not* match it to
the name for everyone, but it need not match specifically what is used
<VirtualHost _default_:443>
ServerName unknownserver

Underneath the default, define specific virtualhost to indicate correct key material
<VirtualHost *:443>
ServerName r3u20.devcluster.net
SSLCertificateFile /etc/pki/tls/certs/fqdn.crt
SSLCertificateKeyFile /etc/pki/tls/private/localhost.key
SSLEngine on
</VirtualHost>

