---
title: blur踩坑
date: 2015-03-08 13:43:21
tags:
- js


---

一直以为blur可以直接设置在任何元素上,然后悲剧的发现并不是....
<!-- more -->



# div无法使用blur判断失去焦点

> An element can have focus if the tabIndex property is set to any valid negative or positive integer.
Elements that receive focus can fire the onblur and onfocus events as of Internet Explorer 4.0, and the onkeydown, onkeypress, and onkeyup events as of Internet Explorer 5.

> 只要元素的tabIndex属性设置成任何有效的整数那么该元素就能取得焦点。元素在取得焦点后就能触发onblur，onfocus，onkeydown, onkeypress和onkeyup事件。

> 不同tabIndex值在tab order（Tabbing navigation）中的情况：

> Objects with a positive tabIndex are selected in increasing iIndex order and in source order to resolve duplicates.
Objects with an tabIndex of zero are selected in source order. 
Objects with a negative tabIndex are omitted from the tabbing order.

> tabIndex值是正数的对象根据递增的值顺序和代码中的位置顺序来被选择
tabIndex值是0的对象根据在代码中的位置顺序被选择
tabIndex值是负数的对象会被忽略

## 参考文档
[Slider 滑动条效果](http://www.cnblogs.com/cloudgamer/archive/2008/12/24/Slider.html)

