'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch, Tag } from 'antd';
import { Clock, Bell, Calendar } from 'lucide-react';

export default function SettingsRemindersPage() {
  const [reminders, setReminders] = useState<any>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data/reminders');
        const data = await response.json();
        setReminders(data);
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
          <h1 className="text-3xl font-bold text-gray-900">提醒设置</h1>
          <p className="text-gray-600 mt-1">管理您的提醒偏好设置</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  const settings = reminders?.user_settings || {
    notification_enabled: true,
    notification_methods: ['推送', '邮件'],
    default_reminder_time: '09:00',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">提醒设置</h1>
        <p className="text-gray-600 mt-1">管理您的提醒偏好设置</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            通知设置
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">启用通知</p>
                <p className="text-sm text-gray-600">接收用药和筛查提醒</p>
              </div>
              <Switch checked={settings.notification_enabled} checkedChildren="开" unCheckedChildren="关" />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">通知方式</p>
                <p className="text-sm text-gray-600">选择接收通知的方式</p>
              </div>
              <div className="flex gap-2">
                {settings.notification_methods.map((method: string) => (
                  <Tag key={method} color="blue">{method}</Tag>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">默认提醒时间</p>
                <p className="text-sm text-gray-600">每日提醒的默认时间</p>
              </div>
              <span className="text-sm text-gray-600">{settings.default_reminder_time}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reminder Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            提醒类型
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">用药提醒</p>
                  <p className="text-sm text-gray-600">按时服药提醒</p>
                </div>
              </div>
              <Switch defaultChecked checkedChildren="开" unCheckedChildren="关" />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-900">筛查提醒</p>
                  <p className="text-sm text-gray-600">癌症筛查和体检提醒</p>
                </div>
              </div>
              <Switch defaultChecked checkedChildren="开" unCheckedChildren="关" />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">复诊提醒</p>
                  <p className="text-sm text-gray-600">医生随访和复诊提醒</p>
                </div>
              </div>
              <Switch defaultChecked checkedChildren="开" unCheckedChildren="关" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Reminders */}
      {reminders && reminders.reminders && reminders.reminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              当前提醒
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reminders.reminders.map((reminder: any) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{reminder.title}</p>
                    <p className="text-sm text-gray-600">{reminder.description}</p>
                  </div>
                  <Tag color={reminder.priority === 'high' ? 'red' : reminder.priority === 'medium' ? 'orange' : 'blue'}>
                    {reminder.due_date}
                  </Tag>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
