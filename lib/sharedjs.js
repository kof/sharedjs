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
                return fn.apply( context, arguments );        
            };
        };
    
    return function( fn, context /*, arg1, arg2, arg3 */ ) {
        return bind.apply( fn, slice.call( arguments, 1 ) );
    };        
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
            i;

        // it is not an array with native forEach method - throw exeption
        if ( fnType !== "function" ) {
            throw new TypeError( fnType + " is not a function" );    
        }
        
        if ( exports.type( obj ) === "array" ) {
            for ( i=0; i<obj.length; ++i ) {
                if ( fn.call( context, obj[i], i, obj ) === false ) {
                    return;
                }                 
            }    
        } else {
            for ( i in obj ) {
                if ( fn.call( context, obj[i], i, obj ) === false ) {
                    return;
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
exports.filter = function() {
    
};

exports.indexOf = function() {
    
};

/**
 * Inherit prototype properties
 * @param {Function} ctor
 * @param {Function} superCtor
 */
exports.inherits = (function(){
    function noop(){}
 
    function ecma3(ctor, superCtor) {
        noop.prototype = superCtor.prototype;
        ctor.prototype = new noop;
        ctor.prototype.constructor = superCtor;
    }
    
    function ecma5(ctor, superCtor) {
        ctor.prototype = Object.create(superCtor.prototype, {
            constructor: { value: ctor, enumerable: false }
        });
    }
    
    return Object.create ? ecma5 : ecma3;
}());
exports.lastIndexOf = function() {
    
};

exports.map = function() {
    
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
        args = "[object Arguments]";
    
    return function( obj, beginIndex, endIndex ) {
        var type = toString.call( obj );
        // this is a true array
        if ( type === arr ) {
            // startIndex could be also negative
            return beginIndex != null || endIndex != null ? slice.call( obj, beginIndex, endIndex ) : obj;
        // its collection    
        } else if ( obj.length != null && ( type === object || type === args ) ) {
            return slice.call( obj, beginIndex, endIndex );
        // any other type
        } else {
            return [obj];
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
 * Type detection (inspired by jQuery)
 * @param {Object} obj
 * @param {String} expType
 * @return {String|Boolean}
 */
exports.type = (function() {
    var i,
        String = global.String,
        toString = global.Object.prototype.toString,
        types = ["Boolean", "Number", "String", "Function", 
                 "Array", "Date", "RegExp", "Object"],
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
/**
 * Data validation framework
 * 
 * @credits a lot of validation stuff borrowed from https://github.com/jzaefferer/jquery-validation 
 * @author Oleg Slobodskoi
 */

var Error = global.Error,    
    TypeError = global.TypeError,
    RegExp = global.RegExp;


var options = {
        regexp:  {
            // http://projects.scottsplayground.com/email_address_validation/
            email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
            // http://projects.scottsplayground.com/iri/
            url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
            dateISO: /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/,
            time:  /^([01][0-9])|(2[0123]):([0-5])([0-9])$/,
            number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,
            integer: /^-?\d+$/,
            digits: /^\d+$/,
            ziprange: /^90[2-5]\d\{2}-\d{4}$/,
            nowhitespace: /^\S+$/i,
            lettersonly: /^[a-z]+$/i,
            alphanumeric: /^\w+$/i,
            letterswithbasicpunc: /^[a-z-.,()'\"\s]+$/i,
            digitsanddashes: /[^0-9-]+/,
            ipv4: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i,
            ipv6: /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i  
        },
        regexpSpecial: {
            words: /\b\w+\b/g,
            date: /Invalid|NaN/,
            tags: /<.[^<>]*?>/g,
            whitespaces: /&nbsp;|&#160;/gi,
            numbersandpunkt: /[0-9.(),;:!?%#$'"_+=\/-]*/g,
            nodigets: /\D/g
        },
        errPrefix: "Schema validation error, "
    };



/**
 * Validate one variable. 
 * @param {Mixed} data
 * @param {Object|String} schema 
 * @param {String} name current property name
 * @return {Boolean|String}
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
    
    // check range
    if ( schema.range ) {
        if ( schema.type !== "number" ) {
            throw new TypeError( options.errPrefix + "range can be used with numbers only" );   
        }    
        
        if ( data < schema.range[0] || data > schema.range[1] ) {
            return "expected range " + name + "is '" + schema.range[0] + "-" + schema.range[1] + "', but found '" + data + "'";
        }                
    }
   
    // check length 
    if ( schema.length ) {
        // length is a number
        if ( typeof schema.length === "number" ) {
            if ( data.length !== schema.length ) {
                return "expected length " + name + "is '" + schema.length + "', but found '" + data.length + "'";
            }
        // length is an range array           
        } else if ( data.length < schema.length[0] || data.length > schema.length[1] ) {
            return "expected length " + name + "is '" + schema.length[0] + "-" + schema.length[1] + ", but found '" + data.length + "'";
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
                if ( schema.optional && !data[key] ) {
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

validate.options = options;

// generate validation functions using regexp
exports.each(options.regexp, function( regexp, name ) {
    validate[name] = function( value ) {
        return regexp.test( value );        
    };
});

validate.date = function( value ) {
    return !options.regexpSpecial.date.test( new Date(value) );        
};

validate.creditcard = function( value ) {
    // accept only digits and dashes
    if ( options.regexpSpecial.digitsanddashes.test(value) ) {
        return false;
    }
    var nCheck = 0,
        nDigit = 0,
        bEven = false,
        n, cDigit, nDigit;
    
    value = value.replace( options.regexpSpecial.nodigets, "" );
    
    for ( n = value.length - 1; n >= 0; n-- ) {
        cDigit = value.charAt(n);
        nDigit = parseInt(cDigit, 10);
        if ( bEven ) {
            if ( (nDigit *= 2) > 9 ) {
                nDigit -= 9;
            }
        }
        nCheck += nDigit;
        bEven = !bEven;
    }
    
    return (nCheck % 10) == 0;    
};

/**
 * remove html tags, space chars, numbers and punctuation
 * @param {String} value
 * @return {String}
 */ 
function stripHtml(value) {
    var r = options.regexpSpecial;
    return value
        .replace(r.tags, " ")
        .replace(r.whitespaces, " ")
        .replace(r.numbersandpunct, "");
}

validate.maxWords = function( value, params ) {
    return stripHtml(value).match(options.regexpSpecial.words).length < params;    
};

validate.minWords = function( value, params ) {
    return stripHtml(value).match(options.regexpSpecial.words).length >= params;    
};

validate.rangeWords = function( value, params ) {
    var len = stripHtml(value).match(options.regexpSpecial.words).length;
    return len >= params[0] && len < params[1];
};
}( exports, global ));