---
layout: page
title: OS Deployment concepts
permalink: /documentation/osdeploy.html
---

Confluent supports a number of mechanisms for operating system deployment, with various benefits and drawbacks.

The quickest to get started with is scripted install.  When importing OS install media, starting points for such profiles will be generated. This
approach leverages the OS deployment automation supported natively by the provider of the operating system.  The following technologies are supported:

| OS                  | Mechanism              |
|---------------------|------------------------|
| Red Hat and similar | Kickstart (Anaconda)   |
| Ubuntu              | cloud-init (Subiquitiy)|
| SUSE                | Autoyast               |
| Debian              | Debian-Installer       |
| VMWare              | Kickstart (Weasel)     |

The benefits of this approach are:

| Benefits | Drawbacks |
| ------ | -------- |
|<ul><li>Most familiar mechanism for interacting with the distribution developers, support, and community</li><li>The process to transition from common, standard OS material to your bespoke setup remains clearly documented in post/firstboot automation | <ul><li>Indefinite term for local ad-hoc modifications to induce 'drift' in OS state if care is not taken</li><li>Generally slower to deploy than other approaches</li><li>Uses local disk</li></ul>

For many platforms, Confluent further supports an 'image' based approach goverened by 'imgutil'.  This approach works with chroot-style directory trees or cloning to maintain an image.

Generally speaking, the benefits and drawbacks of an image based approach are:

| Benefits | Drawbacks |
| ------ | -------- |
| <ul><li>Fastest time to deployment</li><li>Most straightforward way to amplify potential manual OS modification to scale out to arbitrarily many nodes without having to sort out an unattended procedure</li><li>Depending on deployment choice, may not need local disk</ul>| <ul><li>Ease of ad-hoc modification may result in operational confusion on how the image was built up, particularly when it comes time to rebase to a newer major version</li><li>Not immediately familiar to the OS developers or the broader OS community</li></ul>



Within the scope of image based OS deployment, there are two ways of constructing/maintaining images:

* `imgutil build` - This uses the OS package repository to create a 'chroot' style packaging of the OS. This is the most trivial to get going and modify.  `imgutil exec` provides a mechanism to containerize modifications to bring the environment as close as possible to acting the same as on a real node.  `imgutil pack` and `imgutil unpack` can be used to prepare such images for deployment or another iteration of modification, respectively.

* `imgutil capture` - This uses an existing node as a golden reference and creates an image from it.  This permits the greatest ability to model the full scope of a node install on real hardware including behavior of drivers with the real hardware and partitioning, but is more complicated and time consuming to modify compared to the `build` approach above.

With an `imgutil` managed profile, there are three approaches to deployment, selected by editing the profile.yaml file in /var/lib/confluent/public/os/{profilen} and modifying the kernelargs:

* `installtodisk` - This will write the image to hard disk similar to a scripted install and apply `post` and `firstboot` automation in a similar way. In addition to more trivial inclusion of third party content compared to a scripted install, this approach tends to be much quicker than scripted installers.

| Benefits | Drawbacks |
| ------ | -------- |
| <ul><li>Can freely use root filesystem for scratch, logging, installs and updates without concern about memory consumption</li><li>Usually faster than scripted install</ul>|<ul><li>Requires local disk</li><li>Slower to deploy than diskless approaches.</ul>|

* `confluent_image=tethered` - This will instruct the OS to boot with HTTPS-as-root approach.  This results in memory consumption similar to installing from disk, but without actually using local disk in the process. In a confluent collective architecture, this remote root filesystem is
given multipath capabilities, allowing continued functionality if one confluent member goes down.  Benefits and drawbacks of this approach are:

| Benefits | Drawbacks |
| ------ | -------- |
| <ul><li>No local disk required</li><li>Dramatically reduced memory requirements compared with traditional diskless approaches</li><li>Faster diskless boot compared with traditional diskless approaches</li><li>OS may contain arbitraily large content without risking extra memory consumption</li></ul> | <ul><li>Nodes have an ongoing dependency on the confluent infrastructure and profile's existance on the servers. Mitigated by using a collective to provide HA capabilities.</li><li>Writing to the local filesystem (logging, scratch, updates, installs) will increase memory consumption<li></ul>

* `confluent_image=untethered` - This will instruct the OS to download the image up front and run out of compressed RAM instead of disk or fetching on-demand. Benefits and drawbacks:

| Benefits | Drawbacks |
| ------ | -------- |
| Fastest performance as all content is RAM resident | Slower boot as full image must be downloaded at once |
|Independent functioning from the deployment infrastructure after boot|Large memory consumption
