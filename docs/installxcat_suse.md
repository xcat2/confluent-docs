---
layout: page
title: xCAT Installation for SUSE
permalink: /documentation/installxcat_suse.html
---

# xCAT Installation for SUSE

After adding the correct repository as indicated in the [download page]({{ site.baseurl }}/downloads/), you can install xCAT by running:
```sh
	zypper install xCAT
```
If you are missing the GPG key, run the following comand. 
    rpm --import https://hpc.lenovo.com/gpgkey.asc
	
To verify that you have installed xCAT
```sh
    service xcatd status
```
At this point, log out and log back in to have xCAT commands functional.

To continue to install confluent go to [install confluent]({{ site.baseurl }}/documentation/installxcat_suse.html)

## **Issues:**

It is possible to require additional packages when installing xCAT. 
For SUSE, connect to xcat.org repository 
```sh
    
```

For 

Error Message:
Cannot load /usr/lib64/apache2-prefork/mod_proxy_http.so into server: /usr/lib64/apache2-prefork/mod_proxy_http.so: undefined symbol: ap_proxy_location_reverse_map

Error Message: 	
start_apache2[11042]: Invalid command 'AllowMethods', perhaps misspelled or defined by a module not included in the server configuration

Add allowmethods_module and headers_module into your configuration script 

*LoadModule proxy_module        /usr/lib64/apache2-prefork/mod_proxy.so*
LoadModule proxy_http_module    /usr/lib64/apache2-prefork/mod_proxy_http.so
*LoadModule allowmethods_module    /usr/lib64/apache2-prefork/mod_allowmethods.so*
*LoadModule headers_module    /usr/lib64/apache2-prefork/mod_headers.so*

