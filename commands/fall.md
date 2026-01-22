---
description: 跌倒风险评估命令 - 记录跌倒事件、平衡功能测试、居家环境评估
arguments:
  - name: action
    description: 操作类型 (record, history, tug, berg, single-leg-stance, gait, home, risk, risk-factors, interventions)
    required: true
  - name: info
    description: 具体信息(跌倒详情、测试结果、环境评估等)
    required: false
---

# 跌倒风险评估命令 (Fall Risk Assessment)

## 功能概述

用于管理老年人跌倒风险评估，包括跌倒史记录、平衡功能测试、步态分析和居家环境安全评估。

---

## ⚠️ 安全红线

1. **不处理跌倒后的损伤**
   - 跌倒受伤需立即就医
   - 系统仅记录跌倒事件

2. **不替代专业平衡功能评估**
   - 平衡测试需康复治疗师指导
   - 系统记录测试结果

3. **不给出具体康复训练处方**
   - 康复训练需专业评估
   - 系统提供一般性建议

---

## ✅ 系统能做到的

- 跌倒风险因素评估
- 平衡功能测试记录(TUG/Berg/单腿站立)
- 步态分析记录
- 居家环境安全评估
- 跌倒预防建议
- 风险分级和干预建议

---

## 可用操作

### 1. 记录跌倒事件 - `record`

记录跌倒事件的详细信息。

**参数说明:**
- `info`: 跌倒事件信息(必填)
  - 日期(YYYY-MM-DD格式)
  - 地点(bathroom/bedroom/living_room/kitchen/stairs等)
  - 原因(slippery_floor/trip/loss_balance/dizziness等)
  - 损伤程度(none/bruise/cut/fracture/head_injury等)

**执行步骤:**
#### 1. 参数识别
- 从info中提取日期、地点、原因、损伤
- 日期格式: `(\d{4}-\d{2}-\d{2})`
- 地点关键词: bathroom, bedroom, living_room, kitchen, stairs
- 原因关键词: slippery, trip, dizzy, weak, sudden_movement
- 损伤关键词: bruise, cut, fracture, head_injury, none

#### 2. 记录更新
- 更新 `data/fall-risk-assessment.json`
- 更新 `fall_history` 段
- 增加fall_count计数
- 标记last_fall信息

#### 3. 风险重新评估
- 更新 `previous_falls` 风险因素
- 重新计算overall_risk

#### 4. 输出确认
- 显示跌倒事件摘要
- 显示跌倒次数统计
- 显示是否需要就医

**示例:**
```
/fall record 2025-03-15 bathroom slippery_floor bruise
/fall record 今天 卧室 地滑 轻微擦伤
```

---

### 2. 查看跌倒历史 - `history`

查看跌倒历史记录。

**执行步骤:**
#### 1. 读取数据
- 读取 `data/fall-risk-assessment.json`
- 提取 `fall_history` 段

#### 2. 显示历史报告
- 最近一次跌倒详情
- 过去一年跌倒次数
- 过去6个月跌倒次数
- 跌倒趋势
- 常见跌倒地点
- 常见跌倒原因

**示例:**
```
/fall history
```

---

### 3. TUG测试 - `tug`

记录Timed Up and Go测试结果。

**参数说明:**
- `info`: TUG测试时间(秒)
- `date`: 测试日期(可选，默认今天)

**结果解读:**
- <10秒: 正常
- 10-19秒: 基本正常
- 20-29秒: 行动受限
- ≥30秒: 依赖他人

**执行步骤:**
#### 1. 参数识别
- 从info中提取TUG时间
- 识别格式: `tug[:\s]+(\d+)` 或 `(\d+)\s*秒`

#### 2. 结果解读
- 根据时间判断行动能力
- 评估跌倒风险等级

#### 3. 记录更新
- 更新 `balance_tests.tug_test` 段
- 记录日期、时间、解读结果

#### 4. 输出确认
- 显示TUG测试结果
- 显示行动能力评估
- 显示跌倒风险

**示例:**
```
/fall tug 18
/fall tug 22秒
```

---

### 4. Berg平衡量表 - `berg`

记录Berg平衡量表测试结果。

**参数说明:**
- `info`: Berg量表总分(0-56分)
- `date`: 测试日期(可选，默认今天)

**结果解读:**
- 0-20分: 需坐轮椅
- 21-40分: 需辅助行走
- 41-56分: 独立行走

**执行步骤:**
#### 1. 参数识别
- 从info中提取Berg分数
- 识别格式: `berg[:\s]+(\d+)`

#### 2. 结果解读
- 根据分数判断平衡能力
- 评估跌倒风险等级

#### 3. 记录更新
- 更新 `balance_tests.berg_balance_scale` 段
- 记录日期、分数、解读结果

#### 4. 输出确认
- 显示Berg平衡量表结果
- 显示平衡能力评估
- 显示跌倒风险

**示例:**
```
/fall berg 42
/fall berg 38分
```

---

### 5. 单腿站立测试 - `single-leg-stance`

记录单腿站立测试结果。

**参数说明:**
- `info`: 单腿站立时间(秒)
  - 可指定睁眼(eyes_open)或闭眼(eyes_closed)
- `date`: 测试日期(可选，默认今天)

**年龄参考值:**
- <60岁: >30秒正常
- 60-69岁: >15秒正常
- 70-79岁: >5秒正常
- ≥80岁: >3秒正常

**执行步骤:**
#### 1. 参数识别
- 从info中提取单腿站立时间
- 识别格式: `single-leg-stance[:\s]+(\d+)`
- 识别睁眼/闭眼条件

#### 2. 结果解读
- 根据年龄判断平衡能力
- 评估跌倒风险等级

