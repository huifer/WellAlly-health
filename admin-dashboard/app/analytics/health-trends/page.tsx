'use client';

import { useState, useMemo, useEffect } from 'react';
import { loadProfileData } from '@/lib/data/actions';
import { TrendChart } from '@/components/analytics/TrendChart';
import { MultiMetricChart } from '@/components/analytics/MultiMetricChart';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { MetricSelector } from '@/components/analytics/MetricSelector';
import { weightHistoryToTimeSeries, aggregateByPeriod, getPresetRange } from '@/lib/analytics/transformers';
import { TrendingUp, Activity, Calendar, TrendingDown } from 'lucide-react';

export default function AnalyticsHealthTrendsPage() {
  const [profile, setProfile] = useState<any>(null);

  // State
  const [dateRange, setDateRange] = useState<{ type: 'preset' | 'custom'; preset?: string; start?: string; end?: string }>({ type: 'preset', preset: '1Y' });
  const [aggregation, setAggregation] = useState('monthly');
  const [selectedMetrics, setSelectedMetrics] = useState(['weight', 'bmi']);

  useEffect(() => {
    loadProfileData().then(setProfile);
  }, []);

  // Metric options
  const metricOptions = [
    { id: 'weight', name: '体重', category: '基础指标', color: '#84CC16' },
    { id: 'bmi', name: 'BMI', category: '基础指标', color: '#10b981' },
    { id: 'body_surface_area', name: '体表面积', category: '基础指标', color: '#34d399' },
  ];

  // Process data
  const timeSeriesData = useMemo(() => {
    if (!profile || !profile.history) return [];
    const data = weightHistoryToTimeSeries(profile.history);
    const range = getPresetRange(dateRange.preset || 'ALL');
    const filtered = data.filter(point => {
      const timestamp = point.timestamp;
      return timestamp >= new Date(range.start).getTime() &&
             timestamp <= new Date(range.end).getTime();
    });
    return aggregateByPeriod(filtered, aggregation as any);
  }, [profile, dateRange, aggregation]);

  // Calculate trends
  const weightTrend = useMemo(() => {
    if (timeSeriesData.length < 2) return null;
    const first = timeSeriesData[0].value;
    const last = timeSeriesData[timeSeriesData.length - 1].value;
    const change = last - first;
    const changePercent = (change / first) * 100;
    return {
      change: change.toFixed(1),
      changePercent: changePercent.toFixed(1),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  }, [timeSeriesData]);

  // Prepare multi-metric chart data
  const multiMetricData = useMemo(() => {
    if (!profile?.calculated?.bmi) return [];
    return timeSeriesData.map(point => ({
      date: point.date,
      weight: point.value,
      bmi: point.metadata?.bmi || profile.calculated.bmi
    }));
  }, [timeSeriesData, profile]);

  if (!profile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">健康趋势</h1>
          <p className="text-gray-600 mt-1">查看和分析您的整体健康指标变化趋势</p>
        </div>
        <div className="text-center py-12 text-gray-500">
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">健康趋势</h1>
        <p className="text-gray-600 mt-1">查看和分析您的整体健康指标变化趋势</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">当前体重</p>
              <p className="text-2xl font-bold text-gray-900">
                {profile.basic_info.weight} kg
              </p>
            </div>
            <Activity className="w-10 h-10 text-green-600" />
          </div>
          {weightTrend && (
            <div className={`mt-2 flex items-center text-sm ${
              weightTrend.direction === 'down' ? 'text-green-600' :
              weightTrend.direction === 'up' ? 'text-orange-600' : 'text-gray-600'
            }`}>
              {weightTrend.direction === 'down' ? (
                <TrendingDown className="w-4 h-4 mr-1" />
              ) : weightTrend.direction === 'up' ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : null}
              <span>
                {weightTrend.changePercent}%
                <span className="text-gray-500 ml-1">
                  ({weightTrend.change} kg)
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">当前 BMI</p>
              <p className="text-2xl font-bold text-gray-900">
                {profile.calculated.bmi}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600" />
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {profile.calculated.bmi_status}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">记录总数</p>
              <p className="text-2xl font-bold text-gray-900">
                {profile.history.length}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-green-600" />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            自 {new Date(profile.history[0]?.date).toLocaleDateString('zh-CN')} 起
          </div>
        </div>
      </div>

      {/* Filters and Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <AnalyticsFilters
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            aggregation={aggregation}
            onAggregationChange={setAggregation}
          />
          <div className="mt-4">
            <MetricSelector
              options={metricOptions}
              selected={selectedMetrics}
              onChange={setSelectedMetrics}
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="space-y-6">
            {/* Multi-Metric Chart */}
            {selectedMetrics.length > 1 ? (
              <MultiMetricChart
                data={multiMetricData}
                title="健康指标对比"
                metrics={metricOptions.filter(m => selectedMetrics.includes(m.id)).map(m => ({
                  key: m.id,
                  name: m.name,
                  color: m.color,
                  unit: m.id === 'weight' ? 'kg' : m.id === 'bmi' ? '' : m.id === 'body_surface_area' ? 'm²' : ''
                }))}
              />
            ) : (
              <>
                {selectedMetrics.includes('weight') && (
                  <TrendChart
                    data={timeSeriesData}
                    title="体重趋势"
                    color="#84CC16"
                    unit="kg"
                    showMovingAverage={true}
                    area={true}
                  />
                )}
                {selectedMetrics.includes('bmi') && (
                  <TrendChart
                    data={timeSeriesData.map(p => ({ ...p, value: p.metadata?.bmi || p.value }))}
                    title="BMI 趋势"
                    color="#10b981"
                    showReferenceLine={true}
                    referenceValue={22}
                  />
                )}
              </>
            )}

            {/* Statistics Table */}
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">统计数据</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">最高值</p>
                    <p className="text-lg font-semibold">
                      {Math.max(...timeSeriesData.map(d => d.value)).toFixed(1)} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">最低值</p>
                    <p className="text-lg font-semibold">
                      {Math.min(...timeSeriesData.map(d => d.value)).toFixed(1)} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">平均值</p>
                    <p className="text-lg font-semibold">
                      {(timeSeriesData.reduce((sum, d) => sum + d.value, 0) / timeSeriesData.length).toFixed(1)} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">标准差</p>
                    <p className="text-lg font-semibold">
                      {calculateStdDev(timeSeriesData.map(d => d.value)).toFixed(2)} kg
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateStdDev(values: number[]): number {
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squareDiffs = values.map(v => Math.pow(v - mean, 2));
  return Math.sqrt(squareDiffs.reduce((sum, v) => sum + v, 0) / values.length);
}
