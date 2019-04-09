---
layout: post
title: koa源码解析 之 koa-compose
date: 2019-04-06 15:09:18
tags:
  - koa
  - source code
---

# [`koajs/compose`](https://github.com/koajs/compose)

`Koa` 的精粹思想就是洋葱模型(中间件模型), 它实现的核心就是借助 [`koajs/compose`](https://github.com/koajs/compose) 这个库来实现的
![](/img/koa-source-code/koa_compose/compose.png)

<!-- more -->

## 源码解析

```js
function compose(middleware) {
  // 判断 middleware 是不是数组
  if (!Array.isArray(middleware)) {
    throw new TypeError('Middleware stack must be an array!');
  }
  // 判断每一个 middleware 是 函数
  for (const fn of middleware) {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be composed of functions!');
    }
  }

  // 返回一个函数闭包
  return function(context, next) {
    // context: 贯穿整个洋葱模型的变量, 用于存储一些公用数据

    // index 是用来记录中间件函数(middleware)运行到了哪一个函数
    let index = -1;
    // 执行第一个中间件函数
    return dispatch(0);

    function dispatch(i) {
      // 判断 某个中间件 是否执行了 2次 next
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }

      index = i;

      // 获取第 i 个中间件
      let fn = middleware[i];

      // 超出 中间件的长度了, 执行之前传入的next
      if (i === middleware.length) {
        fn = next;
      }

      // 如果没有函数,直接返回空值的 Promise
      if (!fn) {
        return Promise.resolve();
      }

      try {
        // 对中间件的执行结果包裹一层Promise.resolve
        return Promise.resolve(
          fn(context, () => {
            return dispatch(i + 1);
          })
        );
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
```

## 小知识点

- `middleware` 是不可数名词, 没有复数形式...
- [`Array.isArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) 判断是否为一个数组(ES5+)
- [`for...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) 对可迭代对象进行遍历
- `typeof fn === 'function'` 可以直接判断是否是一个函数

## 多次调用 `next` 出错

```js
async function first(ctx, next) {
  console.log('1');
  await next();
  await next(); // 两次调用 next
  console.log(ctx);
}

async function second(ctx, next) {
  console.log('2');
  await next();
}

async function third(ctx, next) {
  console.log('3');
  await next();
  console.log('4');
}

const middleware = [first, second, third];

const com = compose(middleware);

com({}, function() {
  console.log('hey');
});
```

![](/img/koa-source-code/koa_compose/next-multi.png)

## 对中间件的执行结果包裹一层 Promise.resolve

[问题在这里, 希望有人能回复](https://cnodejs.org/topic/5ca3359e31010b2dfbb426c4)

# 参考文档

- [理解 Koa 的中间件机制](https://github.com/zhangxiang958/zhangxiang958.github.io/issues/34)
- [逐行分析 Koa 中间件机制](https://juejin.im/post/5c7decbbe51d454a7c5e8474)
  <br>

---

> **文章若有纰漏请大家补充指正,谢谢~~**  
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG 殇
