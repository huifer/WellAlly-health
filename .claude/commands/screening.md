---
description: 管理妇科癌症筛查和肿瘤标志物
arguments:
  - name: action
    description: 操作类型：hpv(HPV检测)/tct(TCT检测)/co-testing(联合筛查)/marker(肿瘤标志物)/abnormal(异常结果)/status(状态)/next(下次筛查)
    required: true
  - name: info
    description: 筛查信息（检查结果、数值、日期等，自然语言描述）
    required: false
---

# 妇科癌症筛查追踪

宫颈癌、卵巢癌、子宫内膜癌筛查计划管理和结果追踪。

## 操作类型

### 1. 记录HPV检测 - `hpv`

记录HPV（人乳头瘤病毒）检测结果。

**参数说明：**
- `info`: HPV检测结果（必填）
  - 结果：negative（阴性）, positive（阳性）, 阳性型别（16, 18, 31, 33, 52, 58等）

**示例：**
```
/screening hpv negative
/screening hpv positive 16
/screening hpv 阳性 18型
/screening hpv positive 52 58
/screening hpv 2025-01-15 negative
```

**执行步骤：**

#### 1. 解析HPV结果

**结果识别：**
- negative, 阴性, 阴性 → negative
- positive, 阳性, 阳性 → positive
- 数字16, 18, 31, 33, 45, 52, 58 → HPV type

**HPV型别分类：**

| 风险等级 | HPV型别 |
|---------|---------|
| 高危（最高危） | 16, 18 |
| 高危（其他） | 31, 33, 35, 39, 45, 51, 52, 56, 58, 59 |
| 低危 | 6, 11, 40, 42, 43, 44, 54, 61, 70, 72, 81 |

#### 2. 风险评估和管理建议

**HPV阴性：**
```
✅ HPV阴性

风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
当前风险：低

管理建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 继续常规筛查
• 21-29岁：TCT每3年
• 30-65岁：TCT+HPV每5年
• 或TCT每3年

下次筛查：
━━━━━━━━━━━━━━━━━━━━━━━━━━
根据年龄和筛查策略确定
（通常3-5年后）
```

**HPV 16/18阳性（最高危）：**
```
🚨 HPV 16/18阳性（最高危）

风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
当前风险：高

HPV 16/18是导致宫颈癌的主要型别，
约占宫颈癌病例的70%。

立即行动：
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 立即进行阴道镜检查
📋 可能需要宫颈活检

不要等待，不要恐慌：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• HPV阳性 ≠ 癌症
• 大多数HPV感染会在1-2年内清除
• 16/18型更持续，需要密切监测

阴道镜检查：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 放大观察宫颈和阴道
• 识别异常区域
• 可能取活检
• 痛苦小，无需麻醉

后续管理：
━━━━━━━━━━━━━━━━━━━━━━━━━━
根据阴道镜结果：
✅ 正常：6个月后复查HPV+TCT
⚠️ 异常：根据异常程度处理

⚠️ 重要提示：
请立即联系妇科医生进行阴道镜检查！
```

**其他高危HPV阳性（31, 33, 52, 58等）：**
```
⚠️ 高危HPV阳性

风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
当前风险：中-高

感染型别：HPV 52, 58

管理建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
选项1：立即阴道镜
  • 优点：早期发现问题
  • 缺点：额外检查

选项2：1年后复查
  • 重复HPV+TCT检测
  • 如持续阳性 → 阴道镜
  • 如转阴 → 常规筛查

建议咨询：
━━━━━━━━━━━━━━━━━━━━━━━━━━
请与妇科医生讨论，
选择最适合的方案。

多数情况下：
━━━━━━━━━━━━━━━━━━━━━━━━━━
医生可能建议：
1. 立即TCT检查（如未做）
2. 根据TCT结果决定下一步
3. 如TCT异常 → 阴道镜
4. 如TCT正常 → 1年后复查

生活方式：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 戒烟（吸烟会降低清除HPV的能力）
✅ 健康饮食，增强免疫力
✅ 规律运动
✅ 充足睡眠
✅ 接种HPV疫苗（可预防其他型别）
```

#### 3. 更新筛查记录

**HPV数据结构：**
```json
{
  "cervical_cancer": {
    "last_hpv": "2025-01-15",
    "hpv_result": "positive",
    "hpv_type": "16",
    "hpv_risk_level": "high",
    "hpv_method": "PCR",
    "hpv_high_risk_types": ["16"],
    "hpv_all_types": [],

    "last_tct": null,
    "tct_result": null,

    "last_co_testing": null,
    "co_testing_result": null,

    "screening_strategy": "co-testing",
    "screening_interval": "5_years",
    "age_appropriate_interval": true,

    "next_screening": null,
    "next_screening_type": "colposcopy",
    "days_until_next": 0,

    "abnormal_results": [
      {
        "result_id": "abn_20250115",
        "result_type": "hpv_positive",
        "hpv_type": "16",
        "date_identified": "2025-01-15",
        "follow_up": "colposcopy",
        "follow_up_status": "scheduled",
        "follow_up_date": "2025-02-01",
        "resolved": false
      }
    ],

    "total_screenings": 5,
    "first_screening": "2010-01-15",
    "screening_history": []
  }
}
```

