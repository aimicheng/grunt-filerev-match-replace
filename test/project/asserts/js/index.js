//absolute path without .js subfix
define('test1', ['/asserts/js/module-a'], function(module_a) {

});

//absolute path with .js subfix
define('test2', ['/asserts/js/module-a.js'], function(module_a) {

});

//double qutes
define('test3', ["/asserts/js/module-a"], function(module_a) {

});

//relative path
define('test4', ["./module-a"], function(module_a) {

});

//multiple dependencies
define('test5', ['/asserts/js/module-a.js', '/asserts/js/module-b.js'], function(module_a) { });
define('test6', ['/asserts/js/module-a', '/asserts/js/module-b'], function(module_a) { });

//named paths
define('test7', ['module-a', 'module-b'], function() {});

//invalid paths
define('test8', ['http://othersite.com/js/module-a.js'], function() {});
define('test9', ['module-c.js'], function() {});

//empty dependency
define([], function() {});
