var order500 = function(orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
        console.log('500定金预定,得到100优惠卷');
    }
    else {
        return 'nextSuccessor';
    }
};

var order200 = function(orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
        console.log('200 定金预定,得到50优惠卷');
    }
    else {
        return 'nextSuccessor';
    }
};

var orderNomal = function(orderType, pay, stock) {
    if (stock > 0) {
        console.log('普通购买,无优惠卷');
    }
    else {
        console.log('库存不足');
    }
};

Function.prototype.after = function(fn) {
    var _this = this;
    return function() {
        var ret = _this.apply(this, arguments);
        if (ret === 'nextSuccessor') {
            return fn.apply(this, arguments);
        }

        return ret;
    }
};

var order = order500.after(order200).after(orderNomal);

order(1, false, 500); // 普通购买,无优惠卷