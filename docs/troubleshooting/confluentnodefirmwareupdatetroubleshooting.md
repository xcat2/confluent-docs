---
title: Troubleshooting issues with nodefirmware and firmware updates
---

## Known issues:

1. Updating the XCC backup firmware on Lenovo servers with nodefirmware may appear to succeed but updates the primary bank instead, when using the default *.zip file such as lnvgy_fw_xcc_qgx306n-1.00_anyos_comp.zip.

    This can be worked around by extracting the *.zip file and using the *.uxz payload file directly with nodefirmware:

    ```
    # unzip lnvgy_fw_xcc_qgx306n-1.00_anyos_comp.zip
    # ls -1 *
    ```

    ```bash
    index.json
    lnvgy_fw_xcc_qgx306n-1.00_anyos_comp.chg\
    lnvgy_fw_xcc_qgx306n-1.00_anyos_comp.html\
    lnvgy_fw_xcc_qgx306n-1.00_anyos_comp_index.json\
    lnvgy_fw_xcc_qgx306n-1.00_anyos_comp_inventory.json\
    lnvgy_fw_xcc_qgx306n-1.00_anyos_comp_signature.json\
    lnvgy_fw_xcc_qgx306n-1.00_anyos_comp.txt\

    payloads:\
    lnvgy_fw_xcc_qgx306n-1.00_anyos_comp.uxz
    ```

    The *.uxz file under the payloads directory may then be used to update the XCC backup firmware in the usual fashion:

    ```
    # nodefirmware <nodename> update payloads/lnvgy_fw_xcc_qgx306n-1.00_anyos_comp.uxz --backup
    ```

2. In some cases updating the XCC primary firmware with nodefirmware on Lenovo servers may fail with an error, such as below, when using the default *.zip file such as lnvgy_fw_xcc_qgx306n-1.00_anyos_comp.zip:

    Nodes had errors updating (\<nodename>)! \<nodename>: ('[{"@odata.type": "#Message.v1_1_2.Message", "MessageId": "Update.1.0.VerificationFailed", "MessageSeverity": "Critical", "Message": "Verification of image \'upload_file\' at \'Unknown\' failed.", "Resolution": "None.", "MessageArgs": ["upload_file", "Unknown"]}]',)

    As in item 1. above, the problem can be worked around by extracting the *.uxz payload file from the *.zip package and using it directly:

    ```
    #nodefirmware <nodename> update payloads/lnvgy_fw_xcc_qgx306n-1.00_anyos_comp.uxz
    ```

3. After updating XCC or UEFI firmware, the “Pending” status may not show if the system is managed via Redfish. The update is in fact pending, but the status does not show. To get the status to show, change the management method to IPMI:

    ```
    # nodeattrib <nodename> hardwaremanagement.method=ipmi
    ```

4. nodefirmware may report an error on BMU type update when there is no actual error.
    To confirm whether the error is real, monitor the update (the boot to BMU and boot back to previous state after firmware update is complete) and check the firmware level after the update. If the firmware is updated then ignore the nodefirmware error message.

5. When doing a nodefirmware update on a BMU type update, nodefirmware will return a pending status. This is actually the wrong state of the update as the update would be done and the firmware already applied. Reading the firmware should confirm that the update is already applied. 

6. When doing a nodefirmware update of LXUM firmware, nodefirmware will return a pending status. This is actually the wrong state of the update as the update would be done and the firmware already applied. Reading the firmware should confirm that the update is already applied.

7. When performing out-of-band firmware updates through the XCC, particularly through the XCC web interface, sometimes the XCC will report in the browser view special actions to be taken after the firmware update. The confluent nodefirmware command does not report these special actions. To make sure the right post-firmware update actions are taken after the firmware update with nodefirmware, do a trial update (this only has to be done once per firmware package) on a system through the XCC web browser to get this information. The confluent nodefirmware command can then be used at scale for the rest of the systems and the recommended action from the trial XCC web interface run can be done at scale with other confluent commands (e.g., nodeshell reboot, or nodeshell poweroff, etc.).
