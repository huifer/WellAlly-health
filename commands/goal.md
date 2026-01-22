---
description: 设定健康目标、追踪进度、养成习惯、生成可视化报告
arguments:
  - name: action
    description: 操作类型：set(设定目标)/progress(更新进度)/habit(记录习惯)/review(查看目标)/report(生成报告)/achieve(查看成就)/complete(完成目标)/adjust(调整目标)
    required: true
  - name: info
    description: 详细信息（目标描述、习惯名称、进度值等，自然语言描述）
    required: false
---

# 健康目标与习惯管理命令

⚠️ **重要医学免责声明**

本系统提供的健康目标设定、进度追踪和习惯养成功能仅供参考,不构成医疗诊断、治疗或专业建议。

**本系统能够做到的**:
- ✅ 协助设定SMART原则的健康目标
- ✅ 追踪目标进度和习惯养成情况
- ✅ 提供动机管理和成就系统
- ✅ 生成可视化进度报告
- ✅ 识别健康行为模式
- ✅ 提供一般性健康改善建议

**本系统不能做的**:
- ❌ 诊断健康问题或疾病
- ❌ 提供医疗治疗建议或处方
- ❌ 替代医生、营养师或健身教练的专业建议
- ❌ 设定极端或不健康的减重/增重目标
- ❌ 处理进食障碍或强迫性运动行为

**何时需要咨询专业人士**:
- 🏥 设定减重/增重目标前,特别是BMI异常时
- 🏥 有慢性疾病(高血压、糖尿病、心脏病等)
- 🏥 准备开始新的运动计划
- 🏥 怀孕、哺乳期或有特殊健康状况
- 🏥 出现进食障碍或强迫性行为迹象
- 🏥 目标执行过程中出现身体不适

---

## 使用方法

### 设定健康目标

```bash
# 减重目标
/goal set weight-loss 5公斤 2025-06-30
/goal set 我想在6个月内减重5公斤

# 运动目标
/goal set exercise 每周运动4次 2025-12-31
/goal set exercise 每天30分钟有氧运动 6个月

# 饮食目标
/goal set diet 每天吃5份蔬果 持续坚持
/goal set diet 减少糖分摄入 2025-06-30

# 健康指标目标
/goal set health-metric 血压控制在120/80以下 2025-06-30
/goal set health-metric 空腹血糖降至5.6以下 3个月

# 睡眠目标
/goal set sleep 每晚睡眠8小时 持续坚持
```

**目标类型**:
- `weight-loss` - 减重目标
- `weight-gain` - 增重目标
- `exercise` - 运动目标
- `diet` - 饮食目标
- `sleep` - 睡眠目标
- `health-metric` - 健康指标目标(血压/血糖/血脂等)

**SMART原则验证**:
系统会自动验证目标是否符合SMART原则:
- **S**pecific(具体) - 目标清晰明确
- **M**easurable(可衡量) - 可量化进度
- **A**chievable(可实现) - 现实可行
- **R**elevant(相关) - 与健康相关
- **T**ime-bound(有时限) - 有明确期限

---

### 更新目标进度

```bash
# 更新减重进度
/goal progress 3.5公斤
/goal progress 我这周减了0.5公斤,总共减了3.5公斤

# 更新运动进度
/goal progress 本周运动了4次,总计120分钟
/goal progress 完成了本月运动目标的80%

# 更新饮食目标
/goal progress 今天吃了5份蔬果
/goal progress 本周有6天达到了低糖饮食目标

# 更新健康指标
/goal progress 血压降至125/82
/goal progress 空腹血糖6.1,比之前下降了0.5

# 更新睡眠目标
/goal progress 昨晚睡了7.5小时
```

**进度更新包含**:
- 当前数值
- 完成百分比
- 预计完成时间
- 与目标的差距
- 趋势分析

---

### 记录习惯

```bash
# 记录习惯完成
/goal habit morning-stretch 完成
/goal habit 早上拉伸做了,感觉很好

# 设定新习惯
/goal habit set 每天早上7点拉伸10分钟
/goal habit set 每餐前喝一杯水
/goal habit set 睡前30分钟不看手机

# 习惯堆叠
/goal habit stack 早上刷牙后做5个深蹲
/goal habit stack 午餐后散步10分钟

# 查看习惯连续天数
/goal habit review morning-stretch
/goal habit 查看所有习惯
```

**习惯类型**:
- 日常习惯(每天执行)
- 每周习惯(每周X次)
- 触发型习惯(在特定行为后执行)

**习惯追踪功能**:
- 连续天数统计
- 完成率计算
- 习惯强度评估
- 习惯堆叠建议

---

### 查看目标和进度

```bash
# 查看所有目标
/goal review

# 查看特定目标
/goal review weight-loss
/goal review 运动目标

# 查看目标详情
/goal review goal_20250101

# 查看进度预测
/goal review predict weight-loss
```

**输出包含**:
- 活跃目标列表
- 每个目标的进度条
- 完成百分比
- 预计完成日期
- 障碍和建议

---

### 生成可视化报告

```bash
# 生成进度趋势报告
/goal report progress-trend
/goal report 进度趋势

# 生成习惯热图报告
/goal report habit-heatmap
/goal report 习惯热图

# 生成多目标对比报告
/goal report multi-goal
/goal report 全部目标对比

# 生成动机趋势报告
/goal report motivation-trend
/goal report 动机趋势

# 生成综合报告
/goal report comprehensive
/goal report 综合报告
```

