---
title: Markdown 语法入门
tag: Markdown
date: 2022-9-7
author: cheng
---

Markdown官方文档在[**这里**](https://www.markdownguide.org/cheat-sheet/)

## 标题

    # 一级标题
    ## 二级标题
    ### 三级标题
    #### 四级标题
    ##### 五级标题

## 字体

正常  
*斜体*  
**粗体**  
~~删除体~~  
***斜体+粗体***  

    正常
    *斜体*
    **粗体**
    ~~删除体~~
    ***斜体+粗体***

## 引用

### 单行引用

> 单行引用  

    > 单行引用

### 多行引用

> 多行引用  
> 多行引用  
> 多行引用  

    > 多行引用
    > 多行引用
    > 多行引用

### 嵌套引用

> 嵌套引用  
>> 嵌套引用  
>>> 嵌套引用  

    > 嵌套引用  
    >> 嵌套引用  
    >>> 嵌套引用 


## 列表 

### 有序列表

1. 列表1
2. 列表2
3. 列表3

### 无序列表

- 列表1
- 列表2
- 列表3


## 代码块

### 使用缩进  

    width: 100%
    height: 100%
    

### 使用符号\`\`\` \`\`\`

``` javascript
var a = "a";
console.log(a);
```

## 表格

| name | age| address |
|:----|:-----:| :-----: |
| cheng| 25 | 广东省深圳市光明新区塘家社区张屋新村8巷8号家和苑|
| 月斌| 18 | 下背垌

    | name | age| address |
    |:----|:-----:| :-----: |
    | cheng| 25 | 广东省深圳市光明新区塘家社区张屋新村8巷8号家和苑|
    | 月斌| 18 | 下背垌

## 横线

### 使用\*\*\*

***
    ***

### 使用\-\-\-

---
    ---

## 链接

### 标签法

<https://www.baidu.com/>  

    <https://www.baidu.com/>

### 内联法

可以使用[`百度`](https://www.baidu.com/ "链接标题")

    可以使用[百度](https://www.baidu.com/ "链接标题")

### 引用法
还可以使用[雅虎][1]

[1]: https://www.baidu.com/

    还可以使用[雅虎][1]
    [1]: https://www.baidu.com/


## 图片

语法: 
    普通图片:  ![图片无法显示时显示的文字](imagePath "title")
    链接图片： [![图片无法显示时显示的文字](imagePath "title")](外部链接url)

图片前的文字。

[![vbAsBT.jpg](http://cloudy-image.test.upcdn.net/image/20220907.jpg)](https://console.upyun.com/services/cloudy-image/filemanage/)

图片后的文字。

## 注释

[1]: 我是注释
[123]: (我是注释)
[a]: (我是注释)
[abc]: (我是注释)

    [1]: (注释，不会在浏览器中显示)
    [123]: (我是注释)
    [a]: (我是注释)
    [abc]: (我是注释)