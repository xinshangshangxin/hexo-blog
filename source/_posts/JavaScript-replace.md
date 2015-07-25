title: "JavaScript-replace"
date: 2015-05-09 15:47:23
description:  我对JavaScript-replace理解见解
tags:
- js
---



`String.replace(searchValue,replaceValue)`
1.  String:字符串
2.  searchValue：字符串或正则表达式
3.  replaceValue:字符串或者函数

## 字符串替换字符串
```js
'I am loser!'.replace('loser','hero')
//I am hero!
```
    
直接使用字符串能让自己从loser变成hero,但是如果有2个loser就不能一起变成hero了.

```js
'I am loser,You are loser'.replace('loser','hero');
//I am hero,You are loser 
```

## 正则表达式替换为字符串

```js
'I am loser,You are loser'.replace(/loser/g,'hero')
//I am hero,You are hero
```
使用正则表达式,并将正则的global属性改为true则可以让所有loser都变为hero

## 有趣的替换字符

`replaceValue` 可以是字符串.如果字符串中有几个特定字符的话,会被转换为特定字符串.

字符|替换文本
:----:|:----------:
$$| 插入字符串 "$"
 $& | 第一个参数所匹配的子串 
 $` | 匹配字符串左边的字符 
 $' | 匹配字符串右边的字符 
$n 或 $nn| 如果n或nn是个十进制的数字,并且replace方法的第一个参数是个正则表达式,那么$n表示正则表达式中的第n个子匹配字符串. 

### 使用$&字符给匹配字符加大括号

```js
var sStr='讨论一下正则表达式中的replace的用法';
sStr.replace(/正则表达式/,'{$&}');
//讨论一下{正则表达式}中的replace的用法
```

### 使用$`和$'字符替换内容

```js
'abc'.replace(/b/,"$`");//aac
'abc'.replace(/b/,"$'");//acc
```

### 使用分组匹配组合新的字符串

```js
'nimojs@126.com'.replace(/(.+)(@)(.*)/,"$2$1")//@nimojs
```

## replaceValue参数可以是一个函数

`String.replace(searchValue,replaceValue)` 中的**replaceValue**可以是一个函数.

如果指定一个函数作为第二个参数. 当匹配执行后,该函数就会执行. 函数的返回值作为替换字符串被使用. **(注意:  上面提到的特殊替换参数在这里不能被使用.)** 另外要注意的是, 如果第一个参数是正则表达式, 并且其为全局匹配模式, 那么这个方法将被多次调用, 每次匹配都会被调用.

变量名	| 代表的值
:-----:| :-----:
str	|匹配的子串.(对应于上面的 `$&` )
p1, p2, ...	|第n个括号中匹配的子字符串
offset	|该字符串匹配的偏移量
s| 整个字符串

> 我的理解:
>> 函数的参数 和str.match(reg) 得到的内容一样

# 例子更清晰~~
```js
console.log('my love hebe'.match(/(\w+)\s\w+\s(\w+)/ ));
// [ 'my love hebe', 
// 'my', 
// 'hebe', 
// index: 0, 
// input: 'my love hebe' ]

function logArguments() {
    console.log(arguments);
// { '0': 'my love hebe',
//  '1': 'my',
//  '2': 'hebe',
//  '3': 0,
//  '4': 'my love hebe' }
//}
console.log(
    'my love hebe'.replace(/(\w+)\s\w+\s(\w+)/, logArguments)
);
console.log('my love hebe'.match(/(\w+)\s\w+\s(\w+)/ ));
```


----------


## 修改参考了:

- [深入理解JavaScript-replace](http://nimojs.com/blog/posts/%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3JavaScript-replace.html)


-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
