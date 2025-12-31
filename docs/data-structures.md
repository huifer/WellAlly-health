# 数据结构说明

## 生化检查数据结构

```json
{
  "id": "20251231123456789",
  "type": "生化检查",
  "date": "2025-12-31",
  "hospital": "XX医院",
  "items": [
    {
      "name": "白细胞计数",
      "value": "6.5",
      "unit": "×10^9/L",
      "min_ref": "3.5",
      "max_ref": "9.5",
      "is_abnormal": false
    }
  ]
}
```

### 字段说明
- `id`: 唯一标识符（时间戳生成）
- `type`: 检查类型，固定为"生化检查"
- `date`: 检查日期（YYYY-MM-DD格式）
- `hospital`: 就诊医院名称
- `items`: 检查项目数组
  - `name`: 检查项目名称
  - `value`: 检查结果值
  - `unit`: 计量单位
  - `min_ref`: 参考范围下限
  - `max_ref`: 参考范围上限
  - `is_abnormal`: 是否异常（布尔值）

## 影像检查数据结构

```json
{
  "id": "20251231123456789",
  "type": "影像检查",
  "subtype": "B超",
  "date": "2025-12-31",
  "hospital": "XX医院",
  "body_part": "腹部",
  "findings": {
    "description": "检查所见描述",
    "measurements": {
      "尺寸": "具体数值"
    },
    "conclusion": "检查结论"
  },
  "original_image": "images/original.jpg"
}
```

### 字段说明
- `id`: 唯一标识符（时间戳生成）
- `type`: 检查类型，固定为"影像检查"
- `subtype`: 影像检查子类型（B超、CT、MRI、X光等）
- `date`: 检查日期（YYYY-MM-DD格式）
- `hospital`: 就诊医院名称
- `body_part`: 检查部位
- `findings`: 检查发现对象
  - `description`: 检查所见文字描述
  - `measurements`: 测量数据对象
  - `conclusion`: 检查结论
- `original_image`: 原始图片备份路径

## 辐射记录数据结构

```json
{
  "id": "20251231123456789",
  "exam_type": "CT",
  "body_part": "胸部",
  "exam_date": "2025-12-31",
  "standard_dose": 7.0,
  "body_surface_area": 1.85,
  "adjustment_factor": 1.07,
  "actual_dose": 7.5,
  "dose_unit": "mSv"
}
```

### 字段说明
- `id`: 唯一标识符（时间戳生成）
- `exam_type`: 检查类型（CT、X光、PET-CT等）
- `body_part`: 检查部位
- `exam_date`: 检查日期（YYYY-MM-DD格式）
- `standard_dose`: 标准辐射剂量（mSv）
- `body_surface_area`: 用户体表面积（m²）
- `adjustment_factor`: 体表面积调整系数
- `actual_dose`: 实际辐射剂量（mSv）
- `dose_unit`: 剂量单位，固定为"mSv"

## 用户档案数据结构

```json
{
  "basic_info": {
    "height": 175,
    "height_unit": "cm",
    "weight": 70,
    "weight_unit": "kg",
    "birth_date": "1990-01-01"
  },
  "calculated": {
    "age": 35,
    "bmi": 22.9,
    "bmi_status": "正常",
    "body_surface_area": 1.85,
    "bsa_unit": "m²"
  }
}
```

### 字段说明
- `basic_info`: 基础信息对象
  - `height`: 身高数值
  - `height_unit`: 身高单位
  - `weight`: 体重数值
  - `weight_unit`: 体重单位
  - `birth_date`: 出生日期（YYYY-MM-DD格式）
- `calculated`: 自动计算的信息对象
  - `age`: 年龄（周岁）
  - `bmi`: BMI指数
  - `bmi_status`: BMI状态（偏瘦/正常/超重/肥胖）
  - `body_surface_area`: 体表面积（使用Mosteller公式计算）
  - `bsa_unit`: 体表面积单位

## 全局索引数据结构

