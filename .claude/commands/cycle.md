---
description: 女性健康周期追踪和症状管理
arguments:
  - name: action
    description: 操作类型：start(开始)/end(结束)/log(记录)/predict(预测)/history(历史)/analyze(分析)/status(状态)/settings(设置)
    required: true
  - name: description
    description: 周期描述（自然语言）
    required: false
  - name: date
    description: 日期（格式：YYYY-MM-DD，默认今天）
    required: false
---

# 女性健康周期追踪

追踪月经周期、PMS症状、排卵期预测，提供个性化健康洞察。

## 操作类型

### 1. 记录周期开始 - `start`

记录月经开始日期，自动计算预测日期。

**参数说明：**
- `description`: 周期描述（可选），自然语言描述
- `date`: 开始日期（可选），格式 YYYY-MM-DD，默认为今天

**示例：**
```
/cycle start 今天来月经了
/cycle start 2025-12-28
/cycle start 这个月28号
/cycle start 记录月经开始 12月28日 腹痛
```

**执行步骤：**

#### 1. 解析输入

从自然语言中提取：
- **日期信息**：今天/指定日期
- **症状关键词**：腹痛、腰酸、头痛等
- **流量描述**：量很大、正常、量少等

#### 2. 验证输入

**检查项：**
- 日期不能是未来日期
- 如果有未结束的周期，提示先结束
- 验证日期格式

**错误处理：**
```
⚠️ 检测到未结束的周期

当前周期：2025年11月28日开始
提示：请先使用 /cycle end 结束当前周期
```

#### 3. 创建周期记录

**生成 cycle_id**：`cycle_YYYYMMDD`
- 示例：`cycle_20251228`

**周期数据结构：**
```json
{
  "cycle_id": "cycle_20251228",
  "period_start": "2025-12-28",
  "period_end": null,
  "cycle_length": null,
  "period_length": null,
  "flow_pattern": {},
  "pms_symptoms": {
    "start_date": null,
    "symptoms": {}
  },
  "daily_logs": [],
  "ovulation_date": null,
  "predictions": {},
  "notes": "",
  "created_at": "2025-12-28T08:00:00.000Z",
  "completed": false
}
```

#### 4. 计算预测日期

**算法：**

1. **获取历史周期数据**：从 `cycle-tracker.json` 读取已完成的周期
2. **计算平均周期长度**：使用最近6个周期
3. **预测下次月经**：`period_start + average_cycle_length`
4. **预测排卵日期**：`next_period - 14 days`
5. **计算易孕期**：`ovulation_date - 5 days` 至 `ovulation_date + 1 day`

**默认值（无历史数据）：**
- 平均周期长度：28天
- 平均经期长度：5天
- 排卵日期：下次月经前14天

#### 5. 更新数据文件

**文件 1**：`data/cycle-tracker.json`
```json
{
  "cycles": [
    // ... 添加新周期到数组
  ],
  "current_cycle": {
    "period_start": "2025-12-28",
    "period_end": null,
    "cycle_length": null,
    "predicted_ovulation": "2026-01-11",
    "predicted_next_period": "2026-01-25",
    "days_since_start": 0
  },
  "statistics": {
    // ... 更新统计数据
  },
  "predictions": {
    "next_period": "2026-01-25",
    "ovulation_date": "2026-01-11",
    "fertile_window_start": "2026-01-06",
    "fertile_window_end": "2026-01-12",
    "confidence": "low"
  }
}
```

**文件 2**：`data/周期记录/YYYY-MM/YYYY-MM-DD_周期记录.json`
```json
{
  "id": "cycle_20251228",
  "period_start": "2025-12-28",
  "period_end": null,
  "created_at": "2025-12-28T08:00:00.000Z",
  "initial_symptoms": ["腹痛"],
  "daily_logs": [],
  "metadata": {
    "completed": false
  }
}
```

#### 6. 输出确认

