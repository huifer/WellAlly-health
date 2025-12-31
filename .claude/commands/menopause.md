---
description: 管理更年期症状和健康记录
arguments:
  - name: action
    description: 操作类型：start(开始)/symptom(症状)/hrt(激素治疗)/bone(骨密度)/status(状态)/risk(风险评估)
    required: true
  - name: info
    description: 更年期信息（年龄、末次月经日期、症状描述、检查结果等，自然语言描述）
    required: false
---

# 更年期管理

围绝经期症状追踪和管理，提供更年期健康评估和管理建议。

## 操作类型

### 1. 开始更年期追踪 - `start`

初始化更年期追踪记录。

**参数说明：**
- `info`: 更年期基本信息（必填）
  - 年龄：数字
  - 末次月经日期：YYYY-MM-DD

**示例：**
```
/menopause start 48 2025-11-15
/menopause start age 48 last period November 15 2025
/menopause start 50岁 2025-06-01
```

**执行步骤：**

#### 1. 解析输入信息

从自然语言中提取：
- **年龄**：数字
- **末次月经日期 (LMP)**：精确日期

#### 2. 验证输入

**检查项：**
- 年龄应在40-65岁之间
- LMP不能是未来日期
- LMP应在过去12个月内

#### 3. 确定更年期阶段

**更年期阶段定义：**

| 阶段 | 定义 | 月经模式 | 时间范围 |
|------|------|---------|---------|
| 围绝经期 | Perimenopausal | 周期不规律 | 40-55岁 |
| 绝经 | Menopausal | 停经12个月 | LMP + 12个月 |
| 绝经后 | Postmenopausal | 停经>12个月 | >12个月 |

**判断逻辑：**
```javascript
months_since_lmp = (today - lmp_date) / 30.44

if (months_since_lmp < 12) {
  stage = "perimenopausal"  // 围绝经期
} else if (months_since_lmp >= 12 && months_since_lmp < 36) {
  stage = "menopausal"  // 绝经
} else {
  stage = "postmenopausal"  // 绝经后
}
```

#### 4. 创建更年期记录

**生成 menopause_id**：`menopause_YYYYMMDD`

**更年期数据结构：**
```json
{
  "menopause_id": "menopause_20250101",
  "stage": "perimenopausal",
  "age": 48,
  "last_menstrual_period": "2025-11-15",
  "months_since_lmp": 0,

  "symptoms": {
    "hot_flashes": {
      "present": false,
      "frequency": null,
      "severity": null,
      "impact_on_life": null,
      "triggers": [],
      "last_updated": null
    },
    "night_sweats": {
      "present": false,
      "frequency": null,
      "severity": null
    },
    "sleep_issues": {
      "present": false,
      "type": null,
      "sleep_quality": null
    },
    "mood_changes": {
      "present": false,
      "symptoms": []
    },
    "vaginal_dryness": {
      "present": false,
      "severity": null
    },
    "joint_pain": {
      "present": false,
      "severity": null,
      "locations": []
    }
  },

  "symptom_history": [],

  "hrt": {
    "on_treatment": false,
    "considering": false,
    "medication": null,
    "type": null,
    "dose": null,
    "route": null,
    "start_date": null,
    "duration": null,
    "effectiveness": null,
    "effectiveness_rating": null,
    "side_effects": [],
    "notes": ""
  },

  "bone_density": {
    "last_check": null,
    "t_score": null,
    "z_score": null,
    "diagnosis": null,
    "diagnosis_category": null,
    "fracture_risk": null,
    "fracture_risk_level": null,
    "next_check_due": null,
    "calcium_intake": {},
    "vitamin_d": {},
    "weight_bearing_exercise": null,
    "fall_risk_factors": []
  },

  "cardiovascular_risk": {
    "last_assessment": null,
    "blood_pressure": null,
    "systolic": null,
    "diastolic": null,
    "bp_classification": null,
    "lipids": {},
    "blood_sugar": {},
    "risk_level": null,
    "risk_factors": [],
    "modifiable_factors": []
  },

  "lifestyle": {
    "exercise": {},
    "diet": {},
    "stress_management": [],
    "sleep_habits": null
  },

  "metadata": {
    "created_at": "2025-01-01T00:00:00.000Z",
    "last_updated": "2025-01-01T00:00:00.000Z"
  }
}
```

