---
layout: post
title: 制作portable版Cygwin
date: 2016-06-14 22:17:19
tags:
- cygwin


---

制作portable版Cygwin和完整删除Cygwin
<!-- more -->




## 制作portable版Cygwin
### 本地机器
1. 压缩打包安装目录
2. 导出注册表
```plain
# cygwin下
reg export HKLM\\SOFTWARE\\Cygwin cygwin.reg

# cmd.exe下
reg export HKLM\SOFTWARE\Cygwin cygwin.reg
```

### 另一台机器
1. 解压缩安装目录
2. 修改注册表相关根目录
3. 导入注册表: `reg import cygwin.reg`

## 完整删除Cygwin
1. 删除下载包目录
2. 停止服务: `cygrunsrv -L`, `cygrunsrv -S`, `cygrunsrv -R`
3. 删除安装目录
4. 删除注册表： `reg delete HKLM\SOFTWARE\Cygwin /f`, `reg delete HKCU\SOFTWARE\Cygwin /f`
5. 删除环境变量: `PATH`, `CYGWIN`


## 参考文档

- [https://segmentfault.com/a/1190000005650072](https://segmentfault.com/a/1190000005650072)

<br>

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
