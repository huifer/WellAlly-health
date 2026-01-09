'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Progress, Tag, Badge } from 'antd';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function MedicationsPage() {
  const [medicationPlan, setMedicationPlan] = useState<any>(null);
  const [medicationLogs, setMedicationLogs] = useState<any>(null);
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
          <h1 className="text-3xl font-bold text-gray-900">用药记录</h1>
          <p className="text-gray-600 mt-1">查看您的当前用药清单和历史记录</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  const currentMedications = medicationPlan?.current_medications || [];
  const logs = medicationLogs?.logs || [];

  // 计算今日服药情况
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayLogs = logs.filter((log: any) => log.date === today);
  const takenToday = todayLogs.filter((log: any) => log.taken).length;
  const scheduledToday = todayLogs.length;

  // 计算近7天依从性
  const last7Days = logs.slice(0, 7);
  const totalLast7Days = last7Days.length;
  const takenLast7Days = last7Days.filter((log: any) => log.taken).length;
  const adherence7Days = totalLast7Days > 0 ? Math.round((takenLast7Days / totalLast7Days) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">用药记录</h1>
        <p className="text-gray-600 mt-1">查看您的当前用药清单和历史记录</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">当前用药</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{currentMedications.length}</div>
            <p className="text-xs text-gray-500 mt-1">种正在使用的药物</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">今日进度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {takenToday}/{scheduledToday}
            </div>
            <p className="text-xs text-gray-500 mt-1">已完成今日服药</p>
            {scheduledToday > 0 && (
              <Progress percent={Math.round((takenToday / scheduledToday) * 100)} size="small" className="mt-2" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">近7天依从性</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{adherence7Days}%</div>
            <p className="text-xs text-gray-500 mt-1">按时服药比例</p>
            <Progress
              percent={adherence7Days}
              strokeColor={adherence7Days >= 80 ? '#52c41a' : adherence7Days >= 60 ? '#faad14' : '#ff4d4f'}
              size="small"
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Current Medications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">当前用药清单</CardTitle>
        </CardHeader>
        <CardContent>
          {currentMedications.length > 0 ? (
            <div className="space-y-4">
              {currentMedications.map((med: any) => (
                <div key={med.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      <Pill className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{med.name}</h3>
                        <p className="text-sm text-gray-600">{med.specification}</p>
                      </div>
                    </div>
                    <Tag color="blue">{med.category}</Tag>
                  </div>
                  <div className="ml-8 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        剂量：<span className="font-medium text-gray-900">{med.dosage}</span>
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-600">
                        频率：<span className="font-medium text-gray-900">{med.frequency}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        服药时间：{med.timing.join('、')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      适应症：<span className="font-medium text-gray-900">{med.indication}</span>
                    </p>
                    {med.notes && (
                      <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        备注：{med.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>暂无当前用药记录</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Medication Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">近期服药记录</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <div className="space-y-2">
              {logs.slice(0, 10).map((log: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    {log.taken ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{log.medication_name}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(log.date), 'MM月dd日', { locale: zhCN })} {log.time}
                      </p>
                    </div>
                  </div>
                  <Badge status={log.taken ? 'success' : 'warning'} text={log.taken ? '已服药' : '未服药'} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>暂无服药记录</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">相关功能</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a href="/medication" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Pill className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">药物管理</p>
                <p className="text-sm text-gray-600">完整的药物管理功能</p>
              </div>
            </a>
            <a href="/medication/reminders" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-medium text-gray-900">服药提醒</p>
                <p className="text-sm text-gray-600">设置和管理服药提醒</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
