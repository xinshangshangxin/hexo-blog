---
title: JS设计模式笔记(适配器模式)
date: 2015-07-05 15:21:14
tags:
- js
- 设计模式


---

JS设计模式笔记(适配器模式)
<!-- more -->



# 适配器模式

**作用: 解决两个软件实体间的接口不兼容问题**

## 百度地图和谷歌地图渲染
```js
var googleMap = {
    show: function() {
        console.log('开始渲染谷歌地图');
    }
};
var baiduMap = {
    display: function() {
        console.log('开始渲染百度地图');
    }
};
var baiduMapAdapter = {
    show: function() {
        return baiduMap.display();

    }
};

var renderMap = function(map) {
    if (map.show instanceof Function) {
        map.show();
    }
};

renderMap(googleMap); // 开始渲染谷歌地图
renderMap(baiduMapAdapter); //开始渲染百度地图
```
## 地址坐标转换
```js
var guangdongCity = {
    shenzhen: 11,
    guangzhou: 12,
    zhuhai: 13
};

var getGuangdongCity = function() {
    var guangdongCity = [
        {
            name: 'shenzhen',
            id: 11
        }, {
            name: 'guangzhou',
            id: 12
        }

    ];
    return guangdongCity;
};
var render = function(fn) {
    console.log('开始渲染广东省地图');
    document.write(JSON.stringify(fn()));
};
var addressAdapter = function(oldAddressfn) {
    var address = {},
        oldAddress = oldAddressfn();
    for (var i = 0, c; c = oldAddress[i++];) {
        address[c.name] = c.id;
    }
    return function() {
        return address;
    }
};
render(addressAdapter(getGuangdongCity));
```

## 适配器模式,装饰者模式,代理模式和外观模式区别

- 适配器模式主要用来解决两个已有接口之间不匹配问题,它不考虑这些接口是怎么实现的,也不考虑它们将来可能会如何演化.适配器模式不需要改变已有的接口,就能使它们协同工作
- 装饰者模式的作用是为了给对象增加功能,不会改变已有的接口,通常包装一次
- 代理模式是为了控制对对象的防风,不会改变已有的接口,通常包装一次
- 外观模式定义了一个新的接口



# 参考文档
- *实体书:* `JavaScript设计模式与开发实践(曾探)`

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

