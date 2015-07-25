title: JavaScript权威指南笔记3
date: 2015-04-03 22:23:37
description: JavaScript权威指南笔记150403
tags:
- js
---


## 对象 `P120`

> 通过`对象直接量`,`关键字new`,`Object.create()`(*ECMAScript 5*)创建对象
> `Object.create(null)`创建一个没有原型的对象;但它不会继承任何东西,包括`toString()`等基础方法;也就是说,它不能和`+`运算符一起工作
> 创建一个普通的空对象

```js
var o = Object.create(Object.prototype);
```

```js
/**
 * /**
 * 兼容ECMAScript 5
 * 返回一个继承自原型对象p的属性的新对象
 * @param p 要继承原型对象
 * @returns {*} 新对象
 */
function inherit(p) {
    if (p == null) {
        throw  TypeError();
    }
    if (Object.create) {
        return Object.create(p);
    }
    var t = typeof p;
    if (t !== 'object' && t != 'function') {
        throw  TypeError();
    }

    function f() {}
    f.prototype = p;
    return new f();
}
```

## 属性访问错误 `P127`
> 下列场景给对象o设置属性p失败
>> o中的熟悉p是只读的
>> o中的属性p是继承属性,并且它是只读的
>> o没有使用setter方法继承属性p;并且o的可扩展性是false


## 删除属性 `P127`
> `delete`运算符只能删除自有属性,不能删除继承属性

```js
var a = {
    p: {
        x: 1
    }
};
var b = a.p;
delete a.p;
console.log(b.x); // 1
```
> 由于已经删除的属性的引用依然存在,在某些不严谨的代码中可能造成内存泄漏
> 在销毁对象的时候,要遍历属性中的属性,依次删除

> delete表达式删除成功或没有任何副作用(如删除不存在的属性)或delete后不是一个属性访问表达式,delete 返回true

```js
var o = {x: 1};
delete o.x;   // 删除x;返回true
delete o.x;   // 什么也不做(x不存在); 返回true
delete o.toString; // 什么也不做(toString是继承来的); 返回true
delete o.1      // 无意义,返回true
```

## 检测属性

### 检测: 属性名(字符串) in 对象; 
> 如果对象的自有属性或者继承属性包含这个属性则返回true
> `hasOwnProperty()` 检测是否是对象的自有属性
> `propertyIsEnumerable()` 检测自有属性并且是可枚举的

### !== 判断一个属性是否为 `undefined`
```js
var o = {
    x: 1
};

console.log(o.x !== undefined); //true: o中属性x
console.log(o.y !== undefined); // false: o中没有属性y
console.log(o.toString !== undefined); // true: o继承了toString属性
```



### `in` 和 `!==` 和 `!=`
> in 可以区分不存在的属性和存在但是值为undefined的属性

```js
var o = {
    x: undefined
};

console.log(o.x !== undefined); // false: 属性存在,值为false
console.log(o.y !== undefined); // false: 属性不存在
console.log('x' in o);          // true: 属性存在
console.log('y' in o);          // false; 属性不存在
```
> `!==`区分 `undefined` 和  `null`

```js
// x的值不是null或undefined
if (x != null) {
}
// x的值不是 null undefined false '' 0 NaN
if (x) {
}
```

## 枚举属性
> got/in遍历可枚举属性(自有属性和继承属性)
> `ECMAScript 5` 中:
>> `Object.keys()` 返回可枚举的自有属性的名称数组
>> `Object.getOwnPropertyNames()` 返回所有自有属性的名称数组



## `getter` 和 `setter`
> 定义存储器的属性使用一个或两个和属性同名的函数,使用 `get` 和 `set` 关键字
> 函数体内的 `this` 指向这个对象
> 存取器属性是可以继承的

```js
// 直角坐标系定义
var p = {
    x : 1.0,        // x和y为普通的可读写的数据属性
    y: 1.0,

    // r  是可读写的存取器属性, 有 getter 和 setter
    get r() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    set r(newValue) {
        var oldValue = Math.sqrt(this.x * this.x + this.y * this.y);
        var ratio = newValue / oldValue;
        this.x *= ratio;
        this.y *= ratio;
    },

    // theat角度 是只读存取器属性, 它只有getter方法
    get theta() {
        return Math.atan2(this.y, this.x);
    }
};
```

## 属性的特性
> 数据属性的4个特性: 
>> `value` (它的值) `writable` (可写性) `enumerable` (可枚举性) `configurable` (可配性)

> 存取器属性的4个特性:
>> `get` (读取) `set`(写入) `enumerable` (可枚举性) `configurable` (可配性)

> `Object.getOwnPropertyDescriptor()` 获取某个对象特定的属性描述符
> 只能得到自有属性的描述符;对于继承属性和不存在的属性,返回 `undefined`

```js
console.log(Object.getOwnPropertyDescriptor(p, 'r'));
/*{
    get: [Function: r],
    set: [Function: r],
    enumerable: true,
    configurable: true
}*/

console.log(Object.getOwnPropertyDescriptor({}, 'x'));  // undefined 没有这个属性
console.log(Object.getOwnPropertyDescriptor({}, 'toString')); // undefined 继承属性
```

