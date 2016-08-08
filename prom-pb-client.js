"use strict"

var metrics= require( "./metrics").io.prometheus.client

function inc( n){
	this.value+= n
}
function dec( n){
	this.value-= n
}
function set( n){
	this.value= n
}
function setToCurrentTime(){
	this.value= Date.now()/1000
}
var _perfnow= function(){
	_perfnow= require("performance-now")
	return _perfnow()
}
function trackPromise(promise){
	var start= _perfnow()
	return promise.then(()=>{
		this.value= _perfnow()- start
		return this
	})
}
function track(){
	var start= _perfnow()
	return function end(){
		this.value= _perfnow()- start
		return this
	}
}

metrics.Counter.prototype.inc= inc
metrics.Gauge.prototype.inc= inc
metrics.Gauge.prototype.dec= dec
metrics.Gauge.prototype.set= set
metrics.Gauge.prototype.setToCurrentTime= setToCurrentTime
metrics.Gauge.prototype.trackPromise= trackPromise
metrics.Gauge.prototype.track= track

for( var i in metrics){
	module.exports[ i]= metrics[ i]
}
module.exports.koaHandler= require("./handler")
