---
title: Troubleshooting issue with updating confluent on SLES 15
tags:
  - troubleshooting
---

## Known Issue

1. Updating confluent version 3.5 or less to confluent version 3.6.2 on SLES 15 may fail and show a message such as below:

    ```text
    There is an update candidate for 'confluent_client' from vendor 'Lenovo', while the current vendor is 'Jarrod Johnson <jjohnson2@lenovo.com>'.
    ```

    - Solution:

        Run the zypper up command with --allow-vendor-change option specified:

        ```bash
        zypper up --allow-vendor-change
        ```
