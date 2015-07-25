title: 判断AngularJS渲染页面完成
date: 2015-03-27 16:18:28
tags:
- AngularJS
---


写demo的时候需要调整页面高度,之前用jquery的时候一直是 `$(document).ready()` 来判断页面渲染完成
但是到了angularjs之后,不起作用............
<!-- more-->

> 使用$viewContentLoaded事件

- [完整Demo](http://plnkr.co/edit/isbTireh3w9OomDOvx87?p=preview)

```js
<div ng-controller="MainCtrl">
  <div ng-view></div>
</div>
```
```js
$scope.$on('$viewContentLoaded', function(){
    
});

// 或者
$scope.$watch('$viewContentLoaded', function() {  
  
});  
```

> 利用data-ng-init
```js
<div ng-controller="test">  
     <div data-ng-init="load()" ></div>  
</div>  
```
```js
bookControllers.controller('testInit', ['$scope', '$routeParams',  function($scope, $routeParams) {  
    $scope.load = function() {  
         alert('code here');  
    }  
}]);  
```


# 参考资料:

- [http://stackoverflow.com/questions/21715256/angularjs-event-to-call-after-content-is-loaded](http://stackoverflow.com/questions/21715256/angularjs-event-to-call-after-content-is-loaded)
- [http://blog.51yip.com/jsjquery/1599.html](http://blog.51yip.com/jsjquery/1599.html)


-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
