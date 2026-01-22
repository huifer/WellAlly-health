---
description: 管理慢阻肺（COPD）肺功能监测、症状评估和急性加重记录
arguments:
  - name: action
    description: 操作类型：fev1(肺功能)/cat(CAT评分)/mmrc(mMRC评分)/symptom(症状记录)/exacerbation(急性加重)/medication(用药管理)/vaccine(疫苗接种)/status(控制状态)/assessment(GOLD分组)
    required: true
  - name: info
    description: 详细信息（FEV1值、CAT评分、症状描述等，自然语言描述）
    required: false
---

# 慢阻肺（COPD）管理

慢性阻塞性肺疾病（COPD）的长期管理，包括肺功能监测、症状评估和急性加重预防。

## ⚠️ 医学安全声明

**重要提示：本系统仅供健康监测记录，不能替代专业医疗诊断和治疗。**

- ❌ 不给出具体用药剂量调整建议
- ❌ 不直接开具处方药或推荐具体药物
- ❌ 不替代医生诊断和治疗决策
- ❌ 不判断疾病预后或肺功能下降速度
- ✅ 提供肺功能监测记录和趋势分析（仅供参考）
- ✅ 提供症状评分和评估（CAT、mMRC）
- ✅ 提供急性加重记录和诱因追踪
- ✅ 提供用药提醒和疫苗接种提醒
- ✅ 提供生活方式建议和就医提醒

所有用药方案和治疗决策请遵从医生指导。

## 操作类型

### 1. 记录肺功能 - `fev1`

记录肺功能检查结果。

**参数说明：**
- `info`: 肺功能信息（必填），使用自然语言描述

**示例：**
```
/copd fev1 1.8 65%
/copd lung-function fvc 3.2 ratio 0.56
/copd fev1 2.1 70% fvc 3.5 ratio 0.60
/copd lung-function 2025-06-15 fev1 1.8 predicted 65%
```

**支持的指标：**
- **fev1**：第一秒用力呼气容积（L）
- **predicted**：FEV1占预计值百分比（%）
- **fvc**：用力肺活量（L）
- **ratio**：FEV1/FVC比值

**COPD诊断标准：**
- FEV1/FVC < 0.70（使用支气管舒张剂后）
- 提示存在气流受限

**GOLD分级（基于FEV1占预计值%）：**
| 分级 | FEV1占预计值% | 严重程度 |
|------|-------------|---------|
| 1级 | ≥80% | 轻度 |
| 2级 | 50-79% | 中度 |
| 3级 | 30-49% | 重度 |
| 4级 | <30% | 极重度 |

### 2. CAT评分 - `cat`

进行慢阻肺评估测试（COPD Assessment Test）。

**示例：**
```
/copd cat
/copd cat score 18
/copd cat 2025-06-20 cough 2 sputum 2 chest_tightness 2 breathlessness 3 activity 2 confidence 2 sleep 3 energy 2
```

**CAT评分项目（每项0-5分）：**
1. **cough**：咳嗽
2. **sputum**：咳痰
3. **chest_tightness**：胸闷
4. **breathlessness_climbing**：爬坡/上楼气短
5. **activity_limitation**：家务活动受限
6. **confidence_outdoors**：户外活动信心
7. **sleep**：睡眠质量
8. **energy**：精力状态

**CAT评分解读：**
| 总分 | 影响 | 分级 |
|------|------|------|
| 0-10分 | 轻度影响 | 低 |
| 11-20分 | 中度影响 | 中 |
| 21-30分 | 重度影响 | 高 |
| 31-40分 | 极重度影响 | 极高 |

### 3. mMRC评分 - `mmrc`

进行改良英国医学研究理事会呼吸困难量表评分。

**示例：**
```
/copd mmrc 0
/copd mmrc 2
/copd mmrc 2025-06-20 grade 2
```

**mMRC分级（0-4级）：**
| 分级 | 描述 |
|------|------|
| 0级 | 剧烈运动时才感到气短 |
| 1级 | 平地快走或爬缓坡时气短 |
| 2级 | 因气短比同龄人走得慢或平地行走时需停下喘气 |
| 3级 | 平地行走100米或数分钟后需停下喘气 |
| 4级 | 严重气短，不能离开家或穿衣时气短 |

**mMRC严重程度：**
- 0-1级：轻度呼吸困难
- 2级：中度呼吸困难
- 3-4级：重度呼吸困难

