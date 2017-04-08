"use strict"

var
  ByteBuffer= require("bytebuffer"),
  ContentType= require("./content-type")

function setMetricFamily( metrics, ctx){
	ctx.body= metrics.encodeDelimited().toBuffer()
	ctx.type= ContentType.delimited.toString()
}

function setMetricFamilies( metricsArray, ctx){
	var byteBuffer= ByteBuffer.allocate(8191)
	for(var i= 0; i< metricsArray.length; ++i){
		metricsArray.encodeDelimited( byteBuffer)
	}
	ctx.body= byteBuffer.toBuffer()
	ctx.type= ContentType.delimited.toString()
}

function set( metrics, ctx){
	if( !metrics){
		return
	}
	if( metrics.encodeDelimited){
		setMetricFamily( metrics, ctx)
	}else if(metrics[0]&& metrics[0].encodeDelimited){
		setMetricFamilies( metrics, ctx)
	}
}

/**
  Koa2 handler that looks for appropriate protobuf io.prometheus.client content-type and which decodes
  body payloads from raw protobuf (or protobuf promises) into the delimited buffer prometheus wants.
*/
function koaHandler( ctx, next){
	var processed= next()
	var accepts= ctx.accepts( ContentType.delimited.toString())
	if( accepts){
		processed= processed.then(function(){
			if( ctx.body){
				if( !ctx.body.then){
					set( ctx.body, ctx)
				}else{
					return ctx.body.then(function(body){
						set(body, ctx)
					})
				}
			}
		})
	}
	return processed
}

module.exports= koaHandler
module.exports.koaHandler= koaHandler
module.exports.set= set
module.exports.setMetricFamily= setMetricFamily
module.exports.setMetricFamilies= setMetricFamilies
