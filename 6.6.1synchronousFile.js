var synchronousFile = function(id) {
    console.log('开始同步文件,id为: ' + id);
};

var proxySynchronousFile = (function(){
    var cache = [];
    var timer;

    return function(id) {
        cache.push(id);
        if (timer) {
            return;
        }

        timer = setTimeout(function() {
            synchronousFile(cache.join(','));
            clearTimeout(timer);
            cache.length = 0;
            timer = null;
        }, 2000);
    }
}());

var checkbox = document.getElementsByTagName('input');

for(var i = 0; c=checkbox[i++]; ) {
    c.onclick= function() {
        if(this.checked === true) {
            proxySynchronousFile(this.id);
        }
    }
}

/* html
 <input type="checkbox" id="1">1
 <input type="checkbox" id="2">2
 <input type="checkbox" id="3">3
 <input type="checkbox" id="4">4
 <input type="checkbox" id="5">5
 */