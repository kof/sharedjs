a.equal( typeof $.bind( function(){ return 123 } ), "function", "return value of bind" );
a.equal( $.bind( function(){ return 123; } )(), 123, "return value of the bound function" );
a.equal( $.bind( function(){ return this.test; }, {test: 123} )(), 123, "check bound function context" );
a.deepEqual( $.bind( function(){ return this; } )(), {}, "check context if nothing passed" );

function argumentsTest(){ 
    return arguments; 
} 

a.deepEqual( $.bind( argumentsTest )(1,2,3), argumentsTest(1,2,3), "additional arguments" );


require( "util" ).print( "Method 'bind' tested successfull\n" );