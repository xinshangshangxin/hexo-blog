title: "hexo无法输入双括号{{"
date: 2015-03-31 17:30:29
tags:
- hexo
---

> 在blog中使用了angularjs的代码,导致hexo 无法解析{ {}}
<!--more-->

# 解决办法
{% raw %}


> {% raw %}
> {% end_raw %} 
> 
> 替换上面的`end_raw` 为 `endraw`
> {% endraw %} 

最终如图所示:
![hexo](/img/hexo/hexo.png)
> 成功输入双括号

```js
{% raw %}{{  }}{% endraw %}
```



## 参考资料:
[http://hexo.io/docs/tag-plugins.html#Raw](http://hexo.io/docs/tag-plugins.html#Raw)
[https://github.com/hexojs/hexo/issues/1071](https://github.com/hexojs/hexo/issues/1071)


-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
