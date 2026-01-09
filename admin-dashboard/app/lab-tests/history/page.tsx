'use client';

import { useState, useEffect } from 'react';
import { LabTest } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, Tag, Badge, Timeline } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Clock, Calendar, FileText, AlertCircle } from 'lucide-react';

export default function LabTestsHistoryPage() {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">检查历史</h1>
          <p className="text-gray-600 mt-1">查看历史检查检验记录的时间线</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  if (labTests.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">检查历史</h1>
          <p className="text-gray-600 mt-1">查看历史检查检验记录的时间线</p>
        </div>
        <div className="text-center py-12 text-gray-500">暂无检查记录</div>
      </div>
    );
  }

  // Group tests by year
  const testsByYear = labTests.reduce((acc: Record<number, LabTest[]>, test) => {
    const year = new Date(test.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(test);
    return acc;
  }, {});

  // Get test type statistics
  const getTestTypeStats = () => {
    const stats: Record<string, number> = {};
    labTests.forEach(test => {
      stats[test.type] = (stats[test.type] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  };

  const testTypeStats = getTestTypeStats();

  const columns: ColumnsType<LabTest> = [
    {
      title: '检查日期',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN }),
      sorter: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      defaultSortOrder: 'descend' as const,
    },
    {
      title: '检查类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>,
      filters: Array.from(new Set(labTests.map(t => t.type))).map(type => ({ text: type, value: type })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '医院',
      dataIndex: 'hospital',
      key: 'hospital',
      ellipsis: true,
    },
    {
      title: '指标数量',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => items.length,
      sorter: (a, b) => a.items.length - b.items.length,
    },
    {
      title: '异常指标',
      key: 'abnormal',
      render: (_, record) => {
        const abnormalCount = record.items.filter((i: any) => i.is_abnormal).length;
        if (abnormalCount === 0) return <Badge status="success" text="无" />;
        return <Badge status="error" text={`${abnormalCount} 项`} />;
      },
      sorter: (a, b) => {
        const aAbnormal = a.items.filter(i => i.is_abnormal).length;
        const bAbnormal = b.items.filter(i => i.is_abnormal).length;
        return bAbnormal - aAbnormal;
      },
    },
    {
      title: '查看详情',
      key: 'action',
      render: (_, record) => (
        <a href={`/lab-tests/${record.id}`} className="text-blue-600 hover:text-blue-800">
          查看详情
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">检查历史</h1>
        <p className="text-gray-600 mt-1">查看历史检查检验记录的时间线</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">总检查次数</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {labTests.length}
                </p>
                <p className="text-xs text-blue-600 mt-1">次检查</p>
              </div>
              <FileText className="w-10 h-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">正常检查</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {labTests.filter(t => t.items.every(i => !i.is_abnormal)).length}
                </p>
                <p className="text-xs text-green-600 mt-1">项正常</p>
              </div>
              <Clock className="w-10 h-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">异常检查</p>
                <p className="text-3xl font-bold text-orange-700 mt-2">
                  {labTests.filter(t => t.items.some(i => i.is_abnormal)).length}
                </p>
                <p className="text-xs text-orange-600 mt-1">项异常</p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">跟踪年限</p>
                <p className="text-3xl font-bold text-purple-700 mt-2">
                  {Object.keys(testsByYear).length}
                </p>
                <p className="text-xs text-purple-600 mt-1">年</p>
              </div>
              <Calendar className="w-10 h-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            检查类型分布
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {testTypeStats.map(([type, count]) => (
              <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{type}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
                <p className="text-xs text-gray-500">次检查</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline View by Year */}
      {Object.entries(testsByYear)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .map(([year, tests]) => (
          <Card key={year}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                {year}年
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                共 {tests.length} 次检查
              </p>
            </CardHeader>
            <CardContent>
              <Timeline
                items={tests
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(test => {
                    const abnormalCount = test.items.filter(i => i.is_abnormal).length;
                    return {
                      color: abnormalCount > 0 ? 'orange' : 'green',
                      dot: abnormalCount > 0 ? <AlertCircle className="w-4 h-4 text-orange-500" /> : <Clock className="w-4 h-4 text-green-500" />,
                      children: (
                        <div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{test.type}</p>
                              <p className="text-sm text-gray-600">
                                {format(new Date(test.date), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
                              </p>
                            </div>
                            <Badge
                              count={abnormalCount}
                              status={abnormalCount > 0 ? 'error' : 'success'}
                              text={abnormalCount > 0 ? `${abnormalCount}项异常` : '正常'}
                            />
                          </div>
                          {test.hospital && (
                            <p className="text-xs text-gray-500 mt-1">{test.hospital}</p>
                          )}
                          {test.items.some(i => i.is_abnormal) && (
                            <div className="mt-2 p-2 bg-orange-50 rounded text-sm">
                              <p className="font-medium text-orange-800">异常指标:</p>
                              <ul className="mt-1 space-y-1">
                                {test.items.filter(i => i.is_abnormal).slice(0, 3).map((item, idx) => (
                                  <li key={idx} className="text-orange-700">
                                    {item.name}: {item.value} {item.unit}
                                    <span className="text-gray-500 ml-2">
                                      (参考: {item.min_ref}-{item.max_ref})
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ),
                    };
                  })}
              />
            </CardContent>
          </Card>
        ))}

      {/* Table View */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            所有检查记录
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            共 {labTests.length} 条记录
          </p>
        </CardHeader>
        <Table
          columns={columns}
          dataSource={labTests}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
}
