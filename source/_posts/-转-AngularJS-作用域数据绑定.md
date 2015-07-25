title: "[转]AngularJS 作用域数据绑定"
date: 2015-03-22 13:35:24
tags:
- AngularJS
---

在imooc上看[angularjs指令4](http://www.imooc.com/video/3085),搜索了转载下
<!-- more -->

1. 基于字符串的绑定：使用@操作符，双引号内的内容当做字符串进行绑定。
2. 基于变量的绑定：使用=操作符，绑定的内容是个变量,双向数据绑定
3. 基于方法的绑定：使用&操作符，绑定的内容是个方法。


1. **@**
![@](/img/angularjs/@.png)

2. **=**
![=](/img/angularjs/=.png)

3. **&**
![&](/img/angularjs/&.png)


> 上图代码: 

```js
<!doctype html>
<html ng-app="myApp">
    <head>
         <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
         <script src="http://apps.bdimg.com/libs/angular.js/1.2.16/angular.min.js"></script>
    </head>
    <body>

        <div ng-controller="myAppCtrl">
            <xingoo say="test string"></xingoo>
            <xingoo say="{{str2}}"></xingoo>
            <xingoo say="test()"></xingoo>
        </div>

        <script type="text/javascript">
            var myAppModule = angular.module("myApp",[]);

            myAppModule.controller("myAppCtrl",['$scope',function($scope){
                $scope.str1 = "hello";
                $scope.str2 = "world";
                $scope.str3 = "angular";
            }]);

            myAppModule.directive("xingoo",function(){
                return {
                    restrict:'AE',
                    scope:{
                        say:'@'
                    },
                    template:"<div>{{say}}</div><br>",
                    repalce:true
                }
            })
        </script>
    </body>
</html>
```
```js
<!doctype html>
<html ng-app="myApp">
    <head>
         <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
         <script src="http://apps.bdimg.com/libs/angular.js/1.2.16/angular.min.js"></script>
    </head>
    <body>

        <div ng-controller="myAppCtrl">
            ctrl:<input type="text" ng-model="testname"><br>
            directive:<xingoo name="testname"></xingoo>
        </div>

        <script type="text/javascript">
            var myAppModule = angular.module("myApp",[]);

            myAppModule.controller("myAppCtrl",['$scope',function($scope){
                $scope.testname="my name is xingoo";
            }]);

            myAppModule.directive("xingoo",function(){
                return {
                    restrict:'AE',
                    scope:{
                        name:'='
                    },
                    template:'<input type="text" ng-model="name">',
                    repalce:true
                }
            })
        </script>
    </body>
</html>
```
```js
<!doctype html>
<html ng-app="myApp">
    <head>
         <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
         <script src="http://apps.bdimg.com/libs/angular.js/1.2.16/angular.min.js"></script>
    </head>
    <body>

        <div ng-controller="myAppCtrl">
            <xingoo say="sayHello(name)"></xingoo>
            <xingoo say="sayNo(name)"></xingoo>
            <xingoo say="sayYes(name)"></xingoo>
        </div>

        <script type="text/javascript">
            var myAppModule = angular.module("myApp",[]);

            myAppModule.controller("myAppCtrl",['$scope',function($scope){
                $scope.sayHello = function(name){
                    console.log("hello !"+ name);
                };
                $scope.sayNo = function(name){
                    console.log("no !"+ name);
                };
                $scope.sayYes = function(name){
                    console.log("yes !"+ name);
                };
            }]);

            myAppModule.directive("xingoo",function(){
                return {
                    restrict:'AE',
                    scope:{
                        say:'&'
                    },
                    template:'<input type="text" ng-model="username"/><br>'+
                        '<button ng-click="say({name:username})">click</button><br>',
                    repalce:true
                }
            })
        </script>
    </body>
</html>
```

# 参考资料:
- [http://www.cnblogs.com/xing901022/p/4291521.html](http://www.cnblogs.com/xing901022/p/4291521.html)

-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
