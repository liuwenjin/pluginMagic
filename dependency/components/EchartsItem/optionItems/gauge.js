transweb_echart_gauge({
  option: {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%'
    },
    legend: {
      show: false
    },
    series: [{
      name: 'Pressure',
      type: 'gauge',
      detail: {
        formatter: '{value}'
      },
      data: [{
        value: 50,
        name: 'SCORE'
      }]
    }]
  },
  data: [{
    name: "SCORE",
    value: 80
  }],
  callback: function (d) {
    var serise = this.option.series[0] || this.option.series;
    if (!d || d.length === 0) {
      d = this.data;
    }
    if (d.constructor.name === "Array") {
      serise.data = d;
    } else {
      serise.data = [d];
    }
  }
})