'use client';

import { useState, useEffect } from 'react';
import { MedicationPlan, MedicationLogs, Medication } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, Progress, Tag, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Pill, Clock, CheckCircle } from 'lucide-react';

export default function MedicationPage() {
  const [medicationPlan, setMedicationPlan] = useState<MedicationPlan | null>(null);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLogs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [planRes, logsRes] = await Promise.all([
          fetch('/api/data/medication-plan'),
          fetch('/api/data/medication-logs')
        ]);
        const plan = await planRes.json();
        const logs = await logsRes.json();
        setMedicationPlan(plan);
        setMedicationLogs(logs);
      } catch (error) {
        console.error('Error loading medication data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">药物管理</h1>
          <p className="text-gray-600 mt-1">管理您的用药计划和相互作用</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!medicationPlan || !medicationPlan.current_medications) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">药物管理</h1>
          <p className="text-gray-600 mt-1">管理您的用药计划和相互作用</p>
        </div>
        <div className="text-center py-12 text-gray-500">暂无用药记录</div>
      </div>
    );
  }

  // Group medications by timing
  const morningMeds = medicationPlan.current_medications.filter(m => m.timing.includes('早'));
  const afternoonMeds = medicationPlan.current_medications.filter(m => m.timing.includes('午') || m.timing.includes('中'));
  const eveningMeds = medicationPlan.current_medications.filter(m => m.timing.includes('晚') || m.timing.includes('睡前') || m.timing.includes('餐后'));
  const nightMeds = medicationPlan.current_medications.filter(m => m.timing.includes('睡前') || m.timing.includes('晚'));

  // Calculate adherence for a specific medication from logs
  const getAdherenceFromLogs = (medicationId: string): number => {
    if (!medicationLogs) return 0;
    const logData = medicationLogs.adherence_logs.find(l => l.medication_id === medicationId);
    if (!logData || logData.logs.length === 0) return 0;

    const takenCount = logData.logs.filter(l => l.taken).length;
    return takenCount / logData.logs.length;
  };

  const MedicationCard = ({ title, medications, time }: { title: string; medications: Medication[]; time: string }) => {
    if (medications.length === 0) return null;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">
              {title}
            </CardTitle>
            <span className="text-sm text-gray-500">{time}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {medications.map((med) => {
            const adherence = med.adherence || getAdherenceFromLogs(med.id);
            const adherencePercent = Math.round(adherence * 100);
            const adherenceColor = adherence >= 0.9 ? 'text-green-600' : adherence >= 0.7 ? 'text-yellow-600' : 'text-red-600';

            return (
              <div key={med.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{med.name}</h3>
                    {med.generic_name && (
                      <p className="text-xs text-gray-500 mt-0.5">{med.generic_name}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Tag color="blue">{med.dosage}</Tag>
                      <Tag color="purple">{med.frequency}</Tag>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <CheckCircle className={`w-5 h-5 ${adherence >= 0.9 ? 'text-green-500' : 'text-yellow-500'}`} />
                    <span className={`text-sm font-medium mt-1 ${adherenceColor}`}>
                      {adherencePercent}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>服药依从性</span>
                    <span>{adherencePercent}%</span>
                  </div>
                  <Progress
                    percent={adherencePercent}
                    strokeColor={adherence >= 0.9 ? '#52c41a' : adherence >= 0.7 ? '#faad14' : '#ff4d4f'}
                    size="small"
                  />
                </div>

                {med.indication && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">适应症:</span> {med.indication}
                    </p>
                  </div>
                )}

                {med.notes && (
                  <div className="mt-1">
                    <p className="text-xs text-gray-500">💡 {med.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

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
      title: '适应症',
      dataIndex: 'indication',
      key: 'indication',
    },
    {
      title: '开始日期',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (date: string) => format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN }),
    },
    {
      title: '依从性',
      dataIndex: 'adherence',
      key: 'adherence',
      render: (adherence: number) => {
        const percent = Math.round((adherence || 0) * 100);
        const color = adherence >= 0.9 ? 'success' : adherence >= 0.7 ? 'warning' : 'error';
        return <Badge status={color} text={`${percent}%`} />;
      },
      sorter: (a, b) => (a.adherence || 0) - (b.adherence || 0),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">药物管理</h1>
        <p className="text-gray-600 mt-1">管理您的用药计划和相互作用</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <p className="text-sm font-medium text-green-600">平均依从性</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {Math.round((medicationPlan.statistics.average_adherence || 0) * 100)}%
                </p>
                <p className="text-xs text-green-600 mt-1">过去30天</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">下次服药</p>
                <p className="text-lg font-bold text-purple-700 mt-2">
                  {eveningMeds.length > 0 ? eveningMeds[0].name : '无'}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {eveningMeds.length > 0 ? '今晚 22:00' : ''}
                </p>
              </div>
              <Clock className="w-10 h-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MedicationCard title="早晨" medications={morningMeds} time="08:00" />
        <MedicationCard title="中午" medications={afternoonMeds} time="12:00" />
        <MedicationCard title="晚上" medications={eveningMeds.filter(m => !m.timing.includes('睡前'))} time="19:00" />
        <MedicationCard title="睡前" medications={nightMeds} time="22:00" />
      </div>

      {/* All Medications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            当前用药详情
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
