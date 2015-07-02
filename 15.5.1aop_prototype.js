Function.prototype.before = function(beforefn) {
    var _this = this;
    return function() {
        beforefn.apply(this, arguments);
        return _this.apply(this, arguments);
    }
};


Function.prototype.after = function(afterfn) {
    var _this = this;
    return function() {
        var ret = _this.apply(this, arguments);
        afterfn.apply(this, arguments);
        return ret;
    }
};


function test() {
    console.log(1);
}

var testAfter = test.before(function() {
    console.log(0);
}).after(function() {
    console.log(2);
}).after(function() {
    console.log(3);
}).after(function() {
    console.log(4);
});

testAfter();//0 1 2 3 4
