// variable
// type validation
// array
// arguments
// object    
// multiple types
// schema validation
// silent
// optional
// default
// reccursive
// regexp
// range
// length
// custom using function
// built in regexp
// sort

module = QUnit.module;

test("validate - common", 1, function() {
    raises(function() {
        validate(123);    
    }, "bad schema");
});


module("variables");

test("validate - type", 4, function() {
    ok( validate(123, "number"), "simple" );
    raises(function() {
        validate("123", "number");    
    }, "simple negative");  
    
    ok( validate( "123", "number|string" ), "regexp type" );
    
    raises(function() {
        validate(null, "number|string");    
    }, "number|string negative test");  

});

test("validate - range", 3, function() {
    raises(function() {
        validate("123", {
            type: "string",
            range: [1,5]
        });
    }, "use range only with numbers");
    
    ok(validate( 123, {
        type: "number",
        range: [100, 123]
    }), "number with range in schema");  
    
    raises(function(){
        validate( 124, {
            type: "number",
            range: [100, 123]
        });
    }, "negative test number with schema and range");
});

test("validate - length", 6, function() {
    ok(validate( "123", {
        type: "string",
        length: 3
    }), "number");    

    raises(function(){
        validate( "1234", {
            type: "string",
            length: 3
        });
    },"negative number");    
    

    ok(validate( "123", {
        type: "string",
        length: [2,5]
    }), "range");    
    
    raises(function(){
        validate( "123456", {
            type: "string",
            length: [2,5]
        });
    }, "negative range");    
    
    ok(validate( [1,2], {
        type: "array",
        length: 2
    }), "array length number");
    
    raises(function(){
        validate([1,2], {
            type: "array",
            length: 3
        });
    }, "array with length negative");    
    
});

test("validate - pattern", 2, function() {


    ok(validate( "123", {
        type: "string",
        pattern: /3/
    }), "string with pattern in schema"); 
    
    raises(function(){
        validate( "123", {
            type: "string",
            pattern: /^3/
        });
    }, "negative test string  with pattern in schema");
       
});

test("validate - custom validation function", 4, function() {
    ok(validate(123, function( data ) {
        if ( data === 123 ) {
            return true;
        }    
    }), "schema is validation function"); 
    
    raises(function(){
        validate(123, function( data ) {
            if ( data === 123 ) {
                return false;
            }    
        });
    }, "schema is validation function - negative test");    
    
    ok( validate("oleg008@gmail.com", validate.email), "validate email using method" ); 
    
    raises(function(){
        validate("oleg008gmail.com", validate.email);
    }, "validate email using method, negative test");      
    
});

test("validate - silent errors triggering", 1, function() {
    equal( typeof validate(123, "string", true ), "string", "silent" );
});

module("objects and arrays");


test("validate - array", 2, function() {

    ok(validate([1,2], {
        type: "array",
        schema: ["number", "number"]
    }), "array with subschema");
    
    raises(function(){
        validate([1,2], {
            type: "array",
            schema: ["number", "string"]    
        });
    }, "negative test array, 2. element type is wrong");    
    
});


test("validate - arguments simple", 2, function() {

    function fui( path, callback ) {
        return validate(arguments, {
            schema: ["string", "function" ]
        });         
    }

    ok( fui("/test/test/test", function(){}), "arguments with subschema in schema" ); 
    
    raises(function(){
        fui("/test/test/test", "test");
    }, "arguments negative test - wrong type");  
    
});


test("validate - arguments with optional data types", 2, function() {

    function fui( path, callback ) {
        return validate(arguments, {
            schema: ["string|function", "function|undefined"]
        });         
    }

    ok( fui(function(){}), "optional 1. arg path" ); 
    
    raises(function(){
        fui("/test/test/test", "test");
    }, "arguments negative test - wrong type");  
    
});



test("validate - arguments with optional schema param", 3, function() {

    function fui( path, callback ) {
        return validate(arguments, {
            schema: [
                "string",
                {
                    type: "function",
                    optional: true
                }                
            ]    
        });        
    }

    ok( fui("test"), "optional 2. arg callback" ); 
    
    function fui1( path, callback ) {
        var valide = validate(arguments, {
            schema: [
                "string",
                {
                    type: "function",
                    optional: true,
                    "default": function(){ var test = 123; }
                }                
            ]    
        });    
        
        equal(typeof callback, "function", "default value was assigned")
        
        return valide;
    }
    
    ok( fui1("test"),  "using optional and default in arguments" )
        
});

test("validate - functional assertions", 5, function() {
    var schema = { 
        type: "object",
        schema: {
                name: {
                    type: "string",
                    pattern: /^O/,
                    length: 4
                },
                age: {
                    type: "number",
                    range: [23, 27]
                },
                sex: {
                    type: "string",
                    length: [4, 6],
                    optional: true
                },
                brother: {
                    type: "object",
                    optional: true,
                    schema: {
                        name: {
                            type: "string",
                            pattern: /^M/
                        },
                        age: {
                            type: "number",
                            range: [23, 30]
                        }                                                    
                    }
                }        
        }
    }; 
    
    ok(validate({
        name: "Oleg",
        age: 25,
        sex: "male"
    }, schema ), "mixed data 0");
    
    raises(function(){
        validate({
            name: "leg",
            age: 25,
            sex: "male"
        }, schema );             
    }, "mixed data 1");   
    
    ok(validate({
        name: "Oleg",
        age: 25,
        sex: "male",
        brother: {
            name: "Michael",
            age: 30
        }
    }, schema ), "mixed data 2");
    
    ok(validate({
        name: "Oleg",
        sub: {
            name: "Oleg",
            sub: {
                name: "Oleg"
            }
        }
    }, {
        type: "object",
        schema: {
            name: {
                type: "string",
                pattern: /^Oleg/
            },
            sub: {
                type: "object",
                schema: {
                    name: {
                        type: "string",
                        pattern: /^Oleg/
                    },
                    sub: {
                        type: "object"
                    }
                } 
            }
        }    
    }), "recursive"); 
    
    raises(function(){
        validate({
            name: "Oleg",
            sub: {
                name: "Oleg",
                sub: {
                    name: "Oleg"
                }
            }
        }, {
            type: "object",
            schema: {
                name: {
                    type: "string",
                    pattern: /^Oleg/
                },
                sub: {
                    type: "object",
                    schema: {
                        name: {
                            type: "string",
                            pattern: /^Oleg/
                        },
                        sub: {
                            type: "string"
                        }
                    } 
                }
            }    
        });    
    }, "recursive negative test");    
    
});
 