---
layout: page
title: Troubleshooting issues with nodefirmware and firmware updates
permalink: /documentation/nodeattribexpressionstroubleshooting.html
---

An expression will contain some directives wrapped in {} characters. Within {} are a number of potential substitute values and operations.

When using nodeattrib substitution there might be the temptation to do substition passwords which will not work. 

### Example 
when using noderun using attribute expressions for bmcuser and bmcpass will not work this is expected behavior. 
```
noderun <nodename> ipmitool -I lanplus -U "{bmcuser}" -P {bmcpass} -H {bmc}
```
```
Password:
n1052: Error: Unable to establish IPMI v2 / RMCP+ session
```   

The inability to use attribute expressions for passwords is expected behavior for security reasons. Allowing this functionality 
would allow passwords and username to be echoed in plane text