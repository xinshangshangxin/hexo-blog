function currying(fn) {
    var args = [];

    return function() {
        if (arguments.length === 0) {
            return fn.apply(this, args);
        }
        else {
            [].push.apply(args, arguments);
            return arguments.callee;
        }
    }
}

var add = (function() {
    var sum = 0;
    return function() {
        for (var i = 0; i < arguments.length; i++) {
            sum += arguments[i];
        }
        return sum;
    }
}());

var curryAdd = currying(add);
curryAdd(1)(2);
console.log(curryAdd());
