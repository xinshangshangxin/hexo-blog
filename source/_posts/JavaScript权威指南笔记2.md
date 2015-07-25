title: JavaScript权威指南笔记2
date: 2015-04-02 21:22:12
description: JavaScript权威指南笔记150402
tags:
- js
---

## 结合性 `P69`
> 一元操作符,赋值和三元条件运算符具有从左到右的结合性

```js
x = ~-y;
x = ~(-y);

w = x = y = z;
w = ( x = (y = z));

a ? b : c ? d : e ? f : g;
a ? b : (c ? d : (e ? f : g));
```

## javascript 总是严格的按照从左到右的顺序计算表达式 `P69`

> 计算b的值: `a=1; b = (a++) + a;`
1. 计算 `b`
2. 计算 `a++` (假设其值为c)
3. 计算 `a`
4. 计算 `c + a`
5. 将 `c + a` 的值赋值给 `b`

> 其中 第2步 先 `c = 1;` 然后 `a = a + 1;`
> 所以第3步的 `a = 2`
> 所以 `b = 3`


## '+' 运算符 `P70`
> 加法的转换规则优先考虑字符串转换,如果其中一个操作数是字符串或者转换为字符串的对象,另一个操作符会转换为字符串
> 如果2个操作数都不是类字符串,进行算数加法运算
> 转换规则见[上一篇的类型转换和对象转字符串_数字](http://blog.xinshangshangxin.com/2015/04/01/JavaScript%E6%9D%83%E5%A8%81%E6%8C%87%E5%8D%97%E7%AC%94%E8%AE%B0/)

```js
'1' + '2' = '12';
'1' + 2 = '12';
1 + {} = 1[object Object]; //对象转成字符串
true + true = 2;
2 + null = 2;
2 + undefined = NaN;

1 + 2 + 'str' = '3str';
1 + (2 + 'str') = '12str';
```

## 一元算数运算符
> '++' 将操作数转换为数字,然后给数字加1

```js
var x = '1';
console.log(x + 1);     //'11'
x = '1';
console.log(x++);       // '1'
x = '1';
console.log(++x);       // '2'
```

## 逻辑与 && `P79`
> 假值:`false` `null` `undefined` `0` `-0` `NaN` `''`
> 1. 先计算左操作数的值,如果为假值,则返回左操作数
> 2. 如果为真值, 计算右操作符并将其返回

```js
console.log(1 && NaN); // NaN
console.log(null && 1); // null
console.log({x : '左'} && {x: '右'}); //{ x: '右' }
```

```js
// 假设 fun 为某函数
if (fun) {
    fun();
}
// 简写为
fun && fun();  // jsHint会警告.....
```

## 逻辑或 || `P80`
> 1. 先计算左操作数的值,如果为真值,则返回左操作数
> 2. 如果为假值, 计算右操作符并将其返回

```js
console.log({x: '左'} || {x: '右'}); // { x: '左' }
console.log(null || {x: '右'}); // { x: '右' }
```
```js
// 给参数提供默认值
function copy(str) {
    str = str || '123'; //设置默认值
}
```

## eval `P84`
> eval使用了调用它的变量作用域环境


## typeof `P87`

x | typeof x
:----: | :-----:
undefined | 'undefined'
null | 'object'
true/false | 'boolean'
数字/NaN | 'number'
字符串 | 'string'
函数 | 'function'
内置对象(非函数) | 'onject'
宿主对象 | 由编译器各自实现的字符串, 但不是 'undefined' 'boolean' 'number' 'string'

最后一张思维导图
![](https://raw.githubusercontent.com/xinshangshangxin/hexo-blog/gh-pages/img/Definitive_Guide_js/operator.gif)
## 参考资料:

[http://segmentfault.com/a/1190000002423935](http://segmentfault.com/a/1190000002423935)

-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
