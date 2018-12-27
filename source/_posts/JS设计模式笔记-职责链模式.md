---
title: "JS设计模式笔记(职责链模式)"
date: 2015-06-30 20:56:30
tags:
- js
- 设计模式


---

JS设计模式笔记(职责链模式)
<!-- more -->



# 职责链模式
**定义: 使多个对象都有机会处理请求,从而避免请求发送这和接受这之间的耦合关系,将这些对象练成一条链,并沿着这条链传递该请求,直到有一个对象处理它为止**


## 商品购买-职责链实例
```js
var order500 = function(orderType, pay, stock) {
    if(orderType === 1 && pay === true) {
        console.log('500定金预定,得到100优惠卷');
    }
    else {
        order200(orderType, pay, stock);
    }
};

var order200 = function(orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
        console.log('200 定金预定,得到50优惠卷');
    }
    else {
        orderNomal(orderType, pay, stock);
    }
};

var orderNomal = function(orderType, pay, stock) {
    if (stock > 0) {
        console.log('普通购买,无优惠卷');
    }
    else {
        console.log('库存不足');
    }
};

order500(1, false, 500); // 普通购买,无优惠卷
order500(3, false, 0);  // 库存不足
```

## 灵活可拆分的职责链节点
```js
var order500 = function(orderType, pay, stock) {
    if(orderType === 1 && pay === true) {
        console.log('500定金预定,得到100优惠卷');
    }
    else {
       return 'nextSuccessor';
    }
};

var order200 = function(orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
        console.log('200 定金预定,得到50优惠卷');
    }
    else {
        return 'nextSuccessor';
    }
};

var orderNomal = function(orderType, pay, stock) {
    if (stock > 0) {
        console.log('普通购买,无优惠卷');
    }
    else {
        console.log('库存不足');
    }
};


var Chain = function(fn) {
    this.fn = fn;
    this.successor = null;
};

Chain.prototype.setNextSuccessor = function(successor) {
    return this.successor = successor;
};

Chain.prototype.passRequest = function() {
    var ret = this.fn.apply(this, arguments);

    if (ret === 'nextSuccessor') {
        return this.successor && this.successor.passRequest.apply(this.successor, arguments);
    }

    return ret;
};

var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = new Chain(orderNomal);

chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);

chainOrder500.passRequest(3, true, 500); // 普通购买,无优惠卷
```

## 优缺点
**优点**
1. 解耦了请求发送者和N个接受者之间的复杂关系
2. 链中的节点对象可以灵活的拆分重组
3. 可以手动指定其实节点

**缺点**
- 避免过长的职责链带来的性能损耗


## 利用aop实现职责链
```js
var order500 = function(orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
        console.log('500定金预定,得到100优惠卷');
    }
    else {
        return 'nextSuccessor';
    }
};

var order200 = function(orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
        console.log('200 定金预定,得到50优惠卷');
    }
    else {
        return 'nextSuccessor';
    }
};

var orderNomal = function(orderType, pay, stock) {
    if (stock > 0) {
        console.log('普通购买,无优惠卷');
    }
    else {
        console.log('库存不足');
    }
};

Function.prototype.after = function(fn) {
    var _this = this;
    return function() {
        var ret = _this.apply(this, arguments);
        if (ret === 'nextSuccessor') {
            return fn.apply(this, arguments);
        }

        return ret;
    }
};

var order = order500.after(order200).after(orderNomal);

order(1, false, 500); // 普通购买,无优惠卷
```
**增加了函数的作用域,如果链条太长,会对性能有较大的影响**


## 获取文件上传对象-职责链实例
```js
Function.prototype.after = function(fn) {
    var _this = this;
    return function() {
        var ret = _this.apply(this, arguments);
        if (ret === 'nextSuccessor') {
            return fn.apply(this, arguments);
        }

        return ret;
    }
};

var getActiveUploadObj = function() {
    try {
        return new ActiveXObject('TXFTNActivex.FTMUpload');
    }
    catch (e) {
        return 'nextSuccessor';
    }
};

var getFlashUploadObj = function() {
    if (supportFlash()) {  // supportFlash未实现
        var str = '<object type="application/x-shockwave-flash"></object>';
        return $(str).appendTo($('body'));
    }
    return 'nextSuccessor';
};

var getFormUploadObj = function() {
    var str = '<input name="file" type="file">';
    return $(str).appendTo($('body'));
};

var getUploadObj = getActiveUploadObj.after(getFlashUploadObj).after(getFormUploadObj);

console.log(getUploadObj());
```



# 参考文档
- *实体书:* `JavaScript设计模式与开发实践(曾探)`

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

