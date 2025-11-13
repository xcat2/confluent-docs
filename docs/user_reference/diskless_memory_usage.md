Memory usage of diskless has a number of factors to keep in mind.

## tethered (statelite)

First, we will delve into the behavior of `tethered` diskless, where nodes download from the deployment servers on demand, rather than hosting the image in memory. In this approach, memory is kept at a minimum, in many cases approximately the same as booting from a local disk.

For reference, here is an example `free` output from a traditionally installed node, after dropping cache:

```
# free -m
               total        used        free      shared  buff/cache   available
Mem:            7679         342        7440           8          69        7337
Swap:           3279           0        3279

```

First we boot to a fairly stock diskless image, and we can compare the free memory:

```
# free -m
               total        used        free      shared  buff/cache   available
Mem:            7935         403        7628          42         116        7532
Swap:              0           0           0
```

As expected, the memory consumption for both diskfull and diskless are comparable.  If we induce a heavy read of the filesystem,
then content will become memory resident, just like it would for a diskfull installation:

```
# find /usr -type f -exec cat {} + > /dev/null
# free -m
               total        used        free      shared  buff/cache   available
Mem:            7935         488        6498          42        1246        7447
Swap:              0           0           0
```

However, just as with a diskfull system, that memory is 'evictable' and the OS can freely reclaim that memory if needed.  We can simulate the scenario by dropping cache:

```
# echo 3 > /proc/sys/vm/drop_caches 
# free -m
               total        used        free      shared  buff/cache   available
Mem:            7935         400        7631          42         116        7535
Swap:              0           0           0
```

So reading data causes memory consumption via cache, but that can be reclaimed.  But what if we write data to the filesystem?  We will start with creating a large file of random data, waiting some time, dropping cache, and looking at the result:
```
# dd if=/dev/urandom of=/bigfile bs=1M count=1024
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 3.44189 s, 312 MB/s
# sleep 60
# echo 3 > /proc/sys/vm/drop_caches 
# free -m
               total        used        free      shared  buff/cache   available
Mem:            7935        1488        6543          42         116        6447
Swap:              0           0           0
```

Here we see that our used memory has gone up by about the full gigabyte of that file.  This memory usage is firmly established for
the lifetime of the file. We can reclaim that memory usage by deleting the file and waiting:
```
# rm /bigfile 
rm: remove regular file '/bigfile'? y
# sleep 60
# free -m
               total        used        free      shared  buff/cache   available
Mem:            7935         451        7576          42         122        7483
Swap:              0           0           0
```
The memory is largely reclaimed by the deletion.  This example with random data was a worst case, if the data is compressible, then the cost of the file is greatly reduced:

```
# dd if=/dev/zero of=/bigfile bs=1M count=1024
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB, 1.0 GiB) copied, 0.495381 s, 2.2 GB/s
# sleep 60
# echo 3 > /proc/sys/vm/drop_caches 
# free -m
               total        used        free      shared  buff/cache   available
Mem:            7935         546        7485          42         116        7389
Swap:              0           0           0

```

In this case, the write layer compression was effective in mitigating the memory cost of that file.


## untethered (stateless/diskless)

This characterizes the behavior of the `tethered` mode of operation, so we can now look at the behavior of `untethered` diskless.  First we boot and take a look at initial state, after dropping cache:

```
# free -m
               total        used        free      shared  buff/cache   available
Mem:            7935        1360        6670          37         113        6575
Swap:              0           0           0
```

We can see the rather large increase in 'used' memory to back the compressed ram-resident filesystem.  We will still incur an increase in evictable cache memory in addition to the used memory on a large operation:
```
# find /usr -type f -exec cat {} + > /dev/null
# free -m
               total        used        free      shared  buff/cache   available
Mem:            7935        1468        5524          37        1227        6466
Swap:              0           0           0
```

Here we still incur the increase in used memory, but also carry the data mostly replicated in cache as well. Just as in `tethered`, that cache is evictable and can be reclaimed easily by the OS:
```
# echo 3 > /proc/sys/vm/drop_caches 
# free -m
               total        used        free      shared  buff/cache   available
Mem:            7935        1359        6671          37         113        6576
Swap:              0           0           0
```

We are able to reclaim some memory capacity by deleting parts of the image if we see fit, even after booting (as of 3.15...):

```
# free -m
               total        used        free      shared  buff/cache   available
Mem:            7935        1404        6608          37         149        6531
Swap:              0           0           0
# rm -rf /usr/lib/firmware/
# free -m
               total        used        free      shared  buff/cache   available
Mem:            7935         983        7029          37         150        6952
Swap:              0           0           0
```

