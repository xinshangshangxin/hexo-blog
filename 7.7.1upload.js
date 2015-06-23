var supportFlash = function() {
    // 未实现
};

var getActiveUploadObj = function() {
    try{
        return new ActiveXObject('TXFTNActivex.FTMUpload');
    }
    catch(e) {
        return false;
    }
};

var getFlashUploadObj = function() {
    if (supportFlash()) {
        var str = '<object type="application/x-shockwave-flash"></object>';
        return $(str).appendTo($('body'));
    }
    return false;
};

var getFormUploadObj = function() {
    var str = '<input name="file" type="file">';
    return $(str).appendTo($('body'));
};

var iteratorUploadObj = function() {
    for (var i = 0, fn; fn = arguments[i++]; ) {
        var uploadObj = fn();
        if (uploadObj !== false) {
            return uploadObj;
        }
    }
};

var uploadObj = iteratorUploadObj(getActiveUploadObj, getFlashUploadObj, getFormUploadObj);