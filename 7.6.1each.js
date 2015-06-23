var each = function(arr, cb) {
    for (var i = 0, l = arr.length; i < l; i++) {
        if (cb(i, arr[i]) === false) {
            break;
        }
    }
};


// 例子
each([1, 2, 3, 4, 5], function(i, n) {
    if (n > 3) {
        return false;
    }
    console.log(n);  // 1  2  3
});