#!/usr/bin/env node

var fs = require( "fs" ),
    path = require( "path" ),
    testrunner = require( "qunit" ),
    root = path.normalize( __dirname + "/.." ),
    method = process.argv[2],
    tests; 


// load only one specific test
if ( method ) {
    tests = root + "/test/" + method + ".js";
// load all tests
} else {
    tests = [];
    fs.readdirSync( root + "/test" ).forEach( function( test ) {
        tests.push(  root + "/test/" + test );
    });
}

testrunner.run({
    code: root + "/lib/sharedjs.js",
    tests: tests 
});
