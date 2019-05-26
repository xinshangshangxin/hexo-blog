---
layout: post
title: '[转] RxJS 操作符记忆法'
date: 2019-05-26 13:28:31
tags:
  - rxjs
  - RxJS
  - js
---

转载自 [釐清幾個超容易混淆又很常用的 RxJS 運算子 (Operators)](https://blog.miniasp.com/post/2018/09/06/Clarify-some-confused-RxJS-operators)

原版文章更加详细清晰, 此文章仅用于个人笔记/快速查询

<!-- more -->

## 关键字理解

| 关键字      | 字义说明                                                                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| scan        | 【扫描】就是将传入 RxJS 运算子的事件资料，一笔一笔处理过一遍，每次处理的过程都会累加，并且处理一笔就 emit 一笔新的事件资料出来。                                                |
| map         | 【对应】就是将一笔传入的资料，对应到另一种格式的资料，通常用来转换资料之用。                                                                                                    |
| concat      | 【串接】就是将一笔一笔的资料串接在一起，通常是把多个 Observable 物件串接成一个新的 Observable 物件。                                                                            |
| switch      | 【交换】就是将一笔资料"交换成" 另一种资料，当连续交换的事件发生时，还没交换的资料就会被放弃。                                                                                   |
| merge       | 【合并】就是将多笔资料合并成一笔，通常是将多个 Observable 物件合并成一个 Observable 物件。                                                                                      |
| flat        | 其用途跟 merge 完全一样，在语意上，通常代表把多个 Observable 物件「压平」成一个 Observable 物件。                                                                               |
| exhaust     | 【耗尽】就是要把原本 Observable 物件送出的资料都跑完，才能继续跑下一个。                                                                                                        |
| zip         | 这个单字有【拉链】的意思，你要发挥一点想像力，假设衣服的两端，拉链拉起来之后，每一节都会平整的被凑在一起。                                                                      |
| combine     | 【组合】就是将多笔资料组合在一起。                                                                                                                                              |
| forkJoin    | 这里的 fork 是【走进岔路】的意思，Join 则是【从不同的岔路合并回来】。通常意思代表多个 Observable 物件同时执行，但全部执行完之后，才会 emit 所有资料，等大家从岔路走回来的感觉。 |
| =========== | ======================                                                                                                                                                          |
| xxxAll      | 【全部】就是将所有传入的 Observabe 物件，全部一起处理。                                                                                                                         |
| xxxLatest   | 【最新的】就是取得最新资料的意思。                                                                                                                                              |
| xxxTo       | 这里的 To 有【表示结果】的意思，也就是直接把特定结果 emit 出去。                                                                                                                |
| xxxMap      | 这里的 Map 有【对应】的意思，但是在 RxJS 的领域中，通常代表着在 Operator 中会对应到另一个不同的 Observable 物件。                                                               |
| xxxMapTo    | 这里就是 Map + To 的意思，但是在 RxJS 的领域中，通常代表着在 Operator 中会对应到另一个自行指定的 Observable 物件。                                                              |
| xxxScan     | 【扫描】就是将传入 RxJS 运算子的事件资料，一笔一笔处理过一遍，每次处理的过程都会累加，并且处理一笔就 emit 一笔新的事件资料出来。                                                |

## Operators

| 关键字                                                                   | xxxAll                                                                  | xxxLatest                                                                     | xxxTo                                                         | xxxMap                                                                  | xxxMapTo                                                                  | xxxScan                                                               |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [scan](https://rxjs-dev.firebaseapp.com/api/operators/scan)              | /                                                                       | /                                                                             | /                                                             | /                                                                       | /                                                                         | /                                                                     |
| [map](https://rxjs-dev.firebaseapp.com/api/operators/map)                | /                                                                       | /                                                                             | [mapTo](https://rxjs-dev.firebaseapp.com/api/operators/mapTo) | /                                                                       | /                                                                         | /                                                                     |
| [concat](https://rxjs-dev.firebaseapp.com/api/operators/concat)          | [concatAll](https://rxjs-dev.firebaseapp.com/api/operators/concatAll)   | /                                                                             | /                                                             | [concatMap](https://rxjs-dev.firebaseapp.com/api/operators/concatMap)   | [concatMapTo](https://rxjs-dev.firebaseapp.com/api/operators/concatMapTo) | /                                                                     |
| [switch](https://rxjs-dev.firebaseapp.com/api/operators/switch)          | [switchAll](https://rxjs-dev.firebaseapp.com/api/operators/switchAll)   | /                                                                             | /                                                             | [switchMap](https://rxjs-dev.firebaseapp.com/api/operators/switchMap)   | [switchMapTo](https://rxjs-dev.firebaseapp.com/api/operators/switchMapTo) | /                                                                     |
| [merge](https://rxjs-dev.firebaseapp.com/api/operators/merge)            | [mergeAll](https://rxjs-dev.firebaseapp.com/api/operators/mergeAll)     | /                                                                             | /                                                             | [mergeMap](https://rxjs-dev.firebaseapp.com/api/operators/mergeMap)     | [mergeMapTo](https://rxjs-dev.firebaseapp.com/api/operators/mergeMapTo)   | [mergeScan](https://rxjs-dev.firebaseapp.com/api/operators/mergeScan) |
| [flat](https://rxjs-dev.firebaseapp.com/api/operators/flat)              | /                                                                       | /                                                                             | /                                                             | [flatMap](https://rxjs-dev.firebaseapp.com/api/operators/flatMap)       | /                                                                         | /                                                                     |
| [exhaust](https://rxjs-dev.firebaseapp.com/api/operators/exhaust)        | /                                                                       | /                                                                             | /                                                             | [exhaustMap](https://rxjs-dev.firebaseapp.com/api/operators/exhaustMap) | /                                                                         | /                                                                     |
| [zip](https://rxjs-dev.firebaseapp.com/api/operators/zip)                | [zipAll](https://rxjs-dev.firebaseapp.com/api/operators/zipAll)         | /                                                                             | /                                                             | /                                                                       | /                                                                         | /                                                                     |
| combine                                                                  | [combineAll](https://rxjs-dev.firebaseapp.com/api/operators/combineAll) | [combineLatest](https://rxjs-dev.firebaseapp.com/api/operators/combineLatest) | /                                                             | /                                                                       | /                                                                         | /                                                                     |
| [forkJoin](https://rxjs-dev.firebaseapp.com/api/index/function/forkJoin) | /                                                                       | /                                                                             | /                                                             | /                                                                       | /                                                                         | /                                                                     |

# 参考文档

- [釐清幾個超容易混淆又很常用的 RxJS 運算子 (Operators)](https://blog.miniasp.com/post/2018/09/06/Clarify-some-confused-RxJS-operators)  
  <br>

---

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG 殇
