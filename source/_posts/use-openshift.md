layout: post
title: openshift使用记录
date: 2016-03-27 16:01:09
description: coding演示平台开始收费,转战openshift, 在上面安装zsh等软件
tags:
- node
- openshift
---

# 利用openshift自带的Node.js

## 1,注册&&登录
![](/img/openshift/1.png)

## 2,创建应用,选择noejs版本
![](/img/openshift/2.png)
![](/img/openshift/3.png)

## 3,详细内容填写(如果新手,可以在导入代码处留空,openshift会创建一个demo程序)
![](/img/openshift/4.png)

## 4,点击 `Create Application`后, **等待较长时间** 后才会进入管理面板

# DIY(当作linux服务器使用)

## 1,在创建应用时选择 DO-It-Yourself
![](/img/openshift/6.png)

## 2,DIY之前的内容补充: 
a: `openshift` 变量
```bash
$OPENSHIFT_REPO_DIR    //ssh提交代码的位置
$OPENSHIFT_DATA_DIR    // 一些数据存储的位置
$OPENSHIFT_DIY_IP     // 外网绑定IP
```

b: 剩余容量
```plain
du -h | sort -rh | head -10    // 查找前10的文件/文件夹
quota -s                       // 查看总量
```

## 3,添加/设置 `ssh key`
![](/img/openshift/7.png)

## 4,链接openshift服务器
![](/img/openshift/8.png)
![](/img/openshift/9.png)

## 5,安装软件

### 设置HOME目录(某些目录无权限,需要设置到`OPENSHIFT_DATA_DIR`才能写入)
```bash
# 设置目录
HOME=$OPENSHIFT_DATA_DIR
# 将目录设置写入bash_profile
echo "export HOME=\"$OPENSHIFT_DATA_DIR\"" >> $OPENSHIFT_DATA_DIR/.bash_profile
```

### 安装[linuxbrew](https://github.com/Linuxbrew/linuxbrew)(openshift下无法使用 `yum` 和 `apt-get`)
```bash
# 安装  
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/linuxbrew/go/install)"
# 禁用更新
sed -i 's/^# DISABLE_AUTO_UPDATE="true"/DISABLE_AUTO_UPDATE="true"/g' ~/.zshrc
# 环境配置
echo 'export PATH="'$OPENSHIFT_DATA_DIR'.linuxbrew/bin:$PATH"' >> $OPENSHIFT_DATA_DIR/.bash_profile
# 启用配置
source $OPENSHIFT_DATA_DIR/.bash_profile
```

## 6,安装zsh 和 oh-my-zsh 
a: 安装 zsh (比较慢)
`brew install zsh`
b: 安装 [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh), 需要删除官方脚本中下面4行:
![](/img/openshift/10.png)

或者下载 [修改好的脚本openshift-oh-my-zsh](/other/openshift-oh-my-zsh/openshift-oh-my-zsh.sh)

c: 设置环境变量
```bash
# 默认启动 zsh
echo 'exec '$OPENSHIFT_DATA_DIR'.linuxbrew/bin/zsh -l' >> $OPENSHIFT_DATA_DIR/.bash_profile
# 将 上面linuxbrew的环境变量加入 .zshrc
echo 'export PATH="'$OPENSHIFT_DATA_DIR'.linuxbrew/bin:$PATH"' >> $OPENSHIFT_DATA_DIR/.zshrc
# 启用zsh
source $OPENSHIFT_DATA_DIR/.bash_profile
```

## 7,安装mongo

```bash
# 下载
wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.2.0.tgz
# 解压 && 移动文件
tar -zxvf mongodb-linux-x86_64-3.2.0.tgz
mkdir softer
mv mongodb-linux-x86_64-3.2.0 softer/mongodb
# 配置环境变量
echo 'export PATH="'$OPENSHIFT_DATA_DIR'softer/mongodb/bin:$PATH$PATH"' >> $OPENSHIFT_DATA_DIR/.zshrc
# fork模式启动mongo
mongod --bind_ip  $OPENSHIFT_DIY_IP --dbpath=$OPENSHIFT_DATA_DIR""data/mongodb --logpath $OPENSHIFT_DATA_DIR""data/mongodb.log  --fork
```

## 8,安装 nvm (node版本管理器)
```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
echo 'export NVM_DIR="/root/.nvm"' >> $OPENSHIFT_DATA_DIR/.zshrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm' >> $OPENSHIFT_DATA_DIR/.zshrc
exec zsh -l
nvm install 0.12.7
nvm alias default 0.12.7
```

## 9,停止自带的ruby占用8080端口
```bash
ps -aux
# 找到PID,kill掉
kill -9 xxxPID
```


#  -

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