#### 4. 输出确认

**HPV阴性输出：**
```
✅ HPV检测记录已更新

HPV检测信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
检测日期：2025年1月15日
HPV结果：阴性 ✅

风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
当前宫颈癌风险：低

筛查策略：
━━━━━━━━━━━━━━━━━━━━━━━━━━
联合筛查（HPV+TCT）
筛查间隔：5年

下次筛查：
━━━━━━━━━━━━━━━━━━━━━━━━━━
2030年1月15日（还有1825天）

💡 提示：
━━━━━━━━━━━━━━━━━━━━━━━━━━
继续保持定期筛查！
接种HPV疫苗可预防其他高危型别。
```

---

### 2. 记录TCT检测 - `tct`

记录TCT（液基薄层细胞检测）结果。

**参数说明：**
- `info`: TCT检测结果（必填）
  - 结果：NILM, ASC-US, ASC-H, LSIL, HSIL, AGC, cancer

**示例：**
```
/screening tct NILM
/screening tct ASC-US
/screening tct LSIL
/screening tct HSIL
/screening tct 非典型鳞状细胞 不能明确意义
```

**执行步骤：**

#### 1. 解析TCT结果

**TCT结果分类（Bethesda系统）：**

| 结果类型 | 英文缩写 | 临床意义 | 风险 |
|---------|---------|---------|------|
| 阴性 | NILM | 无上皮内病变或恶性病变 | 正常 |
| 非典型鳞状细胞，意义不明确 | ASC-US | 轻度异常，意义不明确 | 低 |
| 非典型鳞状细胞，不除外高级别 | ASC-H | 可能有HSIL | 中-高 |
| 低度鳞状上皮内病变 | LSIL | CIN 1 | 低-中 |
| 高度鳞状上皮内病变 | HSIL | CIN 2/3 | 高 |
| 非典型腺细胞 | AGC | 腺细胞异常 | 中-高 |
| 癌症 | Cancer | 浸润性癌 | 极高 |

**结果识别：**
| 用户输入 | 标准结果 |
|---------|---------|
| NILM, 阴性, 正常 | NILM |
| ASC-US, 非典型鳞状细胞, 意义不明确 | ASC-US |
| ASC-H, 非典型鳞状细胞 不除外高级别 | ASC-H |
| LSIL, 低度病变, CIN1 | LSIL |
| HSIL, 高度病变, CIN2, CIN3 | HSIL |
| AGC, 非典型腺细胞 | AGC |
| cancer, 癌症, 癌 | Cancer |

#### 2. 结果解读和管理

**NILM（阴性）：**
```
✅ TCT结果：NILM（阴性）

结果解读：
━━━━━━━━━━━━━━━━━━━━━━━━━━
未发现上皮内病变或恶性病变
宫颈细胞正常

管理建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 继续常规筛查
• 21-29岁：TCT每3年
• 30-65岁：TCT+HPV每5年

下次筛查：
━━━━━━━━━━━━━━━━━━━━━━━━━━
根据年龄和筛查策略确定
```

**ASC-US（意义不明确的非典型鳞状细胞）：**
```
⚠️ TCT结果：ASC-US

结果解读：
━━━━━━━━━━━━━━━━━━━━━━━━━━
轻度细胞学异常
可能是炎症反应或早期病变

风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
CIN 2+风险：约5-10%

管理方案：
━━━━━━━━━━━━━━━━━━━━━━━━━━
选项1：反射HPV检测 ⭐推荐
  • 优点：分流管理
  • HPV阴性 → 3年后复查
  • HPV阳性 → 阴道镜

选项2：1年后复查TCT
  • 重复TCT+HPV
  • 根据结果决定

选项3：立即阴道镜
  • 如果随访不便

建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
推荐进行HPV检测（如未同时做），
根据HPV结果决定下一步。

⚠️ 注意：
大多数ASC-US会恢复正常，
但需要按医嘱随访。
```