**报告类型**:
- `progress-trend` - 进度趋势图(折线图)
- `habit-heatmap` - 习惯热图(日历热图)
- `multi-goal` - 多目标对比(环形图)
- `motivation-trend` - 动机趋势(折线图)
- `comprehensive` - 综合报告(所有图表)

**报告格式**:
- HTML文件,包含ECharts交互式图表
- 支持深色/浅色主题切换
- 可导出PDF
- 响应式设计,支持移动端查看

---

### 查看成就系统

```bash
# 查看所有成就
/goal achieve

# 查看已解锁成就
/goal achieve unlocked

# 查看未解锁成就
/goal achieve locked

# 查看成就进度
/goal achieve progress
```

**基础成就列表**:
- 🏆 **首次目标** - 完成第一个健康目标
- 🔥 **连续7天** - 任意习惯连续7天打卡
- 💪 **连续21天** - 任意习惯连续21天打卡
- ⭐ **连续30天** - 任意习惯连续30天打卡
- 🎯 **半程达成** - 任意目标完成50%
- 🎉 **目标达成** - 完成一个健康目标
- ⚡ **提前完成** - 提前完成目标
- 📈 **超额完成** - 超额完成目标

---

### 完成目标

```bash
# 标记目标为完成
/goal complete goal_20250101
/goal complete 减重5公斤

# 归档目标
/goal complete goal_20250101 archive
```

**完成后会**:
- 将目标移至已完成列表
- 解锁相关成就
- 生成完成总结报告
- 询问是否设定新目标

---

### 调整目标

```bash
# 修改目标数值
/goal adjust weight-loss 6公斤

# 延长目标期限
/goal adjust deadline 2025-08-31

# 修改行动计划
/goal adjust action-plan 每周运动5次,减少500卡路里

# 暂停目标
/goal adjust pause

# 恢复目标
/goal adjust resume
```

---

## 自然语言示例

```bash
# 目标设定
"我想在半年内减重8公斤"
"我想养成每天运动的习惯,每周至少4次,每次30分钟"
"我希望在3个月内把血压降到正常范围"
"我想改善睡眠,每晚睡够8小时"

# 进度更新
"我这周表现不错,减了0.8公斤"
"今天运动了45分钟,感觉很好"
"今晚睡了7.5小时,比昨晚好"
"连续21天完成早操了!"

# 习惯记录
"我今天完成了晨练习惯"
"第15天完成每天喝水8杯的习惯"
"早餐后散步10分钟,感觉很棒"
```

---

## 数据关联功能

```bash
# 关联营养数据
/goal关联 analyze weight-loss --with nutrition

# 关联运动数据
/goal关联 analyze exercise --with fitness

# 关联睡眠数据
/goal关联 analyze sleep --with sleep-tracker

# 多数据源关联
/goal关联 analyze weight-loss --with nutrition --with fitness --with sleep
```

**支持的关联数据**:
- 营养数据(`nutrition-tracker.json`)
- 运动数据(`fitness-tracker.json`)
- 睡眠数据(`sleep-tracker.json`)
- 血压数据(`hypertension-tracker.json`)
- 体重数据(健康日志)

---

## 使用技巧

### 目标设定技巧
1. **从小目标开始** - 先设定容易达成的小目标,建立信心
2. **设定3-5个目标** - 不要同时追求太多目标
3. **定期回顾** - 每周查看进度,必要时调整
4. **奖励自己** - 达成里程碑时给予适当奖励

### 习惯养成技巧
1. **触发-行动-奖励** - 设定明确的触发条件和奖励
2. **习惯堆叠** - 在现有习惯后添加新习惯
3. **从小习惯开始** - 从2分钟版本开始,逐步增加
4. **从不中断两次** - 偶尔错过没关系,但不要连续错过

### 动机管理技巧
1. **记录动机评分** - 每周评估动机水平(1-10分)
2. **回顾进步** - 查看已完成目标,增强信心
3. **寻找支持** - 与朋友分享目标,互相鼓励
4. **调整期望** - 目标太难时,适当调整

---

## 常见问题

**Q: 如何设定合理的目标?**
A: 使用SMART原则,确保目标具体、可衡量、可实现、相关且有时限。建议从小目标开始,逐步提升。

**Q: 目标无法完成怎么办?**
A: 可以使用`/goal adjust`命令调整目标数值或延长期限。重要的是持续努力,而非完美。

**Q: 如何建立长期习惯?**
A: 从小习惯开始(2分钟版本),设定明确触发条件,使用习惯堆叠技术,并记录连续天数。

**Q: 成就系统有什么作用?**
A: 成就系统提供正向反馈,增强动机,帮助您坚持健康行为。

**Q: 可视化报告如何使用?**
A: 使用`/goal report`命令生成HTML报告,在浏览器中打开查看交互式图表,追踪进度趋势。

---

## 示例工作流程

```bash
# 第1天: 设定目标
/goal set weight-loss 5公斤 2025-06-30
/goal habit set 每天早上7点拉伸10分钟

# 第1-30天: 每日更新
/goal progress 减了0.5公斤
/goal habit morning-stretch 完成

# 每周: 查看进度
/goal review
/goal report progress-trend

# 第60天: 达成里程碑
/goal progress 减了2.5公斤,完成50%!
# 自动解锁成就: 🎯 半程达成

# 第90天: 习惯养成
/goal habit morning-stretch 完成
# 连续30天!解锁成就: ⭐ 连续30天

# 第180天: 目标完成
/goal complete goal_20250101
# 解锁成就: 🎉 目标达成
# 生成完成总结报告

# 设定新目标
/goal set exercise 每周运动5次 2025-12-31
```

---

**开始您的健康目标之旅吧!** 🎯
