# 男性健康功能扩展提案

**模块编号**: 02
**分类**: 按人群分类 - 男性健康
**状态**: 📝 待开发
**优先级**: 中
**创建日期**: 2025-12-31

---

## 功能概述

男性健康模块包含三个子模块，全面覆盖男性不同生命阶段的健康需求：

1. 👨 **前列腺健康管理系统** - PSA监测、IPSS症状评分
2. 👶 **男性不育管理** - 精液分析、激素水平评估
3. 👴 **男性更年期管理** - 睾酮监测、TRT治疗记录

---

## 子模块 1: 前列腺健康管理系统

### 功能描述

前列腺疾病风险评估和筛查管理，包括前列腺癌和良性前列腺增生（BPH）。

### 核心功能

#### 1. 前列腺特异性抗原（PSA）监测
- **总PSA**（tPSA）：<4.0 ng/mL（一般参考值）
- **游离PSA**（fPSA）
- **游离/总PSA比值**（fPSA/tPSA）：>0.25提示良性
- **PSA密度**（PSAD）：PSA/前列腺体积
- **PSA速率**（PSAV）：>0.75 ng/mL/年提示风险

#### 2. 前列腺症状评估

**IPSS评分**（国际前列腺症状评分，0-35分）：

**不完全排空**：
- 0分：无
- 1分：少于1/5
- 2分：少于1/2
- 3分：约1/2
- 4分：超过1/2
- 5分：几乎总是

**频尿**：
- 0分：无
- 1分：少于1/5
- 2分：少于1/2
- 3分：约1/2
- 4分：超过1/2
- 5分：几乎总是

**间断排尿**、**排尿犹豫**、**尿流弱**、**用力排尿**、**夜尿**：评分同上

**结果解读**：
- 0-7分：轻度
- 8-19分：中度
- 20-35分：重度

#### 3. 前列腺检查计划
- **直肠指检**（DRE）：50岁起每年一次
- **前列腺超声**：必要时
- **前列腺MRI**：PSA升高时
- **前列腺活检**：疑似癌症时

#### 4. 前列腺癌风险评估
- **年龄因素**：>50岁（一般风险），>45岁（高风险）
- **家族史**：父亲或兄弟患前列腺癌
- **种族因素**：非裔美国人风险高
- **筛查建议**：基于风险的个体化筛查

### 数据结构

```json
{
  "prostate_health": {
    "user_id": "user_001",
    "age": 55,
    "family_history": {
      "father": false,
      "brother": true,
      "age_at_diagnosis": 62
    },

    "psa_history": [
      {
        "date": "2025-06-15",
        "total_psa": 2.5,
        "free_psa": 0.8,
        "ratio": 0.32,
        "reference": "<4.0",
        "unit": "ng/mL",
        "trend": "stable"
      },
      {
        "date": "2024-06-15",
        "total_psa": 2.4,
        "free_psa": 0.75,
        "ratio": 0.31
      }
    ],

    "psa_velocity": {
      "change_per_year": 0.1,
      "threshold": 0.75,
      "interpretation": "normal"
    },

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
    },

    "prostate_volume": {
      "date": "2025-03-15",
      "volume_ml": 32,
      "interpretation": "mild_enlargement"
    },

    "dre": {
      "last_exam": "2025-06-15",
      "findings": "normal",
      "nodule": false
    },

    "screening_plan": {
      "psa_frequency": "annual",
      "dre_frequency": "annual",
      "next_psa": "2026-06-15",
      "next_dre": "2026-06-15",
      "risk_category": "average"
    },

    "urinary_symptoms": {
      "stream_weakness": "mild",
      "frequency": "3-4_times_per_day",
      "nocturia": 2,
      "urgency": "occasional"
    }
  }
}
```

### 命令接口

```bash
# 记录PSA检查
/prostate psa 2.5                        # 记录总PSA
/prostate psa 2.5 free 0.8               # 记录总PSA和游离PSA
/prostate psa history                    # 查看PSA趋势

# IPSS评分
/prostate ipss                           # 进行IPSS评分
/prostate ipss incomplete_emptying 1     # 记录单个症状评分

# 记录检查
/prostate dre normal                     # 记录直肠指检
/prostate ultrasound 32ml                # 记录前列腺超声

# 查看状态
/prostate status                         # 查看前列腺健康状态
/prostate screening                      # 查看筛查计划
/prostate risk                           # 前列腺癌风险评估
```

