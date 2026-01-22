# 健康趋势分析器 - 数据源详细说明

本文档详细说明健康趋势分析器使用的所有数据源，包括数据结构、读取方法、可用性检查和缺失数据处理。

## 数据源概览

| 数据源 | 文件路径 | 更新频率 | 数据类型 | 必需性 |
|--------|---------|---------|---------|--------|
| 个人档案 | `data/profile.json` | 低 | 基本信息 | 可选 |
| 症状记录 | `data/symptoms/**/*.json` | 高 | 时间序列 | 推荐 |
| 情绪记录 | `data/mood/**/*.json` | 高 | 时间序列 | 推荐 |
| 饮食记录 | `data/diet/**/*.json` | 高 | 时间序列 | 可选 |
| 用药日志 | `data/medication-logs/**/*.json` | 高 | 时间序列 | 推荐 |
| 女性周期 | `data/cycle-tracker.json` | 中 | 时间序列 | 条件 |
| 孕期追踪 | `data/pregnancy-tracker.json` | 中 | 时间序列 | 条件 |
| 更年期 | `data/menopause-tracker.json` | 中 | 时间序列 | 条件 |
| 过敏史 | `data/allergies.json` | 低 | 静态数据 | 可选 |
| 辐射记录 | `data/radiation-records.json` | 低 | 时间序列 | 可选 |
| 化验结果 | `data/medical_records/**/*.json` | 低 | 时间序列 | 推荐 |

---

## 1. 个人档案 (profile.json)

### 文件路径
`data/profile.json`

### 数据结构
```json
{
  "created_at": "2025-01-01T00:00:00.000Z",
  "last_updated": "2025-12-31T12:34:56.789Z",
  "basic_info": {
    "name": "张三",
    "gender": "男",
    "birth_date": "1990-01-01",
    "blood_type": "A+",
    "height": 175,
    "height_unit": "cm",
    "weight": 70.5,
    "weight_unit": "kg",
    "emergency_contacts": [
      {
        "name": "李四",
        "relationship": "配偶",
        "phone": "138****1234"
      }
    ]
  },
  "calculated": {
    "age": 35,
    "age_years": 35,
    "bmi": 23.0,
    "bmi_status": "正常",
    "body_surface_area": 1.85,
    "bsa_unit": "m²"
  },
  "history": [
    {
      "date": "2025-10-01",
      "weight": 70.8,
      "bmi": 23.1
    },
    {
      "date": "2025-11-01",
      "weight": 69.5,
      "bmi": 22.7
    },
    {
      "date": "2025-12-01",
      "weight": 68.5,
      "bmi": 22.4
    }
  ]
}
```

### 字段说明

**basic_info**：基本信息
- `name`: 姓名
- `gender`: 性别（"男"或"女"）
- `birth_date`: 出生日期（YYYY-MM-DD格式）
- `blood_type`: 血型（A+, B+, AB+, O+, A-, B-, AB-, O-）
- `height`: 身高
- `height_unit`: 身高单位（cm）
- `weight`: 当前体重
- `weight_unit`: 体重单位（kg）
- `emergency_contacts`: 紧急联系人列表

**calculated**：计算字段
- `age`: 年龄（岁）
- `bmi`: BMI指数
- `bmi_status`: BMI状态（"过轻"、"正常"、"超重"、"肥胖"）
- `body_surface_area`: 体表面积（m²）

**history**：历史记录（用于追踪体重变化）
- `date`: 记录日期
- `weight`: 当时体重
- `bmi`: 当时BMI

### 读取方法
```javascript
const profile = JSON.parse(readFile('data/profile.json'));

// 获取当前BMI
const currentBMI = profile.calculated.bmi;

// 获取体重历史（用于趋势分析）
const weightHistory = profile.history.map(h => ({
  date: h.date,
  weight: h.weight,
  bmi: h.bmi
}));
```

### 可用性检查
```javascript
function checkProfileAvailable() {
  try {
    const profile = JSON.parse(readFile('data/profile.json'));
    return {
      available: true,
      hasHistory: profile.history && profile.history.length > 0,
      historyLength: profile.history ? profile.history.length : 0
    };
  } catch (error) {
    return { available: false, error: error.message };
  }
}
```

