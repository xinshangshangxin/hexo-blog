---
title: "JS设计模式笔记(代理模式,迭代器模式)"
date: 2015-06-23 16:18:24
tags:
- js
- 设计模式


---

JS设计模式笔记(代理模式,迭代器模式)
<!-- more -->



# 代理模式
**代理模式是为一个对象提供一个代替品或占位符,以便控制对它的访问**
> 往往不需要猜测是否需要代理模式,当正真发现不方便直接访问某个对象的时候,再编写代理也不迟

### 虚拟代理实现图片加载

```js
var myImage = (function() {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);

    return {
        setSrc: function(src) {
            imgNode.src = src;
        }
    };
}());

var proxyImage = (function() {
    var img = new Image;
    img.onload = function() {
        myImage.setSrc(this.src);
    };

    return {
        setSrc: function(src) {
            myImage.setSrc('http://upload.xinshangshangxin.com/o_19n9lj3a480nl2l1ie7up31ckc9.png');
            img.src = src;
        }
    }
}());

proxyImage.setSrc('http://upload.xinshangshangxin.com/o_19n9ljafs96hpif1o401mci1r7c18.jpg');
```
- **符合单一职责原则;MyImage对象负责给img对象设置src, proxyImage负责预加载图片**
- **符合开放封闭原则;没有改变或者增加myImage的接口,但是通过代理对象,实际上给系统添加了新的行为**
- **代理和本体接口的一致性. 如果代理对象和本体对象都为一个函数(函数也是对象),函数必然都能执行,则可以认为它们也具有一致的接口**


### 虚拟代理合并HTTP请求
```js
var synchronousFile = function(id) {
    console.log('开始同步文件,id为: ' + id);
};

var proxySynchronousFile = (function(){
    var cache = [];
    var timer;

    return function(id) {
        cache.push(id);
        if (timer) {
            return;
        }

        timer = setTimeout(function() {
            synchronousFile(cache.join(','));
            clearTimeout(timer);
            cache.length = 0;
            timer = null;
        }, 2000);
    }
}());

var checkbox = document.getElementsByTagName('input');

for(var i = 0; c=checkbox[i++]; ) {
    c.onclick= function() {
        if(this.checked === true) {
            proxySynchronousFile(this.id);
        }
    }
}

/* html
 <input type="checkbox" id="1">1
 <input type="checkbox" id="2">2
 <input type="checkbox" id="3">3
 <input type="checkbox" id="4">4
 <input type="checkbox" id="5">5
 */
```


### 缓存代理--计算乘积
```js
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
```
**增加缓存代理, mult函数可以继续专注于自身的职责(计算成绩), 缓存的功能能够有代理对象实现**


### 用高阶函数动态创建代理

```js
/*****计算成绩*******/
var mult = function() {
    var a = 1;
    for (var i = 0, l = arguments.length; i < l; i++) {
        a = a * arguments[i];
    }

    return a;
};

/********计算加和************/
var plus = function() {
    var a = 0;
    for (var i = 0, l = arguments.length; i < l; i++) {
        a = a + arguments[i];
    }
    return a;
};

/*****创建缓存代理工厂*****/
var createProxyFactory = function(fn) {
    var cache = {};
    return function() {
        var args = [].join.call(arguments, ',');
        if (args in cache) {
            return cache[args];
        }

        return cache[args] = fn.apply(this, arguments);
    }
};

var proxyMult = createProxyFactory(mult);
var proxyPlus = createProxyFactory(plus);

console.log(proxyMult(1, 2, 3, 4));
console.log(proxyMult(1, 2, 3, 4));
console.log(proxyPlus(1, 2, 3, 4));
console.log(proxyPlus(1, 2, 3, 4));
```


# 迭代器模式
> 迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素,而又不需要暴露该对象的内部表示.迭代器模式可以把迭代的过程从业务逻辑中分离出来,在使用迭代器模式之后,即使不关心对象的内部构造,也可以按顺序访问其中的每个元素

## 实现自己的迭代器
```js
var each = function(arr, cb) {
    for (var i = 0, l = arr.length; i < l; i++) {
        cb.call(arr[i], i, arr[i]); // 把下标  和 元素 当作参数传给 cb
    }
};


// 例子
each([1,2,3], function(i, n) {
    console.log(i, n);
});
```

## 内部迭代器
> 内部迭代器在调用的时候非常方便,外界不用关心迭代器内部的实现,跟迭代器的交互也仅仅是一次初始调用(优点也是缺点)

```js
var compare = function(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        throw new Error('arr1 和 arr2 不相等');
    }
    each(arr1, function(i, n) {
        if (n !== arr2[i]) {
            throw new Error('arr1 和 arr2 不相等');
        }
    });

    console.log('arr1 和 arr2 相等');
};

compare([1, 2, 3, 4], [1, 2, 3, 5]); // throw new Error('arr1 和 arr2 不相等');
```

## 外部迭代器
> 外部迭代器必须显示的请求迭代下一个元素
> 外部迭代器增加了一些调用的复杂度,但相对也增强了迭代器的灵活性,我们可以手工控制迭代的工程或者顺序

```js
var Iterator = function(arr) {
    var current = 0;

    var next = function() {
        current += 1;
    };

    var isDone = function() {
        return current >= arr.length;
    };

    var getCurrItem = function() {
        return arr[current];
    };

    return {
        next: next,
        isDone: isDone,
        getCurrItem: getCurrItem
    }
};


var compare = function(iterator1, iterator2) {
    while(!iterator1.isDone() && !iterator2.isDone()) {
        if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
            throw  new Error('iterator1 和 iterator2 不相等');
        }

        iterator1.next();
        iterator2.next();
    }

    if (iterator1.isDone() && iterator2.isDone()) {
        console.log('iterator1 和 iterator2 相等');
    }
    else {
        throw  new Error('iterator1 和 iterator2 不相等');
    }

};

var iterator1 = new Iterator([1, 2, 3]);
var iterator2 = new Iterator([1, 2, 3]);

compare(iterator1, iterator2); // iterator1 和 iterator2 相等;
```

## 中止迭代器
```js
var each = function(arr, cb) {
    for (var i = 0, l = arr.length; i < l; i++) {
        if (cb(i, arr[i]) === false) {
            break;
        }
    }
};

// 例子
each([1, 2, 3, 4, 5], function(i, n) {
    if (n > 3) {
        return false;
    }
    console.log(n);  // 1  2  3
});
```

## 应用举例
```js
var supportFlash = function() {
    // 未实现
};

var getActiveUploadObj = function() {
    try{
        return new ActiveXObject('TXFTNActivex.FTMUpload');
    }
    catch(e) {
        return false;
    }
};

var getFlashUploadObj = function() {
    if (supportFlash()) {
        var str = '<object type="application/x-shockwave-flash"></object>';
        return $(str).appendTo($('body'));
    }
    return false;
};

var getFormUploadObj = function() {
    var str = '<input name="file" type="file">';
    return $(str).appendTo($('body'));
};

var iteratorUploadObj = function() {
    for (var i = 0, fn; fn = arguments[i++]; ) {
        var uploadObj = fn();
        if (uploadObj !== false) {
            return uploadObj;
        }
    }
};

var uploadObj = iteratorUploadObj(getActiveUploadObj, getFlashUploadObj, getFormUploadObj);
```

**迭代器模式是一种相对简单的模式,简单到很多时候不认为它是一种设计模式**


# 参考文档
- *实体书:* `JavaScript设计模式与开发实践(曾探)`

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

