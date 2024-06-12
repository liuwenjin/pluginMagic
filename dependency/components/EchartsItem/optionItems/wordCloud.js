transweb_echart_wordCloud({
  option: {
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      keepAspect: false,
      left: 'center',
      top: 'center',
      width: '70%',
      height: '80%',
      right: null,
      bottom: null,

      sizeRange: [12, 60],
      rotationRange: [-90, 90],
      rotationStep: 45,
      gridSize: 8,

      drawOutOfBound: false,
      shrinkToFit: false,

      layoutAnimation: true,

      // Global text style
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        // Color can be a callback function or a color string
        color: function () {
          // Random color
          return 'rgb(' + [
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160)
          ].join(',') + ')';
        }
      },
      emphasis: {
        focus: 'self',
        textStyle: {
          textShadowBlur: 10,
          textShadowColor: '#333'
        }
      },

      // Data is an array. Each array item must have name and value property.
      data: [{
        name: 'Farrah Abraham',
        value: 366,
        // Style of single text
        textStyle: {}
      }]
    }]
  },
  data: [{
      value: 1048,
      name: '搜索引擎'
    },
    {
      value: 735,
      name: '直接访问'
    },
    {
      value: 580,
      name: '邮件营销'
    },
    {
      value: 484,
      name: '联盟广告'
    },
    {
      value: 300,
      name: '视频广告'
    }
  ],
  callback: function (d) {
    var serise = this.option.series[0] || this.option.series;
    if (!d || d.length === 0) {
      d = this.data;
    }
    serise.data = d;
  }
})