/***
 *
 * @param arr 需要的数据
 * @param fn  函数
 * @param [count] 每次创建多少个数据,默认一个
 * @param [interval] 单位时间,默认200ms
 * @returns {Function}
 */
var timeChunk = function(arr, fn, count, interval) {
    var t;

    var start = function() {
        var obj;
        for (var i = 0; i < Math.min(count || 1, arr.length); i++) {
            obj = arr.shift();
            fn(obj);
        }
    };

    return function() {
        t = setInterval(function() {
            if (arr.length === 0) {
                return clearInterval(t);
            }

            start();
        }, interval || 200);
    }
};


// 测试
var arr =[];
for (var i = 0; i < 1000; i++) {
    arr.push(i);
}

var renderFrindsList = timeChunk(arr, function(n) {
    var div = document.createElement('div');
    div.innerHTML = n;
    document.body.appendChild(div);
}, 8);

renderFrindsList();