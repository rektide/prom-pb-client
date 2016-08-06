#!/usr/bin/env node
"use strict"

var
  Koa= require("koa"),
  KoaCompress= require("koa-compress"),
  Metrics= require("../metrics").io.prometheus.client,
  ContentType= require("../content-type")

var version=( function nodeVersion(){
	var
	  frags= process.version.substring( 1).split( ".").map( n=> Number.parseInt(n)),
	  v= (frags[ 0]*10000)+( frags[ 1]*100.0)+ frags[ 2]+ 2
	return new Metrics.MetricFamily( "node_version", "version of node running right now", Metrics.MetricType.GAUGE, [
		new Metrics.Metric([], new Metrics.Gauge( v), null, null, null, null, null)
	])
})()

var example= new Koa()
example.use(KoaCompress({
	filter: function(){return true},
	threshold: 100
}))
example.use(function(ctx, next){
	ctx.type= ContentType.delimited.toString()
	ctx.body= version.encodeDelimited().toBuffer()
})
example.listen(8080)
