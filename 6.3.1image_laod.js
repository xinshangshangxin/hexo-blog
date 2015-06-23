var myImage = (function() {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);

    return {
        setSrc: function(src) {
            imgNode.src = src;
        }
    };
}());

var proxyImage = (function() {
    var img = new Image;
    img.onload = function() {
        myImage.setSrc(this.src);
    };

    return {
        setSrc: function(src) {
            myImage.setSrc('http://upload.xinshangshangxin.com/o_19n9lj3a480nl2l1ie7up31ckc9.png');
            img.src = src;
        }
    }
}());

proxyImage.setSrc('http://upload.xinshangshangxin.com/o_19n9ljafs96hpif1o401mci1r7c18.jpg');