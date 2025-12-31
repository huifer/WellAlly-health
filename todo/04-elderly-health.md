# 老年人健康功能扩展提案

**模块编号**: 04
**分类**: 按人群分类 - 老年人健康
**状态**: 📝 待开发
**优先级**: 高
**创建日期**: 2025-12-31

---

## 功能概述

老年人健康模块包含三个子模块，全面覆盖老年人特有的健康需求：

1. 🧠 **认知功能评估** - MMSE/MoCA测试、痴呆风险筛查
2. 🚶 **跌倒风险评估** - 平衡功能测试、居家环境评估
3. 💊 **多重用药管理** - Beers标准筛查、药物相互作用检查

---

## 子模块 1: 认知功能评估

### 功能描述

老年人认知功能筛查和痴呆风险评估，帮助早期发现认知功能下降。

### 核心功能

#### 1. MMSE（简易精神状态检查）

**测试项目**（30分）：

**定向力**（10分）：
- 时间定向（5分）：年份、季节、月份、日期、星期
- 地点定向（5分）：国家、省份、城市、医院、楼层

**记忆力**（3分）：
- 即时回忆3个词（每个1分）

**注意力和计算力**（5分）：
- 连续减7（从100开始减5次，每次1分）

**回忆**（3分）：
- 延迟回忆之前3个词

**语言**（9分）：
- 命名（2分）：手表、铅笔
- 复述（1分）：重复"四十四只石狮子"
- 三步指令（3分）：
  - 用右手拿这张纸
  - 对折
  - 放在地板上
- 阅读理解（1分）："闭上您的眼睛"
- 书写（1分）：写一个完整的句子
- 画图（1分）：画两个相交的五边形

**结果解读**：
- 27-30分：正常
- 21-26分：轻度认知功能障碍
- 10-20分：中度认知功能障碍
- ≤9分：重度认知功能障碍

**影响因素**：
- 年龄
- 教育程度
- 文化背景

#### 2. MoCA（蒙特利尔认知评估）

**测试范围**（30分）：
- 视空间/执行功能（5分）
- 命名（3分）
- 记忆（0分，不计入总分）
- 注意力（6分）
- 语言（3分）
- 抽象（2分）
- 延迟回忆（5分）
- 定向（6分）

**结果解读**：
- ≥26分：正常
- 18-25分：轻度认知功能障碍
- 10-17分：中度认知功能障碍
- <10分：重度认知功能障碍

**教育程度调整**：
- ≤12年教育：加1分

#### 3. 认知功能域评估

**记忆力**：
- 即时记忆
- 短期记忆
- 长期记忆
- 学习能力

**执行功能**：
- 计划能力
- 问题解决
- 抽象思维
- 认知灵活性

**语言能力**：
- 理解
- 表达
- 命名
- 复述

**视空间能力**：
- 物体识别
- 面孔识别
- 空间定向

**定向力**：
- 时间定向
- 地点定向
- 人物定向

#### 4. 认知下降趋势追踪

- 重复测试对比
- 下降速度评估
- 功能影响评估
- 日常活动能力评估

### 数据结构