```
✅ 周期记录已创建

周期信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
本次月经开始：2025年12月28日

预测信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
预计下次月经：2026年1月25日
预计排卵日期：2026年1月11日
易孕期：1月6日 - 1月12日

当前状态：
━━━━━━━━━━━━━━━━━━━━━━━━━━
周期第：1天
阶段：月经期

预测可信度：基础（基于医学平均值28天）
━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 提示：继续记录周期数据，预测将越来越准确

数据已保存至：data/周期记录/2025-12/2025-12-28_周期记录.json

⚠️ 重要声明：
本系统仅供周期追踪和健康参考，不能替代专业医疗建议。
如遇月经周期突然变得不规律、经量异常增多或严重痛经等情况，请及时就医。
```

---

### 2. 记录周期结束 - `end`

记录月经结束日期，完成周期统计。

**参数说明：**
- `date`: 结束日期（可选），格式 YYYY-MM-DD，默认为今天

**示例：**
```
/cycle end 今天结束了
/cycle end 2026-01-01
/cycle end 1月1日结束
```

**执行步骤：**

#### 1. 验证当前周期

**检查项：**
- 是否存在活跃周期
- 结束日期必须在开始日期之后
- 结束日期不能是未来日期

#### 2. 计算周期数据

**经期长度**：`end_date - start_date + 1`

**周期长度**：
- 如果有上一个周期：`current_start - previous_start`
- 如果没有：使用用户设置的平均值

**流量模式**：从 daily_logs 汇总

#### 3. 完成周期记录

**更新周期数据：**
```json
{
  "cycle_id": "cycle_20251228",
  "period_start": "2025-12-28",
  "period_end": "2026-01-01",
  "cycle_length": 28,
  "period_length": 5,
  "completed": true,
  "last_updated": "2026-01-01T20:00:00.000Z"
}
```

#### 4. 更新统计数据

**重新计算：**
- 平均周期长度（最近6个周期）
- 平均经期长度
- 周期规律度评分
- 常见症状统计

**规律度计算：**
```javascript
function calculateRegularityScore(cycles) {
  const lengths = cycles.map(c => c.cycle_length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((a, b) =>
    a + Math.pow(b - avg, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);
  const score = Math.max(0, 1 - (stdDev / 7));

  return {
    score: Math.round(score * 100) / 100,
    stdDev: Math.round(stdDev * 10) / 10,
    average: Math.round(avg * 10) / 10
  };
}
```

#### 5. 重置当前周期

```json
{
  "current_cycle": null
}
```

#### 6. 输出确认

```
✅ 周期已完成

周期统计：
━━━━━━━━━━━━━━━━━━━━━━━━━━
开始日期：2025年12月28日
结束日期：2026年1月1日
经期长度：5天
周期长度：28天

流量模式：
━━━━━━━━━━━━━━━━━━━━━━━━━━
第1天：大量
第2天：大量
第3天：中等
第4天：少量
第5天：少量

累计统计（基于6个周期）：
━━━━━━━━━━━━━━━━━━━━━━━━━━
平均周期长度：28.5天
平均经期长度：5.2天
周期规律度：92% (非常规律) ✅

下次预测：
━━━━━━━━━━━━━━━━━━━━━━━━━━
预计下次月经：2026年1月26日
预计排卵日期：2026年1月12日
易孕期：1月7日 - 1月13日

预测可信度：高 ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━

数据已归档至：data/周期记录/2025-12/2025-12-28_周期记录.json
```

---

### 3. 记录每日日志 - `log`

记录每日流量、症状、情绪等详细信息。

**参数说明：**
- `description`: 日志内容（必填），自然语言描述
- `date`: 日志日期（可选），格式 YYYY-MM-DD，默认为今天

**示例：**
```
/cycle log 今天量很大 腹痛
/cycle log 第二天 中等量 乳房胀痛 情绪低落
/cycle log 经前头痛 经期前3天
/cycle log 流量少 腰酸 乏力
```

**执行步骤：**

#### 1. 解析日志内容

**提取信息：**

**流量强度识别：**
| 关键词 | 强度级别 |
|--------|---------|
| 极多、非常多、特别多、量大 | very_heavy (5) |
| 大、很多、量很大 | heavy (4) |
| 中等、正常、一般 | medium (3) |
| 少、量少、不多 | light (2) |
| 极少、点滴、几乎不用 | spotting (1) |

**症状识别：**
- **常见症状**：腹痛、腰酸、头痛、乳房胀痛、情绪波动、乏力、腹胀、腹泻、便秘等
- **情绪状态**：正常、低落、焦虑、易怒、烦躁、平静等
- **能量水平**：高、中、低

