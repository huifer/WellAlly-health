'use client';

import { useState, useEffect } from 'react';
import { MedicationPlan, ReminderData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, Tag, Badge, Switch, Timeline, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Bell, Clock, CheckCircle, Calendar } from 'lucide-react';

export default function MedicationRemindersPage() {
  const [medicationPlan, setMedicationPlan] = useState<MedicationPlan | null>(null);
  const [reminders, setReminders] = useState<ReminderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const responses = await Promise.all([
          fetch('/api/data/medication-plan'),
          fetch('/api/data/reminders'),
        ]);
        const data0 = await responses[0].json();
        const data1 = await responses[1].json();
        setMedicationPlan(data0);
        setReminders(data1);
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
          <h1 className="text-3xl font-bold text-gray-900">用药提醒</h1>
          <p className="text-gray-600 mt-1">设置和管理用药提醒</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!medicationPlan || !medicationPlan.current_medications) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">用药提醒</h1>
          <p className="text-gray-600 mt-1">设置和管理用药提醒</p>
        </div>
        <div className="text-center py-12 text-gray-500">暂无用药提醒</div>
      </div>
    );
  }

  // Get medication details by ID
  const getMedicationById = (id: string) => {
    return medicationPlan.current_medications.find(m => m.id === id);
  };

  // Generate daily reminders based on medication plan
  const dailyReminders = medicationPlan.current_medications.map(med => {
    let time = '';
    if (med.timing.includes('早')) time = '08:00';
    else if (med.timing.includes('午') || med.timing.includes('中')) time = '12:00';
    else if (med.timing.includes('睡前')) time = '22:00';
    else time = '19:00';

    return {
      id: med.id,
      medication_id: med.id,
      medication_name: med.name,
      time,
      frequency: med.frequency,
      enabled: true,
      dosage: med.dosage,
    };
  });

  // Group reminders by time
  const morningReminders = dailyReminders.filter(r => r.time === '08:00');
  const afternoonReminders = dailyReminders.filter(r => r.time === '12:00');
  const eveningReminders = dailyReminders.filter(r => r.time === '19:00');
  const nightReminders = dailyReminders.filter(r => r.time === '22:00');

  const columns: ColumnsType<typeof dailyReminders[number]> = [
    {
      title: '药物名称',
      dataIndex: 'medication_name',
      key: 'medication_name',
      render: (name: string, record) => {
        const med = getMedicationById(record.medication_id);
        return (
          <div>
            <p className="font-medium">{name}</p>
            {med?.generic_name && (
              <p className="text-xs text-gray-500">{med.generic_name}</p>
            )}
          </div>
        );
      },
    },
    {
      title: '剂量',
      dataIndex: 'dosage',
      key: 'dosage',
      render: (dosage: string) => <Tag color="blue">{dosage}</Tag>,
    },
    {
      title: '提醒时间',
      dataIndex: 'time',
      key: 'time',
      render: (time: string) => (
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{time}</span>
        </div>
      ),
    },
    {
      title: '频率',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (frequency: string) => <Tag color="purple">{frequency}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Switch checked={enabled} checkedChildren="开" unCheckedChildren="关" />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">用药提醒</h1>
        <p className="text-gray-600 mt-1">设置和管理用药提醒</p>
      </div>

      {/* Notification Settings Alert */}
      <Alert
        message="提醒设置"
        description={
          <div>
            <p>当前通知状态: {reminders?.user_settings?.notification_enabled ? '已开启' : '已关闭'}</p>
            <p className="text-sm text-gray-600 mt-1">
              通知方式: {reminders?.user_settings?.notification_methods?.join('、') || '未设置'}
            </p>
          </div>
        }
        type="info"
        showIcon
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">今日提醒</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {dailyReminders.length}
                </p>
                <p className="text-xs text-blue-600 mt-1">次提醒</p>
              </div>
              <Bell className="w-10 h-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">已开启</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {dailyReminders.filter(r => r.enabled).length}
                </p>
                <p className="text-xs text-green-600 mt-1">个提醒</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">下次提醒</p>
                <p className="text-lg font-bold text-purple-700 mt-2">
                  {morningReminders.length > 0 ? '08:00' : '12:00'}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {morningReminders.length > 0 ? '早晨' : '中午'}
                </p>
              </div>
              <Clock className="w-10 h-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">提醒频率</p>
                <p className="text-3xl font-bold text-orange-700 mt-2">
                  {dailyReminders.length > 0 ? '每日' : '-'}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  {dailyReminders.length > 0 ? `${dailyReminders.length} 次` : ''}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            今日服药提醒
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            按时间顺序排列的提醒计划
          </p>
        </CardHeader>
        <CardContent>
          <Timeline
            items={[
              ...(morningReminders.length > 0 ? [{
                color: 'green',
                dot: <Bell className="w-4 h-4 text-green-500" />,
                children: (
                  <div className="pb-4">
                    <p className="font-semibold text-gray-900">早晨 (08:00)</p>
                    <div className="mt-2 space-y-2">
                      {morningReminders.map(reminder => {
                        const med = getMedicationById(reminder.medication_id);
                        return (
                          <div key={reminder.id} className="bg-green-50 rounded p-3 border border-green-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{reminder.medication_name}</p>
                                <p className="text-xs text-gray-600">{reminder.dosage} - {med?.indication}</p>
                              </div>
                              <Switch checked={reminder.enabled} size="small" checkedChildren="开" unCheckedChildren="关" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ),
              }] : []),
              ...(afternoonReminders.length > 0 ? [{
                color: 'orange',
                dot: <Bell className="w-4 h-4 text-orange-500" />,
                children: (
                  <div className="pb-4">
                    <p className="font-semibold text-gray-900">中午 (12:00)</p>
                    <div className="mt-2 space-y-2">
                      {afternoonReminders.map(reminder => {
                        const med = getMedicationById(reminder.medication_id);
                        return (
                          <div key={reminder.id} className="bg-orange-50 rounded p-3 border border-orange-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{reminder.medication_name}</p>
                                <p className="text-xs text-gray-600">{reminder.dosage} - {med?.indication}</p>
                              </div>
                              <Switch checked={reminder.enabled} size="small" checkedChildren="开" unCheckedChildren="关" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ),
              }] : []),
              ...(eveningReminders.length > 0 ? [{
                color: 'blue',
                dot: <Bell className="w-4 h-4 text-blue-500" />,
                children: (
                  <div className="pb-4">
                    <p className="font-semibold text-gray-900">晚上 (19:00)</p>
                    <div className="mt-2 space-y-2">
                      {eveningReminders.map(reminder => {
                        const med = getMedicationById(reminder.medication_id);
                        return (
                          <div key={reminder.id} className="bg-blue-50 rounded p-3 border border-blue-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{reminder.medication_name}</p>
                                <p className="text-xs text-gray-600">{reminder.dosage} - {med?.indication}</p>
                              </div>
                              <Switch checked={reminder.enabled} size="small" checkedChildren="开" unCheckedChildren="关" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ),
              }] : []),
              ...(nightReminders.length > 0 ? [{
                color: 'purple',
                dot: <Bell className="w-4 h-4 text-purple-500" />,
                children: (
                  <div className="pb-4">
                    <p className="font-semibold text-gray-900">睡前 (22:00)</p>
                    <div className="mt-2 space-y-2">
                      {nightReminders.map(reminder => {
                        const med = getMedicationById(reminder.medication_id);
                        return (
                          <div key={reminder.id} className="bg-purple-50 rounded p-3 border border-purple-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{reminder.medication_name}</p>
                                <p className="text-xs text-gray-600">{reminder.dosage} - {med?.indication}</p>
                              </div>
                              <Switch checked={reminder.enabled} size="small" checkedChildren="开" unCheckedChildren="关" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ),
              }] : []),
            ]}
          />
        </CardContent>
      </Card>

      {/* All Reminders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            完整提醒列表
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            共 {dailyReminders.length} 个提醒
          </p>
        </CardHeader>
        <Table
          columns={columns}
          dataSource={dailyReminders}
          rowKey="id"
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Other System Reminders */}
      {reminders && reminders.reminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              其他健康提醒
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              共 {reminders.reminders.length} 个提醒
            </p>
          </CardHeader>
          <Table
            columns={[
              {
                title: '提醒类型',
                dataIndex: 'type',
                key: 'type',
                render: (type: string) => {
                  const typeMap: Record<string, { label: string; color: string }> = {
                    screening: { label: '筛查', color: 'blue' },
                    vaccine: { label: '疫苗', color: 'green' },
                    medication: { label: '用药', color: 'orange' },
                    checkup: { label: '体检', color: 'purple' },
                  };
                  const config = typeMap[type] || { label: type, color: 'default' };
                  return <Tag color={config.color}>{config.label}</Tag>;
                },
              },
              {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
              },
              {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                ellipsis: true,
              },
              {
                title: '截止日期',
                dataIndex: 'due_date',
                key: 'due_date',
                render: (date: string) => format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN }),
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (status: string) => {
                  const statusMap: Record<string, { label: string; color: string }> = {
                    pending: { label: '待处理', color: 'orange' },
                    completed: { label: '已完成', color: 'green' },
                    overdue: { label: '已逾期', color: 'red' },
                  };
                  const config = statusMap[status] || { label: status, color: 'default' };
                  return <Badge status={config.color as any} text={config.label} />;
                },
              },
              {
                title: '优先级',
                dataIndex: 'priority',
                key: 'priority',
                render: (priority: string) => {
                  const priorityMap: Record<string, { label: string; color: string }> = {
                    high: { label: '高', color: 'red' },
                    medium: { label: '中', color: 'orange' },
                    low: { label: '低', color: 'blue' },
                  };
                  const config = priorityMap[priority] || { label: priority, color: 'default' };
                  return <Tag color={config.color}>{config.label}</Tag>;
                },
              },
            ]}
            dataSource={reminders.reminders}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        </Card>
      )}
    </div>
  );
}
