---
layout: page
title: xCAT stateless image creation under SLES 15.2 fails
permalink: /documentation/xcatstatelessimagesles152.html
---

During the process of creating an `xCAT stateless image` under `SLES 15.2`, the xCAT genimage command may fail due to failure to locate the software packages in the distribution, even though the software repositories appear to be set up correctly.

Repetitive output such as the following would be seen:

    Loading repository data...
    Reading installed packages...
    'aaa_base' not found in package names. Trying capabilities.
    No provider of 'aaa_base' found.

In the example where the SLES 15.2 distribution has been extracted (`via the xCAT copycds utility`) onto an xCAT management node in the `/install/sle15.2/x86_64` directory, `the workaround` for the above problem would be to `rename the file` `/install/sle15.2/x86_64/1/repodata`, such as to `/install/sle15.2/x86_64/1/repodata-ignore`.

At this point, the genimage command can be rerun and should succeed.

### Note:

Once the stateless image creation process is completed, the above file to be restored to its original name.
