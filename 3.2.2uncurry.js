Function.prototype.uncurrying = function() {
    var _this = this;
    return function() {
        var obj = [].shift.call(arguments);
        return _this.apply(obj, arguments);
    }
};

// 或者
Function.prototype.uncurrying = function() {
    var _this = this;
    return function() {
        return Function.prototype.call.apply(_this, arguments);
    }
};

var push = [].push.uncurrying();
var obj = {
    length: 1,
    0: 0
};
push(obj, 2);

console.log(obj); // { '0': 0, '1': 2, length: 2 }