```json
{
  "cognitive_assessment": {
    "user_id": "user_001",
    "age": 75,
    "education_years": 12,

    "mmse": {
      "date": "2025-06-20",
      "total_score": 27,
      "max_score": 30,
      "interpretation": "normal",

      "subscores": {
        "orientation": {
          "time": 4,
          "place": 5,
          "total": 9
        },
        "registration": 3,
        "attention": 4,
        "recall": 2,
        "language": 9
      },

      "history": [
        {
          "date": "2024-06-20",
          "score": 28
        },
        {
          "date": "2023-06-20",
          "score": 29
        }
      ],

      "trend": "stable_decline",
      "annual_decline": 1.0
    },

    "moca": {
      "date": "2025-06-20",
      "total_score": 24,
      "max_score": 30,
      "education_adjusted": 25,
      "interpretation": "mild_impairment",

      "subscores": {
        "visuospatial_executive": 4,
        "naming": 3,
        "attention": 5,
        "language": 2,
        "abstraction": 2,
        "delayed_recall": 4,
        "orientation": 6
      }
    },

    "cognitive_domains": {
      "memory": {
        "status": "mild_impairment",
        "immediate_recall": "normal",
        "short_term_memory": "mild_impairment",
        "long_term_memory": "normal"
      },
      "executive_function": {
        "status": "normal",
        "planning": "normal",
        "problem_solving": "normal"
      },
      "language": {
        "status": "normal",
        "comprehension": "normal",
        "expression": "normal"
      },
      "visuospatial": {
        "status": "mild_impairment",
        "object_recognition": "normal",
        "spatial_orientation": "mild_impairment"
      }
    },

    "functional_impact": {
      "activities_of_daily_living": {
        "bathing": "independent",
        "dressing": "independent",
        "toileting": "independent",
        "transferring": "independent",
        "continence": "independent",
        "feeding": "independent"
      },
      "instrumental_activities": {
        "shopping": "needs_assistance",
        "cooking": "needs_assistance",
        "managing_medications": "supervision_needed",
        "using_telephone": "independent",
        "managing_finances": "needs_assistance"
      }
    },

    "risk_factors": [
      "age_75",
      "hypertension",
      "education_12_years"
    ],

    "next_assessment": "2026-06-20",
    "recommendations": [
      "annual_cognitive_screening",
      "cardiovascular_risk_management",
      "physical_activity",
      "social_engagement"
    ]
  }
}
```

### 命令接口

```bash
# MMSE测试
/cognitive mmse                          # 进行MMSE测试
/cognitive mmse score 27                 # 记录MMSE分数
/cognitive mmse history                  # 查看MMSE历史

# MoCA测试
/cognitive moca                          # 进行MoCA测试
/cognitive moca score 24                 # 记录MoCA分数

# 认知域评估
/cognitive domain memory mild_impairment # 记录记忆域评估
/cognitive domain executive normal       # 记录执行功能评估

# 功能评估
/cognitive adl independent               # 记录日常生活活动能力
/cognitive iadl needs_assistance         # 记录工具性日常生活活动能力

# 查看状态
/cognitive status                        # 查看认知功能状态
/cognitive trend                         # 查看认知变化趋势
/cognitive risk                          # 认知功能风险评估
```

---

## 子模块 2: 跌倒风险评估

### 功能描述

老年人跌倒风险评估和预防，包括平衡功能测试和居家环境评估。

### 核心功能

#### 1. 跌倒风险因素评估

**内在因素**：
- **年龄因素**：>65岁
- **既往跌倒史**：有跌倒史，再次跌倒风险增加
- **平衡功能**：平衡障碍
- **步态异常**：步态不稳
- **肌力下降**：下肢肌力下降
- **视力问题**：视力受损、白内障、青光眼
- **认知功能**：认知障碍
- **慢性疾病**：帕金森、卒中、关节炎
- **用药情况**：镇静剂、降压药、降糖药、抗抑郁药

**外在因素**：
- **环境障碍**：地面湿滑、障碍物、光线不足
- **鞋子**：不合适的鞋子
- **辅助器具**：未使用或使用不当

#### 2. 平衡功能测试

**TUG测试**（Timed Up and Go）：
- 方法：从椅子站起，走3米，转身，走回，坐下
- 计时：总时间
- 结果解读：
  - <10秒：正常
  - 10-19秒：基本正常
  - 20-29秒：行动受限
  - ≥30秒：依赖他人

**Berg平衡量表**（56分）：
- 14项平衡任务
- 每项0-4分
- 结果解读：
  - 0-20分：需坐轮椅
  - 21-40分：需辅助行走
  - 41-56分：独立行走

**单腿站立测试**：
- 计时：睁眼/闭眼单腿站立时间
- 正常：>30秒（<60岁），>15秒（60-69岁），>5秒（70-79岁）

#### 3. 步态分析

**步速**：
- 正常：>1.0 m/s
- 行动受限：0.6-1.0 m/s
- 严重受限：<0.6 m/s

**步态异常**：
- 步幅缩短
- 步宽增加
- 步态不稳
- 拖步

#### 4. 居家环境评估

**客厅**：
- 地面防滑
- 家具摆放
- 照明充足
- 电线整理

**卧室**：
- 床边灯
- 夜灯
- 床高度合适
- 地毯固定

**浴室**：
- 防滑垫
- 扶手（马桶、淋浴区）
- 淋浴椅
- 浴室门易打开

