transweb_echart_k({
    option: {
        xAxis: {
            data: []
        },
        yAxis: {},
        series: [{
            type: 'k',
            data: [

            ]
        }]
    },
    data: [{
        name: '2017-10-24',
        value: [20, 34, 10, 38]
    }, {
        name: '2017-10-25',
        value: [40, 35, 30, 50]
    }, {
        name: '2017-10-26',
        value: [31, 38, 33, 44]
    }, {
        name: '2017-10-27',
        value: [38, 15, 5, 42]
    }],
    callback: function(d) {
        var serise = this.option.series[0] || this.option.series;
        if (!d || d.length === 0) {
            d = this.data;
        }
        serise.data = d.map(item => {
            return item.value;
        });
        var axis = this.option.xAxis;
        axis.data = d.map(item => {
            return item.name;
        })
    }
})