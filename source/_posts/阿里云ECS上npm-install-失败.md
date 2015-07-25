title: 阿里云ECS上npm install 失败
date: 2015-03-04 22:24:13
tags: 
- ECS
- npm
---

> 昨天没问题,今天重装系统后就出现问题了

```js
error Error: CERT_UNTRUSTED
error     at SecurePair.<anonymous> (tls.js:1370:32)
error     at SecurePair.EventEmitter.emit (events.js:92:17)
error     at SecurePair.maybeInitFinished (tls.js:982:10)
error     at CleartextStream.read [as _read] (tls.js:469:13)
error     at CleartextStream.Readable.read (_stream_readable.js:320:10)
error     at EncryptedStream.write [as _write] (tls.js:366:25)
error     at doWrite (_stream_writable.js:221:10)
error     at writeOrBuffer (_stream_writable.js:211:5)
error     at EncryptedStream.Writable.write (_stream_writable.js:180:11)
error     at write (_stream_readable.js:583:24)
error If you need help, you may report this *entire* log,
```
> 谷歌得知是ssl 的问题,
> 所以解决办法:

```js
npm config set strict-ssl false
```

> 成功~~~