#### 5. 保存数据文件

**主文件**：`data/menopause-tracker.json`

**详细记录**：`data/更年期记录/YYYY-MM/YYYY-MM-DD_症状记录.json`

#### 6. 输出确认

```
✅ 更年期追踪已创建

基本信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
年龄：48岁
末次月经：2025年11月15日
更年期阶段：围绝经期

阶段说明：
━━━━━━━━━━━━━━━━━━━━━━━━━━
围绝经期是指卵巢功能开始衰退到绝经后
一年的时期，通常持续4-10年。

常见症状：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 月经周期不规律
• 潮热出汗
• 情绪波动
• 睡眠障碍
• 阴道干涩

建议检查：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 骨密度检查（建议1-2年一次）
✅ 心血管风险评估（血压、血脂）
✅ 妇科检查（每年一次）
✅ 乳腺检查（每年一次）

💡 生活方式建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 规律运动（每周3-5次）
• 均衡饮食（富含钙和维生素D）
• 控制体重（BMI 18.5-24.9）
• 戒烟限酒
• 压力管理
• 充足睡眠

⚠️ 重要声明：
━━━━━━━━━━━━━━━━━━━━━━━━━━
本系统仅供更年期健康追踪，不能替代专业医疗建议。

严重症状请咨询妇科内分泌医生：
• 严重潮热影响生活
• 严重的情绪波动或抑郁
• 异常阴道出血
• 心血管症状

数据已保存至：data/menopause-tracker.json
```

---

### 2. 记录症状 - `symptom`

记录更年期症状并进行评分。

**参数说明：**
- `info`: 症状描述（必填）
  - 症状类型：hot-flashes（潮热）, sleep（睡眠）, mood（情绪）, vaginal-dryness（阴道干涩）, joint-pain（关节痛）
  - 频率：数字/天 或 数字/夜
  - 严重程度：mild（轻微）, moderate（中度）, severe（重度）

**示例：**
```
/menopause symptom hot-flashes 5-10 moderate
/menopause symptom 潮热 每天10次 严重
/menopause symptom sleep insomnia
/menopause symptom mood anxiety irritability
/menopause symptom joint-pain knees mild
```

**执行步骤：**

#### 1. 解析症状信息

**症状类型识别：**
| 关键词 | 症状类型 | 英文 |
|--------|---------|------|
| 潮热、发热、出汗 | hot_flashes | hot flashes |
| 盗汗、夜间出汗 | night_sweats | night sweats |
| 睡眠、失眠 | sleep_issues | sleep issues |
| 情绪、焦虑、抑郁 | mood_changes | mood changes |
| 阴道干涩 | vaginal_dryness | vaginal dryness |
| 关节痛、骨痛 | joint_pain | joint pain |

**频率识别：**
- "每天5-10次", "5-10/day" → hot_flashes frequency
- "每晚3-4次", "3-4/night" → night_sweats frequency
- "经常", "偶尔", "有时" → general frequency

**严重程度识别：**
- mild, 轻微, 轻度
- moderate, 中度
- severe, 严重, 重度

#### 2. 症状评分

**潮热评分：**
```javascript
frequency_score = 0
if (frequency <= 2/day) {
  frequency_score = 1
} else if (frequency <= 5/day) {
  frequency_score = 2
} else if (frequency <= 10/day) {
  frequency_score = 3
} else {
  frequency_score = 4
}

severity_score = 0
if (severity === 'mild') severity_score = 1
else if (severity === 'moderate') severity_score = 2
else if (severity === 'severe') severity_score = 3

hot_flash_score = frequency_score * severity_score  // max 12
```

**睡眠质量评分（0-10）：**
```javascript
if (sleep_issues) {
  if (type === 'difficulty_falling_asleep') score -= 3
  if (type === 'difficulty_staying_asleep') score -= 3
  if (type === 'early_morning_awakening') score -= 2
  if (quality === 'poor') score -= 2
}
sleep_score = max(0, 10 + score)
```

**情绪评分（0-10）：**
```javascript
mood_score = 10 - (symptoms.count * 2)  // 每个症状-2分
```

