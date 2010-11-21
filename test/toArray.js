var $ = require( "../src/toArray.js" ),
    a = require( "assert" ),
    undefined;

a.deepEqual( $.toArray([1,2,3]), [1,2,3], "true array" );
a.deepEqual( $.toArray([1,2,3], 1), [2,3], "true array sliced" );
a.deepEqual( $.toArray( {test:123} ), [ { test: 123 } ], "object" );
a.deepEqual( $.toArray( "test" ), [ "test" ], "string" );
a.deepEqual( $.toArray( 123 ), [ 123 ], "number" );
a.deepEqual( $.toArray( true ), [ true ], "boolean" );
var date = new Date();
a.deepEqual( $.toArray( date ), [ date ], "date" );
(function(){
    a.deepEqual( $.toArray( arguments ), [ 123 ], "collection" );
}(123));

(function(){
    a.deepEqual( $.toArray( arguments, 1 ), [ 456 ], "sliced collection" );
}(123, 456));


require( "util" ).print( "Method 'toArray' tested successfull\n" );
