---
title: "AngularJS过滤器"
date: 2015-03-31 16:52:36
tags:
- AngularJS


---

AngularJS过滤器
<!-- more -->



> AngularJS过滤器

在{% raw %}{{  }}{% endraw %}内通过|来调用filter,例如:
```js
{% raw %}
{{2015 | number:2 }}
{% endraw %}
```

## 内置filter

- number
> 以数字格式输出，第二个为可选参数，表示小数点后保留的位数。 包含非数字字符时使用使用可选参数会出现Syntax Error，不使用则输出空字符。

```js
{% raw %}
{{ 1234.12 | number:3}}
{% endraw %} <!-- 1234.12 -->
{% raw %}
{{ 1234.12 | number}}
{% endraw %}  <!-- 1,234.12 -->
```

- currency
> 以货币格式输出，包括非数字字符时出现Syntax Error。

```js
{% raw %}
{{1234.12 | currency }}
{% endraw %} <!-- $1,234.12 -->
```

- lowercase/uppercase
> 将字符转小写/大写

```js
{% raw %}
{{"Kavlez! 2015;" | lowercase }}
{% endraw %}  <!-- kavlez! 2015; -->
{% raw %}
{{"Kavlez! 2015;" | uppercase }}
{% endraw %}  <!-- KAVLEZ! 2015; -->
```

- json
> 将对象转为json字符串

*例如已有声明如下:*
```js
$scope.person = new Object();
$scope.person.firstname = 'Kavlez';
$scope.person.lastname = 'Jin'
```
*json过滤输出:*
```js
{% raw %}
{{person | json}}
{% endraw %}
<!-- { "firstname": "Kavlez", "lastname": "Jin" } -->
```

- limitTo
> 对字符串或数组进行截取

```js
{% raw %}
{{'Kavlez!!!!' | limitTo:6 }}
{% endraw %} <!-- Kavlez -->
{% raw %}
{{'Kavlez!!!!' | limitTo:-4 }}
{% endraw %} <!-- !!!! -->
{% raw %}
{{['0','1','2','3','4','5'] | limitTo:1 }}
{% endraw %} <!-- ["0"]-->
```
- orderBy
> 对数组进行排序，该filter有两个参数，分别是排序依据和正逆序(可选)

```js
{% raw %}
{{[
    {'alphabet': 'K'},
    {'alphabet': 'A'},
    {'alphabet': 'V'},
    {'alphabet': 'L'},
    {'alphabet': 'E'},
    {'alphabet': 'Z'}] 
    | orderBy:'alphabet':true }}
{% endraw %}
<!-- [{"alphabet":"Z"},{"alphabet":"V"},{"alphabet":"L"},{"alphabet":"K"},{"alphabet":"E"},{"alphabet":"A"}] -->
```
- filter
> 从数组中返回指定子集

*对象*
```js
{% raw %}
{{
    [{'firstname':'Kavlez','lastname':'Jin'},
        {'firstname':'Ken','lastname':'Jin'}] 
| filter:{'firstname': 'n'} }}
{% endraw %}
<!-- [{"firstname":"Ken","lastname":"Jin"}]  -->
```
*字符串*
```js
{% raw %}
{{['K','a','v','l','e','z'] | filter:'e' }}
{% endraw %} <!-- ["e"] -->
```
*date*
> 以指定格式显示时间。 

