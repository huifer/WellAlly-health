# 职业健康管理功能扩展提案

**模块编号**: 18
**分类**: 通用功能扩展 - 职业健康
**状态**: 📝 待开发
**优先级**: 低
**创建日期**: 2025-12-31

---

## 功能概述

职业健康模块提供工作相关健康风险评估和管理。

### 核心功能

1. **职业健康风险评估** - 久坐、视屏终端、倒班工作
2. **工作相关疾病** - 颈肩腰腿痛、腕管综合征
3. **工作环境评估** - 人机工程、照明、姿势
4. **职业病筛查** - 听力损失、肺病、皮肤病

---

## 数据结构

```json
{
  "occupational_health": {
    "work_type": "office_work",
    "work_hours_daily": 8,
    "screen_time_daily": 7,
    "sedentary_time_daily": 6,

    "risk_factors": [
      "prolonged_sitting",
      "screen_use",
      "repetitive_strain"
    ],

    "work_related_issues": [
      {
        "issue": "neck_pain",
        "severity": "moderate",
        "frequency": "often",
        "work_related": true
      }
    ],

    "ergonomic_assessment": {
      "chair_adjustable": true,
      "monitor_height": "eye_level",
      "lighting": "adequate",
      "break_reminders": "every_hour"
    },

    "recommendations": [
      "take_breaks_20_min_every_hour",
      "stretch_exercises",
      "monitor_distance_50-70cm",
      "adjust_chair_height"
    ]
  }
}
```

---

## 命令接口

```bash
/work assess                              # 进行职业健康评估
/work issue neck_pain moderate            # 记录工作相关问题
/work ergonomic chair_adjustable          # 记录人机工程学评估
/work status                              # 查看职业健康状态
```

---

## 注意事项

- 定时休息
- 正确姿势
- 人体工程设备
- 定期体检

---

**文档版本**: v1.0
**最后更新**: 2025-12-31
**维护者**: WellAlly Tech
