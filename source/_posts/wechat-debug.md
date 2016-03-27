title: "微信调试方法"
date: 2016-01-10 17:16:45
description: "搜索总结的微信调试方法"
tags: 
- wechat
----------


## 微信官方提供了 `微信web开发者工具` 本文章仅作备份
[ `微信web开发者工具地址`](http://mp.weixin.qq.com/wiki/10/e5f772f4521da17fa0d7304f68b97d7e.html); 

## 无服务器

----------


### js-sdk代码调试

#### 前提条件:

> 1. 微信端的 `接口配置信息` 必须已经验证通过(不管是怎么通过的) 
2. 手机必须处于和pc相同的局域网下
3. pc上有代理软件 (mac下有`charles`, windows下有 `fildder`)
4. 有nginx或者类似工具


#### 使用方法:
> 1.修改 `/etc/hosts`(或者使用 `Gas Mask` 软件来设置), 添加 
```js
127.0.0.1    和JS接口安全域名相符的调试页面网址
```

> 2.使用nginx 或者其他工具, 将 `调试页面网址` 转发到你正在开发的本机代码

```plain
# 此处为 nginx 设置
# mac 下启动nginx 需要 `sudo`
server {
    listen 80;
    server_name ionicdemo.xinshangshangxin.com; # 修改成你配置的调试网址
    location / {
      root /path/my/code;  # 修改为你的代码路径
      try_files $uri $uri/ /index.html =404;
      # index index.html index.htm;
      error_page 404 /error.html;
    }
}
```

> 3.打开 `charles`, 开启 `mac OS X Proxy`
![开启 mac OS X Proxy](/img/wechat/01.png)
> 4.点击 `Proxy Settings`, 查看/设置端口 
![](/img/wechat/02.png)

> 5.打开手机无线网络, 高级设置, 打开`手动HTTP代理`,
代理服务器主机名为局域网ip, 端口为上图设置的端口
 ![](/img/wechat/03.png)

> 6.手机端访问 你要调试的页面, 默认转发到你的pc端了~

> 借助某人的图来 说明下原理
![](/img/wechat/04.png)

----------


### 服务器端代码调试
> 使用[微信官方插件](http://blog.qqbrowser.cc/), 具体操作方法请看官方文档[http://blog.qqbrowser.cc/tag/docs/](http://blog.qqbrowser.cc/tag/docs/)

*上面jssdk调试也可以使用此方法*

----------

----------


## 拥有自己的服务器和自己的域名

### 暴力的方法
>  代码全部上传到服务器上开启调试

### 快速修改代码的方法
> 把服务器上的请求直接 proxy 到本地


1.服务器上 `Nginx` 把 `wechat.xinshangshangxin.com` 的请求转发到某个端口(如 10000)

```js
server {
    listen 80;
    server_name wechat.xinshangshangxin.com;

    location / {
        proxy_pass http://127.0.0.1:10000;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

2.在本地开一个到服务器的转发通道（要求服务器开启 sshd 服务）

```js
# 1000 为服务器端口;  8000 为本机端口
ssh yourname@yourip -R 10000:127.0.0.1:8000
```

3.让本地开发环境监听 8000 端口; 这样就可以直接在本地边开发边测试了，当然别忘了根据微信的规则配置 OAuth2.0网页授权 等参数


## 参考文档

- [https://www.zhihu.com/question/25456655](https://www.zhihu.com/question/25456655)

- [http://blog.lazybee.me/wechat-development/](http://blog.lazybee.me/wechat-development/)
-----------------------

-----------------------


> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇





