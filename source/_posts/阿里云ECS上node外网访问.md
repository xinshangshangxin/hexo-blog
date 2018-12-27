---
title: 阿里云ECS上node外网访问
date: 2015-03-03 18:32:59
tags:
- ECS
- node


---

借了个阿里云的账号,外网访问nodejs遇到问题,做下记录...
<!-- more -->




> 原来是这么写的: 

```js
http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end('Hello Aliyun Node.js\n');
}).listen(80,"127.0.0.1");
```

> 提示出错,原因是80端口被占用,可以使用8888等端口

> 使用`ECS外网IP:8888` 访问发现无法打开
[这篇文章](http://www.aboutit.cn/post/598)是这么做的:

```js
　createServer(...).listen(8888,"阿里云ECS外网IP");
```

> 但是在我这里失败了;
接着[这篇文章](http://www.haodaima.net/art/2657330)说: `启动NodeJs的侦听进程时，需要侦听所有IP（0.0.0.0）`

```js
createServer(...).listen(8888,"0.0.0.0");
```

> 成功了~~~

> 完整测试例子

```js
var http = require('http');

http.createServer(function(req, res) {
  res.writeHead(200, {
      'Content-Type': 'text/plain'
    }
  );
  res.end('Hello Aliyun Node.js\n');
}).listen(8888, "0.0.0.0");

console.log('NodeJS Server running at http://0.0.0.0:8888');
```

# 参考文档
1. [http://www.aboutit.cn/post/598](http://www.aboutit.cn/post/598)
2. [http://www.haodaima.net/art/2657330](http://www.haodaima.net/art/2657330)


