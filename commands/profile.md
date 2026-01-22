---
description: 设置用户基础医疗参数
arguments:
  - name: action
    description: 操作类型：set(设置)/view(查看)
    required: true
  - name: gender
    description: 性别（M=男，F=女）
    required: false
  - name: height
    description: 身高（厘米）
    required: false
  - name: weight
    description: 体重（公斤）
    required: false
  - name: birth_date
    description: 出生日期（格式：YYYY-MM-DD）
    required: false
---

# 用户基础参数设置

用于设置或查看用户的基础医疗参数，包括性别、身高、体重和出生日期。

## 操作类型

### 1. 设置参数 - `set`

设置用户的基础参数，可以重复设置以更新数据。

**参数说明：**
- `gender`: 性别（M=男性，F=女性）
- `height`: 身高，单位厘米（cm）
- `weight`: 体重，单位公斤（kg）
- `birth_date`: 出生日期，格式 YYYY-MM-DD

**示例：**
```
/profile set F 175 70 1990-01-01
/profile set gender=F height=175 weight=70 birth_date=1990-01-01
```

### 2. 查看参数 - `view`

查看当前已设置的基础参数。

## 执行步骤

### 设置参数 (set)

1. **读取现有数据**
   - 读取 `data/profile.json`
   - 如果文件不存在，创建新文件

2. **验证输入数据**
   - 检查性别：M、F 或其他有效值
   - 检查身高范围：50-250 cm
   - 检查体重范围：2-300 kg
   - 检查日期格式：YYYY-MM-DD
   - 检查出生日期不能晚于今天

3. **计算派生指标**
   - 计算年龄（基于出生日期）
   - 计算BMI（体重kg / 身高m²）
   - 计算体表面积（Mosteller公式）：√(身高cm × 体重kg / 3600)

4. **保存数据**
   - 更新 `data/profile.json`
   - 保留历史记录（可选）

5. **输出确认信息**
   ```
   ✅ 用户基础参数已更新

   基本信息：
   ━━━━━━━━━━━━━━━━━━━━━━━━━━
   性别：F（女）
   身高：175 cm
   体重：70 kg
   出生日期：1990-01-01 (35岁)

   计算指标：
   ━━━━━━━━━━━━━━━━━━━━━━━━━━
   BMI：22.9 (正常)
   体表面积：1.85 m²

   数据已保存至：data/profile.json
   ```

### 查看参数 (view)

1. **读取数据**
   - 读取 `data/profile.json`

2. **显示信息**
   - 如果数据存在，显示完整信息
   - 如果数据不存在，提示用户设置

## 数据结构

`data/profile.json` 格式：

```json
{
  "created_at": "2025-12-31",
  "last_updated": "2025-12-31",
  "basic_info": {
    "gender": "F",
    "height": 175,
    "height_unit": "cm",
    "weight": 70,
    "weight_unit": "kg",
    "birth_date": "1990-01-01"
  },
  "calculated": {
    "age": 35,
    "age_years": 35,
    "bmi": 22.9,
    "bmi_status": "正常",
    "body_surface_area": 1.85,
    "bsa_unit": "m²"
  },
  "history": [
    {
      "updated_at": "2025-12-31",
      "height": 175,
      "weight": 70
    }
  ]
}
```

## BMI 分类标准

- 偏瘦：< 18.5
- 正常：18.5 - 23.9
- 超重：24 - 27.9
- 肥胖：≥ 28

## 注意事项

- 身高体重可以随时更新，建议定期测量
- 出生日期用于计算年龄，设置后不建议更改
- 所有数据仅保存在本地，确保隐私安全
- 体表面积用于辐射剂量计算，务必准确填写

## 示例用法

```
# 设置完整参数
/profile set F 175 70 1990-01-01

# 使用参数名设置
/profile set gender=M height=180 weight=75 birth_date=1985-06-15

# 只更新体重
/profile set weight=68

# 查看当前参数
/profile view
```

## 错误处理

- **格式错误**: "参数格式错误，请使用：/profile set F 175 70 1990-01-01"
- **范围错误**: "身高应在50-250cm之间，体重应在2-300kg之间"
- **日期错误**: "出生日期不能晚于今天"
- **未设置**: "请先设置基础参数：/profile set F 175 70 1990-01-01"