**总体症状负担（0-100）：**
```javascript
symptom_burden = (
  (hot_flash_score / 12) * 30 +    // 潮热占30%
  (sleep_score / 10) * 25 +        // 睡眠占25%
  (mood_score / 10) * 20 +         // 情绪占20%
  other_symptoms_score * 25        // 其他占25%
)
```

#### 3. 更新症状记录

**症状数据结构：**
```json
{
  "symptoms": {
    "hot_flashes": {
      "present": true,
      "frequency": "5-10_per_day",
      "frequency_count": 7,
      "severity": "moderate",
      "severity_level": 2,
      "impact_on_life": "mild",
      "impact_level": 1,
      "triggers": ["stress", "hot_drinks", "warm_room"],
      "relief_methods": ["cool_compress", "layered_clothing"],
      "score": 14,
      "last_updated": "2025-12-01T10:00:00.000Z"
    },
    "night_sweats": {
      "present": true,
      "frequency": "3-4_per_night",
      "severity": "moderate",
      "impact_on_sleep": "moderate"
    },
    "sleep_issues": {
      "present": true,
      "frequency": "often",
      "type": "difficulty_falling_asleep",
      "sleep_quality": "poor",
      "sleep_duration_hours": 5,
      "score": 4
    },
    "mood_changes": {
      "present": true,
      "symptoms": ["anxiety", "irritability", "mood_swings"],
      "severity": "mild",
      "impact": "minimal",
      "score": 6
    }
  }
}
```

#### 4. 集成 /symptom 命令

**自动创建症状记录：**
```json
// data/症状记录/2025-12/2025-12-01_潮热.json
{
  "id": "symptom_20251201001",
  "symptom_type": "潮热",
  "description": "每天5-10次，中度",
  "severity": "moderate",
  "date": "2025-12-01",
  "womens_health_context": {
    "related": true,
    "module": "menopause",
    "menopause_id": "menopause_20250101",
    "stage": "perimenopausal"
  }
}
```

#### 5. 提供管理建议

**潮热管理：**
```
潮热管理建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
生活方式调整：
• 识别并避免触发因素（热饮、热环境、压力）
• 穿着分层衣物，便于增减
• 保持室温凉爽（18-22°C）
• 使用冷却枕垫
• 规律运动（瑜伽、太极）

• 深呼吸和放松技巧
• 避免辛辣食物、酒精、咖啡因

💊 治疗选项（需医生评估）：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 激素替代治疗（HRT）
• 非激素药物（如适当）
• 草本补充剂（如黑升麻，需谨慎）

⚠️ 重要：
潮热严重时请咨询妇科内分泌医生，
评估是否需要HRT治疗。
```

**睡眠改善：**
```
睡眠改善建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
睡眠卫生：
• 固定作息时间
• 睡前避免屏幕时间
• 保持卧室凉爽、黑暗、安静
• 避免下午咖啡因
• 睡前放松（冥想、温水澡）

• 如果潮热影响睡眠：
  - 使用透气床品
  - 冷却枕垫
  - 分层被褥

💊 如果严重失眠：
━━━━━━━━━━━━━━━━━━━━━━━━━━
可咨询医生使用助眠药物
但优先考虑非药物方法。
```

#### 6. 输出确认

```
✅ 症状已记录

症状信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
类型：潮热
频率：每天5-10次
严重程度：中度

当前更年期阶段：围绝经期

症状评分：
━━━━━━━━━━━━━━━━━━━━━━━━━━
潮热评分：14/12（重度）
睡眠评分：4/10（差）
情绪评分：6/10（尚可）

总体症状负担：65/100（中度）

评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
症状负担中度，影响生活质量。

建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 生活方式调整（见管理建议）
✅ 规律运动，减压
⚠️ 如症状严重影响生活，建议就医
   评估HRT治疗的可能性

管理建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
[详细管理建议...]

⚠️ 重要提示：
如症状严重或持续恶化，请咨询妇科
内分泌医生，评估是否需要激素治疗。

数据已同步至症状记录
```

---

### 3. 记录HRT治疗 - `hrt`

记录激素替代治疗情况。

**参数说明：**
- `info`: HRT治疗信息（必填）
  - action: start（开始）, stop（停止）, effectiveness（效果评估）
  - 药物信息：药物名称、剂量、用药方式

