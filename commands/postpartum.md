---
description: 管理产后恢复和新生儿护理
arguments:
  - name: action
    description: 操作类型：start(开始)/lochia(恶露)/pain(疼痛)/breastfeeding(哺乳)/epds(心理筛查)/mood(情绪)/weight(体重)/pelvic-floor(盆底肌)/baby(宝宝)/status(状态)/recovery-summary(恢复总结)/extend(延长期)
    required: true
  - name: info
    description: 产后信息（分娩日期、症状描述、检查结果等，自然语言描述）
    required: false
---

# 产后护理管理

全面的产后恢复追踪和新生儿护理管理，从分娩到产后恢复期，提供专业的产后健康监测和指导。

**⏱️ 可选追踪期**：6周（42天）/6个月（180天）/1年（365天）

**👶 宝宝护理**：基础喂养、睡眠、体重、尿布记录

**🧠 心理健康**：EPDS抑郁筛查 + 红色警示系统

## 操作类型

### 1. 开始产后记录 - `start`

初始化产后恢复记录。

**参数说明：**
- `info`: 分娩信息（必填）
  - 分娩日期：YYYY-MM-DD
  - 分娩方式：vaginal（顺产）/c-section（剖宫产）
  - 宝宝数量：1/2/3/4（可选，默认1）
  - 追踪期：6weeks/6months/1year（可选，默认6months）

**示例：**
```
/postpartum start 2025-10-08 vaginal
/postpartum start 2025-10-08 c-section 6weeks
/postpartum start 2025-10-08 vaginal 2-babies 1year
```

**执行步骤：**

#### 1. 解析分娩信息

**提取信息：**
- **分娩日期**：YYYY-MM-DD格式
- **分娩方式**：
  - 顺产：vaginal, natural, 顺产, 阴道分娩
  - 剖宫产：c-section, cesarean, 剖宫产, 剖腹产
- **宝宝数量**：1, 2, 3, 4（默认1）
- **追踪期**：
  - 6weeks: 42天（标准）
  - 6months: 180天（推荐）
  - 1year: 365天（完整）

#### 2. 验证输入

**检查项：**
- 分娩日期不能是未来日期
- 分娩日期应在过去2周内（避免过期数据）
- 宝宝数量应在合理范围（1-4）

#### 3. 计算产后天数和阶段

**产后阶段划分：**
```javascript
days_postpartum = today - delivery_date

if (days_postpartum <= 2) {
  stage = "immediate" // 急性期（0-2天）
} else if (days_postpartum <= 14) {
  stage = "early" // 早期（3-14天）
} else if (days_postpartum <= 42) {
  stage = "subacute" // 亚急性期（15-42天）
} else {
  stage = "late" // 恢复期（43天+）
}
```

#### 4. 创建产后记录

**数据结构：**
```json
{
  "postpartum_id": "postpartum_20251008",
  "delivery_date": "2025-10-08",
  "delivery_type": "vaginal",
  "baby_count": 1,
  "tracking_period": "6months",
  "tracking_end_date": "2026-04-06",

  "current_status": {
    "days_postpartum": 0,
    "stage": "immediate",
    "progress_percentage": 0
  },

  "recovery_tracking": {
    "lochia": {
      "stage": "rubra",
      "amount": "moderate",
      "last_updated": null
    },
    "perineal_care": {
      "healing": "good",
      "pain_level": 3,
      "incision_type": null,
      "notes": ""
    },
    "breastfeeding": {
      "status": "establishing",
      "challenges": [],
      "last_updated": null
    },
    "pain": {
      "uterine_contractions": {
        "present": true,
        "severity": "moderate"
      },
      "incision_pain": null,
      "back_pain": null,
      "headache": null
    }
  },

  "mental_health": {
    "epds": {
      "last_screened": null,
      "total_score": null,
      "risk_level": "not_screened",
      "q10_positive": false,
      "last_updated": null
    },
    "mood_log": []
  },

  "physical_recovery": {
    "pelvic_floor": {
      "status": "recovering",
      "exercises": "not_started",
      "notes": ""
    },
    "diastasis_recti": {
      "present": null,
      "severity": null,
      "assessed": false
    },
    "weight_tracking": [],
    "sleep_tracking": []
  },

  "babies": [
    {
      "baby_id": "A",
      "name": null,
      "gender": null,
      "birth_weight": null,
      "current_weight": null,
      "feeding": {
        "method": "establishing",
        "pattern": "on_demand",
        "last_feed": null,
        "feeds_log": []
      },
      "sleep": {
        "pattern": "newborn",
        "last_sleep": null,
        "sleep_log": []
      },
      "diapers": {
        "count": 0,
        "last_change": null,
        "diaper_log": []
      },
      "notes": ""
    }
  ],

  "red_flags": {
    "active": [],
    "resolved": [],
    "last_assessment": null
  },

  "metadata": {
    "created_at": "2025-10-08T00:00:00.000Z",
    "last_updated": "2025-10-08T00:00:00.000Z"
  }
}
```

