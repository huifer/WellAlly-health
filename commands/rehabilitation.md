---
description: 管理康复训练计划、记录训练进展和评估功能改善
arguments:
  - name: action
    description: 操作类型：start(开始康复)/exercise(记录训练)/assess(功能评估)/progress(进展报告)/goals(目标管理)/plan(康复计划)
    required: true
  - name: info
    description: 详细信息（康复类型、训练详情、评估结果等，自然语言描述）
    required: false
---

# 康复训练管理

全面的康复训练管理系统，帮助记录康复进展、评估功能改善和达成康复目标。

## ⚠️ 医学安全声明

**重要提示：本系统仅供康复训练记录，不能替代专业康复治疗和医生诊断。**

- ❌ 不替代康复师的专业指导和治疗方案
- ❌ 不给出具体的康复训练处方
- ❌ 不诊断损伤程度或并发症
- ❌ 不判断康复预后或恢复时间
- ✅ 提供康复训练记录和进展追踪
- ✅ 提供功能评估记录和趋势分析
- ✅ 提供康复目标管理和达成追踪
- ✅ 提供训练依从性统计和疼痛监测
- ✅ 提供一般性康复建议和专业就医提醒

所有康复训练计划和治疗决策请遵从康复师和医生的指导。

---

## 操作类型

### 1. 开始康复追踪 - `start`

开始记录康复训练过程。

**参数说明：**
- `info`: 康复信息（必填），使用自然语言描述

**示例：**
```
/rehab start acl-surgery 2025-05-01
/rehab start sports-injury ankle sprain
/rehab start neurological stroke 2025-04-15
/rehab start cardiac-surgery cabg 2025-06-01
```

**支持的康复类型：**

**骨科康复：**
- acl_reconstruction / acl-surgery：ACL重建术后
- meniscus_surgery：半月板手术
- fracture：骨折康复
- joint_replacement：关节置换（髋/膝/肩）
- spine_surgery：脊柱手术

**运动损伤康复：**
- ankle_sprain：踝关节扭伤
- knee_injury：膝关节损伤
- shoulder_injury：肩关节损伤
- tennis_elbow：网球肘
- muscle_strain：肌肉拉伤

**神经康复：**
- stroke：脑卒中康复
- spinal_cord_injury：脊髓损伤
- parkinsons：帕金森病康复
- multiple_sclerosis：多发性硬化

**心肺康复：**
- cardiac_surgery：心脏手术后
- copd：COPD康复
- pneumonia：肺炎后康复
- covid_rehab：新冠后康复

**执行步骤：**
1. 解析康复类型和相关信息
2. 生成康复记录ID和时间戳
3. 初始化康复档案到 `data/rehabilitation-tracker.json`
4. 创建初始康复阶段
5. 输出确认信息和初始建议

---

### 2. 记录康复训练 - `exercise`

记录每日康复训练情况。

**参数说明：**
- `info`: 训练信息（必填），使用自然语言描述

**示例：**
```
/rehab exercise straight_leg_raise 3x15 pain2
/rehab exercise ankle_dorsiflexion 2x20 pain1
/rehab exercise quadriceps_sets 3x12 resistance 2kg pain3
/rehab exercise gait_training 10minutes pain1
/rehab exercise balance_training single_leg 30sec pain0
```

**支持的训练类型：**

**关节活动度训练：**
- rom_exercises：关节活动度训练
- stretching：拉伸训练
- flexion：屈曲训练
- extension：伸展训练
- rotation：旋转训练

**力量训练：**
- straight_leg_raise / slr：直腿抬高
- quadriceps_sets：股四头肌等长收缩
- hamstring_curls：腘绳肌弯举
- calf_raises：提踵训练
- glute_sets：臀部肌肉训练

**平衡训练：**
- balance_training：平衡训练
- single_leg_stance：单腿站立
- wobble_board：平衡板训练
- tai_chi：太极训练

**功能训练：**
- gait_training：步态训练
- stairs_training：上下楼梯训练
- sit_to_stand：坐站训练
- weight_bearing：负重训练

**强度表示方法：**
- 组数x次数：3x15, 2x20
- 疼痛评分：pain2（0-10 VAS评分）
- 阻力：resistance 2kg, resistance band red
- 时长：10minutes, 30seconds
- RPE：rpe 12（6-20量表）

**数据结构：**
```json
{
  "date": "2025-06-20",
  "time": "08:00",
  "exercise_name": "straight_leg_raise",
  "sets": 3,
  "reps": 15,
  "duration_minutes": 10,
  "resistance": "bodyweight",
  "pain_level": 2,
  "rpe": 10,
  "notes": "完成良好，无明显疼痛"
}
```

---

### 3. 功能评估记录 - `assess`

记录功能评估结果。

**参数说明：**
- `info`: 评估信息（必填），使用自然语言描述

**示例：**
```
/rehab assess rom knee_flexion 120
/rehab assess strength quadriceps 4/5
/rehab assess balance berg_45 56
/rehab assess pain vas 2
/rehab assess gait 10meters normal
```

