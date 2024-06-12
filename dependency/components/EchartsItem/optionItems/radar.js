transweb_echart_radar({
  option: {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
    },
    radar: {
      shape: 'circle',
      indicator: [{
          name: '销售（Sales）',
          max: 6500
        },
        {
          name: '管理（Administration）',
          max: 6600
        },
        {
          name: '信息技术（Information Technology）',
          max: 9000
        },
        {
          name: '客服（Customer Support）',
          max: 8800
        },
        {
          name: '研发（Development）',
          max: 5200
        },
        {
          name: '市场（Marketing）',
          max: 8500
        }
      ]
    },
    series: [{
      type: 'radar',
      data: [{
          value: [4200, 3000, 2000, 3500, 5000, 1800],
          name: '预算分配（Allocated Budget）'
        },
        {
          value: [5000, 1400, 2800, 2600, 4200, 2100],
          name: '实际开销（Actual Spending）'
        }
      ]
    }]
  },
  dataMap: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）'],
  data: [{
      name: '销售（Sales）',
      max: 6500,
      value: [4200, 5000]
    },
    {
      name: '管理（Administration）',
      max: 6500,
      value: [4200, 5000]
    },
    {
      name: '信息技术（Information Technology）',
      max: 6500,
      value: [4200, 5000]
    },
    {
      name: '客服（Customer Support）',
      max: 6500,
      value: [4200, 5000]
    },
    {
      name: '研发（Development）',
      max: 6500,
      value: [4200, 5000]
    },
    {
      name: '市场（Marketing）',
      max: 6500,
      value: [4200, 5000]
    }
  ],
  callback: function (d, dataMap) {
    if (!d || d.length === 0) {
      d = this.data;
    }
    this.option.legend.data = dataMap || this.dataMap;
    var items = d;
    let arr = this.option.legend.data;
    let tName = arr[arr.length -1];
    if(tName === "max" || tName === "") {
      this.option.legend.data.pop();
    }

    this.option.radar.indicator = items.map(item => {
      var t = {
        ...item
      };
      if(t.max === undefined) {
        var max = Math.max.apply(null, t.value);
        t.max = Math.floor(max / 10) * 10;
      }
      delete t.value;
      return t;
    });

    var serise = this.option.series[0] || this.option.series;
    serise.data = this.option.legend.data.map(item => {
      return {
        name: item,
        value: []
      }
    });
    for (var i = 0; i < d.length; i++) {
      let value = d[i].value;
      for (let j = 0; j < arr.length; j++) {
        serise.data[j].value.push(value[j])
      }
    }
    console.log(this.option);
  }
})