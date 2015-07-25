title: JavaScript权威指南笔记4_数组
date: 2015-04-07 20:03:36
description: JavaScript权威指南笔记4_数组150407
tags:
- js
---

> 如果省略数组直接量的某个值,省略的元素被赋予 `undefined`

```js
var a = [1, 2, 3, , 5];
console.log(a.length + '\n' + a);
// 5
// 1,2,3,,5
```

> 数组直接量允许有可选的结尾逗号

```js
var b = [,,];
console.log(b.length); // 2  不是3!
```

> 可以使用负数或非整数,但是数值转换为字符串,作为对象属性

```js
var b = [];
b[-1.23] = -1;
console.log(b['-1.23']); // -1
```
> 如果使用了非负整数的字符串,字符串转换为数组索引,而非对象属性

```js
var b = [];
b['1'] = 1;
console.log(b[1]); // 1
```

> for/in 循环可以以不同的顺序遍历对象的属性;即数组元素遍历不一定是升序的

# 数组方法

> `join()` 将数组中的所有元素转换为字符串拼接

```js
var a = [1, 2, ['a', 'b']];
console.log(a.join()); // 1,2,a,b
console.log(a.join('-')); // 1-2-a,b
```

> `reverse()` 将数组中的元素颠倒顺序,返回逆序数组
> **修改原数组**

```js
var a = [1, 2, ['a', 'b']];
console.log(a.reverse()); // [ [ 'a', 'b' ], 2, 1 ]
console.log(a);          // [ [ 'a', 'b' ], 2, 1 ]
```

> `sort()` 将数组中的元素排序并返回排序后的数组
> 不带参数时,数组元素以字母表顺序排序
> 如果数组包含 `undefined` 元素,会被排到数组尾部
> **修改原数组**

```js
var a = [undefined, 2, 1, ['a', 'b'], [1, 2]];
console.log(a.sort());  //[ 1, [ 1, 2 ], 2, [ 'a', 'b' ], undefined ]
console.log(a);         //[ 1, [ 1, 2 ], 2, [ 'a', 'b' ], undefined ]
```
```js
var a = [1, 2, 3, 4];
console.log(a.sort(function(a, b) {
    return b - a;    // 从大到小
}));
console.log(a);         // [ 4, 3, 2, 1 ]
```



> `concat([ item1 [ , item2 [ , … ] ] ])` 当以零或更多个参数 item1, item2, 等等，调用 concat 方法，返回一个数组，这个数组包含对象的数组元素和后面跟着的每个参数按照顺序组成的数组元素
> **concat 不会扁平化数组**
> **concat 不会修改原数组**

```js 
var a = [1, 2, 3];
var b = [[4, 5], [6,7]];

console.log(a.concat(4, 5, 6));  // [ 1, 2, 3, 4, 5, 6 ]
console.log(a.concat(b));       // [ 1, 2, 3, [ 4, 5 ], [ 6, 7 ] ]
console.log(a);                 // [ 1, 2, 3 ]
console.log(b);                 // [ [ 4, 5 ], [ 6, 7 ] ]
```



> `slice(start, end)` 返回一个数组，这个数组包含从第 start 个元素到 -- 但不包括 -- 第 end 个元素 ( 或如果 end 是 undefined 就到数组末尾 )。如果 start 为负，它会被当做是 length+start，这里的 length 是数组长度。如果 end 为负，它会被当做是 length+end，这里的 length 是数组长度。
> **slice 不会修改原数组**

```js
var a = [1, 2, 3, 4, 5];

console.log(a.slice(1, 3));     //[ 2, 3 ]
console.log(a.slice(1));        // [ 2, 3, 4, 5 ]
console.log(a.slice(1, -1));    // [ 2, 3, 4 ]
console.log(a.slice(-3, -2));   // [ 3 ]
console.log(a.slice(-2, -3));   // []
console.log(a);                 // [ 1, 2, 3, 4, 5 ]
```

> `splice(start, deleteCount [,item1[, item2 [, … ] ] ])` 从数组索引 start 开始的 deleteCount 个数组元素会被替换为参数 item1, item2, 等等,返回被删除的元素,如果deleteCount省略,则从start到结束的所有元素都将删除
> **splice会修改原数组**

```js
var a = [1, 2, 3, 4, 5];

console.log(a.splice(1));           // [ 2, 3, 4, 5 ]
console.log(a);                     // [ 1 ]
a = [1, 2, 3, 4, 5];
console.log(a.splice(1, 2));        // [ 2, 3 ]
console.log(a);                     // [ 1, 4, 5 ]
a = [1, 2, 3, 4, 5];
console.log(a.splice(1, 2, 'add0', 'add1'));  // [ 2, 3 ]
console.log(a);                     // [ 1, 'add0', 'add1', 4, 5 ]
```

