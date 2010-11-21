#!/usr/bin/env node

var fs = require( "fs" ),
    path = require( "path" ),
    root = path.normalize( __dirname + "/.." ); 


var intro = fs.readFileSync( root + "/src/intro.js" ) + "\n",
    outro = fs.readFileSync( root + "/src/outro.js" );


// create full build
var data = intro;
fs.readdirSync( root + "/src" ).forEach( function( file ) {
    if ( file !== "intro.js" && file !== "outro.js" ) {
        data += fs.readFileSync( root + "/src/" + file ) + "\n";
    }
});
data += outro;
fs.writeFileSync( root + "/lib/shared.js", data, "utf-8" );
    

