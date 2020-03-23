---
layout: page
title: LiCO
permalink: /lico/
toplevel: yes
---

LiCO 5.5
============================

LiCO provides validated container images in this site for AI.  
- This site provide [LiCO build-in container images](https://hpc.lenovo.com/lico/downloads/5.5/images/) and [other validated container images](https://hpc.lenovo.com/lico/downloads/5.5/images_contributed/), user can download singularity definition file or docker file from this site, then create container image and use it in LiCO. If you have any well validated container image and want to share it on this site, please send mail to **hpchelp@lenovo.com**.
- For LiCO HPC+AI on Slurm: LiCO uses **singularity** (version=3.4.1) as container , user can [follow the GUIDE]({{ site.baseurl }}/lico/lico550/host-import-buildin-images.html) to import LiCO build-in singularity image into LiCO.
- For LiCO AI on Kubernetes: LiCO uses **docker** (version>=1.3.1) as container, user can [follow the GUIDE]({{ site.baseurl }}/lico/lico550/k8s-import-buildin-images.html) to import LiCO build-in docker image into LiCO.

LiCO provides validated job templates in this site.
- [This site will provide validated job template files in the future](https://hpc.lenovo.com/lico/downloads/5.5/templates_contributed/). If you have any well validated job templates and want to share them on this site, please send mail to **hpchelp@lenovo.com**.
- User can create custom template and export custom template as a file, and can also import exported file to LiCO as a job template. 


FAQ
============================
[how to convert ngc image to singularity image]({{ site.baseurl }}/lico/lico5/faq-how-to-convert-ngc-image-to-singularity-image.html)  
[how to convert gcp image to singularity image]({{ site.baseurl }}/lico/lico5/faq-how-to-convert-gcp-image-to-singularity-image.html)  
[submit job failed on host cluster]({{ site.baseurl }}/lico/lico5/faq-submit-slurm-job-failed.html)  
[how to use user created container image in LiCO]({{ site.baseurl }}/lico/lico5/faq-how-to-use-user-image.html) 


