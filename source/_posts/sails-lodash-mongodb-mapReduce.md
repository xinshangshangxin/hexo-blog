layout: post
title: "sails中使用mongodb的mapReduce出现lodash中定义的root"
date: 2017-01-13 15:12:12
description: "在sails中使用mongodb的mapReduce, 出现错误 ReferenceError: root is not defined"
tags:
- sails
- lodash
---


## 起因

在 `sails` 中的 `collection.mapReduce`, `scope`定义为  

```js
scope = {
  '其它方法': '其它方法',
  getZeroDay: UtilitiesService.getZeroDay,
};
```

其中调用了 `service` 中定义的方法 `getZeroDay`
在 sails0.10 中使用没有问题, 但是更新到sails0.12后出现了 `ReferenceError: root is not defined`

![](/img/sails-lodash-mongodb-mapReduce/1.png)

## 探索

在 UtilitiesService 定义了 
```js
function getZeroDay() {
  
}

global.getZeroDay = getZeroDay;
module.exports = {
  getZeroDay: getZeroDay,
};
```

在其它地方调用如下内容
```js
console.log(global.getZeroDay === UtilitiesService.getZeroDay); 
console.log(UtilitiesService.getZeroDay.toString());
```

结果却是 `UtilitiesService.getZeroDay` 被转换了
![](/img/sails-lodash-mongodb-mapReduce/2.png)


从sails的源码中得知, sails0.12版本对 `loadService` 多出了 `bindToSails`, 而 `bindToSails` 调用了 `_.bindAll`, 最后输出了如上图所示的内容
![ sails0.10](/img/sails-lodash-mongodb-mapReduce/3.png)

![ sails0.12](/img/sails-lodash-mongodb-mapReduce/4.png)

## 解决方案

`collection.mapReduce` 的 `scope` 不要从 `service` 中获取

<br>

----------


> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