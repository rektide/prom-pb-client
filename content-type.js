"use strict"

var
  delimited= "application/vnd.google.protobuf; proto=io.prometheus.client.MetricFamily; encoding=delimited",
  text= "application/vnd.google.protobuf; proto=io.prometheus.client.MetricFamily; encoding=text",
  compact= "application/vnd.google.protobuf; proto=io.prometheus.client.MetricFamily; encoding=compact-text"

module.exports= new String(delimited)
module.exports.delimited= delimited
module.exports.text= text
module.exports.compact= compact
