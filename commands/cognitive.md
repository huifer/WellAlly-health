---
description: 认知功能评估命令 - 记录MMSE/MoCA测试、认知域评估、日常功能评估
arguments:
  - name: action
    description: 操作类型 (mmse, moca, domain, adl, iadl, status, trend, risk)
    required: true
  - name: info
    description: 具体信息(测试分数、认知域状态、功能评估等)
    required: false
---

# 认知功能评估命令 (Cognitive Assessment)

## 功能概述

用于管理老年人的认知功能评估，包括MMSE、MoCA测试、认知域评估和日常功能评估。

---

## ⚠️ 安全红线

1. **不诊断认知功能障碍或痴呆**
   - 不做阿尔茨海默病等痴呆诊断
   - 诊断需神经科/老年科医生

2. **不替代神经科/老年科专业评估**
   - 系统仅用于筛查和追踪
   - 异常结果需就医确诊

3. **不给出具体药物治疗方案**
   - 不推荐胆碱酯酶抑制剂等药物
   - 用药需医生处方

---

## ✅ 系统能做到的

- 认知功能筛查(MMSE/MoCA)
- 认知下降趋势追踪
- 日常生活功能评估(ADL/IADL)
- 认知域功能评估
- 风险预警和就医建议

---

## 可用操作

### 1. MMSE测试 - `mmse`

记录简易精神状态检查(Mini-Mental State Examination)结果。

**参数说明:**
- `info`: MMSE测试结果(必填)
  - 总分(0-30分)
  - 分项分数(可选)
- `date`: 测试日期(可选，默认今天)

**执行步骤:**
#### 1. 参数识别
- 从info中提取MMSE总分
- 识别格式: `mmse[:\s]+(\d+)` 或 `score[:\s]+(\d+)`
- 如果有分项分数，一并提取

#### 2. 结果解读
- 27-30分: 正常
- 21-26分: 轻度认知功能障碍
- 10-20分: 中度认知功能障碍
- ≤9分: 重度认知功能障碍

#### 3. 记录更新
- 更新 `data/cognitive-assessment.json`
- 记录测试日期、总分、分项分数
- 计算趋势和年度下降率
- 更新统计数据

#### 4. 输出确认
- 显示本次测试结果
- 显示历史对比(如果有)
- 显示下次评估日期(12个月后)

**示例:**
```
/cognitive mmse score 27
/cognitive mmse 24 定向力9分 记忆力6分
```

---

### 2. MoCA测试 - `moca`

记录蒙特利尔认知评估(Montreal Cognitive Assessment)结果。

**参数说明:**
- `info`: MoCA测试结果(必填)
  - 总分(0-30分)
  - 教育程度(可选，用于调整分数)
- `date`: 测试日期(可选，默认今天)

**执行步骤:**
#### 1. 参数识别
- 从info中提取MoCA总分
- 识别格式: `moca[:\s]+(\d+)` 或 `score[:\s]+(\d+)`
- 提取教育程度(可选)

#### 2. 结果解读
- ≥26分: 正常
- 18-25分: 轻度认知功能障碍
- 10-17分: 中度认知功能障碍
- <10分: 重度认知功能障碍
- 教育程度调整: ≤12年教育加1分

#### 3. 记录更新
- 更新 `data/cognitive-assessment.json`
- 记录测试日期、总分、调整后分数
- 更新统计数据

#### 4. 输出确认
- 显示本次测试结果
- 显示教育程度调整
- 显示下次评估日期

**示例:**
```
/cognitive moca score 24
/cognitive moca 25 教育12年
```

---

### 3. 认知域评估 - `domain`

记录特定认知域的功能状态。

**参数说明:**
- `info`: 认知域评估结果(必填)
  - 认知域名称(memory/executive/language/visuospatial)
  - 功能状态(normal/mild_impairment/moderate_impairment/severe_impairment)
- `date`: 评估日期(可选，默认今天)

**可评估的认知域:**
- `memory` - 记忆力(即时记忆、短期记忆、长期记忆)
- `executive` - 执行功能(计划、问题解决、抽象思维)
- `language` - 语言能力(理解、表达、命名)
- `visuospatial` - 视空间能力(物体识别、空间定向)

**执行步骤:**
#### 1. 参数识别
- 从info中提取认知域名称
- 识别格式: `(memory|executive|language|visuospatial)[:\s]+(\w+)`
- 识别功能状态关键词

#### 2. 记录更新
- 更新 `cognitive_domains` 段
- 记录该认知域的状态
- 更新impaired_domains计数

#### 3. 输出确认
- 显示该认知域的评估结果
- 显示所有受损认知域