#### 5. 输出确认

```
✅ 产后记录已创建

分娩信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
分娩日期：2025年10月8日
分娩方式：顺产
宝宝数量：1个
当前产后：第0天

追踪设置：
━━━━━━━━━━━━━━━━━━━━━━━━━━
追踪期：6个月
追踪结束：2026年4月6日

产后阶段：急性期（0-2天）

📋 产后护理指南：
━━━━━━━━━━━━━━━━━━━━━━━━━━

急性期（0-2天）重点：
• 休息和恢复
• 恶露观察（颜色、量）
• 疼痛管理
• 开始哺乳（如适用）
• 监测体温、血压

红色警示（如有立即就医）：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 产后大出血（>1块卫生巾/小时）
• 发热 > 100.4°F (38°C)
• 严重头痛
• 视力模糊
• 呼吸困难
• 胸痛

⚠️ 重要声明：
━━━━━━━━━━━━━━━━━━━━━━━━━━
本系统仅供产后健康追踪，不能替代产后检查（6周检查）。
如有异常情况请及时就医。

EPDS心理筛查将在产后6周提醒进行。

数据已保存至：data/产后记录/2025-10/2025-10-08_产后记录.json
```

---

### 2. 记录恶露 - `lochia`

记录产后恶露情况。

**参数说明：**
- `info`: 恶露信息（必填）
  - 阶段：rubra（红色）, serosa（浆液性）, alba（白色）
  - 量：light（少）, moderate（中）, heavy（多）

**示例：**
```
/postpartum lochia rubra moderate
/postpartum lochia serosa light
/postpartum lochia heavy large_clots  # 大量+血块
```

**恶露阶段：**

| 阶段 | 时间 | 颜色 | 持续时间 |
|------|------|------|---------|
| Lochia Rubra | 0-3天 | 鲜红色 | 2-4天 |
| Lochia Serosa | 4-9天 | 粉红色/褐色 | 5-7天 |
| Lochia Alba | 10天+ | 黄白色 | 2-6周 |

**异常警示：**
```
⚠️ 恶露异常警示

当前情况：恶露过多 + 大血块

风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
产后10天仍有大量鲜红色恶露
可能原因：
• 子宫收缩不良
• 胎盘/胎膜残留
• 感染

🏥 立即就医检查：
• B超检查子宫
• 监测血红蛋白
• 考虑清宫术
```

---

### 3. 记录疼痛 - `pain`

记录产后疼痛情况。

**参数说明：**
- `info`: 疼痛信息（必填）
  - 部位：uterine（子宫收缩）, incision（伤口）, breast（乳房）, head（头痛）, back（腰痛）
  - 程度：1-10分或mild/moderate/severe

**示例：**
```
/postpartum pain uterine 6
/postpartum pain incision moderate
/postpartum pain breast engorgement
/postpartum pain severe 9  # 严重疼痛9分
```

**疼痛评估：**
- **子宫收缩痛**：类似痛经，哺乳时加重（正常）
- **会阴/剖宫产伤口痛**：逐渐减轻
- **乳房胀痛**：可能伴随乳腺炎
- **严重头痛**：警惕硬膜外麻醉并发症或子痫

**警示：**
```
⚠️ 严重头痛警示

症状：产后5天，严重头痛（9/10分）

🚨 需要立即评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 血压监测（子痫前期）
• 神经系统检查
• 考虑硬膜外血肿
• 考虑感染

请立即就医！
```

---

### 4. 哺乳记录 - `breastfeeding`

记录哺乳情况。

**参数说明：**
- `info`: 哺乳信息（必填）
  - 方式：exclusive（纯母乳）, mixed（混合）, formula（配方奶）
  - 问题：engorgement（胀乳）, mastitis（乳腺炎）, low-supply（奶少）, cracked-nipples（乳头皲裂）

**示例：**
```
/postpartum breastfeeding exclusive
/postpartum breastfeeding mixed engorgement
/postpartum breastfeeding formula 60ml
/postpartum breastfeeding low-supply
```

