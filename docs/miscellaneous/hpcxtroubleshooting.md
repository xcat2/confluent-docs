---
layout: page
title: Troubleshooting issues with hpcx
permalink: /documentation/hpcxtroubleshooting.html
---

# libnuma Error

When using hpcx for MPI jobs on RHEL 9.5, the following error message may be displayed:

```
"Failed to dlopen libnuma.so"
```

To keep this issue from happening, install the following package:

```
numactl-devel-2.0.18-2.el9.x86_64
```

# Multicast Errors

The following errors may be reported when running an MPI job with hpcx:

```
[LOG_CAT_MCAST] VMC Failed to join multicast, is_root 0. Unexpected event was received: event=13, str=RDMA_CM_EVENT_MULTICAST_ERROR, status=-22
[LOG_CAT_MCAST] VMC Failed to join multicast, is_root 0. Unexpected event was received: event=13, str=RDMA_CM_EVENT_MULTICAST_ERROR, status=-22
[LOG_CAT_MCAST] VMC Failed to join multicast, is_root 0. Unexpected event was received: event=13, str=RDMA_CM_EVENT_MULTICAST_ERROR, status=-22
[LOG_CAT_MCAST] VMC Failed to join multicast, is_root 0. Unexpected event was received: event=13, str=RDMA_CM_EVENT_MULTICAST_ERROR, status=-22
[LOG_CAT_MCAST] VMC Failed to join multicast, is_root 0. Unexpected event was received: event=13, str=RDMA_CM_EVENT_MULTICAST_ERROR, status=-22
[LOG_CAT_MCAST] VMC Failed to join multicast, is_root 0. Unexpected event was received: event=13, str=RDMA_CM_EVENT_MULTICAST_ERROR, status=-22
[LOG_CAT_MCAST] VMC Failed to join multicast, is_root 0. Unexpected event was received: event=13, str=RDMA_CM_EVENT_MULTICAST_ERROR, status=-22
[LOG_CAT_MCAST] VMC Failed to join multicast, is_root 0. Unexpected event was received: event=13, str=RDMA_CM_EVENT_MULTICAST_ERROR, status=-22
[LOG_CAT_MCAST] MCAST rank=21: Error in initializing vmc communicator
[LOG_CAT_P2P] Failed to create MCAST comm
[LOG_CAT_MCAST] MCAST rank=15: Error in initializing vmc communicator
[LOG_CAT_P2P] Failed to create MCAST comm
[LOG_CAT_MCAST] MCAST rank=9: Error in initializing vmc communicator
[LOG_CAT_P2P] Failed to create MCAST comm
[LOG_CAT_MCAST] MCAST rank=16: Error in initializing vmc communicator
[LOG_CAT_P2P] Failed to create MCAST comm
[LOG_CAT_MCAST] MCAST rank=17: Error in initializing vmc communicator
[LOG_CAT_P2P] Failed to create MCAST comm
[LOG_CAT_MCAST] MCAST rank=32: Error in initializing vmc communicator
[LOG_CAT_P2P] Failed to create MCAST comm
[LOG_CAT_MCAST] MCAST rank=18: Error in initializing vmc communicator
[LOG_CAT_P2P] Failed to create MCAST comm
[LOG_CAT_MCAST] MCAST rank=33: Error in initializing vmc communicator
[LOG_CAT_P2P] Failed to create MCAST comm
```

This can occur if the InfiniBand interfaces used on the nodes in an MPI job in hpcx aren't all running at the same speed.  Typically the way to address this would be to fix any problems with the InfiniBand interface links so that they are all running at the same speed.  However, if it is desired to run the job in a scenario with mixed InfiniBand interface speeds, then configuring the job so that the "head" node has the lowest speed of all the nodes in the job (*e.g.*, setting it to the be the first node in the machine file) will prevent this error from being reported.
