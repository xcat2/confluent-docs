---
layout: page
title: Osdeployment sample postscripts and their usage
permalink: /documentation/samplepostscripts.html
---

Listed here are some sample post scripts that you might choose to use when deploying 
confluent surported operating systems. These scripts are located in the initialized 
profiles scripts directory, `/var/lib/confluent/public/os/<profile>/scripts/sample`.

1. **Post script to comment out the terminal and serial lines in the grub.conf after install on el9 or suse15**
    - location `/var/lib/confluent/public/os/<profile>/scripts/sample/consoleredirect`
    - When serial console redirect is enabled after POST in the UEFI settings and in grub this might result in double text 
    appearing in console. Commenting out the terminal and serial lines in the grub.cfg file will fix this. This
    script works for either SuSE or RHEL deployments. 
    <br><br>

    - 
