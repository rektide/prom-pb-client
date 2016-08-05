"use strict"

var
  delimited= "application/vnd.google.protobuf; proto=io.prometheus.client.MetricFamily; encoding=delimited",
  text= "application/vnd.google.protobuf; proto=io.prometheus.client.MetricFamily; encoding=text",
  compact= "application/vnd.google.protobuf; proto=io.prometheus.client.MetricFamily; encoding=compact-text"

module.exports= new String(delimited)
Object.defineProperties(module.exports, { // non-visible "meta"-info
	'@type': {
		value: "application/vnd.google.protobuf"
	},
	proto: {
		value: "io.prometheus.client.MetricFamily"
	},
	encoding: {
		value: "delimited"
	}
})
module.exports.delimited= module.exports
module.exports.text= new String(text)
Object.defineProperties(module.exports.text, {
	'@type':{
		value: "application/vnd.google.protobuf"
	},
	proto: {
		value: "io.prometheus.client.MetricFamily"
	},
	encoding: {
		value: "text"
	}
})
module.exports.compactText= new String(compact)
Object.defineProperties(module.exports.compactText, {
	'@type':{
		value: "application/vnd.google.protobuf"
	},
	proto:{
		value: "io.prometheus.client.MetricFamily"
	},
	encoding:{
		value: "compact-text"
	}
})


/**
  For a given content type, find known matches.
  @param {string} type - the content-type
  @param {Object} quals - parameters on the content type.
*/
function find( type, quals){
	if( type!= "application/vnd.google.protobuf"&& quals.proto!= "io.prometheus.client.MetricFamily"){
		return
	}
	for( var e in module.exports){
		var encoding= module.exports[ e]
		if( encoding.encoding== quals.encoding){
			return encoding
		}
	}
}

// non-visible alias
Object.defineProperties( module.exports,{
	"compact-text":{
		value: module.exports.compact,
		enumerable: false
	},
	find:{
		value: find,
		enumerable: false
	}
})

/**
  Resolve a single content type into a type
  @param {string} str - the content type to lookup
  @param {bool} raw - if true, return the parsed content-type without trying to look it up
*/
function typeParse(str, raw){
	var
	  frags= str.split(";"),
	  type= frags.pop(),
	  quals= {}
	for( var i= 0; i< frags.length; ++i){
		var split= frags.split("=", 1)
		quals[split[0]]= split[1]|| null
	}
	if( raw!== true){
		return find(type, quals)
	}else{
		return {
			type: type,
			quals: quals
		}
	}
}
