transweb_echart_sankey({
  option: {
    tooltip: {
      trigger: 'item'
    },
    series: {
      type: 'sankey',
      layout: 'none',
      emphasis: {
        focus: 'adjacency'
      },
      data: [],
      links: []
    }
  },
  data: {
    nodes: [{
      name: 'a'
    }, {
      name: 'b'
    }, {
      name: 'a1'
    }, {
      name: 'a2'
    }, {
      name: 'b1'
    }, {
      name: 'c'
    }],
    links: [{
      source: 'a',
      target: 'a1',
      value: 5
    }, {
      source: 'a',
      target: 'a2',
      value: 3
    }, {
      source: 'b',
      target: 'b1',
      value: 8
    }, {
      source: 'a',
      target: 'b1',
      value: 3
    }, {
      source: 'b1',
      target: 'a1',
      value: 1
    }, {
      source: 'b1',
      target: 'c',
      value: 2
    }]
  },
  callback: function (d, name) {
    var serise = this.option.series[0] || this.option.series;
    let grid = this.option.grid;
    if (grid) {
      serise.left = grid.left;
      serise.right = grid.right;
      serise.top = grid.top;
      serise.bottom = grid.bottom;
    }
    if (!d || d.length === 0) {
      d = this.data;
    }
    serise.name = name || serise.name;
    serise.data = d.nodes || d.data;
    serise.links = d.links || d.edges;
  }
})