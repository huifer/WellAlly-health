---
description: 生成综合健康报告（HTML格式，包含多维度数据可视化）
arguments:
  - name: action
    description: 报告类型：comprehensive(综合报告)/biochemical(生化趋势)/imaging(影像汇总)/medication(用药分析)/custom(自定义)
    required: true
  - name: date_range
    description: 时间范围（格式：YYYY-MM-DD,YYYY-MM-DD 或 last_month/last_quarter/last_year/all）
    required: false
  - name: sections
    description: 包含的报告章节（逗号分隔：profile,biochemical,imaging,medication,radiation,allergies,symptoms,surgeries,discharge）
    required: false
  - name: output
    description: 输出文件名（可选，默认：health-report-YYYY-MM-DD.html）
    required: false
---

# 综合健康报告生成

生成专业的HTML格式健康报告，包含多种数据可视化图表，支持打印输出。

## 报告类型

### 1. 综合报告 - `comprehensive`

包含所有可用的健康数据章节，生成完整的健康报告。

**默认包含的章节：**
- 患者概况
- 生化检查分析
- 影像检查汇总
- 用药分析
- 辐射剂量追踪
- 过敏摘要
- 症状历史
- 手术记录
- 出院小结

### 2. 生化趋势分析 - `biochemical`

专注于生化检查数据的趋势分析和可视化。

### 3. 影像汇总 - `imaging`

影像检查记录的汇总和统计。

### 4. 用药分析 - `medication`

用药计划、依从性分析和用药历史。

### 5. 自定义报告 - `custom`

用户自定义包含的章节和数据范围。

## 时间范围参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `all` | 所有可用数据 | `/report comprehensive all` |
| `last_month` | 上个月（自然月） | `/report comprehensive last_month` |
| `last_quarter` | 上季度（3个月） | `/report comprehensive last_quarter` |
| `last_year` | 去年（12个月） | `/report comprehensive last_year` |
| `YYYY-MM-DD,YYYY-MM-DD` | 自定义起止日期 | `/report custom 2024-01-01,2024-12-31` |
| `YYYY-MM-DD` | 从某日期至今 | `/report custom 2024-06-01` |

## 章节选择

使用 `custom` 报告类型时，可以通过逗号分隔指定包含的章节：

| 章节代码 | 说明 |
|---------|------|
| `profile` | 患者概况（年龄、BMI、体表面积等） |
| `biochemical` | 生化检查趋势和统计 |
| `imaging` | 影像检查汇总 |
| `medication` | 用药分析和依从性 |
| `radiation` | 辐射剂量追踪 |
| `allergies` | 过敏摘要 |
| `symptoms` | 症状历史和模式 |
| `surgeries` | 手术记录 |
| `discharge` | 出院小结 |

## 输出文件

默认输出到 `reports/health-report-YYYY-MM-DD.html`

可以通过 `output` 参数指定自定义文件名：
```
/report comprehensive all all my-health-report.html
```

## 执行步骤

### 步骤 1: 解析参数并确定时间范围

1. 解析 `action` 参数，确定报告类型
2. 解析 `date_range` 参数，计算起止日期
3. 解析 `sections` 参数，确定包含的章节
4. 确定输出文件路径

### 步骤 2: 加载全局索引

读取 `data/index.json`，获取所有数据文件的索引信息。

如果索引文件不存在，扫描数据目录构建索引。

### 步骤 3: 收集数据

根据确定的章节，并行收集各类型数据：

**3.1 收集患者概况**
- 读取 `data/profile.json`
- 提取：年龄、身高、体重、BMI、体表面积

**3.2 收集生化检查数据**
- 从索引中获取生化检查文件路径
- 读取指定时间范围内的所有生化检查记录
- 聚合指标数据，计算趋势
- 统计异常指标数量和分布

**3.3 收集影像检查数据**
- 从索引中获取影像检查文件路径
- 读取指定时间范围内的所有影像检查记录
- 统计检查类型、部位分布
- 提取关键发现

**3.4 收集用药数据**
- 读取 `data/medications/medications.json`（当前用药计划）
- 读取 `data/medication-logs/YYYY-MM/*.json`（用药日志）
- 计算用药依从性
- 统计漏服情况

**3.5 收集辐射记录**
- 读取 `data/radiation-records.json`
- 计算累积剂量
- 按月份统计剂量分布

**3.6 收集过敏数据**
- 读取 `data/allergies.json`
- 按严重程度分类
- 统计过敏类型分布

