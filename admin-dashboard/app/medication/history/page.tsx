'use client';

import { useState, useEffect } from 'react';
import { MedicationPlan } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, Tag, Timeline } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function MedicationHistoryPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">用药历史</h1>
          <p className="text-gray-600 mt-1">查看您的用药历史记录</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!medicationPlan || !medicationPlan.medication_history) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">用药历史</h1>
          <p className="text-gray-600 mt-1">查看您的用药历史记录</p>
        </div>
        <div className="text-center py-12 text-gray-500">暂无用药历史</div>
      </div>
    );
  }

  const columns: ColumnsType<any> = [
    {
      title: '药物名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
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
      title: '适应症',
      dataIndex: 'indication',
      key: 'indication',
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
    {
      title: '结束日期',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (date: string) => format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN }),
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
        <h1 className="text-3xl font-bold text-gray-900">用药历史</h1>
        <p className="text-gray-600 mt-1">查看您的用药历史记录</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            用药历史记录
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            共 {medicationPlan.medication_history.length} 条记录
          </p>
        </CardHeader>
        <Table
          columns={columns}
          dataSource={medicationPlan.medication_history}
          rowKey={(record, index) => `${record.id}-${index}`}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
}
