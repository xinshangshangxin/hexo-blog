---
title: Node.js中fs.rename出错Error EXDEV
date: 2015-02-24 15:19:18
tags:
- node


---

rename出错Error EXDEV由于跨磁盘分区移动或操作文件会有权限问题(默认路径是window临时目录C:\Users\ADMINI~1\AppData\Local\Temp\）
<!-- more -->




# 解决办法

> 方法一
> 在项目入口的文件（`app.js`）的顶部， 加以下这行代码

```js
process.env.TMPDIR = './temp';
// 或者
// process.env.TMPDIR = '/path/to/directory';
```

> 方法二 
> 在项目根目录路径，在`命令行`下 输入

```js
env TMPDIR=/path/to/directory node app.js
```


> 方法三 
> 利用fs的`createReadStream`、`createWriteSream`和`unlinkSync`方法

```js
var fs = require("fs"),
    util = require('util');
    ...
    
var readStream = fs.createReadStream(files.upload.path)
var writeStream = fs.createWriteStream("/tmp/test.png");

util.pump(readStream, writeStream, function() {
    fs.unlinkSync(files.upload.path);
});
```

> 方法四
> 如果使用 [formidable](https://github.com/felixge/node-formidable)

```js
var form = new formidable.IncomingForm();
form.uploadDir = dir;// 直接设置路径即可
```

