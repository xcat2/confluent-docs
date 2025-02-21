---
layout: page
title: Energy histogram
permalink: /documentation/energyhistogram.html
---

Lenovo servers capture power level over time and provide
information about the power usage over time in the
form of a histogram.

In order to retrieve the current accumulated histogram data:

	# renergy n1 relhistogram
	n1: 30w-34w: 112
	n1: 70w-74w: 6561
	n1: 75w-79w: 36892
	n1: 80w-84w: 2814
	n1: 85w-89w: 27834
	n1: 90w-94w: 1104
	n1: 95w-99w: 1520
	n1: 100w-104w: 2272
	n1: 105w-109w: 2576
	n1: 110w-114w: 400
	n1: 115w-119w: 259
	n1: 120w-124w: 369
	n1: 125w-129w: 96
	n1: 130w-134w: 48
	n1: 135w-139w: 16
	n1: 145w-149w: 16
	n1: 150w-154w: 64
	n1: 155w-159w: 864
	n1: 160w-164w: 1776
	n1: 165w-169w: 3858
	n1: 170w-174w: 14398
	n1: 175w-179w: 50798
	n1: 180w-184w: 16

In order to use the data to measure the histogram of
power usage over a desired interval, capture
this data at the beginning of the interval and then again
at the conclusion of the interval and subtract the final
result from the initial.  Note that the interval should 
not exceed 12 hours, as beyond that some of the individual
counters may wrap.

