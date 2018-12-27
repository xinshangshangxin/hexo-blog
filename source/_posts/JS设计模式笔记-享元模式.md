---
title: "JS设计模式笔记(享元模式)"
date: 2015-06-29 12:28:38
tags:
- js
- 设计模式


---

JS设计模式笔记(享元模式)
<!-- more -->



# 享元模式
**享元模式是一种用于性能优化的模式**

## 内部状态与外部状态
> 享元模式要求将对象的属性划分为内部状态和外部状态(状态在这里通常指属性);
>> - 内部状态存储于对象内部
>> - 内部状态可以被一些对象共享
>> - 内部状态独立于具体的场景,通常不会改变
>> - 外部状态取决于具体的场景,并根据场景而变化,外部状态不能被共享

## 文件上传
```js
/*******剥离外部状态***********/
var Upload = function(uploadType) {
    this.uploadType = uploadType;
};

Upload.prototype.delFile = function(id) {
    uploadManager.setExternalState(id, this);

    if (this.fileSize < 3000) {
        return this.dom.parentNode.removeChild(this.dom);
    }

    if (window.confirm('确定删除文件吗? ' + this.fileName)) {
        return this.dom.parentNode.removeChild(this.dom);
    }
};

/*******工厂进行对象实例化***********/
var UploadFactory = (function() {
    var createdFlyWeightObjs = {};

    return {
        create: function(uploadType) {
            if (createdFlyWeightObjs[uploadType]) {
                return createdFlyWeightObjs[uploadType];
            }

            return createdFlyWeightObjs[uploadType] = new Upload(uploadType);
        }
    }
}());

/*******管理器封装外部状态***********/
var uploadManager = (function() {
    var uploadDatabase = {};

    return {
        add: function(id, uploadType, fileName, fileSize) {
            var flyWeightObj = UploadFactory.create(uploadType);

            var dom = document.createElement('div');
            dom.innerHTML = '<span>文件名: ' + fileName + '  文件大小:  ' + fileSize + '</span>'
                + '<button class="delFile">删除</button>';

            dom.querySelector('.delFile').onclick = function() {
                flyWeightObj.delFile(id);
            };

            document.body.appendChild(dom);

            uploadDatabase[id] = {
                fileName: fileName,
                fileSize: fileSize,
                dom: dom
            };

            return flyWeightObj;
        },
        setExternalState: function(id, flyWeightObj) {
            var uploadData = uploadDatabase[id];

            for (var i  in uploadData) {
                flyWeightObj[i] = uploadData[i];
            }
        }
    }
}());

/*******触发上传动作函数***********/
var id = 0;
window.startUpload = function(uploadType, files) {
    for (var i = 0, file; file = files[i++]; ) {
        var uploadObj = uploadManager.add(++id, uploadType, file.fileName, file.fileSize);
    }
};

startUpload('plugin', [{
    fileName: '1.txt',
    fileSize: 1000
},{
    fileName: '2.html',
    fileSize: 3000
}]);


startUpload('flash', [{
    fileName: '4.txt',
    fileSize: 1000
}, {
    fileName: '5.html',
    fileSize: 3000
}]);
```
![效果](/img/design/fileupload.png)

## 享元模式的适用性
1. 一个程序中使用了大量相似的对象
2. 由于使用了大量对象,造成了很大的内存开销
3. 对象的大多数状态都可以变成外部状态
4. 剥离对象的外部状态之后,可以使用相对较少的共享对象取代大量对象
5. 有多少种内部状态的组合,系统中国便存在多少个共享对象


## 对象池
**享元模式的过程是剥离外部状态,并把外部状态保存到其它地方,在合适的时刻再把外部状态组装进共享对象**
**对象池维护一个装载空闲对象的池子,如果需要对象时,不是直接new,而是转从对象池里获取;对象池没有分离外部状态和内部状态这个过程**

## iframe加载-对象池实例

```js
var objectPoolFactory = function(createObjFn) {
    var objPool = [];

    return {
        create: function() {
            console.log(objPool.length);
            return (objPool.length === 0
                ? createObjFn.apply(this, arguments)
                : objPool.shift());
        },
        revover: function(obj) {
            objPool.push(obj);
        }
    }
};

var iframeFactory = objectPoolFactory(function() {
    var iframe = document.createElement('iframe');
    document.body.appendChild(iframe);

    iframe.onload= function() {
        iframe.onload = null; //防止iframe重复加载的bug
        iframeFactory.revover(iframe);
    };

    return iframe;
});

var iframe1 = iframeFactory.create();
iframe1.src='http://je.ishang.club/';

var iframe2 = iframeFactory.create();
iframe2.src='http://blog.xinshangshangxin.com/';

setTimeout(function() {
    var iframe3 = iframeFactory.create();
    iframe3.src='http://nggather.coding.io/';
}, 3000);
```
> 结果只有2个iframe



# 参考文档
- *实体书:* `JavaScript设计模式与开发实践(曾探)`

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