**支持的评估类型：**

**关节活动度（ROM）评估：**
```
/rehab assess rom [关节] [活动] [角度]
```
- 关节：knee, hip, ankle, shoulder, elbow, wrist
- 活动：flexion（屈曲）, extension（伸展）, abduction（外展）, rotation（旋转）
- 角度：0-180度

**肌力评估：**
```
/rehab assess strength [肌肉] [等级]
```
- 肌肉：quadriceps, hamstrings, gluteus, deltoid, biceps, triceps
- 等级：0-5级（Lovett评分或MMT评分）
  - 0/5：无收缩
  - 1/5：微弱收缩
  - 2/5：去重力运动
  - 3/5：抗重力运动
  - 4/5：抗阻力运动
  - 5/5：正常肌力

**平衡评估：**
```
/rehab assess balance [测试类型] [分数]
```
- berg_balance：Berg平衡量表（0-56分）
- tug：计时起立行走测试（秒）
- single_leg_stance：单腿站立（秒）
- tinetti：Tinetti平衡与步态量表（0-28分）

**疼痛评估：**
```
/rehab assess pain vas [分数]
/rehab assess pain nrs [分数]
```
- vas：视觉模拟量表（0-10cm）
- nrs：数字评分量表（0-10）

**步态评估：**
```
/rehab assess gait [距离] [描述]
```
- 距离：10meters, 6minutes
- 描述：normal, abnormal, with_assist, independent

**功能评估：**
```
/rehab assess functional [测试] [结果]
```
- adl：日常生活活动能力（Barthel指数0-100）
- lehs：下肢功能量表（LEFS）
- dash：上肢功能量表（DASH）

---

### 4. 查看康复进展 - `progress`

查看康复训练进展和功能改善情况。

**示例：**
```
/rehab progress
/rehab progress 30days
/rehab progress phase 2
```

**输出内容：**
- 康复时长和当前阶段
- 功能改善趋势（ROM、肌力、平衡）
- 训练依从性统计
- 疼痛变化趋势
- 目标达成情况
- 进展曲线（文字描述）

**进展分析维度：**
- **ROM改善**：关节活动度变化趋势
- **肌力改善**：肌力等级提升情况
- **疼痛控制**：疼痛评分变化趋势
- **功能恢复**：日常功能改善情况
- **训练依从性**：实际训练/计划训练比例
- **阶段进展**：康复阶段完成情况

---

### 5. 康复目标管理 - `goals`

管理康复训练目标。

**示例：**
```
/rehab goals add full_knee_extension target 2025-07-01
/rehab goals add quadriceps_strength 5/5
/rehab goals list
/rehab goals active
/rehab goals completed
/rehab goals update knee_extension 90%
/rehab goals complete rom_goal
/rehab goals delete strength_goal
```

**目标类型：**
- **ROM目标**：关节活动度目标
- **肌力目标**：肌力等级目标
- **功能目标**：日常功能恢复目标
- **疼痛目标**：疼痛控制目标
- **活动目标**：特定活动能力目标

**目标状态：**
- pending：待开始
- in_progress：进行中
- on_track：按计划进行
- behind：进度落后
- achieved：已达成
- cancelled：已取消

---

### 6. 康复阶段管理 - `plan`

管理康复训练阶段。

**示例：**
```
/rehab plan phase 2
/rehab plan update
/rehab plan next
/rehab plan list
```

**常见康复阶段：**

**骨科康复（以ACL为例）：**
- **Phase 1（保护期）**：0-2周
  - 目标：控制肿胀、疼痛，恢复伸膝
  - 训练：ROM练习、股四头肌等长收缩

- **Phase 2（活动期）**：2-6周
  - 目标：恢复ROM至0-120°，部分负重
  - 训练：闭链运动、平衡训练

- **Phase 3（强化期）**：6-12周
  - 目标：恢复肌力，完全负重
  - 训练：开链运动、强化训练

- **Phase 4（功能期）**：12-16周
  - 目标：恢复运动功能
  - 训练：敏捷性训练、专项训练

- **Phase 5（重返运动期）**：16周以上
  - 目标：安全重返运动
  - 训练：专项运动训练

**神经康复阶段：**
- **急性期**：病情稳定
- **恢复期**：功能改善
- **后遗症期**：功能维持

**心肺康复阶段：**
- **住院期**：早期活动
- **恢复期**：功能恢复
- **维持期**：健康维持

---

## 数据结构

### 康复档案主结构
```json
{
  "rehabilitation_management": {
    "user_profile": {
      "condition": "acl_reconstruction",
      "injury_date": "2025-05-01",
      "surgery_date": "2025-05-15",
      "surgeon": "医生姓名",
      "therapist": "康复师姓名",
      "current_phase": "3",
      "phase_start_date": "2025-06-01"
    },
    "rehabilitation_goals": [
      {
        "goal_id": "goal_001",
        "category": "rom",
        "description": "full_knee_extension",
        "baseline": -10,
        "current": 0,
        "target": 0,
        "unit": "degrees",
        "status": "achieved",
        "target_date": "2025-06-15"
      }
    ],
    "exercise_log": [],
    "functional_assessments": [],
    "phase_progression": {},
    "pain_diary": [],
    "statistics": {},
    "metadata": {}
  }
}
```

