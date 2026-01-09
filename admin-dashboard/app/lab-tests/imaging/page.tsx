'use client';

import { useState, useEffect } from 'react';
import { RadiationData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, Tag, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ScanLine, Calendar, AlertCircle } from 'lucide-react';

export default function ImagingTestsPage() {
  const [radiationData, setRadiationData] = useState<RadiationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data/radiation');
        const data = await response.json();
        setRadiationData(data);
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
          <h1 className="text-3xl font-bold text-gray-900">影像检查</h1>
          <p className="text-gray-600 mt-1">
            查看影像检查记录（X光、CT、MRI等）
          </p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!radiationData || radiationData.records.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">影像检查</h1>
          <p className="text-gray-600 mt-1">
            查看影像检查记录（X光、CT、MRI等）
          </p>
        </div>
        <div className="text-center py-12 text-gray-500">暂无影像检查记录</div>
      </div>
    );
  }

  // Group by exam type
  const examTypes = radiationData.records.reduce((acc: Record<string, typeof radiationData.records>, record) => {
    if (!acc[record.exam_type]) {
      acc[record.exam_type] = [];
    }
    acc[record.exam_type].push(record);
    return acc;
  }, {});

  const getExamTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      'CT': 'red',
      'X光': 'blue',
      'PET-CT': 'purple',
      'MRI': 'green',
      '超声': 'orange',
      '钼靶': 'pink',
    };
    return colors[type] || 'default';
  };

  const columns: ColumnsType<typeof radiationData.records[number]> = [
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
      dataIndex: 'exam_type',
      key: 'exam_type',
      render: (type: string) => <Tag color={getExamTypeColor(type)}>{type}</Tag>,
      filters: Object.keys(examTypes).map(type => ({ text: type, value: type })),
      onFilter: (value, record) => record.exam_type === value,
    },
    {
      title: '检查部位',
      dataIndex: 'body_part',
      key: 'body_part',
    },
    {
      title: '检查原因',
      dataIndex: 'indication',
      key: 'indication',
      ellipsis: true,
    },
    {
      title: '辐射剂量',
      dataIndex: 'effective_dose',
      key: 'effective_dose',
      render: (dose: number, record) => (
        <span>
          {dose} {record.dose_unit}
        </span>
      ),
      sorter: (a, b) => b.effective_dose - a.effective_dose,
    },
    {
      title: '医院',
      dataIndex: 'hospital',
      key: 'hospital',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
  ];

  // Statistics
  const totalDose = radiationData.statistics.total_cumulative_dose_msv;
  const currentYearDose = radiationData.statistics.current_year_dose_msv;
  const highestDose = radiationData.statistics.highest_single_dose_msv;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">影像检查</h1>
        <p className="text-gray-600 mt-1">
          查看影像检查记录（X光、CT、MRI等）
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">检查总数</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {radiationData.records.length}
                </p>
                <p className="text-xs text-blue-600 mt-1">次检查</p>
              </div>
              <ScanLine className="w-10 h-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">累计剂量</p>
                <p className="text-3xl font-bold text-purple-700 mt-2">
                  {totalDose.toFixed(2)}
                </p>
                <p className="text-xs text-purple-600 mt-1">mSv</p>
              </div>
              <AlertCircle className="w-10 h-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">今年剂量</p>
                <p className="text-3xl font-bold text-orange-700 mt-2">
                  {currentYearDose.toFixed(2)}
                </p>
                <p className="text-xs text-orange-600 mt-1">mSv</p>
              </div>
              <Calendar className="w-10 h-10 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">最高单次</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {highestDose.toFixed(2)}
                </p>
                <p className="text-xs text-green-600 mt-1">mSv</p>
              </div>
              <AlertCircle className="w-10 h-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exam Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            检查类型分布
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(examTypes).map(([type, records]) => {
              const totalDose = records.reduce((sum, r) => sum + r.effective_dose, 0);
              return (
                <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                  <Tag color={getExamTypeColor(type)} className="mb-2">{type}</Tag>
                  <p className="text-2xl font-bold text-gray-900">{records.length}</p>
                  <p className="text-xs text-gray-500">次检查</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {totalDose.toFixed(2)} mSv
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Examinations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            最近检查
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            显示最近的5次影像检查
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {radiationData.records.slice(0, 5).map((record, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Tag color={getExamTypeColor(record.exam_type)}>{record.exam_type}</Tag>
                      <p className="font-semibold text-gray-900">{record.body_part}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(new Date(record.date), 'yyyy年MM月dd日', { locale: zhCN })}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-purple-600">
                    {record.effective_dose} mSv
                  </span>
                </div>
                {record.indication && (
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">检查原因:</span> {record.indication}
                  </p>
                )}
                {record.findings && record.findings.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">检查发现:</p>
                    <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                      {record.findings.slice(0, 2).map((finding, idx) => (
                        <li key={idx}>{finding}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  {record.hospital} · {record.radiologist}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            所有影像检查记录
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            共 {radiationData.records.length} 条记录
          </p>
        </CardHeader>
        <Table
          columns={columns}
          dataSource={radiationData.records}
          rowKey={(record, index) => `${record.date}-${index}`}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: (record) => (
              <div className="p-4 bg-gray-50 rounded">
                <p className="font-medium text-gray-900 mb-2">检查发现:</p>
                <ul className="list-disc list-inside space-y-1">
                  {record.findings.map((finding, idx) => (
                    <li key={idx} className="text-sm text-gray-600">{finding}</li>
                  ))}
                </ul>
                {record.notes && (
                  <div className="mt-3">
                    <p className="font-medium text-gray-900">备注:</p>
                    <p className="text-sm text-gray-600">{record.notes}</p>
                  </div>
                )}
              </div>
            ),
          }}
        />
      </Card>
    </div>
  );
}
