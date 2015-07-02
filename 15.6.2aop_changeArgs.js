Function.prototype.before = function(beforefn) {
    var _this = this;
    return function() {
        beforefn.apply(this, arguments);
        return _this.apply(this, arguments);
    }
};


var ajax = function(type, url, param) {
    console.log(param);         // { name: 'shang', token: 'token' }
    // 正真请求略
};

var getToken = function() {
    return 'token';
};

ajax = ajax.before(function(type, url, param) {
    param.token = getToken();
});

ajax('get', 'url', {name: 'shang'});
