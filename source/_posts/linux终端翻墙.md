title: "linux终端翻墙"
date: 2015-06-21 22:23:58
description: linux终端翻墙
tags:
- shadowsocks
---


## shadowsocks本地版
[http://dl.chenyufei.info/shadowsocks/latest/](http://dl.chenyufei.info/shadowsocks/latest/)
下载你服务器对应的版本`shadowsocks-local-linux64-1.1.4.gz`
**解压**
> `gunzip shadowsocks-local-linux64-1.1.4.gz`

**添加权限**
> `chmod a+x shadowsocks-local-linux64-1.1.4`

**运行**
> `./shadowsocks-local-linux64-1.1.4 -d=true -k="服务器的密码" -m="aes-256-cfb" -l=1080 -p=服务器的端口 -s="服务器的ip"`

## 安装tsocks
> `apt-get install tsocks`
> `vi /etc/tsocks.conf`

```js
local = 192.168.1.0/255.255.255.0  #local表示本地的网络，也就是不使用socks代理的网络
local = 127.0.0.0/255.0.0.0
server = 127.0.0.1   #socks服务器的IP
server_type = 5  #socks服务版本
server_port = 1080  ＃socks服务使用的端口
```

> 在要使用的命令前加上 `tsocks` 即可 
> 例如: `tsocks apt-get update`

# 参考文档

- [配置apt-get使用socks代理](http://www.joecen.com/2008/02/17/config-apt-get-use-socks-proxy/)
- [Linux下配置ShadowSocks(Server&Client)](http://www.ahlinux.com/start/base/21679.html)
- [tsocks简介、安装、配置及遇到的问题](http://www.51testing.com/html/38/225738-246084.html)


-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
