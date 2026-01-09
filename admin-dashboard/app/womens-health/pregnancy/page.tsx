'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, Tag, Timeline } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Checkup {
  week: number;
  date: string;
  type: string;
  findings: string;
  weight: number;
  blood_pressure: string;
  fundal_height: number | null;
  fetal_heart_rate: number;
}

interface Pregnancy {
  id: string;
  start_date: string;
  end_date: string;
  outcome: string;
  delivery_date: string;
  gestational_age_at_delivery: string;
  delivery_method: string;
  baby_gender: string;
  baby_weight: number;
  pre_pregnancy_weight: number;
  delivery_weight: number;
  total_weight_gain: number;
  checkups: Checkup[];
  medications: Array<{
    medication: string;
    dosage: string;
    start_week: number;
    end_week: number;
    notes: string;
  }>;
  notes: string;
}

interface PregnancyTrackerData {
  pregnancies: Pregnancy[];
  statistics: {
    total_pregnancies: number;
    live_births: number;
  };
}

export default function WomensHealthPregnancyPage() {
  const [pregnancyData, setPregnancyData] = useState<PregnancyTrackerData | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data/pregnancy');
        const data = await response.json();
        setPregnancyData(data);
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
          <h1 className="text-3xl font-bold text-gray-900">孕期记录</h1>
          <p className="text-gray-600 mt-1">查看孕期历史和检查记录</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!pregnancyData || !pregnancyData.pregnancies || pregnancyData.pregnancies.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">孕期记录</h1>
          <p className="text-gray-600 mt-1">查看孕期历史和检查记录</p>
        </div>
        <div className="text-center py-12 text-gray-500">暂无孕期记录</div>
      </div>
    );
  }

  const pregnancy = pregnancyData.pregnancies[0];

  const checkupColumns: ColumnsType<Checkup> = [
    {
      title: '孕周',
      dataIndex: 'week',
      key: 'week',
      render: (week: number) => `${week}周`,
      sorter: (a, b) => a.week - b.week,
    },
    {
      title: '检查日期',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN }),
    },
    {
      title: '检查类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '体重',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => `${weight} kg`,
    },
    {
      title: '血压',
      dataIndex: 'blood_pressure',
      key: 'blood_pressure',
    },
    {
      title: '胎心',
      dataIndex: 'fetal_heart_rate',
      key: 'fetal_heart_rate',
      render: (rate: number) => `${rate} bpm`,
    },
    {
      title: '检查发现',
      dataIndex: 'findings',
      key: 'findings',
      ellipsis: true,
    },
  ];

  const outcomeLabelMap: Record<string, string> = {
    'full_term_birth': '足月分娩',
    'preterm_birth': '早产',
    'miscarriage': '流产',
    'ectopic': '异位妊娠',
  };

  const deliveryMethodMap: Record<string, string> = {
    'vaginal': '顺产',
    'c_section': '剖宫产',
    'assisted': '助产',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">孕期记录</h1>
        <p className="text-gray-600 mt-1">查看孕期历史和检查记录</p>
      </div>

      {/* Outcome Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-pink-600">妊娠结局</p>
            <p className="text-lg font-bold text-pink-700 mt-2">
              {outcomeLabelMap[pregnancy.outcome] || pregnancy.outcome}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-blue-600">分娩方式</p>
            <p className="text-lg font-bold text-blue-700 mt-2">
              {deliveryMethodMap[pregnancy.delivery_method] || pregnancy.delivery_method}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-purple-600">孕周</p>
            <p className="text-lg font-bold text-purple-700 mt-2">
              {pregnancy.gestational_age_at_delivery}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-green-600">宝宝体重</p>
            <p className="text-lg font-bold text-green-700 mt-2">
              {pregnancy.baby_weight} g
            </p>
            <p className="text-xs text-green-600 mt-1">
              {pregnancy.baby_gender === 'female' ? '女' : pregnancy.baby_gender === 'male' ? '男' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weight Gain */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            体重变化
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">孕前体重</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pregnancy.pre_pregnancy_weight} kg</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">分娩体重</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pregnancy.delivery_weight} kg</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">总增重</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{pregnancy.total_weight_gain} kg</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkups Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              产检时间线
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline
              items={pregnancy.checkups.map(checkup => ({
                children: (
                  <div>
                    <p className="font-medium">{checkup.week}周 - {checkup.type}</p>
                    <p className="text-xs text-gray-500">{format(new Date(checkup.date), 'yyyy年MM月dd日', { locale: zhCN })}</p>
                    <p className="text-sm text-gray-600 mt-1">{checkup.findings}</p>
                  </div>
                ),
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              孕期用药
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pregnancy.medications.map((med, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{med.medication}</p>
                      <p className="text-xs text-gray-500">{med.dosage} / {med.notes}</p>
                    </div>
                    <Tag color="blue">{med.start_week}-{med.end_week}周</Tag>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checkups Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            产检记录明细
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            共 {pregnancy.checkups.length} 次产检
          </p>
        </CardHeader>
        <Table
          columns={checkupColumns}
          dataSource={pregnancy.checkups}
          rowKey={(record) => `${record.week}-${record.date}`}
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            备注信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{pregnancy.notes}</p>
        </CardContent>
      </Card>
    </div>
  );
}
