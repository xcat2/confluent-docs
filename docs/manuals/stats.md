---
title: Manual for stats
---

stats(8) -- Common basic statistics on typical numeric data in output
==============================

## SYNOPSIS

`<var>other command</var> | stats [-c N] [-d D] [-x|-g|-t|-o image.png] [-s N] [-v] [-b N]

## DESCRIPTION

The **stats** command helps analyze common numerical data such as performance numbers
or temperatures or any other numerical value.

By default it looks for the last numerical output on the first line to identify the numerical column
and analyze that number. This can be overriden by **-c COLUMN** to indicate a column. By default,
whitespace and commas are treated to delimit columns, and **-d DELIMITER** can be used to override.

By default it outputs basic statistics, but a histogram is available either text or through X11 output
or sixel or output to an image file depending on whether **-x**, **-g**, **-t*, or **-o image.png** is
used.

## OPTIONS

 * `-c N`:
   Select column number. Defaults to last column that appears numeric

 * `-d D`:
   Specify a custom column delimiter

 * `-x`:
     Output in Sixel format (supported by mlterm and PuTTY, among others)

 * `-g`:
   Try to open histogram as an X window

 * `-t`:
   Output histogram as bars rendered by =

 * `-o image.png`:
   Write graphical histogram to image.png.

 * `-s N`:
   Ignore specified number of lines as header content before processing numbers

 * `-v`:
   Treat value before : on each line as a label, and show which labels belong to which histogram buckets.

 * `-b N`:
   Specify a custom number of buckets for histogram. The default is 10.
   


[SYNOPSIS]: #SYNOPSIS "SYNOPSIS"
[DESCRIPTION]: #DESCRIPTION "DESCRIPTION"
[OPTIONS]: #OPTIONS "OPTIONS"


[collate(1)]: collate.html
[collective(1)]: collective.html
[confetty(8)]: confetty.html
[confluent2hosts(8)]: confluent2hosts.html
[confluentdbutil(8)]: confluentdbutil.html
[confluent(8)]: confluent.html
[l2traceroute(8)]: l2traceroute.html
[nodeapply(8)]: nodeapply.html
[nodeattribexpressions(5)]: nodeattribexpressions.html
[nodeattrib(8)]: nodeattrib.html
[nodebmcpassword(8)]: nodebmcpassword.html
[nodebmcreset(8)]: nodebmcreset.html
[nodeboot(8)]: nodeboot.html
[nodeconfig(8)]: nodeconfig.html
[nodeconsole(8)]: nodeconsole.html
[nodedefine(8)]: nodedefine.html
[nodedeploy(8)]: nodedeploy.html
[nodediscover(8)]: nodediscover.html
[nodeeventlog(8)]: nodeeventlog.html
[nodefirmware(8)]: nodefirmware.html
[nodegroupattrib(8)]: nodegroupattrib.html
[nodegroupdefine(8)]: nodegroupdefine.html
[nodegrouplist(8)]: nodegrouplist.html
[nodegroupremove(8)]: nodegroupremove.html
[nodehealth(8)]: nodehealth.html
[nodeidentify(8)]: nodeidentify.html
[nodeinventory(8)]: nodeinventory.html
[nodelicense(8)]: nodelicense.html
[nodelist(8)]: nodelist.html
[nodemedia(8)]: nodemedia.html
[nodeping(8)]: nodeping.html
[nodepower(8)]: nodepower.html
[noderange(5)]: noderange.html
[noderemove(8)]: noderemove.html
[nodereseat(8)]: nodereseat.html
[nodersync(8)]: nodersync.html
[noderun(8)]: noderun.html
[nodesensors(8)]: nodesensors.html
[nodesetboot(8)]: nodesetboot.html
[nodeshell(8)]: nodeshell.html
[nodestorage(8)]: nodestorage.html
[nodesupport(8)]: nodesupport.html
[osdeploy(8)]: osdeploy.html
[stats(8)]: stats.html