### 功能评估结构
```json
{
  "assessment_date": "2025-06-20",
  "rom": {
    "knee_flexion": 120,
    "knee_extension": 0,
    "target_range": "0-135"
  },
  "muscle_strength": {
    "quadriceps": "4/5",
    "hamstrings": "4+/5"
  },
  "pain_assessment": {
    "vas_at_rest": 0,
    "vas_with_activity": 2,
    "location": "anterior_knee"
  },
  "balance": {
    "test_type": "single_leg_stance",
    "duration_seconds": 30,
    "notes": "stable"
  },
  "functional_tests": {
    "walk_distance_m": 100,
    "stairs_assessment": "up_down_normal"
  }
}
```

---

## 康复注意事项

### ⚠️ 安全原则

**循序渐进：**
- 康复训练必须按照阶段性原则进行
- 不超越当前康复阶段
- 避免过度训练和再次损伤

**疼痛管理：**
- 训练时疼痛控制在可接受范围（一般<4/10）
- 训练后疼痛应在24小时内恢复到基线
- 疼痛加剧时及时停止并咨询康复师

**休息与恢复：**
- 保证充分休息时间
- 避免连续高强度训练
- 注意训练后的身体反应

### ✅ 训练建议

**训练频率：**
- 每日训练：ROM练习、拉伸
- 每周3-5次：力量训练
- 每周2-3次：平衡训练、功能训练

**训练时机：**
- 在疼痛较轻时训练
- 热身后进行训练
- 训练后适当冷敷

**记录要点：**
- 记录训练时的疼痛评分
- 记录训练完成情况
- 记录身体反应和异常情况

---

## 就医建议

### 紧急就医（立即就诊）
- 剧烈疼痛（疼痛评分>7/10）
- 关节明显肿胀或变形
- 完全无法负重或活动
- 出现麻木、无力等神经症状
- 伤口红肿、渗出、发热

### 尽快就医（48小时内）
- 疼痛持续加重
- 训练后疼痛不恢复
- 功能出现倒退
- 新症状出现

### 定期复查
- 骨科康复：每2-4周1次
- 神经康复：每4-6周1次
- 心肺康复：每2-3周1次
- 或遵康复师建议

---

## 康复评估参考标准

### ROM参考值（膝关节）
- 完全伸直：0°
- 完全屈曲：135-150°
- 日常功能需求：0-110°

### 肌力分级标准
- 5/5：正常肌力
- 4/5：抗阻力运动
- 3/5：抗重力运动
- 2/5：去重力运动
- 1/5：微弱收缩
- 0/5：无收缩

### 平衡评估参考
- Berg平衡量表：
  - <41分：跌倒风险高
  - 41-56分：跌倒风险低
- 单腿站立：
  - 年轻人：>30秒
  - 老年人：>10秒

---

## 错误处理

- **康复类型无效**："不支持的康复类型，请参考命令说明"
- **训练记录不完整**："请提供完整的训练信息，例如：/rehab exercise slr 3x15 pain2"
- **评估信息缺失**："请提供完整的评估信息，例如：/rehab assess rom knee_flexion 120"
- **无康复数据**："暂无康复记录，请先使用 /rehab start 开始康复追踪"
- **文件读取失败**："无法读取康复数据，请检查数据文件"

---

## 示例用法

```
# 开始康复追踪
/rehab start acl-surgery 2025-05-01
/rehab start sports-injury ankle

# 记录训练
/rehab exercise straight_leg_raise 3x15 pain2
/rehab exercise quadriceps_sets 3x12 pain1
/rehab exercise balance_training 30sec pain0

# 功能评估
/rehab assess rom knee_flexion 120
/rehab assess strength quadriceps 4/5
/rehab assess pain vas 2

# 查看进展
/rehab progress
/rehab progress 30days

# 目标管理
/rehab goals add full_knee_extension
/rehab goals list
/rehab goals update rom 90%

# 阶段管理
/rehab plan phase 2
/rehab plan update
```

---

## 注意事项

- **遵循康复师指导**：所有训练计划应遵循康复师的专业建议
- **记录详细数据**：准确记录训练、评估和疼痛数据
- **定期评估**：按照康复师建议定期进行功能评估
- **疼痛控制**：训练时注意疼痛管理，必要时咨询康复师
- **保持耐心**：康复是一个长期过程，需要耐心和坚持

---

**免责声明：本系统仅供康复训练记录使用，不替代专业康复治疗和医疗诊断。**

---

**版本**: v1.0
**最后更新**: 2026-01-06
**维护者**: WellAlly Tech
