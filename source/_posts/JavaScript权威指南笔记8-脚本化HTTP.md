title: "JavaScript权威指南笔记8_脚本化HTTP"
date: 2015-05-05 13:50:52
description:  JavaScript权威指南笔记8_脚本化HTTP
tags:
- js
---

## open()

> open() 的第一个参数指定HTTP的 方法/动作; 不区分大小写;但通常使用大写字幕  

> open() 的第二个参数是 URL; 相对于文档的URL或者绝对URL
>> 绝对URL如果跨域,通常会报错;除非服务器允许并且XHR2规范

> 使用setRequestsHeader() 多次设置
> POST请求通常拥有主体,同时应该使用 `setRequestsHeader` 指定 `Content-Type` 头
> `xhr.setRequestHeader('Content-Type', 'text/plain')`  
>> 无法传递以下头

 _ | _ | _
:------------: | :-------------:  | :-------------:
Accept-Charset |  Content-Transfer-Encoding  | TE
Accept-Encoding |  Date                |  Trailer
Connection |  Expect |    Transfer-Encoding
Content-Length | Host | Upgrade
Cookie | Keep-Alive | User-Agent
Cookie2 | Referer |  Via

> open() 传递第3个参数 为 false, send()方法阻塞,以同步响应

> open() 的第4个和第5个参数为用户名和密码, 请求一个受密码保护的URL  

## send()
> GET请求没有主体, 设置为null会省略这个参数 
> request.send(null)

## 顺序:
1. 请求方法和URL
2. 请求头
3. 请求主体  

```js
function postMessage(msg) {
    var request = new XMLHttpRequest();
    // 请求方法和URL
    request.open("POST", "/log.php");
    // 请求头
    request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    // 请求主体
    request.send(msg);
}
```

## 响应
> status和statusText以数字和文本的形式返回HTTP状态码

> getResponseHeader() 和 getAllResponseHeaders() 能查询响应头
>> getAllResponseHeaders() 会过滤掉cookie头
>> getResponseHeader() 传递 Set-Cookie 或 Set-Cookie2 返回null

> responseText 以文本形式返回响应主体

### readyState
常量(IE9+) | 值 | 含义
:---:|:---:|:---:
UNSENT | 0 | open() 尚未调用
OPENED | 1 |  open() 已调用
HEADERS_RECEIVED | 2 |  接收到头信息
LOADING | 3 |  接收到响应主体
DONE | 4 |  响应完成

###  onreadystatechange
> readystatechange事件在实际中改变为0或1时可能没有触发这个事件;
> 当调用send()事件时,即使处于OPENED状态也触发

```js
/**
 * 异步get请求获取text
 * @param url
 * @param callback 回调函数
 */
function getText(url, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onreadystatechange = function() {
        // 请求完成                     状态码为200
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader("Content-Type");
            if (type.match(/^text/)) {
                callback(request.responseText);
            }
        }
    };
    request.send(null);
}
```

```js
/**
 * 同步响应
 * @param url
 * @returns {string}
 */
function getTextSync(url) {
    var request = new XMLHttpRequest();
    // 第3个参数为false实现同步
    request.open("GET", url, false);
    // 发送请求
    request.send(null);
    // 阻塞线程运行; 不需要readystatechange事件
    if (request.status !== 200) {
        throw new Error(request.statusText);
    }
    var type = request.getResponseHeader("Content-Type");
    if (!type.match(/^text/)) {
        throw new Error("Expected textual response; got: " + type);
    }
    return request.responseText;
}
```

## 编码请求主体
### 表单编码请求
> 表单数据POST是必须设置 `Content-type`
> 表单数据编码格式MIME类型:
`appliaction/x-www-form-urlencoded`

### JSON编码请求
> `application/json`

```js
function postJSON(url, data, callback) {
    var request = new XMLHttpRequest();
    request.open("POST", url);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && callback)
            callback(request);
    };
    // 设置请求头
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(data));
}
```

### 自动设置
> 给send()传入XML文档,自动设置一个合适的头
> 给send()传入字符串并且没有指定 `Content-Type` 头, 自动添加 `text/plain; charset=UTF-8`



