---
title: InfiniBand install with confluent
tags:
  - deployment
---

Please refer to [Preparing for Operating System Deployment](../advanced_topics/confluentosdeploy.md) for the confluent OS deployment process.

The confluent deployment process for installing over InfiniBand requires the following modifications:

=== "RHEL 8"

    **Driver update media:**

    Occasionally for network deployment of a RHEL or CentOS the modules included in the install initrd for the OS aren't sufficient to work with the network device being installed over (for example, if the network device is very new and the driver support hasn't been added to the OS yet).  In that scenario a driver update media package for that network device can be used to provide support for that network device during and after the OS installation.  See [Using driver update media for RedHat/CentOS](../advanced_topics/driverupdatemedia.md) for the procedure.

    **Net config fixup postscript:**

    InfiniBand network configuration does not work as expected out of the box.  If not installing Mellanox OFED, the following is an example of a
    postscript that can be added to correct that behavior:

    ```console
    # cat /var/lib/confluent/public/os/your-profile-here/scripts/pod.d/fixipoib
    echo 'install mlx5_core /sbin/modprobe --ignore-install mlx5_core; /sbin/modprobe mlx5_ib; /sbin/modprobe ib_ipoib' >> /etc/modprobe.d/mlx.conf
    echo 'add_drivers+="mlx5_ib ib_ipoib"' > /etc/dracut.conf.d/mlx.conf
    dracut -f
    ```

    **Kernel command line configuration:**

    Change the profile.yaml file in the OS profile to be deployed to add:

    ```text
    rd.driver.pre="mlx5_ib,ib_ipoib"
    ```

    on the kernel.args line.

    Then run:

    ```bash
    osdeploy updateboot <OS profile name>
    ```

=== "SLE 15.2"

    **Net config fixup postscript:**

    InfiniBand network configuration does not work as expected out of the box.  If not installing Mellanox OFED, the following is an example of a
    postscript that can be added to correct that behavior:

    ```console
    # cat /install/postscripts/fixipoib
    echo 'install mlx5_core /sbin/modprobe --ignore-install mlx5_core; /sbin/modprobe mlx5_ib; /sbin/modprobe ib_ipoib' >> /<profile dir>/scripts/post.d/mlx.conf
    echo 'add_drivers+="mlx5_ib ib_ipoib"' > /<profile dir>/scripts/post.d/mlx.conf
    dracut -f
    ```

    **Kernel command line configuration:**

    Change the profile.yaml file in the OS profile to be deployed to add:

    ```text
    insmod="ib_ipoib"
    ```

    and run:

    ```bash
    osdeploy updateboot <OS profile name>
    ```
