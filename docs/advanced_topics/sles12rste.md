---
layout: page
title: Using xCAT to install SLES12 on Intel RSTe
permalink: /documentation/sles12rste.html
---

xCAT does not currently consider the RSTe array as a default
install target.  To override the behavior and direct the OS
to be installed to RSTe, first create a file called /install/custom/sles12rste.partitions containing the following:

    <drive>
     <device>/dev/md/Volume0</device>
     <partitions config:type="list">
         <partition>
             <filesystem config:type="symbol">vfat</filesystem>
              <mount>/boot/efi</mount><size>128mb</size>
          </partition>
          <partition>
              <mount>swap</mount>
              <size>auto</size>
          </partition>
              <partition>
               <mount>/</mount>
               <size>auto</size>
          </partition>
     </partitions>
     <initialize config:type="boolean">true</initialize>
    </drive>

With this in place, modify the osimage to use this partition plan:

    chdef -t osimage sles12.3-x86_64-install-compute partitionfile=/install/custom/sles12rste.partitions 

From that point forward invocations of the nodeset command will target the RSTe volume.

