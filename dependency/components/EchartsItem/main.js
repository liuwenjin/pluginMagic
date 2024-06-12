webCpu.regComponent("EchartsItem", {
  script: "script.js"
}, function (container, data, task) {
  var type = task.type || "custom";
  if (type === "custom") {
    if (task.option) {
      setTimeout(function () {
        task.chart = echarts.init(container);
        task.chart.setOption(task.option);
      }, 500);
    } else {
      console.log("EchartsItem", "缺少task.option属性")
    }
  } else {
    var afterRender = null;
    if (task.promise) {
      afterRender = task.promise.afterRender;
      task.promise.afterRender = null;
    }
    var path = webCpu.EchartsItem.getPath(type + ".js", "optionItems");
    var key = "transweb_echart_" + type;
    WebAdapter.loadCardData(path, key, function (tData) {
      if (tData.option) {
        tData.option.grid = {
          left: 60,
          right: 20,
          top: 80,
          bottom: 50
        };
        tData.option.title = {
          text: task.title,
          textStyle: {
            fontSize: 14
          },
          top: 20,
          left: 20
        }

        tData.option.legend = tData.option.legend || {};
        tData.option.legend.top = 20;
        tData.option.legend.right = 20;

        if (task.option) {
          webCpu.attachAttribute(task.option, tData.option);
          console.log("图表的option: ", tData.option);
        }

        if (typeof tData.callback === "function") {
          let temp = task.name;
          if(task.dataMap && task.dataMap.length !== 0) {
            temp = task.dataMap;
          }
          tData.callback(task.data, temp, task);
        }
        
        setTimeout(function () {
          task.chart = echarts.init(container);
          task.chart.setOption(tData.option);
          if (typeof afterRender === "function") {
            afterRender(container, data, task);
          }
        }, 500);
      }
    })
  }
});