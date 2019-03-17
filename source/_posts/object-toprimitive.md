---
layout: post
title: '对象转原始类型'
date: 2019-02-15 20:43:14
tags:
  - js
---

对象转原始类型时, 会发生什么?

```js
let o = {
  valueOf() {
    return 0;
  },
};
console.log(+o); // 0
console.log(1 + o); // 1
console.log(1 - o); // 1
console.log('' + o); // '0'
console.log(`${o}`); // '[object Object]'
```

<!-- more -->

# 结论

1. 当操作需要一个字符串时, `hint`=`string`, 当操作需要一个数字时, `hint`=`number`, 当运算符不确定时`hint`=`default`.
2. 如果存在 `obj[Symbol.toPrimitive](hint)`, 就直接调用
3. 如果 `hint` 是 `string`, 先调用 `obj.toString()`, 没有再调用 `obj.valueOf()`
4. 如果 `hint` 是 `number`, 先调用 `obj.valueOf()`, 没有再调用`obj.toString()`
5. 如果 `hint` 是 `default`, `Date` 按照 `hint=string`处理, 其它按照 `hint=number` 处理
6. 如果 `toString` 或者 `valueOf` 返回的不是原始类型, 则忽略该调用, 转向下一个调用, 如果没有下一个调用, 则报错, 但是 `toPrimitive` 必须返回原始类型, 否则报错

# 详解

## 根据上下文, 会有以下转换 `hint`

### `string`

当操作需要一个字符串时, 对象转换的 `hint` 为 `string`.

```js
// alert(参数是字符串)
alert(obj);
confirm(obj);

// 对象的属性是字符串
anotherObj[obj] = 123;
```

### `number`

当操作需要一个数字时, 对象转换的 `hint` 为 `number`.

```js
// 明确转换成数字
Number(obj);
// 转换成数字(非加法)
+obj;
// 数学运算(加法除外)
1 - obj;
1 * obj;
1 / obj;
```

_因为历史原因大小比较的 `hint` 也是 `number`_

```js
// hint 为 number
obj1 > obj2;
```

### `default`

当运算符不确定时, 对象转换的 `hint` 为 `default`.

```js
// 比如加法, 可以是数字相加, 也可以是字符串相加
1 + obj;
'1' + obj;

// == 弱相等比较
// obj == string/number/symbol
obj == '1';
obj == 1;
```

_通常, 内置对象(除了 Date 外), `default` 转换 和 `number` 转换是相同的_
_Date 的 `default` 转换 和 `string` 相同 [Date.prototype[@@toPrimitive]](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/@@toPrimitive#Description)_

## 转换步骤

1. 如果存在 `obj[Symbol.toPrimitive](hint)`, 就直接调用
2. 如果 `hint` 是 `string`, 先调用 `obj.toString()`, 没有再调用 `obj.valueOf()`
3. 如果 `hint` 是 `number`, 先抵用 `obj.valueOf()`, 没有再调用`obj.toString()`

## example

### Symbol.toPrimitive

```ts
type primitiveType = null | undefined | number | boolean | string | symbol;
type hintType = 'string' | 'number' | 'default';

obj[Symbol.toPrimitive] = function(hint: hintType): primitiveType {
  console.log(`hint is: ${hint}`);

  return hint == 'string' ? '一个字符串' : 0;
};
```

### toString / valueOf

```ts
let user = {
  name: 'John',
  money: 1000,

  // for hint="string"
  toString(): string {
    return `{name: "${this.name}"}`;
  },

  // for hint="number" or "default"
  valueOf(): number {
    return this.money;
  },
};

alert(user); // toString -> {name: "John"}
alert(+user); // valueOf -> 1000
alert(user + 500); // valueOf -> 1500
```

```js
let obj = {
  toString() {
    return '2';
  },
};

// 加法, 调用 `default` hint, `default` 和 `number` 转换相同,
// 先调用 valueOf 方法, 因为不存在, 所以调用 toString 方法, 返回 "2"
// "2" + 2 = "22"
alert(obj + 2); // "22"

// 存在 valueOf, 所以 2+2 = 4
let obj = {
  toString() {
    return '2';
  },
  valueOf() {
    return 2;
  },
};

alert(obj + 2); // 4
```

```js
let d = new Date();
let d2 = d.getTime() - 1;

// 加法, 调用 `default` hint, Date 的 `default` 和 `string` 相同
alert(1 + d); // 1Fri Feb 15 2019 20:59:00 GMT+0800 (China Standard Time)

// 减法, 调用 `number` hint
alert(d - d2); // 1
```

# 参考文档

- [https://javascript.info/object-toprimitive](https://javascript.info/object-toprimitive)
- [Date.prototype[@@toPrimitive]](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/@@toPrimitive#Description)

---

> **文章若有纰漏请大家补充指正,谢谢~~**  
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG 殇
