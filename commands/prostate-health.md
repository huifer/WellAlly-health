---
description: 前列腺健康管理和PSA监测
arguments:
  - name: action
    description: 操作类型：psa(PSA检测)/ipss(IPSS评分)/dre(直肠指检)/ultrasound(超声)/status(状态)/screening(筛查计划)/risk(风险评估)
    required: true
  - name: info
    description: 前列腺健康信息（PSA值、症状、检查结果等，自然语言描述）
    required: false
---

# 前列腺健康管理

前列腺健康追踪和管理,包括PSA监测、IPSS症状评分、前列腺检查计划和风险评估。

## 操作类型

### 1. 记录PSA检测 - `psa`

记录前列腺特异性抗原(PSA)检测结果,包括总PSA和游离PSA。

**参数说明:**
- `info`: PSA检测结果(必填)
  - 总PSA值: 数字(如 2.5)
  - 游离PSA值: 数字(可选,如 0.8)
  - 检测日期: YYYY-MM-DD(可选,默认今天)

**示例:**
```
/prostate psa 2.5
/prostate psa 2.5 free 0.8
/prostate psa 总PSA 2.5 游离PSA 0.8
/prostate psa 2.5 2025-06-15
/prostate psa 4.2 free 0.9
```

**执行步骤:**

#### 1. 解析PSA信息

**PSA值识别:**
```javascript
// 用户输入: "PSA 2.5" 或 "总PSA 2.5纳克每毫升"
patterns = [
  /psa[:\s]*(\d+\.?\d*)/i,
  /总psa[:\s]*(\d+\.?\d*)/i,
  /前列腺特异性抗原[:\s]*(\d+\.?\d*)/i
]
```

**游离PSA识别:**
- "free 0.8", "游离PSA 0.8", "fpsa 0.8"

#### 2. 验证输入

**检查项:**
- PSA值应在合理范围(0-100 ng/mL)
- 游离PSA不能大于总PSA
- 日期不能是未来日期

#### 3. PSA风险评估

**PSA值分类:**
```javascript
if (psa > 10) {
  risk = "high"
  message = "建议立即泌尿科就诊"
} else if (psa > 4) {
  risk = "moderate"
  message = "建议3个月后复查"
} else if (psa > 2.5 && age > 50) {
  risk = "low-moderate"
  message = "建议定期监测"
} else {
  risk = "low"
  message = "继续常规筛查"
}
```

**游离/总PSA比值:**
```javascript
f_psa_ratio = free_psa / total_psa

if (f_psa_ratio > 0.25) {
  interpretation = "提示良性"
} else if (f_psa_ratio < 0.10) {
  interpretation = "需警惕恶性可能"
} else {
  interpretation = "灰区,需综合评估"
}
```

#### 4. 计算PSA速率(PSAV)

如果有历史PSA数据:
```javascript
psav = (current_psa - previous_psa) / months_between

if (psav > 0.75) {
  alert = "PSA升高过快,需进一步检查"
}
```

#### 5. 更新PSA记录

**PSA数据结构:**
```json
{
  "psa_history": [
    {
      "date": "2025-06-15",
      "total_psa": 2.5,
      "free_psa": 0.8,
      "ratio": 0.32,
      "reference": "<4.0",
      "unit": "ng/mL",
      "trend": "stable",
      "risk_level": "low",
      "interpretation": "正常"
    }
  ]
}
```

#### 6. 输出确认

**正常PSA:**
```
✅ PSA检测已记录

PSA信息:
━━━━━━━━━━━━━━━━━━━━━━━━━━
检测日期: 2025年6月15日
总PSA: 2.5 ng/mL ✓
游离PSA: 0.8 ng/mL
游离/总比值: 32% ✓

风险评估:
━━━━━━━━━━━━━━━━━━━━━━━━━━
风险等级: 低 ✅
参考值: < 4.0 ng/mL

解读:
━━━━━━━━━━━━━━━━━━━━━━━━━━
PSA值在正常范围内。
游离/总比值 > 25%,提示良性。

建议:
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 继续常规筛查
✅ 下次检测: 1年后
✅ 保持健康生活方式

⚠️ 重要提示:
━━━━━━━━━━━━━━━━━━━━━━━━━━
本系统仅供参考,不能替代专业医疗建议。
如有前列腺癌家族史,建议咨询泌尿科医生
制定个体化筛查方案。

数据已保存至: data/前列腺记录/2025-06/2025-06-15_PSA检测.json
```

