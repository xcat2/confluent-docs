---
layout: page
title: Containerized confluent run 
permalink: /documentation/containerized-confluent.html
---

Synopsys
---------------

 Containerized confluent image with docker

Solution
---------------

To create a containerized confluent image with docker we need to edit the custom file "/confluent/container/Dockerfile 

Constrains:
---------------

Container must be run privileged.
Container must be run with the ' --net = host' flag.

Dockerfile customization
---------------

    1  FROM almalinux:8    
 
Modify above line with the desired OS.

Please note that Lenovo does NOT HOST any OS. The OS will be taken from a repository outside of Lenovo control. 

The next lines can be edited with the specific package manager commands. 

These will pull and install the dependencies needed to run confluent.

    2   RUN   ["yum", "-y", "update"]

    3   RUN   ["rpm", "-ivh", "https://hpc.lenovo.com/yum/latest/el8/x86_64/lenovo-hpc-yum-1-1.x86_64.rpm"]

    4   RUN   ["yum", "-y", "install", "lenovo-confluent", "tftp-server", "openssh-clients", "openssl", "vim-enhanced", "iproute"]


At the end we have the last two commands:

    5   ADD runconfluent.sh /bin/

    6   CMD ["/bin/bash", "/bin/runconfluent.sh"]

These will add to bin and run the "runconfluent.sh" file that will install and run confluent.
(default /confluent/container/runconfluent.sh)


Reference 
---------------

<https://github.com/lenovo/confluent/blob/master/container/Dockerfile>
<https://github.com/lenovo/confluent/blob/master/container/runconfluent.sh>
