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