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
- `last_updated`: 最后更新时间（ISO 8601格式）
