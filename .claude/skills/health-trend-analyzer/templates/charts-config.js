/**
 * ECharts 图表配置文件
 * 健康趋势分析报告 - 6 种图表类型的完整配置
 *
 * 使用方法：
 * 1. 在 HTML 中引入此文件
 * 2. 调用对应的图表初始化函数
 * 3. 传入实际数据
 */

// ===== 1. 体重/BMI 趋势图配置 =====

/**
 * 初始化体重/BMI 趋势图（双轴折线图）
 * @param {Array} weightData - 体重数据 [{date: '2025-10', weight: 60.8}, ...]
 * @param {Array} bmiData - BMI 数据 [{date: '2025-10', bmi: 22.3}, ...]
 */
function initWeightChart(weightData, bmiData) {
    const chart = echarts.init(document.getElementById('weight-chart'));

    const dates = weightData.map(d => d.date);
    const weights = weightData.map(d => d.weight);
    const bmis = bmiData.map(d => d.bmi);

    const option = {
        title: {
            text: '体重/BMI 变化趋势',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: 'bold' }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
        },
        legend: {
            data: ['体重 (kg)', 'BMI'],
            top: 40
        },
        grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: dates,
            boundaryGap: false
        },
        yAxis: [
            {
                type: 'value',
                name: '体重 (kg)',
                position: 'left',
                axisLabel: { formatter: '{value} kg' }
            },
            {
                type: 'value',
                name: 'BMI',
                position: 'right',
                axisLabel: { formatter: '{value}' }
            }
        ],
        series: [
            {
                name: '体重',
                type: 'line',
                data: weights,
                smooth: true,
                yAxisIndex: 0,
                itemStyle: { color: '#3b82f6' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                        { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
                    ])
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                }
            },
            {
                name: 'BMI',
                type: 'line',
                data: bmis,
                smooth: true,
                yAxisIndex: 1,
                itemStyle: { color: '#8b5cf6' },
                markLine: {
                    data: [
                        { yAxis: 18.5, name: 'BMI 下限', lineStyle: { type: 'dashed', color: '#22c55e' } },
                        { yAxis: 24, name: 'BMI 上限', lineStyle: { type: 'dashed', color: '#f59e0b' } },
                        { yAxis: 28, name: '超重线', lineStyle: { type: 'dashed', color: '#ef4444' } }
                    ]
                }
            }
        ]
    };

    chart.setOption(option);
    return chart;
}

// ===== 2. 症状频率图配置 =====

/**
 * 初始化症状频率柱状图
 * @param {Array} symptomsData - 症状数据 [{name: '头痛', count: 4, severity: 'high'}, ...]
 */
function initSymptomsChart(symptomsData) {
    const chart = echarts.init(document.getElementById('symptoms-chart'));

    const names = symptomsData.map(d => d.name);
    const counts = symptomsData.map(d => d.count);

    // 根据频率设置颜色
    const colors = symptomsData.map(d => {
        if (d.severity === 'high') return '#ef4444';
        if (d.severity === 'medium') return '#f59e0b';
        return '#22c55e';
    });

    const option = {
        title: {
            text: '症状频率统计',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: 'bold' }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        xAxis: {
            type: 'category',
            data: names,
            axisLabel: { interval: 0, rotate: 30 }
        },
        yAxis: {
            type: 'value',
            name: '发生次数'
        },
        series: [{
            type: 'bar',
            data: symptomsData.map((d, i) => ({
                value: d.count,
                itemStyle: { color: colors[i] }
            })),
            label: {
                show: true,
                position: 'top',
                formatter: '{c} 次'
            },
            itemStyle: {
                borderRadius: [4, 4, 0, 0]
            }
        }]
    };

    chart.setOption(option);
    return chart;
}

/**
 * 初始化症状时间线图（堆叠面积图）
 * @param {Array} timelineData - 时间线数据 [{date: '2025-10-01', symptoms: ['头痛', '疲劳']}, ...]
 */
function initSymptomsTimelineChart(timelineData) {
    const chart = echarts.init(document.getElementById('symptoms-timeline-chart'));

    // 聚合症状数据
    const symptomTypes = [...new Set(timelineData.flatMap(d => d.symptoms))];
    const dates = [...new Set(timelineData.map(d => d.date))].sort();

    const series = symptomTypes.map(symptom => {
        const data = dates.map(date => {
            const dayData = timelineData.find(d => d.date === date);
            return dayData && dayData.symptoms.includes(symptom) ? 1 : 0;
        });

        return {
            name: symptom,
            type: 'line',
            data: data,
            stack: 'symptoms',
            areaStyle: {},
            emphasis: { focus: 'series' }
        };
    });

    const option = {
        title: {
            text: '症状时间线',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: 'bold' }
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                const symptoms = params.filter(p => p.value > 0).map(p => p.seriesName);
                return `${params[0].axisValue}<br/>症状: ${symptoms.join(', ') || '无'}`;
            }
        },
        legend: {
            data: symptomTypes,
            top: 40
        },
        xAxis: {
            type: 'category',
            data: dates,
            boundaryGap: false
        },
        yAxis: {
            type: 'value',
            max: 1,
            axisLabel: { show: false }
        },
        series: series
    };

    chart.setOption(option);
    return chart;
}

