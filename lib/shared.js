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
 * Iterate through an array, object, string, buffer, function object
 * @param {Mixed} obj
 * @param {Function} fn
 * @param {Object} context optional
 * @return {Undefined}
 */
exports.each = (function() {
    
    var TypeError = global.TypeError || function TypeError(){};

    return function( obj, fn, context ) {
        if ( obj == null ) {
            return;
        }

        var fnType = typeof fn,
            objType = exports.type( obj ),
            key, i;

        // it is not an array with native forEach method - throw exeption
        if ( fnType !== "function" ) {
            throw new TypeError( fnType + " is not a function" );    
        }
        
        context = context || global;
        
        if ( obj.length>0 && ( objType === "array" || objType === "buffer" ) ) {
            for ( i=0; i<obj.length; ++i ) {
                if ( fn.call( context, obj[i], i, obj ) === false ) {
                    break;
                }                 
            }    
        } else {
            for ( key in obj ) {
                if ( fn.call( context, obj[key], key, obj ) === false ) {
                    break;
                }            
            }
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

/**
 * Merge objects to the first one
 * @param {Boolean|Object} deep if set true, deep merge will be done
 * @param {Object}  obj
 * @return {Object}
 */
exports.merge = function merge( deep /*, obj1, obj2, obj3 */) {
    // take first argument, if its not a boolean
    var args = arguments,
        i = deep === true ? 1 : 0,
        key,
        target = args[i];
    
    for ( ; i < args.length; ++i ) {
        exports.each( args[i], function( val, key, obj ) {
            if ( deep === true && target[key] ) {
                merge( deep, target[key], obj[key] );    
            } else {
                target[key] = obj[key];
            }            
        });
    }  
          
    return target;    
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