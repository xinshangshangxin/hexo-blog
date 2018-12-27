---
title: "NodeJs的几种文件路径"
date: 2016-02-04 09:30:08
tags: 
- node




---

NodeJs的几种文件路径
<!-- more -->

-------


## 结论
`__dirname` : 总是返回被执行的 js 所在文件夹的绝对路径
`__filename`: 总是返回被执行的 js 的绝对路径
`process.cwd()`: 总是返回运行 node 命令时所在的文件夹的绝对路径
`./`: 在 `require()` 中使用是跟 `__dirname`的效果相同，不会因为启动脚本的目录不一样而改变，在其他情况下跟 `process.cwd()` 效果相同，是相对于启动脚本所在目录的路径。

## 建议
只有在 `require()` 时才使用相对路径(`./, ../`) 的写法，其他地方一律使用绝对路径

```js
// 当前目录下
path.dirname(__filename) + '/test.js';
// 相邻目录下
path.resolve(__dirname, '../lib/common.js');
```



## 参考文档

- [https://github.com/imsobear/blog/issues/48](https://github.com/imsobear/blog/issues/48)


-----------------------


> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇


