#!/usr/bin/env node

var fs = require( "fs" ),
    path = require( "path" ),
    root = path.normalize( __dirname + "/.." ); 

global.$ = require( root + "/lib/shared" );
global.a = require( "assert" );

fs.readdirSync( root + "/test" ).forEach( function( file ) {
    file = file.replace( /\.js$/, "" );
    require( root + "/test/" + file );
});


