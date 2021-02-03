---
layout: page
title: How to Use User Image in LiCO
permalink: /lico/faq/faq-how-to-use-user-image
---
## Import user created singularity images into LiCO
User can also import user created images into LiCO.

#### 1. Build a singularity image.

User can build singularity image on any build node which has singularity installed. Singularity provides a few ways(<https://sylabs.io/guides/3.4/user-guide/build_a_container.html>) to build singularity image, the most commonly used way is definition file. The below is one example of definition file.  
```
file tensorflow-cpu.def 

Bootstrap: docker
From: tensorflow/tensorflow:1.13.1

%post
    pip_path=`which pip`
    sed -i 's/import main/import __main__/' $pip_path
    sed -i 's/sys.exit(main())/sys.exit(__main__._main())/' $pip_path
    pip --default-timeout=100 install -U scikit-learn
```
You can use the following command to build singularity image.
```
singularity build tensorflow-cpu.simg tensorflow-cpu.def 
```

> Note: When you build a image which needs GPU, please make sure GPU driver is installed on the build node, and GPU driver should have the same version with the nodes where images will be used. 


#### 2. Upload singularity image to LiCO
![image01]({{ site.baseurl }}/assets/lico-host-container.png)

Select the framework: the framework determines which job templates can use this image, for example, if the framework is tensorflow, all the tensorflow job template can use this image.

Select the image file: since image file is not in LiCO,  when selecting the image file, user should click the **upload file** button to upload image file to LiCO, then select the uploaded image file. 

> Note: When using LiCO GUI to upload created image, the image size should be less than 5GB, if user want to upload image which size is bigger than 5GB, user should use other ways to upload the image to user's home directory, then user can select it on LiCO GUI.

> Note: If user is LiCO user, the image is private image which can just be used by self.  If user is LiCO administrator, the image is system image which can be used by all users.


#### 3. Use image in LiCO
When user submit job through job template, use can choose image as run environment to run the job.  For example, if template is a tensorflow job template, user can select images which has the tensorflow framework.
![image02]({{ site.baseurl }}/assets/lico-host-jobtemplate.png)



<br>

## Import user created docker images into LiCO
Except build-in images, user can also build docker image and push the image to docker repository. When user submit job through job template, use can choose build-in image or input user image url to run job. For example, if user submit a tensorflow job through tensorflow job template, user can select tensorflow build-in images or input the user image url directly. 
> Note: when user input image url directly, please make sure docker can pull image from user's docker repository on the kubernetes compute nodes. If user's docker repository is insecure, the docker repository should be added to /etc/docker/daemon.json as a insecure resigtry on all kubernetes compute nodes, such as **"insecure-registries": ["10.240.208.138:5000","10.240.212.106", "10.240.212.123:8899"]**

![image01]({{ site.baseurl }}/assets/lico-k8s-jobtemplate.png)
