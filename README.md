# WellAlly Health — Privacy-First Personal Health Intelligence System

[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.md)
[![中文](https://img.shields.io/badge/lang-中文-red.svg)](README.zh-CN.md)

[![GitHub stars](https://img.shields.io/github/stars/huifer/WellAlly-health?style=social)](https://github.com/huifer/WellAlly-health)
[![GitHub forks](https://img.shields.io/github/forks/huifer/WellAlly-health?style=social)](https://github.com/huifer/WellAlly-health)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Last Commit](https://img.shields.io/github/last-commit/huifer/WellAlly-health)](https://github.com/huifer/WellAlly-health/commits/main)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/huifer/WellAlly-health/blob/main/.github/CONTRIBUTING.md)
[![Made with Claude Code](https://img.shields.io/badge/made%20with-Claude%20Code-ff6f00.svg)](https://claude.com/claude-code)
[![Star History Chart](https://star-history.dera.page/svg?repos=huifer/WellAlly-health&type=date&legend=top-left)](https://star-history.dera.page/#huifer/WellAlly-health&type=date&legend=top-left)

**WellAlly Health** is a local-first, AI-powered **personal health record (PHR)** system. It turns your medical reports, prescriptions, imaging, and daily health tracking into a private, searchable, structured knowledge base that runs entirely on your own machine — no cloud, no database server, no account required.

> **GitHub**: https://github.com/huifer/WellAlly-health

> **⚠️ Disclaimer**: This project is **NOT** affiliated with, endorsed by, or associated with [Anthropic](https://www.anthropic.com/) or [Claude.ai](https://claude.ai/). It is an independent open-source project developed by [WellAlly Tech](https://www.wellally.tech/). WellAlly Health is built on top of Claude Code's command-line tooling and uses AI image recognition (e.g. GLM `mcp__4_5v_mcp__analyze_image`) for document understanding.
>
> **This is not a medical device.** All analysis is for personal reference only and must never replace professional medical advice.

## Table of Contents

- [Why WellAlly Health](#why-wellally-health)
- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📂 Directory Structure](#-directory-structure)
- [🧩 Command Reference (60+)](#-command-reference-60)
- [👨‍⚕️ Specialist Domains](#-specialist-domains)
- [🛠️ Analysis Skills](#️-analysis-skills)
- [🔧 Technical Architecture](#-technical-architecture)
- [💊 Drug Interaction Database](#-drug-interaction-database)
- [🔒 Data Privacy](#-data-privacy)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [🛡️ Security](#️-security)
- [⚠️ Important Safety Statement](#-important-safety-statement)
- [📄 License](#-license)

## Why WellAlly Health

Your health data is scattered across hospital portals, paper printouts, photos, and memory. Commercial apps ask you to upload it to *their* cloud. WellAlly Health takes the opposite approach:

- **🔒 Truly private** — everything lives in plain files on your disk. Nothing leaves your machine.
- **📄 Zero effort ingestion** — drop in a photo of a lab report or discharge summary; AI extracts the structured data for you.
- **🧠 AI that knows your history** — drug-interaction checks, multi-specialty analysis, and trend tracking all understand *your* records.
- **🗂️ One searchable source of truth** — biochemical values, imaging, surgeries, radiation exposure, medications, and allergies in one place.
- **♻️ Yours forever** — open JSON + Markdown format, no lock-in, easy to back up or export.

WellAlly Health is the **personal health record (PHR)** / **personal health information system (PHIS)** for people who want AI assistance *without* surrendering their medical privacy.

## ✨ Features

**Local-first & private**
- 📁 Pure file-based storage (JSON + Markdown), **no database required**
- 💾 100% on-device — no uploads, no telemetry, no external accounts
- 🔓 Open format you fully own and can back up anywhere

**Intelligent medical document understanding**
- 🖼️ Medical report image recognition (OCR + AI structuring)
- 📊 Automatic biochemical test value & reference-range extraction
- 🔍 Structured medical imaging data extraction
- 📋 Structured discharge summary storage

**Clinical safety intelligence**
- 💊 **Drug interaction detection** — drug–drug, drug–disease, drug–dose, drug–food
- 🚨 **Five-level severity warning system** (A / B / C / D / X, where X = absolute contraindication)
- ☢️ Medical radiation dose tracking (BSA-adjusted + decay model)
- 🔪 Surgery history & implant management
- 👤 User profile, allergy, and medication management

**Multi-disciplinary expertise**
- 👨‍⚕️ **Multi-Disciplinary Team (MDT) consultation** across 16 specialty domains
- 🔬 13+ single-specialist deep-dive analyses
- 🧩 20 specialized analysis skills (sleep, nutrition, fitness, mental health, TCM constitution, and more)

**Whole-lifecycle coverage**
- 🧒 Child health (development, illness, nutrition, sleep, vaccination, safety)
- 🤰 Women's & men's health (cycle, pregnancy, postpartum, menopause, fertility, prostate)
- 🩺 Chronic disease management (diabetes, hypertension, COPD, cognitive health)
- 🧘 Lifestyle & wellness (diet, goal, travel, occupational, rehabilitation)
- 🌿 Traditional Chinese Medicine constitution analysis

## 🚀 Quick Start

> Prerequisite: [Claude Code](https://claude.com/claude-code) installed and opened in this project directory.

```bash
# 1. First-time setup — set height(cm) weight(kg) birthdate
/profile set 175 70 1990-01-01

# 2. Save your first lab report from an image
/save-report /path/to/image.jpg

# 3. Record a radiation scan
/radiation add CT chest

# 4. Record a past surgery in plain language
/surgery Gallbladder removal surgery in August last year due to gallstones

# 5. Save a discharge summary from a photo
/discharge @医疗报告/出院小结.jpg

# 6. Query everything
/query all

# 7. Start a multi-disciplinary consultation
/consult
```

That's it — no programming, no server, no sign-up.

## 📂 Directory Structure

```
my-his/
├── .claude/
│   ├── commands/            # 60+ slash commands (see Command Reference)
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
│   └── specialists/         # 16 specialty + MDT coordinator Skills
├── data/
│   ├── profile.json          # User basic profile
│   ├── radiation-records.json
│   ├── allergies.json
│   ├── interactions/         # Drug interaction database + logs
│   │   ├── interaction-db.json
│   │   └── interaction-logs/
│   ├── medications/
│   ├── 生化检查/             # Biochemical test data (YYYY-MM/...)
│   ├── 影像检查/             # Medical imaging data + image backups
│   ├── 手术记录/             # Surgery history
│   ├── 出院小结/             # Discharge summaries
│   └── index.json            # Global index
└── README.md
```

## 🧩 Command Reference (60+)

WellAlly Health ships **62 slash commands**. Highlights by domain:

**Core data management**
`/profile` · `/get-profile` · `/query` · `/save-report` · `/report` · `/report-instructions` · `/prepare` · `/ai` · `/consult` · `/specialist` · `/allergy` · `/medication` · `/interaction` · `/surgery` · `/discharge` · `/radiation` · `/radiation-data` · `/symptom` · `/screening` · `/polypharmacy`

**Specialty analysis**
`/sleep` · `/nutrition` · `/diet` · `/fitness` · `/mental-health` · `/mood` · `/psych-assess` · `/cognitive` · `/tcm-constitution` · `/skin-health` · `/oral-health` · `/eye-health` · `/ent` · `/sexual-health` · `/occupational-health` · `/rehabilitation` · `/infection` · `/rheumatology`

**Child & family**
`/family` · `/child-development` · `/child-illness` · `/child-mental` · `/child-nutrition` · `/child-safety` · `/child-sleep` · `/child-vaccine`

**Women's & men's health**
`/cycle` · `/pregnancy` · `/postpartum` · `/menopause` · `/puberty` · `/male-menopause` · `/male-fertility` · `/prostate-health`

**Chronic disease & aging**
`/hypertension` · `/diabetes` · `/copd` · `/growth` · `/vaccine` · `/vaccination` · `/travel-health` · `/fall` · `/goal`

> 💡 Full command specs and examples: [User Guide (EN)](docs/user-guide.en.md) · [用户指南（中文）](docs/user-guide.md)

## 👨‍⚕️ Specialist Domains

16 clinical specialty domains, coordinated by an MDT consultation orchestrator:

| # | Specialty | # | Specialty |
|---|-----------|---|-----------|
| 1 | Cardiology (心内科) | 9 | Neurology (神经内科) |
| 2 | Dermatology (皮肤科) | 10 | Oncology (肿瘤科) |
| 3 | Endocrinology (内分泌科) | 11 | Orthopedics (骨科) |
| 4 | Gastroenterology (消化科) | 12 | Pediatrics (儿科) |
| 5 | General Practice (全科) | 13 | Psychiatry (精神科) |
| 6 | Geriatrics (老年科) | 14 | Respiratory (呼吸科) |
| 7 | Gynecology (妇科) | 15 | Urology (泌尿科) |
| 8 | Hematology (血液科) | 16 | Nephrology (肾内科) |

Use `/consult` for a full MDT review or `/specialist <domain>` for a focused deep dive.

## 🛠️ Analysis Skills

20 reusable analysis skills power the commands above:

`ai-analyzer` · `emergency-card` · `family-health-analyzer` · `fitness-analyzer` · `food-database-query` · `goal-analyzer` · `health-trend-analyzer` · `infection-specialist` · `mental-health-analyzer` · `nutrition-analyzer` · `occupational-health-analyzer` · `oral-health-analyzer` · `rehabilitation-analyzer` · `sexual-health-analyzer` · `skin-health-analyzer` · `sleep-analyzer` · `tcm-constitution-analyzer` · `travel-health-analyzer` · `weightloss-analyzer` · `wellally-tech`

## 🔧 Technical Architecture

- **Storage** — JSON files + filesystem directory layout (no database, fully portable)
- **Command system** — Claude Code slash commands (natural-language friendly)
- **Expert system** — multi-specialty Skill definitions + Subagent architecture
- **Consultation coordination** — parallel processing + opinion-integration algorithm
- **Document understanding** — AI visual analysis + intelligent text recognition/structuring
- **Radiation modeling** — body-surface-area adjustment + exponential decay model

> 🔧 Deep dive: [Technical Implementation Details (中文)](docs/technical-details.md) · [Data Structure Spec](docs/data-structures.en.md)

## 💊 Drug Interaction Database

Built-in **drug interaction detection** covering drug–drug, drug–disease, drug–dose, and drug–food interactions, graded by a **five-level severity system (A/B/C/D/X)**.

- 🔍 Auto-detect interactions in your current medication combination
- 🚨 Severity-graded warnings (A = negligible → X = absolute contraindication)
- 📋 Detailed management recommendations & monitoring indicators
- 💾 Custom rules and check history

```bash
/interaction check      # check current medications
/interaction list       # list all rules
/interaction list X     # show absolute-contraindication rules
```

> 📖 [Drug Interaction Database Guide (中文)](docs/drug-interaction-database.md) — medical professionals welcome to contribute.

## 🔒 Data Privacy

- ✅ All data stored on your local filesystem
- ✅ No uploads to any cloud service
- ✅ No external database or network dependency
- ✅ Fully private, portable, and exportable

WellAlly Health is designed for people who treat their medical history as strictly personal.

## 🗺️ Roadmap

- Expanded specialty coverage and deeper longitudinal trend analytics
- Richer data visualization and export formats
- Community-contributed interaction rules and knowledge base
- Local LLM option for fully offline operation

See [`docs/plans`](docs/plans) for design notes.

## 🤝 Contributing

Contributions are welcome! Whether it's a new command, a specialist Skill, interaction rules, translations, or docs — we'd love your help.

- 📖 [Contributing Guide](.github/CONTRIBUTING.md)
- 🐛 [Report a bug](https://github.com/huifer/WellAlly-health/issues/new?template=bug_report.md)
- 💡 [Request a feature](https://github.com/huifer/WellAlly-health/issues/new?template=feature_request.md)
- 🏷️ Look for [**good first issue**](https://github.com/huifer/WellAlly-health/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) to get started
- 💬 Join the conversation in [GitHub Discussions](https://github.com/huifer/WellAlly-health/discussions)

## 🛡️ Security

Found a vulnerability? Please follow our [Security Policy](.github/SECURITY.md) and report privately — do **not** open a public issue.

## ⚠️ Important Safety Statement

This system strictly follows medical safety principles:

1. **Does not provide specific medication dosages**
2. **Does not directly prescribe prescription drugs**
3. **Does not predict life prognosis**
4. **Does not replace a doctor's diagnosis**

All analysis from this system is for reference only and is **not** a basis for medical diagnosis. All medical decisions require consultation with a qualified professional. In an emergency, seek immediate medical attention.

## 📄 License

Released under the [MIT License](LICENSE).

**Important Disclaimer**: WellAlly Health is for personal health management only and is not a substitute for professional medical diagnosis or treatment.

---

Developed and maintained by [WellAlly Tech](https://www.wellally.tech/).