// ===== 3. 药物依从性图配置 =====

/**
 * 初始化用药依从性仪表盘
 * @param {number} adherenceRate - 依从性百分比 (0-100)
 */
function initMedicationGauge(adherenceRate) {
    const chart = echarts.init(document.getElementById('medication-gauge'));

    const option = {
        title: {
            text: '总体依从性',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: 'bold' }
        },
        series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            splitNumber: 5,
            axisLine: {
                lineStyle: {
                    width: 20,
                    color: [
                        [0.6, '#ef4444'],
                        [0.8, '#f59e0b'],
                        [1, '#22c55e']
                    ]
                }
            },
            pointer: {
                icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                length: '12%',
                width: 20,
                offsetCenter: [0, '-60%'],
                itemStyle: { color: 'auto' }
            },
            axisTick: { length: 12, lineStyle: { color: 'auto', width: 2 } },
            splitLine: { length: 20, lineStyle: { color: 'auto', width: 5 } },
            axisLabel: { color: '#464646', fontSize: 14, distance: -60 },
            detail: {
                valueAnimation: true,
                formatter: '{value}%',
                color: 'auto',
                fontSize: 30,
                offsetCenter: [0, '-20%']
            },
            data: [{ value: adherenceRate }]
        }]
    };

    chart.setOption(option);
    return chart;
}

/**
 * 初始化用药记录饼图
 * @param {Object} medicationStats - 用药统计 {taken: 26, missed: 2, pending: 0}
 */
function initMedicationPie(medicationStats) {
    const chart = echarts.init(document.getElementById('medication-pie'));

    const option = {
        title: {
            text: '用药记录分布',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: 'bold' }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: true,
                formatter: '{b}: {c} 次\n({d}%)'
            },
            emphasis: {
                label: { show: true, fontSize: 16, fontWeight: 'bold' }
            },
            data: [
                { value: medicationStats.taken, name: '已服用', itemStyle: { color: '#22c55e' } },
                { value: medicationStats.missed, name: '漏服', itemStyle: { color: '#ef4444' } },
                { value: medicationStats.pending, name: '待服用', itemStyle: { color: '#f59e0b' } }
            ]
        }]
    };

    chart.setOption(option);
    return chart;
}

// ===== 4. 化验结果趋势图配置 =====

/**
 * 初始化化验结果趋势图（多系列折线图）
 * @param {Object} labData - 化验数据
 * @param {Array} labData.dates - 日期数组
 * @param {Array} labData.series - 指标系列 [{name: '胆固醇', data: [240, 230, 210], unit: 'mg/dL', range: [0, 200]}, ...]
 */
function initLabChart(labData) {
    const chart = echarts.init(document.getElementById('lab-chart'));

    const series = labData.series.map(s => ({
        name: s.name,
        type: 'line',
        data: s.data,
        smooth: true,
        yAxisIndex: s.name === '血糖' ? 1 : 0,
        markLine: {
            silent: true,
            lineStyle: { type: 'dashed' },
            data: [
                { yAxis: s.range[1], name: '参考上限', label: { formatter: `${s.range[1]} ${s.unit}` } }
            ]
        }
    }));

    const option = {
        title: {
            text: '化验指标变化',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: 'bold' }
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                let result = params[0].axisValue + '<br/>';
                params.forEach(p => {
                    result += `${p.seriesName}: ${p.value} ${labData.series.find(s => s.name === p.seriesName).unit}<br/>`;
                });
                return result;
            }
        },
        legend: {
            data: labData.series.map(s => s.name),
            top: 40
        },
        xAxis: {
            type: 'category',
            data: labData.dates,
            boundaryGap: false
        },
        yAxis: [
            {
                type: 'value',
                name: 'mg/dL',
                position: 'left'
            },
            {
                type: 'value',
                name: 'mmol/L',
                position: 'right'
            }
        ],
        series: series
    };

    chart.setOption(option);
    return chart;
}

// ===== 5. 相关性热图配置 =====

/**
 * 初始化相关性热图
 * @param {Object} correlationData - 相关性数据
 * @param {Array} correlationData.xAxis - X 轴标签
 * @param {Array} correlationData.yAxis - Y 轴标签
 * @param {Array} correlationData.data - 相关性矩阵 [[x, y, value], ...]
 */
