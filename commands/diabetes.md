---
description: 管理糖尿病血糖监测、HbA1c追踪和并发症筛查
arguments:
  - name: action
    description: 操作类型：record(记录血糖)/hba1c(糖化血红蛋白)/trend(趋势分析)/tir(目标范围内时间)/hypo(低血糖事件)/screening(并发症筛查)/target(血糖目标)/achievement(达标情况)/medication(用药管理)
    required: true
  - name: info
    description: 详细信息（血糖值、HbA1c值、评估结果等，自然语言描述）
    required: false
---

# 糖尿病管理

全面的血糖监测和糖尿病管理，帮助控制血糖、预防并发症。

## ⚠️ 医学安全声明

**重要提示：本系统仅供健康监测记录，不能替代专业医疗诊断和治疗。**

- ❌ 不给出具体用药剂量调整建议
- ❌ 不直接开具处方药或推荐具体药物
- ❌ 不替代医生诊断和治疗决策
- ❌ 不判断疾病预后或并发症发生
- ✅ 提供血糖监测记录和趋势分析（仅供参考）
- ✅ 提供HbA1c追踪和达标情况
- ✅ 提供并发症筛查记录和提醒
- ✅ 提供低血糖事件记录和分析
- ✅ 提供生活方式建议和就医提醒

所有用药方案和治疗决策请遵从医生指导。

## 操作类型

### 1. 记录血糖 - `record`

记录血糖测量数据。

**参数说明：**
- `info`: 血糖信息（必填），使用自然语言描述

**示例：**
```
/glucose record fasting 6.5
/glucose record postprandial 8.2
/glucose record bedtime 7.2
/glucose record random 9.5
/glucose record fasting 6.8 before breakfast
```

**支持的血糖类型：**
- **fasting**：空腹血糖（目标：4.4-7.0 mmol/L）
- **postprandial** / **postprandial_2h**：餐后2小时血糖（目标：<10.0 mmol/L）
- **bedtime**：睡前血糖（目标：6.0-9.0 mmol/L）
- **random**：随机血糖

**执行步骤：**
1. 解析血糖数值和测量类型
2. 生成记录ID和时间戳
3. 保存到 `data/diabetes-tracker.json`
4. 更新血糖统计
5. 输出确认信息

### 2. 记录HbA1c - `hba1c`

记录糖化血红蛋白检测结果。

**示例：**
```
/glucose hba1c 6.8
/glucose hba1c 7.2 2025-06-15
/glucose hba1c history
```

**执行步骤：**
1. 解析HbA1c数值
2. 计算与上次检测结果的变化
3. 保存到历史记录
4. 判断是否达标（目标：<7.0%）
5. 输出趋势分析

### 3. 查看血糖趋势 - `trend`

查看血糖变化趋势。

**示例：**
```
/glucose trend
/glucose trend 7days
/glucose trend this month
```

**输出内容：**
- 血糖趋势图（文字描述）
- 日内血糖波动
- 低血糖/高血糖事件
- 达标情况

### 4. 查看TIR - `tir`

查看葡萄糖目标范围内时间（Time in Range）。

**示例：**
```
/glucose tir
/glucose tir 14days
```

**输出内容：**
- TIR百分比（目标：>70%）
- 目标范围内时间（小时）
- 高于范围时间（小时）
- 低于范围时间（小时）
- 测量周期

**TIR定义（一般糖尿病患者）：**
- 目标范围：3.9-10.0 mmol/L
- TIR目标：>70%
- 高于范围：<10%
- 低于范围：<4%

### 5. 记录低血糖事件 - `hypo`

记录低血糖事件详情。

**示例：**
```
/glucose hypo 3.4 sweating
/glucose hypo 2.8 confusion took glucose
/glucose hypo 3.0 palpitations tremor juice
/glucose hypo history
```

**低血糖分级：**
- **1级**：血糖 <3.9 mmol/L，但≥3.0 mmol/L
- **2级**：血糖 <3.0 mmol/L
- **3级**：严重低血糖，需要他人帮助

**支持的症状记录：**
- sweating（出汗）
- palpitations（心悸）
- tremor（颤抖）
- hunger（饥饿）
- confusion（意识模糊）
- dizziness（头晕）

**处理建议：**
```
⚠️ 检测到低血糖（<3.9 mmol/L）

立即处理：
━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 服用15g快速升糖食物
   • 3-5颗葡萄糖片
   • 150ml果汁或含糖饮料
   • 1汤匙蜂蜜

2. 等待15分钟后复测

3. 如仍低于3.9 mmol/L，重复步骤1

4. 血糖恢复正常后，如距下一餐>1小时，
   进食少量长效碳水化合物
```

### 6. 并发症筛查记录 - `screening`

记录糖尿病并发症筛查结果。

**示例：**
```
/glucose screening retina none
/glucose screening kidney uacr 45 egfr 78
/glucose screening nerve normal
/glucose screening foot normal
/glucose screening retina mild 2025-06-15
```

