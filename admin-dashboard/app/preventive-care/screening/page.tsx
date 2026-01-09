'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, Tag, Badge, Timeline } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format, differenceInYears, differenceInDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Search, Shield, Calendar, CheckCircle } from 'lucide-react';

interface ScreeningData {
  created_at: string;
  last_updated: string;
  cancer_screening: {
    cervical: any[];
    breast: any[];
    colon: any[];
    skin: any[];
    thyroid: any[];
    ovarian: any[];
    bone_density: any[];
  };
  statistics: {
    total_cervical_screenings: number;
    years_of_cervical_screening: number;
    cervical_abnormal_count: number;
    total_breast_screenings: number;
    years_of_breast_screening: number;
    breast_abnormal_count: number;
    total_colon_screenings: number;
    colon_abnormal_count: number;
    screening_uptodate: boolean;
    next_cervical_screening: string;
    next_breast_screening: string;
    next_colon_screening: string;
  };
}

export default function PreventiveCareScreeningPage() {
  const [screeningData, setScreeningData] = useState<ScreeningData | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data/screening');
        const data = await response.json();
        setScreeningData(data);
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
          <h1 className="text-3xl font-bold text-gray-900">癌症筛查</h1>
          <p className="text-gray-600 mt-1">管理您的癌症筛查计划和记录</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!screeningData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">癌症筛查</h1>
          <p className="text-gray-600 mt-1">管理您的癌症筛查计划和记录</p>
        </div>
        <div className="text-center py-12 text-gray-500">暂无筛查记录</div>
      </div>
    );
  }

  const screeningTypes = [
    {
      key: 'cervical',
      name: '宫颈癌筛查',
      icon: '🩺',
      color: 'pink',
      data: screeningData.cancer_screening.cervical,
      nextDate: screeningData.statistics.next_cervical_screening,
      totalCount: screeningData.statistics.total_cervical_screenings,
      abnormalCount: screeningData.statistics.cervical_abnormal_count,
    },
    {
      key: 'breast',
      name: '乳腺癌筛查',
      icon: '🎀',
      color: 'rose',
      data: screeningData.cancer_screening.breast,
      nextDate: screeningData.statistics.next_breast_screening,
      totalCount: screeningData.statistics.total_breast_screenings,
      abnormalCount: screeningData.statistics.breast_abnormal_count,
    },
    {
      key: 'colon',
      name: '结肠癌筛查',
      icon: '🔬',
      color: 'purple',
      data: screeningData.cancer_screening.colon,
      nextDate: screeningData.statistics.next_colon_screening,
      totalCount: screeningData.statistics.total_colon_screenings,
      abnormalCount: screeningData.statistics.colon_abnormal_count,
    },
    {
      key: 'thyroid',
      name: '甲状腺筛查',
      icon: '🦋',
      color: 'blue',
      data: screeningData.cancer_screening.thyroid,
      nextDate: null,
      totalCount: screeningData.cancer_screening.thyroid?.length || 0,
      abnormalCount: 0,
    },
    {
      key: 'skin',
      name: '皮肤癌筛查',
      icon: '🧴',
      color: 'amber',
      data: screeningData.cancer_screening.skin,
      nextDate: null,
      totalCount: screeningData.cancer_screening.skin?.length || 0,
      abnormalCount: 0,
    },
    {
      key: 'ovarian',
      name: '卵巢癌筛查',
      icon: '🌸',
      color: 'cyan',
      data: screeningData.cancer_screening.ovarian,
      nextDate: null,
      totalCount: screeningData.cancer_screening.ovarian?.length || 0,
      abnormalCount: 0,
    },
    {
      key: 'bone_density',
      name: '骨密度检查',
      icon: '🦴',
      color: 'orange',
      data: screeningData.cancer_screening.bone_density,
      nextDate: null,
      totalCount: screeningData.cancer_screening.bone_density?.length || 0,
      abnormalCount: 0,
    },
  ];

  const columns: ColumnsType<any> = [
    {
      title: '检查日期',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN }),
      sorter: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      defaultSortOrder: 'descend' as const,
    },
    {
      title: '检查方法',
      dataIndex: 'methodology',
      key: 'methodology',
      render: (method: string) => <Tag color="blue">{method}</Tag>,
    },
    {
      title: '检查结果',
      dataIndex: 'result',
      key: 'result',
      render: (result: string) => {
        const isNormal = result.toLowerCase() === 'normal' || result === '正常';
        return <Badge status={isNormal ? 'success' : 'warning'} text={isNormal ? '正常' : result} />;
      },
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">癌症筛查</h1>
        <p className="text-gray-600 mt-1">管理您的癌症筛查计划和记录</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">宫颈癌筛查</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {screeningData.statistics.total_cervical_screenings}
                </p>
                <p className="text-xs text-green-600 mt-1">次检查 · {screeningData.statistics.years_of_cervical_screening}年</p>
              </div>
              <Shield className="w-10 h-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600">乳腺癌筛查</p>
                <p className="text-3xl font-bold text-pink-700 mt-2">
                  {screeningData.statistics.total_breast_screenings}
                </p>
                <p className="text-xs text-pink-600 mt-1">次检查 · {screeningData.statistics.years_of_breast_screening}年</p>
              </div>
              <Search className="w-10 h-10 text-pink-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">结肠癌筛查</p>
                <p className="text-3xl font-bold text-purple-700 mt-2">
                  {screeningData.statistics.total_colon_screenings}
                </p>
                <p className="text-xs text-purple-600 mt-1">次检查</p>
              </div>
              <Calendar className="w-10 h-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">异常结果</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {screeningData.statistics.cervical_abnormal_count +
                   screeningData.statistics.breast_abnormal_count +
                   screeningData.statistics.colon_abnormal_count}
                </p>
                <p className="text-xs text-blue-600 mt-1">项异常</p>
              </div>
              <CheckCircle className="w-10 h-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Screening Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {screeningTypes.map((type) => (
          <Card key={type.key} className="border-l-4" style={{ borderLeftColor: type.color === 'pink' ? '#ec4899' : type.color === 'rose' ? '#f43f5e' : type.color === 'purple' ? '#a855f7' : type.color === 'blue' ? '#3b82f6' : type.color === 'amber' ? '#f59e0b' : type.color === 'cyan' ? '#06b6d4' : '#f97316' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{type.icon}</span>
                  <CardTitle className="text-base font-semibold">{type.name}</CardTitle>
                </div>
                <Badge count={type.totalCount} style={{ backgroundColor: '#3b82f6' }} />
              </div>
            </CardHeader>
            <CardContent>
              {type.data && type.data.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">最近检查:</span>
                    <span className="font-medium">
                      {format(new Date(type.data[0].date), 'yyyy年MM月', { locale: zhCN })}
                    </span>
                  </div>
                  {type.nextDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">下次检查:</span>
                      <span className="font-medium">
                        {format(new Date(type.nextDate), 'yyyy年MM月', { locale: zhCN })}
                      </span>
                    </div>
                  )}
                  {type.abnormalCount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">异常次数:</span>
                      <span className="font-medium text-red-600">{type.abnormalCount} 次</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      最新结果: {type.data[0].result === 'normal' ? '正常' : type.data[0].result}
                      {type.data[0].notes && ` - ${type.data[0].notes}`}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">暂无检查记录</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Records */}
      {screeningTypes.map((type) => (
        type.data && type.data.length > 0 && (
          <Card key={`detail-${type.key}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{type.icon}</span>
                  <CardTitle className="text-lg font-semibold">{type.name} - 详细记录</CardTitle>
                </div>
                <Badge count={type.data.length} />
              </div>
            </CardHeader>
            <Table
              columns={columns}
              dataSource={type.data}
              rowKey={(record, index) => `${type.key}-${record.date}-${index}`}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800 }}
            />
          </Card>
        )
      ))}

      {/* Screening Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            筛查时间线
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            按时间顺序显示的所有筛查记录
          </p>
        </CardHeader>
        <CardContent>
          <Timeline
            mode="left"
            items={screeningTypes
              .filter(type => type.data && type.data.length > 0)
              .slice(0, 3)
              .map(type => ({
                label: format(new Date(type.data[0].date), 'yyyy年MM月', { locale: zhCN }),
                color: 'green',
                children: (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{type.icon}</span>
                      <p className="font-medium">{type.name}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {type.data[0].methodology} - {type.data[0].result === 'normal' ? '正常' : type.data[0].result}
                    </p>
                    {type.data[0].notes && (
                      <p className="text-xs text-gray-500 mt-1">{type.data[0].notes}</p>
                    )}
                  </div>
                ),
              }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