**LSIL（低度鳞状上皮内病变）：**
```
⚠️ TCT结果：LSIL

结果解读：
━━━━━━━━━━━━━━━━━━━━━━━━━━
低度鳞状上皮内病变
对应CIN 1（宫颈上皮内瘤变1级）

风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
CIN 2+风险：约15-20%
进展为浸润癌风险：<1%

管理方案：
━━━━━━━━━━━━━━━━━━━━━━━━━━
首选：1年后复查TCT+HPV

管理路径：
━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 1年后复查TCT+HPV
2. 如持续LSIL → 阴道镜
3. 如恢复正常 → 常规筛查
4. 如进展 → 阴道镜

预后：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 60%的LSIL会在1-2年内自然消退
✅ 只有约10%会进展为HSIL
✅ 极少直接进展为癌

建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
按医嘱定期复查，
多数情况下不需要治疗。

生活方式：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 戒烟（吸烟增加进展风险）
✅ 接种HPV疫苗
✅ 增强免疫力
```

**HSIL（高度鳞状上皮内病变）：**
```
🚨 TCT结果：HSIL

结果解读：
━━━━━━━━━━━━━━━━━━━━━━━━━━
高度鳞状上皮内病变
对应CIN 2/3

风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
CIN 2+风险：>50%
如不治疗，进展为浸润癌风险：
  • CIN 2：约5%
  • CIN 3：约15-30%

立即行动：
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 立即进行阴道镜检查+活检
📋 根据活检结果决定治疗方案

不要等待！
━━━━━━━━━━━━━━━━━━━━━━━━━━
HSIL是癌前病变，
需要及时评估和治疗。

阴道镜+活检：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 确定病变程度（CIN 2还是CIN 3）
• 排除浸润癌
• 指导治疗方案

可能的治疗：
━━━━━━━━━━━━━━━━━━━━━━━━━━
CIN 2：
  • 观察（年轻女性）
  • 或治疗（LEEP刀、冷冻等）

CIN 3：
  • 通常需要治疗
  • LEEP刀、冷冻、激光等

治疗后随访：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 治疗后定期TCT+HPV复查
✅ 通常每6个月一次，持续数年
✅ 治愈率>90%

⚠️ 重要提示：
请立即联系妇科医生进行阴道镜检查！
```

**AGC（非典型腺细胞）：**
```
🚨 TCT结果：AGC

结果解读：
━━━━━━━━━━━━━━━━━━━━━━━━━━
非典型腺细胞
可能源于宫颈或子宫内膜

风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
风险较高（可能隐藏严重病变）

立即评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 立即阴道镜检查
📋 子宫颈管取样
📋 子宫内膜活检（尤其>35岁）

不要等待！
━━━━━━━━━━━━━━━━━━━━━━━━━━
AGC可能隐藏：
• CIN 2/3
• 腺癌前病变
• 浸润性癌

全面评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 阴道镜+宫颈活检
• 宫颈管搔刮（ECC）
• 子宫内膜活检
• 可能需要影像学检查

⚠️ 重要提示：
请立即联系妇科医生进行
全面评估！
```

#### 3. 更新筛查记录

**TCT数据结构：**
```json
{
  "cervical_cancer": {
    "last_tct": "2025-01-15",
    "tct_result": "ASC-US",
    "tct_result_full": "非典型鳞状细胞，意义不明确",
    "tct_sample_adequacy": "satisfactory",
    "tct_details": "轻度细胞学异常",
    "tct_bethesda_category": "ASC-US"
  }
}
```

#### 4. 输出确认

```
✅ TCT检测记录已更新

TCT检测信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
检测日期：2025年1月15日
TCT结果：ASC-US
详细：非典型鳞状细胞，意义不明确

风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
CIN 2+风险：约5-10%

管理建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
推荐进行HPV检测：
• HPV阴性 → 3年后复查
• HPV阳性 → 阴道镜

下次检查：
━━━━━━━━━━━━━━━━━━━━━━━━━━
请咨询医生是否需要HPV检测

⚠️ 重要提示：
ASC-US多数会恢复正常，
但需要按医嘱随访评估。
```

---

### 3. 联合筛查 - `co-testing`

记录HPV+TCT联合筛查结果。

**参数说明：**
- `info`: 联合筛查结果（必填）
  - HPV结果：negative, positive, 型别
  - TCT结果：NILM, ASC-US, LSIL, HSIL等

**示例：**
```
/screening co-testing negative NILM
/screening co-testing hpv阳性 tct正常
/screening co-testing positive16 ASC-US
/screening co-testing HPV阴性 LSIL
```

**执行步骤：**

#### 1. 解析联合筛查结果

**提取HPV和TCT结果**

#### 2. 综合风险评估

**联合筛查结果管理算法：**

