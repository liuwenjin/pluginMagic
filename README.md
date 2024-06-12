# pluginMagic

## 简介

这个项目提供了一个能快速将前端代码封装成插件的方法，使用该方法封装的插件不受限 Web 前端技术栈，只需编写极少代码就能快速嵌入到 Web 页面中，从有望被复用到越来越多的项目或产品中。

这个项目可以让 Web 前端开发者，真正做到“一次编写，随处嵌入运行”。意味着开发者可以编写一次代码，然后无需或只需很少的修改，就能在不同技术栈的前端页面上运行。

## 特点

- 部署方便，解压后复制粘贴到 Web 服务的静态目录即可。
- 支持独立部署，在其他项目中共享使用。
- 除插件的底座 JS 脚本，所有插件相关资源按需加载。

## 安装

1. 下载并解压项目代码压缩包。
2. 将解压的文件夹复制粘贴到 Web 服务的静态目录。
3. 在页面的head中添加插件的底座 JS 脚本 (webCpu.js)。
<script src="pluginMagic/dependency/webCpu.js"></script>

## 插件封装方法

### 单个插件封装

使用 JS 对象结构封装插件，对象中包含：className, dsl, cardName和url(可选)属性。

className: 是插件的类型，标识该插件所依赖的资源对应 pluginMagic/dependency/components 目录下的文件夹命名。

dsl: 是插件的dsl描述内容，它的值也是一个 JS 对象。至于怎么设置这个 JS 对象描述插件特性特征满足项目或产品，看文档后面的内容。

cardName: 是该插件被打包到插件组里的标识。(通过函数调用使用该插件时，作为第三个参数)。

url: 是插件运行上下文模板地址。上下文模板是html代码片段或vue代码片段，也就是一些提前预制好的html元素标签、Element Plus标签，或 aFrame VR 元素标签内容，以及初始化的代码逻辑。

请参看如下插件代码示例：

```javascript
{
  cardName: "可视化插件",
  className: "EchartsItem",
  dsl: {
    "type": 'column',
    "dataMap": ['A', 'B'],
    "data": [{
      "name": '一月',
      "value": [130, 80]
    }, {
      "name": '二月',
      "value": [140, 20]
    }, {
      "name": '三月',
      "value": [210, 180]
    }, {
      "name": '四月',
      "value": [140, 80]
    }, {
      "name": '五月',
      "value": [200, 130]
    }, {
      "name": '五月',
      "value": [140, 180]
    }, {
      "name": '五月',
      "value": [210, 80]
    }, {
      "name": '六月',
      "value": [140, 100]
    }, {
      "name": '七月',
      "value": [200, 80]
    }, {
      "name": '八月',
      "value": [190, 180]
    }, {
      "name": '九月',
      "value": [240, 80]
    }, {
      "name": '十月',
      "value": [40, 280]
    }, {
      "name": '十一月',
      "value": [140, 20]
    }, {
      "name": '十二月',
      "value": [40, 60]
    }]
  }
}
```


### 打包插件组

通过一个函数调用语句，可以将多个插件打包成一组。

如下面的代码所示，函数调用语句的括号内是一个数组参数，数组的每个元素都是一个插件对象。一个插件脚本文件只存放一段这样结构的代码，即打包好一组插件了。
这样就能通过脚本文件路径和该函数名称自由地使用文件内的每一个插件了。

```javascript
transweb_example([{
  cardName: "可视化插件",
  className: "EchartsItem",
  dsl: {
    "type": 'column',
    "dataMap": ['A', 'B'],
    "data": [{
      "name": '一月',
      "value": [130, 80]
    }, {
      "name": '二月',
      "value": [140, 20]
    }, {
      "name": '三月',
      "value": [210, 180]
    }, {
      "name": '四月',
      "value": [140, 80]
    }, {
      "name": '五月',
      "value": [200, 130]
    }, {
      "name": '五月',
      "value": [140, 180]
    }, {
      "name": '五月',
      "value": [210, 80]
    }, {
      "name": '六月',
      "value": [140, 100]
    }, {
      "name": '七月',
      "value": [200, 80]
    }, {
      "name": '八月',
      "value": [190, 180]
    }, {
      "name": '九月',
      "value": [240, 80]
    }, {
      "name": '十月',
      "value": [40, 280]
    }, {
      "name": '十一月',
      "value": [140, 20]
    }, {
      "name": '十二月',
      "value": [40, 60]
    }]
  }
}])

```