### 缺失数据处理
- 如文件不存在：跳过体重/BMI分析，提示"未记录个人档案"
- 如无history数据：使用当前weight和bmi作为单点数据，无法分析趋势

---

## 2. 症状记录 (symptoms/)

### 文件路径
`data/symptoms/YYYY-MM/YYYY-MM-DD.json`

### 数据结构
```json
{
  "date": "2025-12-31",
  "logs": [
    {
      "id": "symptom_20251231083000001",
      "name": "头痛",
      "severity": "moderate",
      "severity_level": 2,
      "onset_time": "08:30",
      "duration": 4,
      "duration_unit": "hours",
      "description": "持续性钝痛，两侧颞部",
      "triggers": ["睡眠不足", "压力"],
      "location": "头部",
      "associated_symptoms": ["恶心", "畏光"],
      "relief_factors": "休息后缓解",
      "created_at": "2025-12-31T08:30:00.000Z"
    },
    {
      "id": "symptom_20251231140000002",
      "name": "疲劳",
      "severity": "mild",
      "severity_level": 1,
      "onset_time": "14:00",
      "duration": 3,
      "duration_unit": "hours",
      "description": "感觉乏力，注意力不集中",
      "triggers": ["午餐后", "工作强度大"],
      "location": "全身",
      "associated_symptoms": [],
      "relief_factors": "短暂午休",
      "created_at": "2025-12-31T14:00:00.000Z"
    }
  ],
  "summary": {
    "total_symptoms": 2,
    "most_severe": "头痛",
    "overall_discomfort": "moderate"
  }
}
```

### 字段说明

**症状记录字段**：
- `id`: 唯一标识符
- `name`: 症状名称（如：头痛、疲劳、失眠）
- `severity`: 严重程度（"mild"、"moderate"、"severe"）
- `severity_level`: 严重程度级别（1=轻度，2=中度，3=重度）
- `onset_time`: 发作时间（HH:mm格式）
- `duration`: 持续时间
- `duration_unit`: 持续时间单位（hours, days）
- `description`: 症状描述
- `triggers`: 诱发因素列表
- `location`: 症状部位
- `associated_symptoms`: 伴随症状
- `relief_factors`: 缓解因素
- `created_at`: 记录时间

**summary**: 当日汇总
- `total_symptoms`: 当日症状总数
- `most_severe`: 最严重症状
- `overall_discomfort`: 总体不适感

### 读取方法
```javascript
// 获取所有症状文件
const symptomFiles = glob('data/symptoms/**/*.json');

// 读取所有症状数据
const allSymptoms = symptomFiles.map(file => {
  const data = JSON.parse(readFile(file));
  return data.logs;
}).flat();

// 按时间范围过滤
function filterSymptomsByDate(symptoms, startDate, endDate) {
  return symptoms.filter(symptom => {
    const symptomDate = new Date(symptom.created_at);
    return symptomDate >= startDate && symptomDate <= endDate;
  });
}

// 统计症状频率
function getSymptomFrequency(symptoms) {
  const frequency = {};
  symptoms.forEach(symptom => {
    const name = symptom.name;
    frequency[name] = (frequency[name] || 0) + 1;
  });
  return frequency;
}
```

### 可用性检查
```javascript
function checkSymptomsAvailable(startDate, endDate) {
  const symptomFiles = glob('data/symptoms/**/*.json');

  if (symptomFiles.length === 0) {
    return { available: false, message: "暂无症状记录" };
  }

  // 检查时间范围内是否有数据
  const allSymptoms = readAllSymptoms(symptomFiles);
  const filtered = filterSymptomsByDate(allSymptoms, startDate, endDate);

  return {
    available: true,
    totalFiles: symptomFiles.length,
    totalRecords: allSymptoms.length,
    recordsInRange: filtered.length,
    dataDensity: filtered.length / getDaysBetween(startDate, endDate) // 每天平均记录数
  };
}
```

### 数据质量评估
- **优秀**：数据密度≥0.5（平均每2天至少1次记录）
- **良好**：数据密度≥0.3（平均每3天至少1次记录）
- **一般**：数据密度≥0.1（平均每10天至少1次记录）
- **不足**：数据密度<0.1（数据不足，趋势分析可靠性低）