#### 2. 确定周期阶段

**阶段划分：**
- **menstrual** (月经期): 第1-5天
- **follicular** (卵泡期): 第6-13天
- **ovulation** (排卵期): 第14-16天
- **luteal** (黄体期): 第17-28天

**计算规则：**
```javascript
function getCyclePhase(dayNumber, cycleLength) {
  if (dayNumber <= 5) return 'menstrual';
  if (dayNumber <= 13) return 'follicular';
  if (dayNumber <= 16) return 'ovulation';
  return 'luteal';
}
```

#### 3. 创建日志记录

**数据结构：**
```json
{
  "id": "log_20251228001",
  "date": "2025-12-28",
  "cycle_day": 1,
  "phase": "menstrual",
  "flow": {
    "intensity": "heavy",
    "description": "量很大"
  },
  "symptoms": ["腹痛", "腰酸"],
  "mood": "低落",
  "energy_level": "low",
  "medication_taken": [],
  "notes": "",
  "created_at": "2025-12-28T20:00:00.000Z"
}
```

#### 4. 更新周期数据

**更新 flow_pattern：**
```json
{
  "flow_pattern": {
    "day_1": "heavy",
    "day_2": "medium",
    ...
  }
}
```

**更新 daily_logs 数组**

#### 5. 集成症状记录（可选）

**创建 `/symptom` 记录：**
```json
// data/症状记录/2025-12/2025-12-28_腹痛.json
{
  "cycle_context": {
    "related": true,
    "cycle_id": "cycle_20251228",
    "phase": "menstrual",
    "cycle_day": 1
  }
}
```

#### 6. 输出确认

```
✅ 每日日志已记录

日志信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
日期：2025年12月28日
周期第：1天
阶段：月经期

流量：大量 (4级)
症状：腹痛、腰酸
情绪：低落
能量：低

周期进度：
━━━━━━━━━━━━━━━━━━━━━━━━━━
本次周期第 1/5 天（预计）
距离排卵：还有 13 天
距离下次月经：还有 27 天

💡 提示：
经期腹痛常见，建议注意保暖、避免剧烈运动。如疼痛严重可咨询医生。

数据已保存至：data/周期记录/2025-12/2025-12-28_周期记录.json
```

---

### 4. 排卵期预测 - `predict`

显示排卵期预测和易孕期信息。

**参数说明：**
- `mode`: 预测模式（可选），如"备孕模式"

**示例：**
```
/cycle predict
/cycle predict 备孕模式
/cycle predict 下次排卵期
```

**执行步骤：**

#### 1. 读取周期数据

**检查是否有足够的周期数据：**
- < 3个周期：低可信度
- 3-5个周期：中等可信度
- 6-11个周期：高可信度
- ≥12个周期：非常高可信度

#### 2. 计算预测

**算法：**

1. **平均周期长度**：`average(recent 6 cycles)`
2. **下次月经**：`last_period_start + average_cycle_length`
3. **排卵日期**：`next_period - 14 days`
4. **易孕期**：`ovulation - 5 days` 至 `ovulation + 1 day`

#### 3. 计算可信度

**可信度评估：**
| 周期数 | 规律度 | 可信度 |
|--------|--------|--------|
| < 3 | 任何 | 低 |
| 3-5 | ≥0.6 | 中等 |
| 6-11 | ≥0.8 | 高 |
| ≥12 | ≥0.9 | 非常高 |

#### 4. 输出预测

**标准输出：**
```
🔮 排卵期预测

基于最近6个周期数据:
━━━━━━━━━━━━━━━━━━━━━━━━━━
平均周期长度：28.5天
平均经期长度：5.2天
周期规律度：92% (非常规律)

预测结果：
━━━━━━━━━━━━━━━━━━━━━━━━━━
下次月经：2026年1月25日
排卵日期：2026年1月11日
易孕期开始：2026年1月6日
易孕期结束：2026年1月12日

当前状态：
━━━━━━━━━━━━━━━━━━━━━━━━━━
今天：2025年12月31日
距离排卵：还有 11 天
距离下次月经：还有 25 天
当前阶段：卵泡期

可信度：高 ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━

备孕建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 易孕期每天同房可提高受孕几率
• 建议在排卵日前2天至排卵日后1天同房
• 保持健康生活方式，补充叶酸
• 避免烟酒，减少咖啡因摄入
```

