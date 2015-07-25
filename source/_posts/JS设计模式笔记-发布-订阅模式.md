title: "JS设计模式笔记(发布-订阅模式)"
date: 2015-06-24 23:00:04
description: JS设计模式笔记(发布-订阅模式)
tags:
- js
- 设计模式
---

# 发布-订阅模式
**定义对象间一种一对多的依赖关系,当一个对象的状态发生改变时,所有依赖它的对象都将得到通知.在js中,用事件模型代替传统的发布-订阅模式**

## 发布-订阅模式的通用实现

```js
var event = {
    clientList: [],
    listen: function(key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = [];
        }
        this.clientList[key].push(fn);
    },
    trigger: function() {
        var key = [].shift.call(arguments);
        var fns = this.clientList[key];

        // 如果没有对应的绑定消息
        if (!fns || fns.length === 0) {
            return false;
        }

        for (var i = 0, fn; fn = fns[i++];) {
            // arguments 是 trigger带上的参数
            fn.apply(this, arguments);
        }
    },
    remove: function(key, fn) {
        var fns = this.clientList[key];

        // key对应的消息么有被人订阅
        if (!fns) {
            return false;
        }

        // 没有传入fn(具体的回调函数), 表示取消key对应的所有订阅
        if (!fn) {
            fns && (fns.length = 0);
        }
        else {
            // 反向遍历
            for (var i = fns.length - 1; i >= 0; i--) {
                var _fn = fns[i];
                if (_fn === fn) {
                    // 删除订阅回调函数
                    fns.splice(i, 1);
                }
            }
        }
    }
};

var installEvent = function(obj) {
    for (var i  in event) {
        obj[i] = event[i];
    }
};

// 实例
var salesOffices = {};
installEvent(salesOffices);

var fn1 = function(price) {
    console.log('squareMeter88 fn1: ' + price);
};

salesOffices.listen('squareMeter88', fn1);

salesOffices.listen('squareMeter88', function(price) {
    console.log('squareMeter88 fn2: ' + price);
});


salesOffices.listen('squareMeter100', function(price) {
    console.log(price);
});

salesOffices.remove('squareMeter88', fn1);
salesOffices.trigger('squareMeter88', 20000);
salesOffices.trigger('squareMeter100', 30000);
/*
 squareMeter88 fn2: 20000
 30000
 */
```

## 网站登录实例
```js
// 登录
$.ajax('http://XXXXXX?login', function(data) {
    login.trigger('loginSucc', data);
});

var header = (function() {
    login.listen('loginSucc', function(data) {
        header.setAvatar(data.avatar);
    });
    return {
        setAvatar: function(data) {
            console.log('设置header模块的头像');
        }
    }
}());


var nav = (function() {
    login.listen('loginSucc', function(data) {
        header.setAvatar(data.avatar);
    });
    return {
        setAvatar: function(data) {
            console.log('设置nav模块的头像');
        }
    }
}());


// 有一天, 又增加了一个新的行为
var address = (function() {
    login.listen('loginSucc', function(obj) {
        address.refresh(obj);
    });
    return {
        refresh: function(data) {
            console.log('刷新地址列表');
        }
    }
}());
```

## 全局的发布-订阅对象
> 订阅者不需要了解消息来自哪个发布者,发布者也不知道消息会推送给哪些订阅者,Event作为一个类似"中介者"的角色,把订阅者和发布者联系起来

```js
var Event = (function() {
    var clientList = {};
    var listen,
        trigger,
        remove;
    listen = function(key, fn) {
        if (!clientList[key]) {
            clientList[key] = [];
        }
        clientList[key].push(fn);
    };

    trigger = function() {
        var key = [].shift.call(arguments);
        var fns = clientList[key];

        if (!fns || fns.length === 0) {
            return false;
        }

        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments);
        }
    };


    remove = function(key, fn) {
        var fns = clientList[key];

        // key对应的消息么有被人订阅
        if (!fns) {
            return false;
        }

        // 没有传入fn(具体的回调函数), 表示取消key对应的所有订阅
        if (!fn) {
            fns && (fns.length = 0);
        }
        else {
            // 反向遍历
            for (var i = fns.length - 1; i >= 0; i--) {
                var _fn = fns[i];
                if (_fn === fn) {
                    // 删除订阅回调函数
                    fns.splice(i, 1);
                }
            }
        }
    };

    return {
        listen: listen,
        trigger: trigger,
        remove: remove
    }
}());

// 实例
Event.listen('squareMeter88', function(price) {
    console.log(price);
});

Event.trigger('squareMeter88', 20000);   // 20000
```

