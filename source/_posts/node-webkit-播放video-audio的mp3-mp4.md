title: "node-webkit 播放video/audio的mp3,mp4"
date: 2015-03-15 14:13:31
tags:
- node-webkit
---

# node-webkit 播放video/audio的mp3,mp4


> 替换node-webkit的解码器
> 使用chrome原版的替换
> linux上是 libffmpegsumo.so,Windows是 ffmpegsumo.dll

<!-- more -->

**node-webkit使用的chrome版本要和替换的chrome版本一样!!**

>  [下载windows版 `Chromium 41.0.2272.76` 的 `ffmpegsumo.dll`](https://raw.githubusercontent.com/xinshangshangxin/hexo-blog/gh-pages/other/node-webkit/ffmpegsumo.dll)

## 注意:
**chrome的解码器是付费的;so~~**

> 本地音乐的话把.mp3/.mp4转成.ogg


# 参考资料:
[http://kevinchen.synology.me/TechnicalDocuments/node-webkit/use_audio_video.html](http://kevinchen.synology.me/TechnicalDocuments/node-webkit/use_audio_video.html)

-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
