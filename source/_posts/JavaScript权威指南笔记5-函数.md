title: JavaScript权威指南笔记5_函数
date: 2015-04-08 21:18:01
description: 函数 150408
tags:
- js
---

# 方法调用
> `this` 是一个关键字; 不允许给 `this` 赋值

> 嵌套函数作为方法调用,其 `this` 的值指向调用它的对象
> 嵌套函数作为函数调用,其 `this` 在 非严格模式下为 全局对象, 在严格模式下为 undefined

# 构造函数调用
> 构造函数创建一个新的空对象,这个对象继承自构造函数的 `prototype` 属性,构造函数可以用 `this` 引用这个新创建的对象

> 如果构造函数显示的使用 `return` 返回一个对象, 那么调用表达式的值就是这个对象
> 如果构造函数使用 `return` 但没有返回值,或者返回一个原始值, 那么忽略返回值, 同时这个新对象最为调用结果

# 自定义函数属性
```js
// 计算阶乘,并将结果缓存值函数的属性当中
function factorial(n) {

    if (isFinite(n) && n > 0 && n === Math.round(n)) {  // 有限正整数
        if (n === 1) {              // 特例
            return 1;
        }
        else if (!(n in factorial)) {                 // 如果没有缓存结果
            factorial[n] = n * factorial(n - 1);      // 计算结果并缓存
        }

        return factorial[n];                          // 返回结果
    }
    else {
        return NaN;
    }
}
console.log(factorial(4));          // 24
```

# 闭包
> javascript此法作用域的基本规则: 函数执行到作用域链,这个作用域链是函数定义的时候创建的
> 函数定义时的作用域链 到函数执行是依然有效

```js
var scope = 'global';

function checkScope() {
    var scope = 'local';
    function f() {
        return scope;
    }
    return f();
}

console.log(checkScope());   // local
```
```js
var scope = 'global';

function checkScope() {
    var scope = 'local';
    function f() {
        return scope;
    }
    return f;
}

console.log(checkScope()());   // local
```

# `Function.prototype.call(thisArg [ , arg1 [ , arg2, … ] ] )` 和 `Function.prototype.apply(thisArg, argArray)`
> ECMAScript 3 和 非严格模式中,传入的 `null` 和 `undefined` 都会被全局对象代替, 而其它原始值则会被相应的包装对象代替
> ECMAScript 5 严格模式下, 即使传入 `null` `undefined` 或原始值 `thisArg` 会编编程 `this` 的值

> `apply()` 的参数数组可以是类数组对象也可以使真实数组对象

# `Function.prototype.bind (thisArg [, arg1 [, arg2, …]])`
> ECMAScript 5新增方法, ECMAScript 3实现如下:

```js
if (Function.prototype.bind) {
    Function.prototype.bind = function(o) {
        // this 和 arguments 保存
        var self = this;
        var boundArgs = arguments;

        return function() {
            // 创建一个实参列表;将bind()的第二个及后续实参都传入这个函数
            var args = [];
            var i;
            for (i = 0; i < boundArgs.length; i++) {
                args.push(boundArgs[i]);
            }
            for (i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            // 将self作为o的方法调用,传入这些实参
            return self.apply(o, args);
        }
    }
}
```
# `Function()` 构造函数
> `Function()` 构造函数所创建的函数的词法作用域在全局作用域

```js
var scope = 'global';

function constructFunction() {
    var scope = 'local';
    return new Function('return scope');
}

console.log(constructFunction()());     // global
```


# 函数式编程
## 使用函数处理数组
```js
// 计算 平均数 和 标准差

var sum = function(x, y) {              // 计算和
    return x + y;
};

var square = function(x) {              // 计算平方
    return x * x;
};

var data = [1, 2, 3, 4, 5];
var mean = data.reduce(sum) / data.length;      // 平均数
var deviations = data.map(function(x) {         
    return x - mean;
});
var stddev = Math.sqrt(deviations.map(square).reduce(sum) / (data.length - 1));
console.log(mean);          // 3
console.log(deviations);    // [ -2, -1, 0, 1, 2 ]
console.log(stddev);        //1.5811388300841898
```
> ECMAScript 3  map 和 reduce 实现:

