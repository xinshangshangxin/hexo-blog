---
layout: post
title: 'typescript + ava + nyc + gitlab CI/CD 实现代码覆盖率'
date: 2019-02-06 16:18:28
tags:
  - ava
  - nyc
  - typescript
  - gitlab
---

`typescript` `ava` `nyc` `gitlab ci` 实现代码覆盖率自动化以及 badges 显示

<!-- more -->

## 最终配置

- 在 `package.json` 添加以下

```json
{
  "scripts": {
    "coverage": "TS_NODE_FILES=true nyc ava --fail-fast -v"
  },
  "ava": {
    "compileEnhancements": false,
    "extensions": ["ts"],
    "require": ["ts-node/register"]
  },
  "nyc": {
    "include": ["src/**/*.ts"],
    "exclude": ["**/*.d.ts"],
    "extension": [".ts"],
    "require": ["ts-node/register"],
    "reporter": ["html", "text-summary"],
    "sourceMap": true,
    "instrument": true
  }
}
```

- 需要安装`source-map-support`, 在 `package.json` 同目录下运行`yarn add -D source-map-support` 或者 `npm install --save-dev source-map-support`

- 在 `gitlab-ci.yml` 添加一下内容

```yml
test-coverage:
  stage: test-coverage
  coverage: '/Lines\s*:\s*(\d+(?:\.\d+)?)%/'
  script:
    - yarn
    - yarn run coverage
```

## 配置详解

### ava 配置

`ava` 的配置 直接从官方文档 [typescript.md](https://github.com/avajs/ava/blob/master/docs/recipes/typescript.md)  的  动态编译部分获取  配置

**注意!!**

> 如果你写的 `typescript` 代码中 含有 `d.ts` 文件
> 需要加上环境变量 `TS_NODE_FILES=true`

### nyc 配置

从官方文档 [`tutorials/typescript`](https://istanbul.js.org/docs/tutorials/typescript/)部分得知需要配置 `extension` 为 `.ts`, 从 [nyc-mocha-typescript](https://azimi.me/2016/09/30/nyc-mocha-typescript.1.html)这篇文章得知, 需要 `source-map-support` 来映射 `ts` 和 `js`的代码关系
而 `reporter` 配置, 可以在 [alternative-reporters](https://istanbul.js.org/docs/advanced/alternative-reporters/) 选择自己需要的 `reporter`, 由于需要配合 `gitlab ci`, 这边需要选择 `text-summary` 方便 `glitlab` 分析

### gitlab 配置

从官方文档可知, 需要用正则表达式来截取最终的覆盖率, 由于用了 `text-summary` 的 `reporter`, 所以正则表达式为 `/Lines\s*:\s*(\d+(?:\.\d+)?)%/`

最后, 通过 URL `https://gitlab.com/<namespace>/<project>/badges/<branch>/coverage.svg` 来显示一个小图标, 比如 ![](https://gitlab.com/shang-music/music-api/badges/develop/coverage.svg)

## 完整例子

[music-api](https://gitlab.com/shang-music/music-api)
包含了 `ts` `ava` `nyc` `gitlab ci` `npm publish` 和 `badges`显示

# 参考文档

- [Setting up test coverage using Mocha, Istanbul, NYC with TypeScript](https://azimi.me/2016/09/30/nyc-mocha-typescript.1.html)
- [Using Istanbul With AVA](https://istanbul.js.org/docs/tutorials/ava/)
- [GitLab Docs test-coverage-parsing](https://docs.gitlab.com/ee/user/project/pipelines/settings.html#test-coverage-parsing)

---

> **文章若有纰漏请大家补充指正,谢谢~~**  
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG 殇
