---
layout: page
title: OS Deployment Notes for SLES 12.3
permalink: /documentation/sles12deploy.html
---


After performing copycds on disk 2 of the SLES 12 media, SUSE may experience problems interacting with the install source, such as:                                                             

```
File '/media.2/media' not found on medium                       
'http://10.16.0.10:80/install/sles12.3/x86_64/1'                
                                                                
Abort, retry, ignore? [a/r/i/...? shows all options] (a):
```

The media can be fixed up as follows:                           

```
cd /<xCAT installdir>/sles12.3/x86_64/1                                   
ln -s ../2/media.2 .                                            
mkdir -p suse/src/                                              
cd suse/src                                                     
for src in ../../../2/suse/src/*rpm; do                         
    ln -s $src .                                                
done                                                            
                                                                
cd ../../../2/                                                  
ln -s ../1/media.1 .
```
