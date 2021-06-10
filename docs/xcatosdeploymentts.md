---
layout: page
title: Troubleshooting issues with xCAT OS deployment and diskless image creation/boot
permalink: /documentation/xcatosdeploymenttroubleshooting.html
---
# xCAT OS deployment or diskless image boot fails with message regarding ib=dhcp

The ib=dhcp kernel command line argument is added by default to the bootloader configuration files on the xCAT management server at /tftpboot/xcat/xnba/nodes/<node>* .  When a kernel command line paramer is set to set the ip= argument more explicitly, for example using bootparams.addkcmdline for boot over IB, then the ip=dhcp argument in the kernel command line arguments in the bootloader configuration file is superfluous and can cause problems.  To work-around this error the "ip=dhcp" entry in the bootloader configuration file should be removed.  Note, this will have to be re-done, after performing nodeset.

# After creating an xCAT (Extreme Cluster Administration Toolkit) stateless image of SLES 15.2 and deploying it, SSH connections to the booted SLES 15.2 image fail

This presumes the creation of an xCAT stateless image via the process described at
                                                       
[https://sourceforge.net/p/xcat/wiki/Building_a_Stateless_Image_of_a_Different_Architecture_or_OS_Old/](https://sourceforge.net/p/xcat/wiki/Building_a_Stateless_Image_of_a_Different_Architecture_or_OS_Old/)     
                                                                
and will reference that process.                                
                                                                
                                                                
In order to work around the described issue, the sshd service must be manually configured to start automatically when the stateless image is deployed. This is accomplished by using the `chroot` command to enter the image as an environment on the server where it was created.                                    
                                                                
Presuming that the image has been created in the `/imagebuild` directory on the build server, the image may be entered as a running environment using the following commands from the Linux command prompt:                                                 
                                                                
1.  To use the build server's OS environment to enable the image environment:                                          

        for i in dev sys proc; do mount -o bind /$i /imagebuild/rootimg/$i ; done
                                                                
2.  To enter the image environment:                             
                                                                
        chroot /imagebuild/rootimg                                  
                                                                
3.  To configure the sshd service to start after deployment:    
                                                                
        chkconfig sshd on                                           
                                                                
4.  To exit the image environment:                             
                                                                
        exit                                                       
                                                                
5.  IMPORTANT - umount the build server environment from the image:                                                     
                                                                
        for i in dev sys proc; do umount /imagebuild/rootimg/$i ; done

    `/dev` will occasionally report that it is busy. If this happens, do
    
        umount -l /imagebuild/rootimg/dev
                                                                
    Confirm success by running the `mount` command and make sure nothing is mounted under `/imagebuild/rootimg`               
                                                                
6.  Proceed with the process step "Copy the local genimage output to the correct location on the Management Node:"    

<br>
Note, this is due to the xCAT genimage application failing to set the sshd service to start automatically during stateless image creation of SLES 15.2.  As a result, the image is not reachable via SSH after deployment.  
<br>
<br>                                                       
Configuring the sshd service to start using the workaround procedure restores SSH access to the image on deployment.       
