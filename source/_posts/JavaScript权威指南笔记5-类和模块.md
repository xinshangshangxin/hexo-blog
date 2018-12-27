---
title: JavaScript权威指南笔记5_类和模块
date: 2015-04-12 15:35:38
tags:
- js


---

类和模块150412
<!-- more -->



# 类和原型
```js
function inherit(p) {
    if (p === null) {
        throw TypeError();
    }
    if (Object.create) {
        return Object.create(p);
    }
    var t = typeof p;
    if (t !== 'object' && t !== 'function') {
        throw TypeError();
    }
    function F() {
    }

    F.prototype = p;
    return new F();
}
```
```js
// 实现一个能表示值的范围的类
// 工厂方法
function range(from, to) {
    var r = inherit(range.methods);
    r.from = from;
    r.to = to;
    return r;
}

range.methods = {
    includes: function(x) {
        return this.from <= x && x <= this.to;
    },
    foreach: function(f) {
        for (var x = Math.ceil(this.from); x <= this.to; x++) {
            f(x);
        }
    },
    toString: function() {
        return '(' + this.from + '....' + this.to + ')';
    }
};

var r = range(1, 3);            
console.log(r.includes(2));     // true
r.foreach(console.log);         // 1  2  3
console.log(r);                 // { from: 1, to: 3 }
```
```js
// 实现一个能表示值的范围的类
// 构造函数
function Range(from, to) {
    this.from = from;
    this.to = to;
}

Range.prototype = {
    constructor: Range,
    includes: function(x) {
        return this.from <= x && x <= this.to;
    },
    foreach: function(f) {
        for (var x = Math.ceil(this.from); x <= this.to; x++) {
            f(x);
        }
    },
    toString: function() {
        return '(' + this.from + '....' + this.to + ')';
    }
};

var r = new Range(1, 3);
console.log(r.includes(2));     // true
r.foreach(console.log);         // 1  2  3
console.log(r);                 // { from: 1, to: 3 }
```

# javascript 中 Java 式继承
> javascript定义类的步骤:
>> 1. 定义一个构造函数,并设置初始化新对象的实例属性
>> 2. 给构造函数的prototype对象定义实例的方法
>> 3. 给构造函数定义类字段和类属性

```js

// P182中的extend
var extend = (function() {

    for (var p in { toString: null}) {
        return function extend(o) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var prop in source) {
                    o[prop] = source[prop];
                }
            }
            return o;
        }
    }

    return function path_extend(o) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var prop in source) {
                o[prop] = source[prop];
            }

            for (var j = 0; j < prototyprops.length; j++) {
                prop = prototyprops[j];
                if (source.hasOwnProperty(prop)) {
                    o[prop] = source[prop];
                }
            }

            return o;
        }
    }
}());

var prototyprops = ['toString', 'valueOf', 'constructor', 'hasOwnProperty', 'isPrototypeOf',
                    'propertyIsEnumerable', 'toLocaleString'];

// 一个用以定义类的简单函数
function defineClass(constructor,           // 用以设置实例的属性的函数
                    methods,                // 实例的方法, 复制至原型中
                    statics) {              // 类属性, 复制至构造函数
    if (methods) {
        extend(constructor.prototype, methods);
    }
    if (statics) {
        extend(constructor, statics);
    }

    return constructor;
}

// Range类的实现
var simpleRange = defineClass(function(from, to) {
    this.from = from;
    this.to = to;
},{
    includes: function(x) {
        return this.from <= x && x <= this.to;
    },
    toString: function() {
        return '(' + this.from + '....' + this.to + ')';
    }
}, {
    uptp: function(to) {
        return new simpleRange(0, to);
    }
});

var r = new simpleRange(1, 3);
console.log(r.includes(2));     // true
console.log(r);                 // { from: 1, to: 3 }
```


# 集合类
```js
function Set() {
    this.values = {};
    this.n = 0;
    this.add.apply(this, arguments);
}

Set.prototype.add = function() {
    for (var i = 0; i < arguments.length; i++) {
        var val = arguments[i];
        var str = Set._v2s(val);
        if (!this.values.hasOwnProperty(str)) {
            this.values[str] = val;
            this.n++;
        }
    }

    return this;
};

Set.prototype.remove = function() {
    for (var i = 0; i < arguments.length; i++) {
        var str = Set._v2s(arguments[i]);
        if (this.values.hasOwnProperty(str)) {
            delete this.values[str];
            this.n--;
        }
    }
    return this;
};

Set.prototype.contains = function(value) {
    return this.values.hasOwnProperty(Set._v2s(value));
};

Set.prototype.size = function() {
    return this.n;
};

Set.prototype.foreach = function(f, context) {
    for (var str in this.values) {
        if (this.values.hasOwnProperty(str)) {
            f.call(context, this.values[str]);
        }
    }
};

Set._v2s = function(val) {
    switch (val) {
        case undefined:
        {
            return 'u';
        }
        case null:
        {
            return 'n'
        }
        case true:
        {
            return 't';
        }
        case false:
        {
            return 'f';
        }
        default :
        {
            switch (typeof(val)) {
                case 'number':
                {
                    return '#' + val;
                }
                case 'string':
                {
                    return '"' + val;
                }
                default :
                {
                    return '@' + objectId(val);
                }
            }
        }

        function objectId(o) {
            var prop = '|**objectid**|';
            if (!o.hasOwnProperty(prop)) {
                Object.defineProperty(o, prop, {
                    writable: true,
                    enumerable: false, //不可枚举
                    value: Set._v2s.next++
                });
            }
            return o[prop];
        }
    }
};

Set._v2s.next = 100;



var mySet = new Set();
var o = {'name': 'shang'};
mySet.add(o);
mySet.add(o);
console.log(mySet.size());      // 1
mySet.foreach(function(o) {
    console.log(o);             // { name: 'shang' }
});

console.log(mySet.contains(o));     // true
mySet.remove(o);
console.log(mySet.size());          // 0
```

> 使用枚举类型表示一副扑克牌

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
    function F() {
    }

    F.prototype = p;
    return new F();
}

/**
 * 枚举类型
 * @param namesToValues 类的每个实例的名字和值
 * @returns {Function}  构造函数 包含 名/值的映射表
 */
function enumeration(namesToValues) {
    var enumeration = function() {
        throw 'can\'t';
    };

    var proto = enumeration.prototype = {
        construcetor: enumeration,
        toString: function() {
            return this.name;
        },
        valueOf: function() {
            return this.value;
        },
        toJson: function() {
            return this.name;
        }
    };

    enumeration.values = [];
    for (var name in namesToValues) {
        var e = inherit(proto);
        e.name = name;
        e.value = namesToValues[name];
        enumeration[name] = e;
        enumeration.values.push(e);
    }

    enumeration.foreach = function(fun, context) {
        for (var i = 0; i < this.values.length; i++) {
            fun.call(context, this.values[i]);
        }
    };

    return enumeration;
}

function Card(suit, rank) {
    this.suit = suit;
    this.rank = rank;
}

Card.Suit = enumeration({
    Clubs: 1,
    Diamonds: 2,
    Hearts: 3,
    Spades: 4
});
Card.Rank = enumeration({
    Two: 2,
    Three: 3,
    Four: 4,
    Five: 5,
    Six: 6,
    Seven: 7,
    Eight: 8,
    Nine: 9,
    Ten: 10,
    Jack: 11,
    Queen: 12,
    King: 13,
    Ace: 14
});

Card.prototype.toString = function() {
    return this.rank.toString() + 'of' + this.suit.toString();
};
Card.prototype.compareTo = function(that) {
    if (this.rank < that.rank) {
        return -1;
    }
    if (this.rank > that.rank) {
        return 1;
    }
    return 0;
};

Card.orderByRank = function(a, b) {
    return a.compareTo(b);
};
Card.orderBySuit = function(a, b) {
    if (a.suit < b.suit) {
        return -1;
    }
    if (a.suit > b.suit) {
        return 1;
    }
    if (a.rank < b.rank) {
        return -1;
    }
    if (a.rank > b.rank) {
        return 1;
    }
    return 0;
};

// 牌组
function Deck() {
    var cards = this.cards = [];
    Card.Suit.foreach(function(s) {
        Card.Rank.foreach(function(r) {
            // 无法使用 this
            cards.push(new Card(r, s));
        });
    });
}

// 洗牌
Deck.prototype.shuffle = function() {
    var deck = this.cards, len = deck.length;
    for (var i = len - 1; i >= 0; i--) {
        var r = Math.floor(Math.random() * (i + 1));
        var temp = deck[i];
        deck[i] = deck[r];
        deck[r] = temp;
    }
    return this;
};
// 发牌
Deck.prototype.deal = function(n) {
    if (this.cards.length < n) {
        throw 'out of crads length'
    }
    return this.cards.splice(this.cards.length - n, n);
};

var deck = (new Deck()).shuffle();
var hand = deck.deal(13).sort(Card.orderBySuit);

console.log(deck);
console.log(hand);
```

-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

