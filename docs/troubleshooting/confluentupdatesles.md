---
layout: page
title: Troubleshooting issue with updating confluent on SLES 15
permalink: /documentation/confluentupdatesles.html
---

## Known Issue: 

1. Updating confluent version 3.5 or less to confluent version 3.6.2 on SLES 15 may fail and show a message such as below:

    <i>There is an update candidate for 'confluent_client' from vendor 'Lenovo', while the current vendor is 'Jarrod Johnson <jjohnson2@lenovo.com>'.</i>

- Solution:

    Run the zypper up command with --allow-vendor-change option specified:
    ```
    # zypper up --allow-vendor-change
    ```


