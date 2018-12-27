---
title: "在docker中使用pm2或forever"
date: 2015-06-13 13:59:04
tags:
- docker
- node


---

平常使用pm2没有问题,但是在docker中需要参数--no-daemon
<!-- more -->



> 使用命令 `pm2 start app.js ` 之后, `pm2` 默认在后台运行,
> 如果使用了docker后,容器运行并立即退出,需要手动指定参数`--no-daemon `

```js
--no-daemon                          
// run pm2 daemon in the foreground if it doesn't exist already
```

```js
pm2 start app.js --no-daemon // 设置启动方式
```


> 同理forever也是
> Forever start script.js runs in the background. To run forever in the foreground, try forever script.js.

```js
forever -c 'node --harmony' app.js // 设置启动方式
```


# 参考文档
- [https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md](https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md)
- [http://stackoverflow.com/questions/26237044/error-starting-node-with-forever-in-docker-container](http://stackoverflow.com/questions/26237044/error-starting-node-with-forever-in-docker-container)

-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

