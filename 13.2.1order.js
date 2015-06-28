var order500 = function(orderType, pay, stock) {
    if(orderType === 1 && pay === true) {
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


var Chain = function(fn) {
    this.fn = fn;
    this.successor = null;
};

Chain.prototype.setNextSuccessor = function(successor) {
    return this.successor = successor;
};

Chain.prototype.passRequest = function() {
    var ret = this.fn.apply(this, arguments);

    if (ret === 'nextSuccessor') {
        return this.successor && this.successor.passRequest.apply(this.successor, arguments);
    }

    return ret;
};

var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = new Chain(orderNomal);

chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);

chainOrder500.passRequest(3, true, 500); // 普通购买,无优惠卷