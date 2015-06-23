// 实例二 表单校验

var strategies = {
    isNonEmpty: function(value, errMsg) {
        if (value === '' || value === undefined || value === null) {
            return errMsg;
        }
    },
    minLen: function(value, len, errMsg) {
        if (value.length < len) {
            return errMsg;
        }
    }
};

var Validator = function() {
    this.cache = [];
};

Validator.prototype.add = function(value, rules) {
    var _this = this;
    for (var i = 0, rule; rule = rules[i]; i++) {
        (function(rule) {
            var strategyArr = rule.strategy.split(':');
            var ruleName = strategyArr.shift();
            strategyArr.unshift(value);
            strategyArr.push(rule.errMsg || (rule + '错误'));
            _this.cache.push(function() {
                return strategies[ruleName].apply(null, strategyArr);
            });
        })(rule);
    }
};

Validator.prototype.start = function() {
    for (var i = 0, validatorFun; validatorFun = this.cache[i]; i++) {
        var errMsg = validatorFun();
        if (errMsg) {
            return errMsg;
        }
    }
};

function checkreg(userName) {
    var validator = new Validator();
    validator.add(userName, [{
        strategy: 'isNonEmpty',
        errMsg: '用户名不能为空'
    }, {
        strategy: 'minLen:3',
        errMsg: '最小长度为3'
    }]);
    var errMsg = validator.start();
    console.log(errMsg);
}

checkreg('');       // 用户名不能为空
checkreg('aa');     // 最小长度为3