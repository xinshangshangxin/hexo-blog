title: js/jq 获取 高度/宽度
date: 2015-03-14 15:44:17
tags:
- js
---

> 在[musicplayer](http://musicplayer.coding.io/)中要动态调整高度,在网上找了些汇总下
<!--more -->

```js

$(window).height(); //浏览器当前窗口可视区域高度 
$(document).height(); //浏览器当前窗口文档的高度 
$(document.body).height();//浏览器当前窗口文档body的高度 
$(document.body).outerHeight(true);//浏览器当前窗口文档body的总高度 包括border padding margin 
$(window).width(); //浏览器当前窗口可视区域宽度 
$(document).width();//浏览器当前窗口文档对象宽度 
$(document.body).width();//浏览器当前窗口文档body的高度 
$(document.body).outerWidth(true);//浏览器当前窗口文档body的总宽度 包括border padding margin 
$(document).scrollTop();//网页被卷去的高  
```

```js
document.body.clientWidth; //网页可见区域宽
document.body.clientHeight; //网页可见区域高
document.body.offsetWidth; //网页可见区域宽(包括边线和滚动条的宽)
document.body.offsetHeight;//网页可见区域高 (包括边线的宽)";
document.body.scrollWidth;//网页正文全文宽
document.body.scrollHeight;//网页正文全文高
document.body.scrollTop;//网页被卷去的高(ff)
document.documentElement.scrollTop;//网页被卷去的高(ie)
document.body.scrollLeft;//网页被卷去的左
window.screen.height;//屏幕分辨率的高
window.screen.width;//屏幕分辨率的宽
window.screen.availHeight;//屏幕可用工作区高度
window.screen.availWidth;//屏幕可用工作区宽度
```

```js
//在IE中：
document.body.clientWidth ==> BODY对象宽度
document.body.clientHeight ==> BODY对象高度
document.documentElement.clientWidth ==> 可见区域宽度
document.documentElement.clientHeight ==> 可见区域高度
//在FireFox中：
document.body.clientWidth ==> BODY对象宽度
document.body.clientHeight ==> BODY对象高度
document.documentElement.clientWidth ==> 可见区域宽度
document.documentElement.clientHeight ==> 可见区域高度
//在Opera中： 
document.body.clientWidth ==> 可见区域宽度
document.body.clientHeight ==> 可见区域高度
document.documentElement.clientWidth ==> 页面对象宽度（即BODY对象宽度加上Margin宽）
document.documentElement.clientHeight ==> 页面对象高度（即BODY对象高度加上Margin高）
而如果没有定义W3C的标准，则
//IE为：
document.documentElement.clientWidth ==> 0
document.documentElement.clientHeight ==> 0
//FireFox为：
document.documentElement.clientWidth ==> 页面对象宽度（即BODY对象宽度加上Margin宽）
document.documentElement.clientHeight ==> 页面对象高度（即BODY对象高度加上Margin高）
//Opera为：
document.documentElement.clientWidth ==> 页面对象宽度（即BODY对象宽度加上Margin宽）
document.documentElement.clientHeight ==> 页面对象高度（即BODY对象高度加上Margin高）
```



```js
// 获取页面的高度、宽度
function getPageSize() {
    var xScroll, yScroll;
    if (window.innerHeight && window.scrollMaxY) {
        xScroll = window.innerWidth + window.scrollMaxX;
        yScroll = window.innerHeight + window.scrollMaxY;
    } else {
        if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac    
            xScroll = document.body.scrollWidth;
            yScroll = document.body.scrollHeight;
        } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari    
            xScroll = document.body.offsetWidth;
            yScroll = document.body.offsetHeight;
        }
    }
    var windowWidth, windowHeight;
    if (self.innerHeight) { // all except Explorer    
        if (document.documentElement.clientWidth) {
            windowWidth = document.documentElement.clientWidth;
        } else {
            windowWidth = self.innerWidth;
        }
        windowHeight = self.innerHeight;
    } else {
        if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode    
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else {
            if (document.body) { // other Explorers    
                windowWidth = document.body.clientWidth;
                windowHeight = document.body.clientHeight;
            }
        }
    }       
    // for small pages with total height less then height of the viewport    
    if (yScroll < windowHeight) {
        pageHeight = windowHeight;
    } else {
        pageHeight = yScroll;
    }    
    // for small pages with total width less then width of the viewport    
    if (xScroll < windowWidth) {
        pageWidth = xScroll;
    } else {
        pageWidth = windowWidth;
    }
    arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
    return arrayPageSize;
}
```

# 参考资料:
[http://www.cnblogs.com/henllyee/archive/2008/04/20/1162517.html](http://www.cnblogs.com/henllyee/archive/2008/04/20/1162517.html)
[http://www.cnblogs.com/hoojo/archive/2012/02/16/2354663.html](http://www.cnblogs.com/hoojo/archive/2012/02/16/2354663.html)

-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