```json
{
  "biochemical_exams": [
    {
      "id": "20251231123456789",
      "date": "2025-12-31",
      "type": "生化检查",
      "file_path": "data/生化检查/2025-12/2025-12-31_血常规.json"
    }
  ],
  "imaging_exams": [
    {
      "id": "20251231123456789",
      "date": "2025-12-31",
      "type": "影像检查",
      "subtype": "B超",
      "file_path": "data/影像检查/2025-12/2025-12-31_腹部B超.json"
    }
  ],
  "last_updated": "2025-12-31T12:34:56.789Z"
}
```

### 字段说明
- `biochemical_exams`: 生化检查索引数组
- `imaging_exams`: 影像检查索引数组
- `symptom_records`: 症状记录索引数组
- `last_updated`: 最后更新时间（ISO 8601格式）

## 症状记录数据结构

```json
{
  "id": "20251231123456789",
  "record_date": "2025-12-31",
  "symptom_date": "2025-12-31",
  "original_input": "用户原始输入",

  "standardized": {
    "main_symptom": "头痛",
    "category": "神经系统",
    "body_part": "头部",
    "severity": "轻度",
    "severity_level": 1,
    "characteristics": "胀痛感",
    "onset_time": "2025-12-31T10:00:00",
    "duration": "2小时",
    "frequency": "首次出现"
  },

  "associated_symptoms": [
    {
      "name": "恶心",
      "present": true
    },
    {
      "name": "呕吐",
      "present": false
    }
  ],

  "triggers": {
    "possible_causes": ["睡眠不足", "精神紧张"],
    "aggravating_factors": [],
    "relieving_factors": ["休息后略缓解"]
  },

  "medical_assessment": {
    "urgency": "observation",
    "urgency_level": 1,
    "recommendation": "居家观察",
    "advice": "建议充分休息，保证充足睡眠。如症状加重或持续超过24小时，建议就医。",
    "red_flags": []
  },

  "follow_up": {
    "needs_follow_up": false,
    "follow_up_date": null,
    "improvement": null
  },

  "metadata": {
    "created_at": "2025-12-31T12:34:56.789Z",
    "last_updated": "2025-12-31T12:34:56.789Z"
  }
}
```

### 字段说明
- `id`: 唯一标识符（时间戳生成）
- `record_date`: 记录创建日期（YYYY-MM-DD格式）
- `symptom_date`: 症状发生日期（YYYY-MM-DD格式）
- `original_input`: 用户原始输入的自然语言描述
- `standardized`: 标准化后的医学信息对象
  - `main_symptom`: 主要症状的标准医学术语
  - `category`: 症状所属系统分类
  - `body_part`: 症状发生的身体部位
  - `severity`: 严重程度描述（轻度/中度/重度/危急）
  - `severity_level`: 严重程度等级（1-4）
  - `characteristics`: 症状特点描述
  - `onset_time`: 症状开始时间（ISO 8601格式）
  - `duration`: 持续时间描述
  - `frequency`: 发生频率描述
- `associated_symptoms`: 伴随症状数组
  - `name`: 症状名称
  - `present`: 是否存在该症状（布尔值）
- `triggers`: 诱因和缓解因素对象
  - `possible_causes`: 可能原因数组
  - `aggravating_factors`: 加重因素数组
  - `relieving_factors`: 缓解因素数组
- `medical_assessment`: 医学评估对象
  - `urgency`: 紧急程度类别（observation/outpatient/urgent/emergency）
  - `urgency_level`: 紧急程度等级（1-4）
  - `recommendation`: 就医建议类别
  - `advice`: 具体建议内容
  - `red_flags`: 危险警示信号数组
- `follow_up`: 随访信息对象
  - `needs_follow_up`: 是否需要随访（布尔值）
  - `follow_up_date`: 随访日期（如有）
  - `improvement`: 改善情况（如有）
- `metadata`: 元数据对象
  - `created_at`: 记录创建时间（ISO 8601格式）
  - `last_updated`: 最后更新时间（ISO 8601格式）

