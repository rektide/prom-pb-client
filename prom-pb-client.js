"use strict"

var
  metrics= require( "./metrics").
  util= require( "util")

// Counter+ gauge
function inc( n){
	this.value+= n
	return this
}

metrics.messages.Counter.prototype.inc= metrics.Gauge.prototype.inc= inc
metrics.messages.Counter.prototype.reset= metrics.Gauge.prototype.reset= (function reset(){
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
metrics.messages.Gauge.prototype.dec= dec
metrics.messages.Gauge.prototype.set= set
metrics.messages.Gauge.prototype.setToCurrentTime= setToCurrentTime
metrics.messages.Gauge.prototype.trackPromise= trackPromise
metrics.messages.Gauge.prototype.track= track

// Summary override
var _td= function(){
	_td= require("tdigest").TDigest
	return _td
}
function Summary(){
	metrics.messages.Summary.apply(this, arguments)
	this.td= new _td()
	return this
}
util.inherits(Summary, metrics.messages.Summary)
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
		return new metrics.messages.Quantile( percentile, value)
	})
	return this
}

// Export default protobufs
for( var i in metrics.messages){
	module.exports[ i]= metrics.messages[ i]
}
// Overwritten protobufs
module.exports.Summary= Summary
// Additional exports
module.exports.koaHandler= require( "./handler")
