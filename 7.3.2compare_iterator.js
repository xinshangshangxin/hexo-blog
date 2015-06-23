var Iterator = function(arr) {
    var current = 0;

    var next = function() {
        current += 1;
    };

    var isDone = function() {
        return current >= arr.length;
    };

    var getCurrItem = function() {
        return arr[current];
    };

    return {
        next: next,
        isDone: isDone,
        getCurrItem: getCurrItem
    }
};


var compare = function(iterator1, iterator2) {
    while(!iterator1.isDone() && !iterator2.isDone()) {
        if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
            throw  new Error('iterator1 和 iterator2 不相等');
        }

        iterator1.next();
        iterator2.next();
    }

    if (iterator1.isDone() && iterator2.isDone()) {
        console.log('iterator1 和 iterator2 相等');
    }
    else {
        throw  new Error('iterator1 和 iterator2 不相等');
    }

};

var iterator1 = new Iterator([1, 2, 3]);
var iterator2 = new Iterator([1, 2, 3]);

compare(iterator1, iterator2); // iterator1 和 iterator2 相等;