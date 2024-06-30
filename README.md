# pluginMagic

## 简介

这个项目提供了一个能快速将前端代码封装成插件的方法，使用该方法封装的插件不受限于 Web 前端技术栈，只需编写极少代码就能快速将其嵌入到 Web 页面中，从有望被复用到越来越多的项目或产品中。

这个项目可以让 Web 前端开发者，真正做到“一次编写，随处嵌入运行”。意味着开发者可以编写一次代码，然后无需或只需很少的修改，就能在不同技术栈的前端页面上运行。

之所以能做到这一点，是因为无论封装插件还是插件被使用，都相对独立：不用融入所在项目的代码中，不用编译，除了插件的底座 js 脚本资源，其他插件资源都不用提前声明或载入。

## 特点

- 插件封装和使用简单。
- 部署方便，支持独立部署：解压后复制粘贴到 Web 服务的静态目录即可。
- 除插件的底座 JS 脚本，所有插件相关资源不用提前声明或载入。

## 安装

1. 下载并解压项目代码压缩包 (下载地址：https://codeload.github.com/liuwenjin/pluginMagic/zip/refs/heads/main)。
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
    }]
  }
}
```
- 如何使用

这样的插件可以通过插件底座 webCpu.js 提供的 webCpu.updateView(elem, plugin) 函数嵌入到网页中。

其中 elem 参数，是页面中的 document 元素，plugin 参数就是上面的 JS 对象。

需要注意的是，使用这个函数前需要确保 webCpu.componentPath 参数的值是底座脚本webCpu.js 所在文件夹下 components文件夹路径(比如 pluginMagic/dependency/components)。



### 打包插件组

通过一个函数调用语句，就可以将多个插件打包成一组。

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
    }]
  }
}])

```

- 如何使用

通过插件底座 webCpu.js 提供的 webCpu.renderCard(elem, option, cardName, dsl) 函数调用来使用封装好的插件。

elem，必要参数, 是插件页面中的 document 元素。

option，必要参数, 是包含 url和key属性的 js对象，url属性值就是插件组脚本文件的路径，key属性值是插件组脚本中函数的名称。

cardName，必要参数, 是所要使用的插件在插件组里的标识。

dsl，非必要参数, 插件所支持的定制调整描述内容，是个 JS 对象。

以下是示例代码：

```javascript
webCpu.componentPath = "pluginMagic/dependency/components"
let elem = document.body;
webCpu.renderCard(elem, { 
            url: "pluginMagic/pluginGroup/example.js",    
            key: "transweb_example"}, '可视化插件');
```

需要注意的是，使用这个函数前需要确保 webCpu.componentPath 参数的值是底座脚本webCpu.js 所在文件夹下 components文件夹路径(比如 pluginMagic/dependency/components)。

- 定制开发

当无权对插件组文件修改时，我们依然可以按实际需要对所使用的插件，进行定制化调整。

这种情况只需要在调用 webCpu.renderCard函数时传入第 4 个参数 dsl. 这个 dsl 参数值会按其结构覆盖插件组内相应插件的 dsl 数据结构内容。

## 贡献
我们欢迎任何形式的贡献！无论是提交问题、改进文档，还是提交代码。

## 开发
如果你想为 pluginMagic  贡献代码，请遵循以下步骤：

Fork我们的仓库。
创建一个新的分支。
提交你的更改。
创建一个Pull Request。

## 版本历史

v1.0.0：初始版本发布，支持基本功能。

## 许可证

pluginMagic 的插件基座 webCpu.js 在 GPL-3.0 许可证下发布。

封装不同类型的插件后发布和使用，受限于响应类型插件的依赖库所遵循的许可协议。


## 联系信息

开发者邮箱：neilking@163.com
GitHub仓库：[\[仓库链接\]](https://github.com/liuwenjin/pluginMagic.git)