**示例：**
```
/menopause hrt start 雌二醇 1mg 口服
/menopause hrt start estrogen 1mg + progesterone 100mg
/menopause hrt effectiveness good
/menopause hrt effectiveness moderate 潮热减少50%
/menopause hrt stop 因副作用
```

**执行步骤：**

#### 1. 解析HRT信息

**识别HRT类型：**
- **仅雌激素**：estrogen only（适用于子宫切除术后）
- **雌孕激素联合**：estrogen + progesterone（有子宫者必须使用）
- **局部雌激素**：vaginal estrogen（阴道干涩）

**药物识别：**
| 药物名称 | 类型 | 常见剂量 |
|---------|------|---------|
| 雌二醇 | Estrogen | 1-2mg/day（口服） |
| 戊酸雌二醇 | Estrogen | 1-2mg/day |
| 地屈孕酮 | Progesterone | 10mg/day（周期性） |
| 黄体酮胶囊 | Progesterone | 100-200mg/day |

#### 2. HRT治疗评估

**HRT适应症：**
- 绝经相关症状（潮热、出汗）
- 泌尿生殖道萎缩症状
- 预防骨质疏松（<60岁或绝经<10年）

**HRT禁忌症：**
- 原因不明的阴道出血
- 已知或怀疑妊娠
- 已知患乳腺癌
- 已知患或怀疑患性激素依赖性恶性肿瘤
- 活动性深静脉血栓或肺栓塞
- 严重肝病

**相对禁忌症：**
- 子宫内膜异位症
- 子宫肌瘤
- 乳腺良性疾病
- 胆囊疾病
- 高血压
- 糖尿病
- 偏头痛

#### 3. 更新HRT记录

**HRT数据结构：**
```json
{
  "hrt": {
    "on_treatment": true,
    "considering": false,
    "medication": "雌二醇",
    "type": "estrogen_only",
    "dose": "1mg",
    "route": "oral",
    "frequency": "daily",
    "start_date": "2025-12-01",
    "duration_months": 0,
    "effectiveness": null,
    "effectiveness_rating": null,
    "side_effects": [],
    "notes": "",
    "prescribing_doctor": ""
  }
}
```

**效果评估数据结构：**
```json
{
  "hrt": {
    "on_treatment": true,
    "effectiveness": "good",
    "effectiveness_rating": 8,
    "effectiveness_notes": "潮热减少80%，睡眠改善",
    "side_effects": ["乳房胀痛"],
    "side_effects_severity": "mild",
    "quality_of_life_improvement": "significant"
  }
}
```

#### 4. 提供安全性提醒

**HRT安全性监测：**
```
⚠️ HRT治疗安全性提醒

定期监测项目：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 乳腺检查（每年）
   • 临床乳房检查
   • 乳腺超声或钼靶

✅ 妇科检查（每年）
   • 盆腔检查
   • 宫颈涂片
   • 经阴道超声（监测内膜）

✅ 血压监测（每3-6个月）
✅ 血脂检测（每年）
✅ 肝功能检测（每年）

⚠️ 警惕以下症状（立即就医）：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 异常阴道出血
• 乳房肿块或分泌物
• 下肢疼痛或肿胀（DVT症状）
• 突然胸痛或呼吸困难（PE症状）
• 严重头痛或视力改变

HRT使用原则：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 最低有效剂量
• 最短使用时间
• 定期评估风险获益
• 个体化治疗方案

💡 提示：
HRT必须在医生指导下使用，
本系统仅记录治疗情况，不替代医疗建议。
```

#### 5. 输出确认

```
✅ HRT记录已更新

HRT治疗信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
药物：雌二醇
类型：雌激素治疗
剂量：1mg
用法：每日口服
开始日期：2025年12月1日

治疗时长：1个月

💡 重要提示：
━━━━━━━━━━━━━━━━━━━━━━━━━━
HRT治疗必须在妇科内分泌医生指导下进行。

定期复查项目：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 乳腺检查（每年）
✅ 妇科检查（每年）
✅ 血压监测（每3-6个月）
✅ 血脂检测（每年）

⚠️ 警惕异常症状：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 异常阴道出血
• 乳房肿块
• 下肢肿痛
• 突然胸痛

如出现上述症状，请立即就医！
```

---

### 4. 记录骨密度 - `bone`

记录骨密度检查结果。