**PSA升高警示:**
```
⚠️ PSA值升高提示

PSA信息:
━━━━━━━━━━━━━━━━━━━━━━━━━━
总PSA: 5.2 ng/mL ⚠️
游离PSA: 0.9 ng/mL
游离/总比值: 17% ⚠️

风险评估:
━━━━━━━━━━━━━━━━━━━━━━━━━━
PSA值高于参考值(4.0 ng/mL)
游离/总比值 < 25%,需警惕

建议:
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 建议咨询泌尿科医生
📋 3个月后复查PSA
📋 复查时包括游离PSA
📋 可能需要前列腺超声检查

🚨 不要惊慌:
━━━━━━━━━━━━━━━━━━━━━━━━━━
PSA升高不等于前列腺癌。
良性前列腺增生(BPH)、前列腺炎、
尿路感染等均可导致PSA升高。

请咨询泌尿科医生进行详细评估。

数据已保存
```

---

### 2. IPSS症状评分 - `ipss`

进行国际前列腺症状评分(IPSS),评估前列腺症状严重程度。

**参数说明:**
- 无参数(交互式评分)

**示例:**
```
/prostate ipss
```

**执行步骤:**

#### 1. IPSS问卷系统

IPSS评分包含7个问题,每个问题0-5分:

**1. 不完全排空感:**
- 0分: 无
- 1分: 少于1/5
- 2分: 少于1/2
- 3分: 约1/2
- 4分: 超过1/2
- 5分: 几乎总是

**2. 排尿频度:**
- 0分: 无
- 1分: 少于1/5
- 2分: 少于1/2
- 3分: 约1/2
- 4分: 超过1/2
- 5分: 几乎总是

**3. 排尿间断:**
- 评分同上

**4. 排尿犹豫:**
- 评分同上

**5. 尿流弱:**
- 评分同上

**6. 用力排尿:**
- 评分同上

**7. 夜尿次数:**
- 0分: 无
- 1分: 1次
- 2分: 2次
- 3分: 3次
- 4分: 4次
- 5分: ≥5次

#### 2. 症状严重程度分类

| 总分 | 严重程度 | 处理建议 |
|------|---------|---------|
| 0-7 | 轻度 | 观察随访 |
| 8-19 | 中度 | 可考虑药物治疗 |
| 20-35 | 重度 | 建议泌尿科评估 |

#### 3. 更新IPSS记录

**IPSS数据结构:**
```json
{
  "ipss_score": {
    "date": "2025-06-20",
    "incomplete_emptying": 1,
    "frequency": 2,
    "intermittency": 1,
    "urgency": 2,
    "weak_stream": 1,
    "straining": 0,
    "nocturia": 2,
    "total_score": 9,
    "severity": "moderate",
    "quality_of_life_score": 2
  }
}
```

#### 4. 输出确认

