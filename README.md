# Claude-Ally-Health - Personal Health Information System

[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.md)
[![中文](https://img.shields.io/badge/lang-中文-red.svg)](README.zh-CN.md)

[![GitHub stars](https://img.shields.io/github/stars/huifer/Claude-Ally-Health?style=social)](https://github.com/huifer/Claude-Ally-Health)
[![GitHub forks](https://img.shields.io/github/forks/huifer/Claude-Ally-Health?style=social)](https://github.com/huifer/Claude-Ally-Health)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Star History Chart](https://api.star-history.com/svg?repos=huifer/Claude-Ally-Health&type=date&legend=top-left)](https://www.star-history.com/#huifer/Claude-Ally-Health&type=date&legend=top-left)

A file-based personal health data management system using Claude Code CLI tools for data management.

**GitHub**: https://github.com/huifer/Claude-Ally-Health

> **⚠️ Disclaimer**: This project is NOT affiliated with, endorsed by, or associated with [Anthropic](https://www.anthropic.com/) or [Claude.ai](https://claude.ai/). This is an independent open-source project developed by [WellAlly Tech](https://www.wellally.tech/).
>
> **📝 Note**: This project uses GLM's `mcp__4_5v_mcp__analyze_image` for image recognition.

## Project Developer

This project is developed and maintained by [WellAlly Tech](https://www.wellally.tech/).

## System Features

- 📁 Pure file-based storage, no database required
- 🖼️ Intelligent medical report image recognition
- 📊 Automatic biochemical test data and reference range extraction
- 🔍 Structured medical imaging data extraction
- 🔪 Surgical history and implant management
- 📋 Structured discharge summary storage
- 👨‍⚕️ Multi-Disciplinary Team (MDT) consultation system
- 🔬 13 medical specialist intelligent analysis
- ☢️ Medical radiation dose tracking and management
- 💊 **Intelligent drug interaction detection** (New)
- 🚨 **Five-level severity warning system** (A/B/C/D/X)
- 👤 User basic profile management
- 💾 Local storage, completely private data
- 🚀 Claude Code command operations, no programming required

## Directory Structure

```
my-his/
├── .claude/
│   ├── commands/
│   │   ├── save-report.md    # Save medical report command
│   │   ├── query.md          # Query records command
│   │   ├── profile.md        # User profile settings command
│   │   ├── radiation.md      # Radiation exposure management command
│   │   ├── surgery.md        # Surgery history record command
│   │   ├── discharge.md      # Discharge summary management command
│   │   ├── medication.md     # Medication record management command
│   │   ├── interaction.md    # Drug interaction detection command
│   │   ├── consult.md        # Multi-disciplinary consultation command
│   │   └── specialist.md     # Single specialist consultation command
│   └── specialists/
│       ├── cardiology.md            # Cardiology specialist Skill
│       ├── endocrinology.md         # Endocrinology specialist Skill
│       ├── gastroenterology.md      # Gastroenterology specialist Skill
│       ├── nephrology.md            # Nephrology specialist Skill
│       ├── hematology.md            # Hematology specialist Skill
│       ├── respiratory.md           # Respiratory medicine specialist Skill
│       ├── neurology.md             # Neurology specialist Skill
│       ├── oncology.md              # Oncology specialist Skill
│       ├── general.md               # General practice specialist Skill
│       └── consultation-coordinator.md # Consultation coordinator
├── data/
│   ├── profile.json          # User basic profile
│   ├── radiation-records.json # Radiation exposure records
│   ├── allergies.json        # Allergy history records
│   ├── interactions/         # Drug interaction database
│   │   ├── interaction-db.json      # Interaction rules main database
│   │   └── interaction-logs/        # Check history records
│   ├── medications/          # Medication record data
│   ├── 生化检查/             # Biochemical test data
│   │   └── YYYY-MM/
│   │       └── YYYY-MM-DD_test_name.json
│   ├── 影像检查/             # Medical imaging data
│   │   └── YYYY-MM/
│   │       ├── YYYY-MM-DD_test_name_body_part.json
│   │       └── images/       # Original image backup
│   ├── 手术记录/             # Surgery history data
│   │   └── YYYY-MM/
│   │       └── YYYY-MM-DD_surgery_name.json
│   ├── 出院小结/             # Discharge summary data
│   │   └── YYYY-MM/
│   │       └── YYYY-MM-DD_main_diagnosis.json
│   └── index.json            # Global index file
└── README.md
```

## Quick Navigation

- 📖 [Complete User Guide](docs/user-guide.md) (Chinese) | [docs/user-guide.en.md](docs/user-guide.en.md) (English) - Detailed command usage instructions and examples
- 📋 [Data Structure Specification](docs/data-structures.md) (Chinese) | [docs/data-structures.en.md](docs/data-structures.en.md) (English) - JSON data format and field descriptions
- 🔧 [Technical Implementation Details](docs/technical-details.md) (Chinese) - System architecture and technical details
- ⚠️ [Safety Guidelines and Usage Limitations](docs/safety-guidelines.md) (Chinese) - Safety principles and disclaimer

## Quick Start

1. Ensure Claude Code is installed
2. Open Claude Code in the current directory
3. First-time setup: `/profile set 175 70 1990-01-01`
4. Save first report: `/save-report /path/to/image.jpg`
5. Record radiation: `/radiation add CT chest`
6. Record surgery: `/surgery Gallbladder removal surgery in August last year due to gallstones`
7. Save discharge summary: `/discharge @医疗报告/出院小结.jpg`
8. Query all records: `/query all`
9. Start MDT consultation: `/consult`

## Language Setting

By default, exam data is stored using Chinese folder names (`data/生化检查/`, `data/影像检查/`) for backward compatibility. You can switch new exams to English storage:

```bash
/language en      # store new exams in data/lab-tests/ and data/imaging/, English output
/language zh      # switch back to Chinese (default)
/language         # show the current setting
```

The setting lives in `data/config.json` (`{ "language": "zh" | "en" }`). It only affects **newly saved** exams — existing records keep their original folders, and `/query` and `/report` recognize both the Chinese and English variants, so old and new data coexist. Test-item names (e.g. `Glucosa`) are stored verbatim and never translated.

## Data Privacy

- All data stored on local filesystem
- No uploads to any cloud services
- No external database dependencies
- Completely private management

## Core Commands Overview

| Command | Function | Description |
|---------|----------|-------------|
| `/profile` | User basic parameters | Set height, weight, birth date |
| `/save-report` | Save medical report | Support biochemical and imaging tests |
| `/radiation` | Radiation management | Record and track radiation exposure |
| `/surgery` | Surgery history | Record surgery information and implants |
| `/discharge` | Discharge summary | Save and structure discharge summaries |
| `/medication` | Medication management | Manage medication plans and records |
| `/interaction` | Interaction detection | Detect drug interactions |
| `/allergy` | Allergy history management | Record and manage allergy history |
| `/query` | Query records | Multi-condition medical data queries |
| `/consult` | Multi-disciplinary consultation | Comprehensive analysis across 13 specialties |
| `/specialist` | Single specialist consultation | Consult specific specialty experts |

> 💡 For detailed usage, refer to [Complete User Guide](docs/user-guide.en.md)

## Technical Features

- **Storage Method**: JSON files + filesystem directory structure
- **Command System**: Claude Code Slash Commands
- **Expert System**: Multi-specialty Skill definitions + Subagent architecture
- **Consultation Coordination**: Parallel processing + opinion integration algorithms
- **Image Recognition**: AI visual analysis
- **Data Extraction**: Intelligent text recognition and structuring
- **Radiation Calculation**: Body surface area adjustment + exponential decay model

> 🔧 For more technical details, refer to [Technical Implementation Details](docs/technical-details.md) (Chinese)

## ⚠️ Important Safety Statement

This system strictly follows medical safety principles:

1. **Does not provide specific medication dosages**
2. **Does not directly prescribe prescription drugs**
3. **Does not predict life prognosis**
4. **Does not replace doctor diagnosis**

All analysis reports from this system are for reference only and should not be used as a basis for medical diagnosis. All medical decisions require consultation with professional doctors. In case of emergency, seek immediate medical attention.

> ⚠️ For complete safety principles and usage limitations, refer to [Safety Guidelines Document](docs/safety-guidelines.md) (Chinese)

## 💊 Drug Interaction Database

The system includes intelligent drug interaction detection, supporting drug-drug, drug-disease, drug-dose, and drug-food interaction detection using a five-level severity classification system (A/B/C/D/X).

**Core Features:**
- 🔍 Automatically detect interactions in current medication combinations
- 🚨 Severity-graded warnings (A/B/C/D/X)
- 📋 Provide detailed management recommendations and monitoring indicators
- 💾 Support custom rules and history records

**Quick Start:**
```bash
# Check interactions for current medications
/interaction check

# List all interaction rules
/interaction list

# View absolute contraindication rules
/interaction list X
```

> 📖 **Detailed Documentation**: [Drug Interaction Database Complete Guide](docs/drug-interaction-database.md) (Chinese)
>
> 🩺 **Professional Contributions**: Medical professionals are welcome to help improve the database → [Contribution Guidelines](docs/drug-interaction-database.md#专业人员贡献指南-) (Chinese)

## License

This project is open-sourced under the [MIT License](LICENSE).

**Important Disclaimer**: This system is for personal health management only and should not be used as a basis for medical diagnosis.
