title: "JS设计模式笔记(命令模式)"
date: 2015-06-25 21:03:04
description: JS设计模式笔记(命令模式)
tags:
- js
- 设计模式
---

# 命令模式
> - 命令模式中的命令(command)指的是一个执行某些特定事情的指令
> - 命令模式常见的应用场景是:有时候需要向某些对象发送请求,但是不知道请求的接收者是谁,也不知道被请求的操作是是那么.此时希望用一种松耦合的方式来设计程序,使得请求发送者和请求接收者能够消除彼此间的耦合关系
> - command对象拥有更长的生命周期.对象的生命周期是跟初始请求无关的,因为请求已经被封装在command对象的方法中,成为了这个对象的行为
> - 命令模式还支持撤销,排队等操作

## 菜单程序实例
```js
var setCommand = function(btn, command) {
    btn.onclick = function() {
        command.execute();
    }
};

var MenuBar = {
    refresh: function() {
        console.log('刷新');
    }
};

var RefreshMenuBarCommand = function(receiver) {
    return {
        execute: function() {
            receiver.refresh();
        },
        undo: function() {

        }
    }
};

var refreshMenuBarCommand =RefreshMenuBarCommand(MenuBar);
setCommand(document.getElementById('btn'), refreshMenuBarCommand);
```

**除了执行命令外,还提供撤销等命令操作,所以把执行函数写成execute方法**

## 宏命令
**宏命令是一组几何,通过执行宏命令的方式,可以一次执行一批命令**
```js
var closeDoorCommand = {
    execute: function() {
        console.log('关门');
    }
};

var openPcCommand = {
    execute: function() {
        console.log('开电脑');
    }
};

var openQQCommand = {
    execute: function() {
        console.log('登录QQ');
    }
};

// 定义宏命令 MacroCommand
var MacroCommand = function() {
    return {
        commandsList:[],
        add: function(command) {
            this.commandsList.push(command);
        },
        execute: function() {
            for (var i = 0, command; command= this.commandsList[i++]; ) {
                command.execute();
            }
        }
    }
};

var macroCommand = MacroCommand();
macroCommand.add(closeDoorCommand);
macroCommand.add(openPcCommand);
macroCommand.add(openQQCommand);

macroCommand.execute();
/*
 关门
 开电脑
 登录QQ
 */
```

## 智能命令和傻瓜命令
```js
var closeDoorCommand = {
    execute: function() {
        console.log('关门');
    }
};
```
> 1. 一般来说,命令模式都会在command对象中保存一个接收者来负责真正执行客户的请求,这种情况下的命令是"傻瓜式"的
> 2. `closeDoorCommand`中没有包含任何 `receiver`的信息,它本身就包揽了执行请求的行为(命令对象可以直接实现请求的定义),叫做智能命令

## 智能命令和策略模式
> - 策略模式指向的问题域更小,所有策略对象的目标总是一致的,它们只是达到这个目标的不同手段,它们的内部实现是针对算法而言的
> - 智能命令模式指向的问题域更广,command对象解决的目标更具有发散性.命令模式还可以完成撤销,排队等功能

 


# 参考文档
- *实体书:* `JavaScript设计模式与开发实践(曾探)`

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