```
✅ IPSS评分已完成

IPSS评分结果:
━━━━━━━━━━━━━━━━━━━━━━━━━━
评分日期: 2025年6月20日

症状评分:
━━━━━━━━━━━━━━━━━━━━━━━━━━
不完全排空: 1分
排尿频度: 2分
排尿间断: 1分
排尿犹豫: 1分
尿流弱: 1分
用力排尿: 0分
夜尿次数: 2次(2分)

总分: 9/35分
严重程度: 中度 ⚠️

生活质量评分: 2/6分
(总体来说还算满意)

症状分析:
━━━━━━━━━━━━━━━━━━━━━━━━━━
中度前列腺症状,
主要表现:
- 排尿频度增加
- 夜尿2次
- 轻度排尿困难

建议:
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 观察随访
✅ 避免睡前饮水
✅ 减少咖啡因和酒精
✅ 双重排尿技巧

⚠️ 考虑就医:
━━━━━━━━━━━━━━━━━━━━━━━━━━
症状持续或加重时,
建议咨询泌尿科医生评估是否需要药物治疗。

可用药物(需医生处方):
━━━━━━━━━━━━━━━━━━━━━━━━━━
• α受体阻滞剂(坦索罗辛等)
• 5α还原酶抑制剂(非那雄胺等)
• 植物提取物(锯棕榈等)

⚠️ 重要提示:
━━━━━━━━━━━━━━━━━━━━━━━━━━
药物需在医生指导下使用,
本系统仅供参考,不能替代处方。

数据已保存至: data/前列腺记录/2025-06/2025-06-20_IPSS评分.json
```

---

### 3. 记录直肠指检 - `dre`

记录直肠指检(DRE)结果。

**参数说明:**
- `info`: DRE检查结果(必填)
  - 前列腺大小: normal(正常), enlarged(增大)
  - 质地: soft(软), firm(硬), nodular(结节)
  - 结节: none(无), present(有)
  - 疼痛: none(无), present(有)

**示例:**
```
/prostate dre normal
/prostate dre enlarged firm
/prostate dre nodule present
/prostate dre 前列腺增大 质地硬 有结节
```

**执行步骤:**

#### 1. 解析DRE信息

**检查结果识别:**
```javascript
// 大小
size_keywords = {
  "正常": "normal",
  "增大": "enlarged",
  "肿大": "enlarged",
  "normal": "normal",
  "enlarged": "enlarged"
}

// 质地
texture_keywords = {
  "软": "soft",
  "硬": "firm",
  "结节": "nodular",
  "smooth": "smooth",
  "soft": "soft",
  "firm": "firm",
  "nodular": "nodular"
}

// 结节
nodule_keywords = {
  "无结节": false,
  "无": false,
  "有结节": true,
  "有": true,
  "none": false,
  "present": true
}
```

#### 2. DRE结果评估

**正常DRE:**
- 前列腺大小正常
- 质地均匀、软
- 无结节
- 无触痛

**异常警示:**
- 前列腺结节
- 质地硬
- 固定不活动
- 触痛明显

#### 3. 更新DRE记录

**DRE数据结构:**
```json
{
  "dre": {
    "last_exam": "2025-06-15",
    "findings": "enlarged_firm",
    "size": "enlarged",
    "texture": "firm",
    "nodule": true,
    "tenderness": false,
    "mobility": "normal",
    "notes": ""
  }
}
```

#### 4. 输出确认

**正常DRE:**
```
✅ 直肠指检已记录

DRE检查信息:
━━━━━━━━━━━━━━━━━━━━━━━━━━
检查日期: 2025年6月15日

检查结果:
━━━━━━━━━━━━━━━━━━━━━━━━━━
前列腺大小: 正常 ✓
质地: 软、均匀 ✓
结节: 无 ✓
触痛: 无 ✓

评估:
━━━━━━━━━━━━━━━━━━━━━━━━━━
直肠指检正常,未发现异常。

建议:
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 继续常规筛查
✅ 下次DRE: 1年后
✅ 结合PSA结果综合评估

⚠️ 重要提示:
━━━━━━━━━━━━━━━━━━━━━━━━━━
DRE正常不能排除前列腺癌。
需结合PSA、前列腺超声等
综合评估。

数据已保存
```

