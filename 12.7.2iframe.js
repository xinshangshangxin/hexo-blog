var objectPoolFactory = function(createObjFn) {
    var objPool = [];

    return {
        create: function() {
            console.log(objPool.length);
            return (objPool.length === 0
                ? createObjFn.apply(this, arguments)
                : objPool.shift());
        },
        revover: function(obj) {
            objPool.push(obj);
        }
    }
};

var iframeFactory = objectPoolFactory(function() {
    var iframe = document.createElement('iframe');
    document.body.appendChild(iframe);

    iframe.onload= function() {
        iframe.onload = null; //防止iframe重复加载的bug
        iframeFactory.revover(iframe);
    };

    return iframe;
});

var iframe1 = iframeFactory.create();
iframe1.src='http://je.ishang.club/';

var iframe2 = iframeFactory.create();
iframe2.src='http://blog.xinshangshangxin.com/';

setTimeout(function() {
    var iframe3 = iframeFactory.create();
    iframe3.src='http://nggather.coding.io/';
}, 3000);