# 健康趋势分析器 - 分析算法说明

本文档详细说明健康趋势分析器使用的各种分析算法，包括时间序列分析、相关性分析、变化点检测和预测性洞察生成。

## 算法概览

| 算法类型 | 用途 | 数据要求 | 输出 |
|---------|------|---------|------|
| 线性回归 | 趋势检测 | ≥3个数据点 | 斜率、截距、R² |
| 移动平均 | 平滑处理 | ≥5个数据点 | 平滑曲线 |
| 皮尔逊相关 | 连续变量相关 | ≥30个数据点 | 相关系数(-1~1) |
| 斯皮尔曼相关 | 有序变量相关 | ≥30个数据点 | 相关系数(-1~1) |
| CUSUM | 变化点检测 | ≥10个数据点 | 变化点位置 |
| 百分位数 | 异常检测 | ≥20个数据点 | 异常值列表 |
| 时间序列分解 | 季节性分析 | ≥12个数据点 | 趋势+季节+残差 |

---

## 1. 时间序列分析

### 1.1 趋势检测（线性回归）

**用途**：识别数据随时间的线性趋势方向和强度。

**算法**：最小二乘法线性回归

```javascript
function linearRegression(timeSeries) {
  // timeSeries: [{date: '2025-10-01', value: 70.8}, ...]

  const n = timeSeries.length;

  // 将日期转换为数值（距离第一天的天数）
  const baseline = new Date(timeSeries[0].date);
  const x = timeSeries.map(d => (new Date(d.date) - baseline) / (1000 * 60 * 60 * 24));
  const y = timeSeries.map(d => d.value);

  // 计算均值
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  // 计算斜率（β1）和截距（β0）
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (y[i] - meanY);
    denominator += Math.pow(x[i] - meanX, 2);
  }

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  // 计算R²（决定系数）
  const predictions = x.map(xi => slope * xi + intercept);
  const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
  const ssRes = y.reduce((sum, yi, i) => sum + Math.pow(yi - predictions[i], 2), 0);
  const r2 = 1 - (ssRes / ssTot);

  // 计算总变化
  const firstValue = y[0];
  const lastValue = y[y.length - 1];
  const totalChange = lastValue - firstValue;
  const percentChange = (totalChange / firstValue) * 100;

  return {
    slope: slope,              // 斜率（每天变化量）
    intercept: intercept,      // 截距
    r2: r2,                    // 决定系数（0~1，越接近1拟合越好）
    direction: slope > 0.001 ? 'increasing' : slope < -0.001 ? 'decreasing' : 'stable',
    totalChange: totalChange,
    percentChange: percentChange,
    trendStrength: Math.abs(r2) > 0.7 ? 'strong' : Math.abs(r2) > 0.4 ? 'moderate' : 'weak'
  };
}
```

**结果解读**：
- `slope > 0`：上升趋势
- `slope < 0`：下降趋势
- `slope ≈ 0`：稳定
- `r2 > 0.7`：强趋势（拟合好）
- `r2 < 0.4`：弱趋势（拟合差）

**示例**：
```javascript
const weightTrend = linearRegression(weightHistory);
// 结果：
{
  slope: -0.018,           // 每天减少0.018kg
  r2: 0.82,               // 强趋势
  direction: 'decreasing',
  totalChange: -2.3,      // 90天减少2.3kg
  percentChange: -3.2,    // 减少3.2%
  trendStrength: 'strong'
}
```

### 1.2 移动平均（平滑处理）

**用途**：平滑短期波动，突出长期趋势。

**算法**：简单移动平均（SMA）

```javascript
function movingAverage(timeSeries, windowSize = 7) {
  // timeSeries: [{date: '2025-10-01', value: 70.8}, ...]
  // windowSize: 窗口大小（天）

  const smoothed = [];

  for (let i = 0; i < timeSeries.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(timeSeries.length, i + Math.floor(windowSize / 2) + 1);

    const window = timeSeries.slice(start, end);
    const avg = window.reduce((sum, point) => sum + point.value, 0) / window.length;

    smoothed.push({
      date: timeSeries[i].date,
      value: timeSeries[i].value,
      smoothed: avg
    });
  }

  return smoothed;
}
```

