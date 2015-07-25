title: JavaScript权威指南勘误记录
date: 2015-04-05 22:24:35
tags:
- js
---

# 记录我所认为的第六版中文版的错误;欢迎批评~~
<!-- more -->

# P56
```js
myscope = "local";  //这里显式地声明了一个新的全局变量
```
------------
```js
myscope = "local";  //这里隐式地声明了一个新的全局变量
```

# P57
```js
checkscope()  // => "嵌套的作用域"
```
------------------
```js
// 注释部分应保持英文不翻译
checkscope()  // => "nested scope"
```

# P75
```js
如果两个值都是null或者都是undefined，则它们不相等。
```
---------------
```js
如果两个值都是null或者都是undefined，则它们相等。
```

# P77
```js
String.localCompare()方法
```
------
```js
String.prototype.localeCompare() // 个人觉得是prototype; 并且是localeCompare
```

# P125
```js
如果之前o继承自属性x
```
-----
```js
如果之前o继承了属性x
下同，所有“继承自”都应改为“继承了”。
```

# P129
```js
//如果x是undefined、null、false、" "、0或NaN,则它保持不变
```
----
```js
字符串中应没有空格：
//如果x是undefined、null、false、""、0或NaN,则它保持不变
```

# P140
```js
Object.esExtensible()
```
----
```js
Object.isExtensible()
```

# P145
```js
var a1 = [,,,]  
0 in a1  // => true 
```
---------
```js
var a1 = [, , ,];
console.log(0 in a1);// false
```

# P150
```js
if (!a[i]) continue;        // 跳过 null, undefined 和不存在元素
```
--------------
```js
if (!a[i]) continue;        // 跳过 null, undefined , 0, '' 和不存在元素
```

# P152
数组方法
```js
// 个人觉得方法不都是在 Array.prototype 上的吗?
// P163 说在Firefox 上可以使用 Array.join() 等,但是chrome下失败........
```

# P196
```js
var even = function(x) {        // 判断a是否为偶数的函数
    return x % 2 === 0;
};
```
-------
```js
var even = function(x) {        // 判断x是否为偶数的函数
    return x % 2 === 0;
};
```

# P203
```js
var r = range(1, 3);
console.log(r.includes(2));
r.foreach(console.log);
console.log(r);             // 输出(1...3)
```
-----
```js
var r = range(1, 3);
console.log(r.includes(2));
r.foreach(console.log);         // node下正确  chrome/firefox的 Console 下输出如下错误:
                                // TypeError: 'log' called on an object that does not implement interface Console
                                // 参考: https://bugzilla.mozilla.org/show_bug.cgi?id=989619
console.log(r); // node下: { from: 1, to: 3 }   chrome下: Object {from: 1, to: 3, includes: function, foreach: function, toString: function}

console.log(r.toString());          // 显示 或 隐式 调用才会输出 (1...3)
console.log(r + '');
```

# P204
```js
var r = range(1, 3);            // 这里应该使用 构造函数的方式了!!
console.log(r.includes(2));
r.foreach(console.log);
```
-----
```js
var r = new Range(1, 3);        // new Range(1, 3)
console.log(r.includes(2));     
r.foreach(console.log);         
```

# P211
```js
this.toString().match( /function\s*([^()*]\(/ )[1];
```
----
```js
this.toString().match( /function\s*([^(]*)\(/ )[1];
```
# P230
```js
如果B方法重载了A方法
```
---
```js
如果B方法覆盖了A方法  // 重载（overload）覆盖（override）
// 英文原版P228  If a method of B overrides a method of A
// 9.7节将所有的override都错误地翻译成了“重载”，应为“覆盖”。
```

>  重载是指不同的函数使用相同的函数名，但是函数的参数个数或类型不同。调 的时候根据函数的参数来区别不同的函数。

>  覆盖（也叫重写）是指在派生类中重新对基类中的虚函数（注意是虚函数）重新实现。即函数名和参数都一样，只是函数的实现体不一样。

