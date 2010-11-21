#!/usr/bin/env node

var fs = require( "fs" ),
    path = require( "path" ),
    root = path.normalize( __dirname + "/.." ); 

fs.readdirSync( root + "/test" ).forEach( function( file ) {
    file = file.replace( /\.js$/, "" );
    require( root + "/test/" + file );
});