**窗口大小选择**：
- 7天：周平滑（消除周内波动）
- 30天：月平滑（消除月内波动）
- 90天：季平滑（消除季度波动）

### 1.3 加权移动平均

**用途**：给予近期数据更高权重，更快响应趋势变化。

```javascript
function weightedMovingAverage(timeSeries, windowSize = 7) {
  const weights = [];
  for (let i = 1; i <= windowSize; i++) {
    weights.push(i); // 线性权重：1, 2, 3, ..., 7
  }

  const smoothed = [];

  for (let i = windowSize - 1; i < timeSeries.length; i++) {
    let sum = 0;
    let weightSum = 0;

    for (let j = 0; j < windowSize; j++) {
      sum += timeSeries[i - j].value * weights[j];
      weightSum += weights[j];
    }

    smoothed.push({
      date: timeSeries[i].date,
      value: timeSeries[i].value,
      smoothed: sum / weightSum
    });
  }

  return smoothed;
}
```

### 1.4 时间序列分解

**用途**：将时间序列分解为趋势、季节性和残差三个部分。

**算法**：STL分解（Seasonal-Trend decomposition using Loess）

```javascript
function decomposeTimeSeries(timeSeries, period = 7) {
  // 简化版：加法模型 Y = Trend + Seasonal + Residual

  const n = timeSeries.length;
  const values = timeSeries.map(d => d.value);

  // 1. 提取趋势（使用移动平均）
  const trend = movingAverage(timeSeries, period).map(d => d.smoothed);

  // 2. 提取季节性
  const seasonal = [];
  for (let i = 0; i < n; i++) {
    const detrended = values[i] - trend[i];
    const seasonIndex = i % period;
    seasonal.push(detrended);
  }

  // 计算平均季节性
  const avgSeasonal = Array(period).fill(0);
  const seasonCount = Array(period).fill(0);

  for (let i = 0; i < n; i++) {
    const seasonIndex = i % period;
    avgSeasonal[seasonIndex] += seasonal[i];
    seasonCount[seasonIndex]++;
  }

  for (let s = 0; s < period; s++) {
    avgSeasonal[s] = avgSeasonal[s] / seasonCount[s];
  }

  // 3. 计算残差
  const residual = values.map((v, i) => v - trend[i] - avgSeasonal[i % period]);

  return {
    trend: trend,
    seasonal: avgSeasonal,
    residual: residual,
    hasSeasonality: Math.max(...avgSeasonal) - Math.min(...avgSeasonal) > 0.5 * Math.std(values)
  };
}
```

---

## 2. 相关性分析

### 2.1 皮尔逊相关系数（Pearson Correlation）

**用途**：衡量两个连续变量之间的线性相关强度。

**公式**：
```
r = Σ[(xi - x̄)(yi - ȳ)] / √[Σ(xi - x̄)² × Σ(yi - ȳ)²]
```

**范围**：-1（完全负相关）到 1（完全正相关），0表示无线性相关

```javascript
function pearsonCorrelation(x, y) {
  // x, y: 数值数组
  // 长度必须相同

  const n = x.length;
  if (n !== y.length || n < 2) {
    return null; // 数据无效
  }

  // 计算均值
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  // 计算分子和分母
  let numerator = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    sumX2 += dx * dx;
    sumY2 += dy * dy;
  }

  const denominator = Math.sqrt(sumX2 * sumY2);

  if (denominator === 0) {
    return 0; // 避免除零
  }

  const r = numerator / denominator;

  // 计算显著性（p-value）
  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  const pValue = 2 * (1 - studentTCDF(Math.abs(t), n - 2));

  return {
    coefficient: r,
    significance: pValue < 0.05 ? 'significant' : pValue < 0.1 ? 'marginal' : 'not_significant',
    pValue: pValue,
    strength: Math.abs(r) > 0.7 ? 'strong' : Math.abs(r) > 0.4 ? 'moderate' : Math.abs(r) > 0.2 ? 'weak' : 'very_weak',
    direction: r > 0.3 ? 'positive' : r < -0.3 ? 'negative' : 'none'
  };
}
```

**结果解读**：
- `r > 0.7`：强正相关
- `0.4 < r ≤ 0.7`：中等正相关
- `0.2 < r ≤ 0.4`：弱正相关
- `-0.2 ≤ r ≤ 0.2`：无相关
- `-0.4 ≤ r < -0.2`：弱负相关
- `-0.7 ≤ r < -0.4`：中等负相关
- `r < -0.7`：强负相关