### 4. 记录症状 - `symptom`

记录COPD相关症状。

**示例：**
```
/copd symptom dyspnea moderate
/copd symptom sputum white moderate
/copd symptom wheeze exertion
/copd symptom cough daily productive
/copd symptom dyspnea severe mrc 3
```

**支持的症状记录：**

#### 呼吸困难 - `dyspnea`
```
/copd symptom dyspnea mild
/copd symptom dyspnea moderate
/copd symptom dyspnea severe
/copd symptom dyspnea mrc 2
```

#### 咳嗽 - `cough`
```
/copd symptom cough daily
/copd symptom cough weekly productive
/copd symptom cough dry
```

#### 咳痰 - `sputum`
```
/copd symptom sputum white moderate
/copd symptom sputum yellow scanty
/copd symptom sputum purulent abundant
```

**痰液颜色分类：**
- white：白色
- clear：透明
- yellow：黄色
- green：绿色
- purulent：脓性

**痰液量：**
- scanty：少量
- moderate：中量
- abundant：大量

#### 喘息 - `wheeze`
```
/copd symptom wheeze exertion
/copd symptom wheeze constant
/copd symptom wheeze none
```

### 5. 记录急性加重 - `exacerbation`

记录COPD急性加重事件。

**示例：**
```
/copd exacerbation moderate
/copd exacerbation severe hospitalized
/copd exacerbation trigger infection recovery 10 days
/copd exacerbation 2025-02-15 moderate viral_infection
/copd exacerbation history
```

**急性加重严重程度：**
- **mild**（轻度）：在家处理，增加速效支气管舒张剂
- **moderate**（中度）：需口服激素和/或抗生素
- **severe**（重度）：需住院治疗或急诊就诊

**常见诱因：**
- viral_infection：病毒感染
- bacterial_infection：细菌感染
- air_pollution：空气污染
- weather_change：气温变化
- non_adherence：用药依从性差

**急性加重症状：**
- increased_dyspnea：呼吸困难加重
- increased_sputum：痰量增加
- purulent_sputum：痰液变脓
- wheezing：喘息加重

**恢复情况：**
```
/copd exacerbation recovery 10 days
/copd exacerbation resolved
/copd exacerbation ongoing 5 days
```

### 6. 用药管理 - `medication`

管理COPD相关用药（集成药物管理系统）。

**示例：**
```
/copd medication add 噻托溴铵 18μg 每天1次 handihaler
/copd medication add 沙丁胺醇 100μg 按需吸入
/copd medication list
/copd medication adherence
```

**常用COPD药物类型：**
- **LAMA**：长效抗胆碱能药物（如：噻托溴铵）
- **LABA**：长效β2受体激动剂（如：沙美特罗）
- **ICS**：吸入糖皮质激素（如：布地奈德）
- **SABA**：速效β2受体激动剂（如：沙丁胺醇）
- **SAMA**：速效抗胆碱能药物（如：异丙托溴铵）

**执行流程：**
1. 解析药物信息和装置类型
2. 调用 `/medication add` 命令添加药物
3. 在 copd-tracker.json 中添加引用记录
4. 输出确认信息和用药指导

### 7. 疫苗接种记录 - `vaccine`

记录流感疫苗和肺炎疫苗接种。

**示例：**
```
/copd vaccine flu 2025-10-15
/copd vaccine pneumococcal ppsv23 2024-05-10
/copd vaccine pneumococcal pcv13 2023-03-20
/copd vaccine status
```

**疫苗建议：**

#### 流感疫苗
- **每年接种**：流感季节前（9-11月）
- **剂量**：标准剂量或高剂量（≥65岁）
- **下次接种**：每年一次

#### 肺炎球菌疫苗
- **PCV13**（13价结合疫苗）：推荐所有COPD患者
- **PPSV23**（23价多糖疫苗）：推荐所有COPD患者
- **接种顺序**：先PCV13，8周后PPSV23
- **复种**：PPSV23可在5年后复种（65岁以下或高危人群）

### 8. 查看控制状态 - `status`

查看COPD综合控制状态。

**示例：**
```
/copd status
```

**输出内容：**
- GOLD分级
- 症状评分（CAT、mMRC）
- 肺功能状态
- 急性加重频率
- 用药情况
- 疫苗接种状态
- 控制评价

