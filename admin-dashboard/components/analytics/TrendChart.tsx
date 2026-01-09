'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TimeSeriesDataPoint } from '@/lib/types/analytics';

interface TrendChartProps {
  data: TimeSeriesDataPoint[];
  title: string;
  valueKey?: string;
  color?: string;
  area?: boolean;
  showMovingAverage?: boolean;
  movingAverageWindow?: number;
  showReferenceLine?: boolean;
  referenceValue?: number;
  unit?: string;
  height?: number;
}

export function TrendChart({
  data,
  title,
  valueKey = 'value',
  color = '#84CC16',
  area = false,
  showMovingAverage = false,
  movingAverageWindow = 3,
  showReferenceLine = false,
  referenceValue,
  unit = '',
  height = 300,
}: TrendChartProps) {
  // Format data for chart
  const chartData = data.map(point => ({
    date: new Date(point.date).toLocaleDateString('zh-CN', {
      month: 'short',
      year: '2-digit'
    }),
    [valueKey]: point.value,
    originalDate: point.date
  }));

  // Add moving average if requested
  if (showMovingAverage && data.length >= movingAverageWindow) {
    const ma = data.map((_, i) => {
      const start = Math.max(0, i - movingAverageWindow + 1);
      const slice = data.slice(start, i + 1);
      return slice.reduce((sum, p) => sum + p.value, 0) / slice.length;
    });

    chartData.forEach((d, i) => {
      (d as any).movingAverage = Number(ma[i].toFixed(2));
    });
  }

  const ChartComponent = area ? AreaChart : LineChart;
  const DataComponent = area ? Area : Line;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              domain={['dataMin - 5%', 'dataMax + 5%']}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              axisLine={{ stroke: '#e5e7eb' }}
              label={{ value: unit, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number | undefined) => [`${(value || 0).toFixed(2)} ${unit}`, '数值']}
              labelFormatter={(label) => `日期: ${label}`}
            />
            <Legend />

            {showReferenceLine && referenceValue && (
              <ReferenceLine
                y={referenceValue}
                label="参考值"
                stroke="red"
                strokeDasharray="5 5"
              />
            )}

            <DataComponent
              type="monotone"
              dataKey={valueKey}
              stroke={color}
              strokeWidth={2}
              fill={area ? color : undefined}
              fillOpacity={area ? 0.3 : undefined}
              dot={{ fill: color, r: 3 }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: color }}
              name={title}
            />

            {showMovingAverage && (
              <Line
                type="monotone"
                dataKey="movingAverage"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name={`移动平均 (${movingAverageWindow}期)`}
              />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