**备孕模式输出：**
```
🔮 排卵期预测（备孕模式）

基于最近6个周期数据:
━━━━━━━━━━━━━━━━━━━━━━━━━━
平均周期长度：28.5天
周期规律度：92% (非常规律)
可信度：高 ✅

排卵预测：
━━━━━━━━━━━━━━━━━━━━━━━━━━
预计排卵日期：2026年1月11日

易孕期详细日程：
━━━━━━━━━━━━━━━━━━━━━━━━━━
1月6日（易孕第1天）：受孕概率 10%
1月7日（易孕第2天）：受孕概率 15%
1月8日（易孕第3天）：受孕概率 20%
1月9日（易孕第4天）：受孕概率 25%
1月10日（易孕第5天）：受孕概率 30%
1月11日（排卵日）：受孕概率 35% ⭐
1月12日（易孕第7天）：受孕概率 15%

最佳受孕窗口：
━━━━━━━━━━━━━━━━━━━━━━━━━━
1月9日 - 1月11日（排卵前2天至排卵日）

备孕建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 提前3个月补充叶酸（400-800μg/天）
✅ 易孕期保持适度频繁的同房频率
✅ 同房后躺卧15-30分钟
✅ 保持健康体重和规律作息
✅ 避免高温环境和剧烈运动

⚠️ 注意事项：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 备孕超过12个月未成功，建议咨询医生
• 年龄≥35岁，备孕超过6个月建议就医
• 周期不规律可能影响排卵预测准确性

当前距离排卵期还有 11 天
建议从1月6日开始增加同房频率
```

---

### 5. 查看历史 - `history`

查看周期历史记录。

**参数说明：**
- `count`: 显示数量（可选），默认显示最近6个周期

**示例：**
```
/cycle history
/cycle history 6
/cycle history 12
```

**执行步骤：**

#### 1. 读取周期数据

#### 2. 格式化输出

```
📋 周期历史记录

最近6个周期：
━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 2025年12月28日 - 2026年1月1日
   ━━━━━━━━━━━━━━━━━━━━━━━━━━
   经期长度：5天
   周期长度：28天
   主要症状：腹痛、腰酸
   流量模式：大-大-中-少-少

2. 2025年11月30日 - 12月4日
   ━━━━━━━━━━━━━━━━━━━━━━━━━━
   经期长度：5天
   周期长度：28天
   主要症状：乳房胀痛、头痛
   流量模式：大-大-中-中-少

3. 2025年11月2日 - 11月6日
   ━━━━━━━━━━━━━━━━━━━━━━━━━━
   经期长度：5天
   周期长度：29天
   主要症状：腹痛、乏力
   流量模式：大-中-中-少-少

... (继续显示)

统计摘要：
━━━━━━━━━━━━━━━━━━━━━━━━━━
平均周期长度：28.5天
平均经期长度：5.2天
最短周期：27天 | 最长周期：31天
规律度评分：92% (非常规律)
```

---

### 6. 分析模式 - `analyze`

分析症状模式和周期趋势。

**示例：**
```
/cycle analyze
```

**执行步骤：**

#### 1. 分析症状模式

**统计各阶段症状：**
- 计算每个症状在各阶段的出现频率
- 识别高频症状（≥60%）

#### 2. 分析流量模式

**汇总流量数据：**
- 每天平均流量强度
- 识别流量高峰日

#### 3. 生成健康洞察

**基于数据分析生成建议**

#### 4. 输出分析

