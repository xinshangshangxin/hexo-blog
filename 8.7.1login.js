// 登录
$.ajax('http://XXXXXX?login', function(data) {
    login.trigger('loginSucc', data);
});

var header = (function() {
    login.listen('loginSucc', function(data) {
        header.setAvatar(data.avatar);
    });
    return {
        setAvatar: function(data) {
            console.log('设置header模块的头像');
        }
    }
}());


var nav = (function() {
    login.listen('loginSucc', function(data) {
        header.setAvatar(data.avatar);
    });
    return {
        setAvatar: function(data) {
            console.log('设置nav模块的头像');
        }
    }
}());


// 有一天, 又增加了一个新的行为
var address = (function() {
    login.listen('loginSucc', function(obj) {
        address.refresh(obj);
    });
    return {
        refresh: function(data) {
            console.log('刷新地址列表');
        }
    }
}());