```js
var map = Array.prototype.map ? function(arr, fun) {
    return arr.map(fun);
} : function(arr, fun) {
    var results = [];
    for (var i = 0; i < arr.length; i++) {
        if (i in arr) {
            results[i] = fun.call(null, arr[i], i, arr);
        }
    }
    return results;
};

var reduce = Array.prototype.reduce ? function(arr, fun, initial) {
    return arr.reduce(fun, initial);
} : function(arr, fun, initial) {
    var i = 0, len = arr.length, accumulator;

    if (arguments.length > 2) {
        accumulator = initial;
    }
    else {
        if (len === 0) {
            throw TypeError();
        }

        while(i < len) {
            if (i in arr) {
                accumulator = a[i++];
                break;
            }
            else {
                i++;
            }
        }

        if (i === len) {
            throw TypeError();
        }
    }

    while (i < len) {
        if (i in arr) {
            accumulator = fun.call(undefined, accumulator, arr[i], i, arr);
        }
        i++;
    }

    return accumulator;
};
```

## 高阶函数
> 定义: 操作函数的函数, 接受一个或多个函数为参数,并返回一个新函数

```js
// 返回fun 的返回值的逻辑非
function not(fun) {
    return function() {
        var result = fun.apply(this, arguments);
        return !result;
    }
}

var even = function(x) {        // 判断x是否为偶数
    return x % 2 === 0;
};
var odd = not(even);        // 判断是否为奇数
console.log([1, 2, 3, 4, 5].map(even)); // [ false, true, false, true, false ]
console.log([1, 2, 3, 4, 5].map(odd)); //  [ true, false, true, false, true ]
```
```js
// 计算f(g())

function compose(f, g) {
    return function() {
        return f.call(this, g.apply(this, arguments));
    };
}

var square = function(x) {
    return x * x;
};
var sum = function(x, y) {
    return x + y;
};
var squareofsum = compose(square, sum);
console.log(squareofsum(2, 3));   // 25
```

## 不完全函数
> f(1, 2, 3, 4, 5, 6) 的调用改为 f(1, 2)(3, 4)(5, 6);后者包含上次调用, 和每次调用相关的函数就是 '不完全函数'

```js
// 将类数组对象转换为真正的数组
function array(arr, n) {
    return Array.prototype.slice.call(arr, n || 0);
}
// 这个函数的实参传递至左侧
function partialLeft(f) {
    var args = arguments;
    return function() {
        var a = array(args, 1);
        a = a.concat(array(arguments));
        return f.apply(this, a);
    }
}
// 这个函数的实参传递值右侧
function partialRight(f) {
    var args = arguments;
    return function() {
        var a = array(arguments);
        a = a.concat(array(args, 1));
        return f.apply(this, a);
    }
}
// 这个函数的实参被用作模板
// 实参列表中的undefined值都被填充
function partial(f) {
    var args = arguments;
    return function() {
        var a = array(args, 1);
        var i = 0, j = 0;
        for (i = 0; i < a.length; i++) {
            if (a[i] === undefined) {
                a[i] = arguments[j++];
            }
        }
        a = a.concat(array(arguments, j));
        return f.apply(this, a);
    }
}

var f = function(x, y, z) {
    return x * (y - z);
};

console.log(partialLeft(f, 2)(3, 4));       // -2  2 * (3 - 4)
console.log(partialRight(f, 2)(3, 4));      // 6   3 * (4 - 2)
console.log(partial(f, undefined, 2)(3, 4));// -6  3 * (2 - 4)
```


# 记忆
> 将上次计算的结果缓存起来,这种缓存技巧叫做记忆

```js
// 返回 f()的带记忆功能的版本
// 只有当f()的实参字符串表示都不相同是它才会工作
function memorize(f) {
    var cache = {};     // 缓存保存在闭包内
    return function() {
        // 将实参转换为字符串形式, 并将其用做缓存的键
        var key = arguments.length + Array.prototype.join.call(arguments, ',');
        if (key in cache) {
            return cache[key];
        }
        else {
            return cache[key] = f.apply(this, arguments);
        }
    }
}

// 返回2个整数的最大公约数
// 欧几里德算法
function gcd(a, b) {
    var t;
    if (a < b) {
        t = b;
        b = a;
        a = t;
    }
    while (b != 0) {
        t = b;
        b = a % b;
        a = t;
    }
    return a;
}

var gcdmemo = memorize(gcd);
console.log(gcdmemo(85, 187));   // 17
```

```js
var factorial = memorize(function(n) {
    return (n <= 1) ? 1 : n * factorial(n - 1);
});

console.log(factorial(5));  // 120   1~4的值有缓存
```


-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
