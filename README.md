# 个人医疗数据中心 (Personal Health Information System)

基于文件系统的个人医疗健康数据管理系统，使用 Claude Code 命令行工具进行数据管理。

## 项目开发方

本项目由 [WellAlly Tech](https://www.wellally.tech/) 开发和维护。

## 系统特点

- 📁 纯文件系统存储，无需数据库
- 🖼️ 支持医疗检查单图片智能识别
- 📊 自动提取生化检查指标和参考范围
- 🔍 支持影像检查结构化数据提取
- 🔪 手术历史记录和植入物管理
- 📋 出院小结结构化存储
- 👨‍⚕️ 多学科专家会诊系统（MDT）
- 🔬 9大专科智能分析
- ☢️ 医学辐射剂量追踪和管理
- 👤 用户基础档案管理
- 💾 本地存储，数据完全私有
- 🚀 使用 Claude Code 命令操作，无需编程

## 目录结构

```
my-his/
├── .claude/
│   ├── commands/
│   │   ├── save-report.md    # 保存检查单命令
│   │   ├── query.md          # 查询记录命令
│   │   ├── profile.md        # 用户基础参数设置命令
│   │   ├── radiation.md      # 辐射暴露管理命令
│   │   ├── surgery.md        # 手术历史记录命令
│   │   ├── discharge.md      # 出院小结管理命令
│   │   ├── consult.md        # 多学科专家会诊命令
│   │   └── specialist.md     # 单专科咨询命令
│   └── specialists/
│       ├── cardiology.md            # 心内科专家 Skill
│       ├── endocrinology.md         # 内分泌科专家 Skill
│       ├── gastroenterology.md      # 消化科专家 Skill
│       ├── nephrology.md            # 肾内科专家 Skill
│       ├── hematology.md            # 血液科专家 Skill
│       ├── respiratory.md           # 呼吸科专家 Skill
│       ├── neurology.md             # 神经内科专家 Skill
│       ├── oncology.md              # 肿瘤科专家 Skill
│       ├── general.md               # 全科专家 Skill
│       └── consultation-coordinator.md # 会诊协调器
├── data/
│   ├── profile.json          # 用户基础档案
│   ├── radiation-records.json # 辐射暴露记录
│   ├── 生化检查/             # 生化检验数据
│   │   └── YYYY-MM/
│   │       └── YYYY-MM-DD_检查项目.json
│   ├── 影像检查/             # 影像检查数据
│   │   └── YYYY-MM/
│   │       ├── YYYY-MM-DD_检查项目_部位.json
│   │       └── images/       # 原始图片备份
│   ├── 手术记录/             # 手术历史数据
│   │   └── YYYY-MM/
│   │       └── YYYY-MM-DD_手术名称.json
│   ├── 出院小结/             # 出院小结数据
│   │   └── YYYY-MM/
│   │       └── YYYY-MM-DD_主要诊断.json
│   └── index.json            # 全局索引文件
└── README.md
```

## 快速导航

- 📖 [完整使用指南](docs/user-guide.md) - 详细的命令使用说明和示例
- 📋 [数据结构说明](docs/data-structures.md) - JSON 数据格式和字段说明
- 🔧 [技术实现细节](docs/technical-details.md) - 系统架构和技术细节
- ⚠️ [安全原则和使用限制](docs/safety-guidelines.md) - 使用安全原则和免责声明

## 快速开始

1. 确保已安装 Claude Code
2. 在当前目录打开 Claude Code
3. 首次使用先设置基础参数：`/profile set 175 70 1990-01-01`
4. 使用 `/save-report /path/to/image.jpg` 保存第一张检查单
5. 使用 `/radiation add CT 胸部` 记录辐射检查
6. 使用 `/surgery 去年8月做了胆囊切除手术，因为胆囊结石` 记录手术历史
7. 使用 `/discharge @医疗报告/出院小结.jpg` 保存出院小结
8. 使用 `/query all` 查看所有记录
9. 使用 `/consult` 启动多学科专家会诊

## 数据隐私

- 所有数据存储在本地文件系统
- 不上传到任何云端服务
- 不依赖外部数据库
- 完全私有化管理

## 核心命令一览

| 命令 | 功能 | 说明 |
|------|------|------|
| `/profile` | 用户基础参数 | 设置身高、体重、出生日期 |
| `/save-report` | 保存检查单 | 支持生化和影像检查 |
| `/radiation` | 辐射管理 | 记录和追踪辐射暴露 |
| `/surgery` | 手术历史 | 记录手术信息和植入物 |
| `/discharge` | 出院小结 | 保存和结构化出院小结 |
| `/query` | 查询记录 | 多条件查询医疗数据 |
| `/consult` | 多学科会诊 | 9大专科综合分析 |
| `/specialist` | 单专科咨询 | 咨询特定专科专家 |

> 💡 详细使用方法请参考 [完整使用指南](docs/user-guide.md)

## 技术特点

- **存储方式**: JSON 文件 + 文件系统目录结构
- **命令系统**: Claude Code Slash Commands
- **专家系统**: 多专科 Skill 定义 + Subagent 架构
- **会诊协调**: 并行处理 + 意见整合算法
- **图片识别**: AI 视觉分析
- **数据提取**: 智能文字识别与结构化
- **辐射计算**: 体表面积调整 + 指数衰减模型

> 🔧 更多技术细节请参考 [技术实现细节](docs/technical-details.md)

## ⚠️ 重要安全声明

本系统严格遵守医疗安全原则：

1. **不给出具体用药剂量**
2. **不直接开具处方药名**
3. **不判断生死预后**
4. **不替代医生诊断**

本系统所有分析报告仅供参考，不作为医疗诊断依据。所有诊疗决策需咨询专业医生。如有紧急情况，请立即就医。

> ⚠️ 完整的安全原则和使用限制请参考 [安全原则文档](docs/safety-guidelines.md)

## 许可

本系统仅供个人健康管理使用，不作为医疗诊断依据。
