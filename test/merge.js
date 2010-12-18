QUnit.module("merge");

test("plain objects", function() {
    deepEqual(  merge({test1: 1}, {test2: 2}), {test1: 1, test2: 2}, "merge 2 simple objects" );
    deepEqual(  merge({test1: 1}, {test2: 2}, {test3: 3}), {test1: 1, test2: 2, test3: 3}, "merge 3 simple objects" );
});

test("instance into plain object", function() {
    var obj = function() {};
    obj.prototype = {test2: 2};
    obj = new obj;
    deepEqual(  merge( {test1: 1}, obj ), {test1: 1, test2: 2}, "merge object with its prototype" );
});

test("function object and plain object", function() {
    var obj = function() {};
    obj.test2 = 2;
    deepEqual(  merge( {test1: 1}, obj ), {test1: 1, test2: 2}, "merge function and object" );
});

test("deep", function() {
    deepEqual(  merge( true, {test1: {test1: 1}}, {test1: {test2: 2} } ), { test1: {test1: 1, test2: 2} }, "deep merge" );    
});

