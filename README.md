用于sdenv补环境框架与真实浏览器加载网页的共有处理.

## 打包

运行命令`npm run build`打包生成两个文件：

1. 浏览器使用文件：`sdenv-extend.min.js`
2. NodeJS的commonJS使用文件：`sdenv-extend.js`

## 网页端

1. head内引入：`<script type="text/javascript" charset="utf-8" src="/path/to/sdenv-extend.min.js"></script>`
2. 初始化：`sdenv(cfg)`

## commonJS引入

1. 安装包：`npm install sdenv-extend`
2. 导入：`const sdenv = require('sdenv-extend')`
3. 初始化(补环境框架需要传入window对象)：`sdenv(cfg, window)`

## 使用

初始化完成后会生成`Object.sdenv`对象

对于node中可以通过`const sdenv = require('sdenv-extend')()`(需要注意，第一次初始化之后才能用这种方法)或者通过`window.Object.sdenv`取到