### 9. GOLD分组评估 - `assessment`

进行GOLD综合评估分组（ABCD分组）。

**示例：**
```
/copd assessment
```

**GOLD分组标准：**

| 分组 | CAT评分 | mMRC评分 | 年急性加重次数 |
|------|---------|----------|---------------|
| A组 | <10 | 0-1 | 0-1 |
| B组 | ≥10 | ≥2 | 0-1 |
| C组 | <10 | 0-1 | ≥2 |
| D组 | ≥10 | ≥2 | ≥2 |

**分组治疗建议：**
- **A组**：按需使用短效支气管舒张剂
- **B组**：长效支气管舒张剂（LAMA或LABA）
- **C组**：长效支气管舒张剂（LAMA或LABA+LAMA）
- **D组**：LAMA+LABA±ICS（根据嗜酸粒细胞水平）

## 数据结构

### 肺功能结构
```json
{
  "date": "2025-06-10",
  "post_bronchodilator": {
    "fev1": 1.8,
    "fev1_percent_predicted": 65,
    "fvc": 3.2,
    "fev1_fvc_ratio": 0.56
  },
  "interpretation": "中度气流受限"
}
```

### CAT评分结构
```json
{
  "date": "2025-06-20",
  "total_score": 18,
  "max_score": 40,
  "interpretation": "中度症状影响",
  "items": {
    "cough": 2,
    "sputum": 2,
    "chest_tightness": 2,
    "breathlessness_climbing": 3,
    "activity_limitation": 2,
    "confidence_outdoors": 2,
    "sleep": 3,
    "energy": 2
  }
}
```

### 急性加重结构
```json
{
  "id": "exace_20250215000000001",
  "date": "2025-02-15",
  "severity": "moderate",
  "triggers": ["viral_infection"],
  "symptoms": ["increased_dyspnea", "purulent_sputum"],
  "treatment": ["antibiotics", "prednisone"],
  "hospitalized": false,
  "recovery_days": 10,
  "created_at": "2025-02-15T00:00:00.000Z"
}
```

## GOLD综合评估工具

### 第一步：肺功能评估（GOLD 1-4级）
基于FEV1占预计值百分比确定气流受限严重程度。

### 第二步：症状评估
- **CAT评分**：≥10分为症状多
- **mMRC评分**：≥2分为症状多

### 第三步：风险评估
- **低风险**：0-1次急性加重/年（未住院）
- **高风险**：≥2次急性加重/年或≥1次住院

### 第四步：ABCD分组
结合症状评估和风险评估确定分组。

## 肺康复训练

### 呼吸训练
- **缩唇呼吸**：闭嘴经鼻吸气，缩唇如吹口哨样缓慢呼气
- **腹式呼吸**：吸气时腹部隆起，呼气时腹部内收
- **频率**：每天2-3次，每次10-15分钟

### 运动训练
- **有氧运动**：步行、骑车、游泳（每周3-5次，每次30分钟）
- **力量训练**：上下肢肌力训练（每周2-3次）
- **强度**：中等强度（能够交谈但不唱歌）

### 日常活动
- 节省体力技巧
- 能量管理策略
- 辅助设备使用

## 生活方式建议

### 戒烟（最重要）
- **立即戒烟**：这是延缓肺功能下降最有效的干预
- **戒烟支持**：咨询、尼古丁替代疗法、药物
- **避免二手烟**：远离吸烟环境

### 营养支持
- **维持理想体重**：BMI 21-25 kg/m²
- **营养不良**：增加热量和蛋白质摄入
- **肥胖**：减重5-10%

### 运动锻炼
- **规律运动**：每周3-5次，每次30分钟
- **类型**：步行、骑车、游泳
- **肺康复**：参加肺康复训练项目

### 环境控制
- **避免空气污染**：雾霾天减少外出
- **避免刺激性气体**：烟雾、粉尘、化学气体
- **室内空气**：保持通风，使用空气净化器

### 预防感染
- **勤洗手**：用肥皂和水洗手20秒
- **戴口罩**：人群密集处佩戴口罩
- **避免接触**：远离感冒和流感患者
- **接种疫苗**：每年流感疫苗+肺炎疫苗

## 用药指导

### 吸入装置使用技巧

