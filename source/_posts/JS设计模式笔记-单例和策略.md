title: "JS设计模式笔记(单例和策略)"
date: 2015-06-22 17:13:26
description: JS设计模式笔记(单例和策略)
tags:
- js
- 设计模式
---

## 单例模式
> 单例模式的核心是确保只有一个实例,并提供全局访问

```js
var getSingle = function(fn) {
    var result;
    return function() {
        return result || (result = fn.apply(this, arguments));
    }
};

// 实例
var createLoginLayer = function() {
    var div = document.createElement('div');
    div.innerHTML='我是登录框';
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
};

var createSingleLoginLayer = getSingle(createLoginLayer);

document.getElementById('test').onlick = function() {
    var loginLayer = createSingleLoginLayer();
    loginLayer.style.display = 'block';
};
```

**创建实例对象的职责和管理单例的职责分别放置在2个方法里,这两个方法可以独立变化而互不影响**


## 策略模式 
> 策略模式的目的是将算法的使用和算法的实现分离

> 一个基于策略模式的程序至少有两部分组成.
> 1. 一组策略类,策略类封装了具体的算法,并负责具体的计算过程
> 2. 环境类Context, Context接受客户请求,随后把请求委托给某一策略类

```js
// ----------实例一 计算奖金----------

var strategies = {
    'S': function(salary) {
        return salary * 4;
    },
    'A': function(salary) {
        return salary * 3;
    },
    'B': function(salary) {
        return salary * 2;
    }
};

var calculateBonus = function(level, salary) {
    return strategies[level](salary);
};

console.log(calculateBonus('S', 20000));
```

**calculateBonus并没有计算奖金的能力,而是把这个职责委托给了某个策略对象,每个策略对象负责的算法已经被各自封装在对象内部了**

----------
> 策略模式也可以用来封装一系列"业务规则".只要这些业务规则指向的目标一致,并且可以被替换使用,就可以使用策略模式封装它们;

```js
// 实例二 表单校验

var strategies = {
    isNonEmpty: function(value, errMsg) {
        if (value === '' || value === undefined || value === null) {
            return errMsg;
        }
    },
    minLen: function(value, len, errMsg) {
        if (value.length < len) {
            return errMsg;
        }
    }
};

var Validator = function() {
    this.cache = [];
};

Validator.prototype.add = function(value, rules) {
    var _this = this;
    for (var i = 0, rule; rule = rules[i]; i++) {
        (function(rule) {
            var strategyArr = rule.strategy.split(':');
            var ruleName = strategyArr.shift();
            strategyArr.unshift(value);
            strategyArr.push(rule.errMsg || (rule + '错误'));
            _this.cache.push(function() {
                return strategies[ruleName].apply(null, strategyArr);
            });
        })(rule);
    }
};

Validator.prototype.start = function() {
    for (var i = 0, validatorFun; validatorFun = this.cache[i]; i++) {
        var errMsg = validatorFun();
        if (errMsg) {
            return errMsg;
        }
    }
};

function checkreg(userName) {
    var validator = new Validator();
    validator.add(userName, [{
        strategy: 'isNonEmpty',
        errMsg: '用户名不能为空'
    }, {
        strategy: 'minLen:3',
        errMsg: '最小长度为3'
    }]);
    var errMsg = validator.start();
    console.log(errMsg);
}

checkreg('');       // 用户名不能为空
checkreg('aa');     // 最小长度为3
```

### 策略模式的优点
1. 策略模式利用 组合,委托和多态等技术和思想,可以有效的避免多重条件选择语句
2. 策略模式提供了对开方-封闭原则的完美支持,将算法封装在独立的strategy中,使得他们易于切换,易于理解,易于扩展
3. 策略模式的算法也可以复用在系统的其他地方,从而必选许多重复的复制粘贴工作
4. 在策略模式中利用组合和委托来让Context拥有算法的执行能力,这也是继承的一种更轻便的替代方案

### 策略模式的缺点
1. 增加了许多策略类/策略对象
2. 必须了解所有的strategy,知道其不同点

# 参考文档
- *实体书:* `JavaScript设计模式与开发实践(曾探)`

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
