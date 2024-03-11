---
title: 手撕原生虚拟列表
tags: 
- js
date: 2023-12-22
author: cheng
--- 

#  手撕原生虚拟列表

## 入门 (列表项定高)

1. 列表项定高 ，取列表容器高度 ，进而求得可视列表项数量 maxNum = Math.ceil( height / itemHeight ) + 1 。ps：maxNum可以适当设置大点
2. 因为列表项定高，所以很容易算出总列表高度 height = itemHeight * total 。
3. 绑定鼠标滚动事件， 通过 scrollTop 计算 startIndex , 再结合 maxNum 求得 endIndex , endIndex = Math.min( startIndex + maxNum , data.length -1 ) 。ps: 注意边界情况
4. 计算偏移量 offset(用于设置paddingTop) 。 offset = startIndex * itemHeight;
5. 渲染列表项，将计算好的总列表高度和偏移量设置到样式中，模拟真实的滚动效果。
6. 每次滚动重新渲染列表项。 

优化：
1. 减少render次数，缓存监听startIndex改变后再重新render。
2. 使用节流函数，优化滚动事件。
3. 设置缓存区，解决空白问题

源码：
```js
class VirtualList{
    constructor(containerDomId , listDomId){
        this.containerEl = document.getElementById(containerDomId);
        this.listEl = document.getElementById(listDomId);
        this.startIndex = 0;
        this.endIndex = 0;
        this.maxNum = 0; // 最大容纳量
        this.viewHeight = 0;
        this.itemHeight = 100;
        this.scrollStyle = {}   
        this.sourceList = [1,2,3,4,5,6,7,8];
        this.renderList = [];
        this.init();   
    }

    init(){
        this.viewHeight = this.listEl.offsetHeight;
        this.maxNum = Math.ceil(this.viewHeight / this.itemHeight) + 1;
        this.bindScrollEvent();
        this.render();
    }

    bindScrollEvent(){
        this.containerEl.addEventListener('scroll' , this.rafThrottle( this.handleScroll.bind(this) ))
    }

    handleScroll(){
        const { scrollTop } = this.containerEl;
        this.startIndex = Math.floor(scrollTop / this.itemHeight);
        this.render();
    }

    computedEndIndex(){
        const end = this.startIndex + this.maxNum;
        this.endIndex = this.sourceList[end] ? end : this.sourceList.length-1;
    }

    computedSrollStyle(){
        this.scrollStyle = {
            height: `${ this.sourceList.length * this.itemHeight }px`,
            // transform: `translate3d(0, ${this.startIndex * this.itemHeight }px, 0)`,
            paddingTop:  `${this.startIndex * this.itemHeight }px`,
        }
    }

    computedRenderList(){
        this.renderList = this.sourceList.slice( this.startIndex , this.endIndex+1 );
    }

    rafThrottle(fn) {
        let lock = false;
        return function (...args) {
            if (lock) return;
            window.requestAnimationFrame(() => {
                fn.apply(this, args);
                lock = false;
            });
            lock = true;
        };
    }

    render(){   
        this.computedEndIndex();
        this.computedRenderList();
        this.computedSrollStyle();
        const template = this.renderList.map((i) => `<div id="virtual-item-wrapper">${i}</div>`).join("");
        this.listEl.innerHTML = template;
        this.listEl.style.height = this.scrollStyle.height; 
        this.listEl.style.paddingTop = this.scrollStyle.paddingTop ;
    }
}
```


## 进阶 (列表项不定高)

