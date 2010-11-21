a.equal( $.trim(" My String"), "My String", "case 1" );
a.equal( $.trim("My String "), "My String", "case 2" );
a.equal( $.trim(" My String "), "My String", "case 3");
a.equal( $.trim("\n My String \n"), "My String", "case 4" );
a.equal( $.trim("\t My String \t"), "My String", "case 5" );
a.equal( $.trim(null), "", "case 6" );
a.equal( $.trim(undefined), "", "case 7" );
a.equal( $.trim({}), "[object Object]", "case 8" );
a.equal( $.trim([]), "", "case 9" );

require( "util" ).print( "Method 'trim' tested successfull\n" );
