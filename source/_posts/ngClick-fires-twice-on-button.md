title: "angularjs ng-click 触发两次事件"
date: 2015-12-17 09:21:24
description:  angularjs ng-click 触发两次事件
tags:
- AngularJS

---


## 触发原因: 同时使用了 ionic 和 angular-material  

> Note: ng-click is broken on touch devices and Chrome emulation of such. Chrome desktop is unaffected. The Codepen above: works fine using 0.6.1 or 0.7.0 -- broken on 0.7.1.
I suspect it might be because of the hammer.js change on 0.7.1 - Ionic has a similar built-in version of hammer as well


## 解决方法:   

```js
app.config(function($mdGestureProvider ) {
  $mdGestureProvider.skipClickHijack();
});
```




# 参考文档:

- [https://github.com/driftyco/ionic/issues/1022](https://github.com/driftyco/ionic/issues/1022)
- [https://github.com/angular/material/issues/1406](https://github.com/angular/material/issues/1406)

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