**楼梯**：
- 扶手
- 防滑台阶
- 照明
- 清除杂物

#### 5. 跌倒记录

- 跌倒日期时间
- 跌倒地点
- 跌倒原因
- 受伤情况
- 处理措施

### 数据结构

```json
{
  "fall_risk_assessment": {
    "user_id": "user_001",
    "age": 78,
    "assessment_date": "2025-06-20",

    "fall_history": {
      "fallen_last_year": true,
      "fall_count_last_year": 2,
      "fall_count_last_6_months": 1,
      "last_fall": {
        "date": "2025-03-15",
        "location": "bathroom",
        "time": "06:00",
        "cause": "slippery_floor",
        "injury": "bruise",
        "required_medical_attention": false,
        "fracture": false
      }
    },

    "risk_factors": {
      "age_over_65": true,
      "previous_falls": true,
      "balance_impairment": true,
      "gait_abnormality": true,
      "muscle_weakness": true,
      "visual_impairment": true,
      "cognitive_impairment": false,
      "medications": [
        "sedatives",
        "antihypertensives",
        "diuretics"
      ],
      "chronic_conditions": [
        "osteoarthritis",
        "hypertension"
      ]
    },

    "balance_tests": {
      "tug_test": {
        "date": "2025-06-20",
        "time_seconds": 18,
        "interpretation": "mobility_limitation",
        "reference": "<10_seconds_normal"
      },

      "berg_balance_scale": {
        "date": "2025-06-20",
        "score": 42,
        "max_score": 56,
        "interpretation": "moderate_risk"
      },

      "single_leg_stance": {
        "date": "2025-06-20",
        "eyes_open_seconds": 8,
        "eyes_closed_seconds": 2,
        "age_reference": ">5_seconds_normal",
        "result": "impaired"
      }
    },

    "gait_analysis": {
      "date": "2025-06-20",
      "speed_m_per_s": 0.8,
      "interpretation": "mobility_impaired",
      "abnormalities": [
        "shortened_step_length",
        "widened_base_of_support",
        "unsteady_gait"
      ]
    },

    "home_safety": {
      "living_room": {
        "floor_slippery": false,
        "adequate_lighting": true,
        "obstacles_removed": true,
        "rugs_secure": true
      },
      "bedroom": {
        "bedside_light": true,
        "night_light": false,
        "bed_height_appropriate": true,
        "clutter_free": true
      },
      "bathroom": {
        "non_slip_mat": true,
        "grab_bars": true,
        "shower_chair": false,
        "easy_access": true
      },
      "stairs": {
        "handrails": true,
        "non_slip_treads": true,
        "adequate_lighting": true,
        "clutter_free": true
      },
      "overall_safety": "good",
      "recommendations": [
        "add_night_light_in_bedroom",
        "consider_shower_chair"
      ]
    },

    "overall_risk": "moderate",
    "risk_score": 12,
    "max_score": 18,

    "interventions": [
      "physical_therapy_for_balance",
      "home_modifications",
      "medication_review",
      "vision_check",
      "appropriate_footwear"
    ],

    "next_assessment": "2025-12-20"
  }
}
```

### 命令接口

```bash
# 记录跌倒
/fall record 2025-03-15 bathroom slippery  # 记录跌倒事件
/fall history                             # 查看跌倒历史

# 平衡测试
/fall tug 18                              # 记录TUG测试
/fall berg 42                             # 记录Berg平衡量表
/fall single-leg-stance 8                 # 记录单腿站立

# 步态分析
/fall gait speed 0.8                      # 记录步速
/fall gait abnormal shortened_step        # 记录步态异常

# 居家环境评估
/fall home living_room floor_slippery true # 评估客厅安全
/fall home bathroom grab_bars true        # 评估浴室安全
/fall home assessment                     # 完整居家环境评估

# 风险评估
/fall risk                                # 跌倒风险评估
/fall risk-factors                        # 查看风险因素
/fall interventions                       # 查看干预建议
```

---

## 子模块 3: 多重用药管理

### 功能描述

老年人多重用药管理和药物相互作用检查，识别不适当用药。

### 核心功能

#### 1. 用药清单管理

- 当前用药列表
- 用药适应症
- 用药剂量和频次
- 用药持续时间
- 处方医生

#### 2. 不适当用药筛查

