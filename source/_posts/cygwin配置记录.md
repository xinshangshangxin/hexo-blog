---
title: "cygwin配置记录"
date: 2015-05-10 21:59:46
tags:
- cygwin
- ConEmu


---

cygwin setting
<!-- more -->



## ls/grep/dir输出彩色显示
调整 `${HOME}/.bashrc`文件(`安装位置:\cygwin64\home\你的用户名\.bashrc`)，把注释掉别名打开：

```js
# 第98行左右开始
# Default to human readable figures
 alias df='df -h'
 alias du='du -h'
#
# Misc :)
# alias less='less -r'                          # raw control characters
 alias whence='type -a'                        # where, of a sort
 alias grep='grep --color'                     # show differences in colour
 alias egrep='egrep --color=auto'              # show differences in colour
 alias fgrep='fgrep --color=auto'              # show differences in colour
#
# Some shortcuts for different directory listings
 alias ls='ls -hF --color=tty'                 # classify files in colour
 alias dir='ls --color=auto --format=vertical'
 alias vdir='ls --color=auto --format=long'
 alias ll='ls -l'                              # long list
 alias la='ls -A'                              # all but . and ..
 alias l='ls -CF'                              #
```

### git输出（比如log、status）彩色显示

```js
git config --global color.ui auto
```
## 配置盘符的链接
```js
ln -s /cygdrive/c /c
ln -s /cygdrive/d /d
ln -s /cygdrive/e /e
```

## 自动补全不区分大小写
> ~/.bashrc文件(`安装位置:\cygwin64\home\你的用户名\.bashrc`)中添加：
```js
shopt -s nocaseglob
```
> ~/.inputrc文件中添加：
```js
set completion-ignore-case on
```

## 在cygwin的打开指定文件或文件夹到文件浏览器
> ~/.bashrc文件 最后加上
```js
function xpl {
     if [ "$1" = "" ]; then
         XPATH=.   # 缺省是当前目录
     else
         XPATH=$1
         XPATH="$(cygpath -C ANSI -w "$XPATH")";
     fi
     explorer $XPATH
}
```
> 使用说明
```js
xpl                 # explorer打开当前目录
xpl /usr/bin/       # explorer打开指定目录
xpl video.avi       # 使用 Windows 默认程序打开文件
```
----------

## sub 使用sublime 打开
> 路径 `D:\cygwin64\usr\local\bin`下添加 sub 文件
```js
/cygdrive/c/Program\ Files/Sublime\ Text\ 3/sublime_text.exe $1 &
```
> 其他快捷命令也可以自行配置

# 和conMenu配合使用
## 当前目录打开右键菜单
1. [首先请打开链接设置ConEmu设置当前目录打开右键菜单](http://blog.xinshangshangxin.com/2015/02/22/ConEmu%E8%AE%BE%E7%BD%AE%E5%BD%93%E5%89%8D%E7%9B%AE%E5%BD%95%E6%89%93%E5%BC%80/)
2. 设置cygwin在conEmu作为默认打开
>   setting -> Startup -> Tasks
```js
SET CHERE_INVOKING=1 & "D:\cygwin64\bin\bash --login -ii" -cur_console:t:"cygwin terminal"

// 替换 D:\cygwin64\bin\bash 为你的安装路径
```
![配置图片~~](/img/conemu/cc.png)




## 参考资料

- [惊艳的cygwin——Windows下的Linux命令行环境的配置和使用](http://oldratlee.com/post/2012-12-22/stunning-cygwin)
- [Cygwin 安装配置笔记](http://www.joshuazhang.net/posts/2014/cygwin-cfg-note.html#_3)
- [How do I configure ConEmu to run Cygwin Bash?](https://superuser.com/questions/591206/how-do-i-configure-conemu-to-run-cygwin-bash)


-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