| HPV | TCT | 风险 | 管理 |
|-----|-----|------|------|
| 阴性 | NILM | 极低 | 5年后复查 |
| 阳性16/18 | 任何TCT | 高 | 立即阴道镜 |
| 阳性其他 | NILM | 低-中 | 1年后复查 |
| 阳性其他 | ASC-US | 中 | 阴道镜或1年后复查 |
| 阳性其他 | LSIL/HSIL | 高 | 立即阴道镜 |
| 阴性 | ASC-US | 低 | 3年后复查 |
| 阴性 | LSIL | 低-中 | 1年后复查 |
| 阴性 | HSIL | 高 | 阴道镜 |
| 任何 | AGC | 高 | 全面评估 |

**结果解读示例：**

**HPV阴性 + TCT NILM：**
```
✅ 联合筛查结果：HPV阴性 + TCT正常

风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
宫颈癌风险：极低 ✅

这是最理想的结果！

筛查间隔：
━━━━━━━━━━━━━━━━━━━━━━━━━━
可以延长至5年后复查
（30-65岁女性）

保护期限：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 未来5年内宫颈癌风险<0.1%
• 比单独TCT或HPV更安全

下次筛查：
━━━━━━━━━━━━━━━━━━━━━━━━━━
2030年1月15日

💡 提示：
━━━━━━━━━━━━━━━━━━━━━━━━━━
继续保持定期筛查！
接种HPV疫苗可预防其他型别。
```

**HPV 16/18阳性 + TCT NILM：**
```
🚨 联合筛查结果：HPV 16阳性 + TCT正常

风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
宫颈癌风险：高

即使TCT正常，HPV 16/18阳性
也需要阴道镜检查！

立即行动：
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 立即阴道镜检查

原因：
━━━━━━━━━━━━━━━━━━━━━━━━━━
HPV 16/18是最致癌的高危型别，
即使TCT正常也可能有病变。

阴道镜可以发现：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• TCT漏掉的病变
• 早期癌前病变
• 指导进一步管理

⚠️ 重要提示：
请立即进行阴道镜检查！
```

**HPV阳性 + TCT ASC-US：**
```
⚠️ 联合筛查结果：HPV阳性 + TCT轻度异常

风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
宫颈癌风险：中-高

管理建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 阴道镜检查

CIN 2+风险：约20-30%

需要阴道镜评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 确定病变程度
• 排除更严重病变
• 指导治疗

⚠️ 重要提示：
请预约阴道镜检查！
```

#### 3. 更新筛查记录

**联合筛查数据结构：**
```json
{
  "cervical_cancer": {
    "last_hpv": "2025-01-15",
    "hpv_result": "negative",
    "hpv_type": null,

    "last_tct": "2025-01-15",
    "tct_result": "NILM",
    "tct_details": "阴性，上皮内病变或恶性病变",

    "last_co_testing": "2025-01-15",
    "co_testing_result": "negative_NILM",
    "co_testing_interpretation": "极低风险",

    "screening_strategy": "co-testing",
    "screening_interval": "5_years",
    "age_appropriate_interval": true,

    "next_screening": "2030-01-15",
    "next_screening_type": "co_testing",
    "days_until_next": 1825
  }
}
```

#### 4. 输出确认

```
✅ 联合筛查记录已更新

联合筛查信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
检测日期：2025年1月15日
HPV结果：阴性 ✅
TCT结果：NILM（正常）✅

综合评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
宫颈癌风险：极低

筛查策略：
━━━━━━━━━━━━━━━━━━━━━━━━━━
联合筛查（HPV+TCT）
筛查间隔：5年

下次筛查：
━━━━━━━━━━━━━━━━━━━━━━━━━━
2030年1月15日

💡 提示：
━━━━━━━━━━━━━━━━━━━━━━━━━━
最理想的结果！继续保持！
```

---

### 4. 记录肿瘤标志物 - `marker`

记录妇科肿瘤标志物检测结果。

**参数说明：**
- `info`: 肿瘤标志物信息（必填）
  - 标志物类型：CA125, CA19-9, CEA, AFP
  - 数值：数字

**示例：**
```
/screening marker ca125 15.5
/screening marker CA19-9 22.0
/screening marker cea 3.2
/screening marker afp 5.5
/screening marker ca125 80
```

**执行步骤：**

#### 1. 解析肿瘤标志物信息

**标志物识别：**
| 标志物 | 相关癌症 | 正常值 |
|--------|---------|--------|
| CA125 | 卵巢癌、子宫内膜癌 | <35 U/mL |
| CA19-9 | 卵巢癌、子宫内膜癌、胰腺癌 | <37 U/mL |
| CEA | 子宫内膜癌、结直肠癌 | <5 ng/mL（非吸烟者）<br><10 ng/mL（吸烟者） |
| AFP | 卵黄囊瘤 | <10 ng/mL |

#### 2. 结果分类

**CA125分类：**