function initCorrelationHeatmap(correlationData) {
    const chart = echarts.init(document.getElementById('correlation-heatmap'));

    const option = {
        title: {
            text: '指标相关性分析',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: 'bold' }
        },
        tooltip: {
            position: 'top',
            formatter: function(params) {
                return `${correlationData.xAxis[params.value[0]]} × ${correlationData.yAxis[params.value[1]]}<br/>相关系数: ${params.value[2].toFixed(2)}`;
            }
        },
        grid: {
            height: '50%',
            top: '15%'
        },
        xAxis: {
            type: 'category',
            data: correlationData.xAxis,
            splitArea: { show: true }
        },
        yAxis: {
            type: 'category',
            data: correlationData.yAxis,
            splitArea: { show: true }
        },
        visualMap: {
            min: -1,
            max: 1,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '5%',
            inRange: {
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffcc',
                       '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            },
            text: ['正相关', '负相关']
        },
        series: [{
            type: 'heatmap',
            data: correlationData.data,
            label: {
                show: true,
                formatter: function(params) {
                    return params.value[2].toFixed(2);
                }
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };

    chart.setOption(option);
    return chart;
}

// ===== 6. 情绪与睡眠图配置 =====

/**
 * 初始化情绪与睡眠趋势图（双轴面积图）
 * @param {Array} moodSleepData - 情绪睡眠数据
 * @param {Array} moodSleepData.dates - 日期数组
 * @param {Array} moodSleepData.moodScores - 情绪评分数组 (0-10)
 * @param {Array} moodSleepData.sleepHours - 睡眠时长数组 (小时)
 */
function initMoodSleepChart(moodSleepData) {
    const chart = echarts.init(document.getElementById('mood-chart'));

    const option = {
        title: {
            text: '情绪与睡眠趋势',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: 'bold' }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
        },
        legend: {
            data: ['情绪评分', '睡眠时长'],
            top: 40
        },
        xAxis: {
            type: 'category',
            data: moodSleepData.dates,
            boundaryGap: false
        },
        yAxis: [
            {
                type: 'value',
                name: '情绪评分',
                position: 'left',
                min: 0,
                max: 10,
                axisLabel: { formatter: '{value}' }
            },
            {
                type: 'value',
                name: '睡眠时长 (小时)',
                position: 'right',
                min: 0,
                max: 12,
                axisLabel: { formatter: '{value} h' }
            }
        ],
        series: [
            {
                name: '情绪',
                type: 'line',
                data: moodSleepData.moodScores,
                smooth: true,
                yAxisIndex: 0,
                itemStyle: { color: '#ec4899' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(236, 72, 153, 0.4)' },
                        { offset: 1, color: 'rgba(236, 72, 153, 0.05)' }
                    ])
                }
            },
            {
                name: '睡眠',
                type: 'line',
                data: moodSleepData.sleepHours,
                smooth: true,
                yAxisIndex: 1,
                itemStyle: { color: '#6366f1' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(99, 102, 241, 0.4)' },
                        { offset: 1, color: 'rgba(99, 102, 241, 0.05)' }
                    ])
                },
                markLine: {
                    data: [
                        { yAxis: 7, name: '建议睡眠', lineStyle: { type: 'dashed', color: '#22c55e' } }
                    ]
                }
            }
        ]
    };

    chart.setOption(option);
    return chart;
}

// ===== 统一初始化函数 =====

/**
 * 初始化所有图表
 * @param {Object} allData - 所有图表数据
 */
function initAllCharts(allData) {
    const charts = {};

    // 1. 体重/BMI 图表
    if (allData.weight && allData.bmi) {
        charts.weight = initWeightChart(allData.weight, allData.bmi);
    }

    // 2. 症状图表
    if (allData.symptoms) {
        charts.symptoms = initSymptomsChart(allData.symptoms.frequency);
        charts.symptomsTimeline = initSymptomsTimelineChart(allData.symptoms.timeline);
    }

    // 3. 药物依从性图表
    if (allData.medications) {
        charts.medicationGauge = initMedicationGauge(allData.medications.adherenceRate);
        charts.medicationPie = initMedicationPie(allData.medications.stats);
    }

    // 4. 化验结果图表
    if (allData.labResults) {
        charts.labResults = initLabChart(allData.labResults);
    }

    // 5. 相关性热图
    if (allData.correlations) {
        charts.correlations = initCorrelationHeatmap(allData.correlations);
    }

    // 6. 情绪与睡眠图表
    if (allData.moodSleep) {
        charts.moodSleep = initMoodSleepChart(allData.moodSleep);
    }

    return charts;
}

// ===== 导出模块 =====

// 如果在 Node.js 环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initWeightChart,
        initSymptomsChart,
        initSymptomsTimelineChart,
        initMedicationGauge,
        initMedicationPie,
        initLabChart,
        initCorrelationHeatmap,
        initMoodSleepChart,
        initAllCharts
    };
}
