---
layout: page
title: How to Convert GCP Image to Singularity Image 
permalink: /lico/faq/faq-how-to-convert-gcp-image-to-singularity-image
---
**Step 1. Obtain the Google deep learning container URL.**   
Google provides pre-configured and optimized deep learning containers that can be used within LiCO. To view available container images, visit <https://console.cloud.google.com/gcr/images/deeplearning-platform-release?project=deeplearning-platform-release>.  
![image03]({{ site.baseurl }}/assets/lico-convert-gcp-to-singularity-1.png)  
a. Select a container for your DL framework, for example, GPU-enabled Tensorflow 13.  
![image02]({{ site.baseurl }}/assets/lico-convert-gcp-to-singularity-2.png)  
b. Find the image version you want to use (the one with the “latest” tag is recommended), click , and select the Show Pull Command option.  
c. Copy the last part of the command shown on the displayed page, that is, gcr.io/deeplearning- platform-release/tf-gpu.1-13:latest in this example.  
![image03]({{ site.baseurl }}/assets/lico-convert-gcp-to-singularity-3.png)  

**Step 2. Prepare a recipe file.**  
Create a new file named recipe.def, using the URL reference obtained in step 1:

```
Bootstrap: docker
From: gcr.io/deeplearning-platform-release/tf-gpu.1-13:latest
%post
chmod 755 /root
```

**Step 3. Build a singularity image from the recipe file.**  
Build an image on the server with singularity by running the following command as a root user:

```
$ singularity build tf-gpu.1-13.image recipe.def
```

A container named tf-gpu-1.13.img is created.
