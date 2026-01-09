import { format, parseISO, subMonths, subYears } from 'date-fns';
import { Profile, LabTest, WeightHistory, RadiationRecord, Cycle, CycleDailyLog, MenopauseSymptomLog } from '../types';
import { TimeSeriesDataPoint, AggregationPeriod } from '../types/analytics';

/**
 * Convert weight history to time series data points
 */
export function weightHistoryToTimeSeries(history: WeightHistory[]): TimeSeriesDataPoint[] {
  return history.map(entry => ({
    date: entry.date,
    timestamp: new Date(entry.date).getTime(),
    value: entry.weight,
    metadata: {
      bmi: entry.bmi,
      notes: entry.notes
    }
  })).sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Extract specific lab test values as time series
 */
export function labTestToTimeSeries(
  labTests: LabTest[],
  testName: string
): TimeSeriesDataPoint[] {
  const points: TimeSeriesDataPoint[] = [];

  labTests.forEach(test => {
    const item = test.items.find(i => i.name === testName);
    if (item) {
      points.push({
        date: test.date,
        timestamp: new Date(test.date).getTime(),
        value: Number(item.value),
        metadata: {
          unit: item.unit,
          isAbnormal: item.is_abnormal,
          hospital: test.hospital,
          minRef: item.min_ref,
          maxRef: item.max_ref
        }
      });
    }
  });

  return points.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Aggregate time series data by period
 */
export function aggregateByPeriod(
  data: TimeSeriesDataPoint[],
  period: AggregationPeriod
): TimeSeriesDataPoint[] {
  if (data.length === 0) return [];

  const grouped = new Map<string, TimeSeriesDataPoint[]>();

  data.forEach(point => {
    const date = parseISO(point.date);
    let key: string;

    switch (period) {
      case 'daily':
        key = format(date, 'yyyy-MM-dd');
        break;
      case 'weekly':
        key = format(date, 'yyyy-ww');
        break;
      case 'monthly':
        key = format(date, 'yyyy-MM');
        break;
      case 'quarterly':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `${date.getFullYear()}-Q${quarter}`;
        break;
      case 'yearly':
        key = format(date, 'yyyy');
        break;
    }

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(point);
  });

  // Calculate average for each group
  return Array.from(grouped.entries()).map(([key, points]) => ({
    date: key,
    timestamp: Math.min(...points.map(p => p.timestamp)),
    value: points.reduce((sum, p) => sum + p.value, 0) / points.length,
    metadata: {
      count: points.length,
      min: Math.min(...points.map(p => p.value)),
      max: Math.max(...points.map(p => p.value))
    }
  })).sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Filter data by date range
 */
export function filterByDateRange(
  data: TimeSeriesDataPoint[],
  range: { start: string; end: string }
): TimeSeriesDataPoint[] {
  const start = new Date(range.start).getTime();
  const end = new Date(range.end).getTime();

  return data.filter(point => point.timestamp >= start && point.timestamp <= end);
}

/**
 * Calculate moving average
 */
export function calculateMovingAverage(
  data: TimeSeriesDataPoint[],
  window: number
): number[] {
  const result: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1);
    const avg = slice.reduce((sum, p) => sum + p.value, 0) / slice.length;
    result.push(Number(avg.toFixed(2)));
  }

  return result;
}

/**
 * Calculate linear regression
 */
export function calculateLinearRegression(data: TimeSeriesDataPoint[]) {
  const n = data.length;
  if (n < 2) return null;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  data.forEach((point, i) => {
    sumX += i;
    sumY += point.value;
    sumXY += i * point.value;
    sumX2 += i * i;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R²
  const yMean = sumY / n;
  let ssTotal = 0, ssResidual = 0;

  data.forEach((point, i) => {
    const yPred = slope * i + intercept;
    ssTotal += Math.pow(point.value - yMean, 2);
    ssResidual += Math.pow(point.value - yPred, 2);
  });

  const r2 = 1 - ssResidual / ssTotal;

  return { slope, intercept, r2 };
}

/**
 * Get preset date ranges
 */
export function getPresetRange(preset: string): { start: string; end: string } {
  const now = new Date();
  const end = format(now, 'yyyy-MM-dd');

  let start: string;
  switch (preset) {
    case '3M':
      start = format(subMonths(now, 3), 'yyyy-MM-dd');
      break;
    case '6M':
      start = format(subMonths(now, 6), 'yyyy-MM-dd');
      break;
    case '1Y':
      start = format(subYears(now, 1), 'yyyy-MM-dd');
      break;
    case '3Y':
      start = format(subYears(now, 3), 'yyyy-MM-dd');
      break;
    case 'ALL':
    default:
      start = '2018-01-01'; // Based on earliest data
      break;
  }

  return { start, end };
}

/**
 * Convert radiation records to time series data points
 */
export function radiationRecordsToTimeSeries(records: RadiationRecord[]): TimeSeriesDataPoint[] {
  return records.map(record => ({
    date: record.date,
    timestamp: new Date(record.date).getTime(),
    value: record.effective_dose,
    metadata: {
      exam_type: record.exam_type,
      body_part: record.body_part,
      hospital: record.hospital,
      indication: record.indication
    }
  })).sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Calculate cumulative radiation dose over time
 */
export function calculateCumulativeDose(records: RadiationRecord[]): Array<{ date: string; cumulative: number }> {
  let cumulative = 0;
  return records
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(record => {
      cumulative += record.effective_dose;
      return { date: record.date, cumulative };
    });
}

/**
 * Get exam type color for visualization
 */
export function getExamTypeColor(examType: string): string {
  const colorMap: Record<string, string> = {
    'X光': '#3b82f6', // blue
    'CT': '#ef4444', // red
    '乳腺钼靶': '#a855f7', // purple
    '超声': '#10b981', // green
    '其他': '#6b7280' // gray
  };
  return colorMap[examType] || colorMap['其他'];
}

/**
 * Get safety level color based on annual dose
 */
export function getSafetyLevelColor(annualDose: number): string {
  if (annualDose < 1) return '#22c55e'; // green - safe
  if (annualDose < 5) return '#eab308'; // yellow - caution
  if (annualDose < 10) return '#f97316'; // orange - warning
  return '#ef4444'; // red - danger
}

/**
 * Get safety level label
 */
export function getSafetyLevelLabel(annualDose: number): string {
  if (annualDose < 1) return '安全';
  if (annualDose < 5) return '注意';
  if (annualDose < 10) return '警告';
  return '危险';
}

/**
 * Convert cycles to time series data points
 */
export function cyclesToTimeSeries(cycles: Cycle[]): TimeSeriesDataPoint[] {
  return cycles.map(cycle => ({
    date: cycle.period_start,
    timestamp: new Date(cycle.period_start).getTime(),
    value: cycle.cycle_length,
    metadata: {
      period_length: cycle.period_length,
      flow_pattern: cycle.flow_pattern,
      ovulation_date: cycle.ovulation_date,
    }
  })).sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Calculate cycle regularity metrics
 */
export function calculateCycleRegularity(cycles: Cycle[]): {
  score: number;
  stdDev: number;
  range: [number, number];
  trend: 'improving' | 'declining' | 'stable';
} {
  const lengths = cycles.map(c => c.cycle_length);
  const avg = lengths.reduce((a, b) => a + b) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);

  // Regularity score: inverse of stdDev (0-10 scale)
  const score = Math.max(0, Math.min(10, 10 - stdDev * 2));
  const range = [Math.min(...lengths), Math.max(...lengths)] as [number, number];

  // Calculate trend
  if (lengths.length < 4) {
    return { score, stdDev, range, trend: 'stable' };
  }

  const firstHalf = lengths.slice(0, Math.floor(lengths.length / 2));
  const secondHalf = lengths.slice(Math.ceil(lengths.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b) / secondHalf.length;
  const diff = Math.abs(secondAvg - avg) - Math.abs(firstAvg - avg);
  const trend = diff < 0.5 ? 'stable' : secondAvg < firstAvg ? 'improving' : 'declining';

  return { score, stdDev, range, trend };
}

/**
 * Get cycle phase for a specific date
 */
export function getCyclePhaseForDate(cycles: Cycle[], date: Date): {
  phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  cycleDay: number;
  cycle: Cycle | null;
} {
  const targetTime = date.getTime();

  for (const cycle of cycles) {
    const startTime = new Date(cycle.cycle_start_date).getTime();
    const endTime = new Date(cycle.cycle_end_date).getTime();

    if (targetTime >= startTime && targetTime <= endTime) {
      const daysSinceStart = Math.floor((targetTime - startTime) / (1000 * 60 * 60 * 24));
      const cycleDay = daysSinceStart + 1;

      let phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
      if (cycleDay <= cycle.period_length) {
        phase = 'menstrual';
      } else if (cycleDay <= 13) {
        phase = 'follicular';
      } else if (cycleDay === 14 || cycleDay === 15) {
        phase = 'ovulation';
      } else {
        phase = 'luteal';
      }

      return { phase, cycleDay, cycle };
    }
  }

  return { phase: 'follicular', cycleDay: 0, cycle: null };
}

/**
 * Get phase color for visualization
 */
export function getPhaseColor(phase: string): string {
  const colorMap: Record<string, string> = {
    'menstrual': '#ef4444', // red
    'follicular': '#86efac', // light green
    'ovulation': '#a855f7', // purple
    'luteal': '#fde047', // yellow
  };
  return colorMap[phase] || '#e5e7eb';
}

/**
 * Get phase label in Chinese
 */
export function getPhaseLabel(phase: string): string {
  const labelMap: Record<string, string> = {
    'menstrual': '月经期',
    'follicular': '卵泡期',
    'ovulation': '排卵期',
    'luteal': '黄体期',
  };
  return labelMap[phase] || phase;
}

/**
 * Convert menopause symptoms to time series
 */
export function menopauseSymptomsToTimeSeries(
  symptomsLog: MenopauseSymptomLog[],
  symptomType: string
): TimeSeriesDataPoint[] {
  return symptomsLog.map(log => {
    let value = 0;
    const symptom = (log as any)[symptomType];

    if (symptom && typeof symptom === 'object') {
      if (symptom.severity === 'mild') value = 1;
      else if (symptom.severity === 'moderate') value = 2;
      else if (symptom.severity === 'severe') value = 3;
    }

    return {
      date: log.date,
      timestamp: new Date(log.date).getTime(),
      value,
      metadata: {
        notes: log.notes,
        frequency: symptom?.frequency,
      }
    };
  }).sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Get symptom severity color
 */
export function getSymptomSeverityColor(severity: number): string {
  if (severity === 0) return '#e5e7eb'; // gray - none
  if (severity === 1) return '#22c55e'; // green - mild
  if (severity === 2) return '#eab308'; // yellow - moderate
  return '#ef4444'; // red - severe
}

/**
 * Get symptom severity label
 */
export function getSymptomSeverityLabel(severity: number): string {
  if (severity === 0) return '无';
  if (severity === 1) return '轻度';
  if (severity === 2) return '中度';
  return '重度';
}
