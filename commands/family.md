---
description: 管理家庭成员健康信息、记录家族病史、评估遗传风险、生成家庭健康报告
arguments:
  - name: action
    description: 操作类型：add-member(添加成员)/add-history(记录病史)/track(追踪健康)/report(生成报告)/list(列出成员)/risk(风险评估)
    required: true
  - name: info
    description: 详细信息（成员信息、病史描述等，自然语言）
    required: false
---

# 家庭健康管理

全面的家庭健康档案管理,帮助记录家族病史、评估遗传风险、维护家庭健康。

## ⚠️ 医学安全声明

**重要提示:本系统仅供健康记录和家族病史管理,不能替代专业医疗诊断和治疗。**

- ❌ 不提供遗传疾病诊断
- ❌ 不预测个体发病概率
- ❌ 不推荐具体治疗方案
- ❌ 不替代遗传咨询师
- ✅ 记录家族病史
- ✅ 评估遗传风险(仅供参考)
- ✅ 生成家庭健康报告
- ✅ 提供预防建议和筛查提醒

所有医疗决策请遵从医生指导。遗传风险评估结果仅供参考,具体风险请咨询专业医师或遗传咨询师。

## 操作类型

### 1. 添加家庭成员 - `add-member`

添加家庭成员到健康档案。

**参数说明:**
- `info`: 成员信息(必填),使用自然语言描述

**示例:**
```
/family add-member 父亲 张三 1960-05-15 A型血
/family add-member 母亲 李四 1962-08-20 B型血
/family add-member 儿子 小明 2010-03-10 A型血
/family add-member 配偶 王五 1988-12-05 O型血
```

**支持的信息:**
- 关系:父亲/母亲/配偶/儿子/女儿/兄弟/姐妹等
- 姓名:成员姓名
- 出生日期:YYYY-MM-DD格式或年龄
- 血型:A/B/AB/O型
- 性别:男/女(通常可从关系推断)

**执行步骤:**
1. 解析关系类型和成员信息
2. 生成唯一的member_id
3. 验证关系完整性和年龄合理性
4. 保存到`data/family-health-tracker.json`
5. 输出确认信息

**数据结构:**
```json
{
  "member_id": "mem_20250108_001",
  "name": "张三",
  "relationship": "father",
  "gender": "male",
  "birth_date": "1960-05-15",
  "blood_type": "A",
  "status": "living",
  "created_at": "2025-01-08T10:00:00.000Z"
}
```

### 2. 记录家族病史 - `add-history`

记录家族成员的疾病历史。

**参数说明:**
- `info`: 病史信息(必填),使用自然语言描述

**示例:**
```
/family add-history 父亲 高血压 50岁确诊
/family add-history 母亲 糖尿病 55岁发病
/family add-history 祖父 冠心病 60岁
/family add-history 外祖母 乳腺癌 58岁
```

**支持的信息:**
- 成员:家庭成员名称或关系
- 疾病名称:高血压、糖尿病、冠心病等
- 发病年龄:确诊或发病时的年龄
- 严重程度:轻度/中度/重度(可选)
- 备注:其他相关信息(可选)

**执行步骤:**
1. 解析成员和疾病信息
2. 识别疾病分类(心血管/代谢/肿瘤等)
3. 记录发病年龄和严重程度
4. 更新family_medical_history
5. 输出确认信息

**数据结构:**
```json
{
  "history_id": "hist_20250108_001",
  "disease_name": "高血压",
  "disease_category": "cardiovascular",
  "affected_member_id": "mem_20250108_001",
  "age_at_onset": 50,
  "severity": "moderate",
  "notes": "药物控制良好",
  "reported_date": "2025-01-08"
}
```

### 3. 追踪成员健康 - `track`

追踪家庭成员的健康数据(血压、血糖、用药等)。

**参数说明:**
- `info`: 健康数据(必填),指定成员和数据类型

**示例:**
```
/family track 父亲 血压 135/85
/family track 母亲 血糖 7.2
/family track 儿子 身高 体重 120cm 25kg
/family track list
```

