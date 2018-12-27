---
title: "在已忽略文件夹中不忽略指定文件夹"
date: 2015-10-24 22:02:06
tags: 
- git


---

网上搜索到的答案有很多是错误的,故记录之
<!-- more -->




-  在已忽略文件夹中不忽略指定文件夹`忽略themes文件夹所有内容, 除了 themes/jacman/文件夹`

> **`/*`  不可省略!**
```plain
themes/*
!themes/jacman/
```

> (英文原文: ) Example to exclude everything except a specific directory foo/bar (note the /* - without the slash, the wildcard would also exclude everything within foo/bar):

```plain
# exclude everything except directory foo/bar
/*
!/foo
/foo/*
!/foo/bar
```


- 其它注意点

1. 空行不匹配任何内容,所以可以作为块分隔符；
2. `#` 开头表示注释,如果相匹配 `#`,可以在前面加一个反斜杠,即 `\#`
3. 除非加了反斜杠,否则一连串的空格会被忽略；
4. 如果在匹配的内容前面加上 ` !` ,则这些匹配过的部分将被移出,如果要匹配以  `!`  开头的内容,需要加上反斜杠,如  `\!important.txt`
5. 如果一个匹配 pattern 后面有一个斜杠,如 ` foo/`,则默认会匹配所有（包含父子文件夹）中的 foo 文件夹内容
6. 如果一个匹配 pattern 不包含斜杠,如 foo,Git 会将其作为一个 shell 的查找命令匹配内容

# 参考文档

- [此文章为错误说明已忽略文件夹中不忽略指定文件夹写法](http://www.barretlee.com/blog/2015/09/06/set-gitignore-after-add-file/)
- [http://my.oschina.net/longyuan/blog/521098](http://my.oschina.net/longyuan/blog/521098)
- [https://git-scm.com/docs/gitignore](https://git-scm.com/docs/gitignore)

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇


