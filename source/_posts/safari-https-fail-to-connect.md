---
layout: post
title: "safari无法打开https网页"
date: 2017-01-09 20:37:45
tags:
- nginx


---

Android和桌面chrome代开网址没有问题,但是iphone和桌面safari却出现: 「 无法打开页面https://XXXXX，因为网络连接被重设。如果服务器或网络连接忙碌，此问题可能发生。请等待几分钟，然后再试一次。」
<!-- more -->



## 问题描述:

打开网址出现 Safari   
  

>「 无法打开页面"https ://XXXXX"，因为网络连接被重设。如果服务器或网络连接忙碌，此问题可能发生。请等待几分钟，然后再试一次。」  

<div></div>

>「 Safari cannot open the page because the network connection was reset. The server may be busy 」

 ![](/img/safari-https/1.jpg)


## 解决方法

在 nginx的 server 配置中添加  
  ```plain
  ssl_session_cache shared:SSL:10m;
  ```
  
这个可能和[nginx的一个ticket相关](https://trac.nginx.org/nginx/ticket/235), 在nginx1.10中没有发现, 在1.8中出现了, 其它版本未知.


## 参考文档

- [http://serverfault.com/questions/646142/ssl-proxying-on-nginx-different-behavior-in-different-clients](http://serverfault.com/questions/646142/ssl-proxying-on-nginx-different-behavior-in-different-clients)
- [https://community.letsencrypt.org/t/apple-safari-browsers-fail-to-connect/3731/4](https://community.letsencrypt.org/t/apple-safari-browsers-fail-to-connect/3731/4)
  
<br>

-----------------------


> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