```
📊 周期模式分析

周期统计：
━━━━━━━━━━━━━━━━━━━━━━━━━━
已追踪周期：6个
平均周期长度：28.5天
平均经期长度：5.2天
周期范围：27-31天
规律度评分：92% (非常规律) ✅

症状模式分析：
━━━━━━━━━━━━━━━━━━━━━━━━━━

黄体期症状（经期前一周）：
  • 乳房胀痛 - 83% (5/6周期) 🔥
  • 情绪波动 - 67% (4/6周期) 🔥
  • 头痛 - 50% (3/6周期)
  • 腹胀 - 33% (2/6周期)

月经期症状：
  • 腹痛 - 100% (6/6周期) 🔥
  • 腰酸 - 67% (4/6周期) 🔥
  • 乏力 - 50% (3/6周期)
  • 腹胀 - 33% (2/6周期)

卵泡期症状（经期后一周）：
  • 无明显症状

流量模式分析：
━━━━━━━━━━━━━━━━━━━━━━━━━━
第1天：大量 (4.2/5) - 流量高峰日
第2天：大量 (4.0/5)
第3天：中等 (3.1/5)
第4天：少量 (2.3/5)
第5天：少量 (2.0/5)

健康洞察：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 周期非常规律，易于预测
✅ 经期长度正常（5天左右）
✅ PMS症状较轻，主要表现为乳房胀痛和情绪波动
✅ 流量模式正常，前2天量较大后逐渐减少

⚠️ 需要关注：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 头痛多在经前2-3天出现（50%周期），可考虑提前预防
• 腹痛在月经期100%出现，建议注意保暖和休息

个性化建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 经前一周：
   • 减少咖啡因和盐分摄入，缓解乳房胀痛
   • 规律作息，适度运动，改善情绪波动
   • 提前准备止痛药物（如需要）

2. 月经期：
   • 注意保暖，避免受凉
   • 充分休息，避免剧烈运动
   • 温热饮食，缓解腹痛

3. 经期后：
   • 补充富含铁的食物（红肉、菠菜等）
   • 保持健康生活方式

⚠️ 重要声明：
本系统仅供周期追踪和健康参考，不能替代专业医疗建议。
如症状加重或出现异常，请及时就医。
```

---

### 7. 当前状态 - `status`

显示当前周期状态。

**示例：**
```
/cycle status
```

**执行步骤：**

#### 1. 读取当前周期

#### 2. 计算当前状态

**周期天数**：`today - period_start + 1`

**当前阶段**：根据周期天数判断

#### 3. 输出状态

**有活跃周期时：**
```
📍 当前周期状态

当前周期：
━━━━━━━━━━━━━━━━━━━━━━━━━━
开始日期：2025年12月28日
当前日期：2025年12月31日
周期第：4天
阶段：月经期

今日预测：
━━━━━━━━━━━━━━━━━━━━━━━━━━
预计经期结束：2026年1月1日（还有2天）
预计排卵日期：2026年1月11日（还有11天）
预计下次月经：2026年1月25日（还有25天）

近期记录：
━━━━━━━━━━━━━━━━━━━━━━━━━━
12-28: 大量，腹痛、腰酸
12-29: 大量，腹痛
12-30: 中等，乏力
12-31: 中等，无特殊症状

本次周期症状总结：
━━━━━━━━━━━━━━━━━━━━━━━━━━
最常见：腹痛 (3/4天)
次要症状：腰酸、乏力
情绪：正常为主，1天低落
```

**无活跃周期时：**
```
📍 当前周期状态

当前无活跃周期
━━━━━━━━━━━━━━━━━━━━━━━━━━

最近周期：2025年11月30日 - 12月4日

下次预测：
━━━━━━━━━━━━━━━━━━━━━━━━━━
预计下次月经：2025年12月28日（还有3天）
预计排卵日期：2025年12月14日
易孕期：12月9日 - 12月15日

💡 提示：
接近预计月经日期，注意身体变化。
月经开始后可使用 /cycle start 记录。
```

---

### 8. 配置设置 - `settings`

配置个人设置。

**参数说明：**
- `setting`: 设置项（格式：key=value）

**示例：**
```
/cycle settings cycle-length=28
/cycle settings period-length=5
/cycle settings pregnancy-planning=true
/cycle settings help
```

**支持的设置项：**

| 设置项 | 说明 | 默认值 |
|--------|------|--------|
| cycle-length | 平均周期长度（天） | 28 |
| period-length | 平均经期长度（天） | 5 |
| pregnancy-planning | 备孕模式（true/false） | false |

**执行步骤：**

#### 1. 解析设置项

#### 2. 验证设置值

**cycle-length**：21-40天
**period-length**：2-10天

#### 3. 更新设置

```json
{
  "user_settings": {
    "average_cycle_length": 28,
    "average_period_length": 5,
    "pregnancy_planning": true
  }
}
```

