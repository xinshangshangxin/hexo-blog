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