**支持的筛查类型：**

#### 视网膜病变筛查 - `retina`
```
/glucose screening retina none
/glucose screening retina mild
/glucose screening retina moderate
/glucose screening retina severe
/glucose screening retina proliferative
```

#### 糖尿病肾病筛查 - `kidney`
```
/glucose screening kidney normal
/glucose screening kidney microalbuminuria uacr 45 egfr 78
/glucose screening kidney macroalbuminuria uacr 300 egfr 55
```

**CKD分期：**
- G1：eGFR ≥90（正常）
- G2：eGFR 60-89（轻度下降）
- G3a：eGFR 45-59（轻中度下降）
- G3b：eGFR 30-44（中重度下降）
- G4：eGFR 15-29（重度下降）
- G5：eGFR <15（肾衰竭）

**白蛋白尿分期：**
- A1：UACR <30（正常）
- A2：UACR 30-300（微量白蛋白尿）
- A3：UACR >300（大量白蛋白尿）

#### 神经病变筛查 - `nerve`
```
/glucose screening nerve normal
/glucose screening nerve abnormal
/glucose screening neuropathy monofilament normal
```

#### 糖尿病足筛查 - `foot`
```
/glucose screening foot normal
/glucose screening foot low_risk
/glucose screening foot high_risk ulcer wagner 1
```

**Wagner分级：**
- 0级：无溃疡
- 1级：浅表溃疡
- 2级：深部溃疡
- 3级：深部溃疡伴脓肿/骨髓炎
- 4级：局部坏疽
- 5级：全足坏疽

### 7. 查看血糖目标 - `target`

查看个体化血糖管理目标。

**示例：**
```
/glucose target
```

**输出内容：**
- 空腹血糖目标
- 餐后2小时血糖目标
- 睡前血糖目标
- HbA1c目标
- TIR目标
- 个体化依据

**一般血糖目标：**
| 指标 | 一般成人 | 老年/脆弱 | 妊娠糖尿病 |
|------|---------|----------|-----------|
| 空腹/餐前 | 4.4-7.0 | 5.0-8.0 | 3.3-5.3 |
| 餐后2h | <10.0 | <11.0 | 6.7-7.8 |
| 睡前 | 6.0-9.0 | 6.0-10.0 | 6.0-7.8 |
| HbA1c | <7.0% | <8.0% | <6.0% |
| TIR | >70% | >50% | >70% |

### 8. 查看达标情况 - `achievement`

查看血糖达标率和控制情况。

**示例：**
```
/glucose achievement
/glucose achievement 30days
```

**输出内容：**
- HbA1c达标情况
- 空腹血糖达标率
- 餐后血糖达标率
- TIR达标情况
- 控制评价

### 9. 用药管理 - `medication`

管理糖尿病相关用药（集成药物管理系统）。

**示例：**
```
/glucose medication add 二甲双胍 500mg 每天3次 餐后
/glucose medication list
/glucose medication adherence
```

**执行流程：**
1. 解析药物信息
2. 调用 `/medication add` 命令添加药物
3. 在 diabetes-tracker.json 中添加引用记录
4. 输出确认信息

## 数据结构

### 血糖记录结构
```json
{
  "id": "glu_20250620070000001",
  "date": "2025-06-20",
  "time": "07:00",
  "type": "fasting",
  "value": 6.5,
  "unit": "mmol/L",
  "notes": "",
  "created_at": "2025-06-20T07:00:00.000Z"
}
```

### HbA1c记录结构
```json
{
  "date": "2025-06-15",
  "value": 6.8,
  "unit": "%",
  "change_from_previous": -0.3,
  "created_at": "2025-06-15T00:00:00.000Z"
}
```

### 低血糖事件结构
```json
{
  "id": "hypo_20250618153000001",
  "date": "2025-06-18",
  "time": "15:30",
  "value": 3.4,
  "severity": "level_1",
  "symptoms": ["sweating", "palpitations"],
  "treatment": "glucose_tablets",
  "resolved": true,
  "created_at": "2025-06-18T15:30:00.000Z"
}
```

### 并发症筛查结构
```json
{
  "retinopathy": {
    "status": "none",
    "last_exam": "2025-03-20",
    "next_exam": "2026-03-20"
  },
  "nephropathy": {
    "status": "microalbuminuria",
    "uacr": 45,
    "egfr": 78,
    "ckd_stage": "G2A2",
    "last_assessment": "2025-06-10"
  },
  "neuropathy": {
    "status": "none",
    "monofilament_test": "normal",
    "last_assessment": "2025-06-15"
  },
  "foot": {
    "status": "low_risk",
    "pulses_present": true,
    "ulcer": false,
    "wagner_grade": 0,
    "last_assessment": "2025-06-15"
  }
}
```

## 血糖控制目标