**异常DRE警示:**
```
⚠️ 直肠指检异常提示

DRE检查信息:
━━━━━━━━━━━━━━━━━━━━━━━━━━
检查日期: 2025年6月15日

检查结果:
━━━━━━━━━━━━━━━━━━━━━━━━━━
前列腺大小: 增大
质地: 硬 ⚠️
结节: 有 ⚠️
触痛: 无

评估:
━━━━━━━━━━━━━━━━━━━━━━━━━━
直肠指检发现异常:
• 前列腺质地变硬
• 可触及结节

🚨 需立即就医:
━━━━━━━━━━━━━━━━━━━━━━━━━━
建议立即咨询泌尿科医生!

进一步检查可能包括:
• PSA检测(如未做)
• 前列腺超声
• 前列腺MRI
• 前列腺活检

⚠️ 不要延误:
━━━━━━━━━━━━━━━━━━━━━━━━━━
DRE异常需要泌尿科进一步评估。
早期发现、早期治疗非常重要。

请尽快就医!

数据已保存
```

---

### 4. 记录前列腺超声 - `ultrasound`

记录前列腺超声检查结果。

**参数说明:**
- `info`: 超声结果(必填)
  - 前列腺体积: 数字 + ml(如 32ml)
  - 内腺大小: 数字 + cm(如 2.5cm)
  - 残余尿量: 数字 + ml(可选)
  - 结节: none(无), present(有)

**示例:**
```
/prostate ultrasound 32ml
/prostate ultrasound 体积32ml 内腺2.5cm
/prostate ultrasound 45ml nodule present
/prostate ultrasound 前列腺体积45毫升 有结节
```

**执行步骤:**

#### 1. 解析超声信息

**体积识别:**
- "32ml", "32 ml", "体积32ml"
- "45毫升", "45ml"

**内腺大小识别:**
- "内腺 2.5cm", "transition zone 2.5cm"

**残余尿量识别:**
- "残余尿 20ml", "PVR 20ml"

#### 2. 前列腺体积评估

**前列腺体积分类:**
| 体积 | 分类 |
|------|------|
| < 20 mL | 缩小 |
| 20-30 mL | 正常 |
| 30-50 mL | 轻度增大 |
| 50-80 mL | 中度增大 |
| > 80 mL | 重度增大 |

**前列腺重量估算:**
```
前列腺重量(g) = 前列腺体积(mL) × 1.05
```

#### 3. 更新超声记录

**超声数据结构:**
```json
{
  "prostate_volume": {
    "date": "2025-06-15",
    "volume_ml": 32,
    "weight_g": 33.6,
    "inner_gland_cm": 2.5,
    "residual_urine_ml": 20,
    "nodule": false,
    "calcification": false,
    "interpretation": "mild_enlargement"
  }
}
```

#### 4. 输出确认

```
✅ 前列腺超声已记录

超声检查信息:
━━━━━━━━━━━━━━━━━━━━━━━━━━
检查日期: 2025年6月15日

前列腺参数:
━━━━━━━━━━━━━━━━━━━━━━━━━━
体积: 32 mL ⚠️
估算重量: 33.6 g
内腺大小: 2.5 cm
残余尿量: 20 mL

评估:
━━━━━━━━━━━━━━━━━━━━━━━━━━
前列腺轻度增大(BPH I度)
内腺比例增大

残余尿量轻度增加,可能存在
膀胱出口梗阻。

建议:
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 定期监测前列腺体积
✅ 监测IPSS症状变化
✅ 避免憋尿
✅ 规律排尿

⚠️ 考虑就医:
━━━━━━━━━━━━━━━━━━━━━━━━━━
建议咨询泌尿科医生评估:
• 是否需要药物治疗
• 监测前列腺增长速度
• 评估膀胱功能

可用药物(需医生处方):
━━━━━━━━━━━━━━━━━━━━━━━━━━
• α受体阻滞剂: 改善排尿症状
• 5α还原酶抑制剂: 缩小前列腺

⚠️ 重要提示:
━━━━━━━━━━━━━━━━━━━━━━━━━━
药物需医生处方和指导使用。

数据已保存
```

---

### 5. 查看状态 - `status`

显示前列腺健康追踪状态。

**参数说明:**
- 无参数

**示例:**
```
/prostate status
```

**执行步骤:**

#### 1. 读取前列腺数据

#### 2. 生成状态报告

