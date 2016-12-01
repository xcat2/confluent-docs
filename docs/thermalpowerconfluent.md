---
layout: page
title: Power and Cooling Monitoring with Confluent
permalink: /documentation/thermalpowerconfluent.html
---

Confluent provides access to various power and cooling data on the monitored hardware.
Here we will go through two general strategies to accessing the data, from a shell such
as bash, or using an API (over the web, via python, or using the confetty CLI API browser).

## From a shell

Exceptional thermal and power conditions warranting attention are provided by the `nodehealth` command, alongside
conditions such as bad hardware components.

	# nodehealth n507
	n507: failed (Fan 1A Tach:0.0RPM,lower critical threshold,Fan 1B Tach:0.0RPM,lower critical threshold,Fan 2A Tach:0.0RPM,lower critical threshold,Fan 2B Tach:0.0RPM,lower critical threshold,Power Supply 1:Present,Failure,PS1 12Vaux Fault:Non-recoverable,Sys Boot Status:Boot error)

This may include fan failures, bad temperature conditions, performance impact
due to throttling, and so on.

For telemetry, the `nodesensors` command provides access to available power and
cooling related data.  A key sensor of interest is the 'DC Energy' sensor:

	# nodesensors n1 dc_energy
	n1: DC Energy: 19.5191344589 kWh

Using this value before and after some interval enables you to know the 
kilowatt hours have been consumed over that time.  You can use this information
to calculate average power over an interval of your choosing.  For example, to
know the average power before and after a 2 minute job (using sleep 120 as
an example):

	# nodesensors -c -n 1 n1 dc_energy; sleep 120; nodesensors -c -n 1 n1 dc_energy
	time,node,DC Energy (kWh)
	2016-10-17T10:39:37,n1,19.5271293078
	time,node,DC Energy (kWh)
	2016-10-17T10:41:37,n1,19.5294681086

We take the difference in the kWh (0.0023388008) and divide by time elapsed in
hours according to the timestamps (in bash, the timestamps may be subtracted):

	# echo $((`date -d 2016-10-17T10:41:37 +%s`-`date -d 2016-10-17T10:39:37 +%s`))
	120

So we can use the change in kWh divided by the interval in hours (dividing
 seconds by 3600):

	# echo 'scale=3;0.0023388008/(120/3600.0)'|bc
	.070

This means the system used on average 0.070 kW (70 Watts) over the interval.

Various other data is available under nodesensors.  For example, to retrieve
all the temperature sensors in a system in CSV format over time for 5 seconds:

	# nodesensors n721 temperature -c -i 1 -n 5
	time,node,Ambient Temp (°C),CPU 1 OverTemp,CPU 2 OverTemp,CPU1 Temp (°C),CPU1 VR OverTemp,CPU2 Temp (°C),CPU2 VR OverTemp,GPU Outlet Temp (°C),HDD Inlet Temp (°C),PCH Temp (°C),PCI 2 Temp,PCI 3 Temp,PCI 4 Temp,PCI 5 Temp,PCI Riser 1 Temp (°C),PCI Riser 2 Temp (°C),PIB Ambient Temp (°C),Riser1 8764 Temp (°C),Riser2 8764 Temp (°C)
	2016-10-17T11:28:07,n721,21.0,Ok,Ok,24.0,,26.0,,25.0,25.0,31.0,Ok,Ok,Ok,Ok,21.0,25.0,24.0,29.0,28.0
	2016-10-17T11:28:08,n721,21.0,Ok,Ok,24.0,,26.0,,25.0,25.0,31.0,Ok,Ok,Ok,Ok,21.0,25.0,24.0,29.0,28.0
	2016-10-17T11:28:09,n721,21.0,Ok,Ok,24.0,,26.0,,25.0,25.0,31.0,Ok,Ok,Ok,Ok,21.0,25.0,24.0,29.0,28.0
	2016-10-17T11:28:10,n721,21.0,Ok,Ok,24.0,,27.0,,25.0,25.0,31.0,Ok,Ok,Ok,Ok,21.0,25.0,24.0,29.0,28.0
	2016-10-17T11:28:11,n721,21.0,Ok,Ok,24.0,,27.0,,25.0,25.0,31.0,Ok,Ok,Ok,Ok,21.0,25.0,24.0,29.0,28.0



## Using the API (python or web)

Live power and cooling data is available from confluent
via the 'sensors' portion of the API.  See the
[API reference]({{ site.baseurl }}/documentation/developer/api.html)
for a general introduction to general usage of the API.

Specifically, the sensors of interest are under the `/sensors/hardware/temperature` and `/sensors/hardware/power`
categories.  Here is an example using curl to illustrate retrieving a single temperature on a single system:

	# curl -u apiuser:apipassword http://localhost:4005/nodes/n721/sensors/hardware/temperature/cpu1_temp.json
	{
	    "_links": {
		"collection": {
		    "href": "./.json"
		}, 
		"self": {
		    "href": "./cpu1_temp.json"
		}
	    }, 
	    "sensors": [
		{
		    "health": "ok", 
		    "name": "CPU1 Temp", 
		    "state_ids": [], 
		    "states": [], 
		    "type": "Temperature", 
		    "units": "°C", 
		    "value": 24.0
		}
	    ]
	}

As in all the confluent API, a single bulk request can be done against a noderange:

	# curl -u apiuser:apipassword http://localhost:4005/noderange/n721-n723/sensors/hardware/temperature/cpu1_temp.json
	{
	    "_links": {
		"collection": {
		    "href": "./.json"
		}, 
		"self": {
		    "href": "./cpu1_temp.json"
		}
	    }, 
	    "databynode": [
		{
		    "n723": {
			"error": "timeout"
		    }
		}, 
		{
		    "n722": {
			"sensors": [
			    {
				"health": "ok", 
				"name": "CPU1 Temp", 
				"state_ids": [], 
				"states": [], 
				"type": "Temperature", 
				"units": "°C", 
				"value": 27.0
			    }
			]
		    }
		}, 
		{
		    "n721": {
			"sensors": [
			    {
				"health": "ok", 
				"name": "CPU1 Temp", 
				"state_ids": [], 
				"states": [], 
				"type": "Temperature", 
				"units": "°C", 
				"value": 24.0
			    }
			]
		    }
		}
	    ]
	}



