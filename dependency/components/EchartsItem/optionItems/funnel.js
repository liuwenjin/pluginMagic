transweb_echart_funnel({
  option: {
    legend: {
      data: []
    },
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'funnel',
      data: [
      ]
    }]
  },
  data: [{
      value: 60,
      name: '访问'
    },
    {
      value: 40,
      name: '咨询'
    },
    {
      value: 20,
      name: '订单'
    },
    {
      value: 80,
      name: '点击'
    },
    {
      value: 100,
      name: '展现'
    }
  ],
  callback: function (d) {
    if (!d || d.length === 0) {
      d = this.data;
    }
    this.option.legend.data = d.map(item => {
      return item.name;
    });
    var serise = this.option.series[0] || this.option.series;
    serise.data = d;
  }
})