**支持的数据类型:**
- 血压:收缩压/舒张压
- 血糖:空腹血糖值
- 体重:体重/BMI
- 身高:身高值
- 用药:药物名称和剂量

**执行步骤:**
1. 识别成员和数据类型
2. 集成现有健康模块数据
3. 记录到成员健康档案
4. 更新健康趋势
5. 输出记录结果

**集成模块:**
- hypertension-tracker.json(血压)
- diabetes-tracker.json(血糖)
- nutrition-tracker.json(体重)

### 4. 列出家庭成员 - `list`

显示所有家庭成员信息。

**示例:**
```
/family list
/family list 简洁
/family list 详细
```

**输出内容:**
- 成员列表
- 关系和年龄
- 健康状态概览
- 家族病史汇总

### 5. 遗传风险评估 - `risk`

评估和显示家族遗传风险。

**示例:**
```
/family risk
/family risk 高血压
/family risk 糖尿病
/family risk 全部
```

**输出内容:**
- 遗传风险等级(高/中/低)
- 受影响家庭成员
- 风险因素分析
- 预防建议

**风险计算:**
```
遗传风险评分 = (一级亲属患病数 × 0.4) +
              (早发病例数 × 0.3) +
              (家族聚集度 × 0.3)

风险等级:
- 高风险: ≥70%
- 中风险: 40%-69%
- 低风险: <40%
```

**注意:** 风险评估基于家族病史统计,仅供参考,不预测个体发病。

### 6. 生成家庭健康报告 - `report`

生成完整的家庭健康分析报告。

**示例:**
```
/family report
/family report html
/family report 遗传风险
```

**报告内容:**
- 家庭成员健康概况
- 家族病史汇总
- 遗传风险分析
- 共同健康问题
- 预防建议清单
- 筛查建议时间表

**输出格式:**
- 文本报告:命令行输出
- HTML报告:可视化图表(家谱树、风险图等)

**HTML可视化包含:**
- 家谱树(多代展示)
- 遗传风险热力图
- 疾病分布图表
- 预防建议时间线

## 疾病分类参考

### 心血管疾病
- 高血压
- 冠心病
- 心肌病
- 心律失常
- 卒中

### 代谢疾病
- 糖尿病(1型/2型)
- 高脂血症
- 痛风
- 代谢综合征

### 肿瘤
- 肺癌
- 乳腺癌
- 结直肠癌
- 胃癌
- 肝癌

### 呼吸系统
- 哮喘
- COPD
- 肺纤维化

### 其他
- 青光眼
- 精神疾病
- 自身免疫病

## 关系类型标准

### 直系亲属
- self:本人
- father:父亲
- mother:母亲
- spouse:配偶
- son:儿子
- daughter:女儿

### 旁系亲属
- brother:兄弟
- sister:姐妹
- paternal_grandfather:祖父
- paternal_grandmother:祖母
- maternal_grandfather:外祖父
- maternal_grandmother:外祖母

### 复杂关系
- half_brother:异父/母兄弟
- half_sister:异父/母姐妹
- adopted:收养关系

## 遗传风险参考

### 高风险特征
- 多名一级亲属患病
- 早发病例(<50岁)
- 家族聚集明显
- 遗传模式明确

### 中风险特征
- 1-2名一级亲属患病
- 中年发病(50-65岁)
- 轻度家族聚集

### 低风险特征
- 仅有远亲患病
- 晚发病例(>65岁)
- 散发病例

## 预防建议参考

### 心血管疾病高风险
- 定期血压监测(每周3次)
- 限制钠盐摄入(<5g/天)
- 规律有氧运动(每周150分钟)
- 体重管理(BMI<24)
- 35岁开始定期体检

### 糖尿病高风险
- 控制体重和腰围
- 低糖低脂饮食
- 增加膳食纤维
- 规律运动
- 40岁开始每年查血糖

