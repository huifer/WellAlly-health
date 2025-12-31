# 女性健康模块跨模块集成说明

## 概述

女性健康模块包含3个子模块，需要与现有的PHIS系统其他模块进行深度集成。

## 集成点

### 1. 与 /symptom 命令集成

**目的**：孕期/更年期症状自动同步到症状记录系统

**实现方式**：

当用户使用 `/pregnancy symptom` 或 `/menopause symptom` 时，系统自动：

1. 在 `data/症状记录/` 中创建症状记录
2. 添加 `womens_health_context` 字段关联女性健康模块

**数据格式：**
```json
{
  "id": "symptom_20250320001",
  "symptom_type": "孕吐",
  "description": "恶心呕吐，中度",
  "severity": "moderate",
  "date": "2025-03-20",
  "womens_health_context": {
    "related": true,
    "module": "pregnancy",
    "pregnancy_id": "pregnancy_20250101",
    "gestational_week": 12,
    "trimester": "first"
  }
}
```

**更年期示例：**
```json
{
  "id": "symptom_20251201001",
  "symptom_type": "潮热",
  "description": "每天5-10次，中度",
  "severity": "moderate",
  "date": "2025-12-01",
  "womens_health_context": {
    "related": true,
    "module": "menopause",
    "menopause_id": "menopause_20250101",
    "stage": "perimenopausal"
  }
}
```

---

### 2. 与 /medication 命令集成

**目的**：孕期药物安全自动检查

**实现方式**：

当用户使用 `/medication add` 时，系统自动：

1. 检查 `data/pregnancy-tracker.json` 是否有活跃孕期
2. 查询药物妊娠分级（A/B/C/D/X）
3. 显示相应的孕期安全警示

**检查流程：**
```javascript
// 伪代码
function checkPregnancySafety(drugName) {
  // 1. 检查孕期状态
  const pregnancy = loadPregnancy('data/pregnancy-tracker.json');

  if (!pregnancy.current_pregnancy) {
    return { is_pregnant: false };
  }

  // 2. 查询药物妊娠分级
  const category = getDrugPregnancyCategory(drugName);

  // 3. 根据分级显示警示
  if (category === 'X') {
    showXClassWarning(drugName);
    return { allow: false };
  }

  if (category === 'D') {
    showDClassWarning(drugName);
    return { allow: 'with_confirmation' };
  }

  // ... 其他分级
}
```

**药物数据库扩展：**

需要在 `data/interactions/interaction-db.json` 中添加：

```json
{
  "drug_name": "异维A酸",
  "pregnancy_category": "X",
  "pregnancy_risk": "severe_birth_defects",
  "pregnancy_recommendation": "contraindicated"
}
```

---

### 3. 与 /specialist gynecology 集成

**目的**：女性健康问题可触发妇科专家咨询

**实现方式**：

当用户使用 `/consult` 或 `/specialist gynecology` 时，系统自动：

1. 检查女性健康模块数据
2. 将相关数据传递给妇科专家
3. 专家分析时考虑女性健康背景

**数据传递格式：**
```json
{
  "consultation_type": "gynecology",
  "user_context": {
    "pregnancy": {
      "is_pregnant": true,
      "gestational_week": 12,
      "trimester": "first",
      "due_date": "2025-10-08",
      "current_symptoms": ["孕吐", "乏力"],
      "recent_checkups": [...]
    },
    "menopause": {
      "tracking": false
    },
    "screening": {
      "last_hpv": "2025-01-15",
      "hpv_result": "negative",
      "last_tct": "2025-01-15",
      "tct_result": "NILM"
    }
  },
  "consultation_reason": "用户询问孕期相关问题"
}
```

**妇科专家响应：**

妇科专家会根据女性健康背景提供针对性建议：
- 孕期问题：基于孕周、症状、产检结果
- 更年期问题：基于症状评分、HRT状态、骨密度
- 筛查问题：基于HPV/TCT结果、肿瘤标志物

---

### 4. 与 /report 命令集成

**目的**：健康报告中包含女性健康章节

**实现方式**：

当用户使用 `/report` 生成综合健康报告时，自动包含：

1. **孕期状态章节**（如果活跃孕期）
   - 孕期进度图表
   - 产检完成情况
   - 体重增长曲线
   - 症状趋势
   - 下次产检提醒

2. **更年期状态章节**（如果追踪中）
   - 症状评分趋势图
   - HRT治疗效果
   - 骨密度变化趋势
   - 心血管风险评估

3. **癌症筛查章节**
   - HPV/TCT筛查历史
   - 肿瘤标志物趋势图
   - 下次筛查提醒

**报告HTML结构：**
```html
<section id="womens-health">
  <h2>女性健康</h2>

  <!-- 孕期部分 -->
  <div id="pregnancy-section">
    <h3>孕期管理</h3>
    <!-- 孕期进度图表 -->
    <!-- 产检时间线 -->
    <!-- 体重曲线 -->
  </div>

  <!-- 更年期部分 -->
  <div id="menopause-section">
    <h3>更年期管理</h3>
    <!-- 症状评分图表 -->
    <!-- 骨密度趋势 -->
  </div>

  <!-- 癌症筛查部分 -->
  <div id="screening-section">
    <h3>癌症筛查</h3>
    <!-- 筛查历史表格 -->
    <!-- 肿瘤标志物趋势 -->
  </div>
</section>
```