## 上传文件
> XHR2允许向send()方法传入任何Blob对象

```js
// 使用POST请求上传文件
var whenReady = (function() {
    var funcs = [];
    var ready = false;

    function handler(e) {
        if (ready) {
            return;
        }
        if (e.type === "readystatechange" && document.readyState !== "complete") {
            return;
        }
        for (var i = 0; i < funcs.length; i++) {
            funcs[i].call(document);
        }
        ready = true;
        funcs = null;
    }

    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", handler, false);
        document.addEventListener("readystatechange", handler, false);
        window.addEventListener("load", handler, false);
    }
    else if (document.attachEvent) {
        document.attachEvent("onreadystatechange", handler);
        window.attachEvent("onload", handler);
    }

    return function whenReady(f) {
        if (ready) {
            f.call(document);
        }
        else {
            funcs.push(f);
        }
    }
}());


whenReady(function() {
    var elts = document.getElementsByTagName("input");
    for (var i = 0; i < elts.length; i++) {
        var input = elts[i];
        if (input.type !== "file") {
            continue;
        }
        var url = input.getAttribute("data-uploadto");
        if (!url) {
            continue;
        }
        input.addEventListener("change", function() {
            var file = this.files[0];
            if (!file) {
                return;
            }
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.send(file);
        }, false);
    }
});
```

## multipart/form-data
> 当HTML表单同时包含文件上传元素和其他元素是, 使用 `multipart/form-data` 的 `Content-Type`
> XHR2定义了新的 `FormData API`; 使用FormData()构造函数创建FormData对象, append()方法可以多次加入File, 字符串, 或者 Blob对象, 把FormData对象传递个send()方法

```js
function postFormData(url, data, callback) {
    if (typeof FormData === "undefined") {
        throw new Error("FormData is not implemented");
    }

    var request = new XMLHttpRequest();
    request.open("POST", url);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && callback) {
            callback(request);
        }
    };
    var formdata = new FormData();
    for (var name in data) {
        if (!data.hasOwnProperty(name)) {
            continue;
        }
        var value = data[name];
        if (typeof value === "function") {
            continue;
        }
        formdata.append(name, value);       // 作为一部分添加名/值对
    }

    // send对象自动设置Content-Type对象
    request.send(formdata);
}
```

## HTTP进度事件
> 完成请求触发load事件
> 请求超时触发timeout事件
> 请求中值触发abort事件
> 太多重定这样的网络错误出啊发error事件
> 对于具体的请求,浏览器只出发load/abort/timeout/error事件中的一个

> onprogress事件有3个有用的属性
>> loaded: 目前传输的字节数
>> total: 自'Content-Length'头传输的数据的整体长度,不知道内容长度则为0
>> lengthComputable: 是否知道内容内容长度

```js
// 监控HTTP上传进度


// 查找所遇含有 fileDropTarget 类的元素
// 并注册DnD事件处理程序是的它们能响应文件的拖放
// 当文件放下时,上床它们到data-uploadto属性指定的url
whenReady(function() {
    var elts = document.getElementsByClassName("fileDropTarget");
    for (var i = 0; i < elts.length; i++) {
        var target = elts[i];
        var url = target.getAttribute("data-uploadto");
        if (!url) {
            continue;
        }
        createFileUploadDropTarget(target, url);
    }

    function createFileUploadDropTarget(target, url) {
        // 是否正在上传, 因此我们能拒绝放下
        // 我们可以处理多个并发上传
        // 但对这个例子使用进度通知太难了
        var uploading = false;
        console.log(target, url);
        target.ondragenter = function(e) {
            console.log("dragenter");
            if (uploading) {                // 如果正在忙, 忽略拖放
                return;
            }
            var types = e.dataTransfer.types;
            if (types &&
                ((types.contains && types.contains("Files")) ||
                (types.indexOf && types.indexOf("Files") !== -1))) {
                target.classList.add("wantdrop");
                return false;
            }
        };
        target.ondragover = function(e) {
            if (!uploading) {
                return false;
            }
        };
        target.ondragleave = function(e) {
            if (!uploading) {
                target.classList.remove("wantdrop");
            }
        };
        target.ondrop = function(e) {
            if (uploading) {
                return false;
            }
            var files = e.dataTransfer.files;
            if (files && files.length) {
                uploading = true;
                var message = "Uploading files:<ul>";
                for (var i = 0; i < files.length; i++)
                    message += "<li>" + files[i].name + "</li>";
                message += "</ul>";

                target.innerHTML = message;
                target.classList.remove("wantdrop");
                target.classList.add("uploading");

                var xhr = new XMLHttpRequest();
                xhr.open("POST", url);
                var body = new FormData();
                for (var i = 0; i < files.length; i++) body.append(i, files[i]);
                xhr.upload.onprogress = function(e) {
                    if (e.lengthComputable) {
                        target.innerHTML = message +
                            Math.round(e.loaded / e.total * 100) +
                            "% Complete";
                    }
                };
                xhr.upload.onload = function(e) {
                    uploading = false;
                    target.classList.remove("uploading");
                    target.innerHTML = "Drop files to upload";
                };
                xhr.send(body);

                return false;
            }
            target.classList.remove("wantdrop");
        }
    }
});
```