### 缺失数据处理
- 如目录不存在：跳过症状分析，提示"暂无症状记录，建议使用 /symptom 命令记录"
- 如数据不足（<1个月）：提示"症状记录不足1个月，建议延长记录时间"
- 如数据质量差：在报告中标注"数据质量：一般，趋势分析仅供参考"

---

## 3. 情绪记录 (mood/)

### 文件路径
`data/mood/YYYY-MM/YYYY-MM-DD.json`

### 数据结构
```json
{
  "date": "2025-12-31",
  "logs": [
    {
      "id": "mood_20251231080000001",
      "timestamp": "2025-12-31T08:00:00.000Z",
      "mood_score": 7,
      "mood_description": "良好",
      "energy_level": "moderate",
      "energy_score": 6,
      "sleep_quality": "fair",
      "sleep_hours": 6.5,
      "stress_level": "low",
      "stress_score": 3,
      "notes": "昨晚睡眠尚可，今天精神不错"
    }
  ],
  "summary": {
    "average_mood": 7.0,
    "average_sleep": 6.5,
    "average_stress": 3.0,
    "day_mood": "stable"
  }
}
```

### 字段说明

**情绪记录字段**：
- `id`: 唯一标识符
- `timestamp`: 记录时间戳
- `mood_score`: 情绪评分（1-10分，10=最佳）
- `mood_description`: 情绪描述（如："excellent"、"good"、"fair"、"poor"、"bad"）
- `energy_level`: 能量水平（"high"、"moderate"、"low"）
- `energy_score`: 能量评分（1-10分）
- `sleep_quality`: 睡眠质量（"excellent"、"good"、"fair"、"poor"）
- `sleep_hours`: 睡眠时长（小时）
- `stress_level`: 压力水平（"low"、"moderate"、"high"）
- `stress_score`: 压力评分（1-10分，10=压力最大）
- `notes`: 备注

**summary**: 当日汇总
- `average_mood`: 平均情绪（当日多次记录的平均）
- `average_sleep`: 平均睡眠时长
- `average_stress`: 平均压力评分
- `day_mood`: 全天情绪趋势（"improving"、"declining"、"stable"）

### 读取方法
```javascript
// 读取所有情绪数据
const moodFiles = glob('data/mood/**/*.json');
const allMoods = moodFiles.map(file => {
  const data = JSON.parse(readFile(file));
  return data.logs;
}).flat();

// 提取时间序列数据
function getMoodTimeSeries(moods) {
  return moods.map(mood => ({
    date: mood.timestamp.split('T')[0],
    time: mood.timestamp.split('T')[1].substring(0, 5),
    moodScore: mood.mood_score,
    sleepHours: mood.sleep_hours,
    stressScore: mood.stress_score
  }));
}

// 计算平均值
function getMoodStats(moods) {
  const avgMood = moods.reduce((sum, m) => sum + m.mood_score, 0) / moods.length;
  const avgSleep = moods.reduce((sum, m) => sum + m.sleep_hours, 0) / moods.length;
  const avgStress = moods.reduce((sum, m) => sum + m.stress_score, 0) / moods.length;

  return { avgMood, avgSleep, avgStress };
}
```

### 可用性检查
```javascript
function checkMoodAvailable(startDate, endDate) {
  const moodFiles = glob('data/mood/**/*.json');

  if (moodFiles.length === 0) {
    return { available: false, message: "暂无情绪记录" };
  }

  const allMoods = readAllMoods(moodFiles);
  const filtered = filterByDate(allMoods, startDate, endDate);

  return {
    available: true,
    totalRecords: filtered.length,
    recordRate: filtered.length / getDaysBetween(startDate, endDate), // 记录率
    hasSleepData: filtered.every(m => m.sleep_hours > 0),
    hasStressData: filtered.every(m => m.stress_score > 0)
  };
}
```

### 缺失数据处理
- 如无睡眠数据（sleep_hours = 0）：跳过睡眠-情绪相关性分析
- 如无压力数据（stress_score = 0）：跳过压力-情绪相关性分析
- 如记录率<30%：提示"情绪记录较少，建议每日记录"

---

## 4. 饮食记录 (diet/)

### 文件路径
`data/diet/YYYY-MM/YYYY-MM-DD.json`

