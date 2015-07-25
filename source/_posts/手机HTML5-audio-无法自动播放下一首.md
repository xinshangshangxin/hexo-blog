title: 手机HTML5 audio 无法自动播放下一首
date: 2015-03-19 19:17:55
tags:
- html5
---

在PC的chrome上下一首很好的工作;但是在Android的chrome上出现了手动切换下一首无问题,自动切换下一首无法播放问题

<!-- more -->

# 解决办法
**不在网页里面直接写`<audio>`**

> 原来代码: 

```js
if (audio) {
  document.body.removeChild(audio);
}
audio = document.createElement('audio');
audio.innerHTML = '<source src=' + audioobj.mp3 + '>';
document.body.appendChild(audio);
audio.play();
```

> 修改后的代码

```js
if (audio) {
  // 把audio.src设为null，并显式调用audio.load()，
  // 此时对于Android会中断数据读取
  audio.src = null;
  audio.load();
}
else {
  //  通过new
  audio = new Audio();
}

audio.src = audioobj.mp3;
audio.play();
```



# 参考资料:
- [http://www.86y.org/art_detail.aspx?id=720](http://www.86y.org/art_detail.aspx?id=720)

-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