**Beers标准**（2019版）：
- 老年人潜在不适当用药
- 老年人潜在不适当用药疾病相关性
- 老年人应谨慎使用的药物
- 老年人非抗感染药物与疾病相互作用的药物
- 基于Beers标准的老年独立处方级联

**常见不适当用药**：
- 苯二氮卓类（跌倒、过度镇静）
- 抗胆碱能药（认知障碍、便秘）
- 第一代抗组胺药（镇静、抗胆碱能）
- 非甾体抗炎药（消化道出血、肾功能不全）
- 糖皮质激素（长期使用）
- 华法林（出血风险）

#### 3. 药物相互作用检查

**药物-药物相互作用**：
- 华法林+阿司匹林（出血风险）
- ACEI+保钾利尿剂（高钾血症）
- β受体阻滞剂+地高辛（心动过缓）
- 抗抑郁药+MAOIs（5-羟色胺综合征）

**药物-疾病相互作用**：
- NSAID+消化性溃疡（加重溃疡）
- β受体阻滞剂+哮喘（加重哮喘）
- 抗胆碱能药+便秘/青光眼（加重症状）
- 糖皮质激素+糖尿病/骨质疏松（加重疾病）

#### 4. 抗胆碱能药物负荷

**抗胆碱能药物评分**：
- 每个药物评分0-3分
- 累计总分
- 结果解读：
  - 0-1分：可接受
  - 2-3分：尽量避免
  - ≥4分：显著风险

**常见抗胆碱能药物**：
- 苯二氮卓类
- 抗组胺药
- 三环类抗抑郁药
- 抗精神病药
- 抗帕金森药
- 膀胱抗胆碱能药

#### 5. 用药精简计划

**精简原则**：
- 停用无明确适应症的药物
- 停用疗效不佳的药物
- 停用预防性药物（获益不明确）
- 减少用药种类
- 简化给药方案

**精简步骤**：
- 评估每个用药的适应症
- 评估用药获益和风险
- 识别可停用药物
- 制定减药计划
- 监测减药反应

### 数据结构

```json
{
  "polypharmacy_management": {
    "user_id": "user_001",
    "age": 82,
    "assessment_date": "2025-06-20",

    "medication_list": [
      {
        "name": "阿司匹林",
        "dose": "100mg",
        "frequency": "qd",
        "indication": "cardiovascular_protection",
        "start_date": "2015-01-01",
        "prescriber": "cardiologist",
        "appropriate": true,
        "beers_criteria": false
      },
      {
        "name": "氨氯地平",
        "dose": "5mg",
        "frequency": "qd",
        "indication": "hypertension",
        "start_date": "2018-03-15",
        "prescriber": "gp",
        "appropriate": true,
        "beers_criteria": false
      },
      {
        "name": "地西泮",
        "dose": "5mg",
        "frequency": "prn",
        "indication": "insomnia",
        "start_date": "2020-06-01",
        "prescriber": "gp",
        "appropriate": false,
        "beers_criteria": true,
        "beers_recommendation": "avoid",
        "alternative": "melatonin_sleep_hygiene"
      }
    ],

    "total_medications": 8,
    "prescribed_medications": 6,
    "otc_medications": 2,

    "beers_criteria_violations": [
      {
        "medication": "地西泮",
        "issue": "falls_risk_sedation",
        "recommendation": "avoid_use",
        "severity": "high",
        "alternative": "melatonin_cbt_i"
      },
      {
        "medication": "氯苯那敏",
        "issue": "anticholinergic_effects",
        "recommendation": "avoid_use",
        "severity": "moderate",
        "alternative": "loratadine"
      }
    ],

    "drug_interactions": [
      {
        "medications": ["华法林", "阿司匹林"],
        "severity": "moderate",
        "interaction": "increased_bleeding_risk",
        "recommendation": "monitor_inr",
        "clinically_significant": true
      },
      {
        "medications": ["地高辛", "呋塞米"],
        "severity": "moderate",
        "interaction": "increased_digoxin_toxicity_risk",
        "recommendation": "monitor_digoxin_level_electrolytes",
        "clinically_significant": true
      }
    ],

    "disease_drug_interactions": [
      {
        "medication": "布洛芬",
        "condition": "chronic_kidney_disease_stage_3",
        "interaction": "worsens_renal_function",
        "recommendation": "avoid_use_use_acetaminophen",
        "severity": "high"
      }
    ],

    "anticholinergic_burden": {
      "total_score": 4,
      "medications_contributing": [
        {"name": "地西泮", "score": 1},
        {"name": "氯苯那敏", "score": 2},
        {"name": "奥昔布宁", "score": 1}
      ],
      "interpretation": "significant_risk",
      "risks": ["cognitive_impairment", "falls", "dry_mouth", "constipation"]
    },

    "deprescribing_plan": [
      {
        "medication": "地西泮",
        "action": "taper",
        "timeline": "4-8_weeks",
        "taper_schedule": "reduce_by_25_every_1-2_weeks",
        "alternative": "sleep_hygiene_melatonin",
        "monitoring": ["withdrawal_symptoms", "sleep_quality"]
      },
      {
        "medication": "氯苯那敏",
        "action": "switch",
        "alternative": "loratadine",
        "timeline": "immediate",
        "reason": "reduce_anticholinergic_burden"
      }
    ],

    "medication_adherence": {
      "overall_adherence": "good",
      "missed_doses_weekly": 1,
      "barriers": ["pill_burden", "cost"],
      "aids": ["pill_box", "reminder_app"]
    },

    "next_medication_review": "2025-09-20",
    "recommendations": [
      "deprescribe_diazepam",
      "review_antihistamine_use",
      "consolidate_medications",
      "simplify_dosing_schedule"
    ]
  }
}
```