1. 定义一个数据结构 position 用于存放每个列表项的位置信息和高度信息。
``` js
var position = {
    top, // 列表项顶部距离容器顶部的偏移量
    bottom, // 列表项底部距离容器顶部的偏移量
    height, // 列表项高度
}
```
2. 初始化数据，遍历数据源 sourceList ，为每个列表项保存一个 position。预设列表项高度 itemHeight=100（随便设置一个），取列表容器高度 ，进而求得可视列表项数量 maxNum = Math.ceil( height / itemHeight ) + 1 。ps：maxNum可以适当设置大点
``` js
init(){
    this.itemHeight = 100; // 先默认列表项高度100
    this.viewHeight = this.containerEl.offsetHeight;
    this.maxNum = Math.ceil(this.viewHeight / this.itemHeight) + 1;
    this.positions = this.sourceList.map( (item,idx) => {
        return {
            top: this.itemHeight * idx,
            bottom: this.itemHeight * idx + this.itemHeight,
            height: this.itemHeight,
        }
    })
    this.bindScrollEvent();
    this.render();
}
```
3. 计算startIndex、endIndex 。 ps: 结合 scrollTop 使用二分查找法确定startIndex,提供效率 
```js
computedStartIndex(){
    const { scrollTop } = this.containerEl;
    const findIndex = (offset) => {
        let low = 0 , high = this.positions.length - 1;
        while( low < high ){
            let mid = Math.floor((low+high) / 2);
            if( offset >= this.positions[mid].top && offset <= this.positions[mid].bottom  ){
                return mid;
            }else if( offset < this.positions[mid].top ){
                high = mid - 1;
            }else if( offset > this.positions[mid].bottom ){
                low = mid + 1;
            }
        }
        return low;
    }
    this.startIndex = findIndex(scrollTop);
}

computedEndIndex(){
    const end = this.startIndex + this.maxNum;
    this.endIndex = this.sourceList[end] ? end : this.sourceList.length-1;
}
```
4. 计算偏移量和总列表高度 

```js
getStartIndexOffset(){
    return this.positions[this.startIndex].top;
}
getTotalHeight(){
    return this.positions[this.positions.length-1].bottom;
}
computedSrollStyle(){
    const height = this.getTotalHeight();
    const paddingTop =  this.getStartIndexOffset();
    this.scrollStyle = {
        height: `${ height}px`,
        paddingTop:  `${ paddingTop }px`,
    }
}
```

5. 渲染列表项 ，列表项渲染后调用 upCellMeasure 更新 positions 的位置信息数据。
```js
render(){
    this.computedStartIndex();
    if( this.lastStartIndex === this.startIndex ) return;
    this.lastStartIndex = this.startIndex;
    this.computedEndIndex();
    this.computedRenderList();
    this.computedSrollStyle();
    const html = this.getTemplate();
    this.listEl.innerHTML = html;
    this.listEl.style.height = this.scrollStyle.height;
    this.listEl.style.paddingTop = this.scrollStyle.paddingTop ;
    this.upCellMeasure();
}

upCellMeasure(){
    this.renderItems = this.listEl.querySelectorAll('.virtual-item-wrapper');
    if( this.renderItems.length === 0 ) return;
    let firstIndex = +this.renderItems[0].dataset.index;
    let lastIndex = +this.renderItems[this.renderItems.length-1].dataset.index;

    // 更新已渲染列表项的位置信息
    this.renderItems.forEach( item => {
        const index = +item.dataset.index;
        const rect = item.getBoundingClientRect();
        const pos = this.positions[index-1];
        const top =  pos ? pos.bottom : 0;
        Object.assign( this.positions[index] , { 
            top,
            bottom: top + rect.height,
            height: rect.height,
        })
    })

    // 更新未渲染的列表项的位置信息
    for( let j = lastIndex + 1 ; j < this.positions.length ; j++ ){
        const pos = this.positions[j-1];
        const top =  pos ? pos.bottom : 0;
        Object.assign( this.positions[j] , { 
            top,
            bottom: top + this.positions[j].height,
        })
    }

    // 第一次渲染并重新计算位置信息后需要重新渲染到页面上
    if( this.firstRenderFlag ){
        this.firstRenderFlag = false;
        this.render();
    }
}
```
6. 绑定鼠标滚动事件，每次滚动时调用render 渲染新的列表项。


