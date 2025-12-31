# 慢性病管理功能扩展提案

**模块编号**: 06
**分类**: 通用功能扩展 - 慢性病管理
**状态**: 📝 待开发
**优先级**: 高
**创建日期**: 2025-12-31

---

## 功能概述

慢性病管理模块包含三个常见的慢性疾病管理系统：

1. **高血压管理系统** - 血压监测、靶器官损害评估、心血管风险评估
2. **糖尿病管理系统** - 血糖监测、HbA1c追踪、并发症筛查
3. **慢阻肺（COPD）管理系统** - 肺功能监测、急性加重记录

---

## 子模块 1: 高血压管理系统

### 功能描述

全面的血压监测和管理，帮助用户控制血压、降低心血管风险。

### 核心功能

#### 1. 血压监测记录
- 收缩压/舒张压记录
- 测量时间（早晨/晚上）
- 测量体位（坐位/卧位/立位）
- 心率同步记录
- 测量设备标识

#### 2. 血压趋势分析
- 日间血压变异
- 血压昼夜节律（杓型/非杓型/反杓型）
- 家庭血压平均值（家庭血压平均值HBPM）
- 血压达标率计算
- 血压变化趋势图

#### 3. 靶器官损害评估
- **心脏**：心电图、超声心动图（LVH）
- **肾脏**：尿微量白蛋白、eGFR、血肌酐
- **血管**：颈动脉超声、PWV（脉搏波速度）
- **眼底**：眼底照相（高血压视网膜病变）

#### 4. 心血管风险评估
- ASCVD风险评分（10年动脉粥样硬化性心血管病风险）
- SCORE风险评分
- 风险分层（低危/中危/高危/很高危）

#### 5. 血压管理目标
- 个体化血压目标（一般<130/80，老年<140/90）
- 生活方式建议
- 用药提醒

### 数据结构

```json
{
  "hypertension_management": {
    "diagnosis_date": "2023-01-01",
    "classification": "grade_1",
    "risk_category": "moderate",

    "bp_readings": [
      {
        "date": "2025-06-20",
        "time": "08:00",
        "systolic": 135,
        "diastolic": 85,
        "pulse": 78,
        "position": "sitting",
        "measurement_device": "home_monitor",
        "arm": "left"
      },
      {
        "date": "2025-06-20",
        "time": "20:00",
        "systolic": 130,
        "diastolic": 82,
        "pulse": 72,
        "position": "sitting",
        "measurement_device": "home_monitor",
        "arm": "left"
      }
    ],

    "average_bp": {
      "systolic": 132,
      "diastolic": 82,
      "calculation_period": "last_7_days",
      "readings_count": 14
    },

    "blood_pressure_pattern": {
      "dipping_pattern": "dipper",
      "daynight_ratio": 0.87,
      "interpretation": "正常杓型血压"
    },

    "target_bp": {
      "systolic_target": "<130",
      "diastolic_target": "<80",
      "achievement_rate": 0.65,
      "days_at_goal_last_month": 20
    },

    "medications": [
      {
        "name": "氨氯地平",
        "dose": "5mg",
        "frequency": "qd",
        "started": "2023-01-01",
        "adherence": "good"
      }
    ],

    "target_organ_damage": {
      "left_ventricular_hypertrophy": {
        "status": "none",
        "last_assessment": "2025-01-15",
        "method": "echocardiogram"
      },
      "microalbuminuria": {
        "status": "negative",
        "uacr": 15,
        "reference": "<30",
        "date": "2025-06-10"
      },
      "retinopathy": {
        "grade": "grade_0",
        "last_exam": "2025-03-20"
      },
      "arterial_stiffness": {
        "pwv": 7.5,
        "reference": "<10",
        "date": "2025-02-15"
      }
    },

    "cardiovascular_risk": {
      "ascvd_score_10yr": 0.12,
      "risk_level": "moderate",
      "factors": ["age", "hypertension", "dyslipidemia"]
    },

    "metadata": {
      "created_at": "2023-01-01T00:00:00.000Z",
      "last_updated": "2025-06-20T20:00:00.000Z"
    }
  }
}
```

### 命令接口