---

## 子模块 2: 男性不育管理

### 功能描述

精液分析记录和男性不育因素评估，辅助男性不育的诊断和治疗。

### 核心功能

#### 1. 精液分析记录

**精液量**：
- 正常：≥1.5 mL
- 异常：<1.5 mL（精液减少）

**精子密度**（精子浓度）：
- 正常：≥15 × 10⁶/mL
- 少精症：<15 × 10⁶/mL
- 无精症：0 × 10⁶/mL

**精子总数**：
- 正常：≥39 × 10⁶/次

**精子活力**（PR+NP）：
- PR（前向运动）：≥32%
- NP（非前向运动）：≥40%
- 弱精症：<32%

**精子形态**：
- 正常形态率：≥4%
- 畸形精子症：<4%

**精液pH值**：
- 正常：7.2-8.0
- 异常：<7.2 或 >8.0

**液化时间**：
- 正常：≤60分钟

#### 2. 激素水平监测

**睾酮**（T）：
- 总睾酮：10-35 nmol/L
- 游离睾酮：0.22-0.65 nmol/L

**促黄体生成素**（LH）：
- 正常：1.7-8.6 IU/L

**促卵泡刺激素**（FSH）：
- 正常：1.5-12.4 IU/L

**泌乳素**（PRL）：
- 正常：<15 ng/mL

**雌二醇**（E2）：
- 正常：<70 pg/mL

#### 3. 不育因素评估

**原发性不育**：
- 从未使伴侣怀孕

**继发性不育**：
- 曾使伴侣怀孕，现在无法

**精索静脉曲张**：
- 超声分级
- 手术治疗

**生殖道感染**：
- 淋病、衣原体
- 抗生素治疗

**内分泌异常**：
- 低促性腺激素性性腺功能减退
- 高催乳素血症

**遗传因素**：
- Y染色体微缺失
- 囊性纤维化基因突变

**梗阻性因素**：
- 输精管结扎
- 先天性输精管缺如

### 数据结构

```json
{
  "fertility_assessment": {
    "user_id": "user_001",
    "age": 35,
    "infertility_type": "primary",
    "partner_age": 32,
    "trying_to_conceive_months": 18,

    "semen_analysis": {
      "date": "2025-06-20",
      "abstinence_period": "3_days",

      "volume": {
        "value": 2.5,
        "unit": "mL",
        "reference": "≥1.5",
        "result": "normal"
      },

      "concentration": {
        "value": 45,
        "unit": "10⁶/mL",
        "reference": "≥15",
        "result": "normal"
      },

      "total_count": {
        "value": 112.5,
        "unit": "10⁶",
        "reference": "≥39",
        "result": "normal"
      },

      "motility": {
        "pr": {
          "value": 35,
          "reference": "≥32",
          "result": "normal"
        },
        "np": {
          "value": 20,
          "reference": "≥40",
          "result": "normal"
        },
        "im": {
          "value": 45,
          "result": "normal"
        }
      },

      "morphology": {
        "value": 4,
        "unit": "%",
        "reference": "≥4",
        "result": "normal"
      },

      "ph": {
        "value": 7.5,
        "reference": "7.2-8.0",
        "result": "normal"
      },

      "liquefaction": {
        "value": 30,
        "unit": "minutes",
        "reference": "≤60",
        "result": "normal"
      },

      "diagnosis": "normospermia"
    },

    "hormones": {
      "date": "2025-06-15",
      "testosterone": {
        "total": 15.5,
        "reference": "10-35",
        "unit": "nmol/L",
        "result": "normal"
      },
      "lh": {
        "value": 5.2,
        "reference": "1.7-8.6",
        "unit": "IU/L",
        "result": "normal"
      },
      "fsh": {
        "value": 8.1,
        "reference": "1.5-12.4",
        "unit": "IU/L",
        "result": "normal"
      },
      "prl": {
        "value": 12.5,
        "reference": "<15",
        "unit": "ng/mL",
        "result": "normal"
      },
      "e2": {
        "value": 35,
        "reference": "<70",
        "unit": "pg/mL",
        "result": "normal"
      }
    },

    "varicocele": {
      "present": false,
      "grade": null,
      "side": null,
      "surgery": false
    },

    "infections": {
      "chlamydia": "negative",
      "gonorrhea": "negative",
      "date": "2025-06-10"
    },

    "genetic_testing": {
      "y_chromosome_microdeletion": "not_done",
      "cftr_mutation": "not_done"
    },

    "recommendations": [
      "continue_trying",
      "healthy_lifestyle",
      "repeat_semen_analysis_in_3_months"
    ]
  }
}
```

