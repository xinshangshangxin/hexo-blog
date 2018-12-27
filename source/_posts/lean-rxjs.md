---

layout: post
title: 'RxJS 学习笔记'
date: 2018-08-30 20:38:46
tags:
  - rxjs
  - RxJS
  - js


---

`30 天精通 RxJS` 的读书笔记
<!-- more -->



# 注意

本文章为台湾同胞写的 [30 天精通 RxJS](https://ithelp.ithome.com.tw/articles/10186103) 的读书笔记,  建议阅读 `30 天精通 RxJS`[(墙外地址)](https://ithelp.ithome.com.tw/articles/10186103)/[(gitbook地址)](https://rxjs-cn.github.io/rxjs5-ultimate-cn/content/hot-n-cold-observables.html) 来学习 `RxJS`

# RxJS 一个核心三个重点

- 核心: `Observable` 再加上相关的 `Operators` (`map`, `filter`, `...`)
- 三个重点:
  - `Observer`(观察者)
  - `Subject`
  - `Schedulers`

# 名词解释

| 名称               | 中文       | 备注                                                                                                                   |
| ------------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| `Observer Pattern` | 观察者模式 | DOM 的事件监听(`addEventListener`)                                                                                     |
| `Iterator Pattern` | 迭代器模式 | ES6 的原生的 `Iterator`                                                                                                |
| `Observable`       | 可观察对象 | `Observer Pattern` 是靠生产者推送资料<br>`Iterator Pattern` 则是消费者去要求资料<br>而 `Observable` 是这两个思想的结合 |
| `Observer`         | 观察者     | 注意和`Observer Pattern`区分                                                                                           |

# `Observer`

** `Observer`(观察者) 跟和 `Observer Pattern`(观察者模式) 无关，观察者模式是一种设计模式，是思考问题的解决过程，而 `Observer`(观察者) 是一个被定义的对象**

## 三个方法

- next: 每当 Observable 发送出新的值,next 方法就会被呼叫
- complete: 在 Observable 没有其他的资料可以取得时,complete 方法就会被呼叫,在 complete 被呼叫之后,next 方法就不会再起作用
- error: 每当 Observable 内发生错误时,error 方法就会被呼叫

## 察者可以是不完整的，可以只具有一个 `next` 方法

```ts
import { Observable } from 'rxjs';

let observable = Observable.create((observer) => {
  observer.next('Jerry');
  observer.next('Anna');
  observer.complete();
  observer.next('not work');
});

// 创建一个观察者，具有 next, error, complete 上个方法
let observer = {
  next(value) {
    console.log(value);
  },
  error(error) {
    console.log(error);
  },
  complete() {
    console.log('complete');
  },
};

observable.subscribe(observer);

/*
Jerry
Anna
complete
*/
```

# `Observable` 的订阅跟 `addEventListener` 的差异

- `addEventListener` 本质上就是 `Observer Pattern` 的实现,在内部会有一份订阅清单
- `Observable` 的订阅 比较像是执行一个物件的方法,并把资料传进这个方法中

# `Observable` 和 `Iterator` 的差异

- 延迟运算
- 渐进式取值

# Observable 的 `static function`

- `Observable.create` 传入一个`callback function`, 这个 `callback function` 会接收一个`observer` 参数
- `Observable.throw` 创建一个不发送数据给观察者并且立马发出错误通知的 `Observable`
- `Observable.pipe` 将一系列的操作函数 变成 `chain` 的方式

# 创建实例

**`import { of, from, fromEvent } from 'rxjs'`**

- of
- from
- fromEvent
- fromEventPattern (_同时具有注册监听及移除监听两种行为_)
- fromPromise
- never (_一直存在但却什么都不做的 observable_)
- empty (_立即送出 complete_)
- throw (_立即抛出错误_)
- interval (_每隔 X 毫秒送出一个从零开始递增的整数_)
- timer (_第一个参数要发出第一个值的等待时间(ms)，第二个参数第一次之后发送值的间隔时间_) | (_第一个参数日期(Date)等到指定的时间在发送第一个值，第二个参数第一次之后发送值的间隔时间_) | (_只接收一个参数, 等待第一个参数时候后通知结束_)

# 订阅

- 订阅 `observable` 后，会回传一个 `subscription` 物件，这个物件具有释放资源的`unsubscribe`方法
- `Events observable` 尽量不要用 `unsubscribe`，通常我们会使用 `takeUntil`，在某个事件发生后来完成 `Event observable`

# operators

**[珠宝图 http://rxmarbles.com/](http://rxmarbles.com/)**

**!!! 每个 operator 都会回传一个新的 observable**

- map
- mapTo
- filter
- take
- first
- takeUntil
- skip
- takeLast 必须等到整个`observable`完成(complete)，才能知道最后的元素有哪些，并且**同步送出**
- last
- concat 把多个 `observable` 实例合并成一个, 等前一个 `observable`完成,才会继续下一个
- startWith 一开始就**同步**发出的，这个`operator`常被用来保存程式的起始状态
- merge 把多个 `observable` 实例合并成一个, 多个 `observable` 同时处理
- combineLatest 取得各个 `observable` 最后送出的值，再输出成一个值
- zip<T, R>(...observables: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): Observable<R>
  每个 `observable` 的第 n 个元素会一起输出
- withLatestFrom<T, R>(...args: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): OperatorFunction<T, R>
  和 `combineLatest` 像, 只有在主`observable` 送出新的值时，才会执行 callback
- reduce<T, R>(accumulator: (acc: R, value: T, index?: number) => R, seed?: R): OperatorFunction<T, R>
  返回一个`reduce`之后的最终结果
- scan<T, R>(accumulator: (acc: R, value: T, index: number) => R, seed?: T | R): OperatorFunction<T, R>
   和`reduce` 相似,  但是  返回每个中间结果
- buffer<T>(closingNotifier: Observable<any>): OperatorFunction<T, T[]>
  缓冲源 Observable 的值直到 closingNotifier 发出
- bufferTime<T>(bufferTimeSpan: number): OperatorFunction<T, T[]>
  在特定时间周期内缓冲源 Observable 的值
- bufferCount<T>(bufferSize: number, startBufferEvery: number = null): OperatorFunction<T, T[]>
  缓冲源 Observable 的值直到缓冲数量到达设定的 bufferSize.
- delay
- delayWhen
- debounce 每次收到元素，他会先把元素 cache 住并等待一段时间，如果这段时间内已经没有收到任何元素，则把元素送出；如果这段时间内又收到新的元素，则会把原本 cache 住的元素释放掉并重新计时，不断反覆
- debounceTime
- throttle 有元素被送出就会沉默一段时间，等到时间过了又会开放发送元素
- throttleTime
- distinct<T, K>(keySelector?: (value: T) => K, flushes?: Observable<any>): MonoTypeOperatorFunction<T>
  不要直接把`distinct`用在一个无限的`observable`里，这样很可能会让 Set 越来越大
- distinctUntilChanged
- catchError<T, R>(selector: (err: any, caught: Observable<T>) => ObservableInput<R>): OperatorFunction<T, T | R>
- retry
- retryWhen
- repeat
- concatAll `source` observable 内部每次发送的值也是`observable`，用 `concatAll` 就可以把 `source` 摊平; 会处理 `source` 先发出来的 `observable`，必须等到这个 `observable` 结束，才会再处理下一个`source`发出来的`observable`
- switchAll<T>(): OperatorFunction<ObservableInput<T>, T>
  每当有新的 observable 送出就会直接把旧的 observable 退订(unsubscribe)，永远只处理最新的 observable!
- mergeAll<T>(concurrent: number = Number.POSITIVE_INFINITY): MonoTypeOperatorFunction<T>
- concatMap<T, I, R>(project: (value: T, index: number) => ObservableInput<I>, resultSelector?: (outerValue: T, innerValue: I, outerIndex: number, innerIndex: number) => R): OperatorFunction<T, I | R>
  `map + concatAll`
  确定内部的 observable 结束时间比外部 observable 发送时间来快的情境，并且不希望有任何并行处理行为，适合少数要一次一次完成到底的的 UI 动画或特别的 HTTP request 行为
- switchMap<T, I, R>(project: (value: T, index: number) => ObservableInput<I>, resultSelector?: (outerValue: T, innerValue: I, outerIndex: number, innerIndex: number) => R): OperatorFunction<T, I | R>
  `map + switchAll`
  只要最后一次行为的结果，适合绝大多数的使用情境
- mergeMap<T, I, R>(project: (value: T, index: number) => ObservableInput<I>, resultSelector?: ((outerValue: T, innerValue: I, outerIndex: number, innerIndex: number) => R) | number, concurrent: number = Number.POSITIVE_INFINITY): OperatorFunction<T, I | R>
  `map + mergeAll`
  并行处理多个 observable，适合需要并行处理的行为，像是多个 I/O 的并行处理
- window<T>(windowBoundaries: Observable<any>): OperatorFunction<T, Observable<T>>
  每当 windowBoundaries 发出项时，将源 Observable 的值分支成嵌套的 Observable
- windowToggle<T, O>(openings: Observable<O>, closingSelector: (openValue: O) => Observable<any>): OperatorFunction<T, Observable<T>>
  将源 Observable 的值分支成嵌套的 Observable，分支策略是以 openings 发出项为起始，以 closingSelector 发出为结束
- groupBy<T, K, R>(keySelector: (value: T) => K, elementSelector?: ((value: T) => R) | void, durationSelector?: (grouped: GroupedObservable<K, R>) => Observable<any>, subjectSelector?: () => Subject<R>): OperatorFunction<T, GroupedObservable<K, R>>
  根据指定条件将源 Observable 发出的值进行分组，并将这些分组作为 GroupedObservables 发出，每一个分组都是一个 GroupedObservable

# Subject

- `Subject` 同时是 `Observable` 又是 `Observer`
- `Subject` 会对内部的 observers 清单进行组播(`multicast`)
- `Subject` 就是 `Observer Pattern` 的实作并且继承自 `Observable`

```ts
import { Subject } from 'rxjs';
let subject = new Subject();
subject.subscribe(observerA); // 相当于 把 observerA 加入订阅清单
source.subscribe(subject); //  遍历订阅清单后发送当前数据
```

## BehaviorSubject

一种 `subject` 能够表达当前的状态,在一订阅时就能收到最新的状态是什么,而不是订阅后要等到有变动才能接收到新的状态

## ReplaySubject

事件的重放, 在新订阅时重新发送最后的几个元素

## AsyncSubject

等到事情结束后送出一个值

## 和 Subject 相关的 Observable.operators

- multicast<T, R>(subjectOrSubjectFactory: Subject<T> | (() => Subject<T>), selector?: (source: Observable<T>) => Observable<R>): OperatorFunction<T, R>
  可以用来挂载 `subject` 并回传一个可连结(`connectable`)的 `observable`

```ts
let source = Observable.multicast(new Subject());
source.subscribe(observerA);
let realSubscription = source.connect();
realSubscription.unsubscribe();
```

- refCount<T>(): MonoTypeOperatorFunction<T>
  建立一个只要有订阅就会自动 `connect` 的 `observable`, 必须和 `multicast` 一起使用

```ts
let source = Observable.multicast(new Subject()).refCount();
let subscription = source.subscribe(observerA);
subscription.unsubscribe();
```

- publish<T, R>(selector?: OperatorFunction<T, R>): MonoTypeOperatorFunction<T> | OperatorFunction<T, R>
  简化 `multicast(new Subject())`

```ts
let source = Observable.publish().refCount();
let subscription = source.subscribe(observerA);
subscription.unsubscribe();
```

- publishReplay
  `multicast(new ReplaySubject(1))`

- publishBehavior(0)
  `multicast(new BehaviorSubject(0))`

- publishLast
  `multicast(new AsyncSubject())`

- share
  `.publish().refCount();`

# Scheduler

- `Scheduler` 是一个资料结构.它知道如何根据优先级或其他标准来储存并伫列任务.
- `Scheduler` 是一个执行环境.它意味着任务何时何地被执行，比如像是立即执行、在回呼(callback)中执行、setTimeout 中执行、animation frame 中执行
- `Scheduler` 是一个虚拟时钟.它透过 now()这个方法提供了时间的概念，我们可以让任务在特定的时间点被执行.

## queue

在会有递回的 operator 且具有大量资料时使用，在这个情况下 queue 能避免不必要的效能损耗

## asap

asap 因为都是在 setTimeout 中执行，所以不会有 block event loop 的问题，很适合用在永远不会退订的 observable，例如在背景下持续监听 server 送来的通知

## async

asap 很像但是使用 setInterval 来运作，通常是跟时间相关的 operator 才会用到

## animationFrame

在做复杂运算，且高频率触发的 UI 动画时，就很适合使用 animationFrame，以可以搭配 throttle operator 使用。

# 参考文档

- [30 天精通 RxJS](https://ithelp.ithome.com.tw/articles/10186103)  
- [30-days-proficient-in-rxjs](https://rxjs-cn.github.io/rxjs5-ultimate-cn/content/hot-n-cold-observables.html)
  <br>

---

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG 殇

