'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendChart } from '@/components/analytics/TrendChart';
import { MultiMetricChart } from '@/components/analytics/MultiMetricChart';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { MetricSelector } from '@/components/analytics/MetricSelector';
import { weightHistoryToTimeSeries, aggregateByPeriod, getPresetRange } from '@/lib/analytics/transformers';
import { TrendingUp, Activity, Calendar, TrendingDown, Heart, Droplets, Scale } from 'lucide-react';
import { Statistic, Row, Col } from 'antd';

export default function DashboardTrendsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [labTests, setLabTests] = useState<any[]>([]);
  const [vitalSigns, setVitalSigns] = useState<any>(null);

  // State
  const [dateRange, setDateRange] = useState<{ type: 'preset' | 'custom'; preset?: string; start?: string; end?: string }>({ type: 'preset', preset: '1Y' });
  const [aggregation, setAggregation] = useState('monthly');
  const [selectedMetrics, setSelectedMetrics] = useState(['weight', 'bmi']);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, labRes, vitalRes] = await Promise.all([
          fetch('/api/data/profile'),
          fetch('/api/data/lab-tests'),
          fetch('/api/data/vital-signs')
        ]);
        const profileData = await profileRes.json();
        const labData = await labRes.json();
        const vitalData = await vitalRes.json();
        setProfile(profileData);
        setLabTests(labData);
        setVitalSigns(vitalData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Metric options
  const metricOptions = [
    { id: 'weight', name: '体重', category: '基础指标', color: '#84CC16' },
    { id: 'bmi', name: 'BMI', category: '基础指标', color: '#10b981' },
    { id: 'systolic', name: '收缩压', category: '血压', color: '#ef4444' },
    { id: 'diastolic', name: '舒张压', category: '血压', color: '#f97316' },
    { id: 'fasting_glucose', name: '空腹血糖', category: '血糖', color: '#3b82f6' },
    { id: 'cholesterol', name: '总胆固醇', category: '血脂', color: '#8b5cf6' },
  ];

  // Process weight/BMI data
  const timeSeriesData = useMemo(() => {
    if (!profile) return [];
    const data = weightHistoryToTimeSeries(profile.history || []);
    const range = getPresetRange(dateRange.preset || 'ALL');
    const filtered = data.filter(point => {
      const timestamp = point.timestamp;
      return timestamp >= new Date(range.start).getTime() &&
             timestamp <= new Date(range.end).getTime();
    });
    return aggregateByPeriod(filtered, aggregation as any);
  }, [profile, dateRange, aggregation]);

  // Process blood pressure data
  const bpData = useMemo(() => {
    if (!vitalSigns?.blood_pressure_logs) return [];
    return vitalSigns.blood_pressure_logs.map((log: any) => ({
      date: log.date,
      value: log.systolic,
      metadata: { diastolic: log.diastolic, heart_rate: log.heart_rate }
    }));
  }, [vitalSigns]);

  // Process glucose data
  const glucoseData = useMemo(() => {
    if (!vitalSigns?.glucose_logs) return [];
    return vitalSigns.glucose_logs.map((log: any) => ({
      date: log.date,
      value: log.glucose_level,
      metadata: { timing: log.timing, notes: log.notes }
    }));
  }, [vitalSigns]);

  // Calculate trends
  const weightTrend = useMemo(() => {
    if (timeSeriesData.length < 2) return null;
    const first = timeSeriesData[0].value;
    const last = timeSeriesData[timeSeriesData.length - 1].value;
    const change = last - first;
    const changePercent = first > 0 ? ((change / first) * 100) : 0;
    return {
      change: change.toFixed(1),
      changePercent: changePercent.toFixed(1),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  }, [timeSeriesData]);

  const bpTrend = useMemo(() => {
    if (bpData.length < 2) return null;
    const first = bpData[0].value;
    const last = bpData[bpData.length - 1].value;
    const change = last - first;
    return {
      change: change.toFixed(0),
      direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable'
    };
  }, [bpData]);

  // Prepare multi-metric chart data
  const multiMetricData = useMemo(() => {
    return timeSeriesData.map(point => ({
      date: point.date,
      weight: point.value,
      bmi: point.metadata?.bmi || profile?.calculated?.bmi
    }));
  }, [timeSeriesData, profile]);

  // Prepare blood pressure chart data
  const bpChartData = useMemo(() => {
    return bpData.map((point: any) => ({
      date: new Date(point.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      systolic: point.value,
      diastolic: point.metadata?.diastolic
    }));
  }, [bpData]);

  if (!profile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">健康趋势</h1>
          <p className="text-gray-600 mt-1">查看您的健康指标长期趋势</p>
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
        <p className="text-gray-600 mt-1">查看您的健康指标长期趋势</p>
      </div>

      {/* Filters */}
      <AnalyticsFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        aggregation={aggregation}
        onAggregationChange={setAggregation}
      />

      {/* Overview Stats */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <CardContent className="pt-6">
              <Statistic
                title="当前体重"
                value={profile.calculated?.weight || profile.basic_info?.weight}
                suffix="kg"
                prefix={<Scale className="w-4 h-4 text-green-500" />}
                valueStyle={{ color: weightTrend?.direction === 'down' ? '#52c41a' : '#1890ff' }}
              />
              {weightTrend && (
                <div className="text-xs mt-2">
                  <span className={weightTrend.direction === 'down' ? 'text-green-600' : 'text-red-600'}>
                    {weightTrend.direction === 'up' && <TrendingUp className="w-3 h-3 inline" />}
                    {weightTrend.direction === 'down' && <TrendingDown className="w-3 h-3 inline" />}
                    {' '}{weightTrend.change}kg ({weightTrend.changePercent}%)
                  </span>
                  <span className="text-gray-400 ml-2">vs 起始</span>
                </div>
              )}
            </CardContent>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <CardContent className="pt-6">
              <Statistic
                title="当前BMI"
                value={profile.calculated?.bmi}
                precision={1}
                valueStyle={{ color: '#1890ff' }}
              />
              <div className="text-xs mt-2 text-gray-500">
                {profile.calculated?.bmi_status || '正常'}
              </div>
            </CardContent>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <CardContent className="pt-6">
              <Statistic
                title="最新收缩压"
                value={bpData.length > 0 ? bpData[bpData.length - 1].value : '-'}
                suffix="mmHg"
                prefix={<Heart className="w-4 h-4 text-red-500" />}
              />
              {bpTrend && (
                <div className="text-xs mt-2">
                  <span className={bpTrend.direction === 'stable' ? 'text-green-600' : 'text-orange-600'}>
                    {bpTrend.direction === 'up' && <TrendingUp className="w-3 h-3 inline" />}
                    {bpTrend.direction === 'down' && <TrendingDown className="w-3 h-3 inline" />}
                    {' '}{bpTrend.change}mmHg
                  </span>
                  <span className="text-gray-400 ml-2">变化</span>
                </div>
              )}
            </CardContent>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <CardContent className="pt-6">
              <Statistic
                title="数据点"
                value={timeSeriesData.length + bpData.length + glucoseData.length}
                suffix="个"
                prefix={<Activity className="w-4 h-4 text-purple-500" />}
              />
              <div className="text-xs mt-2 text-gray-500">
                共 {timeSeriesData.length} 个体重点
              </div>
            </CardContent>
          </Card>
        </Col>
      </Row>

      {/* Metric Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">选择指标</CardTitle>
        </CardHeader>
        <CardContent>
          <MetricSelector
            options={metricOptions}
            selected={selectedMetrics}
            onChange={setSelectedMetrics}
          />
        </CardContent>
      </Card>

      {/* Weight & BMI Trends */}
      {(selectedMetrics.includes('weight') || selectedMetrics.includes('bmi')) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">体重与BMI趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <MultiMetricChart
              data={multiMetricData}
              title="体重与BMI趋势"
              metrics={[
                { key: 'weight', name: '体重', color: '#84CC16', unit: 'kg' },
                { key: 'bmi', name: 'BMI', color: '#10b981', unit: '' }
              ]}
              height={300}
            />
          </CardContent>
        </Card>
      )}

      {/* Blood Pressure Trends */}
      {selectedMetrics.includes('systolic') && bpChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">血压趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <MultiMetricChart
              data={bpChartData}
              title="血压趋势"
              metrics={[
                { key: 'systolic', name: '收缩压', color: '#ef4444', unit: 'mmHg' },
                { key: 'diastolic', name: '舒张压', color: '#f97316', unit: 'mmHg' }
              ]}
              height={300}
            />
          </CardContent>
        </Card>
      )}

      {/* Glucose Trends */}
      {selectedMetrics.includes('fasting_glucose') && glucoseData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">血糖趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart
              data={glucoseData}
              title="血糖水平"
              color="#3b82f6"
              unit="mmol/L"
              height={300}
              showReferenceLine={true}
              referenceValue={6.1}
            />
          </CardContent>
        </Card>
      )}

      {/* Individual Weight Trend */}
      {selectedMetrics.includes('weight') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">体重详细趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart
              data={timeSeriesData}
              title="体重变化"
              color="#84CC16"
              unit="kg"
              height={300}
              area={true}
              showMovingAverage={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">相关功能</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a href="/analytics/health-trends" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">健康趋势分析</p>
                <p className="text-sm text-gray-600">更详细的趋势分析</p>
              </div>
            </a>
            <a href="/lab-tests" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Activity className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-gray-900">检查记录</p>
                <p className="text-sm text-gray-600">查看所有检查结果</p>
              </div>
            </a>
            <a href="/profile" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium text-gray-900">个人档案</p>
                <p className="text-sm text-gray-600">管理基础信息</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