**示例**：
```javascript
const sleepHours = [7.5, 6.2, 5.8, 7.0, 6.5, 8.0, 6.8];
const moodScores = [8, 6, 5, 7, 6, 9, 7];

const correlation = pearsonCorrelation(sleepHours, moodScores);
// 结果：
{
  coefficient: 0.78,
  significance: 'significant',
  pValue: 0.03,
  strength: 'strong',
  direction: 'positive'
}
// 解释：睡眠时长与情绪评分呈强正相关（r=0.78），有统计学意义（p<0.05）
```

### 2.2 斯皮尔曼等级相关（Spearman Correlation）

**用途**：衡量两个有序变量或非正态分布变量之间的单调关系。

**特点**：
- 对异常值不敏感
- 可检测非线性单调关系
- 适用于有序分类数据

```javascript
function spearmanCorrelation(x, y) {
  const n = x.length;
  if (n !== y.length || n < 2) {
    return null;
  }

  // 将数据转换为等级（rank）
  const rank = (arr) => {
    const sorted = arr.map((v, i) => ({ value: v, index: i }))
                          .sort((a, b) => a.value - b.value);
    const ranks = Array(n);
    sorted.forEach((item, i) => {
      ranks[item.index] = i + 1;
    });
    return ranks;
  };

  const rankX = rank(x);
  const rankY = rank(y);

  // 计算皮尔逊相关系数（基于等级）
  const meanRankX = rankX.reduce((a, b) => a + b, 0) / n;
  const meanRankY = rankY.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (let i = 0; i < n; i++) {
    const dx = rankX[i] - meanRankX;
    const dy = rankY[i] - meanRankY;
    numerator += dx * dy;
    sumX2 += dx * dx;
    sumY2 += dy * dy;
  }

  const denominator = Math.sqrt(sumX2 * sumY2);

  if (denominator === 0) {
    return { coefficient: 0 };
  }

  const rho = numerator / denominator;

  return {
    coefficient: rho,
    strength: Math.abs(rho) > 0.7 ? 'strong' : Math.abs(rho) > 0.4 ? 'moderate' : 'weak',
    direction: rho > 0.3 ? 'positive' : rho < -0.3 ? 'negative' : 'none'
  };
}
```

### 2.3 交叉相关（Cross-Correlation）

**用途**：检测两个时间序列之间的滞后关系。

**示例**：分析今天的睡眠是否影响明天的情绪

```javascript
function crossCorrelation(x, y, maxLag = 7) {
  // x, y: 时间序列数组
  // maxLag: 最大滞后天数

  const correlations = [];

  for (let lag = -maxLag; lag <= maxLag; lag++) {
    let xShifted, yShifted;

    if (lag >= 0) {
      // x滞后lag天：x(t)与y(t-lag)的相关
      xShifted = x.slice(lag);
      yShifted = y.slice(0, y.length - lag);
    } else {
      // y滞后|lag|天：x(t)与y(t+lag)的相关
      xShifted = x.slice(0, x.length + lag);
      yShifted = y.slice(-lag);
    }

    if (xShifted.length < 10) continue; // 数据点太少

    const corr = pearsonCorrelation(xShifted, yShifted);
    if (corr) {
      correlations.push({
        lag: lag,
        coefficient: corr.coefficient,
        significance: corr.significance
      });
    }
  }

  // 找到最强相关
  const maxCorr = correlations.reduce((max, curr) =>
    Math.abs(curr.coefficient) > Math.abs(max.coefficient) ? curr : max
  );

  return {
    correlations: correlations,
    maxCorrelation: maxCorr,
    bestLag: maxCorr.lag,
    interpretation: maxCorr.lag > 0 ?
      `今天的${maxCorr.lag === 1 ? '' : maxCorr.lag + '天后'}${y}与当前x相关` :
      maxCorr.lag < 0 ?
      `今天的x与${-maxCorr.lag === 1 ? '' : -maxCorr.lag + '天后'}的y相关` :
      'x和y同步相关'
  };
}
```

