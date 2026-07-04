---
title: Troubleshooting issues with nodeattribute expressions
tags:
  - troubleshooting
  - reference
---

An [attribute expression](../user_reference/attributeexpressions.md) will contain some directives wrapped in {} characters.

When using `nodeattrib` substitution there might be the temptation to do substitution of username and passwords which will not work.

### Example
when using `noderun` attribute expressions for bmcuser and bmcpass will not work, this is expected behavior.

```bash
noderun <nodename> ipmitool -I lanplus -U "{bmcuser}" -P {bmcpass} -H {bmc}
```
```text
Password:
n1052: Error: Unable to establish IPMI v2 / RMCP+ session
```

The inability to use attribute expressions for passwords is expected behavior for security reasons. Allowing this functionality
would allow passwords and username to be echoed in plain text
