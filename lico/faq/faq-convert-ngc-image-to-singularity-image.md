---
layout: page
title: How to Convert NGC Image to Singularity Image 
permalink: /lico/faq/faq-how-to-convert-ngc-image-to-singularity-image
---
**Step 1. Register an account on the NGC web site <https://ngc.nvidia.com>.**   
**Step 2. Generate an API KEY as the authentication key to pull NGC image.**  
- Click Get API Key on the Registry page.  
![image01]({{ site.baseurl }}/assets/lico-convert-ngc-to-singularity-1.png)  
- Click Generate API Key to get an API key.  
![image02]({{ site.baseurl }}/assets/lico-convert-ngc-to-singularity-2.png) 

**Step 3. Convert NGC image to singularity image.** 
- Run the following command to check the singularity version:

```
singularity --version
```

> Note: Ensure that singularity version is later than or equal to 3.1.0.

- Run the following commands to convert NGC image to singularity image:

```
# Set the Singularity environment variable
export SINGULARITY_DOCKER_USERNAME='$oauthtoken'
export SINGULARITY_DOCKER_PASSWORD=<API_KEY>
export SINGULARITY_PULLFOLDER=<IMAGE_FOLDER>
# Transform image
singularity pull --name <IMAGE _FILENAME> <NVIDIA-DOCKER-URL>
```

> Notes:  
> - Replace <API_KEY> with your specific API KEY.  
> - Replace <IMAGE_FOLDER> with a specific folder to save the Singularity image.  
> - Replace <IMAGE_ FILENAME> with a specific name for the Singularity image. For example: ngc-caffe.image.  
> - Replace <NVIDIA-DOCKER-URL> with a specific URL of the NVIDIA docker. You can get the NVIDIA docker from https://ngc.nvidia.com/registry.   

![image03]({{ site.baseurl }}/assets/lico-convert-ngc-to-singularity-3.png)  

If the commands above are executed successfully, you will see the singularity image IMAGE_FILENAME under IMAGE_FOLDER.