---
title: JavaScript权威指南笔记
date: 2015-04-01 19:06:22
tags:
- js


---

JavaScript权威指南笔记150401
<!-- more -->



## 字符长度 `P39`

```js
var p = 'π';
var e = 'e';
var ch = '中';
p.length
e.length
ch.length
```

![](https://raw.githubusercontent.com/xinshangshangxin/hexo-blog/gh-pages/img/Definitive_Guide_js/str_len.png)
> 在文件不同编码下,字符长度不同...
> `GBK`下答案为2/1/2; `utf8`下为1/1/1

> 书中`P39`中的 例子怎么实现呢(p.length =>1  e.length => 2)??求告知

## 布尔值`P43`

> 下面的值会转换成 `false`

```js
undefined
null
0
-0
NaN
"" //空字符串
```
> 对象(包括数组)或转换成 `true`

```js
var arr = [];

if (arr) {
    console.log('true');  //输出true
}
else {
    console.log('false');
}
```
> 但是这里又不对了:

```js
if (arr == false) {
    console.log('arr == false') //输出了false
}
else {
    console.log('arr != false');
}
```

原因:


**类型转换**

Value       | String    |	Number|	Boolean	| Object 
:------:    |:-----:    |:-----: |:------: |:-------:
undefined   |'undefined' |	NaN	|false	|throws TypeError
null	    |'null'	|0	|false	|throws TypeError
true	|'true'	    |1	 ||	new Boolean(true)|
false	|'false'	|0	 ||	new Boolean(false)|
"" (empty string)|	 	|0	|false	|new String("")
"1.2" (nonempty, numeric)|	 	|1.2|	true|	new String("1.2")
"one" (nonempty, non-numeric)|	 	|NaN	|true	|new String("one")
0	|'0'	 ||	false|	new Number(0)|
-0	|'0'	 ||	false|	new Number(-0)
NaN	|'undefined'	 ||	false	|new Number(NaN)
Infinity|	'Infinity'	 ||	true|	new Number(Infinity)
-Infinity|	'-Infinity'	 ||	true|	new Number(-Infinity)
1 (finite, non-zero)|	'1'	 ||	true|	new Number(1)
{} (any object)	 ||	NaN	|true	 
[] (empty array)|	''	|0|	true	 
[9] (1 numeric elt)	|'9'	|9	|true	 
[‘a’] (any other array)|	use join() method|	NaN	|true	 
function(){} (any function)	|'undefined'|	NaN|	true	 


```js
false => 0
[] => 0    [0] => 0
```

**隐性类型转换步骤**
> 1. 首先看双等号前后有没有NaN，如果存在NaN，一律返回false。
> 2. 再看双等号前后有没有布尔，有布尔就将布尔转换为数字。（false是0，true是1）
> 3. 接着看双等号前后有没有字符串, 如果是字符串：
>> - 对方是对象，对象转字符串(*方法见下面*)；
>> - 对方是数字，字符串转数字
>> - 对方是字符串，直接比较
>> - 其他返回false
> 3. 如果是数字，对方是对象，对象转数字(*方法见下面*), 其他一律返回false
> 4. null, undefined不会进行类型转换, 但它们俩相等


**对象转字符串**
![](https://raw.githubusercontent.com/xinshangshangxin/hexo-blog/gh-pages/img/Definitive_Guide_js/obj2str.png)

**对象转数字**
![](https://raw.githubusercontent.com/xinshangshangxin/hexo-blog/gh-pages/img/Definitive_Guide_js/obj2nu.png)

[上图pdf下载](https://raw.githubusercontent.com/xinshangshangxin/hexo-blog/gh-pages/other/Definitive_Guide_js/obj2nu_str.pdf)


**栗子:**
```js
var a;
console.dir(0 == false);//true
console.dir(1 == true);//true
console.dir(2 == {valueOf: function(){return 2}});//true
console.dir(a == NaN);//false
console.dir(NaN == NaN);//false
console.dir(8 == undefined);//false
console.dir(1 == undefined);//false
console.dir(2 == {toString: function(){return 2}});//true
console.dir(undefined == null);//true
console.dir(null == 1);//false
console.dir({ toString:function(){ return 1 } , valueOf:function(){ return [] }} == 1);//true
console.dir(1=="1");//true
console.dir(1==="1");//false
```


## 包装对象 `P46`
> 如果引用字符串的属性,就会将字符串通过new String()转换成对象,这个对象处理属性的引用;一旦引用结束,这个新创建的对象就会被销毁

```js
var s = 'test';
s.len = 4;          // 引用结束立即销毁
console.log(s.len); // undefined
```

> `null` 和 `undefined` 没有包装对象


## 参考资料:

[http://www.haorooms.com/post/js_yinxingleixing](http://www.haorooms.com/post/js_yinxingleixing)
[http://www.lookcss.com/js-type/](http://www.lookcss.com/js-type/)

-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇


  [1]: ./1427879165966.jpg "1427879165966.jpg"

