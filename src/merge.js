/**
 * Merge objects to the first one
 * @param {Boolean|Object} deep if set true, deep merge will be done
 * @param {Object}  obj
 * @return {Object}
 */
exports.merge = function merge( deep /*, obj1, obj2, obj3 */) {
    // take first argument, if its not a boolean
    var args = arguments,
        i = typeof deep === "boolean" ? 1 : 0,
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