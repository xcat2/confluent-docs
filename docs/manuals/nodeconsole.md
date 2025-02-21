---
title: Manual for nodeconsole
---

nodeconsole(8) -- Open a console to a confluent node
=====================================================

## SYNOPSIS
`nodeconsole [options] <var>noderange</var> [kill][-- [passthroughoptions]]`

## DESCRIPTION

**nodeconsole** opens an interactive console session to a given node.  This is the
text or serial console of a system.  Exiting is done by hitting `Ctrl-e`, then `c`,
 then `.`.  Note that console output by default is additionally logged to
`/var/log/confluent/consoles/`**NODENAME**.

When the console connection to the target is broken, then confluent on backend
will initiate an automatic retry interval that is randomized between 2 and 4 minutes.
The reopen escape sequence below requests an immediate retry, as does connecting
a new session.

When a windowed console is open the `nodeconsole <var>noderange</var> kill` command will kill the
console process which will result in the console window closing. 

## OPTIONS

* `-t`, `--tile`:
  Use tmux to arrange consoles of the given noderange into a tiled layout on
  the terminal screen

* `-l`, `--log`:
  Perform a log reply on the current, local log in /var/log/confluent/consoles.
  If in collective mode, this only makes sense to use on the current collective
  manager at this time.

  * `-T`, `--Timestamp`:
 Dump the log with Timpstamps on the current, local log in /var/log/confluent/consoles.
  If in collective mode, this only makes sense to use on the current collective
  manager at this time.
  
* `-w`, `--windowed`:
  Open terminal windows for each node.  The
  environment variable **NODECONSOLE_WINDOWED_COMMAND**
  should be set, which should be a text string corresponding
  to a command that can be used to open a windowed console,
  omitting the `nodeconsole <var>noderange</var>` part of the
  command, for example, to open a set of consoles for a
  range of nodes in separate xterm windows, set
  **NODECONSOLE_WINDOWED_COMMAND** to `xterm -e`.  To open a
  set of consoles for a range of nodes in separate
  GNOME Terminal windows with a size of 100 columns and
  31 rows, set **NODECONSOLE_WINDOWED_COMMAND**
  to `gnome-terminal --geometry 100x31 --` or in a WSL
  environment, to open a set of consoles for a range of
  nodes in separate Windows Terminal windows, with the
  title set for each node, set **NODECONSOLE_WINDOWED_COMMAND**
  to `wt.exe wsl.exe -d AlmaLinux-8 --shell-type login.  If the
  NODECONSOLE_WINDOWED_COMMAND environment variable isn't set,
  xterm will be used bydefault.

## ESCAPE SEQUENCE COMMANDS

While connected to a console, a number of commands may be performed through escape
sequences.  To begin an command escape sequence, hit `Ctrl-e`, then `c`.  The next
keystroke will be interpreted as a command.  The following commands are available.

* `.`:
  Exit the session and return to the command prompt
* `b`:
  [send Break]
  Send a break to the remote console when possible (some console plugins may not support this)
* `o`:
  [reOpen]
  Request confluent to disconnect and reconnect to console.  For example if there is suspicion
  that the console has gone inoperable, but would work if reconnected.
* `po`:
  [Power Off]
  Power off server immediately, without waiting for OS to shutdown
* `ps`:
  [Power Shutdown]
  Request OS shut down gracefully, and then power off
* `pb<var>ent</var>`:
  [Power Boot]
  Cause system to immediately boot, resetting or turning on as appropriate.
  Hitting enter is required to execute the reboot rather than another pb sequence
* `pbs`:
  [Power Boot Setup]
  Request immediate boot ultimately landing in interactive firmware setup
* `pbn`:
  [Power Boot Network]
  Request immediate boot to network
* `r`:
  [send Resize]
  This queries the current terminal and sends stty commands to advertise the user termineal
  size to the remote console
* `?`:
  Get a list of supported commands
* `<var>ent</var>`:
  Hit enter to skip entering a command at the escape prompt.


## PASSTHROUGH OPTIONS

While opening a windowed console with xterm or any other console of choice. The 
nodeconsole command gives capality to specify passthrough options targeted at 
the console. All options after the -- will be parsed the console program. For 
example, opening a windowed console using xterm with a black background. 
`nodeconconsole -w n1 -- -bg black`  




[SYNOPSIS]: #SYNOPSIS "SYNOPSIS"
[DESCRIPTION]: #DESCRIPTION "DESCRIPTION"
[OPTIONS]: #OPTIONS "OPTIONS"
[ESCAPE SEQUENCE COMMANDS]: #ESCAPE-SEQUENCE-COMMANDS "ESCAPE SEQUENCE COMMANDS"
[PASSTHROUGH OPTIONS]: #PASSTHROUGH-OPTIONS "PASSTHROUGH OPTIONS"


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
