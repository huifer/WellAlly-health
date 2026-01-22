---
description: 记录视力检查、眼部检查、眼病筛查和用眼习惯管理
arguments:
  - name: action
    description: 操作类型：vision(视力记录)/iop(眼压记录)/fundus(眼底检查)/screening(眼病筛查)/habit(用眼习惯)/status(眼健康状态)/trend(视力趋势)/checkup(检查提醒)/medication(眼科用药)
    required: true
  - name: info
    description: 详细信息（视力数值、检查结果等，自然语言描述）
    required: false
---

# 眼健康管理

全面的视力监测、眼部检查和眼病筛查管理。

## ⚠️ 医学安全声明

**重要提示：本系统仅供健康监测记录，不能替代专业医疗诊断和治疗。**

- ❌ 不给出具体眼科治疗方案
- ❌ 不推荐处方药物或手术方案
- ❌ 不诊断眼部疾病或判断预后
- ❌ 不替代眼科医生的专业检查
- ✅ 提供视力监测记录和趋势分析
- ✅ 提供眼部检查记录和提醒
- ✅ 提供眼病筛查记录（仅供参考）
- ✅ 提供用眼习惯建议和就医提醒

所有眼科诊断和治疗请遵从眼科医生指导。

## 操作类型

### 1. 记录视力检查 - `vision`

记录裸眼视力、矫正视力和屈光度数。

**参数说明：**
- `info`: 视力信息（必填），使用自然语言描述

**示例：**
```
/eye vision left 1.0 right 0.8
/eye vision uncorrected left 0.5 right 0.4
/eye vision corrected left 1.2 right 1.0
/eye vision sphere -3.5 cylinder -0.5 axis 180
/eye vision left sphere -3.5 cylinder -0.5 axis 180 right sphere -4.0
```

**支持的信息：**
- 裸眼视力（uncorrected）：0.1-2.0
- 矫正视力（corrected）：0.1-2.0
- 球镜度数（sphere）：-20.0 到 +20.0（负数为近视，正数为远视）
- 柱镜度数（cylinder）：0 到 -6.0（散光度数）
- 轴位（axis）：0-180度

**执行步骤：**
1. 解析视力数值和屈光度数
2. 生成记录ID和时间戳
3. 保存到 `data/eye-health-tracker.json`
4. 更新平均视力计算
5. 输出确认信息

### 2. 记录眼压 - `iop`

记录眼内压测量值。

**示例：**
```
/eye iop left 15 right 16
/eye iop 15 16
/eye iop left 15 right 16 Goldman 2025-01-15
/eye iop 14 15 早晨
```

**支持的信息：**
- 左眼眼压（mmHg）
- 右眼眼压（mmHg）
- 测量方法：Goldmann（金标准）/非接触式/手持式
- 测量时间：早晨/下午/晚上
- 参考范围：10-21 mmHg

**执行步骤：**
1. 解析眼压数值
2. 生成记录ID和时间戳
3. 保存到 `data/eye-health-tracker.json`
4. 更新平均眼压计算
5. 如果眼压>21，提示就医建议
6. 输出确认信息

### 3. 记录眼底检查 - `fundus`

记录眼底检查发现。

**示例：**
```
/eye fundus normal
/eye fundus diabetic_mild
/eye fundus hypertensive_grade_1
/eye fundus amd_drusen
/eye fundus 左眼正常 右眼可疑
```

**支持的检查发现：**
- 正常（normal）
- 糖尿病视网膜病变（diabetic_mild/moderate/severe/proliferative）
- 高血压视网膜病变（hypertensive_grade_0/1/2/3/4）
- 年龄相关性黄斑变性（amd_drusen/amd_atrophic/amd_exudative）
- 视网膜静脉阻塞（vessel_occlusion）
- 其他病变描述

**检查类型：**
- 散瞳眼底检查（dilated）
- 免散瞳眼底照相（non-dilated）
- OCT检查
- 血管造影

**执行步骤：**
1. 解析眼底检查结果
2. 生成记录ID和时间戳
3. 保存到 `data/eye-health-tracker.json`
4. 如果发现异常，提供就医建议
5. 输出确认信息

### 4. 眼病筛查 - `screening`

记录各类眼病筛查结果。

**示例：**
```
/eye screening glaucoma negative
/eye screening cataract grade_1
/eye screening amd early
/eye screening diabetic_retinopathy mild
/eye screening dry_eye moderate
```

**筛查类型：**

#### 青光眼（glaucoma）
- negative：阴性
- suspect：可疑
- early：早期
- moderate：中期
- advanced：晚期

#### 白内障（cataract）
- none：无白内障
- grade_1：轻度
- grade_2：中度
- grade_3：重度
- mature：成熟期

#### 黄斑变性（AMD）
- none：无病变
- early：早期（玻璃疣）
- intermediate：中期
- late：晚期（地图状萎缩或新生血管）

