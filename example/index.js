#!/usr/bin/env node
"use strict"

var
  Koa= require("koa"),
  KoaCompress= require("koa-compress")

var example= new Koa()
example.use(KoaCompress())
example.use(function(ctx, next){
	ctx.headers["Content-Type"] = "application/vnd.google.protobuf; proto=io.prometheus.client.MetricFamily; encoding=delimited"
})
