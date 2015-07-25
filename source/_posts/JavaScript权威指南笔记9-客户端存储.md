title: "JavaScript权威指南笔记9_客户端存储"
date: 2015-05-06 20:16:06
description:  JavaScript权威指南笔记9_客户端存储
tags:
- js
---

## localStorage 和 sessionStorage
> `localStorage` 仅支持存储字符串
> `localStorage` 存储是永久的;除非web引用刻意删除,或者用户通过浏览器配置删除
> `localStorage` 作用域限定在文档源级别(协议;主机名;端口)

> `sessionStorage` 存储数据的脚本所在的 最顶层的窗口/浏览器标签页 的有效期
> `sessionStorage` 作用域限定在文档源级别(协议;主机名;端口)
> 如果一个浏览器标签页包含2个 `<iframe>` 元素, 它们可以共享 `sessionStorage`

## 存储API
```js
setItem()
getItem()
removeItem()
clear()
```

## 存储事件
> 在 `localStorage` 或 `sessionStorage` 的数据发生改变,浏览器都会在其他对该数据可见的窗口对象上出发存储事件(不会在对数据进行改变的窗口对象上触发)
> 如果2个标签页打开了来自同源的页面,其中一个页面在 `localStorage` 上存储了数据,那么另外一个标签页会接受到一个存储事件
> 对 `sessionStorage` 限制在顶层窗口,所以对 `sessionStorage` 的改变只有当有牵连的窗口触发是才会触发存储事件
> 对已经存在的存储项设置一个一模一样的值,抑或是删除一个本来就不存在的存储项是不会触发事件的



## cookie
> `cookie` 的作用域是通过 文档源和文档路径 来确定的
> `cookie` 的值不可以包含分号,逗号,空白符, 因此需要 `encodeURIComponent` 进行编码

```js
// 基于cookie的存储API
function CookieStorage(maxage, path) {
    // 获取一个存储全部cookie的对象
    var cookies = (function() {
        var cookies = {};
        var all = document.cookie;
        if (all === "") {
            return cookies;
        }
        // 分离出名/值对
        var list = all.split("; ");
        // 遍历每个cookie
        for (var i = 0; i < list.length; i++) {
            var cookie = list[i];
            var p = cookie.indexOf("=");
            // 获取cookie的名字
            var name = cookie.substring(0, p);
            // 获取cookie对应的值
            var value = cookie.substring(p + 1);
            // 解码
            value = decodeURIComponent(value);
            cookies[name] = value;
        }
        return cookies;
    }());


    // 将所有的cookie存储到一个数组中
    var keys = [];
    for (var key in cookies) {
        keys.push(key);
    }

    // 定义存储API的公共方法和属性

    // 存储cookie 的个数
    this.length = keys.length;

    // 返回第N个cookie的名字, N越界返回null
    this.key = function(n) {
        if (n < 0 || n >= keys.length) {
            return null;
        }
        return keys[n];
    };

    // 返回指定cookie的名字,如果不存在返回NULL
    this.getItem = function(name) {
        return cookies[name] || null;
    };

    // 存储cookie
    this.setItem = function(key, value) {
        // 如果要存储的cookie还不存在
        if (!(key in cookies)) {
            // 加入数组
            keys.push(key);
            // 长度加一
            this.length++;
        }

        // 将名/值存储到cookies对象中
        cookies[key] = value;

        // 设置cookie
        var cookie = key + "=" + encodeURIComponent(value);
        // 添加 maxage
        if (maxage) {
            cookie += "; max-age=" + maxage;
        }
        // 添加path
        if (path) {
            cookie += "; path=" + path;
        }

        // 设置document.cookie
        document.cookie = cookie;
    };

    // 删除指定的cookie
    this.removeItem = function(key) {
        if (!(key in cookies)) {
            return;
        }

        // 删除内部cookies的指定cookie
        delete cookies[key];

        // 从数组中删除
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === key) {
                keys.splice(i, 1);
                break;
            }
        }
        this.length--;
        // 通过设置有效期为0来删除cookie
        document.cookie = key + "=; max-age=0";
    };

    // 删除所有cookie
    this.clear = function() {
        for (var i = 0; i < keys.length; i++) {
            document.cookie = keys[i] + "=; max-age=0";
        }
        cookies = {};
        keys = [];
        this.length = 0;
    };
}
```