**哺乳评估：**
```json
{
  "breastfeeding": {
    "status": "exclusive",
    "frequency": "on_demand",
    "latch": "good",
    "milk_supply": "adequate",
    "challenges": ["engorgement"],
    "pain_level": 2,
    "last_updated": "2025-10-10T10:00:00.000Z"
  }
}
```

**乳腺炎警示：**
```
⚠️ 可能的乳腺炎

症状：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 乳房红肿热痛
• 发热 > 100.4°F
• 流感样症状
• 乳腺硬块

🏥 处理建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 继续哺乳或吸奶
• 热敷 + 按摩
• 休息 + 补水
• 考虑抗生素（需医生处方）

⚠️ 24小时内无改善或发热 > 102°F：
立即就医！可能需要脓肿引流。
```

---

### 5. EPDS心理筛查 - `epds`

爱丁堡产后抑郁量表（EPDS）筛查。

**参数说明：**
- `info`: EPDS得分（必填）
  - 10题得分，每题0-3分
  - 总分：0-30分
  - 第10题：自我伤害想法（如选2-3分，特殊警示）

**EPDS 10题：**
1. 我能够笑并享受事物
2. 我期待着未来的快乐
3. 当事情出错时，我不必要地责备自己
4. 我感到焦虑或担心，没有明显原因
5. 我感到害怕或惊慌，没有明显原因
6. 事情压倒了我
7. 我很不开心，以至于难以入睡
8. 我感到悲伤或痛苦
9. 我很不开心，以至于在哭泣
10. 自我伤害的想法

**评分标准：**
- 0-9分：低风险
- 10-12分：中度风险（建议监测）
- 13-24分：高风险（需立即就医）
- 第10题 ≥ 1分：自杀倾向（紧急）

**示例：**
```
/postpartum epds 8           # 总分8分（低风险）
/postpartum epds 14          # 总分14分（高风险）
/postpartum epds 10 q10=2    # 总分10分，Q10得2分
```

**执行步骤：**

#### 1. 解析EPDS得分

**提取信息：**
- **总分**：0-30
- **Q10得分**：单独记录（0-3）
- **筛查时间**：记录当前时间

#### 2. 风险评估

**风险分类：**
```javascript
function assessEPDS(score, q10Score) {
  if (q10Score >= 2) {
    return {
      risk_level: "emergency",
      recommendation: "immediate_intervention",
      message: "🚨 紧急情况：存在自我伤害想法"
    };
  }

  if (score >= 13) {
    return {
      risk_level: "high",
      recommendation: "immediate_referral",
      message: "⚠️ 高风险：需要立即就医评估"
    };
  }

  if (score >= 10) {
    return {
      risk_level: "moderate",
      recommendation: "monitoring",
      message: "⚠️ 中度风险：建议密切监测和随访"
    };
  }

  return {
    risk_level: "low",
    recommendation: "routine",
    message: "✓ 低风险：继续常规监测"
  };
}
```

#### 3. 输出结果

**低风险（0-9分）：**
```
✅ EPDS心理筛查完成

EPDS结果：
━━━━━━━━━━━━━━━━━━━━━━━━━━
筛查日期：2025年11月15日
产后天数：35天
EPDS总分：8分

风险评估：低风险 ✓

建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 继续保持良好心态
• 充足休息和睡眠
• 与家人朋友交流
• 适当运动（如散步）

下次筛查：
━━━━━━━━━━━━━━━━━━━━━━━━━━
产后3个月（约2025年1月）

如有以下情况，随时复筛：
• 情绪持续低落
• 无法照顾宝宝
• 有绝望或伤害自己的想法
```

**中风险（10-12分）：**
```
⚠️ EPDS筛查 - 中度风险

EPDS结果：
━━━━━━━━━━━━━━━━━━━━━━━━━━
筛查日期：2025年11月15日
EPDS总分：11分

风险评估：中度风险

可能表现：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 情绪波动
• 焦虑担忧
• 睡眠困难
• 疲劳乏力

建议措施：
━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 2周后复筛EPDS
2. 增加家人支持
3. 保证休息时间
4. 考虑心理咨询
5. 参加产后妈妈支持小组

🏥 专业帮助：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 咨询产科医生
• 考虑转诊心理科
• 产后抑郁热线

⚠️ 警示信号（如有立即就医）：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 情感麻木或空虚
• 无法照顾自己和宝宝
• 有伤害自己或宝宝的想法
```

