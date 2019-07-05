---
layout: post
title: '[翻译] Angular 最佳实践: RxJS 错误处理'
date: 2019-07-05 13:55:15
tags:
  - RxJS
  - rxjs
---

翻译 `Angular Best Practice: RxJS Error Handling`

<!-- more -->

`RxJS` 是 `Angular` 的一个重要部分. 如果不了解如何正确地使用 RxJS 处理错误,那么当错误发生时,你肯定会遇到一些奇怪的问题.相反,如果你事先知道自己在做什么,你就可以消除这些奇怪的问题,并为自己节省调试的痛苦

本文将研究

- 最需要关注的 `RxJS Observables` 类型
  - `RxJS Infinite Observables` 参阅 [这篇文章](https://www.intertech.com/Blog/angular-best-practice-unsubscribing-rxjs-observables/) 关于 `finite Observables` 和 `infinite Observables`的不同, 尽管你可能猜得到
- 如何错误地处理 `RxJS` 中的错误
  - 当错误处理不正确时会发生什么
- 如果不处理 `RxJS` 中的错误,会发生什么
- 如何正确处理 `RxJS` 中的错误

本文的代码可以在 [`github`](https://github.com/richinator38/rxjs-playground) 上找到

## Infinite Observables

本文将讨论 `infinite observables` - 那些你期望能从中一直获取值. 如果你错误的处理错误(do error handling wrong), 它们将不再是`infinite observables`, 并且结束 - 这将是非常糟糕的, 因为你的应用程序期望它是`infinite`

以下这些将会被研究

- `DOM Event` - 对一个在页面上键入并使用 API 查询的 `keyup` 的 `DOM Event` 进行去抖
- NgRx Effect - 期望始终监听已分派的操作的 NgRx Effect

## `DOM Event` 案例研究

第一个案例研究会聚焦于处理 `DOM Event` 并基于它们进行搜索. 你将在两个输入框中输入《星球大战》的角色的名字. 当你停止输入 300 毫秒之后, 并且输入的内容和上一次的不相同, 将会使用 星球大战 API 搜索这些名字 并且展示. 第一个输入框会在出现错误之后继续工作,第二个输入框会在出现错误后停止工作.

这是界面
![interface](/img/angular-rxjs-error-handling/InfiniteTypingObservable2.png)

我稍微修改一下,如果你输入错误,它会搜索一个错误的 URL,从而产生一个错误

这是相关的 HTML

```html
<input class="form-control" (keyup)="searchTerm$.next($event.target.value)" />

<input class="form-control" (keyup)="searchTermError$.next($event.target.value)" />
```

`keyup`事件 只是简单的使用 `Subject` 的 `next` 方法发送数据

这是`component`代码

```ts
searchTerm$ = new Subject<string>();
searchTermError$ = new Subject<string>();

this.rxjsService
  .searchBadCatch(this.searchTermError$)
  .pipe(finalize(() => console.log('searchTermError$ (bad catch) finalize called!')))
  .subscribe((results) => {
    console.log('Got results from search (bad catch)');
    this.resultsError = results.results;
  });

this.rxjsService
  .search(this.searchTerm$)
  .pipe(finalize(() => console.log('searchTerm$ finalize called!')))
  .subscribe((results) => {
    console.log('Got results from search (good catch)');
    this.results = results.results;
  });
```

这段代码基本上将向页面发送结果, 并输出日志是否被调用. 注意, 我们调用了两个不同的服务方法, 并传入了两个不同的 `Subject`

本案例研究的错误处理代码位于 `rxjsService` 中:

```ts
searchBadCatch(terms: Observable<string>) {
  return terms.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => this.searchStarWarsNames(term)),
    catchError(error => {
      console.log("Caught search error the wrong way!");
      return of({ results: null });
    })
  );
}

search(terms: Observable<string>) {
  return terms.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term =>
      this.searchStarWarsNames(term).pipe(
        catchError(error => {
          console.log("Caught search error the right way!");
          return of({ results: null });
        })
      )
    )
  );
}

private searchStarWarsNames(term) {
  let url = `https://swapi.co/api/people/?search=${term}`;
  if (term === "error") {
    url = `https://swapi.co/apix/people/?search=${term}`;
  }

  return this.http.get<any>(url);
}
```

## 糟糕的错误处理

`searchBadCatch` 方法实现了糟糕的错误处理. 它看起来没有问题, 对吧?
它在 300 毫秒内去抖动,并且使用`distinctUntilChanged`确保我们不会连续两次搜索相同的东西. 在 `switchMap` 中, 我们使用了`searchStarWarsNames`方法,并且使用`catchError`方法捕获错误. 这有什么问题吗?

> 如果你在 Observables 的 `pipe` 方法的第一层使用 `catchError` 捕捉错误(在本例中是 `return terms.pipe()`),它将允许你处理错误,并且返回一个或多个结果, 但是它会紧接着终止这个 `observable stream`(可观察者流). 这意味着它不会再监听 `keyup`事件. 因此, 无论如何, 绝不允许错误渗透到这一层.

注意, 如果在`Observable`的`pipe`方法的第一层触达`catchError`, `finalize` 方法将会被调用. 你可以在`component`代码中看到这一点.

这里有个可视化代码(`visual`), 我希望有所帮助

![visual](/img/angular-rxjs-error-handling/bad-catch-code.png)

永远不要让错误渗透到红线的水平.

## 良好的错误处理

`search` 方法中实现了 `RxJS` 错误处理的最佳实践代码

> 始终将 `catchError` 操作符 放在 类似 `switchMap` 的方法中, 以便于它只结束 API 调用流,然后将流返回 `switchMap` 中,继续执行`Observable`. 如果你没有调用 API,确保添加了`try/catch` 代码来处理错误,并且不允许它渗透到第一层的 `pipe`, 不要假设你的代码不会失败, 一定要使用 `try/catch`.

所以, 你可以在代码中看到我们在 `searchStarWarsNames` 方法调用中 添加了 `pipe` 方法,这样我们就可以捕获错误,从而不允许错误渗透到第一层 `pipe`

这是最佳处理的可视化代码(`visual`)
![visual](/img/angular-rxjs-error-handling/good-catch-good.png)

始终在 `switchMap` / `mergeMap` / `concatMap` 等内部的捕获错误

## 输出(Output)

现在是时候看看它是如何在网页上工作的.我们假设它一开始是工作的.当 API 调用出错时,就有乐子了.

首先,我将在两个输入框中键入错误,如下所示
![](/img/angular-rxjs-error-handling/InfiniteTypingObservableOutput1.png)

我将把它作为练习, 你自己看控制台输出. 现在正式测试,我可以在处理错误后继续输入内容并获得结果吗？

这里我们看到第一个可行,第二个不再可行

![](/img/angular-rxjs-error-handling/InfiniteTypingObservableOutput2.png)

第二个输入框出现了正如我开头介绍中所说的奇怪的问题.你将很难弄清楚为什么你的搜索停止工作

## `NgRx Effect` 案例研究

我开始写这篇文章的原因是我在一个应用程序使用 `NgRx Effects` 出现的奇怪的问题. 有关信息请看[这里](https://www.intertech.com/Blog/ngrx-tutorial-actions-reducers-and-effects/). 可能是因为我没有在`effect`中正确处理 RxJS 错误? 正如你在本研究中所看到的, 答案是肯定的

这是界面
![](/img/angular-rxjs-error-handling/NgRxErrorHandlingInterface.png)

这里没有什么特别的

- `Success` - 用 `person/1`(`Luke Skywalker`)调用星球大战 API,并在屏幕上输出名称
- `Error – Stops Listening` - 使用错误 URL 调用 API,因此它会生成一个错误 - `catch`是错误的,所以它停止监听 `effect`
- `Error – Don’t catch error` - 使用错误的 URL 调用 API,以便生成错误 - 不捕获错误
- `Error – Keeps Listening` - 使用错误的 URL 调用 API,以便生成错误 - 正确捕获错误,所以可以多次单击它

我会跳过 HTML,因为它只是调用组件方法的按钮. 这是组件代码

```ts
ngrxSuccess() {
  this.store.dispatch(new CallWithoutError());
}

ngrxError() {
  this.store.dispatch(new CallWithError());
}

ngrxErrorKeepListening() {
  this.store.dispatch(new CallWithErrorKeepListening());
}

ngrxErrorDontCatch() {
  this.store.dispatch(new CallWithErrorNotCaught());
}
```

好(good),坏(bad)和丑陋(ugly)的错误处理都在 `effect` 代码中

## CallWithoutError Effect

这是我们的成功案例

```ts
@Effect()
callWithoutError$ = this.actions$.pipe(
  ofType(AppActionTypes.CallWithoutError),
  switchMap(() => {
    console.log("Calling api without error");

    return this.http.get<any>(`https://swapi.co/api/people/1`).pipe(
      map(results => results.name),
      switchMap(name => of(new SetName(name))),
      catchError(error => of(new SetName("Error!")))
    );
  }),
  finalize(() => console.log("CallWithoutError finalize called!"))
);
```

这个每次都会工作.即使它失败了,它会继续工作,因为 `catchError` 在 `http.get` 的 `pipe` 中. 在这个成功案例,`SetName reducer` 将向 `store` 添加`name`, 用户界面选择并显示它.

## CallWithError Effect

此`effect`将使用错误的 URL 调用 API,因此会生成错误. 错误处理操作不正确,因此一旦调用,这将永远不会再次运行,直到刷新应用程序.

```ts
@Effect()
callWithError$ = this.actions$.pipe(
  ofType(AppActionTypes.CallWithError),
  switchMap(() => {
    console.log("Calling api with error - stop listening");

    return this.http.get<any>(`https://swapi.co/apix/people/1`).pipe(
      map(results => results.name),
      switchMap(name => of(new SetName(name)))
    );
  }),
  catchError(error => of(new SetName("Error - You're doomed!"))),
  finalize(() => console.log("CallWithError finalize called!"))
);
```

在这种情况下, `catchError` 会在 `this.actions$.pipe` 的第一层中别调用, 从而结束 `effect`,因为它的 Observable 流将结束. 这就像上面使用 RxJS Observables 的案例研究一样. 点击后我们应该在页面上看到`Error – You’re doomed!`. 如果我们再次尝试单击该按钮,则不会触发该`effect`.

以下是此输出：

![](/img/angular-rxjs-error-handling/error-stops-listening.png)

## CallWithErrorKeepListening Effect

此`effect`将使用错误的 URL 调用 API,因此会生成错误. 但是,它会正确处理错误,以便可以再次调用它.

```ts
@Effect()
callWithErrorKeepListening$ = this.actions$.pipe(
  ofType(AppActionTypes.CallWithErrorKeepListening),
  switchMap(() => {
    console.log("Calling api with error - keep listening");

    return this.http.get<any>(`https://swapi.co/apix/people/1`).pipe(
      map(results => results.name),
      switchMap(name => of(new SetName(name))),
      catchError(error => of(new SetName("Error but still listening!")))
    );
  }),
  finalize(() => console.log("CallWithErrorKeepListening finalize called!"))
);
```

处理 RxJS 错误的正确方法是将 `catchError` 放在 `http.get`的`pipe`中. 它将结束 `http.get` 的 `observable`,但这并不重要,因为它无论如何都是`finite observable`,只发出一个值. 当它返回`SetName action`时,`switchMap`将`emit` 并继续 Observable 流. 请注意,此处的`finalize`将永远不会被调用.

以下是此输出：

![](/img/angular-rxjs-error-handling/error-still-listening.png)

## CallWithErrorNotCaught Effect

这是我们的最后一个`effect`, 并回答了我们的问题"如果我们没有 catch 错误会发生什么?" 这个问题的答案是它的行为与我们不正确地处理错误的行为相同（因为这就是 RxJS 如何运转）. 只是你没有处理(hooking into)那个错误流.

```ts
@Effect()
callWithErrorDontCatch$ = this.actions$.pipe(
  ofType(AppActionTypes.CallWithErrorNotCaught),
  switchMap(() => {
    console.log("Calling api with error - don't catch");

    return this.http.get<any>(`https://swapi.co/apix/people/1`).pipe(
      map(results => results.name),
      switchMap(name => of(new SetName(name)))
    );
  }),
  finalize(() => console.log("CallWithErrorNotCaught finalize called!"))
);
```

此外,由于你没有 在 `catchError` 中调用 `SetName`, 因此不会在 UI 上设置 name. 因此,如果点击第一个按钮,将看不到任何输出,或者将看到上一次设置的 name. 另一个很难调试的“怪异问题”.

## 最后

正如你在本文中所知,知道如何在 Angular 应用程序中正确处理的 RxJS 错误将帮助你阻止 `infinite Observable` 意外结束的奇怪的问题. 利用这些知识,你应该能够确保你的`infinite Observables` 永远不会结束,直到你决定结束它们为止.

# 原文

- [Angular Best Practice: RxJS Error Handling](https://www.intertech.com/Blog/angular-best-practice-rxjs-error-handling/)  
  <br>

---

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG 殇