### 肿瘤高风险
- 遵医嘱定期筛查
- 避免致癌因素(吸烟、饮酒)
- 健康生活方式
- 疫苗接种(如乙肝疫苗)
- 警惕早期症状

## 数据结构

### 家庭信息结构
```json
{
  "family_info": {
    "family_id": "fam_20250108_001",
    "created_date": "2025-01-08",
    "last_updated": "2025-01-08"
  }
}
```

### 成员数组结构
```json
{
  "members": [
    {
      "member_id": "mem_20250108_001",
      "name": "张三",
      "relationship": "father",
      "gender": "male",
      "birth_date": "1960-05-15",
      "blood_type": "A",
      "status": "living",
      "created_at": "2025-01-08T10:00:00.000Z",
      "personal_health": {
        "chronic_conditions": ["高血压"],
        "allergies": [],
        "medications": ["氨氯地平"],
        "genetic_tests": []
      }
    }
  ]
}
```

### 家族病史结构
```json
{
  "family_medical_history": {
    "hereditary_diseases": [
      {
        "disease_name": "高血压",
        "category": "cardiovascular",
        "affected_members": ["mem_001", "mem_002"],
        "inheritance_pattern": "complex",
        "age_range": {"min": 40, "max": 65, "avg": 52}
      }
    ],
    "common_conditions": [],
    "genetic_disorders": []
  }
}
```

### 风险评估结构
```json
{
  "risk_assessment": {
    "last_assessment_date": "2025-01-08",
    "hereditary_risks": [
      {
        "disease": "高血压",
        "risk_level": "high",
        "confidence": "medium",
        "affected_members": ["父亲"],
        "risk_factors": ["一级亲属患病", "早发(<50岁)"]
      }
    ],
    "preventive_recommendations": [
      {
        "category": "screening",
        "action": "定期血压监测",
        "frequency": "每周3次",
        "start_age": 35,
        "priority": "high"
      }
    ]
  }
}
```

## 错误处理

- **成员不存在**:"未找到成员XXX,请先使用 /family add-member 添加"
- **关系无效**:"关系类型XXX不支持,请使用:父亲/母亲/配偶/子女等"
- **年龄不合理**:"父母年龄应比子女大至少15岁"
- **数据不完整**:"请提供完整的成员信息,例如:/family add-member 父亲 张三 1960-05-15"
- **无数据**:"暂无家庭健康记录,请先添加家庭成员"
- **文件读取失败**:"无法读取家庭健康数据,请检查数据文件"

## 示例用法

```
# 添加家庭成员
/family add-member 父亲 张三 1960-05-15 A型血
/family add-member 母亲 李四 1962-08-20 B型血
/family add-member 配偶 王五 1988-12-05 O型血

# 记录家族病史
/family add-history 父亲 高血压 50岁确诊
/family add-history 母亲 糖尿病 55岁发病
/family add-history 祖父 冠心病 60岁

# 查看家庭成员
/family list

# 评估遗传风险
/family risk 高血压
/family risk

# 追踪健康数据
/family track 父亲 血压 135/85
/family track 母亲 血糖 7.2

# 生成报告
/family report
/family report html
```

## 注意事项

- 家族病史信息很重要,尽量完整记录
- 遗传风险仅供参考,不预测个体发病
- 建议定期更新家族病史信息
- 高风险人群应提前开始筛查
- 所有医疗决策请咨询专业医师
- 遗传咨询建议咨询专业遗传咨询师
- 数据隐私保护,所有信息仅保存在本地

## 集成模块

本模块与以下健康模块集成:

- **高血压管理** (`/bp`):追踪血压数据
- **糖尿病管理** (`/diabetes`):追踪血糖数据
- **用药管理** (`/medication`):追踪用药记录
- **营养管理** (`/nutrition`):追踪体重数据
- **健康趋势分析** (`health-trend-analyzer`):分析家庭健康趋势

---

**免责声明:本系统仅供健康记录使用,不替代专业医疗诊断和治疗。遗传风险评估仅供参考,具体风险请咨询专业医师或遗传咨询师。**