#### 4. 输出确认

```
✅ 设置已更新

当前设置：
━━━━━━━━━━━━━━━━━━━━━━━━━━
平均周期长度：28天
平均经期长度：5天
备孕模式：开启 ✅

💡 提示：
备孕模式已开启，预测信息将包含备孕相关建议。
```

**显示所有设置：**
```
📝 当前设置

周期设置：
━━━━━━━━━━━━━━━━━━━━━━━━━━
平均周期长度：28天
平均经期长度：5天

模式设置：
━━━━━━━━━━━━━━━━━━━━━━━━━━
备孕模式：关闭

提示：
━━━━━━━━━━━━━━━━━━━━━━━━━━
使用 /cycle settings key=value 来修改设置
支持的设置项：
  • cycle-length=N (平均周期长度，21-40天)
  • period-length=N (平均经期长度，2-10天)
  • pregnancy-planning=true/false (备孕模式)
```

## 数据结构

### 主文件：data/cycle-tracker.json

```json
{
  "created_at": "2025-12-31T12:00:00.000Z",
  "last_updated": "2025-12-31T12:00:00.000Z",
  "user_settings": {
    "average_cycle_length": 28,
    "average_period_length": 5,
    "pregnancy_planning": false
  },
  "cycles": [
    {
      "cycle_id": "cycle_20251228",
      "period_start": "2025-12-28",
      "period_end": "2026-01-01",
      "cycle_length": 28,
      "period_length": 5,
      "flow_pattern": {
        "day_1": "heavy",
        "day_2": "heavy",
        "day_3": "medium",
        "day_4": "light",
        "day_5": "light"
      },
      "pms_symptoms": {
        "start_date": "2025-12-24",
        "symptoms": {
          "-4 days": ["头痛", "乳房胀痛"],
          "-3 days": ["情绪波动"]
        }
      },
      "daily_logs": [
        {
          "id": "log_20251228001",
          "date": "2025-12-28",
          "cycle_day": 1,
          "phase": "menstrual",
          "flow": {
            "intensity": "heavy",
            "description": "量很大"
          },
          "symptoms": ["腹痛", "腰酸"],
          "mood": "低落",
          "energy_level": "low",
          "medication_taken": [],
          "notes": "",
          "created_at": "2025-12-28T20:00:00.000Z"
        }
      ],
      "ovulation_date": "2026-01-12",
      "predictions": {},
      "notes": "",
      "created_at": "2025-12-28T08:00:00.000Z",
      "completed": true
    }
  ],
  "current_cycle": {
    "period_start": "2026-01-26",
    "period_end": null,
    "cycle_length": null,
    "predicted_ovulation": "2026-02-09",
    "days_since_start": 3
  },
  "statistics": {
    "total_cycles_tracked": 6,
    "average_cycle_length": 28.5,
    "cycle_length_range": [27, 31],
    "average_period_length": 5.2,
    "most_common_symptoms": {
      "luteal": ["乳房胀痛", "情绪波动"],
      "menstrual": ["腹痛", "腰酸"]
    },
    "regularity_score": 0.92
  },
  "predictions": {
    "next_period": "2026-02-23",
    "next_period_confidence": "high",
    "fertile_window_start": "2026-02-07",
    "fertile_window_end": "2026-02-12",
    "ovulation_date": "2026-02-09",
    "prediction_confidence": 0.87
  }
}
```

### 周期记录文件：data/周期记录/YYYY-MM/YYYY-MM-DD_周期记录.json

```json
{
  "id": "cycle_20251228",
  "period_start": "2025-12-28",
  "period_end": "2026-01-01",
  "cycle_length": 28,
  "period_length": 5,

  "daily_logs": [
    {
      "id": "log_20251228001",
      "date": "2025-12-28",
      "cycle_day": 1,
      "phase": "menstrual",
      "flow": {
        "intensity": "heavy",
        "description": "量很大，需要频繁更换"
      },
      "symptoms": ["腹痛", "腰酸", "乏力"],
      "mood": "低落",
      "energy_level": "low",
      "medication_taken": ["布洛芬"],
      "notes": ""
    }
  ],

  "pms_symptoms": {
    "start_date": "2025-12-24",
    "symptoms": {
      "-4 days": ["头痛", "乳房胀痛"],
      "-3 days": ["情绪波动", "食欲增加"],
      "-2 days": ["腹胀", "疲劳"],
      "-1 day": ["腹痛", "腰酸"]
    }
  },

  "ovulation_indicators": {
    "detected": false,
    "method": null,
    "date": null,
    "notes": ""
  },

  "metadata": {
    "created_at": "2025-12-28T08:00:00.000Z",
    "last_updated": "2026-01-01T20:00:00.000Z",
    "completed": true,
    "data_quality": "high"
  }
}
```