**高风险（≥13分）：**
```
🚨 EPDS筛查 - 高风险

EPDS结果：
━━━━━━━━━━━━━━━━━━━━━━━━━━
筛查日期：2025年11月15日
EPDS总分：15分

风险评估：高风险 ⚠️

🏥 立即就医建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
请尽快（48小时内）咨询：
1. 产科医生或妇科医生
2. 心理医生或精神科医生
3. 产后抑郁专科门诊

产后抑郁症可治疗，不要延迟！

可能诊断：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 产后抑郁症
• 需要专业评估和治疗

治疗选项：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 心理治疗（CBT）
• 药物治疗（可与哺乳兼容）
• 支持小组
• 家庭支持

📞 紧急求助：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 产后抑郁热线
• 心理危机干预热线
• 前往急诊科

⚠️ 如有自杀想法：
━━━━━━━━━━━━━━━━━━━━━━━━━━
立即告知家人或朋友！
立即拨打120或前往急诊！
```

**紧急情况（Q10 ≥ 2分）：**
```
🚨🚨🚨 紧急情况警示

第10题得分：2-3分
（有自我伤害想法）

🚨 必须立即行动：
━━━━━━━━━━━━━━━━━━━━━━━━━━

第一步：立即告诉身边的人
• 伴侣/家人
• 朋友/邻居
• 不要独自面对！

第二步：立即寻求专业帮助
• 拨打120急救电话
• 前往最近医院急诊
• 联系您的产科医生

第三步：确保宝宝安全
• 请家人临时照顾
• 不要留宝宝独自一人

📞 24小时求助热线：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 国家心理援助热线：400-161-9995
• 生命热线：400-821-1215
• 当地精神卫生中心

您不是一个人！帮助就在身边！
请立即寻求帮助！
```

---

### 6. 记录情绪 - `mood`

记录产后情绪状态。

**参数说明：**
- `info`: 情绪描述（必填）
  - 情绪：happy（开心）, anxious（焦虑）, sad（悲伤）, irritable（烦躁）, overwhelmed（不堪重负）
  - 程度：mild/moderate/severe

**示例：**
```
/postpartum mood anxious
/postpartum mood happy
/postpartum mood overwhelmed severe
/postpartum mood sad crying_spells
```

**情绪分类：**
- **Baby Blues（产后忧郁）**：产后3-5天开始，持续数天至2周
  - 情绪波动
  - 易哭
  - 疲劳
  - 焦虑

- **Postpartum Depression（产后抑郁）**：
  - 持续悲伤
  - 失去兴趣
  - 睡眠问题（非宝宝导致）
  - 无价值感或内疚
  - 难以集中注意力

- **Postpartum Psychosis（产后精神病）**（罕见但紧急）：
  - 幻觉或妄想
  - 思维混乱
  - 极端行为
  - 自杀或伤害宝宝的想法

**警示：**
```
🚨 疑似产后精神病

症状：幻觉、思维混乱

🚨 这是医疗紧急情况！
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 立即拨打120
• 前往医院急诊
• 不要让患者独处
• 确保宝宝安全

需要立即精神科评估！
```

---

### 7. 记录体重 - `weight`

记录产后体重恢复。

**参数说明：**
- `info`: 体重值（必填）
  - 体重：数字 + kg 或 lbs

**示例：**
```
/postpartum weight 65.0
/postpartum weight 145 lbs
```

**体重恢复评估：**
```javascript
weight_loss = delivery_weight - current_weight
expected_loss = delivery_weight - pre_pregnancy_weight

// 产后6周：应减去孕期增重的50%
// 产后6个月：应接近孕前体重
```

---

### 8. 盆底肌记录 - `pelvic-floor`

记录盆底肌恢复和锻炼。

**参数说明：**
- `info`: 盆底肌信息（必填）
  - 锻炼：kegel（凯格尔运动）, squats（深蹲）
  - 症状：incontinence（尿失禁）, prolapse（脱垂感）

**示例：**
```
/postpartum pelvic-floor kegel-exercises 20
/postpartum pelvic-floor incontinence mild
/postpartum pelvic-floor recovering
```

**盆底肌恢复时间表：**
- **产后0-6周**：凯格尔运动轻柔开始（10次/天）
- **产后6-12周**：逐渐增加强度（20-30次/天）
- **产后3-6个月**：继续强化