> `push( [ item1 [ , item2 [ , … ] ] ])`  将参数以他们出现的顺序追加到数组末尾,返回新数组长度
> **会修改原数组**

> `pop()` 删除并返回数组的最后一个元素
> **会修改原数组**

> `unshift([ item1 [ , item2 [ , … ] ] ])` 将参数们插入到数组的开始位置，它们在数组中的顺序与它们出现在参数列表中的顺序相同。返回新数组长度
> **会修改原数组**

> `shift()`  删除并返回数组的第一个元素。
> **会修改原数组**

> toString()
1. 令 array 为用 this 值调用 ToObject 的结果。
2. 令 func 为以 "join" 作为参数调用 array 的 [[Get]] 内部方法的结果。
3. 如果 IsCallable(func) 是 false, 则令 func 为标准内置方法 Object.prototype.toString (15.2.4.2)。
4. 提供 array 作为 this 值并以空参数列表调用 func 的 [[Call]] 内部方法，返回结果。
> toString 函数被有意设计成通用的；它的 this 值并非必须是数组对象。因此，它可以作为方法转移到其他类型的对象中。一个宿主对象是否可以正确应用这个 toString 函数是依赖于实现的。

```js
var a = [1, ['a', 'b', {o: 'obj'}]];
console.log(a.toString());              // 1,a,b,[object Object]
```

# ECMAScript 5 中的数组方法
> `forEach ( callbackfn [ , thisArg ] )`  forEach 按照索引的升序，对数组里存在的每个元素调用一次 callbackfn
> callbackfn 将传入三个参数：元素的值，元素的索引，和遍历的对象。 如果提供了一个 thisArg 参数，它会被当作 this 值传给每个 callbackfn 调用
> forEach 没有 for循环中 break
> **对 forEach 的调用不直接更改对象，但是对 callbackfn 的调用可能更改对象。**

```js
var a = [1, 2, 3, 4];

var sum = 0;
a.forEach(function(value, index, arr) {
    sum += value;
});
console.log(sum);                       // 10
console.log(a);                         // [ 1, 2, 3, 4 ]

a.forEach(function(value, index, arr) {
    arr[index] = 0;
});
console.log(a);                         // [ 0, 0, 0, 0 ]
```

> `map ( callbackfn [ , thisArg ] )` map 按照索引的升序，对数组里存在的每个元素调用一次 callbackfn，并用结果构造一个新数组
> callbackfn 将传入三个参数：元素的值，元素的索引，和遍历的对象。 如果提供了一个 thisArg 参数，它会被当作 this 值传给每个 callbackfn 调用
> callbackfn 只被实际存在的数组元素调用；它不会被缺少的数组元素调用。
> **对 map 的调用不直接更改对象，但是对 callbackfn 的调用可能更改对象。**

```js
var a = [1, 2, undefined, 3, 4];
a.length = 10;

var b = a.map(function(value, index, arr) {
    console.log(value);              // 1  2  undefined  3  4
    return value * value;
});

console.log(a);                     // [ 1, 2, undefined, 3, 4, , , , ,  ]
console.log(b);                     // [ 1, 4, NaN, 9, 16, , , , ,  ]
```

> `filter ( callbackfn [ , thisArg ] )` filter 按照索引的升序，对数组里存在的每个元素调用一次 callbackfn，并用使 callbackfn 返回 true 的所有值构造一个新数组
> callbackfn 时将传入三个参数：元素的值，元素的索引，和遍历的对象。
> 如果提供了一个 thisArg 参数，它会被当作 this 值传给每个 callbackfn 调用。
> callbackfn 只被实际存在的数组元素调用；它不会被缺少的数组元素调用。
> **对 filter 的调用不直接更改对象，但是对 callbackfn 的调用可能更改对象**

```js
var a = [1, 2, undefined, 3, 4];
a.length = 10;

var b = a.filter(function(value, index, arr) {
    return value < 3;
});

console.log(a);                     // [ 1, 2, undefined, 3, 4, , , , ,  ]
console.log(b);                     // [ 1, 2 ]
```


> `every ( callbackfn [ , thisArg ] )`   every 按照索引的升序，对数组里存在的每个元素调用一次 callbackfn，直到他找到一个使 callbackfn 返回 false 的元素。如果找到这样的元素，every 马上返回 false，否则如果对所有元素 callbackfn 都返回 true，every 将返回 true。
> callbackfn 时将传入三个参数：元素的值，元素的索引，和遍历的对象。
> 如果提供了一个 thisArg 参数，它会被当作 this 值传给每个 callbackfn 调用。
> callbackfn 只被实际存在的数组元素调用；它不会被缺少的数组元素调用。
> **对 every 的调用不直接更改对象，但是对 callbackfn 的调用可能更改对象**

