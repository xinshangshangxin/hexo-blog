---

layout: post
title: github project use travis npm publish
date: 2018-05-16 18:02:00
tags:
    - travis


---

github的项目使用travis发布npm包
<!-- more -->





## 获取 npm token
1. 在 [https://www.npmjs.com/](https://www.npmjs.com/) 注册/登录
2. 右上角点击头像 => `Tokens` 进入 `Tokens` 编辑页
 ![](/img/travis-npm/001.png)
3. 新增一个token, 记得保存这个token, 后面无法再次查看, 只能新增

## 配置 travis
1. 进入 [https://travis-ci.org/](https://travis-ci.org/), 注册 或者 使用 GitHub登录(右上角`Sign in with GitHub`)
2. 进入 [https://travis-ci.org/profile/](https://travis-ci.org/profile/) 页面, 选择 你要自动构建的项目, 左侧可以切换组织项目
3. 如下图, 勾选开启构建
 ![](/img/travis-npm/002.png)
4. 点击要构建的项目, 右上角点击 `Settings`
 ![](/img/travis-npm/003.png)
5. 在 `Environment Variables` 中 添加 `NPM_EMAIL` (你npm账户的邮箱) 和 `NPM_TOKEN` (上面获取的 token)
 ![](/img/travis-npm/004.png)

## 配置项目代码
在项目中添加 `.travis.yml`
```yml
language: node_js                # 使用 nodejs
node_js:                         # 版本为 8
  - "8"

cache: yarn                      # 使用 yarn 而不是 npm (按照实际情况调整)
install: yarn

jobs:                            # 添加 job
  include:
    - stage: npm release   
      if: tag IS present         # 如果 push的代码 存在 tag
      node_js: "8"               # 使用 8.x 的 node
      script: yarn compile       # 执行 yarn compile 命令(按照实际情况调整)
      before_deploy:             # 在 发布之前, 执行命令(按照实际情况调整)
        - cd dist
      deploy:
        provider: npm
        email: "$NPM_EMAIL"
        api_key: "$NPM_TOKEN"
        skip_cleanup: true       # 为了防止 Travis CI 清理额外的文件夹并删除你做的改变
        on:
          tags: true
```

## 提交你的代码到 github
1. 先commit 你的正常修改
2. `npm version patch/minor/major` 更新你的版本
   比如 使用 `npm version patch`, 会执行 
   a) `package.json` 中插入（更新）的版本号
   b) 创建一个新的提交
   c) 创建一个 git 标签
3. `git push origin master --tag`, push你的代码到github上, 同时把tag也


## 去 `travis` 查看是否 开始构建, 并查看构建是否成功




# 参考文档
[使用 Travis CI 自动发布 npm](https://github.com/xitu/gold-miner/blob/master/TODO/automated-npm-releases-with-travis-ci.md)  
<br>

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