```js
$scope.today=new Date();

{% raw %}
{{today | date:'medium' }}
{% endraw %}<!--  Jan 24, 2015 5:36:38 PM    -->
{% raw %}
{{today | date:'short' }}
{% endraw %}<!--  1/24/15 5:36 PM    -->
{% raw %}
{{today | date:'fullDate' }}
{% endraw %}<!--  Saturday, January 24, 2015     -->
{% raw %}
{{today | date:'longDate' }}
{% endraw %}<!--  January 24, 2015   -->
{% raw %}
{{today | date:'mediumDate' }}
{% endraw %}<!--  Jan 24, 2015   -->
{% raw %}
{{today | date:'shortDate' }}
{% endraw %}<!--  1/24/15   -->
{% raw %}
{{today | date:'mediumTime' }}
{% endraw %}<!--  5:36:38 PM   -->
{% raw %}
{{today | date:'shortTime' }}
{% endraw %}<!--  5:36 PM   -->
{% raw %}
{{today | date:'yyyy' }}
{% endraw %}<!--  2015  -->
{% raw %}
{{today | date:'yy' }}
{% endraw %}<!--  15   -->
{% raw %}
{{today | date:'y' }}
{% endraw %}<!--  2015  -->
{% raw %}
{{today | date:'MMMM' }}
{% endraw %}<!--  January   -->
{% raw %}
{{today | date:'MMM' }}
{% endraw %}<!--  Jan   -->
{% raw %}
{{today | date:'MM' }}
{% endraw %}<!--  01  -->
{% raw %}
{{today | date:'M' }}
{% endraw %}<!--  1  -->
{% raw %}
{{today | date:'dd' }}
{% endraw %}<!--  24  -->
{% raw %}
{{today | date:'d' }}
{% endraw %}<!--  24  -->
{% raw %}
{{today | date:'EEEE' }}
{% endraw %}<!--  Saturday   -->
{% raw %}
{{today | date:'EEE' }}
{% endraw %}<!--  Sat   -->
{% raw %}
{{today | date:'HH'}}
{% endraw %} <!--  17  -->
{% raw %}
{{today | date:'H'}}
{% endraw %} <!--  17  -->
{% raw %}
{{today | date:'hh'}}
{% endraw %} <!--  05  -->
{% raw %}
{{today | date:'h'}}
{% endraw %} <!--  5  -->
{% raw %}
{{today | date:'mm' }}
{% endraw %}<!--  36  -->
{% raw %}
{{today | date:'m' }}
{% endraw %}<!--  36  -->
{% raw %}
{{today | date:'ss' }}
{% endraw %}<!--  38  -->
{% raw %}
{{today | date:'s' }}
{% endraw %}<!--  38  -->
{% raw %}
{{today | date:'.sss' }}
{% endraw %}<!--  .628  -->
{% raw %}
{{today | date:'a' }}
{% endraw %}<!--  PM  -->
{% raw %}
{{today | date:'Z' }}
{% endraw %}<!--  +0800   -->
{% raw %}
{{today | date:'MMMd, y' }}
{% endraw %}<!--  Jan24, 2015  -->
{% raw %}
{{today | date:'EEEE, d, M' }}
{% endraw %} <!--  Saturday, 24, 1  -->
{% raw %}
{{today | date:'hh:mm:ss.sss' }}
{% endraw %}<!--  05:36:38.628  -->    
{% raw %}
{{today | date:'medium' }}
{% endraw %}<!--  Jan 24, 2015 5:36:38 PM    -->
{% raw %}
{{today | date:'short' }}
{% endraw %}<!--  1/24/15 5:36 PM    -->
{% raw %}
{{today | date:'fullDate' }}
{% endraw %}<!--  Saturday, January 24, 2015     -->
{% raw %}
{{today | date:'longDate' }}
{% endraw %}<!--  January 24, 2015   -->
{% raw %}
{{today | date:'mediumDate' }}
{% endraw %}<!--  Jan 24, 2015   -->
{% raw %}
{{today | date:'shortDate' }}
{% endraw %}<!--  1/24/15   -->
{% raw %}
{{today | date:'mediumTime' }}
{% endraw %}<!--  5:36:38 PM   -->
{% raw %}
{{today | date:'shortTime' }}
{% endraw %}<!--  5:36 PM   -->
{% raw %}
{{today | date:'yyyy' }}
{% endraw %}<!--  2015  -->
{% raw %}
{{today | date:'yy' }}
{% endraw %}<!--  15   -->
{% raw %}
{{today | date:'y' }}
{% endraw %}<!--  2015  -->
{% raw %}
{{today | date:'MMMM' }}
{% endraw %}<!--  January   -->
{% raw %}
{{today | date:'MMM' }}
{% endraw %}<!--  Jan   -->
{% raw %}
{{today | date:'MM' }}
{% endraw %}<!--  01  -->
{% raw %}
{{today | date:'M' }}
{% endraw %}<!--  1  -->
{% raw %}
{{today | date:'dd' }}
{% endraw %}<!--  24  -->
{% raw %}
{{today | date:'d' }}
{% endraw %}<!--  24  -->
{% raw %}
{{today | date:'EEEE' }}
{% endraw %}<!--  Saturday   -->
{% raw %}
{{today | date:'EEE' }}
{% endraw %}<!--  Sat   -->
{% raw %}
{{today | date:'HH'}}
{% endraw %} <!--  17  -->
{% raw %}
{{today | date:'H'}}
{% endraw %} <!--  17  -->
{% raw %}
{{today | date:'hh'}}
{% endraw %} <!--  05  -->
{% raw %}
{{today | date:'h'}}
{% endraw %} <!--  5  -->
{% raw %}
{{today | date:'mm' }}
{% endraw %}<!--  36  -->
{% raw %}
{{today | date:'m' }}
{% endraw %}<!--  36  -->
{% raw %}
{{today | date:'ss' }}
{% endraw %}<!--  38  -->
{% raw %}
{{today | date:'s' }}
{% endraw %}<!--  38  -->
{% raw %}
{{today | date:'.sss' }}
{% endraw %}<!--  .628  -->
{% raw %}
{{today | date:'a' }}
{% endraw %}<!--  PM  -->
{% raw %}
{{today | date:'Z' }}
{% endraw %}<!--  +0800   -->
{% raw %}
{{today | date:'MMMd, y' }}
{% endraw %}<!--  Jan24, 2015  -->
{% raw %}
{{today | date:'EEEE, d, M' }}
{% endraw %} <!--  Saturday, 24, 1  -->
{% raw %}
{{today | date:'hh:mm:ss.sss' }}
{% endraw %}<!--  05:36:38.628  -->
```


## 自定义filter
> 如Controller那样，filter也最好不要全局满天飞，我们需要定义在一个module里面。
这里写一个简单的例子:

```js
var myApp = angular.module("myApp",[])
.filter('kavlezFilter',function(){
    return function(input){
        if(input){
            return 'Kavlez:\"'+input+'"';
        }
    }
});
```
> 使用该filter:

```js
{% raw %}
{{'Any time, Any where, Whoever or whatever you are, just bring it on'|kavlezFilter }}
{% endraw %}
```

> 输出:

```js
Kavlez:"Any time, Any where, Whoever or whatever you are, just bring it on"as
```

## 转载自:
[http://www.cnblogs.com/Kavlez/p/4246203.html](http://www.cnblogs.com/Kavlez/p/4246203.html)


-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

