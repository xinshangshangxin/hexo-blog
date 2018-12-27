---
title: JavaScript权威指南笔记7_脚本化文档
date: 2015-04-23 21:36:14
tags:
- js


---

JavaScript权威指南笔记7_脚本化文档150423
<!-- more -->



`document.getElementById()` 在IE7- 下匹配ID 不区分大小写


`document.getElementsByName();` 和 `document.getElementsByTagName();` 返回 NodeList对象
`document.images`和 `document.forms` 返回 HTMLCollection 对象
它们都是实时的, 生成静态副本如下:
```js
var snapshot = Array.prototype.slice.call(nodelist, 0);
```

`document.getElementsByClassName()` IE9+ 支持
`document.querySelectorAll()`       IE8+

# 文档结构
## 作为节点树的文档
```js
parentNode
childeNodes   // 实时
firstChild, lastChild
nextSibling previousChild   // 兄弟节点的前/后一个
nodeType   // 节点类型
    9 Document节点
    1 Element节点
    3 Text 节点
    8 Comment节点
    11 DocumentFragment节点

nodeValue  Text/Comment 节点的文本内容
nodeName    元素标签名(大写)
```

## 作为元素树的节点   
```js
// IE不可用
firstElementChild lastElementChild
nextElementSibling previousElementChild 
childElementCout // 子元素的数量
```

```js
// 可移植的文档遍历函数
function parent(e, n) {
    if (n === undefined) {
        n = 1;
    }
    while (n-- && e) {
        e = e.parentNode;
    }
    if (!e || e.nodeType !== 1) {
        return null;
    }
    return e;
}

function sibling(e, n) {
    while (e && n !== 0) {
        if (n > 0) {
            if (e.nextElementSibling) {
                e = e.nextElementSibling;
            }
            else {
                for (e = e.nextSibling; e && e.nodeType !== 1; e = e.nextSibling) {
                    /* empty loop */
                }
            }
            n--;
        }
        else {
            if (e.previousElementSibing) {
                e = e.previousElementSibling;
            }
            else {
                for (e = e.previousSibling; e && e.nodeType !== 1; e = e.previousSibling) {
                    /* empty loop */
                }
            }
            n++;
        }
    }
    return e;
}


function child(e, n) {
    if (e.children) {
        if (n < 0) {
            n += e.children.length;
        }
        if (n < 0) {
            return null;
        }
        return e.children[n];
    }


    if (n >= 0) {
        if (e.firstElementChild) {
            e = e.firstElementChild;
        }
        else {
            for (e = e.firstChild; e && e.nodeType !== 1; e = e.nextSibling) {
            }
        }
        return sibling(e, n);
    }
    else {
        if (e.lastElementChild) {
            e = e.lastElementChild;
        }
        else {
            for (e = e.lastChild; e && e.nodeType !== 1; e = e.previousSibling) {
            }
        }
        return sibling(e, n + 1);
    }
}
```

# 属性

> HTML属性名不区分大小写; 转换成js时需要小写; 2个以上单词的属性名除第一个单词以外的单词首字母大写
> HTML属性名在js中为保留字的,属性名加上前缀'html'; 如 for 属性,js中表示为 htmlfor
> class属性在js中 为 className

## 获取设置非标准HTML属性
> 属性值都被看成字符串,所以getAttribute()值返回字符串
> 检测属性hasAttribute; 完全删除属性removeAttribute


## 数据集属性
> H5中,任意以 'data-' 为前缀的小写的属性都是合法的
> dataset-x保存datat-x的值; data-jqueryTest保存data-jquery-test的值

## 作为Attr节点的属性

> Node类型定义了attributes属性
> 针对非Element对象的任何节点,该属性为null
> 对于Element对象,attributes属性是只读的,实时的类数组对象



# 元素内容

## 作为HTML的元素内容
> innerHTML 使用'+=' 操作效率低下
> 只有Element节点定义了outerHTML属性

## 作为纯文本元素的内容
> 查询纯文本元素内容使用 Node的textContent; IE中使用innerText
> innerText不返回<script> 元素内容,针对 <table> <tr> <td> 为只读属性

## 作为Text节点的元素内容
> nodeValue 属性可以读/写, 可以改变Text节点所显示的内容

# 创建/插入/删除节点
## 创建节点
```js
///Text节点
document.createTextNode('text node content');
```
> 每一个几点都有 cloneNode()方法, 返回该节点的一个全新副本
> 传递参数 true 能地鬼复制所有后代节点

## 插入节点
> Node的方法 appendChild() 和 insertBefore()
> 在已存在的文档中的一个节点再次插入,那个节点将自动从它当前的位置删除并在新的位置重新插入

## 删除替换节点

> removeChild() 从文档中删除一个节点
> replaceChild() 删除 一个子节点并用新节点替代
```js
node.parentNode.replaceChild(document.createTextNode('new TextNode'), node)
```

# 坐标
> 文档坐标,相对于文档左上角
> 视口坐标, 相对于浏览器去除外壳的左上角

```js
// 查询窗口滚动条位置
function getScrollOffsets(w) {
    w = w || window;
    // 现代浏览器 IE9+
    if (w.pageXOffset != null) {
        return {x: w.pageXOffset, y: w.pageYOffset};
    }
    // IE8-
    var d = w.document;
    if (document.compatMode == "CSS1Compat") {
        return {
            x: d.documentElement.scrollLeft,
            y: d.documentElement.scrollTop
        };
    }
    // 怪异模式下
    return {
        x: d.body.scrollLeft,
        y: d.body.scrollTop
    };
}
```

```js
// 查询窗口视口尺寸
function getViewportSize(w) {
    w = w || window;
    // 现代浏览器 IE9+
    if (w.innerWidth != null) {
        return {w: w.innerWidth, h: w.innerHeight};
    }
    // IE8-
    var d = w.document;
    if (document.compatMode == "CSS1Compat") {
        return {
            w: d.documentElement.clientWidth,
            h: d.documentElement.clientHeight
        };
    }
    // 怪异模式下
    return {
        w: d.body.clientWidth,
        h: d.body.clientWidth
    };
}
```



## 查询元素的几何尺寸
> getBoundingClientRect() 返回元素  left right top 和 bottom的对象; 现代浏览器还包括width和height
> 查询内联元素每个独立举行: getClientRects()


## 滚动
> scrollTo() / scrollBy()

## 其他
```js
// 获取 e 的位置  
function getElePosition(e) {
    var x = 0;
    var y = 0;
    while (e != null) {
        x += e.offsetLeft;
        y += e.offsetTop;
        e = e.offsetParent;
    }

    return {
        x: x,
        y: y
    };
}
```

```js
// 获取文档选取内容
function getSelection() {
    return window.getSelection ? window.getSelection().toString() : document.selection.createRange().text;
}

// 对于 文本输入域和 textarea  // IE9+
el.value.substring(el.selectionStart, el.selectionEnd);
```



-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

