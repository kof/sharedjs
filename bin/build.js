#!/usr/bin/env node

var fs = require( "fs" ),
    path = require( "path" ),
    root = path.normalize( __dirname + "/.." ),
    args = require( root + "/deps/argsparser" ).parse(); 


var intro = fs.readFileSync( root + "/src/intro.js" ) + "\n",
    outro = fs.readFileSync( root + "/src/outro.js" );


var custom = args["-c"];

var name = "sharedjs"; 

if ( custom ) {
    name = args["-n"] || "custom";
    if ( typeof custom === "string" ) {
        custom = [custom];
    }   
}

var data = intro;

if ( custom ) {
    
    custom.forEach( function( name ) {
        data += fs.readFileSync( root + "/src/" + name + ".js" ) + "\n";
    });    
    
    // TODO take care about dependencies over deps.json
    
} else {    
    // create full build
    fs.readdirSync( root + "/src" ).forEach( function( file ) {
        if ( file !== "intro.js" && file !== "outro.js" ) {
            data += fs.readFileSync( root + "/src/" + file ) + "\n";
        }
    });
}

data += outro;
fs.writeFileSync( root + "/lib/" + name + ".js", data, "utf-8" );

// create minified version
var jsp = require( root + "/deps/UglifyJS/lib/parse-js" ),
    jspro = require( root + "/deps/UglifyJS/lib/process" ),
    ast = jsp.parse( data ),
    ast = jspro.ast_mangle( ast ),
    ast = jspro.ast_squeeze( ast ),
    minData = jspro.gen_code( ast );

fs.writeFileSync( root + "/lib/" + name + ".min.js", minData, "utf-8" );

    
require( "util" ).print( "Build created successfull\n" );