## 超时
> XHR2定义了timeout属性来指定请求自动终止后的毫秒数

```js
function timedGetText(url, timeout, callback) {
    var request = new XMLHttpRequest();
    var timedout = false;

    var timer = setTimeout(function() {                     //设置超时
            timedout = true;
            request.abort();
        },
        timeout);
    request.open("GET", url);
    request.onreadystatechange = function() {
        if (request.readyState !== 4) {
            return;
        }
        if (timedout) {             // 忽略终止的请求
            return;
        }
        clearTimeout(timer);
        if (request.status === 200) {
            callback(request.responseText);
        }
    };
    request.send(null);
}
```

## 跨域请求
> XHR2通过在 HTTP响应中选择发送合适的CORS允许跨域访问网站
> 如果给open()方法传入 用户名和密码, 那么它们绝不会通过跨域请求发送
> 跨域请求通常不包括任何其它用户证书: cookie和HTTP身份令牌(token)
> 设置 `withCredentials` 属性为 `true` 才能发送用户证书(不常见)

```js
// 使用 HEAD 和 CORS 请求链接的详细信息
whenReady(function() {
    // 判断是否支持跨域
    var supportsCORS = (new XMLHttpRequest()).withCredentials !== undefined;
    // 遍历文档中链接
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (!link.href) {
            continue;
        }
        // 跳过已经有工具提示的链接
        if (link.title) {
            continue;
        }
        // 如果是跨域链接
        if (link.host !== location.host || link.protocol !== location.protocol) {
            link.title = "Off-site link";
            if (!supportsCORS) {
                continue;
            }
        }

        // 注册事件处理, 当鼠标悬停是下载链接的详细信息
        if (link.addEventListener) {
            link.addEventListener("mouseover", mouseoverHandler, false);
        }
        else {
            link.attachEvent("onmouseover", mouseoverHandler);
        }
    }

    function mouseoverHandler(e) {
        var link = e.target || e.srcElement;
        var url = link.href;

        var req = new XMLHttpRequest();
        // 仅仅询问头信息
        req.open("HEAD", url);
        req.onreadystatechange = function() {
            if (req.readyState !== 4) {
                return;
            }
            if (req.status === 200) {
                var type = req.getResponseHeader("Content-Type");
                var size = req.getResponseHeader("Content-Length");
                var date = req.getResponseHeader("Last-Modified");

                link.title = "Type: " + type + "   \n" +
                    "Size: " + size + "   \n" + "Date: " + date;
            }
            else {


                if (!link.title) {
                    link.title = "Couldn't fetch details: \n" +
                        req.status + " " + req.statusText;
                }
            }
        };
        req.send(null);

        // 移除处理程序: 仅想一次获取这些头信息
        if (link.removeEventListener) {
            link.removeEventListener("mouseover", mouseoverHandler, false);
        }
        else {
            link.detachEvent("onmouseover", mouseoverHandler);
        }
    }
});
```


-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