> `Object.defineProperty()` 设置属性的特性或新建属性特性
> 只能修改自有属性,不能修改继承属性
> 返回修改后的对象

```js
var o = {};
// 添加一个不可枚举的属性x,赋值为1
Object.defineProperty(o, 'x', {
    value : 1,
    writable: true,
    enumerable: false,
    configurable: true
});

// 属性存在但是不可枚举
console.log(o.x);  //1
console.log(Object.keys(o)); // []

// 对属性x做修改,变成只读
Object.defineProperty(o, 'x', {
    writable: false
});

// 试图修改
o.x = 2; // 操作失败但是不报错; 严格模式中抛出类型错误异常
console.log(o.x);   // 1

// 属性可配置,所以可以使用defineProperty修改值
Object.defineProperty(o, 'x', {
    value: 2
});
console.log(o.x);  // 2

// 从数据属性改为存取器属性
Object.defineProperty(o, 'x', {
    get: function() {
        return 0;
    }
});
console.log(o.x); // 0

// 没有set方法
o.x = 2;
console.log(o.x); // 0
```

> `Object.defineProperties()` 同时修改多个属性
> 返回修改后的对象

```js
var p = Object.defineProperties({},{
    x: {
        value: 1,
        writable: true,
        enumerable: false,
        configurable: true
    },
    y: {
        value: 2,
        writable: true,
        enumerable: true,
        configurable: true
    }
});
```

## `Object.defineProperty()` `Object.defineProperties()` 抛出类型错误异常
> 1. 如果对象是不可扩展的,则可以编辑已有的自有属性,但不能给它添加新属性
> 2. 如果属性是不可配置的, 则不能修改它的可配置性和可枚举性
> 3. 如果存取器属性是不可配置的,则不能修改其 `getter` 和 `setter` 方法,也不能将它转换为数据属性
> 4. 如果数据属性是不可配置的, 则不能将它转换为存取器属性
> 5. 如果数据属性是不可配置的, 则不能将它的可写性从 `false` 设置为 `true`, 但是可以从 `true` 修改为 `false`
> 6. 如果数据属性是不可配置的且不可写的, 则不能修改它的值;
> 7. 如果数据属性是可配置的但不可写,属性的值是可以修改的(标记为可写->修改它的值->转换为不可写)

## 复制属性的特性
```js
/**
 * 给Object.prototype 添加一个不可枚举的extend()方法
 * 这个方法继承自调用它的对象,将作为参数传入对象的属性一一复制
 * 除了值之外,也复制了属性的所有特性,除非在目标对象中存在同名的属性,
 * 参数对象的所有自有对象(包括不可枚举的属性)也会一一复制
 */
Object.defineProperty(Object.prototype, 'extend', {
    writable: true,
    enumerable: false, //不可枚举
    configurable: true,
    value: function(o) {   // 值就是这个函数
        // 得到所有的自由属性,包括不可枚举属性
        var names = Object.getOwnPropertyNames(o);

        for (var i = 0; i < names.length; i++) {
            // 属性存在则跳过
            if (names[i] in this) {
                continue;
            }
            // 获取o中的属性的描述符
            var desc = Object.getOwnPropertyDescriptor(0, names[i]);
            // 用它给this创建一个属性
            Object.defineProperty(this, names[i], desc);
        }
    }
});
```

## 对象的三个属性
### 原型属性
> 我们经常把 `o的原型属性` 直接叫做 `o的原型`
> 通过 `new` 创建的对象使用构造函数的 `prototype` 属性作为它们的原型
> 通过 `Object.reate()` 创建的对象使用第一个参数作为它们的原型
> `Object.getPrototypeOf()` 查询原型
> `p.isPrototypeOf(o)` 检测 p 是否是 o 的原型

### 类属性

> 表示对象的类型信息([object class])

```js
function classof(o) {
    if (o === null) {
        return 'Null';
    }
    else if (o === undefined) {
        return 'Undefined';
    }
    return Object.prototype.toString.call(o).slice(8, -1);
}
```

### 可扩展性
> `Object.isExtensible()` 判断是否可扩展
> `Object.preventExtensions()` 将对象转换为不可扩展 **无法再转换为可扩展**
> `Object.seal()` 将对象设置为不可扩展,将所有自有属性都设置为不可配置;即不能给这个对象添加新属性,而且它已有的属性也不能删除或配置,不过它已有的可写属性依然可以设置
> `Object.isSealed()` 检测是否已经封闭(sealed)
> `Object.freeze()` 冻结对象, 将对象设置为不可扩展, 将其属性设置为不可配置, 将它自有的所有数据属性设置为只读(如果对象的存取器属性具有setter方法,存取器属性将不受影响,仍可以通过给属性赋值调用)
> `Object.isFrozen()` 检测对象是否冻结

## 序列化对象
> ECMAScript 5 提供`JSON.stringify()` 和 `JSON.parse()`
> `NaN` `Infinity` `-Infinity` 序列化的结果是 `null`
> 日期对象序列化的结果是ISO格式的日期字符串
> 函数 RegExp Error对象 和 undefined值不能序列化和还原
> `JSON.stringify()` 只能序列化对象的可没据的自有属性
> 不能序列化的在序列化的输出字符串中会将这个属性省略掉


-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