## 流量强度标准

| 级别 | 英文 | 中文 | 描述 |
|-----|------|------|------|
| 1 | spotting | 极少 | 几乎不需要护垫 |
| 2 | light | 少量 | 需要护垫，少量 |
| 3 | medium | 中等 | 正常量，需要卫生巾 |
| 4 | heavy | 大量 | 需要频繁更换 |
| 5 | very_heavy | 极多 | 需要夜间防护，可能影响活动 |

## 智能识别规则

### 流量强度识别

**大量 (heavy, 4级):**
- 关键词：大、很多、量很大、流量大、超多

**极多 (very_heavy, 5级):**
- 关键词：极大、特别多、非常多、巨多、严重

**中等 (medium, 3级):**
- 关键词：中等、正常、一般、还可以、标准

**少量 (light, 2级):**
- 关键词：少、量少、不多、小

**极少 (spotting, 1级):**
- 关键词：极少、点滴、一点点、几乎不用、几乎没有

### 症状识别

**常见症状列表：**
- **疼痛类**：腹痛、腰酸、头痛、乳房胀痛、关节痛
- **消化类**：腹胀、腹泻、便秘、恶心、食欲变化
- **情绪类**：情绪波动、易怒、焦虑、低落、烦躁
- **能量类**：乏力、疲劳、精力不足、嗜睡
- **其他**：失眠、皮肤变化、体重变化

### 情绪状态识别

**积极状态**：开心、愉快、平静、正常
**消极状态**：低落、焦虑、易怒、烦躁、抑郁
**中性状态**：一般、正常、还好

### 能量水平识别

**高能量**：精力充沛、有活力、好
**中能量**：正常、一般、还可以
**低能量**：乏力、疲劳、累、没精神

## 算法实现

### 周期长度计算

```javascript
function calculateAverageCycleLength(cycles) {
  if (cycles.length < 2) {
    return {
      average: 28,
      stdDev: 0,
      regularityScore: 0,
      confidence: 'low'
    };
  }

  // 使用最近6个周期
  const recentCycles = cycles.slice(-6).filter(c => c.completed);

  if (recentCycles.length === 0) {
    return { average: 28, stdDev: 0, regularityScore: 0, confidence: 'low' };
  }

  const lengths = recentCycles.map(c => c.cycle_length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((a, b) =>
    a + Math.pow(b - avg, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);
  const regularityScore = Math.max(0, 1 - (stdDev / 7));

  let confidence;
  if (recentCycles.length >= 12 && regularityScore >= 0.9) {
    confidence = 'very_high';
  } else if (recentCycles.length >= 6 && regularityScore >= 0.8) {
    confidence = 'high';
  } else if (recentCycles.length >= 3 && regularityScore >= 0.6) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  return {
    average: Math.round(avg * 10) / 10,
    stdDev: Math.round(stdDev * 10) / 10,
    regularityScore: Math.round(regularityScore * 100) / 100,
    confidence,
    sampleSize: recentCycles.length
  };
}
```

### 排卵期预测

```javascript
function predictOvulation(lastPeriodStart, cycleLength) {
  const nextPeriod = addDays(lastPeriodStart, cycleLength);
  const ovulationDate = subtractDays(nextPeriod, 14);
  const fertileWindowStart = subtractDays(ovulationDate, 5);
  const fertileWindowEnd = addDays(ovulationDate, 1);

  return {
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd,
    nextPeriod
  };
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
}

function subtractDays(date, days) {
  return addDays(date, -days);
}
```

### 规律度评估

