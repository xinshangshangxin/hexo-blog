
var each = function(arr, cb) {
    for (var i = 0, l = arr.length; i < l; i++) {
        cb.call(arr[i], i, arr[i]); // 把下标  和 元素 当作参数传给 cb
    }
};


// 例子
each([1, 2, 3], function(i, n) {
    console.log(i, n);
});