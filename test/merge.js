a.deepEqual(  $.merge({test1: 1}, {test2: 2}), {test1: 1, test2: 2}, "merge 2 simple objects" );
a.deepEqual(  $.merge({test1: 1}, {test2: 2}, {test3: 3}), {test1: 1, test2: 2, test3: 3}, "merge 3 simple objects" );

(function(){
    var obj = function() {};
    obj.prototype = {test2: 2};
    obj = new obj;
    a.deepEqual(  $.merge( {test1: 1}, obj ), {test1: 1, test2: 2}, "merge object with its prototype" );
}());

(function(){
    var obj = function() {};
    obj.test2 = 2;
    a.deepEqual(  $.merge( {test1: 1}, obj ), {test1: 1, test2: 2}, "merge function and object" );
}());


a.deepEqual(  $.merge( true, {test1: {test1: 1}}, {test1: {test2: 2} } ), { test1: {test1: 1, test2: 2} }, "deep merge" );


require( "util" ).print( "Method 'merge' tested successfull\n" );
