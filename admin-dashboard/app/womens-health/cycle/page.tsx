'use client';

import { useState, useEffect, useMemo } from 'react';
import { CycleTrackerData, Cycle } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendChart } from '@/components/analytics/TrendChart';
import { MultiMetricChart } from '@/components/analytics/MultiMetricChart';
import { cyclesToTimeSeries, calculateCycleRegularity } from '@/lib/analytics/transformers';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function WomensHealthCyclePage() {
  const [cycleData, setCycleData] = useState<CycleTrackerData | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data/cycle');
        const data = await response.json();
        setCycleData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">月经周期趋势</h1>
          <p className="text-gray-600 mt-1">记录和追踪您的月经周期</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!cycleData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">月经周期趋势</h1>
          <p className="text-gray-600 mt-1">记录和追踪您的月经周期</p>
        </div>
        <div className="text-center py-12 text-gray-500">暂无周期数据</div>
      </div>
    );
  }

  // Calculate regularity metrics
  const regularity = useMemo(() => {
    return calculateCycleRegularity(cycleData.cycles);
  }, [cycleData.cycles]);

  // Convert to time series for charts
  const cycleLengthTimeSeries = useMemo(() => {
    return cyclesToTimeSeries(cycleData.cycles);
  }, [cycleData.cycles]);

  // Trend icon component
  const TrendIcon = ({ trend }: { trend: 'improving' | 'declining' | 'stable' }) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  // Table columns
  const columns: ColumnsType<Cycle> = [
    {
      title: '周期开始',
      dataIndex: 'period_start',
      key: 'period_start',
      render: (date: string) => format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN }),
      sorter: (a, b) => new Date(a.period_start).getTime() - new Date(b.period_start).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: '周期长度',
      dataIndex: 'cycle_length',
      key: 'cycle_length',
      render: (length: number) => `${length} 天`,
      sorter: (a, b) => a.cycle_length - b.cycle_length,
    },
    {
      title: '经期长度',
      dataIndex: 'period_length',
      key: 'period_length',
      render: (length: number) => `${length} 天`,
      sorter: (a, b) => a.period_length - b.period_length,
    },
    {
      title: '流量模式',
      dataIndex: 'flow_pattern',
      key: 'flow_pattern',
      render: (pattern: string) => {
        const colorMap: Record<string, string> = {
          'light': 'green',
          'medium': 'blue',
          'heavy': 'red',
        };
        const labelMap: Record<string, string> = {
          'light': '少量',
          'medium': '中等',
          'heavy': '大量',
        };
        return <Tag color={colorMap[pattern]}>{labelMap[pattern]}</Tag>;
      },
    },
    {
      title: '排卵日',
      dataIndex: 'ovulation_date',
      key: 'ovulation_date',
      render: (date: string) => format(new Date(date), 'MM月dd日', { locale: zhCN }),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">月经周期趋势</h1>
        <p className="text-gray-600 mt-1">记录和追踪您的月经周期变化</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">平均周期长度</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {cycleData.statistics.average_cycle_length} 天
            </p>
            <p className="text-xs text-gray-500 mt-1">
              范围: {cycleData.statistics.cycle_length_range[0]}-{cycleData.statistics.cycle_length_range[1]} 天
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">周期规律度</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {regularity.score.toFixed(1)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <TrendIcon trend={regularity.trend} />
              <p className="text-xs text-gray-500">
                {regularity.trend === 'improving' ? '改善中' :
                 regularity.trend === 'declining' ? '变差' : '稳定'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">标准差</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {regularity.stdDev.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {regularity.stdDev < 1 ? '非常规律' : regularity.stdDev < 2 ? '规律' : '不规律'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">已跟踪周期</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {cycleData.statistics.total_cycles_tracked}
            </p>
            <p className="text-xs text-gray-500 mt-1">个周期</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          data={cycleLengthTimeSeries}
          title="周期长度趋势"
          color="#ec4899"
          height={300}
          showReferenceLine={true}
          referenceValue={cycleData.statistics.average_cycle_length}
          unit="天"
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              常见症状
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(cycleData.statistics.most_common_symptoms).map(([phase, symptoms]) => {
                const phaseLabelMap: Record<string, string> = {
                  'menstrual': '月经期',
                  'follicular': '卵泡期',
                  'ovulation': '排卵期',
                  'luteal': '黄体期',
                };
                return (
                  <div key={phase}>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {phaseLabelMap[phase]}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {symptoms.map((symptom, index) => (
                        <Tag key={index} color="pink">
                          {symptom}
                        </Tag>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cycle History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            周期历史记录
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            共 {cycleData.cycles.length} 个周期
          </p>
        </CardHeader>
        <Table
          columns={columns}
          dataSource={cycleData.cycles}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
}
