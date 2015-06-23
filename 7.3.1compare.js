var each = function(arr, cb) {
    for (var i = 0, l = arr.length; i < l; i++) {
        cb.call(arr[i], i, arr[i]); // 把下标  和 元素 当作参数传给 cb
    }
};


var compare = function(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        throw new Error('arr1 和 arr2 不相等');
    }
    each(arr1, function(i, n) {
        if (n !== arr2[i]) {
            throw new Error('arr1 和 arr2 不相等');
        }
    });

    console.log('arr1 和 arr2 相等');
};

compare([1, 2, 3, 4], [1, 2, 3, 5]); // throw new Error('arr1 和 arr2 不相等');