(function(){
    
var RegExp = global.RegExp,
    errPrefix = "Schema validation error, ";

function ValidationError( name, message ) {
    this.name = name;
    this.message = errPrefix + message;
}
exports.inherits(ValidationError, Error);

ValidationError.prototype.toString = function() {
    return this.name + ": " + this.message;    
};
    

/**
 * Validate one variable. 
 * @param {Mixed} data
 * @param {Object|String} schema 
 * @param {String} name current property name
 * @return {Boolean|Object}
 * @private
 */
function validateOne( data, schema, name ) {
    var schemaType = exports.type( schema ),
        dataType;
    
    if ( schemaType === "string" ) {
        schema = {type: schema};
    } else if ( schemaType !== "object" && schemaType !== "function" ) {
        throw new ValidationError( "BAD_SCHEMA", "bad schema" + name );   
    }
    
    if ( schemaType === "function" ) {
        return schema(data) === false ? new ValidationError( "CUSTOM_VALIDATION", "custom validation fail" + name ) : true;
    }     
    
    // check type
    if ( schema.type ) {
        dataType = exports.type( data );
        // handle simple type string and regexp string e.g. "string|function"
        if ( schema.type !== dataType && !(new RegExp(schema.type)).test(dataType)) {
            return new ValidationError( "TYPE", "Found " + dataType + ", but expected " + schema.type + name );
        }   
    }
    
    // min and max
    if ( schema.min != null || schema.max != null ) {
        if ( schema.type !== "number" ) {
            throw new ValidationError( "MIN_MAX_FOR_NUMBERS", "min and max can be used with numbers only" + name );   
        } 
        if ( data < schema.min || data > schema.max ) {
            return new ValidationError( "MIN_MAX", "Found " + data + ", but expected " + schema.min + "-" + schema.max + name );
        }       
    }    
   
    // check length 
    if ( schema.length != null && data.length !== schema.length ) {
        return new ValidationError( "LENGTH", "Found " + data.length + ", but expected " + schema.length + name );
    }
    
    // minlength and maxlength
    if ( schema.minlength != null || schema.maxlength != null ) {
        // length is an range array           
        if ( data.length < schema.minlength || data.length > schema.maxlength ) {
            return new ValidationError( "MINLENGTH_MAXLENGTH", "Found " + data.length + ", but expected " + schema.minlength + "-" + schema.maxlength + name );
        }        
    }
    
    // check pattern
    if ( schema.pattern && !schema.pattern.test(data) ) {
        return new ValidationError( "PATTERN", "pattern mismatch" + name );
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
        throw ret;
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
        
                
                ret = validateOne( data[key], schema, " (" + key + ")" );
                
                if ( ret !== true ) {
                    if ( silent ) {
                        // quit the each loop    
                        return false;
                    } else {
                        throw ret;
                    }
                }
                
                if ( schema.schema ) {
                    rec( schema.schema, data[key] );
                }
            });
        }(schema.schema, data));
    }
    
    return ret;       
}

exports.validate = validate;

}());