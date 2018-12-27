---
title: "DaoCloud体验－使用node构建应用程序"
date: 2015-06-11 12:49:10
tags:
- docker
- node


---

DaoCloud体验－使用node构建应用程序
<!-- more -->



> 首发于[http://open.daocloud.io/using-node-to-build-applications/](http://open.daocloud.io/using-node-to-build-applications/)

# DaoCloud体验－使用node构建应用程序

## node应用程序demo   

- 首先 选择一个平台 `clone` 代码到你的git平台上 [coding](https://coding.net/u/xinshangshangxin/p/DaoCloudNodeDemo/git) / [github](https://github.com/xinshangshangxin/DaoCloudNodeDemo) / [gitcafe](https://gitcafe.com/xinshangshangxin/DaoCloudNodeDemo) 
- 在控制台点击 `服务集成`
![](https://gitcafe.com/xinshangshangxin/hexo-blog/raw/gitcafe-pages/img/daocloud/demo4.png);
- 创建 `mysql服务`和 `mongodb服务`, 名字可以随意
- 回到控制台,点击 `代码构建`, `创建新项目`, 代码源选择你刚才 clone 的
![](https://gitcafe.com/xinshangshangxin/hexo-blog/raw/gitcafe-pages/img/daocloud/demo1.png);
- 勾选 `持续集成` 后点击 `开始创建`
- 当镜像构建完成后, 点击 `部署最新版本`, 接着点击 `基础设置`, 绑定 mysql 和 mongodb
![](https://gitcafe.com/xinshangshangxin/hexo-blog/raw/gitcafe-pages/img/daocloud/demo2.png);
![](https://gitcafe.com/xinshangshangxin/hexo-blog/raw/gitcafe-pages/img/daocloud/demo3.png);
- 容器启动后,访问下URL看看,是不是输出了`mysql链接成功~~~    并从mongodb中取出了 xinshangshangxin`
- 持续集成 需要 `push` 一次代码到你的git,然后回到`代码构建`, 选择`daocloud_node_demo`, 查看如图所示
![](https://gitcafe.com/xinshangshangxin/hexo-blog/raw/gitcafe-pages/img/daocloud/demo5.png);

### 注意事项:
> 构建镜像必须提供Dockerfile  
> 持续集成必须提供daocloud.yml  
> 构建镜像和持续集成这两项服务完全是独立的, 两者之间没有任何依赖
>  `push` 一次代码到你的git才会触发持续集成


## 如何在app代码中连接mysql/mongodb实例
###  容器启动时能访问mysql/mongodb的注意事项
- 容器**启动之前**需要先绑定 `mysql服务`和 `mongodb服务`
> 在控制台点击 `服务集成`; 接着创建 `mysql服务`和 `mongodb服务`, 名字可以随意
![](https://gitcafe.com/xinshangshangxin/hexo-blog/raw/gitcafe-pages/img/daocloud/demo4.png);

- mongodb使用的是mongoose连接,格式为:  
`mongodb://user:password@addr:port/database`
在node中,环境变量存储在 `process.env`中,所以:
`user` => `process.env.MONGODB_USERNAME`
`password` => `process.env.MONGODB_PASSWORD`
`addr` => `process.env.MONGODB_PORT_27017_TCP_ADDR`
`port` => `process.env.MONGODB_PORT_27017_TCP_PORT`
`database` => `process.env.MONGODB_INSTANCE_NAME`

- mysql使用的是`node-mysql`,所以和上面相似
`user` => `process.env.MYSQL_USERNAME`
`password` => `process.env.MYSQL_PASSWORD`
`database` => `process.env.MYSQL_INSTANCE_NAME`
`host` => `process.env.MYSQL_PORT_3306_TCP_ADDR`
`port` => `process.env.MYSQL_PORT_3306_TCP_PORT`

### 持续集成中使用mysql，mongodb服务注意事项
- 持续集成**不需要**绑定任何服务;**daocloud ci在运行测试的时候会自动创建**, 其使用的服务来自`daocloud.yml`
```js
services:
  - mysql
  - mongodb
```
- 在持续集成中 `MONGODB_USERNAME` `MONGODB_PASSWORD`  `MYSQL_USERNAME` `MYSQL_PASSWORD` `MYSQL_INSTANCE_NAME` 以及`MONGODB_INSTANCE_NAME`是不存在的, 所以为了兼容 容器和持续集成,代码中的连接需要进行判断,修改如下:

> Mongodb

```js
var mongoose = require('mongoose');

// 链接格式:    mongodb://user:pass@localhost:port/database
var mongodbUri = 'mongodb://';

// 持续集成时, MONGODB_USERNAME 和 MONGODB_PASSWORD 不存在
// 需要进行判断
if (process.env.MONGODB_USERNAME) {
    // 在容器中则存在,在持续集成中则不存在
    mongodbUri += process.env.MONGODB_USERNAME;

    if (process.env.MONGODB_PASSWORD) {
        mongodbUri += ":" + process.env.MONGODB_PASSWORD
    }
    mongodbUri += "@";
}


mongodbUri += (process.env.MONGODB_PORT_27017_TCP_ADDR || 'localhost')
    + ":" + (process.env.MONGODB_PORT_27017_TCP_PORT || 27017)
    + '/' + (process.env.MONGODB_INSTANCE_NAME || 'test');// 持续集成中MONGODB_INSTANCE_NAME 也不存在, 使用 test 代替
```

> Mysql

```js
// node_modules
var mysql = require('mysql');

// 持续集成中MYSQL_USERNAME默认为root,并且没有MYSQL_PASSWORD
// MYSQL_INSTANCE_NAME默认为test
var connection = mysql.createConnection({
    user:  process.env.MYSQL_USERNAME || 'root',
    password:  process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_INSTANCE_NAME || 'test',
    host: process.env.MYSQL_PORT_3306_TCP_ADDR || 'localhost',
    port: process.env.MYSQL_PORT_3306_TCP_PORT || '3306'
});


// 创建连接
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});
```

## 总结
- 容器运行时需要绑定mysql，mongodb服务
- 持续集成不需要绑定,由 `daocloud.yml`指定, daocloud ci在运行测试的时候会自动创建一个mysql实例
- 持续集成中的mysql，mongodb服务和用户申请的mysql，mongodb实例**没有任何关系**


# 参考文档
- [https://github.com/DaoCloud/python-mysql-sample](https://github.com/DaoCloud/python-mysql-sample)
- [https://github.com/DaoCloud/golang-mongo-sample](https://github.com/DaoCloud/golang-mongo-sample)

-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

