---
title: "windows下安装插件出现node-gyp error"
date: 2016-01-09 18:38:35
tags: 
- npm



---

安装插件出现 ImportError: No module named gyp
<!-- more -->

-------

## 问题  

在windows下使用cygwin安装插件出现`ImportError: No module named gyp`

## 原因 
1. 使用了cygwin安装的python
2. Visual Studio2015未安装

## 解决方案

1. 安装 VS2015   
> [在msdn.itellyou上选择开发人员工具下的Visual Studio 2015 Update 1安装](http://msdn.itellyou.cn/)  

2. 安装Python 2.7  
> [Python 2.7必须为安装包安装,在`cygwin`中安装的`python`无效](https://www.python.org/downloads/)  

3. 在`计算机->属性->高级系统设置->环境变量->系统变量`的  `PATH`添加 `path\Python27\python.exe;` (必须添加到`python.exe`)
4. 在命令行中输入`npm config set python path\Python27\python.exe`
(`cygwin`下也可以在 `.zshrc`中添加`export PYTHON="D:/Python27/python.exe"
`)
5. `npm config set msvs_version 2015 --global`

*至此,安装 `mongodb` 等插件就能正常编译了*

## 其它
如果依然不行,请尝试下面设置后再次尝试

`set VCTargetsPath=C:\Program Files (x86)\MSBuild\Microsoft.Cpp\v4.0\V140`



## 参考文档

- [https://github.com/nodejs/node-gyp/issues/629#issuecomment-153196245](https://github.com/nodejs/node-gyp/issues/629#issuecomment-153196245)

- [https://github.com/nodejs/node-gyp](https://github.com/nodejs/node-gyp)

- [use set VCTargetsPath](https://github.com/nodejs/node-gyp/issues/807#issuecomment-163364030)

-----------------------

-----------------------


> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇




