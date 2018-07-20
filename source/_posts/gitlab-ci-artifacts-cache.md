---
layout: post
title: "GitLab CI 中 cache 和 artifacts 的区别"
date: 2018-07-21 16:51:41
tags:
  - GitLab
  - CI
---

## 使用准则
- 如果第二个 `job` 的依赖不存在, `job` 也能继续运行, 则使用 `cache`
- 如果第二个 `job` 的依赖必须存在, 则 使用 `artifacts`

## 主要区别
- `cache` 不一定命中, `artifacts` 肯定命中
- `artifacts` 可以设置自动过期时间,过期自动删除,`cache` 不会自动清理
- 默认 `artifacts` 会自动在不同的 `stage` 中传输; `artifacts` 会先传到 `GitLab` 服务器, 然后需要时再重新下载, 所以这部分也可以在 `GitLab` 下载和浏览

## 使用场景
- 如果 第二个 `job` 依赖 第一个 `job` 生成的内容, 使用 `cache` 通常会失败(因为不保证 `cache` 存在), 这时应当使用 `artifacts`, 在第二个 `job` 使用 `dependencies` 属性, 让第二个 `job` 使用第一个 `job` 中的内容
- 如果几个 `jobs` 都需要安装相同的依赖, 可以使用 `cache`, 可以加快依赖的安装进度, 即使 `cache` 不存在，`job` 也不会失败


## `artifacts` 使用 `demo`
```yml
image: docker:latest

services:
  - docker:dind

variables:
  CONTAINER_IMAGE: registry.gitlab.com/$CI_PROJECT_PATH

stages:
  - build
  - test
  - deploy
  # personal jobs
  - build_code
  - use_artifacts
  - disable_artifacts

build_code:
  stage: build_code
  artifacts:
    # 保存压缩包的名称
    name: "${CI_COMMIT_SHA}"
    # 要保存的文件的路径
    paths:
      - dist/
  script:
    - npm run build

use_artifacts:
  stage: use_artifacts
  script:
    # 默认会自动在不同的 `stage` 中传输, 所以这里的 dist 目录是存在的
    - ls ./

disable_artifacts:
  stage: disable_artifacts
  # 将 dependencies 设置为 [], 从而禁用artifacts
  dependencies: []
  script:
    # 无法 看到 dist 目录
    - ls ./
```


# 参考文档
[Pipeline - Failed to extract cache](https://gitlab.com/gitlab-com/support-forum/issues/2946#note_59414694)
[GitLab-CI中的artifacts使用研究](https://zacksleo.github.io/2017/04/18/GitLab-CI%E4%B8%AD%E7%9A%84artifacts%E4%BD%BF%E7%94%A8%E7%A0%94%E7%A9%B6/)  
<br>

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
