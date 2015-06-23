var addEven = function(ele, type, handler) {
    if(window.addEventListener) {
        addEven = function(ele, type, handler) {
            ele.addEventListener(type, handler, false);
        }
    }
    else if (window.attachEvent) {
        addEven = function(ele, type, handler) {
            ele.attachEvent('on' + type, handler);
        }
    }
    addEven(ele, type, handler);
};