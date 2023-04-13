---
layout: page
title: Troubleshooting issues with nodefirmware and firmware updates
permalink: /documentation/confluentnodefirmwareupdatetroubleshooting.html
---

## Known issues:

1. Updating the XCC backup firmware on Lenovo servers with nodefirmware may appear to succeed but updates the primary bank instead, when using the default *.zip file such as lnvgy_fw_xcc_qgx306n-1.00_anyos_comp.zip.
    
    This can be worked around by extracting the *.zip file and using the *.uxz payload file directly with nodefirmware:
    ```
    # unzip lnvgy_fw_xcc_qgx306n-1.00_anyos_comp.zip
    # ls -1 *
    ```

    index.json
    lnvgy_fw_xcc_qgx306n-1.00_anyos_comp.chg\
    lnvgy_fw_xcc_qgx306n-1.00_anyos_comp.html\
    lnvgy_fw_xcc_qgx306n-1.00_anyos_comp_index.json\
    lnvgy_fw_xcc_qgx306n-1.00_anyos_comp_inventory.json\
    lnvgy_fw_xcc_qgx306n-1.00_anyos_comp_signature.json\
    lnvgy_fw_xcc_qgx306n-1.00_anyos_comp.txt\

    payloads:\
    lnvgy_fw_xcc_qgx306n-1.00_anyos_comp.uxz

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