# tinyjs-plugin-audio

> Tiny.js 音效插件

## 查看demo

`demo/index.html`

## 引用方法

- 推荐作为依赖使用

  - `npm install tinyjs-plugin-audio --save`

- 也可以直接引用线上cdn地址，注意要使用最新的版本号，例如：

  - https://a.alipayobjects.com/g/tiny-plugins/tinyjs-plugin-audio/0.0.4/index.js
  - https://a.alipayobjects.com/g/tiny-plugins/tinyjs-plugin-audio/0.0.4/index.debug.js

## 起步
首先当然是要引入，推荐`NPM`方式，当然你也可以使用`CDN`或下载独立版本，先从几个例子入手吧！

##### 1、最简单的例子

引用 Tiny.js 源码
``` html
<script src="http://tinyjs.net/libs/tiny.debug.js"></script>
```
``` js
require('tinyjs-plugin-audio');
// 或者
// import audio from 'tinyjs-plugin-audio';

// 加载音频并获取 Audio 对象
Tiny.Loader.add([
  {name: 'music', url: 'https://os.alipayobjects.com/rmsportal/aVTYsHoGDVBnqXKuYDrs.mp3'}
]).load(function(){
  var music = Tiny.audio.manager.getAudio('music');
  // music.play();
  // music.stop();
});
```

## 依赖
- `Tiny.js`: [Link](http://tinyjs.net/#/docs/api)

## API文档

TODO
