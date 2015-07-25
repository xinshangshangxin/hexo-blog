title: ConEmu设置当前目录打开右键菜单
date: 2015-02-22 20:26:44
description: cmder基于ConEmu,但是ConEmu没有直接设置当前目录打开的右键菜单
tags:
- ConEmu
---

# 前言
cmder 很好用,就是经常吞字和多字; 查了下,cmder基于ConEmu,就尝试了ConEmu

# ConEmu设置当前目录打开右键菜单
1. 打开设置 `win+alt+p` 或者 如图打开
![ConEmu](/img/conemu/2.png)
2. 打开Integreation 如图填写  
`cmd -cur_console:n %P`  
![ConEmu](/img/conemu/3.png)

3. 右键测试下吧~


# 注意事项
1. 在ConEmu 安装/解压 目录使用 无效!
2. 在 搜狗壁纸 等软件上 无效!  

*我测试的时候就是在ConEmu目录下 和 搜狗壁纸的桌面上测试;始终无效,捣鼓了好长时间...*