**尿失禁警示：**
```
⚠️ 尿失禁警示

症状：压力性尿失禁（咳嗽、打喷嚏漏尿）

建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 坚持凯格尔运动
• 膀胱训练
• 避免提重物
• 产后6周评估盆底肌

如持续存在：
考虑盆底肌物理治疗
```

---

### 9. 宝宝记录 - `baby`

记录宝宝的喂养、睡眠、体重、尿布。

**参数说明：**
- `info`: 宝宝信息（必填）
  - 宝宝标识：A/B/C/D（多胎时）
  - 类型：feeding（喂养）, sleep（睡眠）, weight（体重）, diaper（尿布）
  - 详细信息

**示例：**
```
# 喂养
/postpartum baby A feeding breastfeeding left 15min
/postpartum baby A feeding formula 60ml
/postpartum baby A feeding mixed 50ml

# 睡眠
/postpartum baby A sleep 2hrs
/postpartum baby B sleep 1.5hrs

# 体重
/postpartum baby A weight 3.2kg
/postpartum baby A weight 3200g

# 尿布
/postpartum baby A diaper wet
/postpartum baby A diaper soiled
```

**宝宝数据结构：**
```json
{
  "babies": [
    {
      "baby_id": "A",
      "name": null,
      "gender": null,
      "birth_date": "2025-10-08",
      "birth_weight": null,
      "current_weight": {
        "value": 3.2,
        "unit": "kg",
        "date": "2025-10-15",
        "weight_gain": null
      },
      "feeding": {
        "method": "breastfeeding",
        "last_feed": {
          "time": "2025-10-15T14:30:00.000Z",
          "type": "breast",
          "side": "left",
          "duration_minutes": 15,
          "amount_ml": null
        },
        "feeds_today": 8,
        "pattern": "on_demand"
      },
      "sleep": {
        "last_sleep": {
          "start": "2025-10-15T12:00:00.000Z",
          "end": "2025-10-15T14:00:00.000Z",
          "duration_hours": 2
        },
        "pattern": "newborn",
        "total_sleep_today": 16
      },
      "diapers": {
        "wet_today": 6,
        "soiled_today": 3,
        "last_change": "2025-10-15T14:30:00.000Z",
        "pattern": "normal"
      },
      "notes": ""
    }
  ]
}
```

**喂养评估：**
- **新生儿喂养频率**：8-12次/24小时
- **尿布湿**：≥6块/24小时（表示摄入充足）
- **体重增长**：
  - 第1周：可能减轻5-10%（生理性体重下降）
  - 第2周：恢复出生体重
  - 0-3个月：每周增重150-200g

**异常警示：**
```
⚠️ 宝宝摄入不足警示

观察结果：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 今日湿尿布：3块（正常≥6块）
• 体重下降：12%（正常<10%）
• 喂养次数：5次（正常8-12次）

🏥 建议立即就医：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 评估哺乳姿势
• 检查宝宝含乳
• 监测体重
• 可能需要补充配方奶

⚠️ 脱水症状（如有立即就医）：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 囟门凹陷
• 口干
• 无尿>6小时
• 嗜睡
```

---

### 10. 查看状态 - `status`

显示当前产后恢复状态。

**示例：**
```
/postpartum status
```

**输出：**
```
📍 产后恢复状态

基本信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
分娩日期：2025年10月8日
当前日期：2025年11月15日
产后天数：38天
产后阶段：亚急性期（15-42天）
追踪期进度：21% (38/180天)

分娩方式：顺产
宝宝数量：1个

恢复追踪：
━━━━━━━━━━━━━━━━━━━━━━━━━━
恶露：Lochia Alba（白色），量少
伤口愈合：良好，疼痛1/10
哺乳：纯母乳，供应充足
疼痛：轻微子宫收缩痛

心理健康：
━━━━━━━━━━━━━━━━━━━━━━━━━━
EPDS筛查：8分（低风险）✓
最后筛查：产后35天
情绪：稳定

身体恢复：
━━━━━━━━━━━━━━━━━━━━━━━━━━
当前体重：65.0 kg
孕前体重：60.0 kg
分娩时体重：70.0 kg
已恢复：5.0 kg (50%)

盆底肌：恢复中，凯格尔运动20次/天
睡眠：平均5.5小时/24小时

宝宝A信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
当前体重：3.8 kg（+600g）
出生体重：3.2 kg
日龄：38天

喂养：纯母乳，8-10次/天
睡眠：3-4小时周期，16小时/24小时
尿布：6-8块湿尿布/24小时 ✓

下次检查：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 产后6周检查：2025年11月19日（还有4天）
• EPDS复筛：产后3个月（约2026年1月）

本周关注：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 准备6周产后检查
• 继续盆底肌锻炼
• 监测恶露变化
• 保持哺乳

红色警示回顾：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ 无活跃警示

⚠️ 如有以下情况立即就医：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 恶露突然增多或鲜红色
• 发热 > 100.4°F (38°C)
• 严重腹痛
• 乳房红肿热痛（乳腺炎）
• 情绪持续低落或绝望
• 有伤害自己或宝宝的想法
```

