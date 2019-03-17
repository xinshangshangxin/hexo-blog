---
layout: post
title: koa源码解析 之 is-generator-function
date: 2019-03-17 15:09:18
tags:
  - koa
  - source code
---

# `is-generator-function`

koa 依赖 [`is-generator-function`](https://github.com/ljharb/is-generator-function) 源码分析

![](/img/koa-source-code/is-generator-function/source-code.svg)

<!-- more -->

## `Function.prototype.toString`

从正则表达式 `/^\s*(?:function)?\*/`
![](/img/koa-source-code/is-generator-function/reg.png) 可知

1: `GeneratorFunction` 不管书写是 `function*` 还是 `function *` 在 `Function.prototype.toString` 之后为 `function*`

> **注意**
> 在 `ES2019` 的 [Function.prototype.toString revision](https://github.com/tc39/Function-prototype-toString-revision) 已经开始返回原始内容, 包含空格

`function * fn() {}`
`Function.prototype.toString.call(fn);`  
 node < 10, 输出 `function* fn() {}`  
 node >=10, 输出 `function * fn() {}`

2: `function` 可选是因为对象简写语法

```js
var o = {
  *fn() {},
};

// *fn() {}
console.info(Function.prototype.toString.call(o.fn));
```

## `Object.prototype.toString` 获取类型在 `ES2015` 后不可靠

```js
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

if (!hasToStringTag) {
  var str = toStr.call(fn);
  return str === '[object GeneratorFunction]';
}
```

ES2015 提供了 [`[Symbol.toStringTag]`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag) 修改 `Object.prototype.toString()` 返回的类型标签

```js
function* fn() {}

Object.defineProperty(fn, Symbol.toStringTag, {
  get() {
    return 'MyTag';
  },
});

// [object MyTag]
console.log(Object.prototype.toString.call(fn));
```

## 获取 `GeneratorFunction` 原型

通过 `Function` 构造一个 `GeneratorFunction`, 通过 `Object.getPrototypeOf` 获得原型

```js
var getProto = Object.getPrototypeOf;
var generatorFunc = Function('return function*() {}')();
var GeneratorFunction = getProto(generatorFunc);
```

# 参考文档

- [is-generator-function](https://github.com/ljharb/is-generator-function)
- [Function-prototype-toString-revision](https://tc39.github.io/Function-prototype-toString-revision/)
  <br>

---

> **文章若有纰漏请大家补充指正,谢谢~~**  
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG 殇
