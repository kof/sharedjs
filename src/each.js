/**
 * Iterate through an array, object, string, buffer, function object
 * @param {Mixed} obj
 * @param {Function} fn
 * @param {Object} context optional
 * @return {Undefined}
 */
exports.each = (function() {
    
    var toString = Object.prototype.toString,
        tobj = "[object Object]",
        tfn = "[object Function]",
        TypeError = global.TypeError || function TypeError(){}; 

    // not using ecma5 forEach, because there is no way to exit the loop
    function arrEach( arr, fn, context ) {
        for ( var i=0; i < arr.length; ++i ) {
            if ( fn.call( context, arr[i], i, arr ) === false ) {
                return;        
            }
        }    
    }
    
    // use ecma5 if possible
    if ( Object.keys && Array.prototype.forEach ) {
        function objEach( obj, fn, context ) {
            Object.keys( obj ).forEach( function(val, key, obj ) {
                return fn.call( context, val, key, obj );
            });    
        }
    } else {
        function objEach( obj, fn, context ) {
            for ( var key in obj ) {
                if ( fn.call( context, obj[key], key, obj ) === false ) {
                    return false;
                }            
            }        
        }
    }
    
    return function( obj, fn, context ) {
        if ( obj == null ) {
            return;
        }

        var fnType = typeof fn,
            objType;

        // it is not an array with native forEach method - throw exeption
        if ( fnType !== "function" ) {
            throw new TypeError( fnType + " is not a function" );    
        }
        
        objType = toString.call( obj ); 
        
        context = context || global;
        
        if ( objType === tobj || objType === tfn ) {
            return objEach( obj, fn, context );        
        } else {
            return arrEach( obj, fn, context );
        }
    };
}());