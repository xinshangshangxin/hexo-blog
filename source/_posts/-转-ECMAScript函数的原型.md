title: "[转]ECMAScript函数的原型"
date: 2015-03-08 15:43:33
description: ECMAScript函数的原型
tags:
- js
---



## 函数的原型基本概念

1. 每个函数都有一个原型（prototype）属性；
2. 原型属性是一个指针，指向一个对象；
3. 对象的用途是包含可以由特定类型的所有实例共享的属性和方法。

## 理解函数原型对象（prototype）

1. constructor属性。创建函数后，自动获取到此属性。默认情况下，函数prototype的constructor指向函数本身。
```js
function Foo() {
}
Foo.prototype.constructor === Foo;  //true
```
2. prototype上其他方法继承自Object，如toString()、valueOf(),hasOwnPrototype()、isPrototypeOf()等等。

## 构造函数、函数的原型对象和构造函数实例之间的关系

当调用构造函数创建一个新实例后，该实例的内部将包含一个指针（内部属性），指向构造函数的原型对象。ECMA-262第5版中管这个指针叫[[Prototype]]。**这个连接存在于实例与构造函数的原型对象之间，而不是存在于实例与构造函数之间。**

```js
function Person() {
}

Person.prototype.name = "MirrorAvatar";
Person.prototype.age = 3;
Person.prototype.job = "coder";
Person.prototype.sayName = function() {
	alert(this.name);
};

var person1 = new Person();
person1.sayName();  //MirrorAvatar

var person2 = new Person();
person2.sayName();  //MirrorAvatar

person1.sayName === person2.sayName;  //true
```

构造函数Person、Person的原型对象prototype和Person的两个实例person1&&person2关系图：

![关系图](/img/proyotype/person.png)

文字描述：

1. Person.prototype指向了原型对象；
2. Person.prototype.constructor指回了Person；
3. 原型对象不光只有一个constructor属性，还有后来添加上来的属性；
4. Person的两个实例person1和person2仅仅指向了Person.prototype,它们与构造函数Person没有直接联系；
5. person1和person2不包含属性和方法，但是可以访问到。

## 检测某个实例是否和某个原型对象存在关系

1. isPrototypeOf
```js
		//此方法继承自Object
		Person.prototype.isPrototypeOf(person1);  //true
		Person.prototype.isPrototypeOf(person2);  //true
```
2. ECMAScript5的Object.getPrototypeOf()
```js
	此方法返回[[Prototype]]的值,即返回这个对象的原型。
	
		Object.getPrototypeOf(person1) === Person.prototype;  //true
		Object.getPrototypeOf(person1).name;  //"MirrorAvatar"
```
## 多个对象实例共享原型所保存的属性和方法的基本原理

每当代码读取某个对象的某个属性时，都会执行一次搜索，目标是具有给定名字的属性。

过程：

1. 搜索对象实例本身。有，返回；无，继续。
2. 搜索指针指向的原型对象。有，返回；无，返回undefined。

注意：

**对象实例访问保存在原型中的值，但却不能通过对象实例重写原型中的值。**如果我们在实例中添加了一个属性，而该属性与实例原型中的一个属性同名，那我们就在实例中创建该属性，该属性将会屏蔽原型中的那个属性。

```js
function Person() {
}

Person.prototype.name = "Cindy";

var person1 = new Person();
var person2 = new Person();

person1.name = "MirrorAvatar";

console.log(person1.name);  //"MirrorAvatar"，值来着实例，屏蔽原型的
console.log(person2.name);  //"Cindy"，值来自原型
person1.hasOwnProperty("name");  //true
person2.hasOwnProperty("name");  //false

delete person1.name;  //可以删除实例的属性
console.log(person1.name);  //"Cindy"，值来自原型，说明只是屏蔽没有被重写
person1.hasOwnProperty("name");  //false
```

# 转载自: [http://mirroravatar.iteye.com/blog/2190410](http://mirroravatar.iteye.com/blog/2190410)


> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com)
