---
title: "AngularJS $http踩坑(2)"
date: 2015-06-17 14:24:02
tags:
- AngularJS


---

AngularJS使用$http出现options请求
<!-- more -->



# AngularJS中的$http自定义headers之后的配置
## 客户端需要设置 `withCredentials`
```js
$http({
    url: SERVERURL + '/',
    method: 'GET',
    // 此处是自定义的头
    headers: {
        'x-access-token': localStorage.getItem('token')
    },
    // 需要设置 withCredentials: true
    withCredentials: true
    })
```

## 服务器配置(express为例)
```js
router
    // angular为首先发送用OPTIONS方法(做是的是预检查，从服务器确认是否可以继续)
    .options('/', function(req, res) {
           // 设置 Credentials 为允许
            res.setHeader('Access-Control-Allow-Credentials', true);
            // 设置 Methods
            res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
            // 添加允许的请求头类型!!
            res.setHeader("Access-Control-Allow-Headers", 'x-access-token, Content-Type'); 
            res.send(200);
        })
        // 使下面的get请求可以返回(配置和上面一样)
    .use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        res.setHeader("Access-Control-Allow-Headers", 'x-access-token'); 
        next();
    })
    // 真正的请求  
    .get('/', function(req, res) {
        // doSomething
    });
```

![options请求](/img/angularjs/http1.png)
![get请求](/img/angularjs/http2.png)


# 跨域配置
## 客户端不变
## 服务器端

```js
.options('/', function(req, res) {
        // 添加  Access-Control-Allow-Origin, 其它不变
        // 注意这里不能使用 *
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        res.setHeader("Access-Control-Allow-Headers", 'x-access-token, Content-Type'); 
        res.send(200);
    })
    .use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        res.setHeader("Access-Control-Allow-Headers", 'x-access-token');
        next();
   })
   .get('/', function(req, res) {
        // doSomething
    });
```
**请求的时候不能使用localhost,请上传服务器在尝试跨域**

# 参考文档
- [http://camnpr.com/server/2007.html](http://camnpr.com/server/2007.html)
- [http://blog.csdn.net/ligang2585116/article/details/44806853](http://blog.csdn.net/ligang2585116/article/details/44806853)

-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

