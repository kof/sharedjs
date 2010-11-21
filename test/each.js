var $ = require( "../src/each.js" ),
    a = require( "assert" ),
    undefined;

function test( data, expectedIterations, type ) {
    (function(){
        var iteration = 0;
        
        $.each(data, function( val, i, arr ) {
            a.equal( val, data[iteration], "value is correct, data is " + type );
            a.equal( i, iteration, "iteration is correct, data is " + type );
            a.strictEqual( arr , data, "array is correct, data is " + type );
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


test("12", 2, "string");

test([1,2], 2, "true array");

test({
    0: 1,
    1: 2
}, 2, "object");

(function(){
    test(arguments, 2, "collection");
}(1,2))

test(null, 0, "null");
test(undefined, 0, "undefined");

test( new Buffer(2), 2, "buffer" );


require( "util" ).print( "Method 'each' tested successfull\n" );