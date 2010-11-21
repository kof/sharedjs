(function( exports, global, undefined ) { 

if ( !exports ) { 
    global = this; 
    exports = global.$ = {}; 
}
/**
 * Change execution context of a function
 * @param {Function} fn,
 * @param {Object} context
 * @return {Function}
 */
exports.bind = (function() {
    
    var slice = Array.prototype.slice,
        bind = Function.prototype.bind || function( context ) {
            var fn = this;
            return function() {
                return fn.apply( context || {}, arguments );        
            };
        };
    
    return function( fn, context /*, arg1, arg2, arg3 */ ) {
        return bind.apply( fn, slice.call( arguments, 1 ) );
    }        
}());
/**
 * Iterate through an array or object
 * @param {Mixed} obj
 * @param {Function} fn
 * @param {Object} context optional
 * @return {Undefined}
 */
exports.each = (function() {
    
    var toString = Object.prototype.toString,
        tobj = "[object Object]",
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
        function objEach( fn, context ) {
            Object.keys( this ).forEach( function(val, key, obj ) {
                return fn.call( context, val, key, obj );
            });    
        }
    } else {
        function objEach( fn, context ) {
            for ( var key in this ) {
                if ( fn.call( context, this[key], key, this ) === false ) {
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
        
        if ( objType === tobj ) {
            return objEach.call( obj, fn, context );        
        } else {
            return arrEach( obj, fn, context );
        }
    };
}());
exports.env = {
    dev: true,
    client: true,
    mozilla: true,
    msie: true,
    webkit: true,
    opera: true,
    vervsion: 1.3    
};
/**
 * Don't throw erros in production mode on the client
 * 
 * @param {String} msg
 */
exports.error = (function(){
    
    var Error = global.Error,
        env = exports.env;
    
    return function( msg ) {
        if ( !msg || ( env.client && !env.dev ) ) {
            return;    
        }
        
        throw new Error( msg );
    };    
}());

exports.filter = function() {
    
};

exports.indexOf = function() {
    
};

exports.inherits = function() {
    
};
exports.lastIndexOf = function() {
    
};

exports.map = function() {
    
};

exports.extend = function() {
    
};
exports.noop = function(){};

/**
 * Returns the current time in milliseconds.
 * @return {Number}
 */
exports.now = Date.now || function() {
    return new Date().getTime();    
};

/**
 * Convert a collection or any other type to an Array
 * @param {Mixed} obj
 * @param {Number} beginIndex optional
 * @param {Number} endIndex optional
 * @return {Array}
 */
exports.toArray = (function() {

    var push = Array.prototype.push,
        slice = Array.prototype.slice,
        toString = Object.prototype.toString,
        arr = "[object Array]",
        object = "[object Object]",
        // V8 returns by arguments
        args = "[object Arguments]" ;
    
    return function( obj, beginIndex, endIndex ) {
        var type = toString.call( obj );
        // this is a true array
        if ( type === arr ) {
            // startIndex could be also negative
            return beginIndex != null || endIndex != null ? slice.call( obj, beginIndex, endIndex ) : obj;
        // its collection    
        } else if ( obj.length && ( type === object || type === args ) ) {
            return slice.call( obj, beginIndex, endIndex );
        // any other type
        } else {
            var ret = [];
            push.call( ret, obj );
            return ret;    
        }
    };
}());

/**
 * Returns a string without any leading or trailing whitespace, newlines and tabs.
 * @param {String} str
 * @return {String} always returns a string
 */
exports.trim = (function(){
    var rTrim = /^\s+|\s+$/,
        trim = String.prototype.trim || function() {
             return this.replace( rTrim, "" );               
        };
    
    return function( str ) {
        return str ? trim.call( str ) : "";  
    };
}());
/**
 * Type detection is inspired by jQuery
 * @param {Object} obj
 * @param {String} expType
 * @return {String|Boolean}
 */
exports.type = (function() {
    var i,
        String = global.String,
        toString = global.Object.prototype.toString,
        types = [ "Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Buffer" ],
        class2type = {};
        
    // create a static classes hash
    for ( i=0; i < types.length; ++i ) {
        class2type[ "[object " + types[i] + "]" ] = types[i].toLowerCase();
    }
    
    return function( obj, expType ) {
        var type = obj == null ? String( obj ) : class2type[ toString.call(obj) ] || "object";
        
        if ( expType ) {
            return expType === type ? true : false;
        }
        
        return type;
    };
}());
}( exports, global ));