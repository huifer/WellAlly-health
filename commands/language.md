---
description: 设置或查看数据存储与界面语言（zh 中文 / en English）
arguments:
  - name: lang
    description: 目标语言，可选值 zh（中文，默认）或 en（English）；留空则显示当前设置
    required: false
---

# 语言设置 / Language Setting

管理本系统的语言设置 `language`，影响**新保存检查**的目录名、JSON 中的 `type` 取值，以及面向用户的输出语言。

## 行为说明

- 配置存储在 `data/config.json` 的 `language` 字段。
- 支持的值：`zh`（中文，默认）、`en`（English）。
- 默认值：若文件或字段不存在，按 `zh` 处理（向后兼容，保持现有行为不变）。

语言对存储路径与 `type` 取值的影响：

| 项目 | `lang=zh`（默认） | `lang=en` |
|------|------------------|-----------|
| 生化检查目录 | `data/生化检查/` | `data/lab-tests/` |
| 影像检查目录 | `data/影像检查/` | `data/imaging/` |
| 生化检查 `type` | `生化检查` | `lab_test` |
| 影像检查 `type` | `影像检查` | `imaging` |

## 执行步骤

1. **读取当前设置**
   - 读取 `data/config.json`（若不存在，视为 `{ "language": "zh" }`）。

2. **无参数：显示当前语言**
   - 若用户未提供 `lang`，输出当前 `language` 值及其含义，然后结束。

3. **有参数：更新语言**
   - 校验 `lang` 是否为 `zh` 或 `en`；否则提示错误并列出可选值，不做修改。
   - 确保 `data/` 目录存在；若 `data/config.json` 不存在则创建。
   - 写入/更新 `language` 字段，**保留文件中其他字段不变**。
   - 使用标准 JSON 双引号（ASCII `"`），不要使用全角引号。

4. **报告结果**
   - 告知用户语言已更新为目标值。
   - 提醒：该设置仅影响**此后新保存**的检查记录；已保存的历史记录目录与 `type` 不会被改动。`query` 与 `report` 命令会同时识别中英文两种取值，新旧数据可共存。

## 注意事项

- 切换语言不会迁移或重命名既有数据；新旧记录可并存。
- 当 `lang=en` 时，存储的检验项目名称（如 `Glucosa`、`Colesterol`）保持原文，不要翻译。
- `query`、`report` 等命令已支持同时识别中文与英文的 `type` 取值。

## 示例用法

```
/language            # 查看当前语言设置
/language en         # 切换为英文（新检查存入 lab-tests/、imaging/）
/language zh         # 切换回中文（默认）
```
