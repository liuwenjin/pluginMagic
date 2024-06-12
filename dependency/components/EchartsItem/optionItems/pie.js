transweb_echart_pie({
    option: {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            show: true
        },
        series: [{
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            data: []
        }]
    },
    data: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' },
        { value: 580, name: '邮件营销' },
        { value: 484, name: '联盟广告' },
        { value: 300, name: '视频广告' }
    ],
    callback: function(d) {
        var serise = this.option.series[0] || this.option.series;
        if (!d || d.length === 0) {
            d = this.data;
        }
        serise.data = d;
    }
})