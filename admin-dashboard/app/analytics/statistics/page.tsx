'use client';

import { useMemo, useState, useEffect } from 'react';
import { loadProfileData, loadLabTests, loadScreeningData } from '@/lib/data/actions';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Calendar, TestTube, Shield } from 'lucide-react';

export default function AnalyticsStatisticsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [labTests, setLabTests] = useState<any>([]);
  const [screeningData, setScreeningData] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      loadProfileData(),
      loadLabTests(),
      loadScreeningData()
    ]).then(([p, l, s]) => {
      setProfile(p);
      setLabTests(l);
      setScreeningData(s);
    });
  }, []);

  // Test type distribution
  const testTypeDistribution = useMemo(() => {
    if (!labTests || labTests.length === 0) return [];
    const distribution = labTests.reduce((acc: Record<string, number>, test: any) => {
      acc[test.type] = (acc[test.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value: value as number,
      percentage: (((value as number) / labTests.length) * 100).toFixed(1)
    }));
  }, [labTests]);

  // Abnormal vs Normal
  const abnormalityStats = useMemo(() => {
    if (!labTests || labTests.length === 0) return null;
    let totalItems = 0;
    let abnormalItems = 0;
    const categories: Record<string, { total: number; abnormal: number }> = {};

    labTests.forEach((test: any) => {
      test.items.forEach((item: any) => {
        totalItems++;
        if (item.is_abnormal) abnormalItems++;

        // Categorize
        let category = '其他';
        if (item.name.includes('血糖') || item.name.includes('胆固醇')) category = '代谢';
        else if (item.name.includes('肝') || item.name.includes('肾')) category = '脏器功能';
        else if (item.name.includes('血')) category = '血液';

        if (!categories[category]) {
          categories[category] = { total: 0, abnormal: 0 };
        }
        categories[category].total++;
        if (item.is_abnormal) categories[category].abnormal++;
      });
    });

    return {
      total: totalItems,
      abnormal: abnormalItems,
      normal: totalItems - abnormalItems,
      normalRate: ((totalItems - abnormalItems) / totalItems * 100).toFixed(1),
      categories: Object.entries(categories).map(([name, data]) => ({
        name,
        ...data,
        abnormalRate: (data.abnormal / data.total * 100).toFixed(1)
      }))
    };
  }, [labTests]);

  // Monthly test frequency
  const monthlyFrequency = useMemo(() => {
    if (!labTests || labTests.length === 0) return [];
    const frequency: Record<string, number> = {};

    labTests.forEach((test: any) => {
      const month = test.date.substring(0, 7); // YYYY-MM
      frequency[month] = (frequency[month] || 0) + 1;
    });

    return Object.entries(frequency)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months
  }, [labTests]);

  // Screening compliance
  const screeningCompliance = useMemo(() => {
    if (!screeningData) return null;

    const stats = screeningData.statistics;
    const screenings = [
      { type: '宫颈癌', lastScreening: stats.next_cervical_screening, total: stats.total_cervical_screenings },
      { type: '乳腺癌', lastScreening: stats.next_breast_screening, total: stats.total_breast_screenings },
      { type: '结直肠癌', lastScreening: stats.next_colon_screening, total: stats.total_colon_screenings },
    ];

    return {
      overall: stats.screening_uptodate,
      adherence: stats.overall_adherence,
      screenings
    };
  }, [screeningData]);

  // Health score
  const healthScore = useMemo(() => {
    if (!abnormalityStats || !profile?.calculated?.bmi) return '0';
    // Calculate based on various factors
    let score = 100;

    // Deduct for abnormal lab results
    const abnormalRate = abnormalityStats.abnormal / abnormalityStats.total;
    score -= abnormalRate * 20;

    // Add for screening compliance
    if (screeningCompliance?.overall) score += 5;

    // Add for healthy BMI
    if (profile.calculated.bmi >= 18.5 && profile.calculated.bmi < 25) score += 5;

    return Math.max(0, Math.min(100, score)).toFixed(0);
  }, [abnormalityStats, screeningCompliance, profile]);

  const COLORS = ['#84CC16', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

  if (!profile || !labTests) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">统计报告</h1>
          <p className="text-gray-600 mt-1">健康数据的综合统计和分析</p>
        </div>
        <div className="text-center py-12 text-gray-500">
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">统计报告</h1>
        <p className="text-gray-600 mt-1">健康数据的综合统计和分析</p>
      </div>

      {/* Health Score Card */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">健康评分</p>
              <p className="text-5xl font-bold text-green-900 mt-2">{healthScore}</p>
              <p className="text-sm text-green-700 mt-1">
                {healthScore >= '80' ? '优秀' : healthScore >= '60' ? '良好' : '需关注'}
              </p>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-green-200"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(Number(healthScore) / 100) * 251.2} 251.2`}
                  className="text-green-600"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总检验次数</p>
                <p className="text-2xl font-bold text-gray-900">{labTests?.length || 0}</p>
              </div>
              <TestTube className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">健康记录</p>
                <p className="text-2xl font-bold text-gray-900">{profile?.history?.length || 0}</p>
              </div>
              <Activity className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">正常率</p>
                <p className="text-2xl font-bold text-green-600">{abnormalityStats?.normalRate ?? 0}%</p>
              </div>
              <Shield className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">筛查状态</p>
                <p className="text-lg font-bold text-gray-900">
                  {screeningCompliance?.overall ? (
                    <Badge className="bg-green-100 text-green-800">按时完成</Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-800">待更新</Badge>
                  )}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>检验类型分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={testTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }: any) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {testTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Frequency */}
        <Card>
          <CardHeader>
            <CardTitle>月度检验频率</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyFrequency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#84CC16" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Abnormality by Category */}
        {abnormalityStats && (
        <Card>
          <CardHeader>
            <CardTitle>异常指标分类</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={abnormalityStats.categories} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#10b981" name="总数" />
                <Bar dataKey="abnormal" fill="#f59e0b" name="异常" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        )}

        {/* Screening Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>筛查完成情况</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {screeningCompliance?.screenings.map(screening => (
                <div key={screening.type} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{screening.type}</p>
                    <p className="text-sm text-gray-600">已完成 {screening.total} 次</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">已完成</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics Table */}
      {abnormalityStats && (
      <Card>
        <CardHeader>
          <CardTitle>详细统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    指标类别
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    总数
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    异常数
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    异常率
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    状态
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {abnormalityStats.categories.map(category => (
                  <tr key={category.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{category.total}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{category.abnormal}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {category.abnormalRate}%
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {Number(category.abnormalRate) < 10 ? (
                        <Badge className="bg-green-100 text-green-800">正常</Badge>
                      ) : Number(category.abnormalRate) < 20 ? (
                        <Badge className="bg-yellow-100 text-yellow-800">关注</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">异常</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
