title: iTerm2
date: 2015-09-13 21:49:26
description: iTerm2折腾笔记
tags:
- iTerm2
---

## 下载
[https://www.iterm2.com/](https://www.iterm2.com/)

## 一些配置

- 保存ssh远程登录指令(1)
- 打开新窗口自动定位到使用tab键所在的目录(2)

![shang](/img/iterm2/3.png)

- 每次新打开终端都会固定出现在屏幕的顶端且不会有窗口边框

![shang](/img/iterm2/1.png)

- 背景透明度

![shang](/img/iterm2/2.png)


- 使用 `option` + '->' 在单词间跳转

```js
1. 设置左 `option`
2. Keyboard Shortcut: ⌥←
	Action: Send Escape Sequence
	Esc+: b
3. Keyboard Shortcut: ⌥→
	Action: Send Escape Sequence
	Esc+: f
```

![shang](/img/iterm2/4.png)


- 全局快捷键
![shang](/img/iterm2/7.png)

## 快捷键

### 标签页操作

- 新建标签页: `Command + T`
- 关闭标签页: `Command + W`
- 窗口切换: `Command + 方向键  或   Command + 窗口编号`

### 面板操作

- 垂直分割: `Command + D`
- 水平分割: `Shift + Command + D`
- 前一个面板: ` Command + [`
- 后一个面板: ` Command + ]`
- 切换到上/下/左/右面板: `Option + Command + 上下左右方向键`

### 搜索查找

- `⌘ + f`查找。支持正则。
其中查找的内容会被自动复制(鼠标去选中的内容也会自动复制,也可以鼠标中键直接粘贴)  
键入搜索关键词，然后用`shift+tab`或者`tab`左右自动补全   
`option + enter` 则自动将搜索结果键入,并且复制到剪贴板

- `⌘ + opt + e` Expose标签

![shang](/img/iterm2/8.png)

- `Command + /`: 查看当前终端中光标的位置

- ``⌘ + opt + b` :快照回放, 对你的操作根据时间轴进行回放. 可以拖动下方的时间轴，也可以按左右方向键

- `Command + shift + H` iterm2将自动列出剪切板的历史记录

### 其他功能

- 进入和退出全屏: `Command + Enter`
- 开启和关闭背景半透明: `Command + U`
- 清屏（其实是滚到新的一屏，并没有清空）: `Command + R`
- 清屏: `Ctrl+L`
- 清空当前行，无论光标在什么位置: `ctrl + U`
- 到行首: `ctrl + A  或 fn + 左方向键`
- 到行末: `ctrl + E 或 fn + 右方向键`
- 搜索命令历史: `ctrl + R`
- 调整字体大小: `⌘ + —/+/0`
- 命令自动补全: `Command + ;`（很少用这个)


## 文本选取

- 常见的点击并拖拽方式
- 双击选取整个单词
- 三击选取整行
- 选取某一部分，按住Shift，再点击某处，可以选取整个矩形内的文本（类似Windows下按住Shift可以批量选取图标）
- 按住Command + Option，可以用鼠标画出一个矩形，用类似截图的方式选取文本 另外，还可以使用鼠标完成以下操作： 
- 按住Command然后点击某个URL，会在浏览器中打开这个URL，
- 点击某个文件夹，会在Finder里打开这个文件夹
- 点击某个文件名，会打开这个文件（文本文件支持MacVim，TextMate和BBEdit，如果后面跟随一个冒号和行号，文件会在行号处打开，其它格式的文件似乎不能调用默认程序打开） 

## 标签变色

> iTerm2 的标签的颜色会变化,以指示该 tab 当前的状态.当该标签有新输出的时候,
> 标签会变成洋红色;新的输出长时间没有查看,标签会变成红色.可在设置中关掉该功能

## 配色

自行研究 [http://iterm2colorschemes.com/](http://iterm2colorschemes.com/)

# 参考文档

- [https://coderwall.com/p/h6yfda/use-and-to-jump-forwards-backwards-words-in-iterm-2-on-os-x](https://coderwall.com/p/h6yfda/use-and-to-jump-forwards-backwards-words-in-iterm-2-on-os-x)
- [http://pengjunjie.com/articles/mac-soft-iterm2/](http://pengjunjie.com/articles/mac-soft-iterm2/)
- [http://wulfric.me/2015/08/iterm2/](http://wulfric.me/2015/08/iterm2/)
- [http://www.wangyuxiong.com/archives/52137](http://www.wangyuxiong.com/archives/52137)
- [http://xingrz.me/2013/2013-06-19/terminal-zhuangbility.html](http://xingrz.me/2013/2013-06-19/terminal-zhuangbility.html)
  


      

-----------------------

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
