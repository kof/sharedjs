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