```
📍 前列腺健康状态

基本信息:
━━━━━━━━━━━━━━━━━━━━━━━━━━
年龄: 55岁
家族史: 父亲有前列腺癌(62岁诊断)

PSA检测历史:
━━━━━━━━━━━━━━━━━━━━━━━━━━
2025-06-15: 2.5 ng/mL (正常) ✓
2024-06-15: 2.4 ng/mL (正常) ✓
2023-06-15: 2.3 ng/mL (正常) ✓

PSA趋势: 稳定 ✅
PSA速率: 0.1 ng/mL/年 (正常) ✅

IPSS评分:
━━━━━━━━━━━━━━━━━━━━━━━━━━
最近评分: 2025-06-20
总分: 9/35分 (中度)
主要症状: 夜尿2次、轻度排尿困难

前列腺检查:
━━━━━━━━━━━━━━━━━━━━━━━━━━
直肠指检(2025-06-15): 增大、质地均匀、无结节
前列腺体积(2025-03-15): 32 mL (轻度增大)

当前状态评估:
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PSA正常且稳定
⚠️ 轻度前列腺增生(BPH I度)
⚠️ 中度排尿症状

风险因素:
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 家族史: 父亲有前列腺癌
• 年龄: 55岁(风险增加)
• 前列腺增生: 轻度

筛查计划:
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PSA检测: 每年1次
  下次: 2026-06-15
✅ 直肠指检: 每年1次
  下次: 2026-06-15

建议行动:
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 继续年度PSA筛查
✅ 监测排尿症状变化
✅ 考虑咨询泌尿科:
  - 评估是否需要BPH药物治疗
  - 讨论家族史筛查策略

💡 本周关注:
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 记录排尿日记
• 避免睡前饮水
• 减少咖啡因和酒精
• 双重排尿技巧

⚠️ 重要声明:
━━━━━━━━━━━━━━━━━━━━━━━━━━
本系统仅供前列腺健康追踪,不能替代专业医疗建议。

如有症状加重或PSA持续升高,请及时就医。
```

---

### 6. 查看筛查计划 - `screening`

显示前列腺癌筛查计划和推荐。

**参数说明:**
- 无参数

**示例:**
```
/prostate screening
```

**执行步骤:**

#### 1. 基于风险的筛查计划

**风险分层:**

**一般风险:**
- 无家族史
- 无症状
- PSA正常

**高风险:**
- 家族史(父亲或兄弟)
- 非洲裔
- 年龄>50岁

**筛查计划:**

| 风险类别 | 开始年龄 | PSA检测频率 | DRE频率 |
|---------|---------|------------|---------|
| 一般风险 | 50岁 | 每年 | 每2年 |
| 高风险 | 45岁 | 每年 | 每年 |

#### 2. 生成筛查计划

```
📋 前列腺癌筛查计划

个人信息:
━━━━━━━━━━━━━━━━━━━━━━━━━━
年龄: 55岁
风险类别: 高风险 (家族史)

筛查建议:
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PSA检测: 每年1次
  开始年龄: 45岁 (已完成10年)
  下次检测: 2026-06-15 (还有362天)

✅ 直肠指检(DRE): 每年1次
  下次检查: 2026-06-15 (还有362天)

可选检查:
━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 前列腺超声: PSA异常时
📋 前列腺MRI: PSA持续升高时
📋 前列腺活检: 泌尿科医生建议时

检查准备:
━━━━━━━━━━━━━━━━━━━━━━━━━━
PSA检测:
• 射精后24-48小时
• 前列腺按摩后48小时
• 膀胱镜检查后7天
• 无急性尿路感染
• 无尿潴留

直肠指检:
• 无需特殊准备
• 检查前排空膀胱

筛查目标:
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 早期发现前列腺癌
• 及时治疗改善预后
• 监测前列腺健康状况

早期发现的优势:
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 局限期前列腺癌5年生存率 > 98%
• 更多治疗选择
• 更好保留功能

筛查提醒设置:
━━━━━━━━━━━━━━━━━━━━━━━━━━
下次检测: 2026-06-15
提醒时间: 检测前7天
提醒方式: /prostate screening

⚠️ 重要提示:
━━━━━━━━━━━━━━━━━━━━━━━━━━
筛查不能预防前列腺癌,
但可以早期发现提高治愈率。

建议与泌尿科医生讨论:
• 筛查的获益和风险
• 个人化的筛查策略
• PSA异常时的进一步检查

数据已保存
```