**参数说明：**
- `info`: 骨密度检查结果（必填）
  - T值：数字（如 -1.5）
  - 诊断：normal（正常）, osteopenia（骨量减少）, osteoporosis（骨质疏松）

**示例：**
```
/menopause bone -1.5 osteopenia
/menopause bone T值-1.5 骨量减少
/menopause bone -2.8 osteoporosis
/menopause bone normal
```

**执行步骤：**

#### 1. 解析骨密度信息

**T值识别：**
- "-1.5", "负1.5", "-1.5 SD" → T-score

**诊断识别：**
| 关键词 | 诊断 | T值范围 |
|--------|------|---------|
| normal, 正常 | 正常 | T ≥ -1.0 |
| osteopenia, 骨量减少 | 骨量减少 | -2.5 < T < -1.0 |
| osteoporosis, 骨质疏松 | 骨质疏松 | T ≤ -2.5 |

#### 2. 骨密度分类

**WHO诊断标准：**

| 分类 | T值 | 骨折风险 |
|------|-----|---------|
| 正常 | T ≥ -1.0 | 正常 |
| 骨量减少 | -2.5 < T < -1.0 | 增加 |
| 骨质疏松 | T ≤ -2.5 | 高 |
| 严重骨质疏松 | T ≤ -2.5 + 骨折 | 极高 |

#### 3. 骨折风险评估

**FRAX基本评估（简化版）：**
```javascript
fracture_risk = "low"
if (t_score <= -2.5) {
  fracture_risk = "high"
} else if (t_score <= -2.0) {
  fracture_risk = "moderate"
}

// 考虑其他风险因素
risk_factors = [
  "previous_fracture",        // 既往骨折史
  "parent_hip_fracture",      // 父母髋部骨折史
  "smoking",                  // 吸烟
  "glucocorticoids",          // 长期使用糖皮质激素
  "rheumatoid_arthritis",     // 类风湿关节炎
  "secondary_osteoporosis",   // 继发性骨质疏松
  "alcohol_3_units_daily"     // 每日饮酒>3单位
]
```

#### 4. 治疗建议

**骨量减少（Osteopenia）：**
```
骨量减少管理建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
营养补充：
✅ 钙：每日1200-1500mg
  • 饮食钙 + 补充剂
  • 分次服用吸收更好
✅ 维生素D：每日800-1000IU
  • 维持血清25(OH)D >30ng/mL
  • 冬季可能需要更高剂量

生活方式：
✅ 负重运动：每周3-4次
  • 步行、慢跑、跳舞
  • 肌力训练
✅ 防跌倒措施：
  • 家居安全
  • 平衡训练
  • 避免镇静药物

复查：
━━━━━━━━━━━━━━━━━━━━━━━━━━
建议1-2年后复查骨密度
```

**骨质疏松（Osteoporosis）：**
```
⚠️ 骨质疏松管理建议

药物治疗（需医生处方）：
━━━━━━━━━━━━━━━━━━━━━━━━━━
双膦酸盐类：
• 阿伦膦酸钠（Fosamax）
• 唑来膦酸（Reclast）

其他药物：
• 地舒单抗（Prolia）
• 雷洛昔芬（Evista）
• 特立帕肽（Forteo）

⚠️ 警告：
药物治疗必须在医生指导下进行！

营养补充：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 钙：每日1200-1500mg
✅ 维生素D：每日1000-2000IU
✅ 蛋白质：每日1.0-1.2g/kg体重

生活方式：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 负重运动（逐渐增加强度）
✅ 肌力训练
✅ 平衡训练（防跌倒）
✅ 禁止吸烟
✅ 限制酒精

复查：
━━━━━━━━━━━━━━━━━━━━━━━━━━
建议1年后复查骨密度
监测治疗效果
```

#### 5. 更新骨密度记录

**骨密度数据结构：**
```json
{
  "bone_density": {
    "last_check": "2025-06-15",
    "t_score": -1.5,
    "z_score": -1.2,
    "diagnosis": "osteopenia",
    "diagnosis_category": "low_bone_mass",
    "fracture_risk": "low",
    "fracture_risk_level": 1,
    "next_check_due": "2026-06-15",
    "check_interval_years": 1,

    "calcium_intake": {
      "dietary": "adequate",
      "supplement": "1000mg_daily",
      "total_daily_mg": 1500,
      "adherence": "good"
    },

    "vitamin_d": {
      "supplement": "2000IU_daily",
      "level": null,
      "adherence": "good"
    },

    "weight_bearing_exercise": "3-4_per_week",
    "fall_risk_factors": [],

    "notes": "",
    "history": [
      {
        "date": "2023-06-15",
        "t_score": -1.3,
        "diagnosis": "normal"
      }
    ]
  }
}
```

