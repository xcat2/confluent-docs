---
layout: page
title: LiCO 5.5.0 Import Build-in Container Image (Docker)
permalink: /lico/lico550/k8s-import-buildin-images
---

## Import LiCO build-in image into LiCO

When LiCO is released, it provides docker files of build-in images, user can build images from docker file and import them to LiCO. 

#### 1. Build-in images

The compressed file **[image_bootstrap.zip](https://hpc.lenovo.com/lico/downloads/5.5/images/k8s/)** contains docker files and docker file dependencies. The below table lists images in **image_bootstrap.zip**.

Images | Framework | CPU/GPU |	Comments 
:---|:---|:---|:---
caffe:caffe-1.0-cpu |Caffe |CPU	 
caffe:caffe-1.0-gpu-cuda92 | Caffe |CUDA 9.2| Supports P100 and V100 <br> Caffe does not support CUDA>9.0 officially
chainer:chainer-6.2.0-gpu-cuda100|	Chainer|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4
intel-caffe:intel-caffe-1.1.6-cpu|	Intel-caffe|	CPU	|
intel-python:intel-python|	Other|	CPU|	
jupyter:jupyter-py27-cpu|	Jupyter|	CPU	|
jupyter:jupyter-py27-gpu|	Jupyter|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4
jupyter:jupyter-py36-cpu|	Jupyter|	CPU	|
jupyter:jupyter-py36-gpu|	Jupyter|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4
jupyter:jupyter-py37-cpu|	Jupyter|	CPU	|
jupyter:jupyter-py37-gpu|	Jupyter|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4
letrain:letrain-1.2-cpu|	LeTrain|	CPU|	
letrain:letrain-1.2-gpu-cuda100|	Caffe|	CPU	|Supports P100, V100, RTX5000, and T4
mxnet:mxnet-1.5.0-cpu-mkl|	Mxnet|	CPU|	
mxnet:mxnet-1.5.0-gpu-mkl-cuda100|	Mxnet|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4
neon:neon-2.6-cpu|	Neon|	CPU|	
pytorch:pytorch-1.1.0-gpu-cuda100|	PyTorch|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4
scikit:scikit-single-cpu|	Scikit|	CPU	|
tensorflow:tensorflow-1.13.1-cpu|	TensorFlow|	CPU|
tensorflow:tensorflow-1.13.1-gpu-cuda100|	TensorFlow|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4
tensorflow:tensorflow-1.13.1-gpu-cuda100-hbase|	TensorFlow|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4 <br> Supports HBase
tensorflow:tensorflow-1.13.1-gpu-cuda100-keras|	TensorFlow|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4 <br> Supports Keras(2.2.4)
tensorflow:tensorflow-1.13.1-gpu-cuda100-mongodb|	TensorFlow|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4 <br> Supports MongoDB
tensorflow:tensorflow-1.13.1-mkl|	TensorFlow|	CPU|	
tensorflow:tensorflow-2.0.0-cpu|	TensorFlow|	CPU|	
tensorflow:tensorflow-2.0.0-gpu-cuda100|	TensorFlow|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4
lico-file-manager|	Other|	CPU|	Indispensable
lico-k8s-tools|	Other|	CPU|	Indispensable

<br> 

#### 2. Create images
Step 1. Prepare a build node with a minimum storage of 100 GB. 
- Make sure docker is installed in the build node. 
- Make sure /opt/images and /var/tmp are not NFS shared directory.
- To create GPU images, GPU, GPU driver and nvidia-docker(<https://github.com/NVIDIA/nvidia-docker>) are also need to be installed in the build node. 

Step 2. Copy /etc/lico/lico-auth-internal.key from the LiCO node to /opt/images of build node, create directory /opt/images first if there is no this directory in the build node.

Step 3. Upload  **image_bootstrap.zip** to /opt/images of build node. 
```
cd /opt/images
unzip image_bootstrap.zip
cp /opt/images/lico-auth-internal.key /opt/images/image_bootstrap/lico-file-manager
cp /opt/images/lico-auth-internal.key /opt/images/image_bootstrap/lico-k8s-tools
chmod 744 /opt/images/image_bootstrap/lico-k8s-tools/lico-auth-internal.key
chmod 744 /opt/images/image_bootstrap/lico-file-manager/lico-auth-internal.key
```

Step 4. On the build node, do one of the following to create image.

Run the following commands to create all images at once:

```
cd /opt/images/image_bootstrap
make all
```

Run the following commands to create image one by one:

```
cd /opt/images/image_bootstrap
make caffe-cpu
make caffe-gpu
make intel-caffe
make intel-python
make tensorflow-cpu
make tensorflow-mkl
make tensorflow-gpu
make tensorflow-hbase
make tensorflow-keras
make tensorflow-mongodb
make tensorflow2-cpu
make tensorflow2-gpu
make mxnet-cpu
make mxnet-gpu
make neon
make chainer
make letrain-gpu
make letrain-cpu
make jupyter-cpu
make jupyter-gpu
make pytorch
make lico-file-manager
make lico-k8s-client
make scikit
```
> Note: one command can generate multiple images, such as *make juypter-cpu* will create 3 images, *jupyter:jupyter-py27-cpu*,*jupyter:jupyter-py36-cpu*,*jupyter:jupyter-py37-cpu*.

Step 5. Push the created docker image to one existing docker repository, the repository can be one
docker registry（<https://docs.docker.com/registry/>) or one docker harbor(<https://goharbor.io/>) or docker hub(<https://hub.docker.com/>).


#### 3. Import images into LiCO as system-level images
Run the following commands to import images into LiCO:
```
lico import_system_image kube-tools <LiCO-K8s-Client-IMAGE> other
lico import_system_image lico-file-manager <LiCO-File-Manager-IMAGE> other
lico import_system_image caffe-cpu <Caffe-CPU-IMAGE> caffe
lico import_system_image caffe-gpu <Caffe-GPU-IMAGE> caffe
lico import_system_image tensorflow-cpu <TensorFlow-CPU-IMAGE> tensorflow
lico import_system_image tensorflow-gpu <TensorFlow-GPU-IMAGE> tensorflow
lico import_system_image tensorflow2-cpu <TensorFlow2-CPU-IMAGE> tensorflow
lico import_system_image tensorflow2-gpu <TensorFlow2-GPU-IMAGE> tensorflow
lico import_system_image tensorflow-mkl <TensorFlow-MKL-IMAGE> tensorflow
lico import_system_image tensorflow-gpu-hbase <TensorFlow-HBase-IMAGE> tensorflow
lico import_system_image tensorflow-gpu-keras <TensorFlow-Keras-IMAGE> tensorflow
lico import_system_image tensorflow-gpu-mongodb <TensorFlow-MongoDB-IMAGE> tensorflow
lico import_system_image intel-caffe <Intel-Caffe-IMAGE> intel-caffe
lico import_system_image intel-python <Intel-Python-IMAGE> other
lico import_system_image pytorch <PyTorch-IMAGE> pytorch
lico import_system_image neon <NEON-CPU-IMAGE> neon
lico import_system_image chainer-gpu <Chainer-GPU-IMAGE> chainer
lico import_system_image letrain-cpu <LeTrain-CPU-IMAGE> letrain
lico import_system_image letrain-gpu <LeTrain-GPU-IMAGE> letrain
lico import_system_image mxnet-cpu <MXNet-CPU-IMAGE> mxnet
lico import_system_image mxnet-gpu <MXNet-GPU-IMAGE> mxnet
lico import_system_image jupyter-py27-cpu <Jupyter-py27-CPU-IMAGE> jupyter -t py27 -t cpu
lico import_system_image jupyter-py27-gpu <Jupyter-py27-CPU-IMAGE> jupyter -t py27 -t gpu
lico import_system_image jupyter-py36-cpu <Jupyter-py36-CPU-IMAGE> jupyter -t py36 -t cpu
lico import_system_image jupyter-py36-gpu <Jupyter-py36-GPU-IMAGE> jupyter -t py36 -t gpu
lico import_system_image jupyter-py37-cpu <Jupyter-py37-CPU-IMAGE> jupyter -t py37 -t cpu
lico import_system_image jupyter-py37-gpu <Jupyter-py37-GPU-IMAGE> jupyter -t py37 -t gpu
lico import_system_image scikit-cpu <Scikit-CPU-IMAGE> scikit
```
> Note: Modify <*-IMAGE> to the actual path in docker repository
> Note: Image is saved in the docker repository, LiCO just record the image url. 



 

















    
