'use client';

import { useState, useEffect } from 'react';
import { RadiationData } from '@/lib/types';
import { RadiationTimelineChart } from '@/components/preventive/RadiationTimelineChart';
import { RadiationStatsCards } from '@/components/preventive/RadiationStatsCards';
import { RadiationTypeBreakdown } from '@/components/preventive/RadiationTypeBreakdown';
import { AnnualDoseComparison } from '@/components/preventive/AnnualDoseComparison';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function PreventiveCareRadiationPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">辐射安全</h1>
          <p className="text-gray-600 mt-1">追踪医学辐射暴露记录</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!radiationData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">辐射安全</h1>
          <p className="text-gray-600 mt-1">追踪医学辐射暴露记录</p>
        </div>
        <div className="text-center py-12 text-gray-500">
          暂无辐射记录数据
        </div>
      </div>
    );
  }

  const { records, statistics } = radiationData;

  // Table columns for radiation history
  const columns: ColumnsType<typeof records[0]> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN }),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: '检查类型',
      dataIndex: 'exam_type',
      key: 'exam_type',
      render: (type: string) => {
        let color = 'default';
        if (type === 'X光') color = 'blue';
        if (type === 'CT') color = 'red';
        if (type === '乳腺钼靶') color = 'purple';
        if (type === '超声') color = 'green';
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: '检查部位',
      dataIndex: 'body_part',
      key: 'body_part',
    },
    {
      title: '适应症',
      dataIndex: 'indication',
      key: 'indication',
    },
    {
      title: '辐射剂量',
      dataIndex: 'effective_dose',
      key: 'effective_dose',
      render: (dose: number) => `${dose.toFixed(2)} mSv`,
      sorter: (a, b) => a.effective_dose - b.effective_dose,
    },
    {
      title: '医院',
      dataIndex: 'hospital',
      key: 'hospital',
    },
    {
      title: '检查发现',
      dataIndex: 'findings',
      key: 'findings',
      render: (findings: string[]) => (
        <div className="max-w-xs">
          {findings.map((finding, index) => (
            <div key={index} className="text-xs text-gray-600">
              • {finding}
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">辐射安全</h1>
        <p className="text-gray-600 mt-1">
          追踪医学辐射暴露记录，累计剂量 {statistics.total_cumulative_dose_msv.toFixed(2)} mSv
        </p>
      </div>

      {/* Stats Cards */}
      <RadiationStatsCards statistics={statistics} />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RadiationTimelineChart records={records} showThresholds={true} />
        <AnnualDoseComparison statistics={statistics} />
      </div>

      {/* Type Breakdown */}
      <RadiationTypeBreakdown records={records} />

      {/* Radiation History Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">辐射检查历史</h2>
          <p className="text-sm text-gray-600 mt-1">
            共 {records.length} 次检查记录
          </p>
        </div>
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </div>

      {/* Safety Note */}
      {statistics.radiation_safety_note && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">{statistics.radiation_safety_note}</p>
        </div>
      )}
    </div>
  );
}