---

### 7. 风险评估 - `risk`

显示综合前列腺癌风险评估。

**参数说明:**
- 无参数

**示例:**
```
/prostate risk
```

**执行步骤:**

#### 1. 综合风险评估

**风险因素:**
- 年龄
- 家族史
- 种族
- PSA水平
- PSA速率
- DRE异常

**风险计算:**
```javascript
risk_score = 0

// 年龄
if (age >= 60) risk_score += 1
if (age >= 70) risk_score += 1

// 家族史
if (family_history.father) risk_score += 2
if (family_history.brother) risk_score += 2

// PSA
if (psa > 4) risk_score += 2
if (psa > 10) risk_score += 3

// PSAV
if (psav > 0.75) risk_score += 2

// DRE
if (dre.nodule) risk_score += 3
if (dre.firm) risk_score += 1

if (risk_score >= 6) risk = "high"
else if (risk_score >= 3) risk = "moderate"
else risk = "low"
```

#### 2. 生成风险评估报告

```
📊 前列腺癌风险评估

评估日期: 2025年12月31日

风险评估:
━━━━━━━━━━━━━━━━━━━━━━━━━━
风险等级: 中等 🟡

风险因素分析:
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 年龄 55岁: +1分
⚠️ 家族史(父亲): +2分
✅ PSA 2.5 ng/mL: +0分
✅ PSAV 0.1 ng/mL/年: +0分
✅ DRE无结节: +0分

总分: 3分
风险等级: 中等风险

风险解读:
━━━━━━━━━━━━━━━━━━━━━━━━━━
主要风险因素:
• 父亲有前列腺癌病史

保护因素:
• PSA正常且稳定
• DRE检查正常
• 无明显症状

筛查建议:
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 继续年度PSA筛查
✅ 继续年度直肠指检
✅ 密切监测PSA变化

⚠️ 需要警惕:
━━━━━━━━━━━━━━━━━━━━━━━━━━
• PSA持续升高时
• DRE发现结节时
• 出现排尿困难时

降低风险措施:
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 健康饮食
  • 多吃西红柿(番茄红素)
  • 十字花科蔬菜
  • 绿茶
  • 减少红肉

✅ 规律运动
  • 每周150分钟中等强度运动
  • 有氧运动

✅ 控制体重
  • BMI < 25

✅ 戒烟限酒
  • 不吸烟
  • 限制酒精摄入

遗传咨询建议:
━━━━━━━━━━━━━━━━━━━━━━━━━━
有家族史者可考虑:
• 基因检测(BRCA2等)
• 更早开始筛查(40-45岁)
• 更频繁的监测

⚠️ 重要提示:
━━━━━━━━━━━━━━━━━━━━━━━━━━
本风险评估仅供参考,不能替代专业医疗评估。

有家族史者建议咨询泌尿科或肿瘤科,
制定个体化的筛查和预防策略。

建议每年进行风险评估更新。

数据已保存
```

---

## 数据结构

### 主文件: data/prostate-tracker.json

