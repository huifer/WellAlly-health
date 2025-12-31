# 皮肤健康管理功能扩展提案

**模块编号**: 12
**分类**: 通用功能扩展 - 皮肤健康
**状态**: 📝 待开发
**优先级**: 低
**创建日期**: 2025-12-31

---

## 功能概述

皮肤健康模块提供全面的皮肤问题记录、痣的监测和护肤管理。

### 核心功能

1. **皮肤问题记录** - 痤疮、湿疹、色斑等
2. **痣的监测** - ABCDE法则、皮肤肿瘤筛查
3. **护肤记录** - 皮肤类型、护肤程序
4. **日晒防护** - SPF使用、日晒伤记录

---

## 数据结构

```json
{
  "skin_health": {
    "skin_type": "combination",
    "concerns": ["acne", "pigmentation"],

    "conditions": [
      {
        "type": "acne",
        "severity": "moderate",
        "affected_areas": ["forehead", "chin"],
        "ongoing": true
      }
    ],

    "moles_tracking": [
      {
        "location": "back",
        "size": "4mm",
        "appearance": "flat",
        "color": "brown",
        "asymmetry": false,
        "border": "regular",
        "date": "2025-06-15"
      }
    ],

    "skincare_routine": {
      "morning": ["cleanser", "moisturizer", "spf30"],
      "evening": ["cleanser", "serum", "moisturizer"]
    },

    "skin_exam_reminder": "2026-06-15"
  }
}
```

---

## 命令接口

```bash
/skin concern acne forehead              # 记录皮肤问题
/skin mole back 4mm                      # 记录痣的监测
/skin routine morning cleanser           # 记录护肤程序
/skin exam                               # 记录皮肤检查
/skin status                             # 查看皮肤健康状态
```

---

## 注意事项

- 痣的变化需及时就医
- ABCDE法则自查
- 防晒很重要
- 保持皮肤清洁

---

**文档版本**: v1.0
**最后更新**: 2025-12-31
**维护者**: WellAlly Tech