#### 糖尿病视网膜病变
- none：无病变
- mild：轻度非增生期
- moderate：中度非增生期
- severe：重度非增生期
- proliferative：增生期

#### 干眼症（dry_eye）
- none：无干眼
- mild：轻度
- moderate：中度
- severe：重度

**执行步骤：**
1. 解析筛查类型和结果
2. 更新对应筛查状态
3. 计算下次筛查时间
4. 保存到 `data/eye-health-tracker.json`
5. 如果筛查阳性，提供就医建议
6. 输出确认信息

### 5. 记录用眼习惯 - `habit`

记录日常用眼习惯和环境。

**示例：**
```
/eye habit screen 4hours outdoor 1hour
/eye habit break_20_20_20 yes
/eye habit distance 50cm lighting good
/eye habit 屏幕6小时 户外30分钟 用眼距离40cm
```

**支持的记录：**
- 屏幕使用时间（screen）：每天小时数
- 户外活动时间（outdoor）：每天小时数
- 20-20-20法则执行（break_20_20_20）：yes/no/partial
- 用眼距离（distance）：厘米数（建议≥40cm）
- 照明条件（lighting）：good/adequate/poor
- 其他习惯描述

**20-20-20法则：**
- 每20分钟用眼
- 向20英尺（约6米）外远眺
- 持续20秒

**执行步骤：**
1. 解析用眼习惯信息
2. 更新眼习惯记录
3. 提供个性化建议
4. 保存到 `data/eye-health-tracker.json`
5. 输出确认信息和建议

### 6. 查看眼健康状态 - `status`

查看综合眼健康评估报告。

**示例：**
```
/eye status
```

**输出内容：**
- 最近视力检查结果
- 最近眼压测量
- 眼底检查状态
- 筛查完成情况
- 用眼习惯评估
- 综合健康评分
- 优先改善建议

### 7. 查看视力趋势 - `trend`

查看视力变化趋势。

**示例：**
```
/eye trend
/eye trend 6months
/eye trend 1year
```

**输出内容：**
- 视力变化趋势图（文字描述）
- 近视度数变化
- 眼压变化趋势
- 视力进展速度评估
- 需要就医的警示信号

### 8. 检查提醒 - `checkup`

查看和设置眼科检查提醒。

**示例：**
```
/eye checkup
/eye checkup set routine 2025-06-15
/eye checkup set glaucoma 2025-12-15
```

**检查类型和频率建议：**

#### 常规眼科检查
- **成人（18-40岁）**：每2年1次
- **成人（40-60岁）**：每1-2年1次
- **成人（>60岁）**：每年1次
- **儿童/青少年**：每年1次

#### 青光眼筛查
- **高风险人群**（家族史、高度近视）：每年1次
- **一般人群**：40岁后每2-3年1次，60岁后每年1次

#### 糖尿病视网膜病变检查
- **1型糖尿病**：发病后5年开始，每年1次
- **2型糖尿病**：确诊后立即，每年1次
- **妊娠糖尿病**：妊娠期间或妊娠前检查

**输出内容：**
- 下次检查时间
- 检查项目清单
- 过期检查提醒
- 预约建议

### 9. 眼科用药管理 - `medication`

管理眼科相关用药（集成药物管理系统）。

**示例：**
```
/eye medication add 人工泪液 每天3次
/eye medication add 玻璃酸钠滴眼液 每天早晚各1次
/eye medication add 阿托品滴眼液 每晚1次（控制近视）
/eye medication list
/eye medication interaction
```

**执行流程：**
1. 解析药物信息
2. 调用 `/medication add` 命令添加药物
3. 在 eye-health-tracker.json 中添加引用记录
4. 输出确认信息

**引用格式：**
```json
{
  "medication_id": "med_xxx",
  "added_from": "eye_health_management",
  "added_date": "2025-01-02",
  "indication": "干眼症"
}
```

## 数据结构

### 视力记录结构
```json
{
  "id": "vision_20250102000001",
  "date": "2025-01-02",
  "left_eye": {
    "uncorrected_va": 0.5,
    "corrected_va": 1.0,
    "sphere": -3.50,
    "cylinder": -0.50,
    "axis": 180
  },
  "right_eye": {
    "uncorrected_va": 0.4,
    "corrected_va": 1.0,
    "sphere": -4.00,
    "cylinder": -0.75,
    "axis": 175
  },
  "exam_type": "routine",
  "exam_method": "snellen_chart",
  "notes": "",
  "created_at": "2025-01-02T00:00:00.000Z"
}
```

### 眼压记录结构
```json
{
  "id": "iop_20250102000001",
  "date": "2025-01-02",
  "time": "10:00",
  "left_iop": 15,
  "right_iop": 16,
  "measurement_method": "goldmann_applanation_tonometer",
  "reference_range": "10-21",
  "notes": "",
  "created_at": "2025-01-02T10:00:00.000Z"
}
```