#### 3. 记录更新
- 更新 `balance_tests.single_leg_stance` 段
- 记录日期、睁眼/闭眼时间、结果

#### 4. 输出确认
- 显示单腿站立测试结果
- 显示平衡能力评估
- 显示跌倒风险

**示例:**
```
/fall single-leg-stance 8
/fall single-leg-stance 睁眼 10秒
/fall single-leg-stance 闭眼 2秒
```

---

### 6. 步态分析 - `gait`

记录步态分析结果。

**参数说明:**
- `info`: 步态信息
  - `speed`: 步速(m/s)
  - `abnormalities`: 步态异常(shortened_step/widened_base/unsteady等)

**步速参考值:**
- >1.0 m/s: 正常
- 0.6-1.0 m/s: 行动受限
- <0.6 m/s: 严重受限

**常见步态异常:**
- `shortened_step` - 步幅缩短
- `widened_base` - 步宽增加
- `unsteady_gait` - 步态不稳
- `shuffling` - 拖步
- `asymmetric` - 不对称

**执行步骤:**
#### 1. 参数识别
- 从info中提取步速和步态异常
- 步速格式: `speed[:\s]+([\d.]+)`
- 异常关键词: shortened_step, widened_base, unsteady等

#### 2. 结果解读
- 根据步速判断行动能力
- 根据异常评估风险

#### 3. 记录更新
- 更新 `gait_analysis` 段
- 记录日期、步速、异常、解读结果

#### 4. 输出确认
- 显示步态分析结果
- 显示行动能力评估
- 显示跌倒风险

**示例:**
```
/fall gait speed 0.8
/fall gait abnormal shortened_step widened_base
/fall gait speed 0.7 步幅缩短 步态不稳
```

---

### 7. 居家环境评估 - `home`

评估居家环境安全状况。

**参数说明:**
- `info`: 环境评估信息
  - 房间(living_room/bedroom/bathroom/stairs)
  - 安全项目(floor_slippery/grab_bars/night_light等)
  - 状态(true/false/yes/no)

**可评估的房间和安全项目:**

**客厅(living_room):**
- `floor_slippery` - 地面湿滑
- `adequate_lighting` - 照明充足
- `obstacles_removed` - 清除障碍物
- `rugs_secure` - 地毯固定

**卧室(bedroom):**
- `bedside_light` - 床边灯
- `night_light` - 夜灯
- `bed_height_appropriate` - 床高度合适
- `clutter_free` - 无杂物

**浴室(bathroom):**
- `non_slip_mat` - 防滑垫
- `grab_bars` - 扶手
- `shower_chair` - 淋浴椅
- `easy_access` - 易于进出

**楼梯(stairs):**
- `handrails` - 扶手
- `non_slip_treads` - 防滑台阶
- `adequate_lighting` - 照明充足
- `clutter_free` - 清除杂物

**执行步骤:**
#### 1. 参数识别
- 从info中提取房间、安全项目、状态
- 格式: `home[:\s]+(\w+)[\s]+(\w+)[\s]+(\w+)`

#### 2. 记录更新
- 更新 `home_safety` 段
- 记录各房间的安全状况
- 更新recommendations

#### 3. 输出确认
- 显示环境评估结果
- 显示安全隐患
- 显示改进建议

**示例:**
```
/fall home living_room floor_slippery false
/fall home bathroom grab_bars true
/fall home bedroom night_light false
/fall home assessment
```

---

### 8. 跌倒风险评估 - `risk`

综合评估跌倒风险等级。

**执行步骤:**
#### 1. 风险因素识别
- 内在因素(年龄、既往跌倒史、平衡功能、步态、肌力、视力、认知、用药、慢性病)
- 外在因素(居家环境、鞋子、辅助器具)

#### 2. 风险评分
- 统计风险因素数量
- 平衡测试结果(TUG/Berg)
- 步态分析结果
- 居家环境安全状况

#### 3. 风险分级
- 低风险(0-5分)
- 中风险(6-12分)
- 高风险(13-18分)

#### 4. 显示风险评估
- 当前风险等级
- 主要风险因素
- 干预建议

**示例:**
```
/fall risk
```

---

### 9. 查看风险因素 - `risk-factors`

查看所有跌倒风险因素。

**执行步骤:**
#### 1. 读取数据
- 读取 `data/fall-risk-assessment.json`
- 提取 `risk_factors` 段

#### 2. 显示风险因素报告
- 内在风险因素
- 外在风险因素
- 已控制的风险因素
- 未控制的风险因素

**示例:**
```
/fall risk-factors
```

---

### 10. 查看干预建议 - `interventions`

查看跌倒预防干预建议。

**执行步骤:**
#### 1. 评估干预需求
- 根据风险因素
- 根据平衡测试结果
- 根据环境评估结果

#### 2. 显示干预措施
- 平衡和力量训练
- 居家环境改造
- 用药调整建议
- 视力矫正
- 辅助器具使用
- 鞋子建议

**示例:**
```
/fall interventions
```

---

## 注意事项

### 平衡测试安全
- TUG测试需有人保护
- Berg平衡量表需治疗师指导
- 单腿站立测试注意安全

### 环境评估全面性
- 应评估所有房间
- 注意照明、地面、障碍物
- 考虑夜间活动安全

### 跌后处理
- 跌倒后先检查有无受伤
- 头部受伤、疑似骨折立即就医
- 记录跌倒详情分析原因

---

## 参考资源

- AGS跌倒预防指南(2018)
- Berg平衡量表(1989)
- TUG测试(Podsiadlo 1991)
- CDC老年人跌倒预防