### 成人2型糖尿病
- **HbA1c**：<7.0%
- **空腹血糖**：4.4-7.0 mmol/L
- **餐后2h血糖**：<10.0 mmol/L
- **TIR**：>70%

### 老年/脆弱患者
- **HbA1c**：<8.0%
- **空腹血糖**：5.0-8.0 mmol/L
- **餐后2h血糖**：<11.0 mmol/L
- **TIR**：>50%

### 妊娠糖尿病
- **空腹血糖**：3.3-5.3 mmol/L
- **餐后1h血糖**：<7.8 mmol/L
- **餐后2h血糖**：6.7-7.8 mmol/L
- **HbA1c**：<6.0%

## 并发症筛查频率建议

### 视网膜病变
- **诊断时**：散瞳眼底检查
- **无病变**：每1-2年1次
- **有病变**：每6-12个月1次

### 糖尿病肾病
- **每年检查**：UACR、eGFR、血肌酐
- **异常**：每3-6个月1次

### 神经病变
- **每年检查**：10g单丝测试、神经传导速度

### 糖尿病足
- **每次就诊**：足部检查
- **高风险**：每1-3个月1次

## 低血糖处理流程

### 轻度低血糖（血糖3.0-3.9 mmol/L）
1. 立即停止活动
2. 服用15g快速升糖食物
3. 15分钟后复测血糖
4. 如仍低，重复步骤2

### 重度低血糖（血糖<3.0 mmol/L或意识不清）
1. **不要**经口喂食（有窒息风险）
2. 立即拨打120或送医
3. 医生会给予葡萄糖静脉注射或胰高血糖素注射
4. 监测血糖直至意识恢复

## 生活方式建议

### 饮食管理
- 规律三餐，定时定量
- 控制总热量，维持理想体重
- 选择低升糖指数（GI）食物
- 增加膳食纤维摄入
- 限制单糖摄入

### 运动建议
- 规律运动（每周150分钟中等强度）
- 餐后1-2小时运动最佳
- 避免空腹运动（防低血糖）
- 如睡前血糖<7.0 mmol/L，睡前加餐

### 体重管理
- BMI <24 kg/m²
- 腰围：男性<90cm，女性<85cm
- 减重5-10%可显著改善血糖

### 其他建议
- 戒烟限酒
- 规律作息
- 定期监测血糖
- 足部日常护理

## 就医建议

### 紧急就医（立即拨打120）
- 重度低血糖（意识不清、昏迷）
- 酮症酸中毒（恶心、呕吐、腹痛、深大呼吸）
- 高血糖高渗状态（严重脱水、意识模糊）
- 感染发热且血糖>16.7 mmol/L

### 尽快就医（48小时内）
- 血糖持续>16.7 mmol/L
- 频繁低血糖发作
- 并发症症状加重
- 药物副作用明显

### 定期复查
- **每3个月**：HbA1c、血脂、肾功能
- **每年1次**：眼底检查、神经病变筛查、足部检查
- **每6个月**：并发症评估

## 监测频率建议

### 口服降糖药
- **每周3-4天**：空腹 + 餐后2h（轮换）
- **每月1次**：3天血糖谱（空腹、三餐后2h、睡前）

### 胰岛素治疗
- **每天**：空腹 + 三餐后2h + 睡前（至少4次）
- **每2周**：全天血糖谱（7次）

### 血糖控制良好
- **每周2-3天**：空腹 + 餐后2h
- **每3个月**：连续3天血糖谱

## 错误处理

- **血糖值无效**："血糖值应在正常范围内（1.0-30.0 mmol/L）"
- **信息不完整**："请提供完整的血糖信息，例如：/glucose record fasting 6.5"
- **无数据**："暂无血糖记录，请先使用 /glucose record 记录血糖"
- **文件读取失败**："无法读取血糖数据，请检查数据文件"

## 示例用法

```
# 记录血糖
/glucose record fasting 6.5
/glucose record postprandial 8.2
/glucose record bedtime 7.2

# HbA1c管理
/glucose hba1c 6.8
/glucose hba1c history

# 查看趋势和统计
/glucose trend
/glucose tir
/glucose achievement
/glucose target

# 低血糖管理
/glucose hypo 3.4 sweating
/glucose hypo history

# 并发症筛查
/glucose screening retina none
/glucose screening kidney uacr 45
/glucose screening nerve normal
/glucose screening foot normal

# 用药管理
/glucose medication add 二甲双胍 500mg 每天3次 餐后
/glucose medication list
```

## 注意事项

- 测血糖前洗净双手并擦干
- 避免挤压手指（影响结果）
- 定期校准血糖仪
- 记录测量时间和相关因素（如运动、饮食）
- 注意不同时间段的血糖目标差异
- 定期与医生分享血糖记录

---

**免责声明：本系统仅供健康监测记录使用，不替代专业医疗诊断和治疗。**
