title: "JS设计模式笔记(模板方法模式)"
date: 2015-06-27 13:51:18
description: JS设计模式笔记(模板方法模式)
tags:
- js
- 设计模式
---

# 模板方法模式
> - 模版方法模式是一种只需要集成就可以实现的非常简单的模式
> - 模版方法模式是由两部分组成, 第一部分是抽象父类,第二部分是具体的实现子类


## 钩子方法
```js


var Beverrage = function() {

};

Beverrage.prototype.boilWater = function() {
    console.log('把水煮沸');
};

Beverrage.prototype.brew = function() {
    throw new Error('子类必须重写brew方法');
};

Beverrage.prototype.pourInCup = function() {
    throw new Error('子类必须重写pourIncup方法');
};

Beverrage.prototype.addCondiments = function() {
    throw new Error('子类必须重写addCpndiments方法');
};

Beverrage.prototype.customerWantsCondiments = function() {
    return true; //默认需要调料
};

Beverrage.prototype.init = function() {
    this.boilWater();
    this.brew();
    this.pourInCup();
    if (this.customerWantsCondiments()) {
        this.addCondiments();
    }
};


var CoffeeWithHook = function() {
};

CoffeeWithHook.prototype = new Beverrage();

CoffeeWithHook.prototype.brew = function() {
    console.log('用沸水冲咖啡');
};

CoffeeWithHook.prototype.pourInCup = function() {
    console.log('把咖啡倒进杯子里面');
};

CoffeeWithHook.prototype.addCondiments = function() {
    console.log('加糖和牛奶');
};


CoffeeWithHook.prototype.customerWantsCondiments = function() {
    return window.confirm('请问需要添加调料吗?');
};


var coffeeWithHook = new CoffeeWithHook();
coffeeWithHook.init();
/*
 把水煮沸
 用沸水冲咖啡
 把咖啡倒进杯子里面
 加糖和牛奶
 */
```
> - `Beverrage.prototype.init` 是模版方法,因为该方法中封装了子类的算法框架,它作为一个算法的模板,指导子类以何种顺序去执行哪些算法
> - `Beverrage.prototype.brew` 等方法,如果粗心忘记编写`CoffeeWithHook.prototype.brew`方法,在程序运行时直接抛出一个异常
> -  钩子方法的返回结果决定了模板方法后面部分的执行步骤(`customerWantsCondiments`),这样一来,程序就拥有了变化的可能


## 非继承模板方法

```js
var Beverage = function(param) {
    var boilWater = function() {
        console.log('把水煮沸');
    };

    var brew = param.brew || function() {
            throw new Error('子类必须重写brew方法');
        };

    var pourInCup = param.pourInCup || function() {
            throw new Error('子类必须重写pourIncup方法');
        };

    var addCondiments = param.addCondiments || function() {
            throw new Error('子类必须重写addCpndiments方法');
        };

    var F = function() {
    };

    F.prototype.init = function() {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    };

    return F;
};

var Coffee = Beverage({
    brew: function() {
        console.log('用沸水冲咖啡');
    },
    pourInCup: function() {
        console.log('把咖啡倒进杯子里面');
    },
    addCondiments: function() {
        console.log('加糖和牛奶');
    }
});

var Tea = Beverage({
    brew: function() {
        console.log('用沸水泡茶水');
    },
    pourInCup: function() {
        console.log('把茶倒进杯子里面');
    },
    addCondiments: function() {
        console.log('加柠檬');
    }
});

var coffee = new Coffee();
coffee.init();
/*
 把水煮沸
 用沸水冲咖啡
 把咖啡倒进杯子里面
 加糖和牛奶
 */
var tea = new Tea();
tea.init();
/*
 把水煮沸
 用沸水泡茶水
 把茶倒进杯子里面
 加柠檬
 */
```

**模板方法模式是一种典型的通过封装变化提高系统扩展性的设计模式**

# 参考文档
- *实体书:* `JavaScript设计模式与开发实践(曾探)`

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
