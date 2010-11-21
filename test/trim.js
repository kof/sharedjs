var $ = require( "../lib/shared.js" ),
    a = require( "assert" ),
    undefined;

a.equal($.trim(" My String"), "My String");
a.equal($.trim("My String "), "My String");
a.equal($.trim(" My String "), "My String");
a.equal($.trim("\n My String \n"), "My String");
a.equal($.trim("\t My String \t"), "My String");
a.equal($.trim(null), "");
a.equal($.trim(undefined), "");
a.equal($.trim({}), "[object Object]");
a.equal($.trim([]), "");

require( "util" ).print( "Method 'trim' tested successfull\n" );
