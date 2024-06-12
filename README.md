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