**示例**：
```javascript
const sleepHours = [7, 6, 8, 5, 7, 6, 8, ...];
const moodScores = [8, 6, 9, 5, 7, 6, 8, ...];

const cc = crossCorrelation(sleepHours, moodScores, 3);
// 结果：滞后0天的相关最强（r=0.78）
// 解释：今天的睡眠与今天的情绪最相关
```

---

## 3. 变化点检测

### 3.1 CUSUM算法（累积和）

**用途**：检测时间序列中的显著变化点。

**原理**：累积偏离均值的偏差，当累积和超过阈值时判定为变化点。

```javascript
function detectChangePointsCUSUM(timeSeries, threshold = 5) {
  const values = timeSeries.map(d => d.value);
  const n = values.length;

  // 计算全局均值
  const mean = values.reduce((a, b) => a + b, 0) / n;

  // 计算CUSUM
  const cusum = [0];
  let s = 0;

  for (let i = 0; i < n; i++) {
    s += values[i] - mean;
    cusum.push(s);
  }

  // 检测变化点：CUSUM从正变负或从负变正
  const changePoints = [];

  for (let i = 1; i < cusum.length - 1; i++) {
    const prev = cusum[i - 1];
    const curr = cusum[i];
    const next = cusum[i + 1];

    // 符号变化或超过阈值
    if ((prev > 0 && curr < 0) || (prev < 0 && curr > 0) || Math.abs(curr) > threshold) {
      // 计算变化前后的均值差异
      const before = values.slice(Math.max(0, i - 5), i);
      const after = values.slice(i, Math.min(n, i + 5));
      const meanBefore = before.reduce((a, b) => a + b, 0) / before.length;
      const meanAfter = after.reduce((a, b) => a + b, 0) / after.length;
      const change = meanAfter - meanBefore;

      changePoints.push({
        index: i,
        date: timeSeries[i].date,
        change: change,
        type: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'no_change',
        magnitude: Math.abs(change)
      });
    }
  }

  return changePoints;
}
```

### 3.2 滑动窗口t检验

**用途**：检测两个相邻时间段的均值是否存在显著差异。

```javascript
function detectChangePointsTTest(timeSeries, windowSize = 7) {
  const values = timeSeries.map(d => d.value);
  const n = values.length;
  const changePoints = [];

  for (let i = windowSize; i < n - windowSize; i++) {
    // 前后窗口
    const before = values.slice(i - windowSize, i);
    const after = values.slice(i, i + windowSize);

    // 计算均值和标准差
    const meanBefore = before.reduce((a, b) => a + b, 0) / windowSize;
    const meanAfter = after.reduce((a, b) => a + b, 0) / windowSize;

    const varBefore = before.reduce((a, b) => a + Math.pow(b - meanBefore, 2), 0) / (windowSize - 1);
    const varAfter = after.reduce((a, b) => a + Math.pow(b - meanAfter, 2), 0) / (windowSize - 1);

    // t检验
    const pooledStdDev = Math.sqrt(varBefore + varAfter);
    const tStat = (meanAfter - meanBefore) / (pooledStdDev * Math.sqrt(2 / windowSize));

    // 自由度
    const df = 2 * windowSize - 2;

    // 临界值（α=0.05，双尾检验）
    const criticalValue = df > 30 ? 1.96 : 2.0; // 简化

    if (Math.abs(tStat) > criticalValue) {
      changePoints.push({
        index: i,
        date: timeSeries[i].date,
        tStatistic: tStat,
        pValue: 2 * (1 - normalCDF(Math.abs(tStat))),
        change: meanAfter - meanBefore,
        type: meanAfter > meanBefore ? 'increase' : 'decrease'
      });
    }
  }

  return changePoints;
}
```

---

## 4. 异常值检测

### 4.1 百分位数法

**用途**：识别超出正常范围的极端值。

```javascript
function detectOutliersPercentile(timeSeries, lower = 5, upper = 95) {
  const values = timeSeries.map(d => d.value);
  const n = values.length;

  // 计算百分位数
  const sorted = [...values].sort((a, b) => a - b);
  const lowerPercentile = sorted[Math.floor(n * lower / 100)];
  const upperPercentile = sorted[Math.floor(n * upper / 100)];

  // 检测异常值
  const outliers = timeSeries.filter((d, i) => {
    const value = d.value;
    return value < lowerPercentile || value > upperPercentile;
  });

  return {
    lowerBound: lowerPercentile,
    upperBound: upperPercentile,
    outliers: outliers.map(o => ({
      date: o.date,
      value: o.value,
      type: o.value < lowerPercentile ? 'low' : 'high'
    })),
    outlierCount: outliers.length,
    outlierRate: outliers.length / n
  };
}
```