| 数值 | 分类 | 意义 |
|------|------|------|
| <35 | 正常 | 无明显异常 |
| 35-65 | 轻度升高 | 需结合临床 |
| 65-100 | 明显升高 | 需要评估 |
| >100 | 显著升高 | 高度警惕 |

**CA19-9分类：**

| 数值 | 分类 | 意义 |
|------|------|------|
| <37 | 正常 | 无明显异常 |
| 37-74 | 轻度升高 | 需结合临床 |
| 74-100 | 明显升高 | 需要评估 |
| >100 | 显著升高 | 高度警惕 |

#### 3. 趋势分析

**计算变化：**
```javascript
if (previous_value) {
  absolute_change = current_value - previous_value
  percentage_change = (absolute_change / previous_value) * 100

  if (percentage_change > 20) trend = "rising"
  else if (percentage_change < -20) trend = "falling"
  else trend = "stable"
}
```

**风险评估：**
```javascript
risk = "low"
if (value > 2 * upper_limit) risk = "high"
else if (value > upper_limit) risk = "moderate"
else if (trend === "rising" && previous_elevated) risk = "moderate"

if (trend === "rising" && percentage_change > 50) risk = "high"
```

#### 4. 更新肿瘤标志物记录

**肿瘤标志物数据结构：**
```json
{
  "tumor_markers": {
    "CA125": {
      "current_value": 15.5,
      "reference_range": "<35",
      "unit": "U/mL",
      "last_checked": "2025-06-20",
      "classification": "normal",
      "trend": "stable",
      "trend_direction": "stable",
      "percentage_change": -14.8,
      "history": [
        {
          "date": "2024-06-20",
          "value": 18.2
        },
        {
          "date": "2024-12-20",
          "value": 16.5
        },
        {
          "date": "2025-06-20",
          "value": 15.5
        }
      ],
      "interpretation": "",
      "notes": ""
    },

    "CA19-9": {
      "current_value": 22.0,
      "reference_range": "<37",
      "unit": "U/mL",
      "last_checked": "2025-06-20",
      "classification": "normal",
      "trend": "stable",
      "history": [
        {
          "date": "2024-06-20",
          "value": 23.5
        },
        {
          "date": "2025-06-20",
          "value": 22.0
        }
      ]
    },

    "CEA": {
      "current_value": null,
      "reference_range": "<5",
      "unit": "ng/mL",
      "last_checked": null,
      "classification": null,
      "history": []
    },

    "AFP": {
      "current_value": null,
      "reference_range": "<10",
      "unit": "ng/mL",
      "last_checked": null,
      "classification": null,
      "history": []
    }
  }
}
```

#### 5. 输出确认

**正常值输出：**
```
✅ 肿瘤标志物记录已更新

CA125检测信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
检测日期：2025年6月20日
CA125：15.5 U/mL
参考值：<35 U/mL
分类：正常 ✅

趋势分析：
━━━━━━━━━━━━━━━━━━━━━━━━━━
历史记录：
• 2024-06-20：18.2 U/mL
• 2024-12-20：16.5 U/mL
• 2025-06-20：15.5 U/mL

趋势：稳定下降 📉
变化：-14.8%（6个月内）

评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
CA125在正常范围内，
趋势稳定，无异常迹象。

💡 提示：
━━━━━━━━━━━━━━━━━━━━━━━━━━
CA125正常值并不意味着100%无风险，
但目前的检测结果令人放心。

继续保持定期筛查！
```

**升高值输出：**
```
⚠️ 肿瘤标志物记录已更新

CA125检测信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
检测日期：2025年6月20日
CA125：80 U/mL
参考值：<35 U/mL
分类：显著升高 ⚠️

风险评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
当前风险：高

趋势分析：
━━━━━━━━━━━━━━━━━━━━━━━━━━
历史记录：
• 2024-06-20：18.2 U/mL
• 2024-12-20：35.0 U/mL
• 2025-06-20：80.0 U/mL

趋势：快速上升 📈
变化：+128%（6个月内）

可能原因：
━━━━━━━━━━━━━━━━━━━━━━━━━━
CA125升高的非癌原因：
✓ 良性妇科疾病
  • 子宫内膜异位症
  • 子宫肌瘤
  • 盆腔炎
  • 月经期（轻度升高）
✓ 良性非妇科疾病
  • 肝硬化
  • 心衰
  • 肾病
✓ 生理性原因
  • 妊娠
  • 月经
  • 排卵

建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 立即咨询妇科医生

进一步检查可能包括：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 经阴道超声
• 盆腔MRI
• CT扫描
• CA19-9、CEA等其他标志物
• 临床评估

⚠️ 重要提示：
━━━━━━━━━━━━━━━━━━━━━━━━━━
CA125升高 ≠ 癌症

但需要专业评估排除其他原因，
请尽快就医！
```

