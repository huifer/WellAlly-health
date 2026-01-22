---
description: 记录运动、管理健身目标、生成运动处方和趋势分析
arguments:
  - name: action
    description: 操作类型：record(记录运动)/history(历史记录)/stats(统计)/goal(目标管理)/analysis(分析)/prescription(运动处方)/precautions(注意事项)
    required: true
  - name: info
    description: 详细信息（运动类型、时长、强度、距离等，自然语言描述）
    required: false
---

# 运动与健身管理命令

⚠️ **重要医学免责声明**
本系统提供的运动建议和分析仅供参考，不构成医疗建议或具体运动处方。
开始运动计划前，请咨询医生或运动专家。
如有不适，请立即停止运动并就医。

---

## 使用方法

### 记录运动

```bash
# 快速记录（自然语言）
/fitness record 跑步 30分钟
/fitness record 骑行 45分钟 中等强度
/fitness record 游泳 1小时 低强度
/fitness record 瑜伽 60分钟

# 详细记录
/fitness record running 30 minutes distance 5km pace 6min_per_km
/fitness record cycling 45 minutes moderate heart_rate 145 calories 400
/fitness record swimming 60 minutes low distance 1000m
/fitness record strength 45 胸部训练 bench_press 50kg 3x12

# 记录力量训练
/fitness record strength 60 upper_body bench_press 50kg 3x12 shoulder_press 20kg 3x10

# 记录球类运动
/fitness record basketball 90 minutes competitive
/fitness record 羽毛球 45分钟 中等强度
```

**支持的运动类型**：

**有氧运动**：
- 跑步（running/跑步）、快走（walking/快走）
- 骑行（cycling/骑行/自行车）、游泳（swimming/游泳）
- 跳绳（jump_rope/跳绳）、有氧操（aerobics/有氧操）
- 椭圆机（elliptical/椭圆机）、划船机（rowing/划船机）

**力量训练**：
- 自重训练（calisthenics/自重训练）
- 器械训练（machine_weights/器械训练）
- 自由重量（free_weights/自由重量）
- 弹力带（resistance_bands/弹力带）

**球类运动**：
- 篮球（basketball/篮球）、足球（soccer/足球）
- 羽毛球（badminton/羽毛球）、乒乓球（ping_pong/乒乓球）
- 网球（tennis/网球）、排球（volleyball/排球）

**其他运动**：
- 瑜伽（yoga/瑜伽）、普拉提（pilates/普拉提）
- 太极拳（tai_chi/太极拳）、舞蹈（dance/舞蹈）
- 登山（hiking/登山）、滑雪（skiing/滑雪）

**强度表示方法**：
- 描述性：low（低强度）、moderate（中等强度）、high（高强度）
- RPE量表：rpe 13（RPE 6-20量表，13=稍费力）
- 心率：heart_rate 145 或 hr 145（bpm）
- 自定义：easy、comfortable、challenging、hard

---

### 查看运动历史

```bash
# 查看最近记录
/fitness history
/fitness history 10                    # 最近10次

# 查看本周/本月
/fitness history week
/fitness history month

# 查看特定日期
/fitness history 2025-06-20
/fitness history today
/fitness history yesterday

# 查看日期范围
/fitness history 2025-06-01 to 2025-06-30
/fitness history last 7 days
```

---

### 运动统计分析

```bash
# 周统计
/fitness stats week
/fitness summary week

# 月统计
/fitness stats month
/fitness summary month

# 详细统计
/fitness stats                         # 综合统计
/fitness stats all                     # 所有统计数据

# 特定统计
/fitness stats duration                # 运动时长统计
/fitness stats calories                # 卡路里消耗统计
/fitness stats distance                # 距离统计
```

**输出内容**：
- 运动次数、总时长、总距离
- 消耗卡路里
- 运动频率（每周运动天数）
- 强度分布
- 运动类型分布
- 与上周/上月对比

---

### 健身目标管理

```bash
# 设定目标
/fitness goal 减重5公斤 2025-06-30
/fitness goal weight_loss 5kg 2025-06-30
/fitness goal 5公里跑 2025-08-15
/fitness goal 每周运动4天
/fitness goal workout_days 4

# 更新目标进度
/fitness goal progress 减重 0.5公斤
/fitness goal progress weight_loss 0.5kg

# 查看目标
/fitness goal list                     # 所有目标
/fitness goal active                   # 进行中目标
/fitness goal completed                # 已完成目标

# 查看特定目标
/fitness goal 减重
/fitness goal weight_loss

# 标记目标完成
/fitness goal complete 减重
/fitness goal delete 5公里跑           # 删除目标
```

**目标类型**：
- **减重目标**（weight_loss）：目标减重量、目标体重、目标体脂率
- **增肌目标**（muscle_gain）：目标增重量、目标肌肉量
- **耐力目标**（endurance）：5K/10K/半马/全马、骑行距离、游泳距离
- **健康目标**（health）：降低静息心率、降低血压、改善血糖
- **习惯养成**（habit）：每周运动天数、每天步数、连续运动天数

---

### 运动分析

```bash
# 趋势分析
/fitness analysis trend
/fitness trend                          # 运动趋势分析
/fitness trend 30days                   # 过去30天趋势
/fitness trend 3months                  # 过去3个月趋势

# 强度分析
/fitness analysis intensity
/fitness analysis distribution          # 强度分布分析

# 进步追踪
/fitness analysis progress
/fitness analysis progress running      # 跑步进步追踪
/fitness analysis progress strength     # 力量训练进步追踪

# 运动习惯分析
/fitness analysis habit                 # 运动习惯分析
/fitness analysis pattern               # 运动模式识别

# 相关性分析
/fitness analysis correlation weight     # 运动与体重相关性
/fitness analysis correlation blood_pressure    # 运动与血压相关性
/fitness analysis correlation blood_glucose     # 运动与血糖相关性

# 洞察与建议
/fitness insights                       # 运动洞察
/fitness recommendations                # 个性化建议
```

