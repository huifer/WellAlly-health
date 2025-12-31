# 孕期与产后功能扩展提案

**模块编号**: 05
**分类**: 按人群分类 - 孕期与产后
**状态**: 📝 待开发
**优先级**: 高
**创建日期**: 2025-12-31

---

## 功能概述

产后恢复追踪模块，全面关注产后身心健康恢复。

### 核心功能

1. **产后恢复时间表** - 42天、6个月、1年检查提醒
2. **产后身体恢复** - 恶露、子宫复旧、伤口愈合、盆底肌
3. **产后心理健康** - EPDS抑郁筛查、情绪支持
4. **哺乳管理** - 喂奶方式、频率、乳腺炎预防
5. **产后避孕指导** - 避孕方式选择和建议

---

## 数据结构

```json
{
  "postpartum_tracking": {
    "delivery_date": "2025-01-01",
    "delivery_mode": "vaginal",
    "postpartum_days": 45,
    "parity": 1,

    "recovery_assessment": {
      "lochia": {
        "current": "white",
        "duration_days": 25,
        "normal": true
      },
      "uterine_involution": {
        "fundal_height": "below_pubis",
        "completed": true,
        "days_postpartum": 28
      },
      "perineal_wound": {
        "present": true,
        "healed": true,
        "episiotomy": true
      },
      "c_section_incision": {
        "present": false
      },
      "pelvic_floor": {
        "assessment": "mild_weakness",
        "urinary_incontinence": "stress",
        "frequency": "occasional"
      }
    },

    "mental_health": {
      "epds_score": 8,
      "screening_date": "2025-02-10",
      "interpretation": "normal",
      "bonding": "good"
    },

    "breastfeeding": {
      "mode": "exclusive",
      "frequency": "8-10_per_day",
      "latch": "good",
      "milk_supply": "adequate",
      "issues": [],
      "mastitis": {
        "history": false
      }
    },

    "contraception": {
      "method": "condom",
      "satisfied": true,
      "planned_method": "IUD",
      "timeline": "3_months_postpartum"
    },

    "checkups": [
      {
        "type": "6_week_checkup",
        "scheduled": "2025-02-12",
        "completed": true,
        "findings": "normal_recovery"
      },
      {
        "type": "6_month_checkup",
        "scheduled": "2025-07-01",
        "completed": false
      }
    ]
  }
}
```

---

## 命令接口

```bash
/postpartum start 2025-01-01 vaginal       # 开始产后追踪
/postpartum recovery lochia white         # 记录恶露情况
/postpartum recovery uterine normal       # 记录子宫复旧
/postpartum epds                           # 进行产后抑郁筛查
/postpartum breastfeeding exclusive       # 记录哺乳情况
/postpartum contraception IUD             # 记录避孕方式
/postpartum status                        # 查看产后状态
```

---

## 注意事项

- 产后6周检查很重要
- 异常出血需就医
- 抑郁症状需重视
- 哺乳问题需咨询
- 避孕需尽早考虑

---

**文档版本**: v1.0
**最后更新**: 2025-12-31
**维护者**: WellAlly Tech