### 数据结构
```json
{
  "date": "2025-12-31",
  "meals": [
    {
      "id": "diet_20251231080000001",
      "meal_type": "breakfast",
      "meal_time": "08:00",
      "foods": [
        {
          "name": "牛奶燕麦粥",
          "amount": 1,
          "unit": "碗",
          "calories": 250,
          "protein": 8,
          "carbs": 40,
          "fat": 5
        },
        {
          "name": "煮鸡蛋",
          "amount": 1,
          "unit": "个",
          "calories": 70,
          "protein": 6,
          "carbs": 1,
          "fat": 5
        }
      ],
      "total_calories": 320,
      "notes": "营养均衡"
    },
    {
      "id": "diet_20251231120000002",
      "meal_type": "lunch",
      "meal_time": "12:00",
      "foods": [
        {
          "name": "米饭",
          "amount": 150,
          "unit": "g",
          "calories": 180,
          "protein": 4,
          "carbs": 40,
          "fat": 0
        }
      ],
      "total_calories": 650,
      "notes": ""
    },
    {
      "id": "diet_20251231180000003",
      "meal_type": "dinner",
      "meal_time": "18:30",
      "foods": [
        {
          "name": "鸡胸肉沙拉",
          "amount": 1,
          "unit": "份",
          "calories": 350,
          "protein": 30,
          "carbs": 15,
          "fat": 20
        }
      ],
      "total_calories": 450,
      "notes": "低脂高蛋白"
    }
  ],
  "summary": {
    "total_calories": 1420,
    "total_protein": 48,
    "total_carbs": 96,
    "total_fat": 30,
    "meals_count": 3
  }
}
```

### 字段说明

**餐次记录字段**：
- `id`: 唯一标识符
- `meal_type`: 餐次类型（"breakfast"、"lunch"、"dinner"、"snack"）
- `meal_time`: 用餐时间（HH:mm格式）
- `foods`: 食物列表

**食物字段**：
- `name`: 食物名称
- `amount`: 分量
- `unit`: 单位（g、ml、个、碗、份等）
- `calories`: 卡路里
- `protein`: 蛋白质（g）
- `carbs`: 碳水化合物（g）
- `fat`: 脂肪（g）

**summary**: 当日汇总
- `total_calories`: 总卡路里
- `total_protein`: 总蛋白质
- `total_carbs`: 总碳水
- `total_fat`: 总脂肪
- `meals_count`: 用餐次数

### 读取方法
```javascript
// 读取所有饮食数据
const dietFiles = glob('data/diet/**/*.json');
const allDiets = dietFiles.map(file => {
  const data = JSON.parse(readFile(file));
  return data.meals;
}).flat();

// 计算每日营养摄入
function getDailyNutrition(diets) {
  const daily = {};

  diets.forEach(meal => {
    const date = meal.meal_time.split('T')[0];
    if (!daily[date]) {
      daily[date] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    meal.foods.forEach(food => {
      daily[date].calories += food.calories;
      daily[date].protein += food.protein;
      daily[date].carbs += food.carbs;
      daily[date].fat += food.fat;
    });
  });

  return daily;
}
```

### 可用性检查
```javascript
function checkDietAvailable(startDate, endDate) {
  const dietFiles = glob('data/diet/**/*.json');

  if (dietFiles.length === 0) {
    return { available: false, message: "暂无饮食记录" };
  }

  const allDiets = readAllDiets(dietFiles);
  const filtered = filterByDate(allDiets, startDate, endDate);

  return {
    available: true,
    totalRecords: filtered.length,
    hasCalorieData: filtered.every(d => d.total_calories > 0),
    hasMacroData: filtered.every(d => d.total_protein > 0)
  };
}
```

### 缺失数据处理
- 饮食数据为可选，缺失不影响其他维度分析
- 如无热量数据（calories = 0）：跳过饮食-体重相关性分析
- 如记录率<20%：提示"饮食记录较少，建议每餐记录"

---

## 5. 用药日志 (medication-logs/)

### 文件路径
`data/medication-logs/YYYY-MM/YYYY-MM-DD.json`