---

### 5. 记录异常结果随访 - `abnormal`

记录异常结果的随访情况。

**参数说明：**
- `info`: 异常结果随访信息（必填）
  - 类型：asc-us, lsil, hsil, agc等
  - 随访方式：colposcopy（阴道镜）, biopsy（活检）, repeat（复查）
  - 结果：normal（正常）, CIN1, CIN2, CIN3, cancer等

**示例：**
```
/screening abnormal asc-us colposcopy scheduled 2025-02-01
/screening abnormal lsil repeat 2025-06-20
/screening abnormal hsil biopsy CIN2
/screening abnormal colposcopy normal
```

**执行步骤：**

#### 1. 解析随访信息

#### 2. 更新异常结果记录

**异常结果数据结构：**
```json
{
  "abnormal_result_followup": [
    {
      "result_id": "abn_20250115",
      "initial_result": {
        "type": "hpv_positive",
        "hpv_type": "16",
        "date_identified": "2025-01-15",
        "tct_result": null
      },
      "follow_up": {
        "type": "colposcopy",
        "scheduled_date": "2025-02-01",
        "completed_date": "2025-02-01",
        "result": "normal",
        "biopsy_result": null,
        "notes": "阴道镜检查未见异常"
      },
      "status": "resolved",
      "resolved_date": "2025-02-01",
      "next_follow_up": "2025-08-01"
    },
    {
      "result_id": "abn_20250201",
      "initial_result": {
        "type": "tct_abnormal",
        "tct_result": "HSIL",
        "hpv_result": "positive",
        "hpv_type": "52",
        "date_identified": "2025-02-01"
      },
      "follow_up": {
        "type": "colposcopy_biopsy",
        "scheduled_date": "2025-02-15",
        "completed_date": "2025-02-15",
        "result": "CIN2",
        "biopsy_result": "CIN2",
        "treatment": "LEEP",
        "treatment_date": "2025-03-01"
      },
      "status": "treated",
      "resolved_date": null,
      "next_follow_up": "2025-08-01"
    }
  ]
}
```

#### 3. 输出确认

```
✅ 异常结果随访记录已更新

异常结果信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
初始结果：HPV 16阳性
发现日期：2025年1月15日

随访信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
随访方式：阴道镜检查
完成日期：2025年2月1日
检查结果：正常 ✅

状态：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 已解决

下次随访：
━━━━━━━━━━━━━━━━━━━━━━━━━━
2025年8月1日（6个月后）
复查HPV+TCT

💡 提示：
━━━━━━━━━━━━━━━━━━━━━━━━━━
阴道镜检查正常是好消息！
但仍需按医嘱定期复查，
确保HPV已清除或病变已稳定。
```

---

### 6. 查看筛查状态 - `status`

显示当前筛查状态。

**参数说明：**
- 无参数

**示例：**
```
/screening status
```

**执行步骤：**

#### 1. 读取筛查数据

#### 2. 生成状态报告

```
📍 妇科癌症筛查状态

宫颈癌筛查：
━━━━━━━━━━━━━━━━━━━━━━━━━━
筛查策略：联合筛查（HPV+TCT）

最近检查：
━━━━━━━━━━━━━━━━━━━━━━━━━━
HPV检测（2025年1月15日）
结果：阴性 ✅

TCT检测（2025年1月15日）
结果：NILM（正常）✅

综合评估：
━━━━━━━━━━━━━━━━━━━━━━━━━━
宫颈癌风险：极低

下次筛查：
━━━━━━━━━━━━━━━━━━━━━━━━━━
2030年1月15日
还有1825天（5年）

筛查历史：
━━━━━━━━━━━━━━━━━━━━━━━━━━
首次筛查：2010年1月15日
筛查次数：5次
筛查年限：15年

异常结果记录：
━━━━━━━━━━━━━━━━━━━━━━━━━━
无异常记录 ✅

肿瘤标志物：
━━━━━━━━━━━━━━━━━━━━━━━━━━
CA125：15.5 U/mL（正常）✅
  趋势：稳定 📉
  上次检测：2025年6月20日

CA19-9：22.0 U/mL（正常）✅
  趋势：稳定 ➡️
  上次检测：2025年6月20日

CEA：未检测 ⚠️
AFP：未检测 ⚠️

建议：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 宫颈癌筛查按计划进行
📅 可考虑补充CEA、AFP检测
✅ 继续定期检查

💡 提示：
━━━━━━━━━━━━━━━━━━━━━━━━━━
宫颈癌筛查非常规律且结果正常，
继续保持！
```

---

### 7. 下次筛查提醒 - `next`

显示下次筛查信息。

