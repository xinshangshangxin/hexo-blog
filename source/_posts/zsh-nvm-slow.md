---
layout: post
title: "使用nvm导致zsh启动慢"
description: "解决nvm启动慢, 自动检测 `.nvmrc` 慢"
date: 2017-06-07 21:42:21
tags:
- nvm
- zsh
---

## 问题
新建终端时, 由于载入nvm, 导致终端载入超过1秒.
在nvm安装时, 要求在在 `~/.bash_profile, ~/.zshrc, ~/.profile, ~/.bashrc` 中的一个载入以下内容

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
```
              
就是`. "$NVM_DIR/nvm.sh"`拖慢了终端的启动


## 解决方案
从官方 [issue#860](https://github.com/creationix/nvm/issues/860)上了解到, 可以使用 `--no-use` 和 手动指定默认 `node` 路径来加快执行速度  


```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  --no-use
export PATH=$HOME/.nvm/versions/node/v8.0.0/bin/:$PATH
```

*默认路径可以通过 `nvm which default` 获取*


## 检查 .nvmrc 自动载入对应node版本处理
通过判断是否首次载入来加快速度

```bash
# 自动切换node版本 #
nvmVersionFirstDetect=1;
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [[ ${nvmVersionFirstDetect} -eq 0 && "$node_version" != "$(nvm version default)" ]]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
  nvmVersionFirstDetect=0
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

![load-nvmrc](/img/zsh-nvm-slow/1.png)

# 参考文档
- [解决nvm导致终端启动慢的问题
](http://mushanshitiancai.github.io/2016/07/29/js/tools/%E8%A7%A3%E5%86%B3nvm%E5%AF%BC%E8%87%B4%E7%BB%88%E7%AB%AF%E5%90%AF%E5%8A%A8%E6%85%A2%E7%9A%84%E9%97%AE%E9%A2%98/)


-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