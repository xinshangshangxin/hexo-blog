title: JavaScript权威指南笔记6_正则表达式
date: 2015-04-12 21:19:30
description:  正则表达式150412
tags:
- js
---

> 具有特殊含义的标点符号

```js
^ $ . * + ? = ! : | \ / ( ) [ ] { }
```

> 选择项尝试匹配次序是从左到右,直到发现匹配项

```js
console.log('ab'.match(/a|ab/g));  // [ 'a' ]
```
> 引用 \n, n由参与计数的左括号位置决定

> \b 字符边界  [\b] 退格符

> m 多行匹配模式, ^和$ 匹配行的开始处和结束处

```js
var str = 'str\nstr';
console.log(str.match(/^\w+$/m));   // [ 'str', index: 0, input: 'str\nstr' ]
console.log(str.match(/^\w+$/));    // null
```

> search(regexp)  
>> 如果参数不是正则表达式,则首先通过RegExp构造函数将它转换为正则表达式
>> search 忽略正则表达式参数中的修饰符 g


> replace (searchValue, replaceValue)
>> 如果 searchValue 不是正则表达式, replace将直接搜索这个字符串
>> replaceValue 如果出现 $加数字, 则使用制定的子表达式相匹配的文本来替换这个字符串
>> replaceValue 可以为函数............

> match

```js
var reg = /(a(\w))/;
var reg2 = /(a(\w))/g;

console.log('abac'.match(reg));     // [ 'ab', 'ab', 'b', index: 0, input: 'abac' ]
                        //[ 没有括号的匹配, 第一个左括号的匹配, 第二个左括号的匹配 , index: 0, input: 'abac']
console.log('abae'.match(reg2));    //[ 'ab', 'ae' ]
                                    // [第一次匹配,  第二次匹配]
```

> 给RegExp()传入一个字符串表述的正则表达式,必须将'\' 替换为 '\\\\'

> Regexp.exec() 总是返回一个匹配结果,并提供关于本次匹配的完整信息


-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
