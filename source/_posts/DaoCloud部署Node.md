---
title: "DaoCloud部署Node"
date: 2015-06-01 23:06:00
tags:
- docker
- node


---

官方为提供node的example, 把我踩的坑记录分享
<!-- more -->



> DaoCloud 有go和python 的 example;
> 却没有Node的example, 把我踩的坑记录分享

# 注册DaoCloud
注册地址: [https://account.daocloud.io/signup](https://account.daocloud.io/signup)

> 整个构建和部署所需要的资源，DaoCloud都免费提供，为所有的注册用户免费提供以下资源：
> 3个项目，同时可以在DaoCloud关联和构建您的3个软件项目
> 2个容器，每个容器内存上限是256M内存空间
> 2个服务，可从MongoDB、Redis、MySQL和InfluxDB中任意选择

# 部署Node 的 Dockerfile 详解
> 总的

```js
FROM node

# Build app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install --production

EXPOSE 1340

CMD [ "node","dist/server.js"]

```

`FROM node` 是指基于 [node最新版](https://registry.hub.docker.com/_/node) 镜像 

`RUN mkdir -p /usr/src/app` 中 `RUN` 是安装环境, 整句话是指创建了一个`app`文件夹供后续使用
`WORKDIR /usr/src/app`  中 `WORKDIR` 是切换目录, 整句话是指切换到 `/usr/src/app` 目录下
`COPY . /usr/src/app` 整句话是指将当前文件夹下文件复制到 `app`目录下

`RUN npm install --production` 执行 `npm install` 命令,安装node程序的依赖包

`EXPOSE 1340`  中 `EXPOSE` 是端口映射; 1340 是你的 node程序跑的端口

`CMD ["node","dist/server.js"]` 中 `CMD`是 `container`(容器)启动时执行的命令;也就是平常我们使用的 `node dist/server.js`

# 上传github和绑定github

- 在你原来node程序的基础上,添加修改上面的Dockfile; 上传至github;
*如果你没有现成的程序,可以直接 clone 我的项目 [ngMusic项目地址](https://github.com/xinshangshangxin/ngMusic.git)* 到你的github中

- 在DaoCloud中选择 *代码构建*
![dc](/img/daocloud/dc1.png)

- 接着点击 *创建新项目*
![dc](/img/daocloud/dc2.png)

- 接着 *输入项目名称* 和 同步代码源,选择你部署的项目, 最后点击 *开始创建*
 *此处我github已经绑定,所以使用 coding 做演示*
![dc](/img/daocloud/dc3.png)
*开始构建*
![dc](/img/daocloud/dc4.png)
*构建完成*
![dc](/img/daocloud/dc6.png)

- 点击 *查看镜像*, 接着在点击 *部署最新版本* 后开始部署


- 部署成功, 可以访问看看你的程序; 如果失败,回头看看那里出错了~~
![dc](/img/daocloud/dc5.png)


## 参考文档
- [https://github.com/DaoCloud/python-redis-sample/blob/master/application.py](https://github.com/DaoCloud/python-redis-sample/blob/master/application.py)
- [http://blog.csdn.net/wsscy2004/article/details/25878223](http://blog.csdn.net/wsscy2004/article/details/25878223)

-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

