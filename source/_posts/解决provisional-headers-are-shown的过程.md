---
title: 解决provisional headers are shown的过程
date: 2015-04-20 22:31:45
tags:
- js


---

解决provisional headers are shown的过程
<!-- more -->



# 前言

学习Angular时写了一个音乐播放器  
[oschina地址](http://git.oschina.net/xinshangshangxin/ngMusic)  
[github地址](https://github.com/xinshangshangxin/ngMusic)  
为了兼容android chrome,[参考了这篇文章](http://hi.baidu.com/hf_zd/item/f65a68b8868a377e254b09a5);


> 在数据读取中要中断的时候，可以把audio.src设为null，并显式调用audio.load()，
此时对于Android会中断数据读取，并且canplay也不会发生

所以在我的代码中也如此使用了

```js
_audio.src = null;
_audio.load();
```
但是由于百度有些音乐无法直接播放;需要服务器转发,所以音乐链接带上了服务器转发地址

# 问题出现
在前面几首歌上带上转发没有问题;但是当列表循环后;就出现了无法从服务器上获取音乐内容了;  
查看chrome控制台,链接上显示 `Provisional headers are shown`

![error](/img/chrome/error.png)

关闭标签;重新打开网址;音乐有又可以加载了!!!

# 尝试过程

刚开始以为是因为本地环境的问题;将代码挂在到服务器上,依然有问题
开始谷歌搜索 `Provisional headers are shown`, 在这篇文章中[http://segmentfault.com/q/1010000000364871](http://segmentfault.com/q/1010000000364871)  


> 之所以会出现这个警告，是因为去获取该资源的请求其实并（还）没有真的发生，所以 Header 里显示的是伪信息，直到服务器真的有响应返回，这里的 Header 信息才会被更新为真实的。不过这一切也可能不会发生，因为该请求可能会被屏蔽。比如说 AdBlock 什么的，当然了不全是浏览器扩展，具体情况具体分析了

但是我测试的浏览器只有开发工具,没有 AdBlock之类的;所以pass

接着 有找到这篇文章[https://code.google.com/p/chromium/issues/detail?id=327581](https://code.google.com/p/chromium/issues/detail?id=327581)


> That is because websockets never report their requestHeadersText.
Fixed for the new implementation.

在新版本中修复... 我的chrome是42;所以 pass

接着在[http://stackoverflow.com/questions/21177387/caution-provisional-headers-are-shown-in-chrome-debugger](http://stackoverflow.com/questions/21177387/caution-provisional-headers-are-shown-in-chrome-debugger)  
发现推荐答案依然是 AdBlock等之类的拦截, 继续看回答, 说使用 `chrome://net-internals`; 玩了下,根本就不知道怎么玩,pass

# 解决
接着往下查看 发现有个回答

> I believe it happens when the actual request is not sent. Usually happens when you are loading a cached resource.

回答内容是说请求没有被发送,因为是载入缓存资源.  
一想很对啊,音乐资源默认是缓存的,但是设置不缓存会让音乐加载速度太慢;继续往下查看

> Another possible scenario I've seen - the exact same request is being sent again just after few milliseconds (most likely due to a bug in the client side).
In that case you'll also see that the status of the first request is "canceled" and that the latency is only several milliseconds.

大概是说 完全相同的请求间隔数毫秒(太短),导致加载失败,查看了chrome控制台发现
```plain
http://ngmusic.coding.io/null
http://ngmusic.coding.io/serverget?url=http%3A%2F%2Ffile.qianqian.com.....
都有 Provisional headers are shown
```
![error](/img/chrome/3.png)
![error](/img/chrome/4.png)

猜想是因为 `http://...../null` 加载失败 导致 `http://..../serverget?url=http%3A%2F%2Ffile.qianqian.com.....`的缓存请求也失败(阻塞)

故将上面 `null` 加载去掉
```js
// _audio.src = null;
// _audio.load();
```
经过测试,发现的确从缓存中获取了~~~
![error](/img/chrome/2.png)

# 结论
`Provisional headers are shown`   
出现在 载入缓存资源,请求没有被发送, 而如果上一个资源加载失败,可能导致从缓存加载的资源失败,
即缓存资源请求之前的请求不能失败,不然就有可能出现问题

至此,终于搞定了这个渣问题!!!!!!!!!!!!!!!!!!!!!!



## 参考文档

- [http://stackoverflow.com/questions/21177387/caution-provisional-headers-are-shown-in-chrome-debugger](http://stackoverflow.com/questions/21177387/caution-provisional-headers-are-shown-in-chrome-debugger)
- [https://code.google.com/p/chromium/issues/detail?id=327581](https://code.google.com/p/chromium/issues/detail?id=327581)
- [http://stackoverflow.com/questions/21177387/caution-provisional-headers-are-shown-in-chrome-debugger](http://stackoverflow.com/questions/21177387/caution-provisional-headers-are-shown-in-chrome-debugger)  
- [http://segmentfault.com/q/1010000000364871](http://segmentfault.com/q/1010000000364871)  



-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

