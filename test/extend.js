QUnit.module("extend");

test("plain objects", 2, function() {
    deepEqual(  extend({test1: 1}, {test2: 2}), {test1: 1, test2: 2}, "extend 2 simple objects" );
    deepEqual(  extend({test1: 1}, {test2: 2}, {test3: 3}), {test1: 1, test2: 2, test3: 3}, "extend 3 simple objects" );
});

test("instance into plain object", 1, function() {
    var obj = function() {};
    obj.prototype = {test2: 2};
    obj = new obj;
    deepEqual(  extend( {test1: 1}, obj ), {test1: 1, test2: 2}, "extend object with its prototype" );
});

test("function object and plain object", 1, function() {
    var obj = function() {};
    obj.test2 = 2;
    deepEqual(  extend( {test1: 1}, obj ), {test1: 1, test2: 2}, "extend function and object" );
});

test("deep", 2, function() {
    deepEqual(  extend( true, {test1: {test1: 1}}, {test1: {test2: 2} } ), { test1: {test1: 1, test2: 2} }, "deep extend" );    
    deepEqual(  extend( true, {test: {test: 'test'}}, {test: {test: 'test'} } ), {test: {test: 'test'} }, "deep extend, check endless lop" );
});

