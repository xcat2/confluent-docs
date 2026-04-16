---
title: Switching from Apache to NGINX on RHEL
---

By default, confluent indicates use of apache configuration due to the way apache is packaged.  However, there are some benefits to switching to nginx:

* The ability to UEFI HTTP boot images with long profile names.  Confluent uses an nginx feature to make its url shortening facility compatible with UEFI
* Somewhat improved performance for static file content, including faster diskless performance.

Modern confluent includes some configuration for both nginx and apache, but as packaged the TLS configuration must be manually handled.

The procedure:

    dnf install nginx

With nginx installed, examine the configuration.  For example, edit `/etc/nginx/nginx.conf` and uncomment the "Settings for a TLS enabled server" section.

After enabling the nginx configuration:

    osdeploy initialize -t

The above will read the nginx configuration, detect where the TLS material should be, and generate it as appropriate.  Note if the configuration indicates directories that do not exist, you will have to `mkdir -p` yourself to ensure the directory exists for `osdeploy` to write to.  With this done:

    systemctl disable httpd --now
    systemctl enable nginx --now

The system should now be running with nginx instead
