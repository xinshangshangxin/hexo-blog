---
title: "npm 安装插件无权限"
date: 2015-10-24 17:36:32
tags:
- npm



---

安装插件出现 Error: EACCES, open '....'
<!-- more -->



-  需要设置权限写文件

```js
sudo chown -R `whoami` ~/.npm
```
- 尝试安装插件, 如果出错,继续执行

```js
sudo chown -R `whoami` /usr/local/lib/node_modules
```
- 如果依然有错, 可能需要

```js
sudo chown -R `whoami` /usr/local
```
- 还是报错,请 `sudo` 执行命令

```js
sudo npm install ...
```


# 参考文档

- [http://stackoverflow.com/questions/16151018/npm-throws-error-without-sudo](http://stackoverflow.com/questions/16151018/npm-throws-error-without-sudo)

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇



