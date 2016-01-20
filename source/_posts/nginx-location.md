title: "nginx location 设置"
date: 2016-01-20 18:22:18
description: "nginx location 设置"
tags: 
- nginx

----------

## 匹配顺序(和 location 的编辑顺序无关)

```plain
location =            
location 完整路径
location ^~ 路径           
location ~,~* 正则顺序  
location 部分起始路径
/
```


## 字段说明

字段| 说明
:------------- | :-------------
=  | 精确的查找地址
^~  | 开头表示uri以某个常规字符串开头，不是正则匹配,表示普通字符匹配，如果该选项匹配，只匹配该选项，不匹配别的选项，一般用来匹配目录 
~  | 开头表示区分大小写的正则匹配;
~*  | 开头表示不区分大小写的正则匹配
/  | 通用匹配, 如果没有其它匹配,任何请求都会匹配到
@   |   表示为一个location进行命名，即自定义一个location，这个location不能被外界所访问，只能用于Nginx产生的子请求，主要为error_page和try_files。
!~   |  不匹配的
!~*  |  不匹配的
.    | 匹配除换行符以外的任意字符
\w   |  匹配字母或数字或下划线或汉字
\s   |  匹配任意的空白符
\d   |  匹配数字
\b   |  匹配单词的开始或结束
^    | 匹配字符串的开始
$    | 匹配字符串的结束
*    | 重复零次或更多次
+    | 重复一次或更多次
?    | 重复零次或一次
{n}  |   重复n次
{n,} |    重复n次或更多次
{n,m}|    重复n到m次
*?   |  重复任意次，但尽可能少重复
+?   |  重复1次或更多次，但尽可能少重复
??   |  重复0次或1次，但尽可能少重复
{n,m}?|     重复n到m次，但尽可能少重复
{n,}? |    重复n次以上，但尽可能少重复
\W    | 匹配任意不是字母，数字，下划线，汉字的字符
\S    | 匹配任意不是空白符的字符
\D    | 匹配任意非数字的字符
\B    | 匹配不是单词开头或结束的位置
[^x]  |   匹配除了x以外的任意字符
[^aeiou]|     匹配除了aeiou这几个字母以外的任意字符
捕获     (exp) |    匹配exp,并捕获文本到自动命名的组里
(?<name>exp) |    匹配exp,并捕获文本到名称为name的组里，也可以写成(?'name'exp)
(?:exp)   |  匹配exp,不捕获匹配的文本，也不给此分组分配组号
零宽断言     (?=exp)  |   匹配exp前面的位置
(?<=exp)   |  匹配exp后面的位置
(?!exp)    | 匹配后面跟的不是exp的位置
(?<!exp)  |  匹配前面不是exp的位置
注释     (?#comment)    | 这种类型的分组不对正则表达式的处理产生任何影响，用于提供注释让人阅读



## 参考文档

- [http://seanlook.com/2015/05/17/nginx-location-rewrite/](http://seanlook.com/2015/05/17/nginx-location-rewrite/)
- [http://seanlook.com/2015/05/17/nginx-location-rewrite/](http://seanlook.com/2015/05/17/nginx-location-rewrite/)


-----------------------


> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇






