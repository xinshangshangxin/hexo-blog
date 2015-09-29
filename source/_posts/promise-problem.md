title: "[转]promises 很酷，但很多人并没有理解就在用了"
date: 2015-09-29 13:55:30
description: promises详解
tags: 
- js
- promise
---


JavaScript 开发者们，是时候承认了，我们在使用`promises`的时候，会写出许多有问题的`promises`代码.但并不是 `promises`本身有问题，被[A+ 标准](https://promisesaplus.com/),定义的`promises` 是极好的  


 在过去的几年中，笔者看到了很多程序员在调用PouchDB或者其他promise化的API时遇到了很多困难。这让笔者认识到，在JavaScript程序员之中，只有少数人是真正理解了promise规范的。如果你觉得这不可思议，那么考虑下我最近[在Twitter上的写的一个比较难的题目](https://twitter.com/nolanlawson/status/578948854411878400)：


**Q：下面四个使用promise的语句之间的不同点在哪儿？**

```js
doSomething().then(function () {
  return doSomethingElse();
});

doSomething().then(function () {
  doSomethingElse();
});

doSomething().then(doSomethingElse());

doSomething().then(doSomethingElse);
```

如果你知道这个问题的答案，那么恭喜你，你已经是一个promise大师并且可以直接关闭这个网页了。  


但是对于不能回答这个问题的程序员中99.9%的人，别担心，你们不是少数派。没有人能够在笔者的tweet上完全正确的回答这个问题，而且对于第三条语句的最终答案也令我感到震惊，即便我是出题人。  

答案在这篇博文的底部，但是首先，笔者必须先介绍为何promise显得难以理解，为什么我们当中无论是新手或者是很接近专家水准的人都有被promise折磨的经历。同时，笔者也会给出自认为能够快速、准确理解promise的方法。而且笔者确信读过这篇文章之后，理解promise不会那么难了。  

在此之前，我们先了解一下有关promise的一些基本设定。  

**`promise`从哪里来？**

如果你读过有关`promise`的文章，你会发现文章中一定会提到回调深坑，不说别的，在视觉上，回调金字塔会让你的代码最终超过屏幕的宽度。
`promise`是能够解决这个问题的，但是它解决的问题不仅仅是缩进。在讨论到如何解决回调金字塔问题的时候，我们遇到真正的难题是回调函数剥夺了程序员使用`return`和`throw`的能力。而程序的执行流程的基础建立于一个函数在执行过程中调用另一个函数时产生的副作用。(译者注：个人对这里副作用的理解是，函数调用函数会产生函数调用栈，而回调函数是不运行在栈上的，因此不能使用`return`和`throw`)。

事实上，回调函数会做一些更邪恶的事情，它们剥夺我们在栈上执行代码的能力，而在其他语言当中，我们始终都能够在栈上执行代码。编写不在栈上运行的代码就像驾驶没有刹车的汽车一样，在你真正需要它之前，你是不会理解你有多需要它。

`promise`被设计为能够让我们重新使用那些编程语言的基本要素：`return`，`throw`，栈。在想要使用`promise`之前，我们首先要学会正确使用它。

新手常见错误

一些人尝试使用漫画的方式解释`promise`，或者是像是解释名词一样解释它：它表示同步代码中的值，并且能在代码中被传递。

笔者并没有觉得这些解释对理解`promise`有用。笔者自己的理解是：`promise`是关于代码结构和代码运行流程的。因此，笔者认为展示一些常见错误，并告诉大家如何修正它才是王道。

扯远一点，对于`promise`不同的人有不同的理解，为了本文的最终目的，我在这里只讨论`promise`的官方规范，在较新版本的浏览器会作为`window`对象的一个属性被暴露出来。然而并不是所有的浏览器都支持这一特性，但是到目前为止有许多对于规范的实现，比如这个有着很嚣张的名字的`promise`库：`lie`，同时它还非常精简。

### 新手错误No.1：回调金字塔

PouchDB有许多promise风格的API，程序员在写有关PouchDB的代码的时候，常常将promise用的一塌糊涂。下面给出一种很常见的糟糕写法。

```js
remotedb.allDocs({
  include_docs: true,
  attachments: true
}).then(function (result) {
  var docs = result.rows;
  docs.forEach(function(element) {
    localdb.put(element.doc).then(function(response) {
      alert("Pulled doc with id " + element.doc._id + " and added to local db.");
    }).catch(function (err) {
      if (err.status == 409) {
        localdb.get(element.doc._id).then(function (resp) {
          localdb.remove(resp._id, resp._rev).then(function (resp) {
// et cetera...
```

你确实可以将promise当做回调函数来使用，但这却是一种杀鸡用牛刀的行为。不过这么做也是可行的。 你可能会认为这种错误是那些刚入行的新手才会犯的。但是笔者在[黑莓的开发者博客上](http://devblog.blackberry.com/2015/05/connecting-to-couchbase-with-pouchdb/)曾经看到类似的代码。过去的书写回调函数的习惯是很难改变的。

下面给出一种代码风格更好的实现：

```js
remotedb.allDocs(...).then(function (resultOfAllDocs) {
  return localdb.put(...);
}).then(function (resultOfPut) {
  return localdb.get(...);
}).then(function (resultOfGet) {
  return localdb.put(...);
}).catch(function (err) {
  console.log(err);
});
```

这就是`promise`的链式调用，它体现promise的强大之处，每个函数在上一个promise的状态变为resolved的时候才会被调用，并且能够得到上一个promise的输出结果。稍后还有详细的解释。

新手错误2：怎样用`forEach()`处理`promise`

这个问题是大多数人掌握`promise`的拦路虎，当这些人想在代码中使用他们熟悉的`forEach()`方法或者是写一个`for`循环，亦或是`while`循环的时候，都会为如何使用`promise`而疑惑不已。他们会写下这样的代码：

```js
// I want to remove() all docs
db.allDocs({include_docs: true}).then(function (result) {
  result.rows.forEach(function (row) {
    db.remove(row.doc);  
  });
}).then(function () {
  // I naively believe all docs have been removed() now!
});
```

这段代码的问题在于第一个回调函数实际上返回的是`undefined`，也就意味着第二个函数并不是在所有的`db.remove()`执行结束之后才执行。事实上，第二个函数的执行不会有任何延时，它执行的时候被删除的doc数量可能为任意整数。  


这段代码看起来是能够正常工作的，因此这个bug也具有一定的隐藏性。写下这段代码的人设想PouchDB已经删除了这些docs，可以更新UI了。这个bug会在一定几率下出现，或者是特定的浏览器。而且一旦出现，这种bug是很难调试的。

总结起来说，出现这个bug并不是`promise`的错，这个黑锅应该`forEach()/for/while`来背。这时候你需要的是`Promise.all()`



```js
db.allDocs({include_docs: true}).then(function (result) {
  return Promise.all(result.rows.map(function (row) {
    return db.remove(row.doc);
  }));
}).then(function (arrayOfResults) {
  // All docs have really been removed() now!
});
```



### 新手错误3：忘记添加catch()方法

这是一个很常见的错误。很多程序员对他们代码中的`promise`调用十分自信，觉得代码永远不会抛出一个`error`，也可能他们只是简单的忘了加`catch()`方法。不幸的是，不加`catch()`方法会让回调函数中抛出的异常被吞噬，在你的控制台是看不到相应的错误的，这对调试来说是非常痛苦的。

为了避免这种糟糕的情况，我已经养成了在自己的`promise`调用链最后添加如下代码的习惯：

```js
somePromise().then(function () {
  return anotherPromise();
}).then(function () {
  return yetAnotherPromise();
}).catch(console.log.bind(console)); // <-- this is badass
```

即使你并不打算在代码中处理异常，在代码中添加catch()也是一个谨慎的编程风格的体现。在某种情况下你原先的假设出错的时候，这会让你的调试工作轻松一些。

新手错误4：使用`deferred`

这类型错误笔者经常看到，在这里我也不想重复它了。简而言之，promise经过了很长一段时间的发展，有一定的历史包袱。JavaScript社区用了很长的时间才纠正了发展道路上的一些错误。在早些时候，jQuery和Angular都在使用’deferred’类型的promise。而在最新的ES6的Promise标准中，这种实现方式已经被替代了，同时，一些Promise的库，比如Q，bluebid，lie也是参照ES6的标准来实现的。

如果你还在代码中使用deferred的话，那么你就是走在错误的道路上了，这里笔者给出一些修正的办法。

首先，绝大多数的库都给出了将第三方库的方法包装成promise对象的方法。  
举例来说，Angular的(`q`模块可以使用)`q.when()`完成这一包装过程。因此，在Angular中，包装PouchDB的promise API的代码如下：
```js
$q.when(db.put(doc)).then(/* ... */); // <-- this is all the code you need
```

另一种方法就是使用暴露给程序员的构造函数。`promise`的构造函数能够包装那些非`promise`的API。  
下面给出一个例子，在该例中将node.js提供的fs.readFile()方法包装成promise。

```js
new Promise(function (resolve, reject) {
  fs.readFile('myfile.txt', function (err, file) {
    if (err) {
      return reject(err);
    }
    resolve(file);
  });
}).then(/* ... */)
```


> 为什么这是一种反模式更多的信息可以查看： [the Bluebird wiki page on promise anti-patterns](https://github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns#the-deferred-anti-pattern).



### 新手常见错误＃5:使用其副作用而不是return

下面的代码有什么问题？

```js
somePromise().then(function () {
  someOtherPromise();
}).then(function () {
  // Gee, I hope someOtherPromise() has resolved!
  // Spoiler alert: it hasn't.
});
```

Ok，现在是时候讨论所有需要了解的关于`promise`的知识点了。理解了这一个知识点，笔者提到的一些错误你都不会犯了。

就像我之前说过的，promise的神奇之处在于让我们能够在回调函数里面使用return和throw。但是实践的时候是什么样子呢？

每一个promise对象都会提供一个then方法或者是catch方法

```js
somePromise().then(function () {
  // I'm inside a then() function!
});
```

我们在这里能做什么呢？有三种事可以做：

1. 返回另一个promise；
2. 返回一个同步值（或者undefined
3. 抛出一个同步错误。

理解这三种情况之后，你就会理解promise了。

### 1.返回另一个promise对象

在有关promise的相关文章中，这种写法很常见，就像上文提到的构成promise链的一段代码：

```js
getUserByName('nolan').then(function (user) {
  return getUserAccountById(user.id);
}).then(function (userAccount) {
  // I got a user account!
});
```

这段代码里面的return非常关键，没有这个return的话，getUserAccountById只是一个普通的被别的函数调用的函数。下一个回调函数会接收到undefined而不是userAccount

### 2.返回一个同步的值或者是undefined

返回一个undefined大多数情况下是错误的，但是返回一个同步的值确实是一个将同步代码转化成promise风格代码的好方法。举个例子，现在在内存中有users。我们可以：

```js
getUserByName('nolan').then(function (user) {
  if (inMemoryCache[user.id]) {
    return inMemoryCache[user.id];    // returning a synchronous value!
  }
  return getUserAccountById(user.id); // returning a promise!
}).then(function (userAccount) {
  // I got a user account!
});
```

第二个回调函数并不关心userAccount是通过同步的方式得到的还是异步的方式得到的，而第一个回调函数即可以返回同步的值又可以返回异步的值。
不幸的是，如果不显式调用return语句的话，javaScript里的函数会返回undefined。这也就意味着在你想返回一些值的时候，不显式调用return会产生一些副作用。
出于上述原因，笔者养成了一个个人习惯就是在then方法内部永远显式的调用return或者throw。笔者也推荐你这样做。

### 3.抛出一个同步的错误

说到throw，这又体现了promise的功能强大。在用户退出的情况下，我们的代码中会采用抛出异常的方式进行处理：

```js
getUserByName('nolan').then(function (user) {
  if (user.isLoggedOut()) {
    throw new Error('user logged out!'); // throwing a synchronous error!
  }
  if (inMemoryCache[user.id]) {
    return inMemoryCache[user.id];       // returning a synchronous value!
  }
  return getUserAccountById(user.id);    // returning a promise!
}).then(function (userAccount) {
  // I got a user account!
}).catch(function (err) {
  // Boo, I got an error!
});
```

如果用户已经登出的话，catch()会收到一个同步的错误，如果有promise对象的状态变为rejected的话，它还会收到一个异步的错误。catch()的回调函数不用关心错误是异步的还是同步的。

在使用promise的时候抛出异常在开发阶段很有用，它能帮助我们定位代码中的错误。比方说，在then函数内部调用JSON.parse（），如果JSON对象不合法的话，可能会抛出异常，在回调函数中，这个异常会被吞噬，但是在使用promise之后，我们就可以捕获到这个异常了。

## 进阶错误

接下来我们讨论一下使用promise的边界情况。

下面的错误笔者将他们归类为“进阶错误”，因为这些错误发生在那些已经相对熟练使用promise的程序员身上。但是为了解决本文开头提出的问题，还是有必要对其进行讨论。

### 进阶错误1：不了解Promise.resolve()

就像之前所说的，promise能够将同步代码包装成异步的形式。然而，如果你经常写出如下的代码：


```js
new Promise(function (resolve, reject) {
  resolve(someSynchronousValue);
}).then(/* ... */);
```

你可以使用Promise.resolve()将上述代码精简。

```js
Promise.resolve(someSynchronousValue).then(/* ... */);
```

在捕获同步异常的时候这个做法也是很有效的。我在编写API的时候已经养成了使用Promise.resolve()的习惯：

```js
function somePromiseAPI() {
  return Promise.resolve().then(function () {
    doSomethingThatMayThrow();
    return 'foo';
  }).then(/* ... */);
}
```

记住，有可能抛出错误的代码都有可能因为错误被吞噬而对你的工作造成困扰。但是如果你用Promise.resolve()包装了代码的话，你永远都可以在代码后面加上catch()。

相同的，使用Promise.reject()可以立即返回一个状态为rejected的promise对象。

```js
Promise.reject(new Error('some awful error'));
```

### 进阶错误2：cacth()和then(null, ...)并不完全相同

笔者提到过过cacth()是then(null, ...)的语法糖，因此下面两个代码片段是等价的

```js
somePromise().catch(function (err) {
  // handle error
});

somePromise().then(null, function (err) {
  // handle error
});
```

但是，这并不意味着下面的两个代码片段是等价的

```js
somePromise().then(function () {
  return someOtherPromise();
}).catch(function (err) {
  // handle error
});

somePromise().then(function () {
  return someOtherPromise();
}, function (err) {
  // handle error
});
```

如果你不理解的话，那么请思考一下如果第一个回调函数抛出一个错误会发生什么？

```js
somePromise().then(function () {
  throw new Error('oh noes');
}).catch(function (err) {
  // I caught your error! :)
});

somePromise().then(function () {
  throw new Error('oh noes');
}, function (err) {
  // I didn't catch your error! :(
});
```

结论就是，当使用then(resolveHandler, rejectHandler)，rejectHandler不会捕获在resolveHandler中抛出的错误。

因为，笔者的个人习惯是从不使用then方法的第二个参数，转而使用catch()方法。但是也有例外，就是在笔者写异步的Mocha的测试用例的时候，如果想确认一个错误被抛出的话，代码是这样的：

```js
it('should throw an error', function () {
  return doSomethingThatThrows().then(function () {
    throw new Error('I expected an error!');
  }, function (err) {
    should.exist(err);
  });
});
```

说到测试，将[Mocha](http://mochajs.org/) 和 [Chai](http://chaijs.com/) 联合使用是一种很好的测试promise API的方案。

. The [pouchdb-plugin-seed](https://github.com/pouchdb/plugin-seed) 项目有很多你[可以入手的简单的测试。](https://github.com/pouchdb/plugin-seed/blob/master/test/test.js)

### 进阶错误3：promise vs promise factories

某些情况下你想一个接一个的执行一系列promise，这时候你想要一个类似于Promise.all()的方法，但是Proimise.all()是并行执行的，不符合要求。你可能一时脑抽写下这样的代码

```js
function executeSequentially(promises) {
  var result = Promise.resolve();
  promises.forEach(function (promise) {
    result = result.then(promise);
  });
  return result;
}
```

不幸的是，这段代码不会按照你所想的那样执行，那些promise对象里的异步调用还是会并行的执行。原因是你根本不应当在promise对象组成的数组这个层级上操作。对于每个promise对象来说，一旦它被创建，相关的异步代码就开始执行了。因此，这里你真正想要的是一个promise工厂。

```js
function executeSequentially(promiseFactories) {
  var result = Promise.resolve();
  promiseFactories.forEach(function (promiseFactory) {
    result = result.then(promiseFactory);
  });
  return result;
}
```
一个promise工厂非常简单，它就是一个返回promise对象的函数

```js
function myPromiseFactory() {
  return somethingThatCreatesAPromise();
}
```

为什么可以达到目的呢？因为promise工厂只有在调用的时候才会创建promise对象。它和then()方法的工作方式很像，事实上，它们就是一样的东西。

### 进阶错误4：如果我想要两个promise的结果应当如何做呢？

很多时候，一个promise的执行是依赖另一个promise的。但是在某些情况下，我们想得到两个promise的执行结果，比方说：

```js
getUserByName('nolan').then(function (user) {
  return getUserAccountById(user.id);
}).then(function (userAccount) {
  // dangit, I need the "user" object too!
});
```

为了避免产生回调金字塔，我们可能会在外层作用域存储user对象。

```js
var user;
getUserByName('nolan').then(function (result) {
  user = result;
  return getUserAccountById(user.id);
}).then(function (userAccount) {
  // okay, I have both the "user" and the "userAccount"
});
```

上面的代码能够到达想要的效果，但是这种实现有一点不正式的成分在里面，我的建议是，这时候需要抛开成见，拥抱回调金字塔：



```js
getUserByName('nolan').then(function (user) {
  return getUserAccountById(user.id).then(function (userAccount) {
    // okay, I have both the "user" and the "userAccount"
  });
});
```

至少，是暂时拥抱回调金字塔。如果缩进真的成为了你代码中的一个大问题，那么你可以像每一个JavaScript程序员从开始写代码起就被教导的一样，将其中的部分抽出来作为一个单独的函数。

```js
function onGetUserAndUserAccount(user, userAccount) {
  return doSomething(user, userAccount);
}

function onGetUser(user) {
  return getUserAccountById(user.id).then(function (userAccount) {
    return onGetUserAndUserAccount(user, userAccount);
  });
}

getUserByName('nolan')
  .then(onGetUser)
  .then(function () {
  // at this point, doSomething() is done, and we are back to indentation 0
});
```

随着你的promise代码越来越复杂，你会将越来越多的代码作为函数抽离出来。笔者发现这会促进代码风格变得优美：

```js
putYourRightFootIn()
  .then(putYourRightFootOut)
  .then(putYourRightFootIn)  
  .then(shakeItAllAbout);
```

That's what promises are all about.

这就是promise的最终目的。

### 进阶错误5：promise坠落现象

这个错误我在前文中提到的问题中间接的给出了。这个情况比较深奥，或许你永远写不出这样的代码，但是这种写法还是让笔者感到震惊。 你认为下面的代码会输出什么？

```js
Promise.resolve('foo').then(Promise.resolve('bar')).then(function (result) {
  console.log(result);
});
```

如果你认为输出的是bar，那么你就错了。实际上它输出的是foo！

产生这样的输出是因为你给then方法传递了一个非函数（比如promise对象）的值，代码会这样理解：then(null)，因此导致前一个promise的结果产生了坠落的效果。你可以自己测试一下：



```js
Promise.resolve('foo').then(null).then(function (result) {
  console.log(result);
});
```

让我们回到之前讲解promise vs promise factoriesde的地方。简而言之，如果你直接给then方法传递一个promise对象，代码的运行是和你所想的不一样的。then方法应当接受一个函数作为参数。因此你应当这样书写代码：

```js
Promise.resolve('foo').then(function () {
  return Promise.resolve('bar');
}).then(function (result) {
  console.log(result);
});
```

这次会如我们预期的那样返回bar。

所以要提醒你自己：永远给then()传递一个函数参数。

## 解决疑惑

现在我们已经学习了关于promises要知道的所有的东西（或者接近于此），我们应该能够解决我在这篇文章开始时提出的疑惑了。

下面给出前文题目的解答

### Puzzle＃1:

```js
doSomething().then(function () {
  return doSomethingElse();
}).then(finalHandler);
```

Answer:

```js
doSomething
|-----------------|
                  doSomethingElse(undefined)
                  |------------------|
                                     finalHandler(resultOfDoSomethingElse)
                                     |------------------|
```


### Puzzle #2

```js
doSomething().then(function () {
  doSomethingElse();
}).then(finalHandler);
```

Answer:

```js
doSomething
|-----------------|
                  doSomethingElse(undefined)
                  |------------------|
                  finalHandler(undefined)
                  |------------------|
```


### Puzzle #3

```js
doSomething().then(doSomethingElse())
  .then(finalHandler);
```

Answer:

```js
doSomething
|-----------------|
doSomethingElse(undefined)
|---------------------------------|
                  finalHandler(resultOfDoSomething)
                  |------------------|
```

### Puzzle #4

```js
doSomething().then(doSomethingElse)
  .then(finalHandler);
```

Answer:

```js
doSomething
|-----------------|
                  doSomethingElse(resultOfDoSomething)
                  |------------------|
                                     finalHandler(resultOfDoSomethingElse)
                                     |------------------|
```

如果这些答案仍然没有讲通，那么我鼓励重新阅读文章，或者去定义doSomething()以及doSomethingElse()然后在你的浏览器中自己尝试。



需要说明的是，在上述的例子中，我都假设doSomething()和doSomethingElse()返回一个promise对象，这些promise对象都代表了一个异步操作，这样的操作会在当前event loop之外结束，比如说有关IndexedDB，network的操作，或者是使用setTimeout。这里给出[JSBin上的示例](http://jsbin.com/tuqukakawo/1/edit?js,console,output)。

Promises更多的使用说明，请参考我的promise主要用法背忘单。 [promise protips cheat sheet](https://gist.github.com/nolanlawson/6ce81186421d2fa109a4).

```js
// Promise.all is good for executing many promises at once
Promise.all([
  promise1,
  promise2
]);

// Promise.resolve is good for wrapping synchronous code
Promise.resolve().then(function () {
  if (somethingIsNotRight()) {
    throw new Error("I will be rejected asynchronously!");
  } else {
    return "This string will be resolved asynchronously!";
  }
});

// execute some promises one after the other.
// this takes an array of promise factories, i.e.
// an array of functions that RETURN a promise
// (not an array of promises themselves; those would execute immediately)
function sequentialize(promiseFactories) {
  var chain = Promise.resolve();
  promiseFactories.forEach(function (promiseFactory) {
    chain = chain.then(promiseFactory);
  });
  return chain;
}

// Promise.race is good for setting a timeout:
Promise.race([
  new Promise(function (resolve, reject) {
    setTimeout(reject, 10000); // timeout after 10 secs
  }),
  doSomethingThatMayTakeAwhile()
]);

// Promise finally util similar to Q.finally
// e.g. promise.then(...).catch().then(...).finally(...)
function finally (promise, cb) {
  return promise.then(function (res) {
    var promise2 = cb();
    if (typeof promise2.then === 'function') {
      return promise2.then(function () {
        return res;
      });
    }
    return res;
  }, function (reason) {
    var promise2 = cb();
    if (typeof promise2.then === 'function') {
      return promise2.then(function () {
        throw reason;
      });
    }
    throw reason;
  });
};
```

## 最后再说两句

promise是个好东西。如果你还在使用传统的回调函数的话，我建议你迁移到promise上。这样你的代码会更简介，更优雅，可读性也更强。

有这样的观点：promise是不完美的。promise确实比使用回调函数好，但是，如果你有别的选择的话，这两种方式最好都不要用。

尽管相比回调函数有许多优点，promise仍然是难于理解的，并且使用起来很容易出错。新手和老鸟都会经常将promise用的乱七八糟。不过说真的，这不是他们的错，应该甩锅给promise。因为它和我们在同步环境的代码很像，但仅仅是像，是一个优雅的替代品。

在同步环境下，你无需学习这些令人费解的规则和一些新的API。你可以随意使用像return，catch，throw这样的关键字以及for循环。你不需要时刻在脑中保持两个相并列的编程思想。

等待async/await

笔者在了解了ES7中的async和await关键字，以及它们是如何将promise的思想融入到语言本身当中之后，写了这样一篇博文用ES7驯服异步这个猛兽。使用ES7，我们将没有必要再写catch()这样的伪同步的代码，我们将能使用try/catch/return这样的关键字，就像刚开始学计算机那样。

这对JavaScript这门语言来说是很好的，因为到头来，只要没有工具提醒我们，这些promise的反模式会持续出现。

从JavaScript发展历史中距离来说，笔者认为JSLint和JSHint对社区的贡献要大于JavaScript:The Good Parts，尽管它们实际上包含的信息是相同的。区别就在于使用工具可以告诉程序员代码中所犯的错误，而阅读却是让你了解别人犯的错误。

ES7中的async和await关键字的美妙之处在于，你代码中的错误将会成为语法错误或者是编译错误，而不是细微的运行时错误。到了那时，我们会完全掌握promise究竟能做什么，以及在ES5和ES6中如何合理的应用。

更新：已经有人跟我指出Bluebird 3.0能打印出警告来避免我在这篇文章中所鉴定的一些错误。所以在我们还在等待ES7的时候使用Bluebird是另一个很棒的选择。




# 参考文档

- [(英文原文)we-have-a-problem-with-promises](http://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html)
- [(中文翻译)promises 很酷，但很多人并没有理解就在用了](http://web.jobbole.com/82601/)
- [(中文翻译)谈谈使用promise时候的一些反模式](http://web.jobbole.com/82950/)


-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