### 4.2 IQR法（四分位距）

**用途**：使用箱线图规则检测异常值。

```javascript
function detectOutliersIQR(timeSeries, multiplier = 1.5) {
  const values = timeSeries.map(d => d.value);
  const n = values.length;

  // 计算四分位数
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(n * 0.25)];
  const q2 = sorted[Math.floor(n * 0.5)]; // 中位数
  const q3 = sorted[Math.floor(n * 0.75)];

  const iqr = q3 - q1;
  const lowerFence = q1 - multiplier * iqr;
  const upperFence = q3 + multiplier * iqr;

  // 检测异常值
  const outliers = timeSeries.filter(d => {
    return d.value < lowerFence || d.value > upperFence;
  });

  return {
    q1: q1,
    q2: q2,
    q3: q3,
    iqr: iqr,
    lowerFence: lowerFence,
    upperFence: upperFence,
    outliers: outliers.map(o => ({
      date: o.date,
      value: o.value,
      type: o.value < lowerFence ? 'low' : 'high',
      severity: o.value < lowerFence - 2 * iqr || o.value > upperFence + 2 * iqr ? 'extreme' : 'mild'
    }))
  };
}
```

---

## 5. 统计指标计算

### 5.1 描述性统计

```javascript
function descriptiveStats(timeSeries) {
  const values = timeSeries.map(d => d.value);
  const n = values.length;

  // 中心趋势
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(n / 2)];

  // 离散程度
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);
  const range = sorted[n - 1] - sorted[0];

  // 百分位数
  const percentiles = {
    p25: sorted[Math.floor(n * 0.25)],
    p50: median,
    p75: sorted[Math.floor(n * 0.75)]
  };

  // 变异系数（CV = σ/μ，用于比较不同量纲的数据）
  const cv = mean !== 0 ? (stdDev / mean) * 100 : 0;

  return {
    count: n,
    mean: mean,
    median: median,
    mode: calculateMode(sorted),
    stdDev: stdDev,
    variance: variance,
    range: range,
    min: sorted[0],
    max: sorted[n - 1],
    percentiles: percentiles,
    iqr: percentiles.p75 - percentiles.p25,
    cv: cv
  };
}

function calculateMode(sortedArray) {
  const frequency = {};
  sortedArray.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
  });

  let maxFreq = 0;
  let mode = null;
  for (const val in frequency) {
    if (frequency[val] > maxFreq) {
      maxFreq = frequency[val];
      mode = Number(val);
    }
  }
  return mode;
}
```

### 5.2 变化率计算

```javascript
function calculateChangeRate(timeSeries) {
  const values = timeSeries.map(d => d.value);
  const n = values.length;

  if (n < 2) {
    return null;
  }

  // 简单变化率（首尾）
  const simpleRate = ((values[n - 1] - values[0]) / values[0]) * 100;

  // 平均变化率（逐日）
  const dailyRates = [];
  for (let i = 1; i < n; i++) {
    const rate = ((values[i] - values[i - 1]) / values[i - 1]) * 100;
    dailyRates.push(rate);
  }

  const avgDailyRate = dailyRates.reduce((a, b) => a + b, 0) / dailyRates.length;
  const stdDailyRate = Math.sqrt(
    dailyRates.reduce((a, b) => a + Math.pow(b - avgDailyRate, 2), 0) / (dailyRates.length - 1)
  );

  return {
    simpleRate: simpleRate,          // 总变化率（%）
    avgDailyRate: avgDailyRate,     // 平均日变化率（%）
    stdDailyRate: stdDailyRate,     // 日变化率标准差
    volatility: stdDailyRate,        // 波动性
    maxGain: Math.max(...dailyRates),   // 最大日增幅（%）
    maxLoss: Math.min(...dailyRates)    // 最大日跌幅（%）
  };
}
```

---

## 6. 预测性洞察生成

