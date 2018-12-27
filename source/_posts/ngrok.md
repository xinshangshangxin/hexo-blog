---

layout: post
title: "[内网穿透] ubuntu上搭建ngrok 1.x"
date: 2018-06-15 16:12:12
tags:
    - ngrok
    - 内网穿透


---

ngrok的搭建和使用 包括客户端和服务器端
<!-- more -->



## 服务器端
### 下载安装
```js
sudo apt install ngrok-server
```
### 手动启动
```js
ngrokd -tlsKey="tlsKey" -tlsCrt="tlsCrt" -domain="ngrok.xinshangshangxin.com" -httpAddr=":8081"  -httpsAddr=""
```

### 后台启动
1. 将下面的内容保存为 `ngrokd`
2. `chmod +x ngrokd`
3. `ngrokd (start|stop|status)`

```bash
#!/bin/bash

# These setting need you to set.
TLSKEY="set your TLSKEY"
TLSCRT="set your TLSCRT"
DOMAIN="set you ngrok domain"
ADDR=8081
LOGFILE=/data/logs/ngrokd.log
PIDFILE=/var/run/ngrokd.pid
DESC=ngrokd

# you should use /lib/init.d/functions 
. /lib/lsb/init-functions


do_start()
{
    if [ -s $PIDFILE ]; then
        RETVAL=1
        echo "Already running!"
    else
        echo "Starting $DESC"
        touch ${LOGFILE}
        echo "ngrokd -tlsKey=$TLSKEY -tlsCrt=$TLSCRT -domain=$DOMAIN -httpAddr=:${ADDR-80} -httpsAddr=  -log=$LOGFILE"
        # you need to modify the command as you needing
        nohup ngrokd -tlsKey=$TLSKEY -tlsCrt=$TLSCRT -domain=$DOMAIN -httpAddr=:${ADDR-80} -httpsAddr=  -log=$LOGFILE >/dev/null 2>&1 &
        RETVAL=$?
        PID=$!
        [ $RETVAL -eq 0 ] && echo $PID > $PIDFILE
    fi

    return $RETVAL
}

do_stop()
{
    killproc -p $PIDFILE ngrokd
    RETVAL="$?"
    echo
    [ $RETVAL = 0 ] && rm -rf $PIDFILE
    return $RETVAL
}

case "$1" in
  start)
    do_start
    ;;

  stop)
    echo "Stopping $DESC"
    do_stop
    ;;

  logs)
    echo "tail -f log"
    tail -f ${LOGFILE}
    ;;

  status)
    if [ ! -s $PIDFILE ]; then
        echo "Not running"
    else
        PID=`cat $PIDFILE`
        if [[ -n $PID && -n "`ps -p $PID | grep $PID`" ]]; then
            echo "Running (${PID})"
        else
            echo "Not running, yet ${PIDFILE} exists (stop ngrokd will fix this)"
        fi
    fi
    ;;

  *)
    echo "Usage: ngrokd (start|stop|status)"
    exit 3
    ;;
esac

exit 0
```

### 域名指向
将 `ngrok.xinshangshangxin.com` 和 `*.ngrok.xinshangshangxin.com` 指向 装有 ngrok-server的机器

### 开放端口
需要开放端口 4443
如果需要`TCP` 链接, 还要开放 `TCP`端口, 端口自定义(比如`33333`)

### 访问时 去除端口访问 
```Nginx
server {
    server_name *.ngrok.xinshangshangxin.com;
    listen 80;

    location / {
        proxy_pass http://localhost:8081;
        # 最主要的一句话
        proxy_set_header Host $http_host;
    }
}
```

## 客户端
### 安装
```bash
# mac 
brew install ngrok-client
# ubuntu
apt install ngrok-client
```

### 配置
`vim ~/ngrok.cfg`

输入下面的内容
其中 `remote_port` 为固定远程连接
`proto` 为本机地址
`subdomain` 为二级域名前缀

```Ini
server_addr: ngrok.xinshangshangxin.com:4443
trust_host_root_certs: true

tunnels:
    ssh:
        remote_port: 33333
        proto:
            tcp: 0.0.0.0:22

    server:
        remote_port: 8081
        subdomain: test
        proto:
            http: 0.0.0.0:4000
```

### 启动
```bash
ngrok -config=ngrok.cfg start ssh
# or
ngrok -config=ngrok.cfg start server
```

## 注意事项
**`ngrok 2.x` 源码未公开** 
```plain
ngrok 2.x is the successor to 1.x and the focus of all current development effort. Its source code is not available.
```
所以网上有些 客户端配置是针对2.x版本的, 并不适用!!


# 参考文档
[VPS自搭建Ngrok内网穿透服务](https://www.jianshu.com/p/d35962b0dba4)  
<br>

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

