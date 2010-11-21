function test( data, expectedIterations, type ) {
    (function(){
        var iteration = 0;
        
        $.each(data, function( val, i, _data ) {
            a.equal( val, data[i], "value is correct, data is " + type );
            a.strictEqual( _data , data, "array is correct, data is " + type );
            ++iteration;    
        });
        a.equal(iteration, expectedIterations, "iterations count is correct, data is " + type);
        
    }());
    
    (function(){
        var obj = {
            test: function( item, i, arr ) {
                a.strictEqual( this , exports ? global : window, "callback default context, data is " + type );
            }
        };
        
        $.each(data, obj.test );
    }());
    
    
    a.equal( $.each(data, function(){return "123";}), undefined, "return value of each, data is " + type );
    
    (function(){
        // no need to check return false if data is null or undefined
        if ( data == null ) {
            return;    
        }
        
        var i = 0;    
        
        $.each( data, function(){
            ++i;
            return false;
        });
        
        a.equal( i, 1, "exit with return false, data is " + type );
        
    }());
    
    (function(){
        var context = {test: true};
        $.each( data, function( item, i, arr ) {
            a.strictEqual( this , context, "context option, data is " + type );
        }, context);
    }());
        
}

test({
    0: 1,
    1: 2
}, 2, "object");

test("12", 2, "string");

test([1,2], 2, "true array");



(function(){
    test(arguments, 2, "collection");
}(1,2))

test(null, 0, "null");
test(undefined, 0, "undefined");

test( new Buffer(2), 2, "buffer" );

(function(){
    function noop() {};
    noop[0] = 1;
    noop[1] = 2;
    test( noop, 2, "function" )
}())


require( "util" ).print( "Method 'each' tested successfull\n" );