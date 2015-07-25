title: "JS设计模式笔记(组合模式)"
date: 2015-06-26 15:02:46
description: JS设计模式笔记(组合模式)
tags:
- js
- 设计模式
---

# 组合模式
> - 命令模式只负责传递请求给叶对象,它的目的不在于控制对叶对象的访问
> - 组合模式将对象,以表示"部分-整体"的层次结构.
> - 组合模式通过对象的多态性表现,使得用户对单个对象和组合对象的使用具有一致性


## 实例-扫描文件夹
```js
var Folder = function(name) {
    this.name = name;
    this.files = [];
};

Folder.prototype.add = function(file) {
    this.files.push(file);
};

Folder.prototype.scan = function() {
    console.log('开始扫描文件夹: ' + this.name);
    for (var i = 0, file, files = this.files; file = files[i++];) {
        file.scan();
    }
};

/************File*************/
var File = function(name) {
    this.name = name;
};

File.prototype.add = function() {
    throw new Error('文件下面不能添加文件');
};

File.prototype.scan = function() {
    console.log('开始扫描文件:  ' + this.name);
};


var folder = new Folder('study');
var folder1 = new Folder('JavaScript');
var folder2 = new Folder('angular');

var file1 = new File('js');
var file2 = new File('ng');
var file3 = new File('设计模式');

folder1.add(file1);
folder2.add(file2);

folder.add(folder1);
folder.add(folder2);
folder.add(file3);


var folder3 = new Folder('Nodejs');
var file4 = new File('深入浅出Node.js');
folder3.add(file4);

folder.add(folder3);

folder.scan();
```
**同等对待组合对象和叶对象,给叶对象增加方法add,并且在调用这个方法时抛出一个异常来提醒客户**

## note
> - 组合模式是一种聚合(HAS-A)模式,而不是父子关系(IS-A);
> - 组合模式对一组叶对象的操作必须具有一致性


## 引用父对象
```js
var Folder = function(name) {
    this.name = name;
    this.parent = null;
    this.files = [];
};

Folder.prototype.add = function(file) {
    file.parent = this; // 设置父对象
    this.files.push(file);
};

Folder.prototype.scan = function() {
    console.log('开始扫描文件夹: ' + this.name);
    for (var i = 0, file, files = this.files; file = files[i++];) {
        file.scan();
    }
};


Folder.prototype.remove = function() {
    if (!this.parent) {
        return;
    }

    for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
        var file = files[l];
        if (file === this) {
            files.splice(l, 1);
        }
    }
};

/************File*************/
var File = function(name) {
    this.name = name;
    this.parent = null;
};

File.prototype.add = function() {
    throw new Error('文件下面不能添加文件');
};

File.prototype.scan = function() {
    console.log('开始扫描文件:  ' + this.name);
};

File.prototype.remove = function() {
    if (!this.parent) {
        return;
    }

    for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
        var file = files[l];
        if (file === this) {
            files.splice(l, 1);
        }
    }
};


var folder = new Folder('study');
var folder1 = new Folder('JavaScript');
var folder2 = new Folder('angular');

var file1 = new File('js');
var file2 = new File('ng');
var file3 = new File('设计模式');

folder1.add(file1);
folder2.add(file2);

folder.add(folder1);
folder.add(folder2);
folder.add(file3);

folder1.remove();

folder.scan();

/*
 开始扫描文件夹: study
 开始扫描文件夹: angular
 开始扫描文件:  ng
 开始扫描文件:  设计模式
 */
```

## 何时使用组合模式
> 1. 表示对象的部分-整体层次结构
> 2. 客户希望统一对待树中的所有对象

# 参考文档
- *实体书:* `JavaScript设计模式与开发实践(曾探)`

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
