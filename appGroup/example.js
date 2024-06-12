transweb_example([{
  cardName: "信息卡片插件",
  type: "pageCard",
  url: "https://transweb.cn/plugins/elementVueItem/pageCard.vue",
  className: "ElementVueItem",
  dsl: {
    "dataFilter": function (d) {
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
      "switchCardItem": function (n) {
        let arr = this.content.list;
        this.info.key1 = n % arr.length;
        this.info.key1 = Math.max(1, this.info.key1);
        this.info.key3 = arr[Number(this.info.key1) - 1].key;
      },
      "switchContent": function () {
        let arr = this.content.list;
        let current = arr[Number(this.info.key1) - 1];
        if (current.key === this.info.key3) {
          this.info.key3 = current.key + "<br>答案：" + current.value;
        } else {
          this.info.key3 = current.key;
        }
      },
      "handleClickCard": function (d, config) {
        if (config.prop == "key3") {
          this.switchContent();
        }
      },
      "handleClickButton": function (d, config) {
        let index = Number(this.info.key1);
        if (config.label === "下一个") {
          this.switchCardItem(index + 1);
        } else {
          this.switchCardItem(index - 1);
        }
      }
    },
    "data": {
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
      "cardStyle": {
        "padding": '50px 100px 80px 100px',
        "border": 'solid 0px #999',
        "backgroundColor": 'rgba(255, 255, 255, 0.3)',
        "marginTop": '100px'
      },
      "info": {
        "key1": '',
        "key2": '内容2',
        "key3": '内容3'
      },
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
    "style": {
      "width": 1600,
      "height": 900,
      "border": 'solid 1px #ddd',
      "borderRadius": '10px',
      "padding": '20px 40px',
      "boxShadow": '2px 2px 2px #333'
    }
  }
}, {
  cardName: "可视化插件",
  type: "EchartsItem",
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
    }],
    "style": {
      width: 1600,
      height: 900,
      border: "solid 1px #ddd",
      borderRadius: "10px",
      padding: "20px 40px",
      boxShadow: "2px 2px 2px #333"
    }
  }
}, {
  cardName: "Phaser 游戏",
  type: "PhaserItem",
  className: "PhaserItem",
  dsl: {
    "config": {
      "width": 320,
      "height": 256
    },
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
    "scene": {
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
    "style": {
      "width": 320,
      "height": 256
    }
  }
}])