### 命令接口

```bash
# 记录精液分析
/fertility semen volume 2.5              # 记录精液量
/fertility semen concentration 45        # 记录精子密度
/fertility semen motility pr 35 np 20    # 记录精子活力
/fertility semen morphology 4            # 记录精子形态
/fertility semen complete                # 完整精液分析记录

# 记录激素
/fertility hormone testosterone 15.5     # 记录睾酮
/fertility hormone lh 5.2                # 记录LH
/fertility hormone fsh 8.1               # 记录FSH

# 记录检查结果
/fertility varicocele none               # 记录精索静脉曲张检查
/fertility infection chlamydia negative   # 记录感染检查

# 查看状态
/fertility status                        # 查看生育健康状态
/fertility diagnosis                     # 查看诊断结果
/fertility recommendations               # 查看建议
```

---

## 子模块 3: 男性更年期管理

### 功能描述

中老年男性性腺功能减退症（男性更年期）管理，包括症状评估和睾酮替代治疗（TRT）。

### 核心功能

#### 1. 症状评估

**性症状**：
- 性欲减退
- 勃起功能障碍
- 勃起质量下降

**躯体症状**：
- 体力下降
- 肌肉量减少
- 脂肪增加（尤其腹部）
- 骨密度下降
- 潮热、盗汗

**心理症状**：
- 情绪低落
- 易怒
- 焦虑
- 记忆力下降
- 注意力不集中

#### 2. 睾酮水平监测

**总睾酮**：
- 正常：10-35 nmol/L
- 可能性腺功能减退：<10 nmol/L
- 确诊性腺功能减退：<8 nmol/L（重复测定）

**测定时机**：
- 早晨（8-11点）睾酮水平最高
- 需要至少2次测定确认

**游离睾酮**：
- 更准确反映活性睾酮
- 需要时测定

**性激素结合球蛋白**（SHBG）：
- 影响总睾酮水平
- 年龄增加，SHBG增加

#### 3. 睾酮替代治疗（TRT）记录

**治疗指征**：
- 总睾酮<8 nmol/L + 症状
- 总睾酮8-12 nmol/L + 明显症状

**治疗方式**：
- **口服**：十一酸睾酮
- **注射**：睾酮酯类
- **凝胶**：睾酮凝胶
- **贴片**：睾酮贴片

**疗效评估**：
- 性欲改善
- 勃起功能改善
- 情绪改善
- 体力改善
- 肌肉量增加
- 脂肪减少

**副作用监测**：
- 红细胞增多（Hct>54%）
- 前列腺：PSA、前列腺体积
- 心血管事件
- 肝功能
- 脂肪肝

### 数据结构

