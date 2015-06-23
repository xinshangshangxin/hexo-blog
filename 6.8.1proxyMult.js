var mult = function() {
    console.log('开始计算乘积');
    var a = 1;
    for (var i = 0, l = arguments.length; i < l; i++) {
        a = a * arguments[i];
    }

    return a;
};

mult(2, 3);
mult(2, 3); // 依然重新计算

var proxyMult = function() {
    var cache = {};
    return function() {
        var args = [].join.call(arguments, ',');

        if (args in cache) {
            return cache[args];
        }

        return cache[args] = mult.apply(this, arguments);
    }
};

proxyMult(2, 3);
proxyMult(2, 3);       // 只计算第一次,第二次使用缓存