### 紧急程度分类

- **observation（1级）**: 居家观察
- **outpatient（2级）**: 门诊就医（1周内）
- **urgent（3级）**: 尽快就医（今天或明天）
- **emergency（4级）**: 立即就医或拨打急救电话

### 症状系统分类

- 呼吸系统：咳嗽、咳痰、呼吸困难、胸痛等
- 心血管系统：心悸、胸闷、水肿等
- 消化系统：腹痛、恶心、呕吐、腹泻、便秘等
- 神经系统：头痛、头晕、失眠、抽搐等
- 泌尿系统：尿频、尿急、尿痛、血尿等
- 内分泌系统：多饮、多尿、体重变化等
- 肌肉骨骼：关节痛、肌肉痛、活动受限等
- 全身症状：发热、乏力、消瘦等

## 用药记录数据结构

### 药物信息数据结构

```json
{
  "medications": [
    {
      "id": "med_20251231123456789",
      "name": "阿司匹林",
      "generic_name": "阿司匹林",
      "dosage": {
        "value": 100,
        "unit": "mg"
      },
      "frequency": {
        "type": "daily",
        "times_per_day": 1,
        "interval_days": 1
      },
      "schedule": [
        {
          "weekday": 1,
          "time": "08:00",
          "timing_label": "早餐后",
          "dose": {
            "value": 100,
            "unit": "mg"
          }
        },
        {
          "weekday": 2,
          "time": "08:00",
          "timing_label": "早餐后",
          "dose": {
            "value": 100,
            "unit": "mg"
          }
        }
        ... (继续至星期日，共7条记录)
      ],
      "instructions": "早餐后服用",
      "notes": "",
      "active": true,
      "created_at": "2025-12-31T12:34:56.789Z",
      "last_updated": "2025-12-31T12:34:56.789Z"
    }
  ]
}
```

### 字段说明

- `medications`: 药物数组
  - `id`: 唯一标识符（前缀 med_ + 时间戳）
  - `name`: 药物名称（通用名或商品名）
  - `generic_name`: 通用名称
  - `dosage`: 剂量信息对象
    - `value`: 剂量数值
    - `unit`: 剂量单位（mg、g、ml、IU、片、粒等）
  - `frequency`: 用药频率对象
    - `type`: 频率类型（daily/weekly/every_other_day/as_needed）
    - `times_per_day`: 每天用药次数
    - `interval_days`: 用药间隔天数
  - `schedule`: 用药计划数组（强制要求明确指定每个星期几的用药计划）
    - `weekday`: 星期几（1-7，1表示周一，7表示周日）
    - `time`: 用药时间（HH:mm格式）
    - `timing_label`: 时间标签（早餐后、睡前等）
    - `dose`: 该时间点的剂量
  - `instructions`: 用药说明
  - `notes`: 备注信息
  - `active`: 是否活跃（true表示正在使用，false表示已停用）
  - `created_at`: 创建时间（ISO 8601格式）
  - `last_updated`: 最后更新时间（ISO 8601格式）

### schedule 数组生成规则

**重要：schedule 必须为每个星期几明确生成用药计划记录**

#### 每天1次的药物
生成 7 条记录（周一至周日各1条）
```json
"schedule": [
  {"weekday": 1, "time": "08:00", ...},
  {"weekday": 2, "time": "08:00", ...},
  {"weekday": 3, "time": "08:00", ...},
  {"weekday": 4, "time": "08:00", ...},
  {"weekday": 5, "time": "08:00", ...},
  {"weekday": 6, "time": "08:00", ...},
  {"weekday": 7, "time": "08:00", ...}
]
```

#### 每天2次的药物
生成 14 条记录（每天2次 × 7天）
```json
"schedule": [
  {"weekday": 1, "time": "08:00", ...},  // 周一早晨
  {"weekday": 1, "time": "20:00", ...},  // 周一晚上
  {"weekday": 2, "time": "08:00", ...},  // 周二早晨
  {"weekday": 2, "time": "20:00", ...},  // 周二晚上
  ... (继续至星期日)
]
```

