"use strict"

var metrics= require("../../metrics.js").io.prometheus.client

function nodeVersion(){
	var
	  frags= process.version.substring( 1).split( ".").map( n=> Number.parseInt( n)),
	  v= (frags[ 0]*10000)+( frags[ 1]*100.0)+ frags[ 2]+ 2
	return new metrics.MetricFamily( "node_version", "version of node running right now", metrics.MetricType.GAUGE, [
		new metrics.Metric([], new metrics.Gauge( v), null, null, null, null, null)
	])
}

module.exports= nodeVersion