**示例:**
```
/cognitive domain memory mild_impairment
/cognitive domain executive normal
/cognitive domain language 轻度障碍
```

---

### 4. 日常活动能力评估 - `adl`

记录日常生活活动能力(Activities of Daily Living)。

**参数说明:**
- `info`: ADL评估结果(必填)
  - 6项基本活动(bathing/dressing/toileting/transferring/continence/feeding)
  - 功能状态(independent/needs_assistance/dependent)
- `date`: 评估日期(可选，默认今天)

**ADL 6项基本活动:**
- `bathing` - 沐浴
- `dressing` - 穿衣
- `toileting` - 如厕
- `transferring` - 转移(从床到椅)
- `continence` - 控制大小便
- `feeding` - 进食

**执行步骤:**
#### 1. 参数识别
- 从info中提取ADL项目和状态
- 识别格式: `(bathing|dressing|toileting|transferring|continence|feeding)[:\s]+(\w+)`

#### 2. 记录更新
- 更新 `functional_impact.activities_of_daily_living` 段
- 记录每项活动的功能状态

#### 3. 输出确认
- 显示ADL评估结果
- 显示依赖程度评分

**示例:**
```
/cognitive adl independent
/cognitive adl bathing independent dressing needs_assistance
```

---

### 5. 工具性日常活动能力评估 - `iadl`

记录工具性日常生活活动能力(Instrumental Activities of Daily Living)。

**参数说明:**
- `info`: IADL评估结果(必填)
  - 8项工具性活动(shopping/cooking/managing_medications/using_telephone/managing_finances等)
  - 功能状态(independent/needs_assistance/supervision_needed/dependent)
- `date`: 评估日期(可选，默认今天)

**IADL 8项工具性活动:**
- `shopping` - 购物
- `cooking` - 做饭
- `managing_medications` - 管理用药
- `using_telephone` - 使用电话
- `managing_finances` - 管理财务
- `housekeeping` - 家务
- `transportation` - 交通出行
- `laundry` - 洗衣

**执行步骤:**
#### 1. 参数识别
- 从info中提取IADL项目和状态
- 识别格式: `(shopping|cooking|managing_medications|using_telephone|managing_finances|housekeeping|transportation|laundry)[:\s]+(\w+)`

#### 2. 记录更新
- 更新 `functional_impact.instrumental_activities` 段
- 记录每项活动的功能状态

#### 3. 输出确认
- 显示IADL评估结果
- 显示需要帮助的项目

**示例:**
```
/cognitive iadl shopping needs_assistance
/cognitive iadl managing_medications supervision_needed
```

---

### 6. 查看认知状态 - `status`

查看当前认知功能评估状态。

**执行步骤:**
#### 1. 读取数据
- 读取 `data/cognitive-assessment.json`

#### 2. 显示状态报告
- 最近一次MMSE/MoCA结果
- 各认知域状态
- ADL/IADL功能状态
- 统计数据

**示例:**
```
/cognitive status
```

---

### 7. 查看变化趋势 - `trend`

查看认知功能变化趋势。

**执行步骤:**
#### 1. 读取历史数据
- 提取MMSE/MoCA历史记录

#### 2. 趋势分析
- 计算年度下降率
- 识别下降速度(stable/slow_decline/rapid_decline)

#### 3. 显示趋势报告
- 历史测试结果对比
- 下降趋势图
- 风险预警

**示例:**
```
/cognitive trend
```

---

### 8. 认知功能风险评估 - `risk`

综合评估认知功能下降风险。

**执行步骤:**
#### 1. 风险因素识别
- 年龄因素(>75岁高风险)
- 教育程度(≤12年增加风险)
- 血管危险因素(高血压、糖尿病等)
- MMSE/MoCA评分
- 认知域受损情况
- ADL/IADL功能状态

#### 2. 风险分级
- 低风险
- 中风险
- 高风险

#### 3. 显示风险评估
- 当前风险等级
- 主要风险因素
- 建议措施
- 就医建议

**示例:**
```
/cognitive risk
```

---

## 注意事项

### 测试标准化
- MMSE/MoCA应在标准化环境下进行
- 考虑教育程度和文化背景影响
- 测试者应经过专业培训

### 结果解读
- 单次测试异常不等于认知障碍
- 需结合日常功能评估
- 趋势比单次分数更重要

### 就医建议
以下情况建议就医:
- MMSE ≤ 26分
- MoCA ≤ 25分
- 多个认知域受损
- ADL/IADL功能下降
- 快速认知下降

---

## 参考资源

- MMSE: Folstein et al. (1975)
- MoCA: Nasreddine et al. (2005)
- NIA-AA痴呆诊断标准
- 中国痴呆诊疗指南