---

### 5. 与 /cycle 命令集成

**目的**：孕期结束后与月经周期追踪衔接

**实现方式**：

1. **孕期结束时**（分娩或终止妊娠）：
   - 标记孕期完成
   - 提示用户可开始使用 `/cycle` 记录产后月经

2. **产后记录**：
   - 分娩后6-8周开始恢复月经
   - 使用 `/cycle start` 开始记录新周期
   - 孕期ID关联到周期历史

**数据关联：**
```json
{
  "pregnancy_id": "pregnancy_20250101",
  "delivery_date": "2025-10-01",
  "delivery_outcome": "full_term",
  "postpartum_cycle_start": "2025-11-20",
  "linked_cycle_id": "cycle_20251120"
}
```

---

## 数据流图

```
/pregnancy symptom
      ↓
data/pregnancy-tracker.json (更新)
      ↓
自动创建 → data/症状记录/YYYY-MM/YYYY-MM-DD_孕吐.json
      ↓
添加 womens_health_context 字段

/medication add 阿司匹林
      ↓
检查 → data/pregnancy-tracker.json
      ↓
检测到孕期
      ↓
查询药物妊娠分级
      ↓
显示孕期安全警示

/pregnancy status
      ↓
读取 → data/pregnancy-tracker.json
      ↓
读取 → data/profile.json (体重、BMI)
      ↓
生成孕期状态报告

/specialist gynecology
      ↓
读取 → data/pregnancy-tracker.json
      ↓
读取 → data/menopause-tracker.json
      ↓
读取 → data/screening-tracker.json
      ↓
传递上下文给妇科专家
      ↓
专家基于女性健康背景分析
```

---

## API接口规范

### checkPregnancyStatus()

**功能**：检查用户是否处于孕期

**输入**：无

**输出**：
```json
{
  "is_pregnant": true,
  "pregnancy_id": "pregnancy_20250101",
  "gestational_week": 12,
  "trimester": "first",
  "due_date": "2025-10-08"
}
```

### getDrugPregnancyCategory(drugName)

**功能**：查询药物妊娠分级

**输入**：drugName (string)

**输出**：
```json
{
  "drug_name": "阿司匹林",
  "pregnancy_category": "C",
  "risk_level": "moderate",
  "recommendation": "use_with_caution",
  "trimester_concerns": ["third"],
  "safe_alternatives": ["对乙酰氨基酚"]
}
```

### syncSymptomToWomenHealthModule(symptomData)

**功能**：将症状同步到女性健康模块

**输入**：symptomData (object)

**输出**：
```json
{
  "synced": true,
  "pregnancy_updated": true,
  "menopause_updated": false,
  "record_id": "symptom_20250320001"
}
```

---

## 集成测试场景

### 场景1：孕期药物安全检查

**步骤**：
1. 用户使用 `/pregnancy start 2025-01-01` 开始孕期记录
2. 用户使用 `/medication add 异维A酸 10mg 每天1次`
3. 系统检测到孕期（12周）
4. 系统查询到异维A酸为X类
5. 系统显示X类药物警示
6. 用户选择"取消添加"

**预期结果**：
- ✅ 孕期状态正确识别
- ✅ 药物分级正确查询
- ✅ 警示信息正确显示
- ✅ 药物未被添加

### 场景2：症状同步

**步骤**：
1. 用户使用 `/pregnancy symptom nausea moderate`
2. 系统在 pregnancy-tracker.json 中记录症状
3. 系统自动在 `data/症状记录/` 中创建记录
4. 系统添加 womens_health_context 字段

**预期结果**：
- ✅ 症状在孕期模块中记录
- ✅ 症状在症状模块中同步
- ✅ 上下文信息正确关联

### 场景3：妇科专家咨询

**步骤**：
1. 用户处于孕期（12周）
2. 用户使用 `/specialist gynecology 孕期可以吃布洛芬吗？`
3. 系统读取孕期数据
4. 系统将孕期上下文传递给妇科专家
5. 专家基于孕周提供针对性建议

**预期结果**：
- ✅ 孕期数据正确传递
- ✅ 专家建议考虑孕周因素
- ✅ 建议包含孕周特定的注意事项

---

## 医学安全边界

**所有集成必须遵守以下原则**：

1. **不替代医生诊断**
   - 所有分析仅供参考
   - 诊断需由专业医生进行
   - 每个输出都包含免责声明

2. **不给出具体用药剂量**
   - 药物安全检查仅供参考
   - 不建议具体剂量
   - 用药需咨询医生

3. **不预测妊娠结局**
   - 不评估胎儿健康
   - 不预测流产/早产风险
   - 产检结果仅供参考

4. **及时就医提醒**
   - 异常情况提醒就医
   - 紧急症状立即就医
   - 重大发现警示用户

---

## 更新日志

**2025-12-31**：
- 创建3个女性健康命令文件
- 创建3个数据追踪文件
- 添加孕期药物安全集成到medication.md
- 更新index.json添加女性健康字段
- 完成跨模块集成文档

---

## 维护者注释

所有女性健康模块遵循PHIS的核心原则：
- 数据本地存储，保护隐私
- 医学安全第一，不替代专业医疗
- 模块化设计，便于维护扩展
- 参考现有命令模式，保持一致性
