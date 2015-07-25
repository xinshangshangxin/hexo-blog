title: JS设计模式笔记(状态模式)
date: 2015-07-03 16:12:40
description: JS设计模式笔记(状态模式)
tags:
- js
- 设计模式
---

# 状态模式
**定义:允许一个对象在其内部状态改变时改变它的行为,对象看起来似乎修改了它的类**
> 1. 第一部分的意思: 将状态封装成独立的类,并将请求委托给当前的状态对象,当对象的内部状态改变时,会带来不同的行为变化
> 2. 第二部分的意思: 从客户角度来看,我们使用的对象,在不同状态下具有截然不同的行为

## JavaScript版本的状态机
*状态模式是状态机的实现之一*


**通过Function.prototype.call直接把请求委托给某个字面对象来执行**
```js
var Light = function() {
    this.currState = FSM.off; // 设置当前状态
    this.button = null;
};

Light.prototype.init = function() {
    var button = document.createElement('button');
    var _this = this;

    button.innerHTML = '已关灯';
    this.button = document.body.appendChild(button);

    this.button.onclick = function() {
        _this.currState.buttonWasPressed.call(_this); // 把请求委托给FSM状态机
    };
};

var FSM = {
    off: {
        buttonWasPressed: function() {
            console.log('关灯');
            this.button.innerHTML = '下一次按我开灯';
            this.currState = FSM.on;
        }
    },
    on: {
        buttonWasPressed: function() {
            console.log('开灯');
            this.button.innerHTML = '下一次按我关灯';
            this.currState = FSM.off;
        }
    }
};

var light = new Light();
light.init();
```
![light](/img/design/light.png)

---------------------------------

**把变量封闭在闭包内**
```js
var delegate = function(client, delegation) {
    return {
        // 将客户的操作委托给delegation对象
        buttonWasPressed: function() {
            return delegation.buttonWasPressed.apply(client, arguments);
        }
    }
};

var FSM = {
    off: {
        buttonWasPressed: function() {
            console.log('关灯');
            this.button.innerHTML = '下一次按我开灯';
            this.currState = FSM.on;
        }
    },
    on: {
        buttonWasPressed: function() {
            console.log('开灯');
            this.button.innerHTML = '下一次按我关灯';
            this.currState = FSM.off;
        }
    }
};

var Light = function() {
    this.offState = delegate(this, FSM.off);
    this.onState = delegate(this, FSM.on);

    this.currState = this.offState;
    this.button = null;
};


Light.prototype.init = function() {
    var button = document.createElement('button');
    var _this = this;

    button.innerHTML = '已关灯';
    this.button = document.body.appendChild(button);

    this.button.onclick = function() {
        _this.currState.buttonWasPressed.call(_this); // 把请求委托给FSM状态机
    };
};

var light = new Light();
light.init();
```

## 表驱动的有限状态机
**我们可以在表中很清楚的看到下一个状态是由当前状态和行为共同决定的**

当前状态 → 条件↓ | 状态A | 状态B | 状态C
:----:       | :-----: | :-----: | :-----:
条件X       | ......   | .....   | ......
条件Y       | ......   | 状态C   | ......
条件Z       | ......   | .....   | ......

github上有对应的库实现:
[https://github.com/jakesgordon/javascript-state-machine](https://github.com/jakesgordon/javascript-state-machine)


```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>

    <!-- https://github.com/jakesgordon/javascript-state-machine -->
    <script src="http://upload.xinshangshangxin.com/state-machine-2.3.5.min.js"></script>
    <script>
        var fsm = StateMachine.create({
            initial: 'off',
            events: [
                {name: 'buttonWasPressed', from: 'off', to: 'on'},
                {name: 'buttonWasPressed', from: 'on', to: 'off'}
            ],
            callbacks: {
                onbuttonWasPressed: function(event, from, to, msg) {
                    console.log(arguments);
                }
            },
            error: function(eventName, from, to, args, errorCode, errorMessage) {
                console.log(arguments); // 从一种状态试图切换到一种不可能的到达的状态的时候
            }
        });

        var button = document.createElement('button');
        button.innerHTML = 'test';
        button = document.body.appendChild(button);
        button.onclick = function() {
            fsm.buttonWasPressed();
        };
    </script>

</body>
</html>
```
![fsm](/img/design/fsm.png)


## 状态模式和策略模式的关系
1. 状态模式和策略模式 都封装了一系列算法或者行为, 都有一个上下文,一些策略或者状态类,上下文把请求委托给这些类来执行
2. 策略模式中各个策略类之间的是平等又平行的,它们之间没有任何联系,所以客户必须熟知这些策略类的作用,一边客户可以随时主动切换算法
3. 状态模式中,状态和状态所对应的行为是早已被封装好的,状态之间的切换也是早被规定完成,"改变行为"这件事的发生在状态模式内部,对客户来说,并不需要了解这些细节


**虽然状模式一开始并不是非常容易理解,但我们有必须去好好掌握这种设计模式**




# 参考文档
- *实体书:* `JavaScript设计模式与开发实践(曾探)`

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