**参数说明：**
- 无参数

**示例：**
```
/screening next
```

**执行步骤：**

#### 1. 查找下次筛查

#### 2. 生成提醒

```
📅 下次筛查提醒

下次筛查信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━
检查类型：联合筛查（HPV+TCT）
预约日期：2030年1月15日（周一）
还有1825天（5年）

检查项目：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• HPV检测（高危型）
• TCT（液基薄层细胞检测）

检查说明：
━━━━━━━━━━━━━━━━━━━━━━━━━━
联合筛查是目前最有效的宫颈癌
筛查方法，可以：
✅ 早期发现癌前病变
✅ 早期发现宫颈癌
✅ 延长筛查间隔至5年

准备事项：
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 避免月经期（最好在月经干净后3-7天）
✅ 检查前24-48小时避免性生活
✅ 检查前24-48小时避免阴道冲洗
✅ 检查前24-48小时避免使用阴道药物
✅ 穿着宽松便于检查的衣物

检查流程：
━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 妇科检查
2. 宫颈细胞取样（TCT）
3. HPV取样（可与TCT同时进行）

过程时间：约5-10分钟
疼痛程度：轻度不适

可能的问题：
━━━━━━━━━━━━━━━━━━━━━━━━━━
Q: 需要空腹吗？
A: 不需要空腹。

Q: 会疼痛吗？
A: 可能有轻度不适，但通常可忍受。

Q: 检查后可以正常活动吗？
A: 可以，无特殊限制。

Q: 什么时候出结果？
A: 通常1-2周出结果。

建议提问医生：
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 当年的筛查结果是否正常？
• 下次筛查时间？
• 是否需要补充其他检查？
• HPV疫苗接种建议？

📍 地点：
━━━━━━━━━━━━━━━━━━━━━━━━━━
医院：[填写医院名称]
科室：妇科门诊
地址：[填写地址]
电话：[填写电话]

💡 提示：
━━━━━━━━━━━━━━━━━━━━━━━━━━
建议提前1-2周预约，
避免排队等候。
```

---

## 数据结构

### 主文件：data/screening-tracker.json

```json
{
  "created_at": "2025-12-31T12:00:00.000Z",
  "last_updated": "2025-12-31T12:00:00.000Z",

  "cancer_screening": {
    "screening_id": "screening_20250101",

    "cervical_cancer": {
      "last_hpv": "2025-01-15",
      "hpv_result": "negative",
      "hpv_type": null,
      "hpv_risk_level": null,
      "hpv_method": "PCR",
      "hpv_high_risk_types": [],
      "hpv_all_types": [],

      "last_tct": "2025-01-15",
      "tct_result": "NILM",
      "tct_result_full": "阴性，上皮内病变或恶性病变",
      "tct_sample_adequacy": "satisfactory",
      "tct_details": "阴性",
      "tct_bethesda_category": "NILM",

      "last_co_testing": "2025-01-15",
      "co_testing_result": "negative_NILM",
      "co_testing_interpretation": "极低风险",

      "screening_strategy": "co-testing",
      "screening_interval": "5_years",
      "age_appropriate_interval": true,

      "next_screening": "2030-01-15",
      "next_screening_type": "co-testing",
      "days_until_next": 1825,

      "abnormal_results": [],

      "total_screenings": 5,
      "first_screening": "2010-01-15",
      "screening_history": []
    },

    "tumor_markers": {
      "CA125": {
        "current_value": 15.5,
        "reference_range": "<35",
        "unit": "U/mL",
        "last_checked": "2025-06-20",
        "classification": "normal",
        "trend": "stable",
        "trend_direction": "stable",
        "percentage_change": -14.8,
        "history": [
          {
            "date": "2024-06-20",
            "value": 18.2
          },
          {
            "date": "2024-12-20",
            "value": 16.5
          },
          {
            "date": "2025-06-20",
            "value": 15.5
          }
        ],
        "interpretation": "",
        "notes": ""
      },

      "CA19-9": {
        "current_value": 22.0,
        "reference_range": "<37",
        "unit": "U/mL",
        "last_checked": "2025-06-20",
        "classification": "normal",
        "trend": "stable",
        "history": [
          {
            "date": "2024-06-20",
            "value": 23.5
          },
          {
            "date": "2025-06-20",
            "value": 22.0
          }
        ]
      },

      "CEA": {
        "current_value": null,
        "reference_range": "<5",
        "unit": "ng/mL",
        "last_checked": null,
        "classification": null,
        "history": []
      },

      "AFP": {
        "current_value": null,
        "reference_range": "<10",
        "unit": "ng/mL",
        "last_checked": null,
        "classification": null,
        "history": []
      }
    },

    "abnormal_result_followup": [],

    "upcoming_appointments": [
      {
        "appointment_id": "appt_001",
        "type": "annual_gyn_exam",
        "date": "2026-01-15",
        "purpose": "annual_gynecological_exam",
        "preparation": [],
        "location": "",
        "notes": ""
      }
    ],

    "metadata": {
      "created_at": "2025-01-01T00:00:00.000Z",
      "last_updated": "2025-06-20T00:00:00.000Z"
    }
  },

  "statistics": {
    "total_cervical_screenings": 5,
    "years_of_screening": 15,
    "abnormal_results_count": 0,
    "colposcopies": 0,
    "tumor_marker_tests": 3,
    "all_markers_normal": true,
    "screening_uptodate": true,
    "next_screening_due": "2030-01-15"
  },

  "settings": {
    "screening_strategy": "co-testing",
    "reminder_days_before": 30,
    "age": 45,
    "screening_age_started": 30,
    "family_history_cancer": []
  }
}
```