```json
{
  "andropause": {
    "user_id": "user_001",
    "age": 52,
    "assessment_date": "2025-06-20",

    "symptoms": {
      "sexual": {
        "libido": "decreased",
        "erectile_function": "mild_ed",
        "morning_erection": "reduced"
      },
      "physical": {
        "fatigue": "moderate",
        "muscle_mass": "decreased",
        "body_fat": "increased_abdominal",
        "hot_flashes": false
      },
      "psychological": {
        "mood": "depressed",
        "irritability": true,
        "memory": "mild_impairment",
        "concentration": "difficult"
      }
    },

    "testosterone_levels": {
      "total_testosterone": {
        "date": "2025-06-15",
        "time": "09:00",
        "value": 7.5,
        "reference": "10-35",
        "unit": "nmol/L",
        "result": "low",
        "confirmed": true,
        "repeat_count": 2
      },
      "free_testosterone": {
        "date": "2025-06-15",
        "value": 0.18,
        "reference": "0.22-0.65",
        "unit": "nmol/L",
        "result": "low"
      },
      "shbg": {
        "date": "2025-06-15",
        "value": 45,
        "reference": "20-50",
        "unit": "nmol/L",
        "result": "normal"
      }
    },

    "questionnaire_scores": {
      "adam": {
        "score": 8,
        "positive": true,
        "questions": [
          "有性欲减退吗？",
          "感到体力下降吗？",
          "体力减退了吗？",
          "身高变矮了吗？",
          "生活乐趣减少了吗？",
          "感到悲伤或脾气暴躁吗？",
          "勃起能力下降了吗？",
          "最近运动能力下降了吗？",
          "饭后容易犯困吗？",
          "最近工作表现下降了吗？"
        ]
      },
      "ams": {
        "score": 27,
        "severity": "moderate"
      }
    },

    "trt": {
      "on_treatment": false,
      "medication": null,
      "dose": null,
      "frequency": null,
      "route": null,
      "started_date": null,
      "effectiveness": null,
      "side_effects": []
    },

    "monitoring": {
      "psa": {
        "baseline": 2.0,
        "current": 2.1,
        "date": "2025-06-15"
      },
      "hematocrit": {
        "baseline": 45,
        "current": 46,
        "date": "2025-06-15",
        "threshold": 54
      },
      "prostate_volume": {
        "baseline": 28,
        "current": null
      }
    },

    "recommendations": [
      "confirm_testosterone_with_repeat_test",
      "consider_trt_if_symptoms_bothersome",
      "lifestyle_modifications",
      "monitor_bone_density"
    ]
  }
}
```

### 命令接口

```bash
# 记录症状
/andropause symptom libido decreased      # 记录性欲减退
/andropause symptom fatigue moderate      # 记录乏力
/andropause symptom mood depressed        # 记录情绪低落

# 记录睾酮水平
/andropause testosterone 7.5 09:00        # 记录总睾酮和测定时间
/andropause free-testosterone 0.18        # 记录游离睾酮

# 问卷评估
/andropause adam                          # ADAM问卷
/andropause ams                           # AMS问卷

# TRT治疗
/andropause trt start gel 50mg daily      # 开始TRT治疗
/andropause trt effectiveness good        # 评估疗效
/andropause trt side-effects              # 记录副作用

# 监测
/andropause monitor psa 2.1               # 记录PSA
/andropause monitor hematocrit 46         # 记录红细胞压积

# 查看状态
/andropause status                        # 查看男性更年期状态
/andropause diagnosis                     # 查看诊断
```

---

## 医学安全原则

### ⚠️ 安全红线

1. **不给出具体用药剂量**
   - TRT剂量需医生制定
   - 不推荐具体药物

2. **不诊断男性不育**
   - 不做诊断结论
   - 诊断需男性科医生

3. **不判断前列腺癌风险**
   - 不评估癌症风险
   - 升高的PSA需泌尿科评估

4. **不替代专业治疗**
   - 不孕不育需生殖医学中心
   - TRT需内分泌科或泌尿科

### ✅ 系统能做到的

- PSA监测和趋势分析
- 前列腺症状评估
- 精液分析记录
- 激素水平追踪
- 男性更年期症状评估
- TRT治疗记录和监测

---

## 注意事项

### 前列腺健康

- 定期进行PSA筛查（基于风险）
- PSA升高需进一步检查
- 直肠指检结合PSA提高检出率
- 家族史需提前筛查

### 男性不育

- 精液分析需2-3次确认
- 禁欲3-7天后检查
- 避免高温、毒素、放射线
- 保持健康生活方式

### 男性更年期

- 症状+低睾酮才能诊断
- 需排除其他疾病
- TRT需医生处方
- 定期监测副作用

---

## 参考资源

### 前列腺健康
- [EAU 前列腺癌指南](https://uroweb.org/guideline/prostate-cancer/)
- [中国前列腺癌诊疗指南](https://www.caca.org.cn/)

### 男性不育
- [EAU 男性性健康指南](https://uroweb.org/guideline/male-sexual-health/)
- [WHO 人类精液检查与处理实验室手册](https://www.who.int/)

### 男性更年期
- [ISAAM 男性性腺功能减退症指南](https://www.isaam.org/)
- [中华医学会男科学分会指南](http://www.cuam.org.cn/)

---

**文档版本**: v1.0
**最后更新**: 2025-12-31
**维护者**: WellAlly Tech
