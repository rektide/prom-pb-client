#!/usr/bin/env node
"use strict"

var
  handler= require("./handler"),
  Koa= require("koa"),
  KoaCompress= require("koa-compress")

function params( opts, defaults){
	defaults= defaults|| {
		port: 9101,
		threshold: 160
	}
	var env= {
		port: Number.parseInt( process.env.NODE_PORT|| process.env.PORT),
		threshold: Number.parseInt( process.env)
	}
	if( !env.port){
		delete env.port
	}
	if( !env.threshold){
		delete env.threshold
	}
	opts= Object.assign( {}, defaults, env, opts)
	if( !opts.factory){
		throw new Error("Need 'factory' option to generate metrics")
	}
	return opts
}

function server( opts){
	opts= params(opts)

	var server= opts.server|| (new Koa())
	server.use( KoaCompress({
		filter: function(){ return true},
		threshold: opts.threshold
	}))
	server.use( handler)
	server.use( function( ctx, next){
		ctx.body= opts.factory()
	})
	if( opts.port){
		server.listen( opts.port)
	}
}

function main(){
	var nodeVersion= require("./.test/fixture/nodeVersion")
	server({factory:nodeVersion})
}

module.exports= server
module.exports.main= main

if( require.main=== module){
	main()
}

