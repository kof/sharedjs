/**
 * Merge objects to the first one
 * @param {Boolean|Object} deep if set true, deep merge will be done
 * @param {Object}  obj
 * @return {Object}
 */
exports.extend = function extend( deep /*, obj1, obj2, obj3 */ ) {
    // take first argument, if its not a boolean
    var args = arguments,
        i = deep === true ? 1 : 0,
        key,
        target = args[i];
    
    for ( ; i < args.length; ++i ) {
        exports.each( args[i], function( val, key, obj ) {
            if ( deep === true && target[key] ) {
                extend( deep, target[key], obj[key] );    
            } else {
                target[key] = obj[key];
            }            
        });
    }  
          
    return target;    
};