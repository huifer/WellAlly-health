---
description: 管理高血压监测数据、评估靶器官损害和心血管风险
arguments:
  - name: action
    description: 操作类型：record(记录血压)/trend(趋势分析)/average(平均血压)/history(历史记录)/status(达标情况)/risk(风险评估)/target(血压目标)/heart(心脏评估)/kidney(肾脏评估)/retina(眼底评估)/medication(用药管理)
    required: true
  - name: info
    description: 详细信息（血压数值、评估结果等，自然语言描述）
    required: false
---

# 高血压管理

全面的血压监测和管理，帮助控制血压、降低心血管风险。

## ⚠️ 医学安全声明

**重要提示：本系统仅供健康监测记录，不能替代专业医疗诊断和治疗。**

- ❌ 不给出具体用药剂量调整建议
- ❌ 不直接开具处方药或推荐具体药物
- ❌ 不替代医生诊断和治疗决策
- ❌ 不判断疾病预后或并发症发生
- ✅ 提供血压监测记录和趋势分析
- ✅ 提供靶器官损害评估记录
- ✅ 提供心血管风险计算（仅供参考）
- ✅ 提供生活方式建议和就医提醒

所有用药方案和治疗决策请遵从医生指导。

## 操作类型

### 1. 记录血压 - `record`

记录血压测量数据。

**参数说明：**
- `info`: 血压信息（必填），使用自然语言描述

**示例：**
```
/bp record 135/85 pulse 78
/bp record 130/80 morning sitting
/bp record 125/78 evening
/bp record 140/90 pulse 82 morning sitting left arm
```

**支持的信息：**
- 血压值：收缩压/舒张压（mmHg）
- 心率：pulse 78（次/分）
- 测量时间：morning/evening 或具体时间
- 测量体位：sitting/standing/lying
- 测量手臂：left/right

**执行步骤：**
1. 解析血压数值和附加信息
2. 生成记录ID和时间戳
3. 保存到 `data/hypertension-tracker.json`
4. 更新平均血压计算
5. 输出确认信息

### 2. 查看血压趋势 - `trend`

查看血压变化趋势和昼夜节律。

**示例：**
```
/bp trend
/bp trend 7days
/bp trend this month
```

**输出内容：**
- 血压趋势图（文字描述）
- 昼夜节律模式（杓型/非杓型/反杓型）
- 血压变异情况
- 达标率趋势

### 3. 计算平均血压 - `average`

计算指定时期的平均血压。

**示例：**
```
/bp average
/bp average 7days
/bp average last week
/bp average this month
```

**输出内容：**
- 家庭血压平均值（HBPM）
- 早晨平均血压
- 晚间平均血压
- 血压达标天数

### 4. 查看历史记录 - `history`

查看血压测量历史。

**示例：**
```
/bp history
/bp history 7
/bp history today
/bp history 2025-06-20
```

### 5. 查看达标情况 - `status`

查看血压达标率和控制情况。

**示例：**
```
/bp status
```

**输出内容：**
- 当前血压目标（<130/80 或 <140/90）
- 达标率（近7天、近30天）
- 达标天数
- 控制评价

### 6. 心血管风险评估 - `risk`

计算10年动脉粥样硬化性心血管病风险（ASCVD）。

**示例：**
```
/bp risk
```

**输出内容：**
- ASCVD风险评分（%）
- 风险等级（低危/中危/高危/很高危）
- 主要风险因素
- 就医建议

**注意：** 风险评估基于常规计算公式，仅供参考，具体风险请咨询医生。

### 7. 查看血压目标 - `target`

查看个体化血压管理目标。

**示例：**
```
/bp target
```

**输出内容：**
- 收缩压目标
- 舒张压目标
- 目标依据（年龄、合并症等）
- 生活方式建议

### 8. 心脏评估记录 - `heart`

记录心脏相关靶器官损害评估。

**示例：**
```
/bp heart echo normal
/bp heart ecg normal
/bp heart lvh none
```

**支持的检查：**
- echo：超声心动图
- ecg：心电图
- lvh：左心室肥厚

### 9. 肾脏评估记录 - `kidney`

记录肾脏相关靶器官损害评估。

**示例：**
```
/bp kidney uacr 15
/bp kidney egfr 90
/bp kidney creatinine 85
```

**支持的指标：**
- uacr：尿微量白蛋白/肌酐比值（mg/g）
- egfr：估算肾小球滤过率（ml/min/1.73m²）
- creatinine：血肌酐（μmol/L）

