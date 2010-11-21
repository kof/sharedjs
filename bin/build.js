#!/usr/bin/env node

var fs = require( "fs" ),
    path = require( "path" ),
    root = path.normalize( __dirname + "/.." ); 


var intro = "(function( exports, global, undefined ) { if ( !exports ) { global = this; exports = global.$ = {}; }",
    outro = "}( exports, global ));";


// create full build
var data = intro;
fs.readdirSync( root + "/src" ).forEach( function( file ) {
    data += fs.readFileSync( root + "/src/" + file ) + "\n";
});
data += outro;
fs.writeFileSync( root + "/lib/shared.js", data, "utf-8" );
    

