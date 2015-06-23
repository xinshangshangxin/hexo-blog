var getSingle = function(fn) {
    var result;
    return function() {
        return result || (result = fn.apply(this, arguments));
    }
};

// 实例
var createLoginLayer = function() {
    var div = document.createElement('div');
    div.innerHTML='我是登录框';
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
};

var createSingleLoginLayer = getSingle(createLoginLayer);

document.getElementById('test').onlick = function() {
    var loginLayer = createSingleLoginLayer();
    loginLayer.style.display = 'block';
};