**3.7 收集症状记录**
- 读取 `data/症状记录/YYYY-MM/*.json`
- 统计症状频率和分布
- 分析症状模式

**3.8 收集手术记录**
- 读取 `data/手术记录/YYYY-MM/*.json`
- 构建手术时间轴
- 统计手术类型分布

**3.9 收集出院小结**
- 读取 `data/出院小结/YYYY-MM/*.json`
- 统计住院次数和天数
- 分析诊断分布

### 步骤 4: 数据分析和统计

对收集的数据进行统计分析：

**4.1 趋势分析**
- 对生化指标进行时间序列分析
- 计算趋势方向（上升、下降、稳定）
- 识别显著变化

**4.2 分布统计**
- 计算各数据类型的分布情况
- 生成统计摘要（平均值、中位数、标准差等）

**4.3 异常检测**
- 识别异常生化指标
- 识别需要关注的检查结果
- 标记需要随访的项目

**4.4 健康评分**
- 综合各项指标计算整体健康评分
- 评分范围：0-100分
- 评分等级：优秀(≥90)、良好(75-89)、一般(60-74)、需关注(<60)

**4.5 生成洞察**
- 汇总关键发现
- 识别需要关注的健康问题
- 生成改进建议

### 步骤 5: 生成HTML报告

**5.1 构建HTML文档结构**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>健康报告 - {生成日期}</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@3.0.1/dist/chartjs-plugin-annotation.min.js"></script>

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>

    <!-- 自定义样式 -->
    <style>
        /* 医疗专业风格样式 */
        :root {
            --medical-primary: #0284c7;
            --medical-success: #16a34a;
            --medical-warning: #ca8a04;
            --medical-danger: #dc2626;
            --medical-gray: #6b7280;
        }

        body {
            font-family: 'Inter', 'Helvetica Neue', 'Arial', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f9fafb;
        }

        .card {
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .chart-container {
            position: relative;
            height: 400px;
            width: 100%;
        }

        /* 打印优化 */
        @media print {
            .no-print { display: none !important; }
            .card, .chart-wrapper {
                page-break-inside: avoid;
                box-shadow: none;
                border: 1px solid #e5e7eb;
            }
            @page {
                size: A4;
                margin: 1.5cm;
            }
        }

        /* 响应式设计 */
        @media (max-width: 639px) {
            .chart-container { height: 250px !important; }
        }
    </style>

    <!-- Tailwind配置 -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        medical: {
                            primary: '#0284c7',
                            success: '#16a34a',
                            warning: '#ca8a04',
                            danger: '#dc2626'
                        }
                    }
                }
            }
        }
    </script>
</head>
<body>
    <!-- 报告内容将在这里生成 -->
</body>
</html>
```

**5.2 生成各章节HTML**

**页头章节**
- 报告标题和生成日期
- 数据时间范围
- 患者概况卡片（年龄、BMI、体表面积）

**执行摘要章节**
- 健康评分仪表图
- 关键发现列表（异常指标、过敏警示等）
- 核心指标卡片（检查次数、依从性、累积剂量等）

**各数据章节**
根据选择的章节，生成相应的内容：
- 章节标题和图标
- 统计数据卡片
- 可视化图表
- 详细数据表格

**页脚章节**
- 免责声明
- 数据来源说明
- 生成时间戳

**浮动导航**
- 快速跳转链接到各章节
- 返回顶部按钮
- 打印按钮（仅在屏幕显示）

### 步骤 6: 生成Chart.js配置

为每种数据类型生成相应的图表配置：

**6.1 趋势图（折线图）**
用于展示生化指标随时间的变化
```javascript
{
    type: 'line',
    data: {
        labels: ['2024-01', '2024-02', '2024-03'],
        datasets: [{
            label: '白细胞计数',
            data: [6.5, 7.2, 6.8],
            borderColor: '#0284c7',
            backgroundColor: 'rgba(2, 132, 199, 0.1)',
            fill: true,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            tooltip: { mode: 'index', intersect: false }
        }
    }
}
```

**6.2 柱状图**
用于展示分布数据
```javascript
{
    type: 'bar',
    data: {
        labels: ['血液常规', '生化全项', '凝血功能'],
        datasets: [{
            label: '检查次数',
            data: [12, 8, 5],
            backgroundColor: ['#0284c7', '#16a34a', '#ca8a04']
        }]
    }
}
```

**6.3 饼图**
用于展示占比分布
```javascript
{
    type: 'pie',
    data: {
        labels: ['正常', '异常', '临界'],
        datasets: [{
            data: [85, 10, 5],
            backgroundColor: ['#16a34a', '#dc2626', '#ca8a04']
        }]
    }
}
```

**6.4 仪表图（环形图）**
用于展示评分和百分比
```javascript
{
    type: 'doughnut',
    data: {
        labels: ['已使用', '剩余'],
        datasets: [{
            data: [7.5, 2.5],
            backgroundColor: ['#16a34a', '#e5e7eb'],
            circumference: 270,
            rotation: 225
        }]
    },
    options: {
        cutout: '75%',
        plugins: {
            legend: { display: false }
        }
    }
}
```

### 步骤 7: 初始化图表和图标

在HTML文档末尾添加JavaScript代码：
```javascript
// 初始化Lucide图标
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // 初始化所有图表
    initializeCharts();
});