### 6.1 风险评估

```javascript
function assessRisks(trends, thresholds) {
  const risks = [];

  // 体重风险评估
  if (trends.weight) {
    const bmi = trends.weight.currentBMI;
    if (bmi < 18.5) {
      risks.push({
        type: 'underweight',
        severity: 'moderate',
        factor: 'BMI偏低',
        value: bmi,
        message: 'BMI偏低可能影响免疫力'
      });
    } else if (bmi > 28) {
      risks.push({
        type: 'overweight',
        severity: bmi > 30 ? 'high' : 'moderate',
        factor: 'BMI偏高',
        value: bmi,
        message: 'BMI偏高增加慢性病风险'
      });
    }

    // 快速体重变化
    if (Math.abs(trends.weight.percentChange) > 10) {
      risks.push({
        type: 'rapid_weight_change',
        severity: 'high',
        factor: '体重快速变化',
        value: trends.weight.percentChange,
        message: `${Math.abs(trends.weight.percentChange).toFixed(1)}%的体重变化需关注`
      });
    }
  }

  // 症状风险评估
  if (trends.symptoms) {
    const { mostFrequent, frequency } = trends.symptoms;
    const avgMonthly = frequency / 3; // 假设3个月数据

    if (avgMonthly > 10) {
      risks.push({
        type: 'frequent_symptoms',
        severity: 'high',
        factor: '症状频繁',
        symptom: mostFrequent,
        value: avgMonthly,
        message: `${mostFrequent}每月发作${Math.round(avgMonthly)}次，建议就医`
      });
    }
  }

  // 用药依从性风险
  if (trends.medications) {
    if (trends.medications.adherence < 70) {
      risks.push({
        type: 'poor_adherence',
        severity: 'moderate',
        factor: '用药依从性低',
        value: trends.medications.adherence,
        message: '依从性低可能影响治疗效果'
      });
    }
  }

  return risks;
}
```

### 6.2 预防建议生成

```javascript
function generateRecommendations(trends, correlations) {
  const recommendations = [];

  // 基于趋势的建议
  if (trends.weight && trends.weight.direction === 'decreasing') {
    recommendations.push({
      type: 'maintain',
      priority: 'low',
      message: '体重管理良好，继续保持当前方法'
    });
  }

  if (trends.symptoms && trends.symptoms.trend === 'decreasing') {
    recommendations.push({
      type: 'positive',
      priority: 'low',
      message: '症状频率下降，继续当前护理方案'
    });
  }

  // 基于相关性的建议
  if (correlations.some(c => c.x === '睡眠时长' && c.y === '情绪评分' && c.coefficient > 0.7)) {
    recommendations.push({
      type: 'improvement',
      priority: 'high',
      message: '提高睡眠时长至7-8小时可改善情绪状态'
    });
  }

  if (correlations.some(c => c.x === '用药依从性' && c.y === '症状频率' && c.coefficient < -0.6)) {
    recommendations.push({
      type: 'improvement',
      priority: 'high',
      message: '提高用药依从性可减少症状发作'
    });
  }

  // 基于风险的建议
  trends.risks.forEach(risk => {
    if (risk.type === 'poor_adherence') {
      recommendations.push({
        type: 'action',
        priority: 'high',
        message: '设置用药提醒，提高依从性至90%以上'
      });
    }
  });

  return recommendations.sort((a, b) => {
    const priorityOrder = { 'high': 0, 'moderate': 1, 'low': 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
```

### 6.3 早期预警

```javascript
function generateEarlyWarnings(trends) {
  const warnings = [];

  // 体重下降过快
  if (trends.weight && trends.weight.percentChange < -10) {
    warnings.push({
      type: 'weight_loss',
      urgency: 'high',
      message: '体重快速下降（>-10%），建议咨询医生',
      indicator: 'weight_percent_change',
      threshold: -10,
      currentValue: trends.weight.percentChange
    });
  }

  // 症状频率上升
  if (trends.symptoms && trends.symptoms.frequencyTrend === 'increasing') {
    warnings.push({
      type: 'symptom_increase',
      urgency: 'moderate',
      message: '症状频率上升，建议关注并记录诱因',
      indicator: 'symptom_frequency'
    });
  }

  // 血压/化验指标恶化
  if (trends.labResults) {
    trends.labResults.forEach(indicator => {
      if (indicator.trend === 'worsening' && indicator.severity === 'abnormal') {
        warnings.push({
          type: 'lab_worsening',
          urgency: 'high',
          message: `${indicator.name}指标恶化且异常，建议就医`,
          indicator: indicator.name,
          currentValue: indicator.value,
          referenceRange: indicator.reference_range
        });
      }
    });
  }

  return warnings;
}
```

