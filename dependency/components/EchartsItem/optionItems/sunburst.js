transweb_echart_sunburst({
  option: {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: {
      type: 'sunburst',
      data: [],
      radius: [0, '90%'],
      label: {
        rotate: 'radial'
      }
    }
  },
  data: [{
    name: 'Grandpa',
    children: [{
      name: 'Uncle Leo',
      value: 15,
      children: [{
        name: 'Cousin Jack',
        value: 2
      }, {
        name: 'Cousin Mary',
        value: 5,
        children: [{
          name: 'Jackson',
          value: 2
        }]
      }, {
        name: 'Cousin Ben',
        value: 4
      }]
    }, {
      name: 'Father',
      value: 10,
      children: [{
        name: 'Me',
        value: 5
      }, {
        name: 'Brother Peter',
        value: 1
      }]
    }]
  }, {
    name: 'Nancy',
    children: [{
      name: 'Uncle Nike',
      children: [{
        name: 'Cousin Betty',
        value: 1
      }, {
        name: 'Cousin Jenny',
        value: 2
      }]
    }]
  }],
  callback: function (d, name) {
    var serise = this.option.series[0] || this.option.series;
    if (!d || d.length === 0) {
      d = this.data;
    }
    if(d && d.constructor.name !== "Array") {
      d = [d];
    }
    serise.data = d;
    serise.name = name || serise.name;
  }
})