---
title: "JS设计模式笔记(高阶函数)"
date: 2015-06-22 17:32:24
tags:
- js
- 设计模式


---

curry,uncurry,throttle,time_chunk,lazy_load,
<!-- more -->



## curry
```js
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
```

## uncurry
```js
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
```

## throttle
```js
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
```

## time_chunk
```js
/***
 *
 * @param arr 需要的数据
 * @param fn  函数
 * @param [count] 每次创建多少个数据,默认一个
 * @param [interval] 单位时间,默认200ms
 * @returns {Function}
 */
var timeChunk = function(arr, fn, count, interval) {
    var t;

    var start = function() {
        var obj;
        for (var i = 0; i < Math.min(count || 1, arr.length); i++) {
            obj = arr.shift();
            fn(obj);
        }
    };

    return function() {
        t = setInterval(function() {
            if (arr.length === 0) {
                return clearInterval(t);
            }

            start();
        }, interval || 200);
    }
};


// 测试
var arr =[];
for (var i = 0; i < 1000; i++) {
    arr.push(i);
}

var renderFrindsList = timeChunk(arr, function(n) {
    var div = document.createElement('div');
    div.innerHTML = n;
    document.body.appendChild(div);
}, 8);

renderFrindsList();
```
## lazy_load
```js
var addEven = function(ele, type, handler) {
    if(window.addEventListener) {
        addEven = function(ele, type, handler) {
            ele.addEventListener(type, handler, false);
        }
    }
    else if (window.attachEvent) {
        addEven = function(ele, type, handler) {
            ele.attachEvent('on' + type, handler);
        }
    }
    addEven(ele, type, handler);
};
```

# 参考文档
- *实体书:* `JavaScript设计模式与开发实践(曾探)`

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

