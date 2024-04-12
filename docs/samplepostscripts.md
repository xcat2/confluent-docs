---
layout: page
title: Osdeploy sample post scripts and their usage
permalink: /documentation/samplepostscripts.html
---

Listed here are some sample post scripts that you might choose to use when deploying 
confluent surported operating systems. These scripts are located in the initialized 
profiles scripts directory, `/var/lib/confluent/public/os/<profile>/scripts`.

1. **Post script to comment the terminal and serial lines in the grub.conf after install on el9 or suse15**
    - When serial console redirect is enabled in the uefi settings and in grub this might result in double text 
    appearing in console. Commenting out the terminal and serial lines in the grub.cfg file will fix this. This
    script works for either SUSE or Rhel deployments. 
    <br><br>

    ```
    is_suse=false
    is_rhel=false

    if test -f /boot/efi/EFI/redhat/grub.cfg; then
        grubcfg="/boot/efi/EFI/redhat/grub.cfg"
        grub2-mkconfig -o $grubcfg
        is_rhel=true
    elif test -f /boot/efi/EFI/sle_hpc/grub.cfg; then
        grubcfg="/boot/efi/EFI/sle_hpc/grub.cfg"
        grub2-mkconfig -o $grubcfg
        is_suse=true
    else
        echo "Expected File missing: Check if os sle_hpc or redhat"
        exit
    fi

    # working on SUSE
    if $is_suse; then
        start=false
        num_line=0
        lines_to_edit=()
        while read line; do
            ((num_line++))
            if [[ $line == *"grub_platform"* ]]; then
                start=true
            fi
            if $start; then
                if [[ $line != "#"* ]];then
                    lines_to_edit+=($num_line)
                fi
            fi
            if [[ ${#line} -eq 2 && $line == *"fi" ]]; then
                if $start; then
                    start=false
                fi
            fi
        done < grub_cnf.cfg

        for line_num in "${lines_to_edit[@]}"; do
            line_num+="s"
            sed -i "${line_num},^,#," $grubcfg
        done
        sed -i 's,^terminal,#terminal,' $grubcfg
    fi

    # Working on Redhat
    if $is_rhel; then
        sed -i 's,^serial,#serial, ; s,^terminal,#terminal,' $grubcfg
    fi
    ```
