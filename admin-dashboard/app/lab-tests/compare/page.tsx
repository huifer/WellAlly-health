'use client';

import { useState, useEffect } from 'react';
import { LabTest } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, Button, Space } from 'antd';
import { TrendChart, AnalyticsFilters } from '@/components/analytics';
import { GitCompare, Calendar } from 'lucide-react';

export default function LabTestsComparePage() {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestType, setSelectedTestType] = useState<string>('');
  const [selectedTests, setSelectedTests] = useState<LabTest[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data/lab-tests');
        const data = await response.json();
        setLabTests(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Get unique test types
  const testTypes = Array.from(new Set(labTests.map(t => t.type)));

  // Filter tests by selected type
  const filteredTests = labTests.filter(t => t.type === selectedTestType);

  useEffect(() => {
    if (filteredTests.length > 0) {
      // Select the 2 most recent tests by default
      setSelectedTests(filteredTests.slice(0, 2));
    }
  }, [selectedTestType, filteredTests]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">检查对比</h1>
          <p className="text-gray-600 mt-1">对比不同时期的检查检验结果</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  if (labTests.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">检查对比</h1>
          <p className="text-gray-600 mt-1">对比不同时期的检查检验结果</p>
        </div>
        <div className="text-center py-12 text-gray-500">暂无检查记录</div>
      </div>
    );
  }

  // Transform test data for comparison
  const getComparisonData = () => {
    if (selectedTests.length === 0) return [];

    // Get all unique indicators across selected tests
    const allIndicators = new Set<string>();
    selectedTests.forEach(test => {
      test.items.forEach(item => {
        allIndicators.add(item.name);
      });
    });

    // Create comparison data for each indicator
    return Array.from(allIndicators).map(indicatorName => {
      const dataPoints = selectedTests.map(test => {
        const item = test.items.find(i => i.name === indicatorName);
        return {
          date: test.date,
          timestamp: new Date(test.date).getTime(),
          value: item?.value || 0,
          unit: item?.unit || '',
          min_ref: item?.min_ref || 0,
          max_ref: item?.max_ref || 0,
          is_abnormal: item?.is_abnormal || false,
        };
      }).filter(d => d.value !== 0);

      return {
        name: indicatorName,
        data: dataPoints,
        unit: dataPoints[0]?.unit || '',
      };
    }).filter(d => d.data.length > 0);
  };

  const comparisonData = getComparisonData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">检查对比</h1>
        <p className="text-gray-600 mt-1">对比不同时期的检查检验结果</p>
      </div>

      {/* Test Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            选择检查类型
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                检查类型
              </label>
              <Select
                style={{ width: '100%' }}
                value={selectedTestType}
                onChange={setSelectedTestType}
                options={testTypes.map(type => ({ label: type, value: type }))}
              />
            </div>

            {filteredTests.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择对比的检查 (最多选择5次)
                </label>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  value={selectedTests.map(t => t.id)}
                  onChange={(values) => {
                    const tests = filteredTests.filter(t => values.includes(t.id));
                    setSelectedTests(tests.slice(0, 5));
                  }}
                  options={filteredTests.map(t => ({
                    label: `${t.date} - ${t.type}`,
                    value: t.id,
                  }))}
                  maxTagCount={3}
                />
              </div>
            )}

            {selectedTests.length > 0 && (
              <div className="text-sm text-gray-600">
                <p>已选择 {selectedTests.length} 次检查:</p>
                <ul className="mt-2 space-y-1">
                  {selectedTests.map(test => (
                    <li key={test.id} className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {test.date} - {test.hospital || '未知医院'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Space>
        </CardContent>
      </Card>

      {/* Comparison Charts */}
      {selectedTests.length >= 2 && comparisonData.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                指标趋势对比
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                显示所选检查中关键指标的变化趋势
              </p>
            </CardHeader>
            <CardContent>
              {comparisonData.slice(0, 6).map((indicator, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <TrendChart
                    data={indicator.data}
                    title={indicator.name}
                    unit={indicator.unit}
                    color="#3b82f6"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                异常指标汇总
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                所选检查中的异常结果汇总
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedTests.map(test => {
                  const abnormalItems = test.items.filter(item => item.is_abnormal);
                  return (
                    <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{test.date}</p>
                          <p className="text-sm text-gray-500">{test.hospital || '未知医院'}</p>
                        </div>
                        <span className="text-sm font-medium text-red-600">
                          {abnormalItems.length} 项异常
                        </span>
                      </div>
                      {abnormalItems.length > 0 ? (
                        <div className="mt-3 space-y-2">
                          {abnormalItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm bg-red-50 p-2 rounded">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-red-600">
                                {item.value} {item.unit}
                                <span className="text-gray-500 ml-2">
                                  (参考: {item.min_ref}-{item.max_ref})
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-green-600 mt-2">✅ 所有指标正常</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {selectedTests.length < 2 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <GitCompare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">请至少选择2次检查</p>
              <p className="text-sm mt-1">选择多次检查后即可查看趋势对比</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