### 10. 眼底评估记录 - `retina`

记录眼底高血压视网膜病变评估。

**示例：**
```
/bp retina grade-0
/bp retina grade-1
/bp retina normal
```

**分级：**
- grade-0：无视网膜病变
- grade-1：轻度
- grade-2：中度
- grade-3：重度
- grade-4：渗出性

### 11. 用药管理 - `medication`

管理高血压相关用药（集成药物管理系统）。

**示例：**
```
/bp medication add 氨氯地平 5mg 每天1次
/bp medication list
/bp medication adherence
```

**执行流程：**
1. 解析药物信息
2. 调用 `/medication add` 命令添加药物
3. 在 hypertension-tracker.json 中添加引用记录
4. 输出确认信息

**引用格式：**
```json
{
  "medication_id": "med_xxx",
  "added_from": "hypertension_management",
  "added_date": "2025-01-02",
  "indication": "高血压"
}
```

## 数据结构

### 血压记录结构
```json
{
  "id": "bp_20250102080000001",
  "date": "2025-01-02",
  "time": "08:00",
  "systolic": 135,
  "diastolic": 85,
  "pulse": 78,
  "position": "sitting",
  "measurement_device": "home_monitor",
  "arm": "left",
  "created_at": "2025-01-02T08:00:00.000Z"
}
```

### 靶器官损害结构
```json
{
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
}
```

## 血压分类参考

| 分类 | 收缩压（mmHg） | 舒张压（mmHg） |
|------|---------------|---------------|
| 正常血压 | <120 | <80 |
| 正常高值 | 120-139 | 80-89 |
| 高血压1级 | 140-159 | 90-99 |
| 高血压2级 | 160-179 | 100-109 |
| 高血压3级 | ≥180 | ≥110 |

## 血压目标参考

**一般人群：** <130/80 mmHg
**65岁以上老年人：** <140/90 mmHg
**合并糖尿病/肾病：** <130/80 mmHg

## 靶器官损害评估频率建议

- **心脏超声**：每1-2年1次
- **尿微量白蛋白**：每年1次
- **眼底检查**：每年1次
- **颈动脉超声**：每1-2年1次

## 生活方式建议

### 饮食调整
- 限制钠盐摄入（<5g/天）
- 增加钾盐摄入（新鲜蔬果）
- 限制饮酒
- DASH饮食模式

### 运动建议
- 规律有氧运动（每周150分钟）
- 如：快走、游泳、骑车
- 避免剧烈运动

### 体重管理
- BMI <24 kg/m²
- 腰围：男性<90cm，女性<85cm

### 其他建议
- 戒烟
- 规律作息
- 减轻精神压力
- 定期监测血压

## 就医建议

### 紧急就医（立即拨打120）
- 收缩压≥180 mmHg 且舒张压≥120 mmHg
- 伴有胸痛、呼吸困难、说话困难
- 头痛、意识模糊、视力改变
- 面部或肢体麻木/无力

### 尽快就医（48小时内）
- 血压持续≥160/100 mmHg
- 靶器官损害加重
- 药物不耐受或副作用明显

### 定期复查
- 高血压1级：每3个月1次
- 高血压2级：每2个月1次
- 高血压3级：每1个月1次

## 错误处理

- **血压值无效**："血压值应在正常范围内（收缩压70-250，舒张压40-150）"
- **信息不完整**："请提供完整的血压信息，例如：/bp record 135/85"
- **无数据**："暂无血压记录，请先使用 /bp record 记录血压"
- **文件读取失败**："无法读取血压数据，请检查数据文件"

## 示例用法

```
# 记录血压
/bp record 135/85 pulse 78
/bp record 130/80 morning sitting
/bp record 125/78 evening

# 查看趋势和统计
/bp trend
/bp average
/bp status

# 评估检查
/bp risk
/bp heart echo normal
/bp kidney uacr 15
/bp retina grade-0

# 用药管理
/bp medication add 氨氯地平 5mg 每天1次
/bp medication list
```

## 注意事项

- 测量前休息5分钟
- 测量前30分钟避免咖啡、运动、吸烟
- 保持安静环境
- 测量时坐位，手臂与心脏同高
- 建议早晚各测一次
- 记录时注明测量时间和体位

---

**免责声明：本系统仅供健康监测记录使用，不替代专业医疗诊断和治疗。**