### 命令接口

```bash
# 记录用药
/polypharmacy add 阿司匹林 100mg qd        # 添加用药
/polypharmacy list                         # 查看用药清单

# Beers标准筛查
/polypharmacy beers                        # Beers标准筛查
/polypharmacy inappropriate                # 查看不适当用药

# 药物相互作用
/polypharmacy interaction check            # 检查药物相互作用
/polypharmacy interaction add 华法林 阿司匹林 moderate  # 添加相互作用

# 抗胆碱能负荷
/polypharmacy anticholinergic              # 计算抗胆碱能负荷
/polypharmacy acb-score 4                  # 记录ACB评分

# 用药精简
/polypharmacy deprescribe                  # 生成精简计划
/polypharmacy deprescribe 地西泮 taper     # 添加精简药物

# 查看状态
/polypharmacy status                       # 查看多重用药状态
/polypharmacy recommendations              # 查看建议
```

---

## 医学安全原则

### ⚠️ 安全红线

1. **不诊断认知功能障碍**
   - 不做痴呆诊断
   - 诊断需神经科/老年科医生

2. **不处理跌倒损伤**
   - 跌倒受伤需就医
   - 系统仅记录和评估

3. **不调整药物**
   - 不建议药物调整
   - 调整需医生评估

4. **不替代专业评估**
   - 认知功能需专业评估
   - 用药需药师/医生指导

### ✅ 系统能做到的

- 认知功能筛查
- 认知下降趋势追踪
- 跌倒风险评估
- 平衡功能测试记录
- 用药清单管理
- 不适当用药筛查
- 药物相互作用检查
- 用药精简计划建议

---

## 注意事项

### 认知功能评估

- 定期筛查（每年一次）
- 注意教育程度和文化背景影响
- 结合日常功能评估
- 异常需就医确诊

### 跌倒预防

- 识别高危个体
- 改善居家环境
- 平衡和力量训练
- 调整用药
- 视力矫正

### 多重用药管理

- 定期用药审查
- 避免不适当用药
- 减少药物种类
- 简化给药方案
- 提高依从性

---

## 参考资源

### 认知功能
- [NIA-AA 痴呆诊断标准](https://www.nia.nih.gov/health/alzheimers-disease-fact-sheet)
- [中国痴呆诊疗指南](http://www.cma.org.cn/)

### 跌倒预防
- [AGS 跌倒预防指南](https://www.americangeriatrics.org/)
- [老年人跌倒风险评估](https://www.cdc.gov/)

### 多重用药
- [Beers标准2019版](https://www.americangeriatrics.org/)
- [中国老年人潜在不适当用药目录](http://www.cma.org.cn/)

---

**文档版本**: v1.0
**最后更新**: 2025-12-31
**维护者**: WellAlly Tech
