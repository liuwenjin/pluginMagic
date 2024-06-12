transweb_echart_graph({
  option: {
    tooltip: {
      trigger: 'item'
    },
    series: [{
      name: '访问来源',
      type: 'graph',
      layout: "force",
      force: {
        repulsion: 200,
        edgeLength: 10
      },
      label: {
        show: true,
      },
      data: []
    }]
  },
  data: {},
  callback: function (d, name) {
    var serise = this.option.series[0] || this.option.series;
    d = d || this.data || {};
    let nodes = d.nodes || d.data || [];
    let edges = d.edges || d.links || [];
    serise.name = name || serise.name;
    serise.data = nodes.map(item => {
      item.symbolSize = item.value || 20;
      return item;
    });
    serise.links = edges;
  }
})