#### 6. 输出确认

```
✅ 骨密度记录已更新

骨密度检查信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
检查日期：2025年6月15日
T值：-1.5
Z值：-1.2
诊断：骨量减少（Osteopenia）

骨折风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
当前风险：低

骨密度变化：
━━━━━━━━━━━━━━━━━━━━━━━━━━
2023年：T值 -1.3（正常）
2025年：T值 -1.5（骨量减少）
变化：略有下降 ⚠️

管理建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 钙：每日1200-1500mg
✅ 维生素D：每日800-1000IU
✅ 负重运动：每周3-4次
✅ 肌力训练：每周2-3次
✅ 戒烟限酒

复查建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
下次复查：2026年6月15日（1年后）
或根据医生建议

⚠️ 重要提示：
骨量减少是骨质疏松的前期表现，
积极干预可以预防或延缓骨质疏松进展。

建议咨询内分泌科或骨科医生，
制定个性化治疗方案。
```

---

### 5. 查看状态 - `status`

显示更年期追踪状态。

**参数说明：**
- 无参数

**示例：**
```
/menopause status
```

**执行步骤：**

#### 1. 读取更年期数据

#### 2. 生成状态报告

```
📍 更年期追踪状态

基本信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
年龄：48岁
末次月经：2025年11月15日
更年期阶段：围绝经期
追踪时长：1个月

当前症状：
━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 潮热：每天5-10次（中度）
💦 盗汗：每晚3-4次（中度）
😴 睡眠：失眠，睡眠质量差
😔 情绪：焦虑、易怒
💪 关节痛：膝盖、手指（轻度）

症状负担评分：
━━━━━━━━━━━━━━━━━━━━━━━━━━
总体症状负担：65/100（中度）
  • 潮热影响：14/12（重度）
  • 睡眠影响：4/10（差）
  • 情绪影响：6/10（尚可）

症状趋势：
━━━━━━━━━━━━━━━━━━━━━━━━━━
过去30天：稳定波动

HRT治疗：
━━━━━━━━━━━━━━━━━━━━━━━━━━
状态：未治疗
考虑中：是

骨密度：
━━━━━━━━━━━━━━━━━━━━━━━━━━
上次检查：2025年6月15日
T值：-1.5
诊断：骨量减少
下次复查：2026年6月15日

心血管风险：
━━━━━━━━━━━━━━━━━━━━━━━━━━
血压：120/80 mmHg（正常）
血脂：未检测
血糖：未检测
总体风险：低

生活方式：
━━━━━━━━━━━━━━━━━━━━━━━━━━
运动：每周3-4次（步行、瑜伽）
饮食：均衡，钙摄入充足
压力管理：冥想、阅读
睡眠习惯：不规律

建议行动：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 继续规律运动
✅ 坚持钙和维生素D补充
✅ 考虑咨询医生评估HRT
📅 预约年度体检（包括血脂、血糖）
📅 1年后复查骨密度

💡 本周关注：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 记录潮热日记（识别触发因素）
• 尝试睡眠改善技巧
• 继续运动和减压
• 如果症状加重，考虑就医

⚠️ 重要声明：
━━━━━━━━━━━━━━━━━━━━━━━━━━
本系统仅供更年期健康追踪，不能替代专业医疗建议。

严重症状请咨询妇科内分泌医生。
```

---

### 6. 风险评估 - `risk`

显示综合健康风险评估。

**参数说明：**
- 无参数

**示例：**
```
/menopause risk
```

**执行步骤：**

#### 1. 综合风险评估

**骨质疏松风险评估：**
```javascript
risk = 0
if (t_score <= -2.5) risk += 3
else if (t_score <= -2.0) risk += 2
else if (t_score <= -1.0) risk += 1

if (age >= 65) risk += 1
if (bmi < 18.5) risk += 1
if (smoking) risk += 1
if (family_history_fracture) risk += 1
if (glucocorticoids) risk += 1
if (previous_fracture) risk += 2

if (risk >= 5) osteoporosis_risk = "high"
else if (risk >= 3) osteoporosis_risk = "moderate"
else osteoporosis_risk = "low"
```

