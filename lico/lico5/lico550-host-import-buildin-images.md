---
layout: page
title: LiCO 5.5.0 Import Build-in Container Image (Singularity)
permalink: /lico/lico550/host-import-buildin-images
---

## Import LiCO build-in image into LiCO

When LiCO is released, it provides definition files of build-in images, user can build images from definition file and import images to LiCO. 

#### 1. Build-in images

The compressed file **[image_bootstrap.zip](https://hpc.lenovo.com/lico/downloads/5.5/images/host/)** contains image definition files. The below table lists images in **image_bootstrap.zip**.

Image | Framework | CPU/GPU |	Comments 
:---|:---|:---|:---
caffe-1.0-cpu |Caffe |CPU	 
caffe-1.0-gpu-cuda92 | Caffe |CUDA 9.2| Supports P100 and V100 <br> Caffe does not support CUDA>9.0 officially
chainer-6.2.0-gpu-cuda100|	Chainer|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4
intel-caffe-1.1.6-cpu|	Intel-caffe|	CPU	|
intel-python|	Other|	CPU|	
jupyter-py27-cpu|	Jupyter|	CPU	|
jupyter-py27-gpu|	Jupyter|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4
jupyter-py36-cpu|	Jupyter|	CPU	|
jupyter-py36-gpu|	Jupyter|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4
jupyter-py37-cpu|	Jupyter|	CPU	|
jupyter-py37-gpu|	Jupyter|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4
letrain-1.2-cpu|	LeTrain|	CPU|	
letrain-1.2-gpu-cuda100|	Caffe|	CPU	|Supports P100, V100, RTX5000, and T4
mxnet-1.5.0-cpu-mkl|	Mxnet|	CPU|	
mxnet-1.5.0-gpu-mkl-cuda100|	Mxnet|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4
neon-2.6-cpu|	Neon|	CPU|	
pytorch-1.1.0-gpu-cuda100|	PyTorch|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4
scikit-single-cpu|	Scikit|	CPU	|
tensorflow-1.13.1-cpu|	TensorFlow|	CPU|
tensorflow-1.13.1-gpu-cuda100|	TensorFlow|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4
tensorflow-1.13.1-gpu-cuda100-hbase|	TensorFlow|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4 <br> Supports HBase
tensorflow-1.13.1-gpu-cuda100-keras|	TensorFlow|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4 <br> Supports Keras(2.2.4)
tensorflow-1.13.1-gpu-cuda100-mongodb|	TensorFlow|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4 <br> Supports MongoDB
tensorflow-1.13.1-mkl|	TensorFlow|	CPU|	
tensorflow-2.0.0-cpu|	TensorFlow|	CPU|	
tensorflow-2.0.0-gpu-cuda100|	TensorFlow|	CUDA 10.0|	Supports P100, V100, RTX5000, and T4

<br>  

#### 2. Create images
Step 1. Prepare a build node with a minimum storage of 100 GB. This node should have the same OS version and singularity version with the nodes in the cluster. If you want to create GPU images, this node should have the same GPU driver as nodes in the cluster.

Step 2. Make sure  squashfs-tools, libarchive are already installed on the build node.

Step 3. Upload  **image_bootstrap.zip** to someone directory(such as /opt/images) of build node. Note that both /opt/images and /var/tmp cannot be NFS shared directory.
```
mkdir /opt/images
cd /opt/images
unzip image_bootstrap.zip
```

Step 4. On the build node, do one of the following to create image, the created images are under the dist directory of /opt/images/image_bootstrap

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
make scikit
```
> Note: Check the network when one of the following errors is displayed:  
ERROR MANIFEST_UNKNOWN: manifest unknown  
ReadTimeoutError: HTTPSConnectionPool(host='files.pythonhosted.org', port=443): Read timed out.  
urllib2.URLError: <urlopen error [Error 104] Connection reset by peer>  

> Note: One command can generate multiple images, such as *make juypter-cpu* will create 3 images, *jupyter-py27-cpu*,*jupyter-py36-cpu*,*jupyter-py37-cpu*.


#### 3. Import created images into LiCO as system-level images
Step 1. Copy the created images to LiCO management node.  For example, copy the images to directory /opt/images of LiCO management node. 

Step 2. Run the following commands to import images into LiCO:
```
cd /opt/images
lico import_system_image caffe-cpu caffe-1.0-cpu.image caffe
lico import_system_image caffe-gpu caffe-1.0-gpu-cuda92.image caffe
lico import_system_image intel-caffe intel-caffe-1.1.6-cpu.image intel-caffe
lico import_system_image intel-python intel-python.image other
lico import_system_image tensorflow-cpu tensorflow-1.13.1-cpu.image tensorflow
lico import_system_image tensorflow-mkl tensorflow-1.13.1-mkl.image tensorflow
lico import_system_image tensorflow-gpu tensorflow-1.13.1-gpu-cuda100.image tensorflow
lico import_system_image tensorflow-gpu-hbase tensorflow-1.13.1-gpu-cuda100-hbase.image tensorflow
lico import_system_image tensorflow-gpu-keras tensorflow-1.13.1-gpu-cuda100-keras.image tensorflow
lico import_system_image tensorflow-gpu-mongodb tensorflow-1.13.1-gpu-cuda100-mongodb.image tensorflow
lico import_system_image tensorflow2-cpu tensorflow-2.0.0-cpu.image tensorflow
lico import_system_image tensorflow2-gpu tensorflow-2.0.0-gpu-cuda100.image tensorflow
lico import_system_image mxnet-cpu mxnet-1.5.0-cpu-mkl.image mxnet
lico import_system_image mxnet-gpu mxnet-1.5.0-gpu-mkl-cuda100.image mxnet
lico import_system_image neon neon-2.6-cpu.image neon
lico import_system_image chainer-gpu chainer-6.2.0-gpu-cuda100.image chainer
lico import_system_image letrain-cpu letrain-1.2-cpu.image letrain
lico import_system_image letrain-gpu letrain-1.2-gpu-cuda100.image letrain
lico import_system_image jupyter-py27-cpu jupyter-py27-cpu.image jupyter -t py27 -t cpu
lico import_system_image jupyter-py27-gpu jupyter-py27-gpu.image jupyter -t py27 -t gpu
lico import_system_image jupyter-py36-cpu jupyter-py36-cpu.image jupyter -t py36 -t cpu
lico import_system_image jupyter-py36-gpu jupyter-py36-gpu.image jupyter -t py36 -t gpu
lico import_system_image jupyter-py37-cpu jupyter-py37-cpu.image jupyter -t py37 -t cpu
lico import_system_image jupyter-py37-gpu jupyter-py37-gpu.image jupyter -t py37 -t gpu
lico import_system_image pytorch pytorch-1.1.0-gpu-cuda100.image pytorch
lico import_system_image scikit-cpu scikit-single-cpu.image scikit
```



 

















    
