transweb_echart_stack({
  option: {
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [{
      data: [120, 200, 150, 80, 70, 110, 130],
      stack: "stackFlag",
      type: 'bar',
    }]
  },
  data: [{
    name: "Mon",
    value: [120, 22]
  }, {
    name: "Tue",
    value: [200, 22]
  }, {
    name: "Wed",
    value: [120, 22]
  }, {
    name: "Thu",
    value: [120, 22]
  }, {
    name: "Fri",
    value: [120, 22]
  }, {
    name: "Sat",
    value: [120, 22]
  }, {
    name: "Sun",
    value: [120, 22]
  }],
  callback: function (d, dataMap, title) {
    var axis = this.option.xAxis;
    if (axis.type !== "category") {
      axis = this.option.yAxis;
    }
    axis.data = [];
    var series = this.option.series[0];
    series.data = [];
    if (dataMap && dataMap.constructor.name === "Array") {
      series.name = dataMap[0];
      for (var i = 1; i < dataMap.length; i++) {
        var sData = JSON.parse(JSON.stringify(series));
        sData.name = dataMap[i];
        this.option.series.push(sData);
      }
      this.option.legend = {
        show: true,
        data: dataMap
      }
    } else {
      series.name = dataMap;
    }

    axis.data = [];

    if (!d || d.length === 0) {
      d = this.data;
    }
    for (var i = 0; i < d.length; i++) {
      var item = d[i];
      axis.data.push(item.name);
      if (item.value.constructor.name === "Array") {
        var len = item.value.length - this.option.series.length;
        if (len > 0) {
          for (var j = 0; j < len; j++) {
            var sData = JSON.parse(JSON.stringify(series));
            this.option.series.push(sData);
          }
        }
        for (var m = 0; m < item.value.length; m++) {
          if (this.option.series[m]) {
            this.option.series[m].data.push(item.value[m]);
          }
        }
      } else {
        series.data.push(item.value);
      }
    }
  }
})