## 使用插件的方法

通过插件底座 webCpu.js 提供的 webCpu.renderCard(elem, option, cardName, dsl) 函数调用来使用封装好的插件。

elem，必要参数, 是插件将要嵌入的页面元素

option，必要参数, 是包含 url和key属性的 js对象，url属性值就是插件组脚本文件的路径，key属性值是插件组脚本中函数的名称。

cardName，必要参数, 是所要使用的插件在插件组里的标识。

dsl，非必要参数, 插件所支持的定制调整描述内容，是个 JS 对象。

```javascript
webCpu.componentPath = "pluginMagic/dependency/components"
let elem = document.body;
webCpu.renderCard(elem, { 
            url: "pluginMagic/pluginGroup/example.js",    
            key: "transweb_example"}, '可视化插件');
```

需要注意的是，使用这个函数前需要确保 webCpu.componentPath 参数的值是底座脚本webCpu.js 所在文件夹下 components文件夹路径(比如 pluginMagic/dependency/components)。

## 插件类型说明 (className)

### CardItem 类型

#### 功能描述

是所有其他类型插件的“基座”，用于在指定页面元素内，生成一个相对独立的插件运行环境。

一般不会单独运行，会随着其他类型插件运行前，自动运行。

#### dsl 数据结构

CardItem 的 dsl 数据结构会被其他类型插件的 dsl 继承。

```javascript
{
  "url" : "...", // 所承载其他插件的数据请求 url
  "params": {},  // params中参数的值会替 url 内代双括号括起来的响应参数名称
  "requestType": "", // 其他参数的数据请求方式，支持 get, post, jsonp
  "query": {},     // 数据请求携带的参数
  "contentType": "", // 数据请求携带参数的方式，支持 application/x-www-form-urlencoded, application/json, multipart/form-data
  
  "data": {}, // 所承载插件的默认data
  "dataFilter": function(d) {
    // 融合数据请求到的数据与所承载插件的默认data
  }, 
  promise: {
    //参数 c 为插件渲染的页面元素，d 为数据内容，t 为插件示例对象
    beforeRender: function(c, d, t) { 
      // 数据在被渲染到插件页面前的处理逻辑代码
    }, 
    afterRender: function(c, d, t) {  
      // 数据在被渲染到插件页面后的处理逻辑代码(可以用于为界面元素绑定事件)
    } 
  }
}
```

#### 资源依赖信息
- jquery.js v3.6
- bootstrap v4.6
- jquery.qrcode.js
- animate.css v4.1


### EchartsItem 类型

#### 功能描述
主要是用于对数据的可视化展示。

#### dsl数据结构

```javascript
{
  "type": 'column', // 指定可视化的图表名称
  "option": {},   // 这个属性可以用来调整图表的显示样式
  "dataMap": ['A', 'B'], // 数据名称与值数组元素的映射Map数组
  "data": [{           // 当前可视化插件的默认数据
    "name": '一月',
    "value": [130, 80]
  }, {
    "name": '二月',
    "value": [140, 20]
  }, {
    "name": '三月',
    "value": [210, 180]
  }, {
    "name": '四月',
    "value": [140, 80]
  }, {
    "name": '五月',
    "value": [200, 130]
  }, {
    "name": '五月',
    "value": [140, 180]
  }, {
    "name": '五月',
    "value": [210, 80]
  }, {
    "name": '六月',
    "value": [140, 100]
  }, {
    "name": '七月',
    "value": [200, 80]
  }, {
    "name": '八月',
    "value": [190, 180]
  }, {
    "name": '九月',
    "value": [240, 80]
  }, {
    "name": '十月',
    "value": [40, 280]
  }, {
    "name": '十一月',
    "value": [140, 20]
  }, {
    "name": '十二月',
    "value": [40, 60]
  }],
}
```

#### 资源依赖信息
- Echarts.js v5.2



### ElementVueItem类型

#### 功能描述
Element Plus + Vue 3技术栈的Vue组件文件转插件功能