function initializeCharts() {
    // 根据数据生成图表实例
    // 例如：new Chart(ctx, config);
}
```

### 步骤 8: 保存HTML文件

1. 确保 `reports/` 目录存在
2. 将生成的HTML内容写入文件
3. 返回文件路径

### 步骤 9: 输出确认信息

```
✅ 健康报告已生成

文件位置：reports/health-report-2025-12-31.html
报告类型：综合健康报告
数据范围：2024-01-01 至 2025-12-31
生成时间：2025-12-31 12:34:56

包含章节：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ 患者概况
✓ 生化检查分析（12次检查）
✓ 影像检查汇总（5次检查）
✓ 用药分析（3种药物）
✓ 辐射剂量追踪
✓ 过敏摘要
✓ 症状历史
✓ 手术记录
✓ 出院小结

💡 提示：
• 在浏览器中打开HTML文件查看完整报告
• 支持打印为PDF格式
• 所有数据仅保存在本地
```

## 数据可视化策略

### 图表类型映射

| 数据类型 | 主要图表 | 辅助图表 |
|---------|---------|---------|
| 生化指标趋势 | 折线图 | 面积图 |
| 异常指标分布 | 柱状图 | 饼图 |
| 检查类型统计 | 饼图 | 柱状图 |
| 用药依从性 | 堆叠柱状图 | 折线图 |
| 辐射累积剂量 | 仪表图 | 柱状图 |
| 过敏严重程度 | 横向柱状图 | - |
| 症状频率 | 柱状图 | 热力图 |
| 时间线事件 | 时间轴图 | 甘特图 |

### 配色方案

使用医疗专业配色：

**语义颜色**
- 正常/成功：`#16a34a` (绿色)
- 警告/监测：`#ca8a04` (黄色)
- 危险/异常：`#dc2626` (红色)
- 信息/主色：`#0284c7` (蓝色)
- 中性/默认：`#6b7280` (灰色)

**图表配色**
- 趋势图：蓝色系 `#0284c7`
- 分布图：蓝、绿、黄、红渐变
- 对比图：蓝色 vs 红色

## 错误处理

### 数据缺失

当某个数据类型没有记录时：
- 在报告中显示"暂无数据"
- 跳过相关图表生成
- 在统计中标注为0

### 文件读取失败

- 显示警告信息，继续生成其他章节
- 在报告中标注数据缺失
- 记录错误日志

### 时间范围无效

- 提示用户检查日期格式
- 默认使用最近3个月数据

## 示例用法

```
# 生成包含所有数据的综合健康报告
/report comprehensive

# 生成最近季度的综合报告
/report comprehensive last_quarter

# 生成去年的综合报告
/report comprehensive last_year

# 生成自定义时间范围的报告
/report custom 2024-01-01,2024-12-31

# 生成包含特定章节的报告
/report custom 2024-06-01,, biochemical,medication,radiation

# 生成生化趋势分析报告
/report biochemical last_year

# 生成指定文件名的报告
/report comprehensive all all my-report.html
```

## 注意事项

- **隐私保护**：所有数据仅保存在本地，不上传到云端
- **免责声明**：报告仅供参考，不作为医疗诊断依据
- **数据安全**：建议定期备份 `data/` 目录
- **浏览器兼容**：推荐使用现代浏览器（Chrome、Firefox、Edge、Safari）
- **打印优化**：报告已优化打印布局，支持导出PDF
- **响应式设计**：支持桌面、平板、手机等多种设备

## 安全性声明

本报告生成系统：
- ✅ 不提供具体医疗建议
- ✅ 不开具药物处方
- ✅ 不做疾病诊断
- ✅ 不替代专业医生
- ✅ 所有数据仅供个人健康管理参考

如有健康问题，请及时咨询专业医生。
