"use strict"

var
  metrics= require( "./metrics").io.prometheus.client,
  util= require( "util")

// Counter+ gauge
function inc( n){
	this.value+= n
	return this
}

metrics.Counter.prototype.inc= metrics.Gauge.prototype.inc= inc
metrics.Counter.prototype.reset= metrics.Gauge.prototype.reset= (function reset(){
	this.value= 0
	return this
})

// Gauge
function dec( n){
	this.value-= n
	return this
}
function set( n){
	this.value= n
	return this
}
function setToCurrentTime(){
	this.value= Date.now()/1000
	return this
}
var _perfnow= function(){
	_perfnow= require("performance-now")
	return _perfnow()
}
function trackPromise(promise){
	var start= _perfnow()
	var end= ()=>{
		this.value= _perfnow()- start
		return this
	}
	return promise.then(end)
}
function track(){
	var start= _perfnow()
	var end= ()=>{
		this.value= _perfnow()- start
		return this
	}
	return end
}
metrics.Gauge.prototype.dec= dec
metrics.Gauge.prototype.set= set
metrics.Gauge.prototype.setToCurrentTime= setToCurrentTime
metrics.Gauge.prototype.trackPromise= trackPromise
metrics.Gauge.prototype.track= track

// Summary override
var _td= function(){
	_td= require("tdigest").TDigest
	return _td
}
function Summary(){
	metrics.Summary.apply(this, arguments)
	this.td= new _td()
	return this
}
util.inherits(Summary, metrics.Summary)
Summary.prototype.observe= (function observe( n){
	++this.sample_count
	this.sample_sum+= n
	return this
})
Summary.prototype.reset= (function reset(){
	this.sample_count= 0
	this.sample_sum= 0
	this.td.reset()
	return this
})
Summary.prototype.percentile= function(){
	this.td.compress()
	this.quantile= Array.prototype.map.call( arguments, function(percentile){
		var value= this.td.percentile( percentile)
		return new metrics.Quantile( percentile, value)
	})
	return this
}

// Export default protobufs
for( var i in metrics){
	module.exports[ i]= metrics[ i]
}
// Overwritten protobufs
module.exports.Summary= Summary
// Additional exports
module.exports.koaHandler= require( "./handler")
