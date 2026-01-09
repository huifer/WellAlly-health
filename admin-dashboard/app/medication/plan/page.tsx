'use client';

import { useState, useEffect, useMemo } from 'react';
import { MedicationPlan, Medication } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, Tag, Badge, Progress, Timeline } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { CalendarCheck, Clock, Pill, AlertCircle } from 'lucide-react';

export default function MedicationPlanPage() {
  const [medicationPlan, setMedicationPlan] = useState<MedicationPlan | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data/medication-plan');
        const data = await response.json();
        setMedicationPlan(data);
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
          <h1 className="text-3xl font-bold text-gray-900">用药计划</h1>
          <p className="text-gray-600 mt-1">管理您的用药计划和服药时间表</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!medicationPlan || !medicationPlan.current_medications) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">用药计划</h1>
          <p className="text-gray-600 mt-1">管理您的用药计划和服药时间表</p>
        </div>
        <div className="text-center py-12 text-gray-500">暂无用药计划</div>
      </div>
    );
  }

  // Group medications by indication
  const groupedMedications = useMemo(() => {
    const groups: Record<string, Medication[]> = {};
    medicationPlan.current_medications.forEach(med => {
      const indication = med.indication || '其他';
      if (!groups[indication]) {
        groups[indication] = [];
      }
      groups[indication].push(med);
    });
    return groups;
  }, [medicationPlan]);

  // Get indication color
  const getIndicationColor = (indication: string): string => {
    const colors: Record<string, string> = {
      '高血压': 'red',
      '高脂血症': 'orange',
      '糖尿病': 'blue',
      '冠心病': 'purple',
      '骨质疏松': 'green',
      '其他': 'default',
    };
    return colors[indication] || 'default';
  };

  // Group by time of day
  const scheduleGroups = useMemo(() => {
    const morning = medicationPlan.current_medications.filter(m => m.timing.includes('早'));
    const afternoon = medicationPlan.current_medications.filter(m => m.timing.includes('午') || m.timing.includes('中'));
    const evening = medicationPlan.current_medications.filter(m => m.timing.includes('晚') || m.timing.includes('餐后'));
    const night = medicationPlan.current_medications.filter(m => m.timing.includes('睡前'));

    return { morning, afternoon, evening, night };
  }, [medicationPlan]);

  const columns: ColumnsType<Medication> = [
    {
      title: '药物名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Medication) => (
        <div>
          <p className="font-medium">{name}</p>
          {record.generic_name && (
            <p className="text-xs text-gray-500">{record.generic_name}</p>
          )}
        </div>
      ),
    },
    {
      title: '剂量',
      dataIndex: 'dosage',
      key: 'dosage',
      render: (dosage: string) => <Tag color="blue">{dosage}</Tag>,
    },
    {
      title: '频率',
      dataIndex: 'frequency',
      key: 'frequency',
    },
    {
      title: '服用时间',
      dataIndex: 'timing',
      key: 'timing',
      render: (timing: string) => <Tag color="purple">{timing}</Tag>,
    },
    {
      title: '开方医生',
      dataIndex: 'prescribing_doctor',
      key: 'prescribing_doctor',
    },
    {
      title: '开始日期',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (date: string) => format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN }),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">用药计划</h1>
        <p className="text-gray-600 mt-1">管理您的用药计划和服药时间表</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">当前用药</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {medicationPlan.current_medications.length}
                </p>
                <p className="text-xs text-blue-600 mt-1">种药物</p>
              </div>
              <Pill className="w-10 h-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">适应症数量</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {Object.keys(groupedMedications).length}
                </p>
                <p className="text-xs text-green-600 mt-1">类疾病</p>
              </div>
              <AlertCircle className="w-10 h-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">平均依从性</p>
                <p className="text-3xl font-bold text-purple-700 mt-2">
                  {Math.round((medicationPlan.statistics.average_adherence || 0) * 100)}%
                </p>
                <p className="text-xs text-purple-600 mt-1">过去30天</p>
              </div>
              <CalendarCheck className="w-10 h-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">每日服药次数</p>
                <p className="text-3xl font-bold text-orange-700 mt-2">
                  {medicationPlan.statistics.most_common_timing || '3'}
                </p>
                <p className="text-xs text-orange-600 mt-1">次/天</p>
              </div>
              <Clock className="w-10 h-10 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* By Indication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            按适应症分组
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            共 {Object.keys(groupedMedications).length} 类适应症
          </p>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-6">
          {Object.entries(groupedMedications).map(([indication, meds]) => (
            <Card key={indication} className="border-l-4" style={{ borderLeftColor: getIndicationColor(indication) === 'default' ? '#d1d5db' : undefined }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">
                    {indication}
                  </CardTitle>
                  <Badge count={meds.length} style={{ backgroundColor: getIndicationColor(indication) === 'default' ? '#9ca3af' : undefined }} />
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {meds.map((med) => (
                  <div key={med.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{med.name}</p>
                        {med.generic_name && (
                          <p className="text-xs text-gray-500">{med.generic_name}</p>
                        )}
                      </div>
                      <Tag color="blue" className="text-xs">{med.dosage}</Tag>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Tag color="purple">{med.frequency}</Tag>
                      <Tag color="cyan">{med.timing}</Tag>
                      {med.prescribing_doctor && (
                        <span className="text-gray-500">{med.prescribing_doctor}</span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </Card>

      {/* Daily Schedule Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            每日服药时间表
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            按时间顺序排列的用药计划
          </p>
        </CardHeader>
        <CardContent>
          <Timeline
            items={[
              ...(scheduleGroups.morning.length > 0 ? [{
                color: 'green',
                dot: <Clock className="w-4 h-4 text-green-500" />,
                children: (
                  <div className="pb-4">
                    <p className="font-semibold text-gray-900">早晨 (08:00)</p>
                    <div className="mt-2 space-y-2">
                      {scheduleGroups.morning.map(med => (
                        <div key={med.id} className="bg-green-50 rounded p-2 border border-green-200">
                          <p className="text-sm font-medium">{med.name} - {med.dosage}</p>
                          <p className="text-xs text-gray-600">{med.indication}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              }] : []),
              ...(scheduleGroups.afternoon.length > 0 ? [{
                color: 'orange',
                dot: <Clock className="w-4 h-4 text-orange-500" />,
                children: (
                  <div className="pb-4">
                    <p className="font-semibold text-gray-900">中午 (12:00)</p>
                    <div className="mt-2 space-y-2">
                      {scheduleGroups.afternoon.map(med => (
                        <div key={med.id} className="bg-orange-50 rounded p-2 border border-orange-200">
                          <p className="text-sm font-medium">{med.name} - {med.dosage}</p>
                          <p className="text-xs text-gray-600">{med.indication}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              }] : []),
              ...(scheduleGroups.evening.filter(m => !m.timing.includes('睡前')).length > 0 ? [{
                color: 'blue',
                dot: <Clock className="w-4 h-4 text-blue-500" />,
                children: (
                  <div className="pb-4">
                    <p className="font-semibold text-gray-900">晚上 (19:00)</p>
                    <div className="mt-2 space-y-2">
                      {scheduleGroups.evening.filter(m => !m.timing.includes('睡前')).map(med => (
                        <div key={med.id} className="bg-blue-50 rounded p-2 border border-blue-200">
                          <p className="text-sm font-medium">{med.name} - {med.dosage}</p>
                          <p className="text-xs text-gray-600">{med.indication}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              }] : []),
              ...(scheduleGroups.night.length > 0 ? [{
                color: 'purple',
                dot: <Clock className="w-4 h-4 text-purple-500" />,
                children: (
                  <div className="pb-4">
                    <p className="font-semibold text-gray-900">睡前 (22:00)</p>
                    <div className="mt-2 space-y-2">
                      {scheduleGroups.night.map(med => (
                        <div key={med.id} className="bg-purple-50 rounded p-2 border border-purple-200">
                          <p className="text-sm font-medium">{med.name} - {med.dosage}</p>
                          <p className="text-xs text-gray-600">{med.indication}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              }] : []),
            ]}
          />
        </CardContent>
      </Card>

      {/* All Medications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            完整用药计划
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            共 {medicationPlan.current_medications.length} 种药物
          </p>
        </CardHeader>
        <Table
          columns={columns}
          dataSource={medicationPlan.current_medications}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
