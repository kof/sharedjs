#!/usr/bin/env node

var fs = require( "fs" ),
    path = require( "path" ),
    root = path.normalize( __dirname + "/.." ),
    file = process.argv[2]; 

global.a = require( "assert" );

if ( file ) {
    global.$ = require( root + "/src/" + file );
    require( root + "/test/" + file );
} else {
    global.$ = require( root + "/lib/shared" );
    fs.readdirSync( root + "/test" ).forEach( function( file ) {
        file = file.replace( /\.js$/, "" );
        require( root + "/test/" + file );
    });
}


