var throttle = function(fn, interval) {
    var _fn = fn;           // 是不是多余了呢?
    var isFirst = true; //第一次调用不需要延迟
    var timer = null; // 定时器

    return function() {
        var args = arguments;
        var _this = this;      // 是不是多于了呢?  this ==== window

        if (isFirst) {
            _fn.apply(_this, args);
            return isFirst = false;
        }

        if (timer) {
            return false;
        }

        timer = setTimeout(function() {
            clearTimeout(timer);
            timer = null;
            _fn.apply(_this, args);
        }, interval || 500);
    }
};


// 实例
window.onresize = throttle(function() {
    console.log(1);
});

