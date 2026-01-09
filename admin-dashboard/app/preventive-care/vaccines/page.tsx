'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, Tag, Badge, Timeline, Progress } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format, differenceInDays, isPast, isFuture } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Syringe, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface VaccinationData {
  created_at: string;
  last_updated: string;
  vaccination_records: Array<{
    id: string;
    vaccine_name: string;
    manufacturer: string;
    dose_number: number;
    total_doses: number;
    administration_date: string;
    hospital: string;
    batch_number: string;
    next_due_date?: string;
    adverse_reactions: string[];
    notes: string;
  }>;
  statistics: {
    total_vaccination_records: number;
    total_doses_administered: number;
    series_completed: number;
    series_in_progress: number;
    single_doses: number;
    overdue_count: number;
    upcoming_30_days: number;
    adverse_reactions_count: number;
    severe_reactions_count: number;
  };
}

export default function PreventiveCareVaccinesPage() {
  const [vaccinationData, setVaccinationData] = useState<VaccinationData | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data/vaccines');
        const data = await response.json();
        setVaccinationData(data);
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
          <h1 className="text-3xl font-bold text-gray-900">疫苗接种</h1>
          <p className="text-gray-600 mt-1">管理您的疫苗接种记录和计划</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!vaccinationData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">疫苗接种</h1>
          <p className="text-gray-600 mt-1">管理您的疫苗接种记录和计划</p>
        </div>
        <div className="text-center py-12 text-gray-500">暂无疫苗接种记录</div>
      </div>
    );
  }

  // Group vaccinations by vaccine name
  const vaccineGroups = vaccinationData.vaccination_records.reduce((acc: Record<string, typeof vaccinationData.vaccination_records>, record) => {
    if (!acc[record.vaccine_name]) {
      acc[record.vaccine_name] = [];
    }
    acc[record.vaccine_name].push(record);
    return acc;
  }, {});

  // Calculate series progress
  const getSeriesProgress = (vaccineName: string) => {
    const records = vaccineGroups[vaccineName];
    if (!records || records.length === 0) return { completed: 0, total: 0, percent: 0, status: 'unknown' as const };

    const firstRecord = records[0];
    const completed = records.length;
    const total = firstRecord.total_doses;
    const percent = Math.round((completed / total) * 100);
    const status = completed >= total ? 'completed' : 'in_progress' as const;

    return { completed, total, percent, status };
  };

  const columns: ColumnsType<typeof vaccinationData.vaccination_records[number]> = [
    {
      title: '疫苗名称',
      dataIndex: 'vaccine_name',
      key: 'vaccine_name',
      render: (name: string, record) => (
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-gray-500">{record.manufacturer}</p>
        </div>
      ),
    },
    {
      title: '剂次',
      key: 'dose',
      render: (_, record) => (
        <div>
          <p className="font-medium">第 {record.dose_number} 剂</p>
          <p className="text-xs text-gray-500">共 {record.total_doses} 剂</p>
        </div>
      ),
    },
    {
      title: '接种日期',
      dataIndex: 'administration_date',
      key: 'administration_date',
      render: (date: string) => format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN }),
      sorter: (a, b) => new Date(b.administration_date).getTime() - new Date(a.administration_date).getTime(),
    },
    {
      title: '接种单位',
      dataIndex: 'hospital',
      key: 'hospital',
      ellipsis: true,
    },
    {
      title: '批次号',
      dataIndex: 'batch_number',
      key: 'batch_number',
      render: (batch: string) => <Tag color="blue">{batch}</Tag>,
    },
    {
      title: '不良反应',
      dataIndex: 'adverse_reactions',
      key: 'adverse_reactions',
      render: (reactions: string[]) => {
        if (reactions.length === 0) return <Badge status="success" text="无" />;
        if (reactions.length > 0) {
          const hasSevere = reactions.some(r => r.includes('严重') || r.includes('过敏'));
          return (
            <div>
              <Badge status={hasSevere ? 'error' : 'warning'} text={reactions.length > 0 ? `${reactions.length}项` : '无'} />
              <p className="text-xs text-gray-500 mt-1">{reactions.join('、')}</p>
            </div>
          );
        }
      },
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
  ];

  // Get upcoming and overdue vaccines
  const upcomingVaccines = vaccinationData.vaccination_records
    .filter(r => r.next_due_date && new Date(r.next_due_date) > new Date())
    .sort((a, b) => new Date(a.next_due_date || '').getTime() - new Date(b.next_due_date || '').getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">疫苗接种</h1>
        <p className="text-gray-600 mt-1">管理您的疫苗接种记录和计划</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">已完成系列</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {vaccinationData.statistics.series_completed}
                </p>
                <p className="text-xs text-green-600 mt-1">个疫苗系列</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">进行中系列</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {vaccinationData.statistics.series_in_progress}
                </p>
                <p className="text-xs text-blue-600 mt-1">个疫苗系列</p>
              </div>
              <Clock className="w-10 h-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">累计接种</p>
                <p className="text-3xl font-bold text-purple-700 mt-2">
                  {vaccinationData.statistics.total_doses_administered}
                </p>
                <p className="text-xs text-purple-600 mt-1">剂次</p>
              </div>
              <Syringe className="w-10 h-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">不良反应</p>
                <p className="text-3xl font-bold text-orange-700 mt-2">
                  {vaccinationData.statistics.adverse_reactions_count}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  {vaccinationData.statistics.severe_reactions_count > 0 ? `${vaccinationData.statistics.severe_reactions_count} 项严重` : '无严重反应'}
                </p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vaccine Series Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(vaccineGroups).map(([vaccineName, records]) => {
          const progress = getSeriesProgress(vaccineName);
          const latestRecord = records[0];
          const nextDue = records.find(r => r.next_due_date)?.next_due_date;

          return (
            <Card key={vaccineName} className="border-l-4" style={{ borderLeftColor: progress.status === 'completed' ? '#22c55e' : '#3b82f6' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">{vaccineName}</CardTitle>
                  <Badge
                    status={progress.status === 'completed' ? 'success' : 'processing'}
                    text={progress.status === 'completed' ? '已完成' : '进行中'}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{latestRecord.manufacturer}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">接种进度</span>
                      <span className="font-medium">{progress.completed}/{progress.total} 剂</span>
                    </div>
                    <Progress
                      percent={progress.percent}
                      status={progress.status === 'completed' ? 'success' : 'active'}
                      strokeColor={progress.status === 'completed' ? '#52c41a' : '#1890ff'}
                    />
                  </div>

                  {nextDue && progress.status !== 'completed' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">下一剂:</span>
                      <span className="font-medium">
                        {format(new Date(nextDue), 'yyyy年MM月dd日', { locale: zhCN })}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">最近接种:</span>
                    <span className="font-medium">
                      {format(new Date(latestRecord.administration_date), 'yyyy年MM月dd日', { locale: zhCN })}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">接种单位:</span>
                    <span className="font-medium text-xs text-right">{latestRecord.hospital}</span>
                  </div>

                  {latestRecord.adverse_reactions && latestRecord.adverse_reactions.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-orange-600">
                        ⚠️ 不良反应: {latestRecord.adverse_reactions.join('、')}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Vaccinations Timeline */}
      {upcomingVaccines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              即将接种
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              未来的疫苗接种计划
            </p>
          </CardHeader>
          <CardContent>
            <Timeline
              items={upcomingVaccines.map(record => ({
                color: 'blue',
                dot: <Calendar className="w-4 h-4 text-blue-500" />,
                children: (
                  <div>
                    <p className="font-semibold text-gray-900">{record.vaccine_name}</p>
                    <p className="text-sm text-gray-600">
                      第 {record.dose_number + 1} 剂 - {format(new Date(record.next_due_date || ''), 'yyyy年MM月dd日', { locale: zhCN })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{record.hospital}</p>
                  </div>
                ),
              }))}
            />
          </CardContent>
        </Card>
      )}

      {/* All Vaccination Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            疫苗接种记录
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            共 {vaccinationData.statistics.total_vaccination_records} 条记录
          </p>
        </CardHeader>
        <Table
          columns={columns}
          dataSource={vaccinationData.vaccination_records}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
