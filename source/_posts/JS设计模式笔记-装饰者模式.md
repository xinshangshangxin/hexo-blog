---
title: "JS设计模式笔记(装饰者模式)"
date: 2015-07-02 21:07:50
tags:
- js
- 设计模式


---

JS设计模式笔记(装饰者模式)
<!-- more -->



# 装饰者模式
**在不改变对象自身的基础上,在程序运行期间给对象动态的添加职责**


## 用AOP装饰函数
```js
Function.prototype.before = function(beforefn) {
    var _this = this;
    return function() {
        beforefn.apply(this, arguments);
        return _this.apply(this, arguments);
    }
};


Function.prototype.after = function(afterfn) {
    var _this = this;
    return function() {
        var ret = _this.apply(this, arguments);
        afterfn.apply(this, arguments);
        return ret;
    }
};


function test() {
    console.log(1);
}

var testAfter = test.before(function() {
    console.log(0);
}).after(function() {
    console.log(2);
}).after(function() {
    console.log(3);
}).after(function() {
    console.log(4);
});

testAfter();//0 1 2 3 4
```

```js
var before = function(fn, beforefn) {
    return function() {
        beforefn.apply(this, arguments);
        return fn.apply(this, arguments);
    }
};

var after = function(fn, afterfn) {
    return function() {
        fn.apply(this, arguments);
        return afterfn.apply(this, arguments);
    }
};

var a = before(function() {
    console.log(3);
}, function() {
    console.log(2);
});

a = after(a, function() {
    console.log(4);
});

a();  // 2  3  4
```

## 用aop动态改变函数的参数

```js
Function.prototype.before = function(beforefn) {
    var _this = this;
    return function() {
        beforefn.apply(this, arguments);
        return _this.apply(this, arguments);
    }
};


var ajax = function(type, url, param) {
    console.log(param);         // { name: 'shang', token: 'token' }
    // 正真请求略
};

var getToken = function() {
    return 'token';
};

ajax = ajax.before(function(type, url, param) {
    param.token = getToken();
});

ajax('get', 'url', {name: 'shang'});
```

**用AOP的方式给ajax函数动态装饰上token参数,保证了ajax函数是一个相对纯净的函数,提高了ajax函数的可复用性**

## 插件式表单验证
```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
    用户名：<input id="username" type="text"/>
    密码： <input id="password" type="password"/>
    <button id="submitBtn">提交</button>

    <script>
        var username = document.getElementById('username');
        var password = document.getElementById('password');
        var submitBtn = document.getElementById('submitBtn');


        Function.prototype.before = function(beforefn) {
            var _this = this;
            return function() {
                if (beforefn.apply(this, arguments) === false) {
                    return;
                }
                return _this.apply(this, arguments);
            }
        };

        var validate = function() {
            if (username.value === '') {
                alert('用户名不能为空');
                return false;
            }
            if (password.value === '') {
                alert('密码不能为空');
                return false;
            }
        };

        var formSubmit = function() {
            var param = {
                username: username.value,
                password: password.value
            };
            alert('提交数据: ' + JSON.stringify(param));
            // ajax;
        };

        formSubmit = formSubmit.before(validate);

        submitBtn.onclick = function() {
            formSubmit();
        };
    </script>
</body>
</html>
```

## 注意
1. 因为函数通过 `Function.prototype.before` 或者 `Function.prototype.after` 被装饰之后,返回的实际上是一个新的函数,如果原函数上保存了一些属性,那么这些属性会丢失

```js
var func = function() {
    alert(1);
};

func.a = 'a';

func = func.after(function() {
    alert(2);
});

alert(func.a); // undefined
```

2. 这种装饰方式也叠加了函数的作用域,如果装饰的链条过长,性能上也会收到一些影响


## 装饰者模式和代理模式
**相同**
- 都描述了怎样为对象提供一定程度上的间接引用
- 它们的实现部分都保留可对另外一个对象的引用,并向那个对象发送请求

**区别**
> - 代理模式的目的是:当直接访问本体不方便或者不符合需要时,为这个本体提供一个替代者.本体定义了关键功能,而代理提供或拒绝对它的访问,或者在访问本体之前做一些额外的事情
> - 装饰者模式的作用就是为了对象动态加入行为

> - 代理模式强调的一种管理(proxy和它实体之间的关系),这种关系在一开始就可以被确定
> - 装饰者模式用于一开始不能确定对象的全部功能

> - 代理模式通常只有一层代理-对象的引用
> - 装饰者模式经常会形成一条常常的装饰链


# 参考文档
- *实体书:* `JavaScript设计模式与开发实践(曾探)`

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

