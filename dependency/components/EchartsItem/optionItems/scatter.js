transweb_echart_scatter({
  option: {
    tooltip: {
      position: 'top'
    },
    xAxis: {},
    yAxis: {},
    series: [{
      symbolSize: 20,
      encode: { tooltip: [0, 1] },
      data: [],
      type: 'scatter'
    }]
  },
  data: [
    [10.0, 8.04],
    [8.07, 6.95],
    [13.0, 7.58],
    [9.05, 8.81],
    [11.0, 8.33],
    [14.0, 7.66],
    [4.05, 4.96],
    [6.03, 7.24],
    [12.0, 6.26],
    [12.0, 8.84],
    [7.08, 5.82],
    [5.02, 5.68]
  ],
  callback: function (d, name) {
    var serise = this.option.series[0] || this.option.series;
    if (!d || d.length === 0) {
      d = this.data;
    }
    serise.data = d;
    serise.name = name || serise.name;
  }
})