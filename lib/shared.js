(function( exports, global, undefined ) { if ( !exports ) { global = this; exports = global.$ = {}; }
exports.each = function() {
    
};
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
 * @param {String} msg
 */
exports.error = function( msg ) {
    if ( this.env.client && !this.env.dev ) {
        return;    
    }
    
    throw new Error( msg );
};

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


exports.toArray = function() {
    
};

/**
 * Returns a string without any leading or trailing whitespace, newlines and tabs.
 * @param {String} str
 * @return {String}
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
        String = String,
        toString = Object.prototype.toString,
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