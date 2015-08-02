title: 7月angular使用笔记
date: 2015-08-02 17:44:14
description: 7月使用angular总结,包括一些库/规范/代码记录
tags:
- angular
---



# angular使用笔记


## 一些库的使用

```plain
angular.module('XXXXX', [
  'ngResource',			// restful请求的封装
  'ui.router',			// 基于状态导航
  'ui.bootstrap'			// bootstrap 的 angular版
  ])
```

## 一些规范

```plain

app    
├── components   // 写一些公共用的模板,方法
│    ├── entity
│    │	  └── entities-factory.js  // restful 请求目录
│    │
│    └──  notification		// 公用方法
│     	  ├── notification-drtv.js  (directive)
│     	  ├── notification.tpl.html
│     	  └── notification-service.js
│       
│
├── home					// 为每一个 state 都分割成一个文件夹
│	  ├── home.html
│	  ├── home-controller.js
│	  └── home-routers.js
│
│       
├──  news
│  	  ├── news-list.html
│ 	  ├── news-controller.js
│ 	  └── news-routers.js    
│
├── public    // 此处存放不需要权限验证的页面
│
└── member    // 此处存放所有需要权限验证的页面  
     
```

## 一些代码的记录


> `entities-factory.js` **存放所有的restful请求**

```js
angular.module('XXXX')
 .factory('newsEntity', function ($resource) {
    return $resource(
      'api/v1/news/:id',
      {id: '@id'},					// 组合url为  api/v1/news/123
      {update: {method: 'PUT'}}	// 增加 restful的update
    );
  })
  // ........

```

> news-routers.js **每个state都有一个自己的路由**

```js
angular.module('XXXXX')
  .config(function($stateProvider) {
    $stateProvider
      .state('home.news', {
        url: '/news',
        template: '<div ui-view></div>',    // template和abstract 联合使用,只是作为父状态存在
        abstract: true
      })
      .state('home.news.list', {
        url: '',
        controller: 'NewsListCtrl',		   // 直接在 routers中指定 controller, 无需再 html中指定
        templateUrl: 'app/news/news-list.html',
        resolve: {
          NewsList: function(newsEntity) {    // newsEntity定义在components的entity的entities-factory.js            return newsEntity.query().$promise;    // 返回数组数据的promise
          }
        }
      })
      .state('home..news.add', {
        url: '/add',
        controller: 'SingleNewsCtrl',
        templateUrl: 'app/news/news-add-edit.html',
        resolve: {
          News: function(newsEntity) {
            return new newsEntity();		          // 通过new一个对象来使用restful的$save
          }
        }
      })
      .state('home.news.edit', {
        url: '/edit/:id',					         // 此处的 /:id 是用于 ui.router 传递 id参数
        controller: 'SingleNewsCtrl',
        templateUrl: 'app/news/news-add-edit.html',
        resolve: {
          News: function(newsEntity, $stateParams) {
            console.log($stateParams.id);        // 此处得到 id
            return new newsEntity({id: $stateParams.id}).$get();  // 从服务器获取此id的数据
          }
        }
      });
  });
```

> notification **公用的方法**

```html
// notification.tpl.html
// 此处使用了 ui.bootstrap
<alert class="center-block col-sm-6" ng-repeat="notification in notifications" type="{{types[notification.type]}}" close="close($index)">{{notification.message}}</alert>
```


```js
// notification-service.js

angular.module('XXXXXXX')
  .service('notificationService', function ($timeout) {
    var notifications = [], svc = this;

    this.getNotifications = function () {
      return notifications;
    };

    this.removeNotification = function (notification) {
      notifications.splice(notifications.indexOf(notification), 1);
    };

    this.error = function (message) {
      var notification = { type: 'error', message: message };
      notifications.push(notification);
      $timeout(function () {
        svc.removeNotification(notification);
      }, 10000);
    };

    this.info = function (message) {
      var notification = { type: 'info', message: message };
      notifications.push(notification);
      $timeout(function () {
        svc.removeNotification(notification);
      }, 5000);
    };
  });
```

```js
// notification-drtv.js 

angular.module('XXXXX')
.directive('notificationBar', function() {
  return {
    restrict: 'EA',
    templateUrl: 'app/components/notification/notification-bar.tpl.html',
    controller: function ($scope, notificationService) {
      $scope.notifications = notificationService.getNotifications();
      $scope.types = {
        error: 'danger',
        warn: 'warning',
        info: 'info'
      };
      $scope.close = function (index) {
        $scope.notifications.splice(index, 1);
      };
    }
  };
});
```



# 参考
- CRM开发

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
