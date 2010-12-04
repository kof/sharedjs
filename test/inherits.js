function Human(){}
Human.prototype.type = "Human";

function Me(){}

var ret = $.inherits(Me, Human);


a.ok( new Me instanceof Human, "instance of Me is instance of Human" );
a.ok( new Me instanceof Me, "instance of Me" );
a.equal( (new Me).type, "Human", "super proto property was inherited" );
a.notEqual( Me.prototype, Human.prototype, "both has different prototypes" );
a.equal( ret, Me, "return value is ctor" );

require( "util" ).print( "Method 'inherits' tested successfull\n" );