#### 定量吸入器（MDI）
1. 取下盖子，摇匀吸入器
2. 呼气至残气量（不要对着吸入器）
3. 将吸入器口端放入嘴中，嘴唇包紧
4. 开始缓慢深吸气的同时，按压吸入器
5. 继续深吸气至肺总量
6. 屏气10秒
7. 缓慢呼气
8. 如需第二喷，等待1分钟后重复

#### 干粉吸入器（DPI）
1. 打开吸入器并装载药物
2. 呼气至残气量（不要对着吸入器）
3. 将吸嘴放入嘴中，嘴唇包紧
4. 用力快速深吸气
5. 屏气10秒
6. 缓慢呼气
7. 用清水漱口（如含激素）

### 雾化器使用
1. 按照医生处方准备药物
2. 将药物倒入雾化杯
3. 连接雾化器和电源
4. 使用面罩或口含管
5. 打开电源，进行雾化吸入（10-15分钟）
6. 雾化结束后清洁面罩和雾化杯

## 就医建议

### 紧急就医（立即拨打120）
- 呼吸困难明显加重，休息后不缓解
- 嘴唇或指甲发紫（发绀）
- 意识模糊、嗜睡或昏迷
- 胸痛，怀疑心肌梗死或气胸
- 呼吸衰竭征象（PaO2 <60 mmHg或PaCO2 >50 mmHg）

### 尽快就医（48小时内）
- 急性加重，症状持续加重
- 痰液变脓或量明显增加
- 发热（体温>38.5℃）
- 用药后症状无改善
- 新发严重症状

### 定期复查
- **稳定期COPD**：每3-6个月1次
- **频繁急性加重**：每1-3个月1次
- **重度COPD**：每1-2个月1次
- **复查项目**：肺功能、血气分析、胸片

## 急性加重识别

**定义：**
- 呼吸困难加重
- 痰量增加
- 痰液变脓

**上述症状中至少2项，且持续时间>3天**

**家庭识别方法：**
- **PEF监测**：PEF下降>20%提示急性加重
- **血氧饱和度**：SpO2 <90%提示缺氧
- **症状日记**：记录日常症状，便于识别异常

## 急性加重家庭处理

### 轻度急性加重
1. **增加支气管舒张剂**：增加速效支气管舒张剂使用频率
2. **使用储雾罐**：提高药物吸入效率
3. **休息**：减少体力活动
4. **多饮水**：每日2-3L水，稀释痰液
5. **监测**：密切观察症状变化

### 中度急性加重
1. **上述措施**
2. **口服激素**：泼尼松40mg/天×5天（遵医嘱）
3. **抗生素**：如怀疑细菌感染（遵医嘱）
4. **监测血氧**：SpO2应>90%

### 重度急性加重
**立即就医或拨打120**

## 错误处理

- **FEV1值无效**："FEV1值应在正常范围内（0.5-8.0 L）"
- **评分超出范围**："CAT评分应在0-40分之间，mMRC评分应在0-4级之间"
- **信息不完整**："请提供完整信息，例如：/copd fev1 1.8 65%"
- **无数据**："暂无COPD记录，请先记录肺功能或症状"
- **文件读取失败**："无法读取COPD数据，请检查数据文件"

## 示例用法

```
# 肺功能记录
/copd fev1 1.8 65%
/copd lung-function fvc 3.2 ratio 0.56

# 症状评估
/copd cat
/copd mmrc 2

# 症状记录
/copd symptom dyspnea moderate
/copd symptom sputum white moderate
/copd symptom wheeze exertion

# 急性加重记录
/copd exacerbation moderate
/copd exacerbation trigger infection
/copd exacerbation recovery 10 days
/copd exacerbation history

# 用药管理
/copd medication add 噻托溴铵 18μg 每天1次
/copd medication list

# 疫苗接种
/copd vaccine flu 2025-10-15
/copd vaccine pneumococcal ppsv23 2024-05-10

# 状态查看
/copd status
/copd assessment
```

## 注意事项

- **戒烟是最重要的干预**：延缓肺功能下降
- **规律使用维持药物**：即使无症状也要坚持使用
- **正确使用吸入装置**：定期检查吸入技术
- **定期复查肺功能**：每年至少1次
- **接种疫苗**：预防感染和急性加重
- **制定应急计划**：明确急性加重时的处理步骤
- **记录症状日记**：便于识别早期急性加重征象

---

**免责声明：本系统仅供健康监测记录使用，不替代专业医疗诊断和治疗。**
