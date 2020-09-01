---
layout: post
title: 'koa 源码解析 之 jshttp/on-finished'
date: 2019-04-11 19:09:18
tags:
  - koa
  - source code
---

[`jshttp/on-finished`](https://github.com/jshttp/on-finished) 当一个请求关闭(`closes`),完成(`finishes`) 或者 抛出错误(`errors`) 时, 执行回调

<!-- more -->

# 参考文档

- [koa 源码分析](https://github.com/iliuyt/blog/issues/19)
- [[Node.js] 十步完成Koa2框架源码阅读](https://github.com/LouisWT/Blog/issues/1)
  <br>

---

> **文章若有纰漏请大家补充指正,谢谢~~**  
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG 殇