```json
{
  "created_at": null,
  "last_updated": null,

  "prostate_health": {
    "user_id": null,
    "age": null,
    "family_history": {
      "father": false,
      "brother": false,
      "age_at_diagnosis": null
    },

    "psa_history": [],
    "psa_velocity": {
      "change_per_year": null,
      "threshold": 0.75,
      "interpretation": null
    },

    "ipss_score": {
      "date": null,
      "incomplete_emptying": null,
      "frequency": null,
      "intermittency": null,
      "urgency": null,
      "weak_stream": null,
      "straining": null,
      "nocturia": null,
      "total_score": null,
      "severity": null,
      "quality_of_life_score": null
    },

    "prostate_volume": {
      "date": null,
      "volume_ml": null,
      "weight_g": null,
      "inner_gland_cm": null,
      "residual_urine_ml": null,
      "nodule": null,
      "interpretation": null
    },

    "dre": {
      "last_exam": null,
      "findings": null,
      "size": null,
      "texture": null,
      "nodule": null,
      "tenderness": null,
      "notes": null
    },

    "screening_plan": {
      "psa_frequency": null,
      "dre_frequency": null,
      "next_psa": null,
      "next_dre": null,
      "risk_category": null
    },

    "urinary_symptoms": {
      "stream_weakness": null,
      "frequency": null,
      "nocturia": null,
      "urgency": null
    }
  },

  "statistics": {
    "total_psa_tests": 0,
    "last_psa_date": null,
    "psa_trend": "stable",
    "ipss_severity": null,
    "tracking_duration_months": 0
  },

  "settings": {
    "reminder_frequency": "annual",
    "screening_reminder": true
  }
}
```

### 详细记录: data/前列腺记录/YYYY-MM/YYYY-MM-DD_PSA检测.json

```json
{
  "record_id": "prostate_20250615_001",
  "record_type": "PSA检测",
  "date": "2025-06-15",

  "psa_result": {
    "total_psa": 2.5,
    "free_psa": 0.8,
    "ratio": 0.32,
    "unit": "ng/mL",
    "reference": "<4.0",
    "lab": null
  },

  "interpretation": {
    "risk_level": "low",
    "trend": "stable",
    "clinical_significance": "正常"
  },

  "notes": "",
  "metadata": {
    "created_at": "2025-06-15T10:00:00.000Z",
    "last_updated": "2025-06-15T10:00:00.000Z"
  }
}
```

---

## 智能识别规则

### PSA值识别

| 用户输入 | 提取结果 |
|---------|---------|
| PSA 2.5 | total_psa: 2.5 |
| 总PSA 2.5 | total_psa: 2.5 |
| 前列腺特异性抗原2.5 | total_psa: 2.5 |
| psa 4.2 free 0.9 | total: 4.2, free: 0.9 |

### IPSS症状识别

| 症状 | 关键词 | 评分 |
|------|--------|------|
| 不完全排空 | 尿不尽, not empty | 1-5 |
| 排尿频度 | 尿频, frequent | 1-5 |
| 夜尿 | 夜尿, night | 0-5 |

### DRE结果识别

| 关键词 | 结果 |
|--------|------|
| 正常, normal | normal |
| 增大, enlarged, 肿大 | enlarged |
| 硬, firm | firm |
| 结节, nodule | nodule present |
| 软, soft | soft |

---

## 错误处理

| 场景 | 错误消息 | 建议 |
|------|---------|------|
| PSA值缺失 | PSA值不能为空<br>请提供PSA检测值 | 提示正确格式 |
| PSA值异常 | PSA值超出合理范围<br>请检查输入值 | 显示有效范围 |
| 游离PSA大于总PSA | 游离PSA不能大于总PSA<br>请检查数据 | 提示逻辑错误 |
| 日期错误 | 日期不能是未来<br>请检查日期输入 | 验证当前日期 |

---

## 注意事项

- 本系统仅供前列腺健康追踪,不能替代专业医疗建议
- PSA升高不等于前列腺癌,需综合评估
- 定期筛查对早期发现前列腺癌非常重要
- 有家族史者需更密切监测
- 所有排尿症状变化应及时就医

**需要立即就医的情况:**
- PSA显著升高(>10 ng/mL)
- DRE发现前列腺结节
- 严重排尿困难或尿潴留
- 血尿
- 骨痛(怀疑转移)

所有数据仅保存在本地,确保隐私安全。

---

## 示例用法

```
# 记录PSA检测
/prostate psa 2.5
/prostate psa 2.5 free 0.8
/prostate psa history

# IPSS评分
/prostate ipss

# 记录检查
/prostate dre normal
/prostate ultrasound 32ml

# 查看状态
/prostate status
/prostate screening
/prostate risk
```
