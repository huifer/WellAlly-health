'use client';

import { useState, useMemo, useEffect } from 'react';
import { loadLabTests } from '@/lib/data/actions';
import { TrendChart } from '@/components/analytics/TrendChart';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { labTestToTimeSeries, getPresetRange } from '@/lib/analytics/transformers';
import { FlaskConical, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AnalyticsLabTrendsPage() {
  const [labTests, setLabTests] = useState<any>([]);

  const [dateRange, setDateRange] = useState<{ type: 'preset' | 'custom'; preset?: string; start?: string; end?: string }>({ type: 'preset', preset: 'ALL' });
  const [selectedTest, setSelectedTest] = useState('空腹血糖');

  useEffect(() => {
    loadLabTests().then(setLabTests);
  }, []);

  // Extract all unique test names
  const allTestNames = useMemo(() => {
    if (!labTests || labTests.length === 0) return [];
    const names = new Set<string>();
    labTests.forEach((test: any) => {
      test.items.forEach((item: any) => names.add(item.name));
    });
    return Array.from(names).sort();
  }, [labTests]);

  // Get available tests for selected indicator
  const testHistory = useMemo(() => {
    return labTestToTimeSeries(labTests, selectedTest);
  }, [labTests, selectedTest]);

  // Filter by date range
  const filteredData = useMemo(() => {
    const range = getPresetRange(dateRange.preset || 'ALL');
    return testHistory.filter(point => {
      const timestamp = point.timestamp;
      return timestamp >= new Date(range.start).getTime() &&
             timestamp <= new Date(range.end).getTime();
    });
  }, [testHistory, dateRange]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (filteredData.length === 0) return null;

    const values = filteredData.map(d => d.value);
    const abnormal = filteredData.filter(d => d.metadata?.isAbnormal).length;

    return {
      total: filteredData.length,
      abnormal,
      normal: filteredData.length - abnormal,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((sum, v) => sum + v, 0) / values.length,
      abnormalRate: (abnormal / filteredData.length) * 100
    };
  }, [filteredData]);

  // Get reference range from latest test
  const referenceRange = useMemo(() => {
    if (testHistory.length === 0) return null;
    const latest = testHistory[testHistory.length - 1];
    return {
      min: latest.metadata?.minRef,
      max: latest.metadata?.maxRef,
      unit: latest.metadata?.unit
    };
  }, [testHistory]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">检查趋势</h1>
        <p className="text-gray-600 mt-1">追踪和分析各项检验指标的历史变化</p>
      </div>

      {!labTests || labTests.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>加载中...</p>
        </div>
      ) : (
        <>
      {/* Test Selector */}
      <div className="bg-white rounded-lg border p-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          选择检验指标
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {allTestNames.map(name => (
            <button
              key={name}
              onClick={() => setSelectedTest(name)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTest === name
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">检验次数</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
              </div>
              <FlaskConical className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">正常次数</p>
                <p className="text-2xl font-bold text-green-600">{statistics.normal}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">异常次数</p>
                <p className="text-2xl font-bold text-orange-600">{statistics.abnormal}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">异常率</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.abnormalRate.toFixed(1)}%
                </p>
              </div>
              <div className="w-10 h-10 flex items-center justify-center">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-600"
                    style={{ width: `${statistics.abnormalRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <AnalyticsFilters
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            aggregation={'daily'} // Lab tests don't need aggregation
            onAggregationChange={() => {}}
          />

          {/* Reference Range Info */}
          {referenceRange && (
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mt-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">参考范围</h4>
              <div className="text-sm text-blue-800">
                <p>最小值: {referenceRange.min}</p>
                <p>最大值: {referenceRange.max}</p>
                <p>单位: {referenceRange.unit}</p>
              </div>
            </div>
          )}

          {/* Statistics Summary */}
          {statistics && (
            <div className="bg-white rounded-lg border p-4 mt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">统计摘要</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">最高值</span>
                  <span className="font-medium">{statistics.max.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">最低值</span>
                  <span className="font-medium">{statistics.min.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">平均值</span>
                  <span className="font-medium">{statistics.avg.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">波动范围</span>
                  <span className="font-medium">
                    {(statistics.max - statistics.min).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          {/* Trend Chart */}
          <TrendChart
            data={filteredData}
            title={`${selectedTest} 趋势`}
            color="#84CC16"
            unit={referenceRange?.unit || ''}
            showMovingAverage={filteredData.length > 3}
            showReferenceLine={!!referenceRange}
            referenceValue={referenceRange ? (Number(referenceRange.max) + Number(referenceRange.min)) / 2 : undefined}
          />

          {/* Data Table */}
          <div className="bg-white rounded-lg border mt-6">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">详细记录</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      日期
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      检验值
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      状态
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      医院
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((point, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(point.date).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {point.value.toFixed(2)} {referenceRange?.unit}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {point.metadata?.isAbnormal ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            异常
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            正常
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {point.metadata?.hospital || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