源码：
```js
// 列表项动态高度虚拟列表
class DynamicVirtualList{
    constructor(containerDomId , listDomId){
        this.containerEl = document.getElementById(containerDomId);
        this.listEl = document.getElementById(listDomId);

        this.sourceList = [1,2,3,4,5,50,7,8,9,10,11,12,13,14,15,16,17];
        this.renderList = [];

        this.startIndex = 0;
        this.endIndex = 0;
        this.maxNum = 0; // 最大容纳量
        this.viewHeight = 0;
        this.itemHeight = 0;
        this.scrollStyle = {}   

        this.positions = [];
        this.lastStartIndex = -1; //优化：缓存startIndex , startIndex变化才需要render
        this.firstRenderFlag = true;
        this.renderItems = [];
        this.init();
    }

    init(){
        this.itemHeight = 100; // 先默认列表项高度100
        this.viewHeight = this.containerEl.offsetHeight;
        this.maxNum = Math.ceil(this.viewHeight / this.itemHeight) + 1;
        this.positions = this.sourceList.map( (item,idx) => {
            return {
                top: this.itemHeight * idx,
                bottom: this.itemHeight * idx + this.itemHeight,
                height: this.itemHeight,
            }
        })
        this.bindScrollEvent();
        this.render();
    }
    upCellMeasure(){
        this.renderItems = this.listEl.querySelectorAll('.virtual-item-wrapper');
        if( this.renderItems.length === 0 ) return;
        let firstIndex = +this.renderItems[0].dataset.index;
        let lastIndex = +this.renderItems[this.renderItems.length-1].dataset.index;
        this.renderItems.forEach( item => {
            const index = +item.dataset.index;
            const rect = item.getBoundingClientRect();
            const pos = this.positions[index-1];
            const top =  pos ? pos.bottom : 0;
            Object.assign( this.positions[index] , { 
                top,
                bottom: top + rect.height,
                height: rect.height,
            })
        })

        for( let j = lastIndex + 1 ; j < this.positions.length ; j++ ){
            const pos = this.positions[j-1];
            const top =  pos ? pos.bottom : 0;
            Object.assign( this.positions[j] , { 
                top,
                bottom: top + this.positions[j].height,
            })
        }
        // console.log("upCellMeasure: position" , JSON.parse(JSON.stringify(this.positions)))
        if( this.firstRenderFlag ){
            this.firstRenderFlag = false;
            this.render();
        }
    }
    bindScrollEvent(){
        this.containerEl.addEventListener('scroll' , this.handleScroll.bind(this) )
    }
    handleScroll(){
        this.render();
    }
    computedStartIndex(){
        const { scrollTop } = this.containerEl;
        const findIndex = (offset) => {
            let low = 0 , high = this.positions.length - 1;
            while( low < high ){
                let mid = Math.floor((low+high) / 2);
                if( offset >= this.positions[mid].top && offset <= this.positions[mid].bottom  ){
                    return mid;
                }else if( offset < this.positions[mid].top ){
                    high = mid - 1;
                }else if( offset > this.positions[mid].bottom ){
                    low = mid + 1;
                }
            }
            return low;
        }
        this.startIndex = findIndex(scrollTop);
    }
    computedEndIndex(){
        const end = this.startIndex + this.maxNum;
        this.endIndex = this.sourceList[end] ? end : this.sourceList.length-1;
    }
    computedSrollStyle(){
        const height = this.getTotalHeight();
        const paddingTop =  this.getStartIndexOffset();
        this.scrollStyle = {
            height: `${ height}px`,
            paddingTop:  `${ paddingTop }px`,
        }
        console.log("computedSrollStyle: height = " , height , "paddingTop = " , paddingTop );
    }
    computedRenderList(){
        this.renderList = this.sourceList.slice( this.startIndex , this.endIndex+1);
    }
    getTemplate(){
        return this.renderList.map( (item , idx) => {
            let len = item;
            let str = new Array(len).fill('Hello WorldHello WorldHello WorldHello WorldHello World ').join('');
            var div = document.createElement('div');
            div.id = 'virtual-item-wrapper';
            div.className = 'virtual-item-wrapper';
            div.innerHTML = (idx+1) + " " + str;
            div.dataset.index = this.startIndex + idx;
            return div.outerHTML;
        }).join('');
    }
    getStartIndexOffset(){
        return this.positions[this.startIndex].top;
    }
    getTotalHeight(){
        return this.positions[this.positions.length-1].bottom;
    }
    render(){
        this.computedStartIndex();
        if( this.lastStartIndex === this.startIndex ) return;
        this.lastStartIndex = this.startIndex;
        this.computedEndIndex();
        this.computedRenderList();
        this.computedSrollStyle();
        console.log(`render: ${this.startIndex} ~ ${this.endIndex}`);
        const html = this.getTemplate();
        this.listEl.innerHTML = html;
        this.listEl.style.height = this.scrollStyle.height;
        this.listEl.style.paddingTop = this.scrollStyle.paddingTop ;
        this.upCellMeasure();
    }
}
```