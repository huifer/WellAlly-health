# 健康报告生成器

## 概述

`generate_health_report.py` 是一个综合健康报告生成工具，可以生成专业的HTML格式健康报告，包含多种数据可视化图表。

## 功能特点

- ✅ **综合数据收集**：自动收集生化检查、影像检查、用药记录、辐射剂量等所有健康数据
- ✅ **智能数据分析**：趋势分析、健康评分计算、异常指标检测
- ✅ **专业可视化**：包含趋势图、饼图、柱状图、仪表图等多种图表类型
- ✅ **医疗专业风格**：采用医疗行业标准的配色和布局
- ✅ **响应式设计**：支持桌面、平板、手机等多种设备
- ✅ **打印优化**：优化的打印布局，支持导出PDF
- ✅ **数据隐私**：所有数据仅在本地处理，不上传到云端

## 技术栈

- **后端**: Python 3.6+
- **HTML框架**: Tailwind CSS (通过CDN)
- **图表库**: Chart.js 4.4.0 (通过CDN)
- **图标库**: Lucide Icons (通过CDN)
- **输出格式**: 单个独立的HTML文件

## 使用方法

### 方式一：通过Claude Code命令

```
# 生成综合健康报告
/report comprehensive

# 生成最近季度的报告
/report comprehensive last_quarter

# 生成自定义报告
/report custom 2024-01-01,2024-12-31 biochemical,medication,radiation

# 生成生化趋势报告
/report biochemical last_year
```

### 方式二：直接运行Python脚本

```bash
# 基本用法
python scripts/generate_health_report.py comprehensive

# 指定时间范围
python scripts/generate_health_report.py comprehensive last_quarter

# 自定义章节
python scripts/generate_health_report.py custom 2024-01-01,2024-12-31 profile,biochemical,medication

# 指定输出文件
python scripts/generate_health_report.py comprehensive all all my-report.html
```

## 命令参数说明

### 位置参数

**action** (必需): 报告类型
- `comprehensive` - 综合报告（所有数据）
- `biochemical` - 生化趋势分析
- `imaging` - 影像汇总
- `medication` - 用药分析
- `custom` - 自定义报告

### 可选参数

**date_range** (可选): 时间范围
- `all` - 所有可用数据（默认）
- `last_month` - 上个月
- `last_quarter` - 上季度
- `last_year` - 去年
- `YYYY-MM-DD,YYYY-MM-DD` - 自定义起止日期
- `YYYY-MM-DD` - 从某日期至今

**sections** (可选): 包含的章节（逗号分隔）
- `profile` - 患者概况
- `biochemical` - 生化检查
- `imaging` - 影像检查
- `medication` - 用药分析
- `radiation` - 辐射剂量
- `allergies` - 过敏摘要
- `symptoms` - 症状历史
- `surgeries` - 手术记录
- `discharge` - 出院小结

**output** (可选): 输出文件路径
- 默认: `reports/health-report-YYYY-MM-DD.html`

## 使用示例

### 示例1：生成包含所有数据的综合报告

```bash
python scripts/generate_health_report.py comprehensive
```

输出：
```
正在收集数据... (时间范围: 2020-01-01 至 2025-12-31)
  - 收集患者概况...
  - 收集生化检查数据...
  - 收集影像检查数据...
  - 收集用药数据...
  - 收集辐射记录...
  - 收集过敏数据...
  - 收集症状记录...
  - 收集手术记录...
  - 收集出院小结...
正在生成洞察...
正在生成HTML报告...
✅ 报告已生成: d:\my-his\reports\health-report-2025-12-31.html
```

### 示例2：生成最近季度的报告

```bash
python scripts/generate_health_report.py comprehensive last_quarter
```

### 示例3：生成特定章节的自定义报告

```bash
python scripts/generate_health_report.py custom 2024-01-01,2024-12-31 profile,biochemical,medication,radiation
```

### 示例4：生成生化趋势分析报告

```bash
python scripts/generate_health_report.py biochemical last_year
```

## 报告内容

生成的HTML报告包含以下章节：

### 1. 报告标题
- 报告名称和生成时间
- 数据时间范围
- 患者基本信息（年龄、身高、体重、BMI）

### 2. 执行摘要
- **健康评分**：综合健康评分（0-100分）
- **关键发现**：异常指标、过敏警示等需要关注的事项
- **核心指标**：检查次数、用药种类、累积辐射等统计数据

