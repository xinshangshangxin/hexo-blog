Function.prototype.after = function(fn) {
    var _this = this;
    return function() {
        var ret = _this.apply(this, arguments);
        if (ret === 'nextSuccessor') {
            return fn.apply(this, arguments);
        }

        return ret;
    }
};

var getActiveUploadObj = function() {
    try {
        return new ActiveXObject('TXFTNActivex.FTMUpload');
    }
    catch (e) {
        return 'nextSuccessor';
    }
};

var getFlashUploadObj = function() {
    if (supportFlash()) {  // supportFlash未实现
        var str = '<object type="application/x-shockwave-flash"></object>';
        return $(str).appendTo($('body'));
    }
    return 'nextSuccessor';
};

var getFormUploadObj = function() {
    var str = '<input name="file" type="file">';
    return $(str).appendTo($('body'));
};

var getUploadObj = getActiveUploadObj.after(getFlashUploadObj).after(getFormUploadObj);

console.log(getUploadObj());