> 隐藏是指派生类中的函数把基类中相同名字的函数屏蔽掉了。隐藏与另外两个概念表面上看来很像，很难区分，其实他们的关键区别就是在多态的实现上。什么叫多态？简单地说就是一个接口，多种实现吧。

> [重载 覆盖 解释来自于yanjun_1982](http://blog.csdn.net/yanjun_1982/article/details/470405)

# P233
```js
但它需要完全重新实现一个add()方法
```
----------
```js
但它不需要完全重新实现一个add()方法
```

# P255
```js
\o     NUL字符(\u0000)]
```
-----
```js
\0     NUL字符(\u0000)]   // 是零不是欧
```

# P256
```js
\w	任何ASCII字符组成的单词，等价于[a-zA-Z0-9]
\W	任何不是ASCII字符组成的单词，等价于[^a-zA-Z0-9]
```
----
```js
\w	任何ASCII字符，等价于 [a-zA-Z0-9_]      // 是字符而非单词，且遗漏原文中等价类的下划线
\W	任何非ASCII字符，等价于 [^a-zA-Z0-9_]
```

# P260
```js
/Java(?! Script)([A-Z]\w*)/
```
----
```js
/Java(?!Script)([A-Z]\w*)/     没有空格
```

# P260
```js
它可以匹配“JavaScript”，但不能匹配“JavaScripter”。
```
---
```js
// 原文: it matches “JavaScrip” but not “JavaScript” or “JavaScripter”.
它可以匹配“JavaScrip”，但不能匹配“JavaScript”或“JavaScripter”。
```

# P371
```js
nextSibling previoursSibling   // 拼写错误
```
----------
```js
nextSibling previousSibling
```

# P393
```js
Window对象的ScrollTop()方法
```
-------
```js
Window对象的ScrollTo()方法
```

# P408
```js
function bold() { document.execCommand("bold", false, url); }
```
----------
```js
function bold() { document.execCommand("bold", false, null); }   // 没有 url.........
```

# P409
```js
document.queryCommandSupport()
```
----------
```js
document.queryCommandSupported()
```

# P447  17.1.2 DOM事件
```js
3级DOM事件规范标准化了不冒泡的focusin和focusout事件来取代冒泡的focus和blur事件
```
----------
```js
3级DOM事件规范标准化了冒泡的focusin和focusout事件来取代不冒泡的focus和blur事件
```

# P447  17.1.2 DOM事件
```js
标准化了冒泡的mouseenter和mouseleave事件来取代不冒泡的mouseover和mouseout事件
```
----------
```js
标准化了不冒泡的mouseenter和mouseleave事件来取代冒泡的mouseover和mouseout事件
```

# P453 17.2.3 addEventListener()
```js
<button id="my button">
```
----------
```js
<button id="mybutton">
```

# P490 18.1.1 指定请求
```js
setRequestHeader()方法的调用必须在调用open()之前但在调用send()之后
```
-------
```js
setRequestHeader()方法的调用必须在调用open()之后但在调用send()之前
```
# P580 客户端存储_导言
```js
本书第8章介绍过现在主流浏览器都支持一个文件对象
```
----------
```js
本书第18章介绍过现在主流浏览器都支持一个文件对象
```

# P598 20.4.2 缓存更新_例20-4
```js
// 事件对象应当是"process"事件(就像哪些被XH2使用的)
```
------
```js
// 事件对象应当是"progress"事件(就像那些被XH2使用的)
```

## 参考资料

- [http://mjpclab.blog.163.com/blog/static/6234841120142250612657/](http://mjpclab.blog.163.com/blog/static/6234841120142250612657/)
- [https://bugzilla.mozilla.org/show_bug.cgi?id=989619](https://bugzilla.mozilla.org/show_bug.cgi?id=989619)
- [http://blog.csdn.net/yanjun_1982/article/details/470405](http://blog.csdn.net/yanjun_1982/article/details/470405)

-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
