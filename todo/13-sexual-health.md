# 性健康管理功能扩展提案

**模块编号**: 13
**分类**: 通用功能扩展 - 性健康
**状态**: 📝 待开发
**优先级**: 中
**创建日期**: 2025-12-31

---

## 功能概述

性健康模块提供男女性功能评估和性传播疾病筛查管理。

### 核心功能

1. **男性性健康** - IIEF-5评分、性欲评估
2. **女性性健康** - 性欲、性交痛、高潮障碍
3. **STD筛查** - HIV、梅毒、淋病、衣原体等
4. **避孕管理** - 避孕方式、效果、副作用

---

## 数据结构

```json
{
  "sexual_health": {
    "male": {
      "iief5_score": 18,
      "assessment": "mild_ed",
      "libido": "normal",
      "ejaculation": "normal"
    },

    "std_screening": {
      "last_screening": "2025-06-15",
      "hiv": "negative",
      "syphilis": "negative",
      "chlamydia": "negative",
      "gonorrhea": "negative",
      "hpv": "negative",
      "hepatitis_b": "immune"
    },

    "contraception": {
      "method": "condom",
      "effectiveness": "high",
      "side_effects": "none"
    }
  }
}
```

---

## 命令接口

```bash
/sexual iief5 18                         # 进行IIEF-5评分
/sexual std screening                    # 记录STD筛查结果
/sexual contraception condom             # 记录避孕方式
/sexual status                           # 查看性健康状态
```

---

## 注意事项

- 定期STD筛查
- 安全性行为
- 及时就医
- 开放沟通

---

**文档版本**: v1.0
**最后更新**: 2025-12-31
**维护者**: WellAlly Tech