## 应用程序缓存清单
> 注释 以 `#` 开头,后面跟一个空字符
> 应用程序缓存清单文件约定一.appcahe作为文件扩展名.但是web服务器怔怔识别清单文件的方式是通过 `text/cache-mainfest` 这个 `MIME`类型
> 浏览器在更新缓存过程中会触发一系列事件
>> 1. 没有可用的更新,触发 `noupdate` 
>> 2. 有可用的更新触发 `downloading`, 下载过程触发 `progress` 和 下载完成触发 `updateready`
>> 3. 首次载入新的应用程序 `downloading`, 下载过程触发 `progress`, 下载完成后触发 `cached`
>> 4. 浏览器处于离线状态触发 `error`
>> 5. 清单文件不存在:
>>> - 未缓存的应用程序触发 `error`
>>> - 应用程序已经缓存并且浏览器处于在线状态触发 `obsolete`, 并且将该应用从缓存中移除

```js
// 处理应用缓存的相关事件
function status(msg) {
    document.getElementById("statusline").innerHTML = msg;
    console.log(msg);
}
window.applicationCache.onchecking = function() {
    status("Checking for a new version.");
    return false;
};
window.applicationCache.onnoupdate = function() {
    status("This version is up-to-date.");
    return false;
};
window.applicationCache.ondownloading = function() {
    status("Downloading new version");
    window.progresscount = 0;
    return false;
};
window.applicationCache.onprogress = function(e) {
    var progress = "";
    if (e && e.lengthComputable) {
        progress = " " + Math.round(100 * e.loaded / e.total) + "%"
    }
    else {
        progress = " (" + ++progresscount + ")"
    }
    status("Downloading new version" + progress);
    return false;
};
window.applicationCache.oncached = function() {
    status("This application is now cached locally");
    return false;
};
window.applicationCache.onupdateready = function() {
    status("A new version has been downloaded.  Reload to run it");
    return false;
};
window.applicationCache.onerror = function() {
    status("Couldn't load manifest or cache application");
    return false;
};
window.applicationCache.onobsolete = function() {
    status("This application is no longer cached. " +
        "Reload to get the latest version from the network.");
    return false;
};
```


## 离线web应用
> 通过 `navigator.onLine` 来检测浏览器是否在线

```js
// permanote.js
var editor, statusline, savebutton, idletimer;
window.onload = function() {
    
    if (localStorage.note == null) {
        localStorage.note = "";
    }
    if (localStorage.lastModified == null) {
        localStorage.lastModified = 0;
    }
    if (localStorage.lastSaved == null) {
        localStorage.lastSaved = 0;
    }
    editor = document.getElementById("editor");
    statusline = document.getElementById("statusline");
    savebutton = document.getElementById("savebutton");
    editor.value = localStorage.note;
    editor.disabled = true;
    editor.addEventListener("input",
        function(e) {

            localStorage.note = editor.value;
            localStorage.lastModified = Date.now();

            if (idletimer) {
                clearTimeout(idletimer);
            }
            idletimer = setTimeout(save, 5000);

            savebutton.disabled = false;
        },
        false);
    sync();
};
window.onbeforeunload = function() {
    if (localStorage.lastModified > localStorage.lastSaved) {
        save();
    }
};
window.onoffline = function() {
    status("Offline");
}
window.ononline = function() {
    sync();
};
window.applicationCache.onupdateready = function() {
    status("A new version of this application is available. Reload to run it");
};
window.applicationCache.onnoupdate = function() {
    status("You are running the latest version of the application.");
};
function status(msg) {
    statusline.innerHTML = msg;
}
function save() {
    if (idletimer) {
        clearTimeout(idletimer);
    }
    idletimer = null;
    if (navigator.onLine) {
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", "/note");
        xhr.send(editor.value);
        xhr.onload = function() {
            localStorage.lastSaved = Date.now();
            savebutton.disabled = true;
        };
    }
}
function sync() {
    if (navigator.onLine) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/note");
        xhr.send();
        xhr.onload = function() {
            var remoteModTime = 0;
            if (xhr.status == 200) {
                var remoteModTime = xhr.getResponseHeader("Last-Modified");
                remoteModTime = new Date(remoteModTime).getTime();
            }
            if (remoteModTime > localStorage.lastModified) {
                status("Newer note found on server.");
                var useit =
                    confirm("There is a newer version of the note\n" +
                        "on the server. Click Ok to use that version\n" +
                        "or click Cancel to continue editing this\n" +
                        "version and overwrite the server");
                var now = Date.now();
                if (useit) {
                    editor.value = localStorage.note = xhr.responseText;
                    localStorage.lastSaved = now;
                    status("Newest version downloaded.");
                }
                else {
                    status("Ignoring newer version of the note.");
                }
                localStorage.lastModified = now;
            }
            else {
                status("You are editing the current version of the note.");
            }
            if (localStorage.lastModified > localStorage.lastSaved) {
                save();
            }
            editor.disabled = false;
            editor.focus();
        }
    }
    else {
        status("Can't sync while offline");
        editor.disabled = false;
        editor.focus();
    }
}
```


-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
