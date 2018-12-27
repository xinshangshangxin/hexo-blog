---
title: js关闭浏览器事件
date: 2015-03-10 21:52:04
tags:
- js


---

js关闭浏览器事件注意点!
<!-- more -->



# js关闭浏览器事件

```js
window.onbeforeunload = function (e) {
  e = e || window.event;

  // 兼容IE8和Firefox 4之前的版本
  if (e) {
    e.returnValue = '关闭提示';
  }

  // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
  return '关闭提示';
};
```

## 自定义的关闭提示无法完成!

> 从2011年5月25日起,  HTML5 规范 声明:在该事件的处理函数中调用下列弹窗相关的方法时,可以忽略不执行,window.showModalDialog(), window.alert(), window.confirm() window.prompt().


## 参考资料: 
- [https://developer.mozilla.org/zh-CN/docs/Web/API/Window/onbeforeunload](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/onbeforeunload)

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