**分析维度**：
- **运动量趋势**：时长、距离、卡路里的变化趋势
- **运动频率**：每周运动天数、休息日分布
- **强度分布**：低/中/高强度占比
- **运动类型偏好**：常用运动类型
- **进步追踪**：配速提升、力量增加、耐力改善
- **相关性分析**：运动与体重、血压、血糖的关系

---

### 运动处方

⚠️ **参考建议级别声明**
以下运动建议基于 WHO、ACSM、AHA 等权威指南，仅供参考。
不构成具体运动处方，请咨询医生或运动专家获取个性化指导。

```bash
# 获取运动处方
/fitness prescription                   # 一般性运动处方
/fitness prescription beginner          # 新手运动处方
/fitness prescription intermediate       # 中级运动处方

# 基于健康状况的参考建议
/fitness prescription hypertension      # 高血压患者运动参考建议
/fitness prescription diabetes          # 糖尿病患者运动参考建议
/fitness prescription weight_loss       # 减重运动建议

# 查看注意事项
/fitness precautions                    # 运动注意事项
/fitness contra_indications             # 运动禁忌
```

**FITT原则**：
- **Frequency（频率）**：每周运动天数
- **Intensity（强度）**：目标心率区间、RPE、MET值
- **Time（时间）**：每次运动时长（热身+正式+放松）
- **Type（类型）**：有氧、力量、柔韧、平衡训练

---

## 数据结构

### 运动记录数据

```json
{
  "date": "2025-06-20",
  "time": "07:00",
  "type": "running",
  "duration_minutes": 30,
  "intensity": {
    "level": "moderate",
    "rpe": 13
  },
  "heart_rate": {
    "avg": 145,
    "max": 165,
    "min": 120
  },
  "distance_km": 5.0,
  "pace_min_per_km": "6:00",
  "calories_burned": 300,
  "how_felt": "good",
  "notes": "感觉很舒服，配速稳定"
}
```

### 健身目标数据

```json
{
  "goal_id": "goal_20250101",
  "category": "weight_loss",
  "title": "减重5公斤",
  "start_date": "2025-01-01",
  "target_date": "2025-06-30",
  "baseline_value": 75.0,
  "current_value": 70.5,
  "target_value": 70.0,
  "unit": "kg",
  "progress": 90,
  "status": "on_track"
}
```

---

## 医学安全原则

### ⚠️ 安全红线

1. **不给出具体运动处方**
   - 运动处方需医生或运动专家制定
   - 系统仅提供一般性建议

2. **不处理运动损伤**
   - 不诊断运动损伤
   - 损伤需就医

3. **不评估心血管风险**
   - 不评估运动风险
   - 运动前需医生评估

4. **不替代专业指导**
   - 复杂运动需专业教练指导
   - 系统仅提供记录和分析

### ✅ 系统能做到的

- 运动数据记录和分析
- 运动目标管理
- 运动趋势识别
- 一般性运动建议
- 基于健康状况的参考建议

### 运动安全提醒

- 运动前充分热身
- 运动后适当拉伸
- 逐渐增加运动量
- 注意身体信号
- 保持水分补充

### 特殊人群

- 慢性疾病患者运动需医生许可
- 孕妇运动需产科医生建议
- 老年人注意平衡和防跌倒
- 儿童运动需适合年龄

### 运动禁忌

- 发热、急性疾病期间不运动
- 空腹或饱餐后立即运动
- 酒精后不运动
- 极端天气户外运动需谨慎

---

## 参考资源

### 运动指南
- [WHO身体活动和久坐行为指南](https://www.who.int/publications/i/item/9789240015128)
- [美国身体活动指南](https://health.gov/paguidelines/)

### 运动处方
- [ACSM运动测试与处方指南](https://www.acsm.org/)
- [运动处方专业培训](https://www.acsm.org/certifications)

### 特殊人群运动
- [高血压患者运动指南](https://www.ahajournals.org/)
- [糖尿病患者运动指南](https://www.diabetes.org/)

---

## 减肥管理命令

**减肥安全声明**
本系统提供的减肥建议基于科学原理，不构成医疗处方。
极端减重、进食障碍请咨询医生。

### 身体成分记录

```bash
/fitness:weightloss-record weight 75.5
/fitness:weightloss-record body-fat 28.5%
/fitness:weightloss-record waist 92
```

### 身体成分分析

```bash
/fitness:weightloss-body              # 完整身体成分分析
/fitness:weightloss-trend weight      # 体重趋势
/fitness:weightloss-progress          # 减肥进度
```

### 代谢率计算

```bash
/fitness:weightloss-bmr               # 计算BMR
/fitness:weightloss-tdee              # 计算TDEE
/fitness:weightloss-activity moderate  # 设置活动水平
```

### 阶段管理

```bash
/fitness:weightloss-phase weight-loss     # 设置为减重期
/fitness:weightloss-phase plateau         # 标记平台期
/fitness:weightloss-maintenance start     # 进入维持期
```

---

**版本**: v1.0
**最后更新**: 2026-01-02
**维护者**: WellAlly Tech
