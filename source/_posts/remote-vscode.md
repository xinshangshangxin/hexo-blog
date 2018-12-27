---

layout: post
title: "使用 vscode 编辑远程文件"
date: 2018-07-11 15:33:39
tags:
  - vsc


---

使用vim编辑文件不是很顺手, 利用 vscode 插件实现本地编辑远程文件
<!-- more -->



## 安装 `Remote VSCode`
1. 打开 [marketplace](https://marketplace.visualstudio.com/items?itemName=rafaelmaiolla.remote-vscode), 点击 `Install`, 安装后重启 `vsc`
2. 按照 [bash rmate](https://github.com/aurora/rmate) 文档, 在 **远程服务器** 上 安装 rmate
  ```bash
  sudo wget -O /usr/local/bin/rmate https://raw.github.com/aurora/rmate/master/rmate
  sudo chmod a+x /usr/local/bin/rmate
  ```

## 使用
1. 在本机 `vscode` 窗口中, 按键 `F1`, 输入 `Remote: Start server`, 回车后启动 `Remote VSCode` 服务
2. 在命令行中输入 `ssh -R 52698:127.0.0.1:52698 user@example.com -p ssh_port`
3. 在命令行中输入 `rmate file`

## 配置
在 `vscode` 中 打开 `User Setttings`, 搜索 `remote vscode` 修改相关配置
![配置](/img/remote-vscode/001.png)


## 参考文档
- [marketplace remote-vscode](https://marketplace.visualstudio.com/items?itemName=rafaelmaiolla.remote-vscode)
- [Remote File Editing Over SSH with Visual Studio Code](https://spin.atomicobject.com/2017/12/18/remote-vscode-file-editing/)
- [Editing files in your Linux Virtual Machine made a lot easier with Remote VSCode](https://medium.com/@prtdomingo/editing-files-in-your-linux-virtual-machine-made-a-lot-easier-with-remote-vscode-6bb98d0639a4)
<br>


> **文章若有纰漏请大家补充指正,谢谢!**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
