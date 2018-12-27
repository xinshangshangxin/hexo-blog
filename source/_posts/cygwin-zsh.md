---
title: "cygwin下zsh安装"
date: 2015-10-30 09:03:16
tags:
- ConEmu
- cygwin



---

cygwin下zsh安装
<!-- more -->




相关文章
[ConEmu设置当前目录打开右键菜单](http://blog.xinshangshangxin.com/2015/02/22/ConEmu%E8%AE%BE%E7%BD%AE%E5%BD%93%E5%89%8D%E7%9B%AE%E5%BD%95%E6%89%93%E5%BC%80/)
[cygwin配置记录](http://blog.xinshangshangxin.com/2015/05/10/cygwin%E9%85%8D%E7%BD%AE%E8%AE%B0%E5%BD%95/)

## 安装 [`apt-cyg`](https://github.com/transcode-open/apt-cyg)(类似linux的 `apt-get`)

```bash
lynx -source rawgit.com/transcode-open/apt-cyg/master/apt-cyg > apt-cyg
install apt-cyg /bin
```

##  安装zsh

> mac/linux 有 [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh), 在cygwin有[oh-my-cygwin](https://github.com/haithembelhaj/oh-my-cygwin);安装`oh-my-cygwin`命令:

```bash
wget --no-check-certificate https://raw.github.com/haithembelhaj/oh-my-cygwin/master/oh-my-cygwin.sh -O - | sh
```

> 安装过程中出现 `apt-cyg` 安装失败(可能是脚本里面地址写错了);但是上面已经安装过了 `apt-cyg`, 故注释安装 `apt-cyg`的代码,修改脚本,文件名为 `oh-my-cygwin.sh`, 内容为:

```bash
	#!/bin/bash
	set -e

	# cd home
	cd ~

	SIMPLE_BACKUP_SUFFIX=".orig"
	APT_CYG="$(mktemp /tmp/apt-cyg.XXXXXXXX)"

	# # install apt-cyg
	# wget --no-check-certificate "https://github.com/john-peterson/apt-cyg/raw/path/apt-cyg" -O "${APT_CYG}"
	# chmod +x "${APT_CYG}"

	# install some stuff like vim and git
	apt-cyg install zsh mintty vim curl git openssh


	# install OH MY ZSH
	git clone https://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh

	# Create initial /etc/zshenv
	[[ ! -e /etc/zshenv ]] && echo export PATH=/usr/bin:\$PATH > /etc/zshenv

	install --backup ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc

	#setting up vim
	VIMRC_EXAMPLE=`find /usr/share/vim -type f -name vimrc_example.vim | head -n 1`
	if [ ! -f ~/.vimrc ] && [ -n "${VIMRC_EXAMPLE}" ]
	then
	  install "${VIMRC_EXAMPLE}" ~/.vimrc
	fi

	# install apt-cyg
	install --backup "${APT_CYG}" /bin/apt-cyg

	# setting up zsh as default
	sed -i "s/$USER\:\/bin\/bash/$USER\:\/bin\/zsh/g" /etc/passwd

	# et voila just start it
	/usr/bin/env zsh
```

> 然后执行 `./oh-my-cygwin.sh`后成功安装


##  在 `ConEmu` 下设置窗口默认打开 `zsh`

`SET CHERE_INVOKING=1 & "你的cygwin安装目录\bin\zsh -l -i" -cur_console:t:"cygwin terminal"`


![设置 ConEmu下设置窗口默认打开zsh](/img/conemu/11.png)

## 在 `ConEmu` 下设置右键当前目录打开 `zsh`

`SET CHERE_INVOKING=1 & "你的cygwin安装目录\bin\zsh -l -i" -cur_console:t:"cygwin terminal"`

![在ConEmu下设置右键当前目录打开zsh](/img/conemu/12.png)

##  在 `ConEmu` 下设置 只打开一个窗口, 全部以标签形式打开


![在 ConEmu下设置 只打开一个窗口](/img/conemu/13.png)