### 眼底检查结构
```json
{
  "id": "fundus_20250102000001",
  "date": "2025-01-02",
  "exam_type": "dilated_fundus_exam",
  "findings": {
    "left_eye": "normal",
    "right_eye": "normal",
    "overall": "normal"
  },
  "specific_findings": {
    "optic_disc": "normal",
    "retina": "normal",
    "vessels": "normal",
    "macula": "normal"
  },
  "comments": "",
  "examined_by": "",
  "created_at": "2025-01-02T00:00:00.000Z"
}
```

## 视力分级参考

| 裸眼视力 | 评价 | 近视度数估计（参考） |
|---------|------|-------------------|
| 1.0-1.5 | 正常 | 0 ~ -0.5D |
| 0.8-0.9 | 轻度下降 | -0.5D ~ -1.5D |
| 0.4-0.7 | 中度下降 | -1.5D ~ -3.0D |
| 0.1-0.3 | 重度下降 | -3.0D ~ -6.0D |
| <0.1 | 极重度下降 | >-6.0D（高度近视） |

## 眼压参考值

| 分类 | 眼压（mmHg） |
|------|-------------|
| 正常眼压 | 10-21 |
| 眼压偏高 | 22-25 |
| 可疑青光眼 | 26-30 |
| 青光眼可能 | >30 |

## 筛查频率建议

### 成人常规检查
- 18-40岁：每2年1次
- 40-60岁：每1-2年1次
- >60岁：每年1次

### 高风险人群
- 糖尿病患者：每年1次眼底检查
- 高血压患者：每年1次眼底检查
- 高度近视（>-6.0D）：每年1次眼底检查
- 青光眼家族史：每年1次眼压和视野检查
- 40岁以上：每年1次眼压检查

## 用眼建议

### 屏幕使用建议
- 每天屏幕时间控制在4-6小时内
- 遵守20-20-20法则
- 保持适当距离（≥40cm）
- 屏幕顶部略低于视线水平

### 户外活动
- 每天至少1-2小时户外活动
- 自然光有助于预防近视进展
- 避免强光直射眼睛

### 照明环境
- 使用柔和均匀照明
- 避免眩光和反射
- 环境光与屏幕亮度匹配
- 阅读时光线从非惯用手侧照射

### 饮食建议
- 富含维生素A的食物（胡萝卜、菠菜）
- 富含Omega-3的食物（深海鱼类）
- 富含叶黄素的食物（羽衣甘蓝、西兰花）
- 富含维生素C的食物（柑橘类水果）

## 就医建议

### 紧急就医（立即就诊）
- 突然视力下降或视野缺损
- 眼部剧烈疼痛
- 眼前突然出现闪光感或飞蚊症增多
- 外伤后视力改变
- 急性视野丧失

### 尽快就医（48小时内）
- 视力持续下降
- 眼压持续>25 mmHg
- 眼底检查发现异常
- 眼病筛查阳性
- 持续眼红、眼痛

### 定期复查
- 常规检查：按上述频率建议
- 配镜后：1-2周复查
- 用药后：按医生指导复查
- 手术后：按医嘱复查

## 错误处理

- **视力值无效**："视力值应在0.1-2.0范围内"
- **眼压值无效**："眼压值应在5-50 mmHg范围内"
- **屈光度数无效**："度数应在合理范围内（球镜-20到+20，柱镜0到-6）"
- **信息不完整**："请提供完整的检查信息"
- **无数据**："暂无相关记录，请先记录数据"
- **文件读取失败**："无法读取眼健康数据，请检查数据文件"

## 示例用法

```
# 记录视力检查
/eye vision left 1.0 right 0.8
/eye vision sphere -3.5 cylinder -0.5 axis 180

# 记录眼压
/eye iop left 15 right 16

# 记录眼底检查
/eye fundus normal

# 眼病筛查
/eye screening glaucoma negative
/eye screening cataract grade_1

# 记录用眼习惯
/eye habit screen 4hours outdoor 1hour

# 查看状态和趋势
/eye status
/eye trend

# 检查提醒
/eye checkup

# 眼科用药
/eye medication add 人工泪液 每天3次
```

## 注意事项

- 视力检查应在良好照明下进行
- 眼压测量应避免在眼球按压后立即进行
- 眼底检查建议散瞳后进行（除闭角型青光眼可疑者）
- 筛查结果仅供参考，不能替代完整眼科检查
- 用眼习惯需要长期坚持才能见效
- 儿童和青少年视力需要特别关注

## 与其他系统集成

### 高血压眼底评估
```bash
# 在高血压系统中记录眼底评估
/bp retina grade-0
# 可链接到眼健康系统的详细检查记录
```

### 糖尿病视网膜病变
```bash
# 在糖尿病系统中记录视网膜病变
/diabetes retinopathy mild
# 可链接到眼健康系统的眼底检查
```

---

**命令版本**: v1.0
**创建日期**: 2026-01-06
**维护者**: WellAlly Tech
