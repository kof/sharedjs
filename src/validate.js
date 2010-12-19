(function(){
    
var Error = global.Error,    
    TypeError = global.TypeError,
    RegExp = global.RegExp,
    errPrefix = "Schema validation error, ";

/**
 * Validate one variable. 
 * @param {Mixed} data
 * @param {Object|String} schema 
 * @param {String} name current property name
 * @return {Boolean|String}
 * @private
 */
function validateOne( data, schema, name ) {
    var schemaType = exports.type( schema ),
        dataType;
    
    if ( schemaType === "string" ) {
        schema = {type: schema};
    } else if ( schemaType !== "object" && schemaType !== "function" ) {
        throw new TypeError( options.errPrefix + "bad schema" );   
    }
    
    
    if ( schemaType === "function" ) {
        return schema(data) === false ? "custom validation fail " + name : true;
    }     
    
    // check type
    if ( schema.type ) {
        dataType = exports.type( data );
        // handle simple type string and regexp string e.g. "string|function"
        if ( schema.type !== dataType && !(new RegExp(schema.type)).test(dataType)) {
            return dataType + " " + name + "is not a " + schema.type;
        }   
    }
    
    // it is not null, "", undefined
    if ( schema.min != null || schema.max != null ) {
        if ( schema.type !== "number" ) {
            throw new TypeError( options.errPrefix + "min, max and range can be used with numbers only" );   
        } 
        if ( data < schema.min || data > schema.max ) {
            return "expected range " + name + "is '" + min + "-" + max + "', but found '" + data + "'";
        }       
    }    
   
    // check length 
    if ( schema.length && data.length !== schema.length ) {
        return "expected length " + name + "is '" + schema.length + "', but found '" + data.length + "'";
    }
    
    // it is not null, "", undefined
    if ( schema.minlength != null || schema.maxlength != null ) {
        // length is an range array           
        if ( data.length < schema.minlength || data.length > schema.maxlength ) {
            return "expected length " + name + "is '" + schema.minlength + "-" + schema.maxlength + ", but found '" + data.length + "'";
        }        
    }
    
    // check pattern
    if ( schema.pattern && !schema.pattern.test(data) ) {
        return "pattern mismatch " + name;
    }  
    
    return true;         
}

/**
 * Validate variable or object. 
 * @param {Mixed} data
 * @param {Object|String} schema 
 * @param {Boolean} silent optional, don't throw errors, just return error message or false
 * @return {Boolean|String}
 * @public
 */
function validate( data, schema, silent ) {
    
    if ( schema.optional && !data ) {
        return true;
    }
    
    var ret = validateOne( data, schema, "" );

    if ( ret !== true && !silent ) {
        throw new Error( options.errPrefix + " " + ret );
    }
    
    // schema contains schema
    if ( schema.schema ) {
        (function rec(schema, data) {
            if ( !schema ) {
                return;
            }
            
            exports.each( schema, function( schema, key ) {
                // if the prop is optional and data is not set
                if ( schema.optional && data[key] === undefined ) {
                    if ( schema["default"] ) {
                        data[key] = schema["default"];    
                    }
                    return;
                } 
        
                
                ret = validateOne( data[key], schema, "of '" + key + "' " );
                
                if ( ret !== true ) {
                    if ( silent ) {
                        // quit the each loop    
                        return false;
                    } else {
                        throw new Error( options.errPrefix + " " + ret );
                    }
                }
                
                if ( schema.schema ) {
                    rec( schema.schema, data[key] );
                }
            });
        }(schema.schema, data));
    }
    
    return ret;       
};

exports.validate = validate;

}());