---

### 11. 恢复总结 - `recovery-summary`

生成完整的产后恢复总结报告。

**示例：**
```
/postpartum recovery-summary
```

**输出包括：**
- 恶露变化曲线
- 体重恢复曲线
- 哺乳历程
- 心理健康评估
- 宝宝成长曲线
- 下次检查提醒

---

### 12. 延长追踪期 - `extend`

延长产后追踪期。

**参数说明：**
- `info`: 新的追踪期（必填）
  - 6weeks/6months/1year

**示例：**
```
/postpartum extend 1year
```

---

## 红色警示系统

系统自动监测以下红色警示情况：

### 母体红色警示

| 症状 | 阈值 | 响应 |
|------|------|------|
| 产后出血 | >1卫生巾/小时 | ⚠️ 立即就医 |
| 发热 | >100.4°F (38°C) | ⚠️ 就医评估 |
| 严重头痛 | 持续不缓解 | 🚨 紧急评估 |
| 视力改变 | 模糊、闪光点 | 🚨 紧急评估 |
| 呼吸困难 | 休息时仍存在 | 🚨 紧急 |
| 胸痛 | 任何程度 | 🚨 紧急 |
| 下肢疼痛肿胀 | 单侧 | ⚠️ 警惕DVT |
| 伤口感染 | 红肿热痛脓 | ⚠️ 就医 |
| 乳腺炎 | 发热+乳房红肿 | ⚠️ 24h内就医 |
| 情绪问题 | EPDS≥13或Q10≥1 | 🚨 紧急/立即 |
| 自杀想法 | Q10≥2 | 🚨🚨🚨 立即 |

### 宝宝红色警示

| 症状 | 阈值 | 响应 |
|------|------|------|
| 摄入不足 | <6块湿尿布/24h | ⚠️ 就医评估 |
| 体重下降 | >10%出生体重 | ⚠️ 立即就医 |
| 发热 | >100.4°F (38°C) | 🚨 紧急 |
| 喂养困难 | 无法吸吮/吞咽 | 🚨 紧急 |
| 呼吸困难 | 快速/呻吟/凹陷 | 🚨🚨 紧急 |
| 黄疸 | 严重/持续 | ⚠️ 就医 |
| 脱水 | 囟门凹陷/无尿6h+ | 🚨 紧急 |

---

## 数据文件结构

### 主文件：data/postpartum-tracker.json

```json
{
  "created_at": null,
  "last_updated": null,

  "current_postpartum": null,
  "postpartum_history": [],

  "statistics": {
    "total_postpartum_periods": 0,
    "current_days_postpartum": null,
    "total_babies_tracked": 0
  },

  "settings": {
    "tracking_period_default": "6months",
    "epds_reminder_enabled": true,
    "red_flag_monitoring": true
  }
}
```

### 详细记录：data/产后记录/YYYY-MM/YYYY-MM-DD_产后记录.json

---

## 安全声明

⚠️ **重要声明**：

本系统仅供产后健康追踪，不能替代专业医疗护理：

- **产后6周检查必须按时进行**
- **红色警示情况需立即就医**
- **EPDS≥13或Q10≥1需立即寻求精神卫生帮助**
- **宝宝异常情况需立即咨询儿科医生**

紧急联系电话：
- 🚨 急救：120
- 🏥 产科/妇科：[填写医院电话]
- 👶 儿科：[填写医院电话]
- 📞 产后抑郁热线：400-161-9995

---

## 示例用法

```
# 开始产后记录
/postpartum start 2025-10-08 vaginal

# 记录恶露
/postpartum lochia rubra moderate

# 记录疼痛
/postpartum pain uterine 5

# 哺乳记录
/postpartum breastfeeding exclusive

# EPDS筛查
/postpartum epds 8

# 宝宝喂养
/postpartum baby A feeding breastfeeding left 15min

# 查看状态
/postpartum status

# 恢复总结
/postpartum recovery-summary
```
