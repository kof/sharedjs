a.deepEqual( $.toArray([1,2,3]), [1,2,3], "true array" );
a.deepEqual( $.toArray([1,2,3], 1, 2), [2], "true array sliced" );
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
    a.deepEqual( $.toArray( arguments, 1, 2 ), [ 2 ], "sliced collection" );
}(1, 2, 3));

(function(){
    a.deepEqual( $.toArray( arguments ), [], "empty collection" );
}());

require( "util" ).print( "Method 'toArray' tested successfull\n" );
