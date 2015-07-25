title: fiddler学习笔记
date: 2015-03-11 15:46:48
description: 慕课网fiddler学习以及部分补充说明
tags:
- fiddler
---


# fiddler视频教程

> [慕课网fiddler视频教程](http://www.imooc.com/learn/37)

# 添加ServerIP

> 快捷键Ctrl+R  或者  菜单->Rules->Customize Rules…

在`CustomRules.js`文件里`Ctrl+F`查找字符串
```js
static function Main()
```

> 添加一行代码即可显示IP

```js
FiddlerObject.UI.lvSessions.AddBoundColumn("ServerIP", 120, "X-HostIP");
```

结果如下所示:
```js
static function Main() {
        var today: Date = new Date();
        
        FiddlerObject.StatusText = " CustomRules.js was loaded at: " + today;

        //添加显示 ServerIP
        FiddlerObject.UI.lvSessions.AddBoundColumn("ServerIP", 120, "X-HostIP");

        // Uncomment to add a "Server" column containing the response "Server" header, if present
        // UI.lvSessions.AddBoundColumn("Server", 50, "@response.server");

        // Uncomment to add a global hotkey (Win+G) that invokes the ExecAction method below...
        // UI.RegisterCustomHotkey(HotkeyModifiers.Windows, Keys.G, "screenshot"); 
    }
```

# 图标代表含义
![](/img/fiddler/meaning.png)

# 使用Fiddler调试手机页面请求

[http://i.wanz.im/2013/04/30/debugging_http_request_with_fiddler/](http://i.wanz.im/2013/04/30/debugging_http_request_with_fiddler/)
 
# fiddler 不支持视频最后讲的 Willow

# 参考资料:
[http://www.xuanfengge.com/fiddler-displays-the-set-ip-method.html](http://www.xuanfengge.com/fiddler-displays-the-set-ip-method.html)
[http://tid.tenpay.com/?p=3011](http://tid.tenpay.com/?p=3011)

-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
