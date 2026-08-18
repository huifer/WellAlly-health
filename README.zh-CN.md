# WellAlly Health — 隐私优先的个人健康智能管理系统

[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.md)
[![中文](https://img.shields.io/badge/lang-中文-red.svg)](README.zh-CN.md)

[![GitHub stars](https://img.shields.io/github/stars/huifer/WellAlly-health?style=social)](https://github.com/huifer/WellAlly-health)
[![GitHub forks](https://img.shields.io/github/forks/huifer/WellAlly-health?style=social)](https://github.com/huifer/WellAlly-health)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Last Commit](https://img.shields.io/github/last-commit/huifer/WellAlly-health)](https://github.com/huifer/WellAlly-health/commits/main)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/huifer/WellAlly-health/blob/main/.github/CONTRIBUTING.md)
[![Made with Claude Code](https://img.shields.io/badge/made%20with-Claude%20Code-ff6f00.svg)](https://claude.com/claude-code)
[![Star History Chart](https://star-history.dera.page/svg?repos=huifer/WellAlly-health&type=date&legend=top-left)](https://star-history.dera.page/#huifer/WellAlly-health&type=date&legend=top-left)

**WellAlly Health** 是一套**本地优先、由 AI 驱动的个人信息健康档案（PHR）系统**。它把你的化验单、处方、影像报告和日常健康记录，变成一份完全存放在你自己电脑上的、可检索、结构化的健康知识库——无需上云、无需数据库、无需注册账号。

> **GitHub**: https://github.com/huifer/WellAlly-health

> **⚠️ 免责声明**：本项目与 [Anthropic](https://www.anthropic.com/) 或 [Claude.ai](https://claude.ai/) **没有任何关联、背书或从属关系**。本项目是由 [WellAlly Tech](https://www.wellally.tech/) 独立开发的独立开源项目。WellAlly Health 基于 Claude Code 命令行工具构建，并使用 AI 图像识别（如 GLM 的 `mcp__4_5v_mcp__analyze_image`）进行文档理解。
>
> **本项目不是医疗器械。** 所有分析结果仅供个人参考，绝不能替代专业医疗建议。

## 目录

- [为什么选择 WellAlly Health](#为什么选择-wellally-health)
- [✨ 核心特性](#-核心特性)
- [🚀 快速开始](#-快速开始)
- [📂 目录结构](#-目录结构)
- [🧩 命令总览（60+）](#-命令总览60)
- [👨‍⚕️ 专科领域](#-专科领域)
- [🛠️ 分析技能](#️-分析技能)
- [🔧 技术架构](#-技术架构)
- [💊 药物相互作用数据库](#-药物相互作用数据库)
- [🔒 数据隐私](#-数据隐私)
- [🗺️ 路线图](#️-路线图)
- [🤝 贡献指南](#-贡献指南)
- [🛡️ 安全](#️-安全)
- [⚠️ 重要安全声明](#-重要安全声明)
- [📄 许可证](#-许可证)

## 为什么选择 WellAlly Health

你的健康数据散落在各家医院系统、纸质打印单、手机照片和记忆里；而商业 App 往往要求你把它们上传到「它们」的云端。WellAlly Health 反其道而行：

- **🔒 真正私密**——所有数据以纯文件形式存在你的磁盘上，绝不出本机。
- **📄 零负担录入**——丢一张化验单或出院小结的照片进来，AI 自动提取结构化数据。
- **🧠 懂你病史的 AI**——药物冲突检测、多学科分析、趋势追踪都基于「你」的记录。
- **🗂️ 统一可检索的真相源**——生化指标、影像、手术、辐射暴露、用药、过敏史，一处归集。
- **♻️ 永远属于你**——开放的 JSON + Markdown 格式，无锁定，随时备份导出。

WellAlly Health 是为「想要 AI 辅助、又不肯交出医疗隐私」的人准备的**个人健康档案（PHR）/ 个人健康信息系统（PHIS）**。

## ✨ 核心特性

**本地优先与隐私**
- 📁 纯文件存储（JSON + Markdown），**无需数据库**
- 💾 100% 本机运行——无上传、无埋点、无外部账号
- 🔓 开放格式，完全拥有、可任意备份

**智能医疗文档理解**
- 🖼️ 医疗检查单图片智能识别（OCR + AI 结构化）
- 📊 自动提取生化指标与参考范围
- 🔍 影像检查结构化数据提取
- 📋 出院小结结构化存储

**临床安全智能**
- 💊 **药物相互作用检测**——药物–药物、药物–疾病、药物–剂量、药物–食物
- 🚨 **五级严重程度预警**（A / B / C / D / X，X = 绝对禁忌）
- ☢️ 医学辐射剂量追踪（体表面积调整 + 衰减模型）
- 🔪 手术史与植入物管理
- 👤 用户档案、过敏史、用药管理

**多学科专业能力**
- 👨‍⚕️ **多学科会诊（MDT）**覆盖 16 个专科领域
- 🔬 13+ 单专科深度分析
- 🧩 20 个专项分析技能（睡眠、营养、运动、心理、中医体质等）

**全生命周期覆盖**
- 🧒 儿童健康（发育、疾病、营养、睡眠、疫苗、安全）
- 🤰 女性 / 男性健康（经期、孕期、产后、更年期、生育、前列腺）
- 🩺 慢病管理（糖尿病、高血压、慢阻肺、认知健康）
- 🧘 生活方式与康养（饮食、目标、出行、职业、康复）
- 🌿 中医体质辨识

## 🚀 快速开始

> 前置条件：已安装 [Claude Code](https://claude.com/claude-code)，并在本项目目录中打开。

```bash
# 1. 首次设置 —— 身高(cm) 体重(kg) 出生日期
/profile set 175 70 1990-01-01

# 2. 用图片保存第一张检查单
/save-report /path/to/image.jpg

# 3. 记录一次放射检查
/radiation add CT 胸部

# 4. 用自然语言记录过往手术
/surgery 去年8月做了胆囊切除手术，因为胆囊结石

# 5. 用照片保存出院小结
/discharge @医疗报告/出院小结.jpg

# 6. 查看所有记录
/query all

# 7. 启动多学科专家会诊
/consult
```

无需编程、无需服务器、无需注册。

## 📂 目录结构

```
my-his/
├── .claude/
│   ├── commands/            # 60+ 斜杠命令（见命令总览）
│   │   ├── save-report.md
│   │   ├── query.md
│   │   ├── profile.md
│   │   ├── radiation.md
│   │   ├── surgery.md
│   │   ├── discharge.md
│   │   ├── medication.md
│   │   ├── interaction.md
│   │   ├── consult.md
│   │   └── specialist.md
│   └── specialists/         # 16 专科 + MDT 协调器 Skill
├── data/
│   ├── profile.json          # 用户基础档案
│   ├── radiation-records.json
│   ├── allergies.json
│   ├── interactions/         # 药物相互作用数据库 + 日志
│   │   ├── interaction-db.json
│   │   └── interaction-logs/
│   ├── medications/
│   ├── 生化检查/             # 生化检验数据（YYYY-MM/...）
│   ├── 影像检查/             # 影像检查数据 + 图片备份
│   ├── 手术记录/             # 手术历史
│   ├── 出院小结/             # 出院小结
│   └── index.json            # 全局索引
└── README.md
```

## 🧩 命令总览（60+）

WellAlly Health 内置 **62 个斜杠命令**，按领域精选：

**核心数据管理**
`/profile` · `/get-profile` · `/query` · `/save-report` · `/report` · `/report-instructions` · `/prepare` · `/ai` · `/consult` · `/specialist` · `/allergy` · `/medication` · `/interaction` · `/surgery` · `/discharge` · `/radiation` · `/radiation-data` · `/symptom` · `/screening` · `/polypharmacy`

**专科分析**
`/sleep` · `/nutrition` · `/diet` · `/fitness` · `/mental-health` · `/mood` · `/psych-assess` · `/cognitive` · `/tcm-constitution` · `/skin-health` · `/oral-health` · `/eye-health` · `/ent` · `/sexual-health` · `/occupational-health` · `/rehabilitation` · `/infection` · `/rheumatology`

**儿童与家庭**
`/family` · `/child-development` · `/child-illness` · `/child-mental` · `/child-nutrition` · `/child-safety` · `/child-sleep` · `/child-vaccine`

**女性与男性健康**
`/cycle` · `/pregnancy` · `/postpartum` · `/menopause` · `/puberty` · `/male-menopause` · `/male-fertility` · `/prostate-health`

**慢病与老龄**
`/hypertension` · `/diabetes` · `/copd` · `/growth` · `/vaccine` · `/vaccination` · `/travel-health` · `/fall` · `/goal`

> 💡 完整命令说明与示例：[用户指南（中文）](docs/user-guide.md) · [User Guide (EN)](docs/user-guide.en.md)

## 👨‍⚕️ 专科领域

16 个临床专科领域，由 MDT 会诊协调器统一编排：

| # | 专科 | # | 专科 |
|---|------|---|------|
| 1 | 心内科 Cardiology | 9 | 神经内科 Neurology |
| 2 | 皮肤科 Dermatology | 10 | 肿瘤科 Oncology |
| 3 | 内分泌科 Endocrinology | 11 | 骨科 Orthopedics |
| 4 | 消化科 Gastroenterology | 12 | 儿科 Pediatrics |
| 5 | 全科 General Practice | 13 | 精神科 Psychiatry |
| 6 | 老年科 Geriatrics | 14 | 呼吸科 Respiratory |
| 7 | 妇科 Gynecology | 15 | 泌尿科 Urology |
| 8 | 血液科 Hematology | 16 | 肾内科 Nephrology |

使用 `/consult` 发起完整 MDT 会诊，或用 `/specialist <专科>` 进行单科深度分析。

## 🛠️ 分析技能

为上述命令提供能力的 20 个可复用分析技能：

`ai-analyzer` · `emergency-card` · `family-health-analyzer` · `fitness-analyzer` · `food-database-query` · `goal-analyzer` · `health-trend-analyzer` · `infection-specialist` · `mental-health-analyzer` · `nutrition-analyzer` · `occupational-health-analyzer` · `oral-health-analyzer` · `rehabilitation-analyzer` · `sexual-health-analyzer` · `skin-health-analyzer` · `sleep-analyzer` · `tcm-constitution-analyzer` · `travel-health-analyzer` · `weightloss-analyzer` · `wellally-tech`

## 🔧 技术架构

- **存储方式**：JSON 文件 + 文件系统目录结构（无数据库、可移植）
- **命令系统**：Claude Code 斜杠命令（自然语言友好）
- **专家系统**：多专科 Skill 定义 + Subagent 架构
- **会诊协调**：并行处理 + 意见整合算法
- **文档理解**：AI 视觉分析 + 智能文字识别与结构化
- **辐射建模**：体表面积调整 + 指数衰减模型

> 🔧 深入阅读：[技术实现细节](docs/technical-details.md) · [数据结构说明](docs/data-structures.md)

## 💊 药物相互作用数据库

内置**药物相互作用检测**，覆盖药物–药物、药物–疾病、药物–剂量、药物–食物四类，采用**五级严重程度分级（A/B/C/D/X）**。

- 🔍 自动检测当前用药组合的相互作用
- 🚨 按严重程度分级预警（A = 可忽略 → X = 绝对禁忌）
- 📋 提供详细的管理建议与监测指标
- 💾 支持自定义规则与检查历史

```bash
/interaction check      # 检查当前用药
/interaction list       # 列出所有规则
/interaction list X     # 查看绝对禁忌规则
```

> 📖 [药物相互作用数据库完整说明](docs/drug-interaction-database.md) —— 欢迎医疗专业人士贡献完善。

## 🔒 数据隐私

- ✅ 所有数据存储在本地文件系统
- ✅ 不上传任何云端服务
- ✅ 不依赖外部数据库或网络
- ✅ 完全私有、可移植、可导出

WellAlly Health 是为把医疗病史视为高度私密的人而设计的。

## 🗺️ 路线图

- 扩展专科覆盖与更深的纵向趋势分析
- 更丰富的数据可视化与导出格式
- 社区共建的相互作用规则与知识库
- 支持本地大模型的完全离线运行

设计笔记见 [`docs/plans`](docs/plans)。

## 🤝 贡献指南

欢迎各种贡献！无论是新命令、专科 Skill、相互作用规则、翻译还是文档，我们都期待你的参与。

- 📖 [贡献指南](.github/CONTRIBUTING.md)
- 🐛 [报告问题](https://github.com/huifer/WellAlly-health/issues/new?template=bug_report.md)
- 💡 [功能建议](https://github.com/huifer/WellAlly-health/issues/new?template=feature_request.md)
- 🏷️ 从 [**good first issue**](https://github.com/huifer/WellAlly-health/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) 开始
- 💬 在 [GitHub Discussions](https://github.com/huifer/WellAlly-health/discussions) 参与讨论

## 🛡️ 安全

发现安全漏洞？请遵循我们的[安全政策](.github/SECURITY.md) 私下报告——**不要**公开提 Issue。

## ⚠️ 重要安全声明

本系统严格遵守医疗安全原则：

1. **不给出具体用药剂量**
2. **不直接开具处方药名**
3. **不判断生死预后**
4. **不替代医生诊断**

本系统所有分析报告仅供参考，不作为医疗诊断依据。所有诊疗决策需咨询专业医生。如有紧急情况，请立即就医。

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源许可证。

**重要声明**：本系统仅供个人健康管理使用，不作为医疗诊断依据。

---

由 [WellAlly Tech](https://www.wellally.tech/) 开发和维护。