### 数据结构
```json
{
  "date": "2025-12-31",
  "logs": [
    {
      "id": "log_20251231080000001",
      "medication_id": "med_20250915123456789",
      "medication_name": "氨氯地平",
      "scheduled_time": "08:00",
      "scheduled_dose": {
        "value": 5,
        "unit": "mg"
      },
      "actual_time": "2025-12-31T08:05:00",
      "status": "taken",
      "actual_dose": {
        "value": 5,
        "unit": "mg"
      },
      "notes": "",
      "created_at": "2025-12-31T08:05:00.000Z"
    },
    {
      "id": "log_20251231200000002",
      "medication_id": "med_20250915123456789",
      "medication_name": "氨氯地平",
      "scheduled_time": "20:00",
      "scheduled_dose": {
        "value": 5,
        "unit": "mg"
      },
      "actual_time": null,
      "status": "missed",
      "actual_dose": null,
      "notes": "忘记服用",
      "created_at": "2025-12-31T22:00:00.000Z"
    }
  ],
  "summary": {
    "total_planned": 2,
    "total_taken": 1,
    "total_missed": 1,
    "adherence_rate": 50
  }
}
```

### 字段说明

**用药日志字段**：
- `id`: 唯一标识符
- `medication_id`: 药物ID（关联medications.json）
- `medication_name`: 药物名称
- `scheduled_time`: 计划服用时间（HH:mm）
- `scheduled_dose`: 计划剂量
- `actual_time`: 实际服用时间（ISO 8601格式）
- `status`: 服用状态（"taken"、"missed"、"skipped"、"delayed"）
- `actual_dose`: 实际剂量
- `notes`: 备注

**summary**: 当日汇总
- `total_planned`: 计划服用次数
- `total_taken`: 实际服用次数
- `total_missed`: 漏服次数
- `adherence_rate`: 当日依从率（%）

### 读取方法
```javascript
// 读取所有用药日志
const logFiles = glob('data/medication-logs/**/*.json');
const allLogs = logFiles.map(file => {
  const data = JSON.parse(readFile(file));
  return data.logs;
}).flat();

// 计算依从性
function calculateAdherence(logs, medicationName) {
  const medLogs = logs.filter(log => log.medication_name === medicationName);
  const taken = medLogs.filter(log => log.status === 'taken').length;
  const total = medLogs.length;

  return {
    medication: medicationName,
    adherence: total > 0 ? Math.round((taken / total) * 100) : 0,
    taken: taken,
    total: total,
    missed: total - taken
  };
}

// 按日期统计
function getDailyAdherence(logs) {
  const daily = {};

  logs.forEach(log => {
    const date = log.actual_time ? log.actual_time.split('T')[0] : log.created_at.split('T')[0];
    if (!daily[date]) {
      daily[date] = { planned: 0, taken: 0, missed: 0 };
    }

    daily[date].planned++;
    if (log.status === 'taken') {
      daily[date].taken++;
    } else if (log.status === 'missed') {
      daily[date].missed++;
    }
  });

  // 计算每日依从率
  Object.keys(daily).forEach(date => {
    const d = daily[date];
    d.adherence = Math.round((d.taken / d.planned) * 100);
  });

  return daily;
}
```

### 可用性检查
```javascript
function checkMedicationLogsAvailable(startDate, endDate) {
  const logFiles = glob('data/medication-logs/**/*.json');

  if (logFiles.length === 0) {
    return { available: false, message: "暂无用药日志" };
  }

  const allLogs = readAllLogs(logFiles);
  const filtered = filterByDate(allLogs, startDate, endDate);

  return {
    available: true,
    totalRecords: filtered.length,
    medications: [...new Set(filtered.map(log => log.medication_name))], // 唯一药物列表
    dateRange: getDateRange(filtered)
  };
}
```

### 缺失数据处理
- 如无用药日志：跳过药物依从性分析
- 如日志不完整（<1个月）：提示"用药日志较少，建议延长记录时间"

---

## 6. 化验结果 (medical_records/)

### 文件路径
`data/medical_records/biochemical_tests/YYYY-MM-DD.json` 或
`data/medical_records/imaging_tests/YYYY-MM-DD.json`