#### dsl数据结构
该类型插件的 dsl 数据结构不固定，取决于相应的 Vue 组件内容。
在这里以本项目提供的通用型 pageCard.vue 组件为例，示意说明这类插件的 dsl数据结构。
基于 pageCard.vue 上下文的 ElementVuetem 类型插件的 dsl 数据不仅定义了插件运行节目中有哪些元素、信息显示的种类(比如文本、按钮和Tag等等)以及显示样式，而且定义了插件怎么响应用户的操作事件，以及怎么让用户输入信息。

``` javascript
{
    "dataFilter": function (d) {
      // 对 data 属性的值对象做融合处理
      d = this.defaultData || this.data;
      d.content = d.content || {
        list: []
      };
      let arr = d.content.list;
      d.info.key1 = d.info.key1 || 1;
      d.info.key2 = arr.length;
      d.info.key3 = arr[Number(d.info.key1) - 1].key;
      return d;
    },
    "methods": {
      // 自定义函数，切换到下一个
      "switchCardItem": function (n) {
        let arr = this.content.list;
        this.info.key1 = n % arr.length;
        this.info.key1 = Math.max(1, this.info.key1);
        this.info.key3 = arr[Number(this.info.key1) - 1].key;
      },
      // 自定义函数，显示问题和答案
      "switchContent": function () {
        let arr = this.content.list;
        let current = arr[Number(this.info.key1) - 1];
        if (current.key === this.info.key3) {
          this.info.key3 = current.key + "<br>答案：" + current.value;
        } else {
          this.info.key3 = current.key;
        }
      },
      // 用户点击卡片的响应函数(显示问题和答案)
      "handleClickCard": function (d, config) {
        if (config.prop == "key3") {
          this.switchContent();
        }
      },
      // 用户点击按钮事件的响应函数
      "handleClickButton": function (d, config) {
        let index = Number(this.info.key1);
        if (config.label === "下一个") {
          this.switchCardItem(index + 1);
        } else {
          this.switchCardItem(index - 1);
        }
      }
    },
    "data": { // 定义插件运行区域要显示的信息
      "content": {
        list: [{
          key: "问题1",
          value: "答案描述1..."
        }, {
          key: "问题2",
          value: "答案描述2..."
        }, {
          key: "问题3",
          value: "答案描述3..."
        }, {
          key: "问题4",
          value: "答案描述4..."
        }]
      },
      // 插件运行区域的显示样式
      "cardStyle": {
        "padding": '50px 100px 80px 100px',
        "border": 'solid 0px #999',
        "backgroundColor": 'rgba(255, 255, 255, 0.3)',
        "marginTop": '100px'
      },
      // 插件显示区域默认情况下要显示的信息(未数据融合处理情况下)
      "info": {
        "key1": '内容1',
        "key2": '内容2',
        "key3": '内容3'
      },
      // 插件显示区域各信息单元如何显示
      "optionMap": {
        "key1": {
          "style": {
            "fontSize": '30px'
          }
        },
        "key2": {
          "before": '/',
          "style": {
            "fontSize": '30px'
          }
        },
        "buttonGroup": {
          "style": {
            "float": 'right',
            "marginTop": '5px'
          },
          "content": [{
            "label": '上一个',
            "size": 'large'
          }, {
            "label": '下一个',
            "size": 'large'
          }]
        },
        "key3": {
          "style": {
            "fontSize": '50px',
            "border": 'solid 1px #666',
            "boxShadow": '2px 2px 2px #333',
            "padding": '20px 40px',
            "marginTop": '5px',
            "borderRadius": '10px',
            "background": '#fff',
            "display": 'block'
          }
        }
      },
      // 插件显示区域各信息单元显示的顺序、信息属性和类型
      "config": [{
        "prop": 'key1',
        "type": 'text'
      }, {
        "prop": 'key2',
        "type": 'text'
      }, {
        "prop": 'buttonGroup',
        "type": 'button'
      }, {
        "prop": 'key3',
        "type": 'html'
      }]
    },
  }

```


#### 资源依赖信息

### PhaserItem

#### 功能描述
主要是用于对数据的可视化展示。

#### dsl数据结构


#### 资源依赖信息

### TemplateItem类型

#### 功能描述
主要是用于对数据的可视化展示。

#### dsl数据结构


#### 资源依赖信息

## 附录-可视化图表的简化数据结构列表







