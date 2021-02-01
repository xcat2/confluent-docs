---
layout: page
title: LiCO
permalink: /lico/
toplevel: yes
---

Build-in container images
============================
- This site provides **LiCO build-in container images** [LiCO5.5](https://hpc.lenovo.com/lico/downloads/5.5/images/) [LiCO6.1](https://hpc.lenovo.com/lico/downloads/6.1/images/), 
user can download singularity definition file or docker file from this site, then build container image, import the image into LiCO and use it in LiCO. 
- For LiCO Host: LiCO uses singularity as container, user can **follow the guide** [LiCO5.5]({{ site.baseurl }}/lico/lico5/host-import-buildin-images.html) 
[LiCO6.1](https://hpc.lenovo.com/lico/downloads/6.1/images/host/readme.html) to build LiCO build-in singularity image and import image into LiCO.
- For LiCO K8S: LiCO uses docker as container, user can **follow the guide** [LiCO5.5]({{ site.baseurl }}/lico/lico5/k8s-import-buildin-images.html) 
[LiCO6.1](https://hpc.lenovo.com/lico/downloads/6.1/images/k8s/readme.html) to build LiCO build-in docker image and import image into LiCO.

Customer contributed container images
============================
- If you have any well validated container image and want to share it on this site, please send mail to **hpchelp@lenovo.com**. 
- You can get customer contributed container images [LiCO5.5](https://hpc.lenovo.com/lico/downloads/5.5/images_contributed/) 
[LiCO6.1](https://hpc.lenovo.com/lico/downloads/6.1/images_contributed/) and use it, see the FAQ **how to use user created container image in LiCO**. 

Customer contributed job templates
============================
- Except build-in job templates, user can create custom job template and export it as a file. If you have any exported custom job template and want to share it on this site, please send mail to **hpchelp@lenovo.com**.
- You can get customer contributed job templates [LiCO5.5](https://hpc.lenovo.com/lico/downloads/5.5/templates_contributed/) [LiCO6.1](https://hpc.lenovo.com/lico/downloads/6.1/templates_contributed/) and 
import them into LiCO.


FAQ
============================
[how to convert ngc image to singularity image]({{ site.baseurl }}/lico/faq/faq-how-to-convert-ngc-image-to-singularity-image.html)  
[how to convert gcp image to singularity image]({{ site.baseurl }}/lico/faq/faq-how-to-convert-gcp-image-to-singularity-image.html)  
[submit job failed on host cluster]({{ site.baseurl }}/lico/faq/faq-submit-slurm-job-failed.html)  
[how to use user created container image in LiCO]({{ site.baseurl }}/lico/faq/faq-how-to-use-user-image.html) 