### 3. 生化检查分析
- 检查统计（总次数、异常项数）
- 指标趋势图（折线图/面积图）
- 异常指标列表

### 4. 影像检查汇总
- 检查类型分布（饼图）
- 检查部位分布（柱状图）
- 检查时间轴

### 5. 用药分析
- 当前用药列表
- 用药依从性统计
- 依从性趋势图

### 6. 辐射剂量追踪
- 累积辐射剂量（仪表图）
- 月度剂量趋势（柱状图）
- 检查类型分布

### 7. 过敏摘要
- 过敏原列表
- 严重程度分类
- 过敏反应描述

### 8. 症状历史
- 症状频率统计
- 症状分布图

### 9. 手术记录
- 手术时间轴
- 植入物信息

### 10. 出院小结
- 住院记录统计
- 诊断分布

## 数据来源

报告生成器从以下位置读取数据：

```
data/
├── profile.json              # 患者基本信息
├── index.json                # 全局索引
├── 生化检查/                  # 生化检验数据
├── 影像检查/                  # 影像检查数据
├── medications/              # 用药计划
├── medication-logs/          # 用药日志
├── radiation-records.json    # 辐射记录
├── allergies.json            # 过敏信息
├── 症状记录/                  # 症状数据
├── 手术记录/                  # 手术数据
└── 出院小结/                  # 出院小结
```

## 输出文件

报告默认保存在：
```
reports/health-report-YYYY-MM-DD.html
```

报告是一个完全独立的HTML文件，可以：
- 在任何现代浏览器中打开查看
- 通过电子邮件分享
- 打印为PDF格式
- 保存到云端存储

## 健康评分计算

健康评分综合考虑以下因素：

| 因素 | 权重 | 说明 |
|------|------|------|
| 生化检查正常率 | 30% | 基于异常指标比例 |
| 用药依从性 | 20% | 基于实际服药率 |
| 辐射安全 | 15% | 基于累积辐射剂量 |
| 症状频率 | 15% | 基于症状记录次数 |
| 过敏管理 | 10% | 基于过敏史数量 |
| 定期检查 | 10% | 基于检查频率 |

### 评分等级

- **优秀** (90-100分): 健康状况良好，继续保持
- **良好** (75-89分): 健康状况较好，有改进空间
- **一般** (60-74分): 需要关注某些健康指标
- **需关注** (0-59分): 建议咨询医生

## 图表类型

报告包含以下类型的图表：

1. **折线图/面积图**: 生化指标趋势、剂量变化
2. **饼图**: 检查类型分布、过敏类型分布
3. **柱状图**: 月度统计、症状频率
4. **仪表图**: 健康评分、辐射剂量
5. **堆叠柱状图**: 用药依从性

## 自定义样式

报告使用医疗专业配色方案：

- **主色**: #0284c7 (蓝色) - 专业、信任
- **成功**: #16a34a (绿色) - 正常、健康
- **警告**: #ca8a04 (黄色) - 监测、注意
- **危险**: #dc2626 (红色) - 异常、紧急

## 常见问题

### Q: 报告中的数据从哪里来？

A: 报告数据来自您的个人医疗数据目录（`data/`），所有数据都是您之前通过HIS系统记录的。

### Q: 报告是否会上传到云端？

A: 不会。报告生成完全在本地进行，所有数据都保存在您的计算机上。

### Q: 如何分享报告给医生？

A: 您可以：
1. 直接发送HTML文件
2. 在浏览器中打开并打印为PDF
3. 使用浏览器的"分享"功能

### Q: 报告可以编辑吗？

A: 生成的HTML文件是静态的，不建议直接编辑。如需修改数据，请通过HIS系统的相关命令更新数据，然后重新生成报告。

### Q: 如何打印报告？

A: 在浏览器中打开报告，使用 Ctrl+P (或 Cmd+P) 打开打印对话框，选择"保存为PDF"即可。

### Q: 报告中的健康评分准确吗？

A: 健康评分仅供参考，基于您记录的数据进行计算。它不能替代专业医生的诊断。如有健康问题，请咨询专业医生。

## 技术支持

如有问题或建议，请访问：https://github.com/huifer/Claude-Ally-Health

## 免责声明

本报告生成工具和生成的报告仅供参考，不作为医疗诊断依据。所有诊疗决策需咨询专业医生。如有紧急情况，请立即就医。

---

**开发者**: WellAlly Tech
**项目地址**: https://github.com/huifer/Claude-Ally-Health
**许可证**: MIT License