**心血管风险评估：**
```javascript
risk = 0
if (bp_systolic >= 140 || bp_diastolic >= 90) risk += 2
else if (bp_systolic >= 130 || bp_diastolic >= 80) risk += 1

if (total_cholesterol >= 6.2) risk += 2
else if (total_cholesterol >= 5.2) risk += 1

if (ldl >= 4.1) risk += 2
else if (ldl >= 3.4) risk += 1

if (hdl < 1.0) risk += 1

if (smoking) risk += 2
if (diabetes) risk += 2
if (family_history_cvd) risk += 1
if (age >= 55) risk += 1

if (risk >= 5) cvd_risk = "high"
else if (risk >= 3) cvd_risk = "moderate"
else cvd_risk = "low"
```

#### 2. 生成风险评估报告

```
📊 更年期健康风险评估

风险评估日期：2025年12月31日

骨质疏松风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
风险等级：中-低 🟡

风险因素分析：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ T值 -1.5（骨量减少）+1分
✅ 年龄48岁（围绝经期）+0分
✅ BMI 22.5（正常）+0分
✅ 无吸烟史 +0分
✅ 无家族史 +0分
✅ 无长期激素使用 +0分

总分：1分
风险等级：低风险

建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 继续钙和维生素D补充
✅ 规律负重运动
✅ 1-2年后复查骨密度
✅ 预防跌倒措施

心血管风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
风险等级：低 🟢

风险因素分析：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 血压120/80（正常）+0分
⚠️ 血脂未检测 - 需补充
⚠️ 血糖未检测 - 需补充
✅ 无吸烟史 +0分
✅ 无糖尿病 +0分
✅ 无心血管病家族史 +0分
✅ 年龄<55岁 +0分

已知总分：0分
风险等级：低风险

建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 尽快检测血脂和血糖
✅ 维持健康生活方式
✅ 规律运动
✅ 健康饮食
✅ 控制体重
✅ 戒烟限酒

乳腺癌风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
风险等级：平均人群风险 🟢

风险因素：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 无家族史
✅ 未使用HRT
✅ 无生育史（需补充）
✅ 初次月经年龄（需补充）
✅ 无良性乳腺疾病

建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 每月乳房自检
✅ 每年临床乳房检查
✅ 每年乳腺超声或钼靶
✅ 健康生活方式

综合健康建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
优先级1 - 立即行动：
📅 预约年度体检
  • 血脂全套
  • 空腹血糖
  • 肝肾功能
  • 乳腺检查

优先级2 - 继续坚持：
✅ 钙剂1000mg/天
✅ 维生素D 2000IU/天
✅ 运动3-4次/周
✅ 健康饮食

优先级3 - 考虑咨询：
👩‍⚕️ 妇科内分泌医生
  • 评估HRT需求
  • 症状管理方案
  • 骨骼健康评估

⚠️ 重要声明：
━━━━━━━━━━━━━━━━━━━━━━━━━━
本风险评估仅供参考，不能替代专业医疗评估。

建议每年进行全面的健康体检，
包括骨密度、心血管、乳腺等项目。

如有疑问，请咨询医生。
```

---

## 数据结构

### 主文件：data/menopause-tracker.json

```json
{
  "created_at": "2025-12-31T12:00:00.000Z",
  "last_updated": "2025-12-31T12:00:00.000Z",

  "menopause_tracking": {
    "menopause_id": "menopause_20250101",
    "stage": "perimenopausal",
    "age": 48,
    "last_menstrual_period": "2025-11-15",
    "months_since_lmp": 1,
    "irregular_periods": true,
    "period_frequency": "every 2-3 months",

    "symptoms": {
      "hot_flashes": {},
      "night_sweats": {},
      "sleep_issues": {},
      "mood_changes": {},
      "vaginal_dryness": {},
      "joint_pain": {}
    },

    "symptom_history": [],

    "hrt": {},

    "bone_density": {},

    "cardiovascular_risk": {},

    "lifestyle": {},

    "metadata": {
      "created_at": "2025-01-01T00:00:00.000Z",
      "last_updated": "2025-12-31T00:00:00.000Z"
    }
  },

  "statistics": {
    "tracking_duration_months": 11,
    "total_symptom_records": 25,
    "symptom_trend": "stable",
    "hrt_use": false,
    "bone_density_tests": 1
  },

  "settings": {
    "reminder_frequency": "monthly",
    "symptom_tracking_frequency": "weekly"
  }
}
```

