a.ok( $.type( undefined, "undefined" ), "undefined works" );
a.ok( $.type( true, "boolean" ), "boolean works" );
a.ok( $.type( false, "boolean" ), "boolean works" );
a.ok( $.type( new Boolean, "boolean" ), "boolean works" );
a.ok( $.type( null, "null" ), "null works" );
a.ok( $.type( "test test", "string" ), "string works" );
a.ok( $.type( new String, "string" ), "string works" );
a.ok( $.type( 12345, "number" ), "number works" );
a.ok( $.type( new Number, "number" ), "number works" );
a.ok( $.type( {}, "object" ), "object works" );
a.ok( $.type( new Object, "object" ), "object works" );
a.ok( $.type( [], "array" ), "array works" );
a.ok( $.type( new Array, "array" ), "array works" );
a.ok( $.type( /$/i, "regexp" ), "regexp works" );
a.ok( $.type( new RegExp, "regexp" ), "regexp works" );
a.ok( $.type( new Date, "date" ), "date works" );
a.ok( $.type( new Buffer(1), "buffer" ), "buffer works" );

require( "util" ).print( "Method 'type' tested successfull\n" );