```bash
# 记录血压
/bp record 135/85 pulse 78               # 记录血压和心率
/bp record 130/80 morning sitting        # 记录早晨血压（坐位）
/bp record 125/78 evening                # 记录晚上血压

# 查看血压数据
/bp trend                                # 查看血压趋势
/bp average                              # 计算平均血压（近7天）
/bp history 7                            # 查看最近7天记录
/bp status                               # 查看达标情况

# 靶器官损害记录
/bp heart echo normal                    # 记录心脏超声
/bp kidney uacr 15                       # 记录尿微量白蛋白/肌酐比值
/bp retina grade-0                       # 记录眼底检查

# 风险评估
/bp risk                                 # 心血管风险评估
/bp target                               # 查看血压目标和达标率

# 用药管理
/bp medication add 氨氯地平 5mg          # 添加降压药
/bp medication adherence                 # 用药依从性
```

---

## 子模块 2: 糖尿病管理系统

### 功能描述

全面的血糖监测和糖尿病管理，帮助控制血糖、预防并发症。

### 核心功能

#### 1. 血糖监测记录
- **空腹血糖**（4.4-7.0 mmol/L）
- **餐后2小时血糖**（<10.0 mmol/L）
- **随机血糖**
- **睡前血糖**
- **HbA1c**（糖化血红蛋白，<7.0%）
- **TIR**（葡萄糖目标范围内时间，>70%）

#### 2. 血糖趋势分析
- 日内血糖波动（MAGE - 平均血糖波动幅度）
- 日间血糖变异
- 低血糖事件记录（<3.9 mmol/L）
- 高血糖事件记录（>10.0 mmol/L）
- 血糖曲线可视化

#### 3. 糖尿病并发症筛查

**糖尿病肾病**：
- 尿微量白蛋白（UACR）
- eGFR（估算肾小球滤过率）
- 血肌酐
- 分期：CKD1-5期

**糖尿病视网膜病变**：
- 眼底照相
- 分期：轻度/中度/重度/增殖期

**糖尿病神经病变**：
- 神经传导速度
- 10g单丝测试（足部感觉）
- 症状：麻木、疼痛、感觉异常

**糖尿病足**：
- 足背动脉搏动
- 足部检查（溃疡、感染）
- Wagner分级

#### 4. 血糖管理目标
- 个体化HbA1c目标（一般<7.0%，老年可放宽至<8.0%）
- 血糖达标率
- TIR达标率
- 生活方式建议
- 用药提醒

### 数据结构

```json
{
  "diabetes_management": {
    "type": "type_2",
    "diagnosis_date": "2022-05-10",
    "duration_years": 3.1,

    "glucose_readings": [
      {
        "date": "2025-06-20",
        "time": "07:00",
        "type": "fasting",
        "value": 6.5,
        "unit": "mmol/L",
        "notes": ""
      },
      {
        "date": "2025-06-20",
        "time": "10:00",
        "type": "postprandial_2h",
        "value": 8.2,
        "unit": "mmol/L",
        "meal": "breakfast"
      }
    ],

    "hba1c": {
      "history": [
        {
          "date": "2025-06-15",
          "value": 6.8,
          "unit": "%",
          "change_from_previous": -0.3
        }
      ],
      "target": "<7.0",
      "achievement": true
    },

    "target_glucose": {
      "fasting": {
        "target": "4.4-7.0",
        "unit": "mmol/L"
      },
      "postprandial_2h": {
        "target": "<10.0",
        "unit": "mmol/L"
      },
      "bedtime": {
        "target": "6.0-9.0",
        "unit": "mmol/L"
      }
    },

    "tir": {
      "percentage": 85,
      "target": ">70",
      "time_in_range_hours": 20.4,
      "time_above_range_hours": 3.0,
      "time_below_range_hours": 0.6,
      "measurement_period": "last_14_days"
    },

    "hypoglycemia_episodes": [
      {
        "date": "2025-06-18",
        "time": "15:30",
        "value": 3.4,
        "severity": "level_1",
        "symptoms": ["sweating", "palpitations"],
        "treatment": "glucose_tablets",
        "resolved": true
      }
    ],

    "complications_screening": {
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
    },

    "medications": [
      {
        "name": "二甲双胍",
        "dose": "1000mg",
        "frequency": "bid",
        "started": "2022-05-10",
        "adherence": "good"
      }
    ],

    "metadata": {
      "created_at": "2022-05-10T00:00:00.000Z",
      "last_updated": "2025-06-20T20:00:00.000Z"
    }
  }
}
```