### 详细记录文件：data/更年期记录/YYYY-MM/YYYY-MM-DD_症状记录.json

```json
{
  "menopause_id": "menopause_20250101",
  "record_date": "2025-12-01",
  "stage": "perimenopausal",

  "symptoms": {
    "hot_flashes": {
      "frequency_count": 7,
      "severity_level": 2,
      "score": 14
    },
    "sleep_issues": {
      "sleep_quality": "poor",
      "score": 4
    }
  },

  "symptom_burden_score": 65,

  "notes": "",
  "metadata": {
    "created_at": "2025-12-01T20:00:00.000Z",
    "last_updated": "2025-12-01T20:00:00.000Z"
  }
}
```

---

## 智能识别规则

### 阶段识别

| 用户输入 | 提取结果 |
|---------|---------|
| 48岁 | age: 48 |
| last period November 15 | LMP: 2025-11-15 |
| 末次月经2025年11月15日 | LMP: 2025-11-15 |

### 症状类型识别

| 关键词 | 症状 |
|--------|------|
| 潮热、发热、出汗 | hot_flashes |
| 盗汗、夜汗 | night_sweats |
| 失眠、睡眠 | sleep_issues |
| 情绪、焦虑、抑郁、易怒 | mood_changes |
| 阴道干涩 | vaginal_dryness |
| 关节痛、骨痛 | joint_pain |

### 严重程度识别

| 轻微 | 中度 | 重度 |
|------|------|------|
| mild, 轻微 | moderate, 中度 | severe, 严重 |
| 1-2次 | 3-5次 | >5次 |

### 频率识别

| 用户输入 | 标准化 |
|---------|--------|
| 每天5-10次 | 5-10_per_day |
| 每晚3-4次 | 3-4_per_night |
| 经常 | often |
| 偶尔 | occasional |

### HRT药物识别

| 关键词 | 药物类型 |
|--------|---------|
| 雌二醇、雌激素 | estrogen |
| 黄体酮、孕激素 | progesterone |
| 1mg, 2mg | dose |
| 口服、贴片、凝胶 | route |

### T值识别

| 用户输入 | T值 |
|---------|-----|
| -1.5 | -1.5 |
| 负1点五 | -1.5 |
| minus 1.5 | -1.5 |

---

## 错误处理

| 场景 | 错误消息 | 建议 |
|------|---------|------|
| 无更年期记录 | 无更年期追踪记录<br>请先使用 /menopause start | 引导开始记录 |
| 年龄超出范围 | 年龄应在40-65岁之间 | 显示有效范围 |
| 未来日期 | 日期不能是未来<br>请检查日期输入 | 验证当前日期 |
| 未识别症状 | 未识别的症状类型<br>支持：潮热、睡眠、情绪、关节痛 | 列出支持类型 |
| T值格式错误 | T值格式错误<br>正确格式：-1.5, 负1.5 | 提供正确格式 |

---

## 注意事项

- 本系统仅供更年期健康追踪，不能替代专业医疗建议
- HRT治疗必须在医生指导下进行
- 定期进行骨密度检查（1-2年）
- 关注心血管健康
- 症状严重需就医
- 所有数据仅保存在本地

**需要立即就医的情况：**
- 异常阴道出血
- 严重抑郁或自杀倾向
- 新增乳房肿块
- 严重心血管症状
- 骨折或严重骨痛

---

## 示例用法

```
# 开始更年期追踪
/menopause start 48 2025-11-15

# 记录症状
/menopause symptom hot-flashes 5-10 moderate
/menopause symptom sleep insomnia
/menopause symptom mood anxiety

# 记录HRT
/menopause hrt start 雌二醇 1mg
/menopause hrt effectiveness good

# 记录骨密度
/menopause bone -1.5 osteopenia

# 查看状态
/menopause status

# 风险评估
/menopause risk
```
