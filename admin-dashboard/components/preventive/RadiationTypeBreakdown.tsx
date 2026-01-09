'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { RadiationRecord } from '@/lib/types';
import { getExamTypeColor } from '@/lib/analytics/transformers';

interface RadiationTypeBreakdownProps {
  records: RadiationRecord[];
}

interface BodyPartData {
  key: string;
  bodyPart: string;
  count: number;
  totalDose: number;
  avgDose: number;
}

export function RadiationTypeBreakdown({ records }: RadiationTypeBreakdownProps) {
  // Calculate exam type breakdown
  const examTypeData = useMemo(() => {
    const typeMap = new Map<string, { count: number; totalDose: number }>();

    records.forEach((record) => {
      const existing = typeMap.get(record.exam_type) || { count: 0, totalDose: 0 };
      typeMap.set(record.exam_type, {
        count: existing.count + 1,
        totalDose: existing.totalDose + record.effective_dose,
      });
    });

    return Array.from(typeMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      totalDose: Number(data.totalDose.toFixed(2)),
      fill: getExamTypeColor(name),
    }));
  }, [records]);

  // Calculate body part breakdown
  const bodyPartData = useMemo(() => {
    const partMap = new Map<string, { count: number; totalDose: number }>();

    records.forEach((record) => {
      const existing = partMap.get(record.body_part) || { count: 0, totalDose: 0 };
      partMap.set(record.body_part, {
        count: existing.count + 1,
        totalDose: existing.totalDose + record.effective_dose,
      });
    });

    return Array.from(partMap.entries())
      .map(([bodyPart, data]) => ({
        key: bodyPart,
        bodyPart,
        count: data.count,
        totalDose: Number(data.totalDose.toFixed(2)),
        avgDose: Number((data.totalDose / data.count).toFixed(2)),
      }))
      .sort((a, b) => b.count - a.count);
  }, [records]);

  const bodyPartColumns: ColumnsType<BodyPartData> = [
    {
      title: '检查部位',
      dataIndex: 'bodyPart',
      key: 'bodyPart',
    },
    {
      title: '检查次数',
      dataIndex: 'count',
      key: 'count',
      sorter: (a, b) => a.count - b.count,
    },
    {
      title: '总剂量 (mSv)',
      dataIndex: 'totalDose',
      key: 'totalDose',
      render: (value) => value.toFixed(2),
      sorter: (a, b) => a.totalDose - b.totalDose,
    },
    {
      title: '平均剂量 (mSv)',
      dataIndex: 'avgDose',
      key: 'avgDose',
      render: (value) => value.toFixed(2),
      sorter: (a, b) => a.avgDose - b.avgDose,
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900">{data.name}</p>
        <p className="text-xs text-gray-600 mt-1">
          检查次数: {data.count}
        </p>
        <p className="text-xs text-gray-600">
          总剂量: {data.totalDose} mSv
        </p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            检查类型分布
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={examTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, payload, percent }) =>
                  `${name} ${payload?.count || 0}次 (${((percent || 0) * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {examTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Body Part Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            检查部位统计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            columns={bodyPartColumns}
            dataSource={bodyPartData}
            size="small"
            pagination={false}
            scroll={{ y: 240 }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
