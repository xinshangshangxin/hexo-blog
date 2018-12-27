---
title: "AngularJS $http踩坑(1)"
date: 2015-06-16 15:57:16
tags:
- AngularJS


---

AngularJS使用$http.post之后后台无法收到数据
<!-- more -->



**AngularJS中的post与jQuery中post的区别**

# 对比:
> AngularJS：

```js
$http.post('/myserver', {username: 'shang'})
.success(function(){
    // some code
});
```

> jQuery

```js
$.post('/myserver', {username: 'shang'}, function() {
    // some code
});
```

> 后台Express接受

```js
req.body.username // jq: 'shang'; ng: undefined
```

**jq会把作为JSON对象的序列化, 而Angular不会**

# 解决办法:
- 引入jquery (不推荐)
- 指定header
```js
var myobject = {username: 'shang'};

function ObjecttoParams(obj) {
    var p = [];
    for (var key in obj) {
        p.push(key + '=' + encodeURIComponent(obj[key]));
    }
    return p.join('&');
}

$http({
    method: 'POST',
    url: url,
    data: ObjecttoParams(myobject),
    headers: {'Content-Type':'application/x-www-form-urlencoded'}
});
```
- 使用 `angular-post-fix`

> https://gist.github.com/JensRantil/5713606

```js
// Modifies $httpProvider for correct server communication (POST variable format)
angular.module('http-post-fix', [], function($httpProvider) {
  // This code is taken from http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
  
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */ 
    var param = function(obj) {
      var query = '';
      var name, value, fullSubName, subValue, innerObj, i;
      
      for(name in obj) {
        value = obj[name];
        
        if(value instanceof Array) {
          for(i=0; i<value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if(value instanceof Object) {
          for(subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if(value !== undefined && value !== null) {
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
      }
      
      return query.length ? query.substr(0, query.length - 1) : query;
    };
    
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
});
```

# 参考文档
- [http://stackoverflow.com/questions/19254029/angularjs-http-post-does-not-send-data](http://stackoverflow.com/questions/19254029/angularjs-http-post-does-not-send-data)
- [http://my.oschina.net/tommyfok/blog/287748](http://my.oschina.net/tommyfok/blog/287748)

-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

