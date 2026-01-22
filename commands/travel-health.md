---
description: 管理旅行健康数据、规划旅行健康准备、评估目的地健康风险、管理疫苗接种和旅行药箱
arguments:
  - name: action
    description: 操作类型:plan(规划旅行)/vaccine(疫苗记录)/kit(药箱管理)/medication(用药管理)/insurance(保险信息)/emergency(紧急联系人)/status(准备状态)/risk(风险评估)/check(健康检查)/card(紧急卡片)/alert(疫情预警)
    required: true
  - name: info
    description: 详细信息(目的地、日期、自然语言描述等)
    required: false
---

# 旅行健康管理命令

## 🚨 重要免责声明

**本系统提供的所有健康建议和信息仅供参考,不能替代专业医疗建议。**

- ⚠️ **请务必在旅行前4-6周咨询专业医生或旅行医学门诊**
- ⚠️ **疫苗接种和用药方案必须由医生根据个人健康状况制定**
- ⚠️ **本系统不提供具体的医疗处方或诊断**
- ⚠️ **目的地健康风险数据来源于WHO/CDC,可能存在滞后性**
- ⚠️ **紧急情况下请立即联系当地急救服务或就医**

## 数据来源

- **世界卫生组织(WHO)**: https://www.who.int/ith
- **美国疾控中心(CDC)**: https://www.cdc.gov/travel
- **当地卫生部门**: 目的地国家卫生部官方数据

---

## 命令使用说明

### 1. 旅行规划 (/travel plan)

规划新旅行的健康准备,包括风险评估和疫苗建议。

**用法示例**:
```bash
/travel plan Southeast Asia 2025-08-01 to 2025-08-15
/travel plan Thailand Vietnam Cambodia 2025-08-01 for 14 days tourism
/travel plan Japan 2025-10-01 business
```

---

### 2. 疫苗管理 (/travel vaccine)

管理疫苗接种记录和接种计划。

**用法示例**:
```bash
/travel vaccine list
/travel vaccine add hepatitis-a
/travel vaccine update hepatitis-a completed 2025-06-15
/travel vaccine schedule
```

---

### 3. 旅行药箱 (/travel kit)

管理旅行药箱物品清单。

**用法示例**:
```bash
/travel kit list
/travel kit add antidiarrheal antibacterial
/travel kit remove sunscreen
/travel kit check
```

---

### 4. 用药管理 (/travel medication)

管理旅行期间用药计划和药物相互作用检查。

**用法示例**:
```bash
/travel medication add doxycycline 100mg daily for malaria prophylaxis start 2025-07-28
/travel medication check-interactions
/travel medication schedule
/travel medication list
```

---

### 5. 保险信息 (/travel insurance)

管理旅行保险信息。

**用法示例**:
```bash
/travel insurance add policy123 $100000 covers medical evacuation
/travel insurance list
/travel insurance check policy123
```

---

### 6. 紧急联系人 (/travel emergency)

管理旅行紧急联系人信息。

**用法示例**:
```bash
/travel emergency add spouse +86-138-xxxx-xxxx
/travel emergency add doctor Dr. Zhang +86-10-xxxx-xxxx
/travel emergency list
```

---

### 7. 准备状态 (/travel status)

查看旅行健康准备的整体状态。

**用法示例**:
```bash
/travel status
/travel status trip_20250801_seasia
```

---

### 8. 风险评估 (/travel risk)

对目的地进行专业级健康风险评估(基于WHO/CDC数据)。

**用法示例**:
```bash
/travel risk Thailand
/travel risk Africa malaria
/travel risk outbreak
```

**风险等级**:
- 🟢 低风险 - 常规预防措施
- 🟡 中等风险 - 需要特别注意
- 🔴 高风险 - 需要采取严格预防措施
- ⚫ 极高风险 - 建议推迟旅行或采取特殊防护

---

### 9. 健康检查 (/travel check)

旅行前或旅行后健康检查。

**用法示例**:
```bash
/travel check pre-trip
/travel check post-trip
/travel check symptoms fever diarrhea
```

---

### 10. 紧急卡片 (/travel card)

生成多语言紧急医疗信息卡片。

**用法示例**:
```bash
/travel card generate en zh th ja
/travel card qrcode
/travel card download pdf
/travel card list
```

**支持语言**: en, zh, ja, ko, fr, es, th, vi

---

### 11. 疫情预警 (/travel alert)

订阅和管理目的地疫情预警。

**用法示例**:
```bash
/travel alert subscribe Thailand
/travel alert list
/travel alert check
```

---

## 数据存储

- **示例数据**: `data-example/travel-health-tracker.json`
- **实际数据**: `data/travel-health-tracker.json`
- **健康日志**: `data/travel-health-logs/`

---

## 旅行前准备时间表

**出发前6-8周**: 规划旅行健康、咨询医生、开始疫苗接种
**出发前4-6周**: 完成疫苗接种、准备旅行药箱
**出发前2-4周**: 购买保险、设置紧急联系人、生成紧急卡片
**出发前1周**: 最终健康检查、确认所有准备就绪

---

**版本**: v1.0.0
**最后更新**: 2025-01-08
**维护者**: WellAlly Tech