### 命令接口

```bash
# 记录血糖
/glucose record fasting 6.5                # 记录空腹血糖
/glucose record postprandial 8.2           # 记录餐后2小时血糖
/glucose record bedtime 7.2                # 记录睡前血糖

# HbA1c记录
/glucose hba1c 6.8                         # 记录糖化血红蛋白
/glucose hba1c history                     # 查看HbA1c趋势

# 血糖分析
/glucose trend                             # 查看血糖趋势
/glucose tir                               # 查看TIR（目标范围内时间）
/glucose average                           # 计算平均血糖

# 低血糖事件
/glucose hypo 3.4 sweating                # 记录低血糖事件
/glucose hypo history                      # 查看低血糖历史

# 并发症筛查
/glucose screening retina none             # 记录视网膜病变筛查
/glucose screening kidney uacr 45          # 记录肾病筛查
/glucose screening nerve normal            # 记录神经病变筛查
/glucose screening foot normal             # 记录足部筛查

# 管理目标
/glucose target                            # 查看血糖目标
/glucose achievement                       # 查看达标率
```

---

## 子模块 3: 慢阻肺（COPD）管理系统

### 功能描述

慢性阻塞性肺疾病（COPD）的长期管理，包括肺功能监测和急性加重预防。

### 核心功能

#### 1. 肺功能监测
- **FEV1**（第一秒用力呼气容积）
- **FVC**（用力肺活量）
- **FEV1/FVC比值（<0.70提示COPD）**
- GOLD分级（1-4级）

#### 2. 症状评估

**CAT评分**（慢阻肺评估测试，0-40分）：
- 咳嗽
- 咳痰
- 胸闷
- 爬坡/上楼气短
- 家务活动受限
- 户外活动信心
- 睡眠质量
- 精力状态

**mMRC评分**（改良英国医学研究理事会呼吸困难量表，0-4分）：
- 0级：剧烈运动时气短
- 1级：平地快走或爬缓坡时气短
- 2级：因气短比同龄人走得慢或平地行走时需停下喘气
- 3级：平地行走100米或数分钟后需停下喘气
- 4级：严重气短，不能离开家或穿衣时气短

#### 3. 急性加重记录
- 加重频率
- 加重程度（轻度/中度/重度）
- 诱因（感染、污染、气温变化）
- 症状变化（呼吸困难加重、痰量增加、痰液变脓）
- 治疗（抗生素、激素、住院）

#### 4. 症状管理
- 呼吸困难程度
- 慢性咳嗽
- 咳痰（量、颜色、性状）
- 喘息

#### 5. 用药记录
- 支气管舒张剂（SABA、SAMA、LABA、LAMA）
- 吸入糖皮质激素（ICS）
- 药物依从性

### 数据结构

```json
{
  "copd_management": {
    "diagnosis_date": "2020-03-15",
    "gold_grade": "2",
    "gold_group": "B",

    "lung_function": {
      "date": "2025-06-10",
      "post_bronchodilator": {
        "fev1": 1.8,
        "fev1_percent_predicted": 65,
        "fvc": 3.2,
        "fev1_fvc_ratio": 0.56
      },
      "interpretation": "中度气流受限"
    },

    "symptom_assessment": {
      "cat_score": {
        "date": "2025-06-20",
        "total_score": 18,
        "max_score": 40,
        "interpretation": "中度症状影响",
        "items": {
          "cough": 2,
          "sputum": 2,
          "chest_tightness": 2,
          "breathlessness_climbing": 3,
          "activity_limitation": 2,
          "confidence_outdoors": 2,
          "sleep": 3,
          "energy": 2
        }
      },
      "mmrc_score": {
        "date": "2025-06-20",
        "score": 2,
        "max_score": 4,
        "interpretation": "平地行走时需停下喘气"
      }
    },

    "symptoms": {
      "dyspnea": {
        "severity": "moderate",
        "mrc_grade": 2
      },
      "cough": {
        "present": true,
        "frequency": "daily",
        "productive": true
      },
      "sputum": {
        "present": true,
        "amount": "moderate",
        "color": "white",
        "consistency": "mucoid"
      },
      "wheeze": {
        "present": true,
        "frequency": "exertion"
      }
    },

    "exacerbations": {
      "last_year": 2,
      "severe_exacerbations": 0,
      "history": [
        {
          "date": "2025-02-15",
          "severity": "moderate",
          "triggers": ["viral_infection"],
          "symptoms": ["increased_dyspnea", "purulent_sputum"],
          "treatment": ["antibiotics", "prednisone"],
          "hospitalized": false,
          "recovery_days": 10
        }
      ]
    },

    "medications": [
      {
        "type": "LAMA",
        "name": "噻托溴铵",
        "dose": "18μg",
        "frequency": "qd",
        "device": "handihaler",
        "adherence": "good"
      },
      {
        "type": "SABA",
        "name": "沙丁胺醇",
        "dose": "100μg",
        "frequency": "prn",
        "device": "inhaler",
        "usage": "2-3_times_per_week"
      }
    ],

    "vaccination": {
      "influenza": {
        "last_date": "2025-10-15",
        "next_due": "2025-10-01"
      },
      "pneumococcal": {
        "ppsv23": true,
        "date": "2024-05-10",
        "pcv13": false
      }
    },

    "metadata": {
      "created_at": "2020-03-15T00:00:00.000Z",
      "last_updated": "2025-06-20T20:00:00.000Z"
    }
  }
}
```