### 数据结构（生化检查）
```json
{
  "report_id": "lab_20251231001",
  "report_type": "biochemical",
  "test_date": "2025-12-31",
  "hospital": "XX医院检验科",
  "indicators": [
    {
      "name": "总胆固醇",
      "name_en": "Total Cholesterol",
      "value": 210,
      "unit": "mg/dL",
      "reference_range": "200-240",
      "reference_min": 200,
      "reference_max": 240,
      "status": "normal",
      "trend": "decreased" // 相对于上次检查
    },
    {
      "name": "空腹血糖",
      "name_en": "Fasting Glucose",
      "value": 5.4,
      "unit": "mmol/L",
      "reference_range": "3.9-6.1",
      "reference_min": 3.9,
      "reference_max": 6.1,
      "status": "normal",
      "trend": "stable"
    },
    {
      "name": "收缩压",
      "name_en": "Systolic BP",
      "value": 132,
      "unit": "mmHg",
      "reference_range": "90-140",
      "reference_min": 90,
      "reference_max": 140,
      "status": "normal",
      "trend": "decreased"
    },
    {
      "name": "舒张压",
      "name_en": "Diastolic BP",
      "value": 82,
      "unit": "mmHg",
      "reference_range": "60-90",
      "reference_min": 60,
      "reference_max": 90,
      "status": "normal",
      "trend": "decreased"
    }
  ],
  "summary": {
    "total_indicators": 4,
    "abnormal_count": 0,
    "improved_count": 2,
    "worsened_count": 0
  },
  "created_at": "2025-12-31T10:00:00.000Z"
}
```

### 字段说明

**化验报告字段**：
- `report_id`: 报告ID
- `report_type`: 报告类型（"biochemical"、"imaging"）
- `test_date`: 检查日期
- `hospital": 医院名称
- `indicators`: 指标列表

**指标字段**：
- `name`: 指标名称（中文）
- `name_en`: 指标名称（英文）
- `value`: 检查值
- `unit`: 单位
- `reference_range`: 参考范围（字符串）
- `reference_min`: 参考下限
- `reference_max`: 参考上限
- `status`: 状态（"normal"、"abnormal_low"、"abnormal_high"）
- `trend`: 趋势（"improved"、"worsened"、"stable"、"new"）

### 读取方法
```javascript
// 读取所有化验报告
const labFiles = glob('data/medical_records/biochemical_tests/**/*.json');
const labReports = labFiles.map(file => JSON.parse(readFile(file)));

