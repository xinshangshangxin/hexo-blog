---
title: '[转]AngularJS中的Provider们：Service和Factory等的区别'
date: 2015-08-30 00:02:41
tags:
- AngularJS


---

AngularJS中的Provider们：Service和Factory等的区别
<!-- more -->



## 引言

看了很多文章可能还是不太说得出`AngularJS`中的几个创建供应商(`provider`)的方法(`factory(),service(),provider()`)到底有啥区别，啥时候该用啥，之前一直傻傻分不清楚，现在来总结一下。  


下文中泛指统一用中文，英文即为特指$provide方法中对应方法创建出的东东

```plain
供应商==>泛指provider
服务==>泛指service

provider==>provider()方法创建的东东
service==>service()方法创建的东东
```

## 先说说供应商（`$provide`）

`$provide`服务负责告诉Angular如何创造一个新的可注入的东西：即服务。服务会被叫做供应商的东西来定义，你可以使用`$provide`来创建一个供应商。你需要使用`$provide`中的`provider()`方法来定义一个供应商，同时你也可以通过要求$provide被注入到一个应用的config函数中来获得`$provide`服务。

上面的描述是官方wiki的翻译版，如果有些绕的话，看下这张图：
![](/img/provider/provider1.png)

- `$provide`是一个服务，在`Auto`模块中
- 这个服务下面有好多方法，是用来定义供应商
- 而供应商是用来提供服务的，被注入来注入去的东西就是供应商们提供的服务了

下面是一个例子：

```js
myMod.config(function($provide) {
  $provide.provider('greeting', function() {
    this.$get = function() {
      return function(name) {
        alert("Hello, " + name);
      };
    };
  });
});
```

这个例子可以说是最终形态，先大概看下

## 定义供应商的方法们

`AngularJS`用`$provide`去定义一个供应商,这个`$provide`有5个用来创建供应商的方法：

- constant
- value
- service
- factory
- provider
- decorator 我没有说我也是，我只是路过o(╯□╰)o

### Constant
定义常量用的，这货定义的值当然就不能被改变，它可以被注入到任何地方，但是不能被装饰器(`decorator`)装饰

```js
var app = angular.module('app', []);
 
app.config(function ($provide) {
  $provide.constant('movieTitle', 'The Matrix');
});
 
app.controller('ctrl', function (movieTitle) {
  expect(movieTitle).toEqual('The Matrix');
});
```

语法糖：

```js
app.constant('movieTitle', 'The Matrix');
```

### Value

这货可以是`string,number`甚至`function`,它和`constant`的不同之处在于  
它可以被修改，不能被注入到`config`中，但是它可以被`decorator`装饰

```js
var app = angular.module('app', []);
 
app.config(function ($provide) {
  $provide.value('movieTitle', 'The Matrix')
});
 
app.controller('ctrl', function (movieTitle) {
  expect(movieTitle).toEqual('The Matrix');
})
```

语法糖：

```js
app.value('movieTitle', 'The Matrix');
```

### Service

它是一个可注入的构造器，在`AngularJS`中它是单例的，用它在`Controller`中通信或者共享数据都很合适

```js
var app = angular.module('app' ,[]);
 
app.config(function ($provide) {
  $provide.service('movie', function () {
    this.title = 'The Matrix';
  });
});
 
app.controller('ctrl', function (movie) {
  expect(movie.title).toEqual('The Matrix');
});
```

语法糖：

```js
app.service('movie', function () {
  this.title = 'The Matrix';
});
```

在service里面可以不用返回东西，因为AngularJS会调用new关键字来创建对象。但是返回一个自定义对象好像也不会出错。

### Factory

它是一个可注入的`function`，它和`service`的区别就是：`factory `是普通`function `，而`service `是一个构造器(`constructor `)，这样`Angular `在调用`service `时会用`new `关键字，而调用`factory `时只是调用普通的`function`，所以`factory`可以返回任何东西，而`service`可以不返回(可查阅new关键字的作用)

```js
var app = angular.module('app', []);
 
app.config(function ($provide) {
  $provide.factory('movie', function () {
    return {
      title: 'The Matrix';
    }
  });
});
 
app.controller('ctrl', function (movie) {
  expect(movie.title).toEqual('The Matrix');
});
```

语法糖：

```js
app.factory('movie', function () {
  return {
    title: 'The Matrix';
  }
});
```

`factory`可以返回任何东西，它实际上是一个只有`$get`方法的`provider`

### Provider

`provider`是他们的老大，上面的几乎(除了`constant`)都是`provider`的封装，`provider`必须有一个`$get`方法，当然也可以说`provider`是一个可配置的`factory`

```js
var app = angular.module('app', []);
 
app.provider('movie', function () {
  var version;
  return {
    setVersion: function (value) {
      version = value;
    },
    $get: function () {
      return {
          title: 'The Matrix' + ' ' + version
      }
    }
  }
});
 
app.config(function (movieProvider) {
  movieProvider.setVersion('Reloaded');
});
 
app.controller('ctrl', function (movie) {
  expect(movie.title).toEqual('The Matrix Reloaded');
});
```

注意这里`confi`g方法注入的是`movieProvider`，上面定义了一个供应商叫`movie`，但是注入到`config`中不能直接写`movie`，因为前文讲了注入的那个东西就是服务，是供应商提供出来的，而`config`中又只能注入供应商（两个例外是`$provide`和`$injector`），所以用驼峰命名法写成`movieProvider`，`Angular`就会帮你注入它的供应商。（更详细可参考文末官方wiki翻译版中的配置`provider`）

### Decorator

这个比较特殊，它不是`provider`,它是用来装饰其他`provider`的，而前面也说过，他不能装饰`Constant`，因为实际上`Constant`不是通过`provider()`方法创建的。

```js
var app = angular.module('app', []);
 
app.value('movieTitle', 'The Matrix');
 
app.config(function ($provide) {
  $provide.decorator('movieTitle', function ($delegate) {
    return $delegate + ' - starring Keanu Reeves';
  });
});
 
app.controller('myController', function (movieTitle) {
  expect(movieTitle).toEqual('The Matrix - starring Keanu Reeves');
});
```

## 总结


- 所有的供应商都只被实例化一次，也就说他们都是单例的
- 除了constant，所有的供应商都可以被装饰器(decorator)装饰
- value就是一个简单的可注入的值
- service是一个可注入的构造器
- factory是一个可注入的方法
- decorator可以修改或封装其他的供应商，当然除了constant
- provider是一个可配置的factory


最后来看一张对比图：

![](/img/provider/provider2.png)



# 参考文档

- [(转载自)http://segmentfault.com/a/1190000003096933](http://segmentfault.com/a/1190000003096933)
- [Differences Between Providers in AngularJS](http://blog.xebia.com/2013/09/01/differences-between-providers-in-angularjs/)
- [官方wiki：Understanding Dependency Injection](https://github.com/angular/angular.js/wiki/Understanding-Dependency-Injection)
- [官方wiki翻译版：理解依赖注入](http://www.html-js.com/article/1980)
- [AngularJS中的Provider](http://my.oschina.net/tommyfok/blog/299231)
- [伤不起的provider们](http://hellobug.github.io/blog/angularjs-providers/)



-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