#### 每天3次的药物
生成 21 条记录（每天3次 × 7天）
```json
"schedule": [
  {"weekday": 1, "time": "08:00", ...},  // 周一早餐后
  {"weekday": 1, "time": "12:30", ...},  // 周一午餐后
  {"weekday": 1, "time": "18:30", ...},  // 周一晚餐后
  {"weekday": 2, "time": "08:00", ...},  // 周二早餐后
  ... (继续至星期日)
]
```

#### 每周1次的药物
生成 1 条记录（指定的星期几）
```json
"schedule": [
  {"weekday": 1, "time": "08:00", ...}  // 每周一
]
```

#### 隔天1次的药物
生成 4 条记录（周一、三、五、日 或 二、四、六）
```json
"schedule": [
  {"weekday": 1, "time": "08:00", ...},
  {"weekday": 3, "time": "08:00", ...},
  {"weekday": 5, "time": "08:00", ...},
  {"weekday": 7, "time": "08:00", ...}
]
```

### 用药记录数据结构

```json
{
  "date": "2025-12-31",
  "logs": [
    {
      "id": "log_20251231080000001",
      "medication_id": "med_20251231123456789",
      "medication_name": "阿司匹林",
      "scheduled_time": "08:00",
      "actual_time": "2025-12-31T08:15:00",
      "status": "taken",
      "dose": {
        "value": 100,
        "unit": "mg"
      },
      "notes": "",
      "created_at": "2025-12-31T08:15:00.000Z"
    }
  ]
}
```

### 字段说明

- `date`: 用药日期（YYYY-MM-DD格式）
- `logs`: 用药记录数组
  - `id`: 记录唯一标识符（前缀 log_ + 时间戳）
  - `medication_id`: 关联的药物ID
  - `medication_name`: 药物名称
  - `scheduled_time`: 计划用药时间（HH:mm格式）
  - `actual_time`: 实际用药时间（ISO 8601格式，漏服时为null）
  - `status`: 用药状态（taken/missed/skipped/delayed）
  - `dose`: 实际剂量
  - `notes`: 备注（如漏服原因）
  - `created_at`: 记录创建时间（ISO 8601格式）

### 用药状态值说明

- **taken**: 已服用（按时或延迟服用）
- **missed**: 漏服（未服用）
- **skipped**: 跳过（医嘱停用或暂停）
- **delayed**: 延迟服用（已服用但时间延迟）

### 频率类型说明

- **daily**: 每日（times_per_day表示每天次数）
- **weekly**: 每周（times_per_day表示每周次数）
- **every_other_day**: 隔日一次
- **as_needed**: 按需服用（不计算依从性）

### 用药依从性计算

```
依从性百分比 = (实际服用次数 / 计划服用次数) × 100%

其中：
- 实际服用次数 = status为taken或delayed的记录数
- 计划服用次数 = 应服用的总次数（排除skipped和as_needed）
- 待服用状态不计入统计
```

### 依从性等级

- **优秀**: ≥ 90%
- **良好**: 70% - 89%
- **需改进**: < 70%

## 全局索引更新（用药记录）

```json
{
  "medications": [
    {
      "id": "med_20251231123456789",
      "name": "阿司匹林",
      "dosage_value": 100,
      "dosage_unit": "mg",
      "frequency_type": "daily",
      "file_path": "data/medications/medications.json",
      "active": true,
      "created_at": "2025-12-31T12:34:56.789Z"
    }
  ],
  "medication_logs": [
    {
      "id": "log_20251231080000001",
      "date": "2025-12-31",
      "medication_id": "med_20251231123456789",
      "medication_name": "阿司匹林",
      "status": "taken",
      "file_path": "data/medication-logs/2025-12/2025-12-31.json"
    }
  ]
}
```
