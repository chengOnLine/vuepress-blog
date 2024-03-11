---
title: Vue3+Vite 入门
tags: 
- vue3
- vite
date: 2023-5-12
author: cheng
--- 

## 搭建环境
    node: v14.17.3
    npm: v6.14.13

## 创建项目

    npm create vite@latest <project-name> --template vue

## 安装插件
    vue-router
    sass
    moment
    axios
    elementplus

## 踩坑

### 创建 vue3+vite 项目

    npm init vue@latest vue3官方示例，node16+

    npm create vite@latest <project-name> --template vue vite官方实例， node14亲测可用

### require is not define
    require 是CommonJS写法vite不支持，静态资源的引用可以参考vite官方文档

### 使用vite打包后不能在浏览器里访问 node内置模块

    问题：Module "crypto" has been externalized for browser compatibility. Cannot access "crypto.createHash" in client code. (node的内置模块 crypto 用不了从而 导致 ase-gcm 加密失败)

    解决方法一（ 未起效 ）：使用 vite-plugin-optimizer
    import optimizer from 'vite-plugin-optimizer';
    export default defineConfig({
        plugins: [
            vue(),
            optimizer({
                crypto: () => ({
                    find: /^crypto$/,
                    code: `const crypto = require('crypto'); export { crypto as default }`,
                }),
            }),
        ],
    });

    解决方法二（ 亲测有效）： 使用第三方库 js-md5 和 asmcrypto.js 实现 aes-gcm 加解密，具体如下
    
 ```
    //aes-gcm 加密 
    aesGCMen(word, key, Biv){
        let currentUser = useAppStroe().currentUser;
        if (!word) {
            return ''
        }
        if (typeof word != 'string') {
            word = JSON.stringify(word)
        }
        const encoder = new TextEncoder()
        const msg = encoder.encode(word);
        const iv = encoder.encode(Biv ? Biv : currentUser.commonIVSeed);

        const md5Instance = md5.create();
        const result = new Buffer( md5Instance.update(key).digest() );

        // vite 下 node里的crypto模块用不了且第三方库 crypto-browserify 中的createHash方法会报错 
        // const md5 = crypto.createHash('md5');
        // const result = md5.update(key ? key : currentUser.commonKey).digest();

        let data = asmcrypto.AES_GCM.encrypt(msg, result, iv);
        const enRes = new Buffer(data).toString('base64');
        return enRes;
    }

    // aes-gmc 解密
    aesGCMde(word , key , Biv){
        let currentUser = useAppStroe().currentUser;
        if (!word) {
            return ''
        }
        const encoder = new TextEncoder()
        let utf8decoder = new TextDecoder();
        const iv = encoder.encode(Biv ? Biv : currentUser.commonIVSeed);

        const md5Instance = md5.create();
        const result = new Buffer( md5Instance.update(key).digest() );

        // const md5 = crypto.createHash('md5');
        // const result = md5.update(key ? key : currentUser.commonKey).digest();

        const b = Buffer.from(word,'base64');
        const deRes = utf8decoder.decode( asmcrypto.AES_GCM.decrypt(b, result, iv) );
        return deRes;
    }
```

### 使用jsx语法

    使用 @vitejs/plugin-vue-jsx 插件 配合 <script lang=jsx></script> 即可实现