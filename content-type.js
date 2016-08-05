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


// for a given content type, find matches
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