// 提取特定指标的时间序列
function getIndicatorHistory(reports, indicatorName) {
  const history = [];

  reports.forEach(report => {
    const indicator = report.indicators.find(ind => ind.name === indicatorName);
    if (indicator) {
      history.push({
        date: report.test_date,
        value: indicator.value,
        unit: indicator.unit,
        status: indicator.status,
        trend: indicator.trend
      });
    }
  });

  // 按日期排序
  return history.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// 获取所有异常指标
function getAbnormalIndicators(reports) {
  const abnormal = {};

  reports.forEach(report => {
    report.indicators.forEach(indicator => {
      if (indicator.status !== 'normal') {
        if (!abnormal[indicator.name]) {
          abnormal[indicator.name] = [];
        }
        abnormal[indicator.name].push({
          date: report.test_date,
          value: indicator.value,
          status: indicator.status
        });
      }
    });
  });

  return abnormal;
}
```

### 可用性检查
```javascript
function checkLabResultsAvailable(startDate, endDate) {
  const labFiles = glob('data/medical_records/biochemical_tests/**/*.json');

  if (labFiles.length === 0) {
    return { available: false, message: "暂无化验记录" };
  }

  const reports = labFiles.map(file => JSON.parse(readFile(file)));
  const filtered = reports.filter(r => {
    const date = new Date(r.test_date);
    return date >= startDate && date <= endDate;
  });

  return {
    available: true,
    totalReports: filtered.length,
    hasMultipleReports: filtered.length >= 2, // 至少2次报告才能分析趋势
    indicators: [...new Set(filtered.flatMap(r => r.indicators.map(i => i.name)))]
  };
}
```

### 缺失数据处理
- 如无化验记录：跳过化验结果分析
- 如仅有1次报告：显示当前值，提示"需要至少2次报告才能分析趋势"
- 如报告间隔<1个月：提示"化验报告间隔较短，建议3-6个月复查一次"

---

## 7. 女性健康数据（条件性数据源）

### 7.1 周期追踪 (cycle-tracker.json)

#### 文件路径
`data/cycle-tracker.json`

#### 数据结构（摘要）
```json
{
  "cycles": [
    {
      "cycle_id": "cycle_20251101",
      "period_start": "2025-11-01",
      "period_end": "2025-11-05",
      "cycle_length": 28,
      "daily_logs": [
        {
          "date": "2025-11-01",
          "symptoms": ["腹痛", "腰酸"],
          "mood": "正常",
          "flow": { "intensity": "medium" }
        }
      ]
    }
  ]
}
```

#### 读取方法
```javascript
function checkCycleDataAvailable() {
  const profile = JSON.parse(readFile('data/profile.json'));

  // 仅当用户为女性时读取周期数据
  if (profile.basic_info.gender !== '女') {
    return { available: false, reason: "not_applicable" };
  }

  try {
    const cycleData = JSON.parse(readFile('data/cycle-tracker.json'));
    return {
      available: true,
      totalCycles: cycleData.cycles.length,
      hasSymptoms: cycleData.cycles.some(c => c.daily_logs.some(l => l.symptoms.length > 0))
    };
  } catch (error) {
    return { available: false, error: error.message };
  }
}
```

### 7.2 孕期追踪 (pregnancy-tracker.json)

#### 文件路径
`data/pregnancy-tracker.json`

#### 数据结构（摘要）
```json
{
  "current_pregnancy": {
    "start_date": "2025-06-01",
    "current_week": 30,
    "weight_gain": 8.5,
    "checkups": [...]
  }
}
```

#### 读取方法
```javascript
function checkPregnancyDataAvailable() {
  try {
    const pregnancyData = JSON.parse(readFile('data/pregnancy-tracker.json'));
    const hasActivePregnancy = pregnancyData.current_pregnancy !== null;

    return {
      available: hasActivePregnancy,
      currentWeek: hasActivePregnancy ? pregnancyData.current_pregnancy.current_week : null
    };
  } catch (error) {
    return { available: false, error: error.message };
  }
}
```

### 7.3 更年期追踪 (menopause-tracker.json)

#### 文件路径
`data/menopause-tracker.json`

#### 数据结构（摘要）
```json
{
  "menopause_tracking": {
    "start_date": "2025-01-01",
    "symptoms": ["潮热", "出汗"],
    "hrt_use": true
  }
}
```

#### 读取方法
```javascript
function checkMenopauseDataAvailable() {
  try {
    const menopauseData = JSON.parse(readFile('data/menopause-tracker.json'));
    const hasTracking = menopauseData.menopause_tracking !== null;

    return {
      available: hasTracking,
      symptoms: hasTracking ? menopauseData.menopause_tracking.symptoms : []
    };
  } catch (error) {
    return { available: false, error: error.message };
  }
}
```

---

## 8. 其他数据源

### 8.1 过敏史 (allergies.json)

```json
{
  "allergies": [
    {
      "allergen": { "name": "青霉素", "type": "drug" },
      "severity_level": 4,
      "current_status": { "status": "active" }
    }
  ]
}
```

**用途**：在趋势分析中标注过敏风险，提醒注意相关症状

### 8.2 辐射记录 (radiation-records.json)

```json
{
  "records": [
    {
      "exam_date": "2025-12-31",
      "exam_type": "CT",
      "dose": 5.2,
      "dose_unit": "mSv"
    }
  ]
}
```

**用途**：追踪累积辐射剂量，评估风险

---

## 数据聚合策略

### 完整数据读取流程

```javascript
function analyzeHealthTrends(timePeriod = "3months") {
  // 1. 确定时间范围
  const endDate = new Date();
  const startDate = calculateStartDate(endDate, timePeriod);

  // 2. 检查各数据源可用性
  const dataAvailability = {
    profile: checkProfileAvailable(),
    symptoms: checkSymptomsAvailable(startDate, endDate),
    mood: checkMoodAvailable(startDate, endDate),
    diet: checkDietAvailable(startDate, endDate),
    medications: checkMedicationLogsAvailable(startDate, endDate),
    labResults: checkLabResultsAvailable(startDate, endDate),
    cycle: checkCycleDataAvailable(),
    pregnancy: checkPregnancyDataAvailable(),
    menopause: checkMenopauseDataAvailable()
  };

  // 3. 读取可用数据
  const data = {};

  if (dataAvailability.profile.available) {
    data.profile = readProfile();
  }

  if (dataAvailability.symptoms.available) {
    data.symptoms = readSymptoms(startDate, endDate);
  }

  if (dataAvailability.mood.available) {
    data.mood = readMood(startDate, endDate);
  }

  // ... 读取其他数据源

  // 4. 分析趋势
  const trends = analyzeTrends(data);

  // 5. 生成报告
  return generateReport(trends, dataAvailability);
}
```

---

## 数据质量标准

### 最小数据要求

| 分析类型 | 最小数据量 | 推荐数据量 |
|---------|-----------|-----------|
| 体重/BMI趋势 | 2个时间点 | 5个以上时间点 |
| 症状模式 | 1个月记录 | 3个月记录 |
| 药物依从性 | 2周记录 | 1个月记录 |
| 化验结果趋势 | 2次报告 | 3次以上报告 |
| 情绪-睡眠相关 | 2周记录（每日） | 1个月记录 |
| 相关性分析 | 30个数据点 | 60个以上数据点 |

### 数据完整性评估

```javascript
function assessDataCompleteness(data, startDate, endDate) {
  const daysInRange = getDaysBetween(startDate, endDate);
  const assessment = {};

  // 症状数据完整性
  if (data.symptoms) {
    const symptomDays = new Set(data.symptoms.map(s => s.date.split('T')[0])).size;
    assessment.symptoms = {
      completeness: symptomDays / daysInRange,
      rating: symptomDays / daysInRange >= 0.3 ? 'good' : symptomDays / daysInRange >= 0.1 ? 'fair' : 'poor'
    };
  }

  // 情绪数据完整性
  if (data.mood) {
    const moodDays = new Set(data.mood.map(m => m.timestamp.split('T')[0])).size;
    assessment.mood = {
      completeness: moodDays / daysInRange,
      rating: moodDays / daysInRange >= 0.5 ? 'good' : moodDays / daysInRange >= 0.3 ? 'fair' : 'poor'
    };
  }

  // ... 评估其他数据源

  return assessment;
}
```

---

## 数据过滤与清洗

### 时间范围过滤
```javascript
function filterByDate(data, startDate, endDate) {
  return data.filter(item => {
    const itemDate = new Date(item.date || item.created_at || item.timestamp);
    return itemDate >= startDate && itemDate <= endDate;
  });
}
```

### 异常值检测
```javascript
function detectOutliers(values) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);

  const outliers = values.filter(v => Math.abs(v - mean) > 2 * stdDev);
  return outliers;
}
```

### 缺失值处理
```javascript
function handleMissingValues(timeSeries) {
  // 线性插值
  function interpolate(series, index) {
    const prev = series[index - 1];
    const next = series[index + 1];
    if (prev && next) {
      return (prev.value + next.value) / 2;
    }
    return null;
  }

  // 前向填充
  function forwardFill(series, index) {
    for (let i = index; i >= 0; i--) {
      if (series[i].value !== null) {
        return series[i].value;
      }
    }
    return null;
  }

  return series.map((point, index) => {
    if (point.value === null) {
      point.value = interpolate(series, index) || forwardFill(series, index);
    }
    return point;
  });
}
```

---

## 数据导出格式

### JSON导出（用于HTML报告）

```json
{
  "analysis_date": "2025-12-31",
  "period": {
    "start": "2025-10-01",
    "end": "2025-12-31",
    "days": 92
  },
  "data_sources": {
    "profile": "available",
    "symptoms": "available",
    "mood": "available",
    "diet": "not_available"
  },
  "trends": {
    "weight": { "direction": "decreasing", "change": -2.3, "unit": "kg" },
    "symptoms": { "most_frequent": "头痛", "frequency": 12, "trend": "decreasing" },
    "medications": { "adherence": 78, "missed_doses": 8 },
    "mood": { "average_score": 6.8, "trend": "stable" }
  },
  "correlations": [
    { "x": "睡眠时长", "y": "情绪评分", "coefficient": 0.78, "significance": "high" }
  ],
  "recommendations": [
    "提高睡眠时长至7-8小时",
    "设置晚间用药提醒",
    "3个月后复查血脂"
  ]
}
```
