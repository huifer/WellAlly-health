---
description: 青春期发育评估和Tanner分期
arguments:
  - name: action
    description: 操作类型：breast(乳房)/pubic(阴毛)/menarche(初潮)/testicular(睾丸)/penis(阴茎)/voice(变声)/bone-age(骨龄)/status(状态)/assessment(评估)/check(性早熟检查)
    required: true
  - name: info
    description: 发育信息（分期、体积、年龄等，自然语言描述）
    required: false
---

# 青春期发育评估

评估青春期性发育程度（Tanner分期），识别性早熟或发育延迟。

## 操作类型

### 1. 女孩青春期评估

#### 1.1 记录乳房发育 - `breast`

**示例:**
```
/growth puberty breast B3
/growth puberty breast stage 3
```

#### 1.2 记录阴毛发育 - `pubic`

**示例:**
```
/growth puberty pubic P2
/growth puberty pubic hair stage 2
```

#### 1.3 记录初潮 - `menarche`

**示例:**
```
/growth puberty menarche true 11.5
/growth puberty menarche occurred at 11.5 years
```

### 2. 男孩青春期评估

#### 2.1 记录睾丸体积 - `testicular`

**示例:**
```
/growth puberty testicular 8ml
/growth puberty testicle volume 8
```

#### 2.2 记录阴茎发育 - `penis`

**示例:**
```
/growth puberty penis 6.5cm
/growth puberty penis length 6.5
```

#### 2.3 记录变声 - `voice`

**示例:**
```
/growth puberty voice true
/growth puberty voice changed
```

### 3. 骨龄评估 - `bone-age`

**示例:**
```
/growth puberty bone-age 10.8
```

### 4. 综合评估 - `assessment`

**示例:**
```
/growth puberty assessment
```

### 5. 性早熟检查 - `check`

**示例:**
```
/growth puberty check
```

---

## Tanner分期标准

### 女孩乳房发育（B分期）
- B1：青春期前
- B2：乳房芽萌出
- B3：乳房和乳晕增大
- B4：乳晕突出
- B5：成熟乳房

### 女孩阴毛发育（P分期）
- P1：无阴毛
- P2：稀疏、长、色素浅
- P3：变粗、卷曲
- P4：成人型但范围小
- P5：成人型

### 男孩睾丸发育
- 4-6ml：G2期（开始）
- 6-10ml：G3期
- 15-20ml：G4期
- ≥20ml：G5期（成熟）

### 男孩阴毛发育（P分期）
- P1-P5：同女孩

---

## 性早熟标准

**性早熟:**
- 女孩：<8岁乳房发育或<10岁初潮
- 男孩：<9岁睾丸增大

**青春期延迟:**
- 女孩：>13岁无乳房发育或>16岁无初潮
- 男孩：>14岁睾丸未增大

---

## 骨龄评估

| 骨龄与实际年龄差 | 意义 |
|-----------------|------|
| < -1岁 | 生长延迟 |
| -1 至 +1岁 | 正常范围 |
| > +1岁 | 性早熟/加速生长 |

---

## 数据结构

```json
{
  "puberty_tracking": {
    "female_development": {
      "breast_stage": "B3",
      "menarche": {
        "occurred": false,
        "age_at_menarche": null
      }
    },
    "male_development": {
      "testicular_volume": {
        "left": 8,
        "right": 8
      },
      "voice_break": false
    },
    "bone_age": {
      "chronological_age": 10.5,
      "bone_age": 10.8,
      "difference": "+0.3_years"
    },
    "assessment": "normal_progression"
  }
}
```

---

## 医学安全原则

### ⚠️ 安全红线

1. **不做医学诊断**
2. **不推荐药物治疗**
3. **不预测成年身高**
4. **不替代专业医疗建议**

### ✅ 系统能做到的

- 青春期发育评估（Tanner分期）
- 性早熟/延迟筛查
- 发育进度追踪
- 骨龄与年龄差值计算

---

## 示例用法

```
# 女孩青春期
/growth puberty breast B3
/growth puberty menarche true 11.2
/growth puberty assessment

# 男孩青春期
/growth puberty testicular 8ml
/growth puberty voice true
/growth puberty check
```

---

## 重要提示

本系统仅供青春期发育评估记录，**不能替代专业医疗建议**。

所有性早熟、发育延迟或其他异常情况，**请咨询儿科内分泌医生**。

数据已保存到本地，不上传云端。