```js
var a = [1, 2, undefined, 3, 4];

var b = a.every(function(value, index, arr) {
    return value === undefined;
});

console.log(a);                     // [ 1, 2, undefined, 3, 4 ]
console.log(b);                     // false
```

> `some ( callbackfn [ , thisArg ] )` some 按照索引的升序，对数组里存在的每个元素调用一次 callbackfn，直到他找到一个使 callbackfn 返回 true 的元素。如果找到这样的元素，some 马上返回 true，否则，some 返回 false
> callbackfn 时将传入三个参数：元素的值，元素的索引，和遍历的对象。
> 如果提供了一个 thisArg 参数，它会被当作 this 值传给每个 callbackfn 调用。
> callbackfn 只被实际存在的数组元素调用；它不会被缺少的数组元素调用。
> **对 some 的调用不直接更改对象，但是对 callbackfn 的调用可能更改对象**

```js
var a = [1, 2, undefined, 3, 4];

var b = a.some(function(value, index, arr) {
    return value === undefined;
});

console.log(a);                     // [ 1, 2, undefined, 3, 4 ]
console.log(b);                     // true
```

> `reduce ( callbackfn [ , initialValue ] )` reduce 按照索引的升序，对数组里存在的每个元素 , 将 callbackfn 作为回调函数调用一次。
> 调用 callbackfn 时将传入四个参数：previousValue（initialValue 的值或上次调用 callbackfn 的返回值），currentValue（当前元素值），currentIndex，和遍历的对象。第一次调用回调函数时，previousValue 和 currentValue 的取值可以是下面两种情况之一。如果为 reduce 调用提供了一个 initialValue，则 previousValue 将等于 initialValue 并且 currentValue 将等于数组的首个元素值。如果没提供 initialValue，则 previousValue 将等于数组的首个元素值并且 currentValue 将等于数组的第二个元素值。如果数组里没有元素并且没有提供 initialValue，则抛出一个 TypeError 异常。
> **对 reduce 的调用不直接更改对象，但是对 callbackfn 的调用可能更改对象。**

```js
var a = [1, 2, 3, 4];

var b = a.reduce(function(previousValue, currentValue, currentIndex, arr) {
    return previousValue + currentValue;
});

console.log(a);                     // [ 1, 2, undefined, 3, 4 ]
console.log(b);                     // 10
```

> `reduceRight ( callbackfn [ , initialValue ] )` 

```js
var arr = ['a', 'b', 'c'];

var str1 = arr.reduce(function(previousValue, currentValue, currentIndex, arr) {
    return previousValue + currentValue;
});

var str2 = arr.reduceRight(function(previousValue, currentValue, currentIndex, arr) {
    return previousValue + currentValue;
});

console.log(str1);  // abc
console.log(str2);  // cba
```

> `indexOf ( searchElement [ , fromIndex ] )` 按照索引的升序比较 searchElement 和数组里的元素们，它使用内部的严格相等比较算法，如果找到一个或更多这样的位置，返回这些位置中第一个索引；否则返回 -1
> `lastIndexOf ( searchElement [ , fromIndex ] )`

```js
var arr = ['a', 'b', 'b', 'c'];
console.log(arr.indexOf('b'));
console.log(arr.lastIndexOf('b'));
```

# 数组类型
> ECMAScript 5 中 使用 `Array.isArray()` 判断是否为数组
> ECMAScript 3

```js
var isArray = Function.isArray || function(o) {
        return typeof o === 'object'
        && Object.prototype.toString.call(o) === '[object Array]';
    };
```

# 类数组对象
> 检测类数组对象

```js
function isArrayLike(o) {
    return (o                           // o 非 null undefined 等
        && typeof o === 'object'        // o 是对象
        && isFinite(o.length)           // o.length 是有限数值
        && o.length >= 0                // o.length 是非负数
        && o.length === Math.floor(o.length) // o.length 是整数
        && o.length < 4294967296            // o.length < 2^32
    )
}
```
> ECMAScript 5 所有的数组方法都是通用的

```js
var a = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};

console.log(Array.prototype.join.call(a, '+'));         // a+b+c
console.log(Array.prototype.slice.call(a, 0));          // [ 'a', 'b', 'c' ]
console.log(Array.prototype.map.call(a, function(x) {   // [ 'A', 'B', 'C' ]
    return x.toUpperCase();
}));
```

> 作为数组的字符串
>> 字符串是不可变值故把它们作为数组看待是,它们是只读的,所以push(), sort(), reverse() 等方法在字符串上无效


# 参考资料
## API文档 ECMAScript5.1中文版


-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