```javascript
function getRegularityLabel(score) {
  if (score >= 0.9) return { label: '非常规律', emoji: '✅' };
  if (score >= 0.8) return { label: '规律', emoji: '✅' };
  if (score >= 0.6) return { label: '较规律', emoji: '⚠️' };
  if (score >= 0.4) return { label: '不太规律', emoji: '⚠️' };
  return { label: '不规律', emoji: '❌' };
}
```

## 与其他命令的集成

### 与 /symptom 集成

**自动创建症状记录：**

当使用 `/cycle log` 记录症状时，自动在 `/symptom` 中创建记录并添加周期上下文。

**cycle_context 字段：**
```json
{
  "cycle_context": {
    "related": true,
    "cycle_id": "cycle_20251228",
    "phase": "menstrual",
    "cycle_day": 1,
    "days_before_period": 0
  }
}
```

### 与 /medication 集成

**记录经期用药：**

当记录服用止痛药等药物时，添加周期上下文。

**cycle_context 字段：**
```json
{
  "cycle_context": {
    "related": true,
    "reason": "经期腹痛",
    "phase": "menstrual",
    "cycle_day": 1
  }
}
```

### 与 /report 集成

**周期健康章节：**

在综合健康报告中添加周期数据可视化，包括：
- 周期规律性折线图
- 症状分布饼图
- 流量模式柱状图
- 统计摘要卡片

## 数据结构更新

在全局索引 `data/index.json` 中添加：

```json
{
  "cycle_records": [
    {
      "id": "cycle_20251228",
      "period_start": "2025-12-28",
      "period_end": "2026-01-01",
      "cycle_length": 28,
      "file_path": "周期记录/2025-12/2025-12-28_周期记录.json"
    }
  ],
  "cycle_statistics": {
    "total_cycles": 6,
    "average_cycle_length": 28.5,
    "regularity_score": 0.92,
    "last_updated": "2025-12-31"
  }
}
```

## 错误处理

### 常见错误场景

| 场景 | 错误消息 | 建议 |
|------|---------|------|
| 缺少action参数 | 请指定操作类型<br>使用 /cycle help 查看帮助 | 显示用法示例 |
| 日期格式错误 | 日期格式错误，请使用 YYYY-MM-DD 格式 | 提供正确格式示例 |
| 无周期数据 | 暂无周期数据<br>请先使用 /cycle start 开始记录 | 引导开始记录 |
| 未结束周期冲突 | 检测到未结束的周期<br>请先使用 /cycle end 结束当前周期 | 提示先结束 |
| 未来日期 | 不能记录未来日期<br>请检查日期输入 | 验证当前日期 |
| 周期过于不规律 | 周期不规律（标准差>7天）<br>预测可能有较大误差，建议咨询医生 | 提供就医建议 |
| 设置值超出范围 | cycle-length 应在 21-40 天之间 | 提供有效范围 |

## 注意事项

- 本系统仅供周期追踪和健康参考，不能替代专业医疗建议
- 所有数据仅保存在本地，确保隐私安全
- 预测准确性随周期数据增加而提高
- 周期不规律时，建议结合其他方法（体温监测、排卵试纸）提高准确性
- 备孕超过12个月未成功，建议咨询医生
- 如有异常症状（严重痛经、经量过多、周期突然不规律等），请及时就医

## 示例用法

```
# 记录月经开始
/cycle start 今天来月经了

# 记录每日日志
/cycle log 今天量很大 腹痛
/cycle log 第二天 中等量 腰酸
/cycle log 经前头痛 经期前3天

# 记录月经结束
/cycle end 今天结束了

# 查看排卵期预测
/cycle predict
/cycle predict 备孕模式

# 查看当前状态
/cycle status

# 查看历史记录
/cycle history

# 分析模式
/cycle analyze

# 配置设置
/cycle settings cycle-length=29
/cycle settings pregnancy-planning=true
```

## 医学声明

**每次重要输出必须包含：**

```
⚠️ 重要声明

本系统仅供周期追踪和健康参考，不能替代专业医疗建议。

如遇以下情况，请及时就医：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 月经周期突然变得不规律（之前规律）
• 经量异常增多或经期延长（>7天）
• 严重痛经影响日常生活
• 非经期阴道出血
• 备孕超过12个月未成功
• 年龄≥35岁备孕超过6个月未成功
• 其他异常症状或疑虑

所有数据仅保存在本地，确保隐私安全。
```
