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

## 插件类型说明 (className)

### CardItem 类型

#### 功能描述

是所有其他类型插件的“基座”，用于在指定页面元素内，生成一个相对独立的插件运行环境。

一般不会单独运行，会随着其他类型插件运行前，自动运行。

#### dsl 数据结构

CardItem 的 dsl 数据结构会被其他类型插件的 dsl 继承, 即其他类型的插件也支持。

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

封装的这类型插件，主要是用于对数据进行可视化展示。

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
  }],
}
```

#### 资源依赖信息
- Echarts.js v5.2



### ElementVueItem类型

#### 功能描述

封装的这类型插件，主要用于像 Vue 单文件组件一样在指定区域显示数据信息。

使用 Vue 3技术栈下的 Element plus 组件库展示信息，也像单文件组件一样可以添加界面交互逻辑脚本代码。

#### dsl数据结构

该类型插件的 dsl 数据结构不固定，取决于相应的 Vue 组件内容。
在这里以本项目提供的通用型 pageCard.vue 组件 (在 pluginGroup/context/ 目录下) 为例，示意说明这类插件的 dsl数据结构。
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
- Element Plus v2.3.3
- Vue v3.2.31

### PhaserItem

#### 功能描述
封装实现简单的Phaser.js 游戏插件，用于寓教于乐的教学课件。

#### dsl数据结构

```javascript
{
    //游戏窗口大小设置
    "config": {
      "width": 320,
      "height": 256
    },
    //用于接收外部输入参数
    "content": {
      "dsl": [{
        "imageMap": ['player', 'box', 'target', 'ground'],
        "charMap": {
          "#": 'ground',
          "@": 'player',
          "$": 'box'
        },
        "map": ['## ##', '###@#', '#$ $#', '# $##']
      }],
      "image": ['https://transweb-1254183942.cos.ap-beijing.myqcloud.com/images/pushBox/player.png', 'https://transweb-1254183942.cos.ap-beijing.myqcloud.com/images/pushBox/box.png', 'https://transweb-1254183942.cos.ap-beijing.myqcloud.com/images/pushBox/target.png', 'https://transweb-1254183942.cos.ap-beijing.myqcloud.com/images/pushBox/ground.png']
    },
    //游戏场景对象
    "scene": {
      //游戏场景初始化和过程逻辑
      "create": function () {
        // 创建地图数组
        let dsl = this.task.content.dsl[0] || {};
        let charMap = dsl.charMap || {};

        let map = dsl.map || {};
        let tileSize = 64;

        let _self = this;

        let showHint = function (text, duration, callback, style) {
          let tipsItem = _self.add.text(0, 0, '', style || {
            font: '24px Arial',
            fill: '#ffffff',
            align: 'center',
            zIndex: 100
          });
          tipsItem.setOrigin(0.5, 0.5);
          tipsItem.visible = false;

          // 设置提示文本内容和位置
          tipsItem.setText(text);
          tipsItem.setPosition(_self.game.renderer.width / 2, _self.game.renderer.height / 2);
          tipsItem.visible = true;

          // 设置定时消失
          _self.time.addEvent({
            delay: duration,
            callback: () => {
              tipsItem.visible = false;
              if (typeof callback === "function") {
                callback();
              }
            },
            loop: false
          });
        }

        let player;
        const targets = [];

        let boxes = [];

        // 遍历地图数组
        for (let i = 0; i < map.length; i++) {
          for (let j = 0; j < map[i].length; j++) {
            let x = j * tileSize;
            let y = i * tileSize;
            let role = charMap[map[i][j]] || "target";
            let item = this.add.image(x, y, role).setOrigin(0);
            // 计算缩放比例
            let scaleX = tileSize / item.width;
            let scaleY = tileSize / item.height;
            // 设置图像缩放比例
            item.setScale(scaleX, scaleY);

            if (role === "player") {
              item.setDepth(1);
              player = item;
            } else if (role === "box") {
              boxes.push(item);
              item.setDepth(1);
            } else if (role === "target") {
              targets.push(item);
            } else {}
          }
        }

        let gameOver = false;

        // 设置玩家输入
        this.input.keyboard.on('keydown', function (event) {
          let dx = 0,
            dy = 0;
          switch (event.code) {
            case 'KeyW':
              dy = -1;
              break;
            case 'KeyS':
              dy = 1;
              break;
            case 'KeyA':
              dx = -1;
              break;
            case 'KeyD':
              dx = 1;
              break;
          }

          let newPlayerX = player.x + dx * tileSize;
          let newPlayerY = player.y + dy * tileSize;

          // 碰撞检测
          let size = {
            x: map[0].length * tileSize,
            y: map.length * tileSize
          }
          let collisionItem = isCollision(newPlayerX, newPlayerY);
          if (!isOutRange(newPlayerX, newPlayerY, size)) {
            if (!collisionItem) {
              player.x = newPlayerX;
              player.y = newPlayerY;
            } else {
              let newX = collisionItem.x + dx * tileSize;
              let newY = collisionItem.y + dy * tileSize;
              if (!isOutRange(newX, newY, size) && !isCollision(newX, newY, collisionItem)) {
                player.x = newPlayerX;
                player.y = newPlayerY;
                collisionItem.x = newX;
                collisionItem.y = newY;
              }
            }
          }

          // 检查是否胜利
          checkResult();

        });



        function checkResult() {
          let win = true;
          for (let i = 0; i < targets.length; i++) {
            let target = targets[i];
            let hasBox = false;
            for (let j = 0; j < boxes.length; j++) {
              let box = boxes[j];
              if (box.x === target.x && box.y === target.y) {
                hasBox = true;
                break;
              }
            }
            if (!hasBox) {
              win = false;
              break;
            }
          }

          if (win && !gameOver) {
            gameOver = true;
            setTimeout(function () {
              showHint("You Win", 2000, function () {
                _self.scene.restart();
              });
            }, 500);
          }
        }

        //越界检测函数
        function isOutRange(x, y, size) {
          let ret = true;
          if (x > -1 && y > -1 && x < size.x && y < size.y) {
            ret = false;
          }
          return ret;
        }

        // 碰撞检测函数
        function isCollision(x, y, item) {
          let index = boxes.indexOf(item);
          for (var i = 0; i < boxes.length; i++) {
            var box = boxes[i];
            if (box.x === x && box.y === y && item !== box) {
              return box;
            }
          }
          return false;
        }

      },
      // 游戏资源加载逻辑
      "preload": function () {
        let dsl = this.task.content.dsl[0] || {};
        let arr = dsl.imageMap || [];
        let images = this.task.content.image || [];
        try {
          for (let i = 0; i < images.length; i++) {
            this.load.image(arr[i], images[i]);
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    // 游戏场景容器样式，width和height 一般需要与config的保持一致
    "style": {
      "width": 320,
      "height": 256
    }
  }
```
#### 资源依赖信息
- Phaser.js v3.80.1


### TemplateItem类型

#### 功能描述

封装的这类型插件，也是用于展示信息，主要是使用 Bootstrap UI 库展示二维的信息，或使用aFrame.js库的组件标签或属性展示虚拟三维空间的信息。当然这类插件也支持添加界面交互逻辑脚本代码。

相当于提供 html 标签文件转插件功能，即将 html 标签内容封装为通用 javascript 插件。
这里的标签除了浏览器原生的二维信息外，也包含 aFrame.js库拓展的虚拟三维空间信息标签，比如<a-scene><a-box></a-box></a-scene>等等这样的标签。

#### dsl数据结构

```javascript
{
  // 外部依赖资源
  dependency: {
    script: { 
      environment: "https://transweb.cn/A-Frame/js/aframe-environment-component.js"
    },
    css: {
      bulma: "https://cdn.jsdelivr.net/npm/bulma@1.0.0/css/bulma-rtl.min.css"
    }
  },
}
```
当然我们也可以在上面的结构上添加 CardItem 类型插件的那些 dsl 数据参数。


#### 资源依赖信息
aframe v1.6


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

