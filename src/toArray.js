/**
 * Convert a collection or any other type to an Array
 * @param {Mixed} obj
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
    
    return function( obj, startIndex ) {
        var type = toString.call( obj );
        // this is a true array
        if ( type === arr ) {
            return startIndex > 0 ? slice.call( obj, startIndex ) : obj;
        // its collection    
        } else if ( obj.length && ( type === object || type === args ) ) {
            return slice.call( obj, startIndex );
        // any other type
        } else {
            var ret = [];
            push.call( ret, obj );
            return ret;    
        }
    };
}());
