webCpu.regComponent("PhaserItem", {
  script: {
    phaser: "phaser.min.js"
  },
}, function (container, data, task) {
  let parentId = "t_" + new Date().getTime();
  container.id = parentId;
  task.config = task.config || {};
  task.scene = task.scene || {};
  task.style = task.style || {
    width: 800,
    height: 600
  }
 
  if(!task.config.width) {
    task.config.width = task.style.width;
  }
  

  if(!task.config.height) {
    task.config.height = task.style.height;
  }

  let config = {
    type: task.config.type || Phaser.AUTO,
    width: task.config.width || 800,
    height: task.config.height || 600,
    scene: {
        preload: task.scene.preload,
        create: task.scene.create
    }
  }
  config.parent = parentId;
  task.data = task.data || {};
  config.scene.init = function() {
    this.content = task.data.content || task.data;
    this.task = task;
  };
  task.game = new Phaser.Game(config);
});