## 全局事件命名冲突
```js
var Event = (function() {

    var Event,
        _default = 'default';

    Event = function() {
        var _listen,
            _trigger,
            _remove,
            _shift = [].shift,
            _unshift = [].unshift,
            namespaceCache = {},
            _create,
            each = function(arr, fn) {
                var ret;
                for (var i = 0, l = arr.length; i < l; i++) {
                    var n = arr[i];
                    ret = fn.call(n, i, n);
                }

                return ret;
            };

        _listen = function(key, fn, cache) {
            if (!cache[key]) {
                cache[key] = [];
            }
            cache[key].push(fn);
        };

        _remove = function(key, cache, fn) {
            if (cache[key]) {
                if (fn) {
                    for (var i = cache[key].length - 1; i >= 0; i--) {
                        if (cache[key][i] === fn) {  // 原书为 cache[key] === fn, 错误!
                            // 删除订阅回调函数
                            cache[key].splice(i, 1);
                        }
                    }
                }
                else {
                    cache[key] = [];
                }
            }
        };

        _trigger = function() {
            var cache = _shift.call(arguments);
            var key = _shift.call(arguments);
            var args = arguments;
            var _this = this;
            var stack = cache[key];

            if (!stack || !stack.length) {
                return;
            }

            return each(stack, function() {
                return this.apply(_this, args);
            })
        };

        _create = function(namespace) {
            namespace = namespace || _default;
            var cache = {};
            var offlineStack = []; //离线事件
            var ret = {
                listen: function(key, fn, last) {
                    _listen(key, fn, cache);

                    if (offlineStack === null) {
                        return;
                    }

                    if (last === 'last') {
                        offlineStack.length && offlineStack.pop()();
                    }
                    else {
                        each(offlineStack, function() {
                            this();
                        });
                    }

                    offlineStack = null;
                },
                one: function(key, fn, last) {
                    _remove(key, cache);
                    this.listen(key, fn, last);
                },
                remove: function(key, fn) {
                    _remove(key, cache, fn);
                },
                trigger: function() {
                    var fn,
                        args,
                        _this = this;

                    _unshift.call(arguments, cache);
                    args = arguments;

                    fn = function() {
                        return _trigger.apply(_this, args);
                    };

                    if (offlineStack) {
                        return offlineStack.push(fn);
                    }

                    return fn();
                }
            };

            return namespace ?
                (namespaceCache[namespace] ?
                    namespaceCache[namespace] : namespaceCache[namespace] = ret)
                : ret;
        };

        return {
            create: _create,
            one: function(key, fn, last) {
                var event = this.create();
                event.one(key, fn, last);
            },
            remove: function(key, fn) {
                var event = this.create();
                event.remove(key, fn);
            },
            listen: function(key, fn, last) {
                var event = this.create();
                event.listen(key, fn, last);
            },
            trigger: function() {
                var event = this.create();
                event.trigger.apply(this, arguments);
            }
        }
    }();

    return Event;
}());

var fn1 = function(price) {
    console.log(price);
};

// 实例
Event.listen('squareMeter88', fn1);
Event.remove('squareMeter88', fn1);

Event.listen('squareMeter88', function(price) {
    console.log('fn2: ' + price);
});


Event.trigger('squareMeter88', 20000);   // fn2: 20000
```


## 发布-订阅模式(观察者模式)优点:
1. 时间上解耦
2. 对象之间的解耦

## 发布-订阅模式(观察者模式)缺点:
1. 创建订阅者本身要消耗一定的时间个内存
2. 订阅一个消息后,也许此消息最后都未发生,但这个订阅者始终会存在内存中
3. 发布-订阅模式虽然可以弱化对象之间的联系,但是如果过度使用的话,对象和对象之间的必要联系也将深埋在背后,会导致程序难以更重维护和理解


# 参考文档
- *实体书:* `JavaScript设计模式与开发实践(曾探)`

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
