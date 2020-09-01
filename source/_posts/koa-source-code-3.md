---
layout: post
title: 'koa 源码解析 之 koajs/koa (一)'
date: 2019-04-10 19:09:18
tags:
  - koa
  - source code
---

[`koajs/koa`](https://github.com/koajs/koa) 结构很简单, `lib` 下只有 4 个文件 `application.js`, `context.js`, `request.js`, `response.js`, 本文分析 `application.js`

<!-- more -->

## 源码解析

### 入口文件

从 `package.json` 的 `"main": "lib/application.js"` 可知, 入口文件是 `application.js`

### `application.js` / `constructor`

```js
// 继承自 EventEmitter
class Application extends Emitter {
  constructor() {
    super();

    // 是否设置了代理, 用于后面 request.js 中 get ips()
    this.proxy = false;
    // 中间件
    this.middleware = [];
    // 子域名偏移量, 比如 a.b.example.com 域名
    // 如果设置为 2, 那么返回的数组值为 ["b", "a"]
    // 如果设置为 3, 那么返回数组值为 ["a"]
    // 具体在代码 request.js 的 get subdomains() {
    this.subdomainOffset = 2;

    this.env = process.env.NODE_ENV || 'development';

    // 单开一篇文章分析 context/request/response
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);

    // Symbol.for('nodejs.util.inspect.custom')
    // 如果存在自定义的 util.inspect.custom, 当调用 util.inspect 返回字符串表示, 改变返回的字符串
    if (util.inspect.custom) {
      this[util.inspect.custom] = this.inspect;
    }
  }
}
```

### `application.js` / `listen`

```js
listen(...args) {
  debug('listen');
  // 调用 nodejs 原生 http.createServer([options][, requestlistener])
  // 这里的 this.callback() 是 requestlistener
  const server = http.createServer(this.callback());
  // 监听
  return server.listen(...args);
}
```

### `application.js` / `callback`

```js
callback() {
  // 使用 compose 建立中间件处理, 详情请看 https://blog.xinshangshangxin.com/2019/04/06/koa-source-code-2/
  const fn = compose(this.middleware);

  // 如果没有监听 error, 使用默认监听
  if (!this.listenerCount('error')) {
    this.on('error', this.onerror)
  };

  // handleRequest 就是 this.callback()的返回值
  // 也就是 http.createServer(requestlistener) 的 requestlistener
  const handleRequest = (req, res) => {
    // 每次一个请求进来, 创建一个新的 context
    const ctx = this.createContext(req, res);
    // 见下面 `application.js` / `handleRequest`
    return this.handleRequest(ctx, fn);
  };

  return handleRequest;
}
```

### `application.js` / `createContext`

```js

createContext(req, res) {
  // 将 原生的 req, res 附加到 context 对象上

  // Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
  const context = Object.create(this.context);
  const request = context.request = Object.create(this.request);
  const response = context.response = Object.create(this.response);
  context.app = request.app = response.app = this;
  context.req = request.req = response.req = req;
  context.res = request.res = response.res = res;

  request.ctx = response.ctx = context;
  request.response = response;
  response.request = request;

  context.originalUrl = request.originalUrl = req.url;
  context.state = {};
  return context;
}
```

### `application.js` / `handleRequest`

```js
handleRequest(ctx, fnMiddleware) {
  const res = ctx.res;
  res.statusCode = 404;
  // 错误处理
  const onerror = err => ctx.onerror(err);
  // 响应处理
  const handleResponse = () => respond(ctx);
  // TODO 单开一篇文章
  onFinished(res, onerror);

  // fnMiddleware 就是 koajs/compose 处理后的函数
  // 先 经过中间件处理, 然后 用 `respond` 处理, 失败则 onerror 处理
  return fnMiddleware(ctx).then(handleResponse).catch(onerror);
}

```

### `application.js` / `respond`

**根据不同类型的数据对 `http` 的响应头部与响应体 `body` 做对应的处理**

```js
function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  // 检查是否是可写流
  if (!ctx.writable) {
    return;
  }

  const res = ctx.res;
  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  // 如果响应的 statusCode 是属于 body 为空的类型, 例如 204, 205, 304, 将 body 置为 null
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ('HEAD' == ctx.method) {
    // headersSent 是 Node 原生的 response 对象上的, 标记 http 响应头部是否已经被发送
    if (!res.headersSent && isJSON(body)) {
      // 如果头部未被发送, 那么添加 length 头部
      // Buffer.byteLength 获得字符串的 byte 长度
      // 比如 äáöü, 4 characters(str.length), 8 bytes (Buffer.byteLength)
      ctx.length = Buffer.byteLength(JSON.stringify(body));
    }
    return res.end();
  }

  // status body
  // 如果 body 值为空
  if (null == body) {
    // message.httpVersionMajor is the first integer and message.httpVersionMinor is the second.
    // 客户端发送的 HTTP 版本 主版本号
    if (ctx.req.httpVersionMajor >= 2) {
      body = String(code);
    } else {
      // body 值为 context 中的 message 属性或 code
      body = ctx.message || String(code);
    }
    if (!res.headersSent) {
      // 修改头部的 type 与 length 属性
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  // 对 body 为 buffer 类型的进行处理
  if (Buffer.isBuffer(body)) {
    return res.end(body);
  }
  // 对 body 为字符串类型的进行处理
  if ('string' == typeof body) {
    return res.end(body);
  }
  // 对 body 为流形式的进行处理
  if (body instanceof Stream) {
    return body.pipe(res);
  }

  // body: json
  // 对 body 为 json 格式的数据进行处理
  // 将 body 转化为 json 字符串
  // 添加 length 头部信息
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}
```

### `application.js` / `onerror`

```js
onerror(err) {
  // 把 error 转换成 Error 对象并抛出
  if (!(err instanceof Error)) {
    throw new TypeError(util.format('non-error thrown: %j', err))
  };

  if (404 == err.status || err.expose) {
    return;
  }

  // 不输出任何内容
  if (this.silent) {
    return;
  }

  // 对错误进行 日志输出
  const msg = err.stack || err.toString();
  console.error();
  console.error(msg.replace(/^/gm, '  '));
  console.error();
}
```

### `application.js` / `toJSON` 和 `inspect`

```js
// 当调用类似 JSON.stringify 时 如何格式化
toJSON() {
  // only 相当于 lodash.pick
  return only(this, [
    'subdomainOffset',
    'proxy',
    'env'
  ]);
}

// 当没有 util.inspect.custom 的时候
inspect() {
  return this.toJSON();
}
```

# 参考文档

- [koa 源码解析](https://github.com/zhangxiang958/zhangxiang958.github.io/issues/35)
- [How to get the string length in bytes in nodejs?](https://stackoverflow.com/questions/9864662/how-to-get-the-string-length-in-bytes-in-nodejs)

  <br>

---

> **文章若有纰漏请大家补充指正,谢谢~~**  
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG 殇
