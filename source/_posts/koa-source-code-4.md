---
layout: post
title: 'koa 源码解析 之 koajs/koa (二)'
date: 2019-04-11 19:09:18
tags:
  - koa
  - source code
---

[`koajs/koa`](https://github.com/koajs/koa) 结构很简单, `lib` 下只有 4 个文件 `application.js`, `context.js`, `request.js`, `response.js`. 本文分析 `context.js`, `request.js`, `response.js`

<!-- more -->

# 参考文档

- [koa 源码解析](https://github.com/zhangxiang958/zhangxiang958.github.io/issues/35)
  <br>

---

> **文章若有纰漏请大家补充指正,谢谢~~**  
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG 殇
