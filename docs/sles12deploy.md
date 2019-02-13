---
layout: page
title: OS Deployments Notes for SLES 12.3
permalink: /documentation/sles12deploy.html
---

xCAT currently fails to construct the unified install tree in a way that a 'yast' repository would understand.  The work-around links the repositories together in a manner that yast and zypper are able to navigate.

After performing copycds on disk 2 of SLES12 media, SUSE may experience problems interacting with the install source, such as:                                                             

```
File '/media.2/media' not found on medium                       
'http://10.16.0.10:80/install/sles12.3/x86_64/1'                
                                                                
Abort, retry, ignore? [a/r/i/...? shows all options] (a):
```

The media can be fixed up as follows:                           

```
cd /install/sles12.3/x86_64/1                                   
ln -s ../2/media.2 .                                            
mkdir -p suse/src/                                              
cd suse/src                                                     
for src in ../../../2/suse/src/*rpm; do                         
    ln -s $src .                                                
done                                                            
                                                                
cd ../../../2/                                                  
ln -s ../1/media.1 .
```