### 命令接口

```bash
# 记录肺功能
/copd fev1 1.8 65%                       # 记录FEV1和%预测值
/copd lung-function fvc 3.2 ratio 0.56  # 记录完整肺功能

# 症状评估
/copd cat                                # 进行CAT评分
/copd mmrc 2                             # 进行mMRC评分

# 记录症状
/copd symptom dyspnea moderate           # 记录呼吸困难
/copd symptom sputum white moderate      # 记录咳痰
/copd symptom wheze exertion             # 记录喘息

# 急性加重记录
/copd exacerbation moderate              # 记录急性加重
/copd exacerbation trigger infection     # 记录诱因
/copd exacerbation recovery 10 days      # 记录恢复天数

# 用药管理
/copd medication lama 噻托溴铵 18μg      # 添加LAMA
/copd rescue puffer 2-3_per_week         # 记录缓解药使用

# 疫苗接种
/copd vaccine flu 2025-10-15             # 记录流感疫苗

# 状态查看
/copd status                             # 查看COPD控制状态
/copd assessment                         # GOLD分组评估
/copd exacerbations history              # 查看急性加重历史
```

---

## 医学安全原则

### ⚠️ 安全红线

1. **不给出具体用药剂量**
   - 不建议具体的药物剂量调整
   - 用药方案需医生制定

2. **不直接开具处方药名**
   - 不推荐具体处方药
   - 药物选择需咨询医生

3. **不替代医生诊断**
   - 所有分析仅供参考
   - 诊断需由专业医生进行

4. **不判断疾病预后**
   - 不预测并发症发生
   - 不评估预期寿命

### ✅ 系统能做到的

- 血压/血糖/肺功能监测记录
- 趋势分析和异常识别
- 目标达成率计算
- 并发症筛查提醒
- 生活方式建议
- 用药提醒
- 数据导出供医生参考

---

## 注意事项

### 高血压管理

- 定期监测血压，建议早晚各测一次
- 记录时保持安静休息5分钟后
- 测量前30分钟避免咖啡、运动、吸烟
- 定期进行靶器官损害筛查

### 糖尿病管理

- 按医生建议频率监测血糖
- 注意低血糖识别和应急处理
- 定期进行并发症筛查
- 保持规律饮食和运动

### COPD管理

- 长期规律使用维持药物
- 急性加重及时就医
- 每年接种流感疫苗
- 戒烟是最重要的干预措施

---

## 参考资源

### 高血压
- [中国高血压防治指南2018修订版](https://www.nccd.org.cn/)
- [ESC/ESH 高血压管理指南2023](https://www.eshonline.org/)

### 糖尿病
- [中国2型糖尿病防治指南2020年版](https://www.cma.org.cn/)
- [ADA 糖尿病医疗标准2024](https://diabetesjournals.org/care/)

### COPD
- [慢性阻塞性肺疾病诊治指南2021修订版](https://www.csrd.org.cn/)
- [GOLD COPD Report 2024](https://goldcopd.org/)

---

**文档版本**: v1.0
**最后更新**: 2025-12-31
**维护者**: WellAlly Tech