### 详细记录文件：data/筛查记录/YYYY-MM/YYYY-MM-DD_筛查记录.json

```json
{
  "screening_id": "screening_20250115",
  "record_date": "2025-01-15",
  "screening_type": "co-testing",

  "hpv_result": {
    "result": "negative",
    "type": null,
    "method": "PCR",
    "lab": "",
    "notes": ""
  },

  "tct_result": {
    "result": "NILM",
    "full_result": "阴性，上皮内病变或恶性病变",
    "sample_adequacy": "satisfactory",
    "bethesda_category": "NILM",
    "pathologist": "",
    "notes": ""
  },

  "combined_interpretation": "极低风险",
  "management_plan": "5年后复查",

  "metadata": {
    "created_at": "2025-01-15T14:30:00.000Z",
    "last_updated": "2025-01-15T14:30:00.000Z"
  }
}
```

---

## 智能识别规则

### HPV结果识别

| 用户输入 | 标准结果 |
|---------|---------|
| negative, 阴性, 阴性 | negative |
| positive, 阳性, 阳性 | positive |
| 16, 18, 31, 33, 52, 58 | HPV type |

### TCT结果识别

| 用户输入 | 标准结果 |
|---------|---------|
| NILM, 阴性, 正常 | NILM |
| ASC-US, 非典型鳞状细胞 | ASC-US |
| ASC-H, 非典型不除外高级别 | ASC-H |
| LSIL, 低度病变, CIN1 | LSIL |
| HSIL, 高度病变, CIN2, CIN3 | HSIL |
| AGC, 非典型腺细胞 | AGC |

### 肿瘤标志物识别

| 关键词 | 标志物 |
|--------|--------|
| ca125, CA125 | CA125 |
| ca19-9, CA19-9 | CA19-9 |
| cea, CEA | CEA |
| afp, AFP | AFP |

### 数值识别

| 格式 | 示例 |
|------|------|
| 数字 | 15.5, 80 |
| 数字+单位 | 15.5 U/mL, 22.0 U/mL |

---

## 错误处理

| 场景 | 错误消息 | 建议 |
|------|---------|------|
| 无筛查记录 | 无筛查记录<br>请先使用 /screening hpv 或 /screening tct | 引导开始记录 |
| HPV格式错误 | HPV结果格式错误<br>正确格式：/screening hpv negative | 提供正确格式 |
| TCT结果未识别 | 未识别的TCT结果<br>支持：NILM, ASC-US, LSIL, HSIL等 | 列出支持类型 |
| 标志物未识别 | 未识别的肿瘤标志物<br>支持：CA125, CA19-9, CEA, AFP | 列出支持类型 |
| 数值格式错误 | 数值格式错误<br>正确格式：/screening marker ca125 15.5 | 提供正确格式 |

---

## 注意事项

- 肿瘤标志物升高不等于癌症
- 筛查间隔应遵医嘱
- 异常结果需及时就医
- HPV阳性不等于宫颈癌
- TCT异常不等于宫颈癌
- 大多数HPV感染会自然清除
- 癌前病变可以治疗和预防

**需要立即就医的情况：**
- HPV 16/18阳性
- HSIL（高度病变）
- AGC（非典型腺细胞）
- 肿瘤标志物显著升高（>3倍正常值）
- 肿瘤标志物快速上升（>50%变化）

---

## 示例用法

```
# 记录HPV检测
/screening hpv negative

# 记录TCT检测
/screening tct NILM

# 联合筛查
/screening co-testing negative NILM

# 记录肿瘤标志物
/screening marker ca125 15.5
/screening marker ca19-9 22.0

# 异常结果随访
/screening abnormal colposcopy scheduled 2025-02-01

# 查看状态
/screening status

# 下次筛查
/screening next
```
