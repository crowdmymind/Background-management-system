<template>
    <div class="maps">
    <el-card class="box-card">
        <div class="progress">
            <el-card class="progress-item" style="background-color:#67C23A">
                <el-progress type="dashboard" :percentage=10 :color="colors"></el-progress>
                <el-tag type="success">CPU使用率</el-tag>
            </el-card>
                <el-card class="progress-item" style="background-color:#E6A23C">
                <el-progress type="dashboard" :percentage=35 :color="colors"></el-progress>
                <el-tag type="success">内存使用率</el-tag>
            </el-card>
                    <el-card class="progress-item" style="background-color:#F56C6C">
                <el-progress type="dashboard" :percentage=85 :color="colors"></el-progress>
                <el-tag type="success">虚拟机使用率</el-tag>
            </el-card>
            <el-card class="progress-item" style="background-color:#909399">
                <el-progress type="dashboard" :percentage=20 :color="colors"></el-progress>
                <el-tag type="success">硬盘使用率</el-tag>
            </el-card>
        </div>
        <div id="myChart" :style="{width: '100%', height: '500px',marginTop : '30px'}"></div>
    </el-card>
    </div>
</template>

<script>
export default {
    data () {
    return {
        colors: [
            {color: '#f56c6c', percentage: '20'},
            {color: '#e6a23c', percentage: '40'},
            {color: '#5cb87a', percentage: '60'},
            {color: '#1989fa', percentage: '80'},
            {color: '#6f7ad3', percentage: '100'}
            ]
        }
    },
    mounted(){
    this.drawLine();
  },
    methods: {
        drawLine(){
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            myChart.setOption({
                legend: {},
                tooltip: {
                    trigger: 'axis',
                    showContent: false
                },
                dataset: {
                    source: [
                        ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
                        ['Matcha Latte', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
                        ['Milk Tea', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
                        ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
                        ['Walnut Brownie', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1]
                    ]
                },
                xAxis: {type: 'category'},
                yAxis: {gridIndex: 0},
                grid: {top: '55%'},
                series: [
                    {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                    {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                    {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                    {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                    {
                        type: 'pie',
                        id: 'pie',
                        radius: '30%',
                        center: ['50%', '25%'],
                        label: {
                            formatter: '{b}: {@2012} ({d}%)'
                        },
                        encode: {
                            itemName: 'product',
                            value: '2012',
                            tooltip: '2012'
                        }
                    }
                ]
            });
            myChart.on('updateAxisPointer', function (event) {
                    var xAxisInfo = event.axesInfo[0];
                    if (xAxisInfo) {
                        var dimension = xAxisInfo.value + 1;
                        myChart.setOption({
                            series: {
                                id: 'pie',
                                label: {
                                    formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                                },
                                encode: {
                                    value: dimension,
                                    tooltip: dimension
                                }
                            }
                        });
                    }
                });
        }
    },
}
</script>
<style lang="less">
    .box-card{
    .progress{
        display: flex;
        justify-content: space-between;
        .el-card__body{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items:center;
        padding: 20px 50px;
    }
    }
    }
    .maps{
        position: relative;
    }
    #myChart{
        position: absolute;
        left: 0px;
        top: 250px;
        width: 100%;
        height: 500px;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        padding: 0px;
        margin: 0px;
        border-width: 0px;
    }
</style>