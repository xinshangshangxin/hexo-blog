title: npm安装modules失败
date: 2015-02-18 16:09:42
description: npm安装modules失败解决方法,以及windows下无法删除modules解决办法
tags:
- npm
- node
---


# npm安装modules失败
## 设置代理服务器
> 设置GoAgent代理在我这里失败了......

### 用纯文本编辑器打开编辑
####  用户配置或者全局配置[2选1即可]
* 获取用户配置文件路径
```js
npm config get userconfig
```
* 获取全局配置文件路径
```js
npm config get globalconfig
```
* 用文本编辑器打开后加上
```js
proxy = http://server:port
https-proxy = http://server:port
```

### 用cmd编辑代理
```js
npm config set proxy http://server:port
npm config set https-proxy http://server:port
```

## 使用优秀的npm镜像资源 *我正在使用的*
> **淘宝npm镜像**
> 搜索地址：[http://npm.taobao.org/](http://npm.taobao.org/)
> registry地址：[http://registry.npm.taobao.org/](http://registry.npm.taobao.org/)
> 
> **cnpmjs镜像**
> 搜索地址：[http://cnpmjs.org/](http://cnpmjs.org/)
> registry地址：[http://r.cnpmjs.org/](http://r.cnpmjs.org/)

### 临时使用
```js
npm --registry https://registry.npm.taobao.org install express
```

### 持久使用
```js
npm config set registry https://registry.npm.taobao.org
// 配置后可通过下面方式来验证是否成功
npm config get registry
// 或
npm info express
```


# windows下无法删除modules, 提示找不到文件
> google了下,在 [stackoverflow.com](stackoverflow.com)上找到了答案:
`Windows下文件嵌套长度无法超过256字符,`所以就只能把文件名称改短了,有人给了 `.bat`文件

```js
@echo off
if not (%1)==() cd %1
for /D %%i in (*) do if not %%i==_ ren "%%i" _
pushd _ 
%0 
popd
```
> 新建文本文件;复制上面的代码并保存, 重新命名文件为 `文件名过长.bat`
> 将你要删除的modules 拖到这个 `文件名过长.bat`上;出现下面的截图内容关闭

![](/img/npm/1.png)

> 接着再删除这个 文件夹; 如果还是删除不了;用下面的 bat;用法和上面一样

```js
DEL /F /A /Q \\?\%1
RD /S /Q \\?\%1
```
> 还是无法删除?!! 手动进入文件夹;查看哪个文件夹的名称不是 `_` ,再使用第一个`bat`文件,尝试删除;如此循环....

# 参考资料
1. [stackoverflow.com](stackoverflow.com)
2. [Npm的配置管理及设置代理](http://www.cnblogs.com/huang0925/archive/2013/05/07.html)
3. [国内优秀npm镜像推荐及使用](http://riny.net/2014/cnpm/)
