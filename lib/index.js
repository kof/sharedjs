/*
 * Require all utils
 */

[
    "type",
    "each",
    "extend",
    "inherits"
].forEach( function( name ) {
    exports[name] = require( "./" + name )[name];
});