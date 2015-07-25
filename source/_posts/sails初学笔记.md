title: sails初学笔记
date: 2015-07-25 16:55:09
description: 初次sails使用的一些笔记
tags:
- sails
- node
---


## 全局下安装Sails
```js
sudo npm install sails -g
```

## 在空路径下,新建一个项目
```js
sails new newApp
```

## 运行
```js
 sails lift
```

# 项目架构
```plain
├── api    
│   ├── controllers  
│   │       控制层，该层是Http请求的入口
│   │       sails官方建议该层只处理请求的转发和页面的渲染,
│   │       具体的逻辑实现应该交给Service层.
│   │
│   ├── models
│   │     模型层
│   │
│   ├── policies
│   │     过滤层,该层在Controller层之前对Http请求做处理
│   │     在这一层中，可以定于一些规则来过滤Http请求,
│   │     比如身份认证什么的.
│   │
│   ├── responses
│   │
│   │     http响应的方法都放这里
│   │     例如服务器错误、请求错误、404错误等
│   │     定义在responses文件夹里面的方法，
│   │     都会赋值到controller层的req对象中
│   │
│   │
│   └── services
│        服务层,该层包含逻辑处理的方法
│        所有Service都可以全局性访问
│
├── views
│        视图层,存放视图模版文件的地方
│
├── assets
│       资源文件夹
│       在Sails启动的时候,
│       会启动某一个Grunt任务,
│       把assets文件夹里的内容或压缩或编译
│       或复制到根目录下的.tmp目录
│   
├── config 
│     │   配置文件夹
│     │   访问方法  sails.config.XXX
│     │ 
│     ├── adapters.js
│     │     本地数据库配置
│     │
│     ├── csrf.js
│     │       跨域加密
│     │
│     ├── session.js
│     │       session配置
│     │
│     ├──  routes.js
│     │     routes路由配置
│     │
│     ├── env  在实际开发中,常配置数据库等信息
|     │    │
│     |    └── development.js
|     │    │
│     |    └── production.js
│     │
│     └── cors.js
│          跨域配置
│    
├── tasks
│       Grunt的配置和任务注册
│    
├── node_modules
├── package.json
├── Gruntfile.js
├── README.md
└── app.js
```

同时创建model和对应的Controller的命令
```js
sails generate api API_NAME
```

Sails中的路由: `blueprint`

RESTful routes
-------
当路径诸如：/:modelIdentity 或者 /:modelIdentity/:id的时候，blueprint会根据HTTP的动作（GET、POST、DELETE、PUT等）来分配到相应的Controller下相应的Action来处理。例如一个POST请求/user会创建一个用户，一个DELETE请求/user/123会删除id为123的用户。

Shortcut routes
---------
生产环境下需要关闭

Action routes
------------
这种路由会自动的为Controller层的每一个Action创建一个路由，例如你的Controller层有一个FooController.js，里面有一个Actionbar，那么请求/foo/bar就会分配到barAction。

当然Sails也会提供自定义的路由，用户可以在config/routes.js和config/polices.js这两个配置文件中选择关闭或者打开blueprint提供的路由，和定义自己的路由。




# 参考文档

- [https://cnodejs.org/topic/553c7b4a1a6e36a27780ee65](https://cnodejs.org/topic/553c7b4a1a6e36a27780ee65)
- [https://cnodejs.org/topic/555c3c82e684c4c8088a0ca1](https://cnodejs.org/topic/555c3c82e684c4c8088a0ca1)

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
