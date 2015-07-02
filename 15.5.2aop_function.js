var before = function(fn, beforefn) {
    return function() {
        beforefn.apply(this, arguments);
        return fn.apply(this, arguments);
    }
};

var after = function(fn, afterfn) {
    return function() {
        fn.apply(this, arguments);
        return afterfn.apply(this, arguments);
    }
};

var a = before(function() {
    console.log(3);
}, function() {
    console.log(2);
});

a = after(a, function() {
    console.log(4);
});

a();