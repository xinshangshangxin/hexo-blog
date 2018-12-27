---
title: cordova_Intellij 配置
date: 2015-02-17 14:46:41
tags: 
- cordova
- Intellij


---

使用Intellij 搭建第一个cordova 混合应用程序;以 windows 和 andorid 为例
<!-- more -->



# 环境变量配置[Android]

> ANT_HOME 
```js
 C:\Program Files\ant
```
> ANDROID_HOME
```js
C:\Program Files\adt-bundle-windows-x86_64-20140321\sdk
```

> JAVA_HOME 
```js
C:\Program Files\Java\jdk1.7.0_05
```
> 添加到PATH
```js
%JAVA_HOME%\bin;%ANT_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;
```
# nodejs下载安装
>  * [官网下载nodejs](http://nodejs.org/)
>  * 安装直接下一步......安装完成
>  * 新的CMD 测试下 `node -v` 和 `npm -v`; 显示版本号则安装成功

#  cordova 构建应用
1. 安装cordova
```js
npm install -g cordova
```
2. 创建App
```js
d:
cd d:/android
cordova create hello com.example.hello HelloWorld
```
3. 进入 hello 目录
```js
cd hello
```
4. 添加平台 *只配置了android环境;所以只需要第一条命令*
```js
cordova platform add android
cordova platform add ios
cordova platform add amazon-fireos
cordova platform add blackberry10
cordova platform add firefoxos
```
5. 构造App
```js
cordova build
```

# Intellij IDEA导入项目

![Intellij_cordova](/img/Intellij_cordova/2.png)
> *选择安装 hello 的根目录*

![Intellij_cordova](/img/Intellij_cordova/3.png)
> *选择 create*

![Intellij_cordova](/img/Intellij_cordova/4.png)
![Intellij_cordova](/img/Intellij_cordova/5.png)
![Intellij_cordova](/img/Intellij_cordova/6.png)
> **注意!!!**

![Intellij_cordova](/img/Intellij_cordova/7.png)
![Intellij_cordova](/img/Intellij_cordova/8.png)
![Intellij_cordova](/img/Intellij_cordova/9.png)
![Intellij_cordova](/img/Intellij_cordova/10.png)
> **注意!!!**

![Intellij_cordova](/img/Intellij_cordova/11.png)



# 其他可能问题:
### usb调试
![Intellij_cordova](/img/Intellij_cordova/13.png)
> *如果没有图中所示的Android; 就先在右侧项目上右键 点击 run all test*

![Intellij_cordova](/img/Intellij_cordova/12.png)
### source 1.3 中不支持注释 (请使用 -source 5 或更高版本以...
> [Set language level via File > Project Structure > Project > Project language level](http://stackoverflow.com/questions/17714584/what-is-project-language-level-in-intellij-idea"参考资料")

![Intellij_cordova](/img/Intellij_cordova/14.png)
![Intellij_cordova](/img/Intellij_cordova/15.png)

# 参考文档
[http://www.it165.net/pro/html/201407/17784.html](http://www.it165.net/pro/html/201407/17784.html)
[http://www.cnblogs.com/or2-/p/3842158.html](http://www.cnblogs.com/or2-/p/3842158.html)
[官方插件](http://cordova.apache.org/docs/zh/edge/_index.html)