---

## 7. 图表数据准备

### 7.1 折线图数据

```javascript
function prepareLineChartData(timeSeries, yAxisTitle) {
  return {
    xAxis: {
      type: 'category',
      data: timeSeries.map(d => d.date),
      name: '日期'
    },
    yAxis: {
      type: 'value',
      name: yAxisTitle
    },
    series: [{
      name: yAxisTitle,
      type: 'line',
      data: timeSeries.map(d => d.value),
      smooth: true,
      markLine: {
        data: [{ type: 'average', name: '平均值' }]
      }
    }]
  };
}
```

### 7.2 热力图数据

```javascript
function prepareHeatmapData(correlations, xLabels, yLabels) {
  // 将相关矩阵转换为ECharts热力图格式
  const data = [];

  correlations.forEach((row, i) => {
    row.forEach((value, j) => {
      data.push([j, i, value]); // [x, y, value]
    });
  });

  return {
    tooltip: {
      position: 'top',
      formatter: (params) => {
        return `${xLabels[params.data[0]]} vs ${yLabels[params.data[1]]}<br/>相关系数: ${params.data[2].toFixed(2)}`;
      }
    },
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: xLabels,
      splitArea: { show: true },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'category',
      data: yLabels,
      splitArea: { show: true },
      splitLine: { show: false }
    },
    visualMap: {
      min: -1,
      max: 1,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffcc', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      },
      textStyle: { color: '#333' }
    },
    series: [{
      name: '相关性',
      type: 'heatmap',
      data: data,
      label: {
        show: true,
        formatter: (params) => params.data[2].toFixed(2)
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
}
```

---

## 算法选择指南

### 根据数据类型选择算法

| 数据类型 | 推荐算法 | 输出 |
|---------|---------|------|
| 体重/BMI趋势 | 线性回归 | 斜率、R²、方向 |
| 症状频率 | 描述统计 | 频数、百分比 |
| 用药依从性 | 百分比计算 | 依从率% |
| 连续变量相关 | 皮尔逊相关 | 相关系数 |
| 有序变量相关 | 斯皮尔曼相关 | 相关系数 |
| 时间序列模式 | 时间序列分解 | 趋势+季节+残差 |
| 变化检测 | CUSUM或t检验 | 变化点列表 |
| 极端值检测 | IQR法 | 异常值列表 |

### 根据数据量选择算法

| 数据量 | 推荐算法 | 注意事项 |
|--------|---------|---------|
| < 5个点 | 描述统计 | 无法进行趋势分析 |
| 5-20个点 | 线性回归、移动平均 | 趋势可靠性有限 |
| 20-60个点 | 线性回归、相关性分析 | 可进行初步分析 |
| > 60个点 | 所有算法 | 分析结果可靠 |

---

## 性能优化

### 数据读取优化
```javascript
// 仅读取需要的文件
function readDataForPeriod(startDate, endDate) {
  const pattern = `data/symptoms/${startDate.year}-${startDate.month.toString().padStart(2, '0')}/*.json`;
  const files = glob(pattern);

  // 只读取匹配的文件
  return files.map(file => JSON.parse(readFile(file)));
}
```

### 增量计算
```javascript
// 缓存中间结果
const cache = new Map();

function calculateWithCache(key, compute) {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = compute();
  cache.set(key, result);
  return result;
}
```

---

## 算法验证

### 验证方法
- **交叉验证**：将数据分为训练集和测试集，验证算法稳定性
- **可视化检查**：绘制数据图表，人工验证趋势检测准确性
- **敏感性分析**：调整参数（如窗口大小），评估结果稳定性

### 准确性标准
- **趋势检测**：R² > 0.5 为可靠趋势
- **相关性分析**：p < 0.05 为统计显著
- **变化点检测**：需要至少2个连续数据点支持
