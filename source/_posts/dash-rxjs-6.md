---

layout: post
title: 'RxJS v6 dash 文档'
date: 2018-08-31 22:25:13
tags:
  - rxjs
  - RxJS
  - js
  - dash


---

Dash 只能找到版本为V5的 RxJS, 所以花了点时间自己构建了一个V6版本
<!-- more -->



# `rxjs6.docset`成品下载地址

[rxjs6.docset.zip](https://github.com/xinshangshangxin/dash-rxjs-6/releases)

# 代码仓库

[https://github.com/xinshangshangxin/dash-rxjs-6](https://github.com/xinshangshangxin/dash-rxjs-6)

# 原理

从 [官方文档 Any HTML Documentation](https://kapeli.com/docsets#dashDocset) 可知, 只要有 HTML, 就可以轻松构建 Dash 文档

# 步骤

## 创建文件夹 `<docset name>.docset/Contents/Resources/Documents/`

## 创建 `Info.plist` 文件 和 `icon.png`

`Info.plist` 的模板 在 [`https://kapeli.com/resources/Info.plist`](https://kapeli.com/resources/Info.plist)

## 从 [`https://rxjs-dev.firebaseapp.com/api`](https://rxjs-dev.firebaseapp.com/api) 解析有哪些 API

从 `Network` 中可以 看到 一个 `/generated/docs/api/api-list.json`的请求, 里面有每个 `API` 内容, 如下图

![api-json](/img/dash-rxjs-6/001.png)

## 创建 `SQLite Index`

将上面 `api-json` 的内容 创建到 `SQLite Index`
`CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT);`

## 创建 每个 API 的 `html` 界面

- 从 `api-json` 的内容中 有 `path` 属性, 可以请求每个界面的详细内容(`content`属性)
  ![api-json](/img/dash-rxjs-6/002.png)
- 从 [`ReactiveX/rxjs`的仓库中](https://github.com/ReactiveX/rxjs/blob/73bfa92499b9e6f7b07346f052b3eee5c1acd06d/docs_app/src/app/custom-elements/code/pretty-printer.service.ts) 发现 用了 `assets/js/prettify.js`来格式化代码, 所以相同的, 在我们创建的 html 界面中需要 prettify 来格式化代码显示, 代码如下

```js
let codeEleList = document.querySelectorAll('body code-example');
[...codeEleList].forEach((ele) => {
  let html = window.prettyPrintOne(ele.innerHTML, 'javascript', false);
  ele.innerHTML = `<aio-code>
  <pre class="prettyprint lang-javascript">
    <code class="animated fadeIn">${html}
    </code>
  </pre>
</aio-code>`;
});
```

- 由于是离线文档, 所以在 html 中所有的地址都要转化成相对路径, 代码如下

```js
let depth = location.href.replace(/.*\/api\//, '').split('/').length;
let aEleList = document.querySelectorAll('a');
[...aEleList].forEach((ele) => {
  let href = ele.href;
  if (/\/api\//.test(href)) {
    let depthStr = new Array(depth).fill('..').join('/');
    let [preUrl, anchor = ''] = href.split('#');
    ele.href = preUrl.replace(/.*\/api\//, `${depthStr}/api/`) + '.html' + '#' + anchor;
  }
});
```

## 更多具体实现请看代码

[https://github.com/xinshangshangxin/dash-rxjs-6](https://github.com/xinshangshangxin/dash-rxjs-6)

# 参考文档

- [Any HTML Documentation](https://kapeli.com/docsets#dashDocset)
- [ReactiveX/rxjs](https://github.com/ReactiveX/rxjs)
- [rxjs-dev 文档](https://rxjs-dev.firebaseapp.com/)
  <br>

---

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG 殇

