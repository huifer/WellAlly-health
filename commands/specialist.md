---
description: 咨询特定专科专家，获取针对性分析
---

您需要根据用户指定的专科，启动对应的专科专家进行深入分析。

## 支持的专科列表

### 内科系统
| 专科代码 | 专科名称 | Skill 文件 | 擅长领域 |
|---------|---------|-----------|---------|
| cardio | 心内科 | cardiology.md | 心脏病、高血压、血脂异常 |
| endo | 内分泌科 | endocrinology.md | 糖尿病、甲状腺疾病 |
| gastro | 消化科 | gastroenterology.md | 肝病、胃肠疾病 |
| nephro | 肾内科 | nephrology.md | 肾脏病、电解质紊乱 |
| heme | 血液科 | hematology.md | 贫血、凝血异常 |
| resp | 呼吸科 | respiratory.md | 肺部感染、肺结节 |
| neuro | 神经内科 | neurology.md | 脑血管病、头痛头晕 |
| onco | 肿瘤科 | oncology.md | 肿瘤标志物、肿瘤筛查 |

### 外科及专科系统
| 专科代码 | 专科名称 | Skill 文件 | 擅长领域 |
|---------|---------|-----------|---------|
| ortho | 骨科 | orthopedics.md | 骨折、关节炎、骨质疏松 |
| derma | 皮肤科 | dermatology.md | 湿疹、痤疮、皮肤肿瘤 |
| pedia | 儿科 | pediatrics.md | 儿童发育、新生儿疾病 |
| gyne | 妇科 | gynecology.md | 月经疾病、妇科肿瘤 |

### 综合系统
| 专科代码 | 专科名称 | Skill 文件 | 擅长领域 |
|---------|---------|-----------|---------|
| general | 全科 | general.md | 综合评估、慢病管理 |
| psych | 精神科 | psychiatry.md | 情绪障碍、心理健康 |

## 使用方法

```bash
# 查询所有支持的专科
/specialist list

# 咨询特定专科
/specialist <专科代码> [参数]

# 示例：
/specialist cardio recent 3
/specialist endo all
/specialist ortho all
/specialist derma date 2025-12-31
/specialist pedia recent 5
/specialist gyne all
```

## 执行流程

### 1. 验证专科代码
检查用户指定的专科代码是否有效。如果无效，列出所有可用的专科。

### 2. 读取专科 Skill 定义
根据专科代码，读取对应的 skill 定义文件：
```
.claude/specialists/<专科对应的md文件>
```

### 3. 收集医疗数据
根据用户参数读取相关医疗数据：
- `all`: 所有数据
- `recent N`: 最近N条记录
- `date YYYY-MM-DD`: 指定日期
- 无参数: 最近3条记录

**新增：慢性病数据读取**
对于特定专科，还需读取相关的慢性病管理数据：
- **cardio（心内科）**：读取 `data/hypertension-tracker.json`（高血压管理数据）
- **endo（内分泌科）**：读取 `data/diabetes-tracker.json`（糖尿病管理数据）
- **resp（呼吸科）**：读取 `data/copd-tracker.json`（COPD管理数据）
- **nephro（肾内科）**：读取高血压和糖尿病管理数据（评估肾脏风险）

**数据读取优先级：**
1. 慢性病管理数据（如存在）
2. 检查报告数据（/save-report 保存的）
3. 其他相关医疗记录

### 4. 启动专科分析
使用 Task 工具启动该专科的 subagent，将：
- 专科 skill 定义内容
- 医疗数据内容
- 分析要求

传递给 subagent。

### 5. 展示分析报告
将 subagent 返回的专科分析报告直接展示给用户。

## 示例 Prompt（用于启动 subagent）

```
您是{{专科名称}}专家。请按照以下 Skill 定义进行医疗数据分析：

## Skill 定义
{{读取 .claude/specialists/{{对应的md文件}} 的完整内容}}

## 患者医疗数据

### 慢性病管理情况（如有）
{{读取对应的慢性病数据文件：
- cardio: data/hypertension-tracker.json
- endo: data/diabetes-tracker.json
- resp: data/copd-tracker.json
- nephro: data/hypertension-tracker.json + data/diabetes-tracker.json
}}

### 近期检查数据
{{读取相关的检查报告数据}}

## 分析要求
1. 严格按照 Skill 定义的格式输出分析报告
2. **优先分析慢性病管理情况**（如存在）：
   - 诊断时间和分类
   - 控制情况（达标率、平均值等）
   - 靶器官损害/并发症状态
   - 风险评估
3. 结合检查报告数据综合分析
4. 严格遵守以下安全红线：
   - 不给出具体用药剂量
   - 不直接开具处方药名
   - 不判断生死预后
   - 不替代医生诊断
5. 提供具体可行的建议
```

**专科分析报告格式（增强版）：**

```markdown
## {{专科名称}}分析报告

### 慢性病管理情况（如有）
**{{慢性病名称}}控制状态**：[基于慢性病管理数据]
- 诊断时间：YYYY-MM-DD
- 分级/分类：{{classification}}
- 近期控制指标：{{key metrics}}
- 达标情况：{{achievement status}}
- 靶器官损害/并发症：{{status}}
- 风险评估：{{risk level}}

### 近期检查数据
[其他检查数据分析...]

### 综合评估
[结合慢性病和检查数据的综合分析]

### 建议
- 生活方式：[具体建议]
- 饮食调整：[具体建议]
- 就医建议：[是否需要就医/复查]
```

请开始分析并返回完整报告。

## 安全红线（在每次咨询中强调）

- ❌ 不给出具体用药剂量
- ❌ 不直接开具处方药名
- ❌ 不判断生死预后
- ❌ 不替代医生诊断

## 错误处理

### 专科代码无效
```
❌ 未找到专科 "xyz"

可用的专科列表：

**内科系统**
- cardio: 心内科
- endo: 内分泌科
- gastro: 消化科
- nephro: 肾内科
- heme: 血液科
- resp: 呼吸科
- neuro: 神经内科
- onco: 肿瘤科

**外科及专科系统**
- ortho: 骨科
- derma: 皮肤科
- pedia: 儿科
- gyne: 妇科

**综合系统**
- general: 全科
- psych: 精神科

使用 /specialist list 查看详细信息
```

### 没有医疗数据
```
⚠️ 当前系统中没有医疗数据

请先使用 /save-report 保存医疗检查单，然后再进行专科咨询。
```

## 使用建议和最佳实践

### 1. 专科选择建议

#### 按症状选择专科
- **胸痛、心悸** → cardio（心内科）
- **关节痛、骨折** → ortho（骨科）
- **皮疹、瘙痒** → derma（皮肤科）
- **月经不调** → gyne（妇科）
- **儿童疾病** → pedia（儿科）

#### 按检查结果选择专科
- **血脂异常** → cardio（心内科）
- **骨密度异常** → ortho（骨科）
- **性激素异常** → gyne（妇科）

### 2. 参数选择建议
- **初次就诊/全面检查**：使用 `all` 参数
- **复查对比**：使用 `recent N`（N=5-10）
- **特定日期**：使用 `date YYYY-MM-DD`

### 3. 常见使用场景

#### 场景1：体检后综合评估
```bash
/consult all
/specialist cardio all
/specialist ortho all
```

#### 场景2：儿童保健
```bash
/specialist pedia all
```

#### 场景3：女性健康
```bash
/specialist gyne all
```

## 开始执行

现在，请根据用户指定的专科，启动对应的专科专家进行深入分析。

如果用户没有指定参数，默认分析最近3条记录。
