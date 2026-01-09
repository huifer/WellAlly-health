'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, Progress, Timeline, Alert } from 'antd';
import { format, differenceInDays, isPast, isFuture } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Shield, Calendar, CheckCircle, Clock, AlertCircle, Syringe } from 'lucide-react';

interface ScreeningData {
  created_at: string;
  last_updated: string;
  cancer_screening: {
    cervical: any[];
    breast: any[];
    colon: any[];
    skin: any[];
    thyroid: any[];
    ovarian: any[];
    bone_density: any[];
  };
  statistics: {
    screening_uptodate: boolean;
    next_cervical_screening: string;
    next_breast_screening: string;
    next_colon_screening: string;
    overall_adherence: string;
  };
}

interface VaccinationData {
  created_at: string;
  last_updated: string;
  vaccination_records: any[];
  statistics: {
    total_vaccination_records: number;
    series_completed: number;
    series_in_progress: number;
    upcoming_30_days: number;
    overdue_count: number;
  };
}

export default function PreventiveCarePage() {
  const [screeningData, setScreeningData] = useState<ScreeningData | null>(null);
  const [vaccinationData, setVaccinationData] = useState<VaccinationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [screeningRes, vaccinationRes] = await Promise.all([
          fetch('/api/data/screening'),
          fetch('/api/data/vaccines')
        ]);
        const screening = await screeningRes.json();
        const vaccination = await vaccinationRes.json();
        setScreeningData(screening);
        setVaccinationData(vaccination);
      } catch (error) {
        console.error('Error loading data:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">预防保健</h1>
          <p className="text-gray-600 mt-1">管理您的预防保健计划</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  // Calculate screening status
  const getScreeningStatus = (nextDate: string | undefined) => {
    if (!nextDate) return { status: 'unknown', label: '未安排', color: 'default' as const, days: 0 };

    const days = differenceInDays(new Date(nextDate), new Date());
    if (days < 0) {
      return { status: 'overdue', label: '已逾期', color: 'red' as const, days };
    } else if (days <= 30) {
      return { status: 'due', label: '即将到期', color: 'orange' as const, days };
    } else if (days <= 90) {
      return { status: 'upcoming', label: '即将安排', color: 'blue' as const, days };
    } else {
      return { status: 'uptodate', label: '正常', color: 'green' as const, days };
    }
  };

  const screenings = [
    {
      name: '宫颈癌筛查',
      icon: '🩺',
      lastDate: screeningData?.cancer_screening?.cervical?.[0]?.date,
      nextDate: screeningData?.statistics?.next_cervical_screening,
      count: screeningData?.cancer_screening?.cervical?.length || 0,
      status: getScreeningStatus(screeningData?.statistics?.next_cervical_screening),
    },
    {
      name: '乳腺癌筛查',
      icon: '🎀',
      lastDate: screeningData?.cancer_screening?.breast?.[0]?.date,
      nextDate: screeningData?.statistics?.next_breast_screening,
      count: screeningData?.cancer_screening?.breast?.length || 0,
      status: getScreeningStatus(screeningData?.statistics?.next_breast_screening),
    },
    {
      name: '结肠癌筛查',
      icon: '🔬',
      lastDate: screeningData?.cancer_screening?.colon?.[0]?.date,
      nextDate: screeningData?.statistics?.next_colon_screening,
      count: screeningData?.cancer_screening?.colon?.length || 0,
      status: getScreeningStatus(screeningData?.statistics?.next_colon_screening),
    },
    {
      name: '甲状腺筛查',
      icon: '🦋',
      lastDate: screeningData?.cancer_screening?.thyroid?.[0]?.date,
      nextDate: '2025-08-20',
      count: screeningData?.cancer_screening?.thyroid?.length || 0,
      status: getScreeningStatus('2025-08-20'),
    },
    {
      name: '骨密度检查',
      icon: '🦴',
      lastDate: screeningData?.cancer_screening?.bone_density?.[0]?.date,
      nextDate: '2027-11-20',
      count: screeningData?.cancer_screening?.bone_density?.length || 0,
      status: getScreeningStatus('2027-11-20'),
    },
  ];

  const overallScore = screeningData?.statistics?.screening_uptodate ? 95 : 75;
  const adherenceScore = screeningData?.statistics?.overall_adherence === 'excellent' ? 95 : 75;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">预防保健</h1>
        <p className="text-gray-600 mt-1">管理您的预防保健计划和筛查记录</p>
      </div>

      {/* Overall Status Alert */}
      <Alert
        message="预防保健状态"
        description={
          <div>
            <p>筛查完成度: {screeningData?.statistics?.screening_uptodate ? '良好' : '需要关注'}</p>
            <p className="text-sm text-gray-600 mt-1">
              依从性评级: {screeningData?.statistics?.overall_adherence === 'excellent' ? '优秀' : '良好'}
            </p>
          </div>
        }
        type={screeningData?.statistics?.screening_uptodate ? 'success' : 'warning'}
        showIcon
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">筛查完成度</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {overallScore}%
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {screeningData?.statistics?.screening_uptodate ? '状态良好' : '需要关注'}
                </p>
              </div>
              <Shield className="w-10 h-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">筛查依从性</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {adherenceScore}%
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {screeningData?.statistics?.overall_adherence === 'excellent' ? '优秀' : '良好'}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">疫苗接种</p>
                <p className="text-3xl font-bold text-purple-700 mt-2">
                  {vaccinationData?.statistics?.series_completed || 0}
                </p>
                <p className="text-xs text-purple-600 mt-1">个系列已完成</p>
              </div>
              <Syringe className="w-10 h-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">即将到期</p>
                <p className="text-3xl font-bold text-orange-700 mt-2">
                  {screenings.filter(s => s.status.status === 'due').length}
                </p>
                <p className="text-xs text-orange-600 mt-1">项筛查</p>
              </div>
              <Clock className="w-10 h-10 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Screening Status Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            癌症筛查状态
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            共 {screenings.length} 项筛查项目
          </p>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6 pb-6">
          {screenings.map((screening) => (
            <Card key={screening.name} className="border-l-4" style={{ borderLeftColor: screening.status.color === 'red' ? '#ef4444' : screening.status.color === 'orange' ? '#f97316' : screening.status.color === 'blue' ? '#3b82f6' : '#22c55e' }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{screening.icon}</span>
                    <h3 className="font-semibold text-gray-900">{screening.name}</h3>
                  </div>
                  <Badge status={screening.status.color as any} text={screening.status.label} />
                </div>
                <div className="space-y-2 text-sm">
                  {screening.lastDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">上次检查:</span>
                      <span className="font-medium">
                        {format(new Date(screening.lastDate), 'yyyy年MM月', { locale: zhCN })}
                      </span>
                    </div>
                  )}
                  {screening.nextDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">下次检查:</span>
                      <span className="font-medium">
                        {format(new Date(screening.nextDate), 'yyyy年MM月', { locale: zhCN })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">检查次数:</span>
                    <span className="font-medium">{screening.count} 次</span>
                  </div>
                  {screening.status.days > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">距离:</span>
                      <span className="font-medium">{screening.status.days} 天</span>
                    </div>
                  )}
                </div>
                {screening.status.status === 'due' && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-orange-600">
                      ⚠️ 建议30天内安排检查
                    </p>
                  </div>
                )}
                {screening.status.status === 'overdue' && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-red-600">
                      ❌ 检查已逾期，请尽快安排
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Card>

      {/* Upcoming Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            近期安排
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            未来90天的筛查和疫苗计划
          </p>
        </CardHeader>
        <CardContent>
          <Timeline
            items={[
              ...screenings
                .filter(s => s.status.status === 'due' || s.status.status === 'upcoming')
                .sort((a, b) => {
                  const dateA = new Date(a.nextDate || '');
                  const dateB = new Date(b.nextDate || '');
                  return dateA.getTime() - dateB.getTime();
                })
                .slice(0, 5)
                .map(screening => ({
                  color: screening.status.status === 'due' ? 'orange' : 'blue',
                  dot: <Calendar className="w-4 h-4" style={{ color: screening.status.color === 'orange' ? '#f97316' : '#3b82f6' }} />,
                  children: (
                    <div className="pb-2">
                      <p className="font-semibold text-gray-900">{screening.name}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(screening.nextDate || ''), 'yyyy年MM月dd日', { locale: zhCN })}
                        <span className="ml-2">
                          ({screening.status.days > 0 ? `${screening.status.days}天后` : '已逾期'})
                        </span>
                      </p>
                    </div>
                  ),
                })),
            ].length > 0
              ? screenings
                  .filter(s => s.status.status === 'due' || s.status.status === 'upcoming')
                  .sort((a, b) => new Date(a.nextDate || '').getTime() - new Date(b.nextDate || '').getTime())
                  .slice(0, 5)
                  .map(screening => ({
                    color: screening.status.status === 'due' ? 'orange' : 'blue',
                    dot: <Calendar className="w-4 h-4" style={{ color: screening.status.color === 'orange' ? '#f97316' : '#3b82f6' }} />,
                    children: (
                      <div className="pb-2">
                        <p className="font-semibold text-gray-900">{screening.name}</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(screening.nextDate || ''), 'yyyy年MM月dd日', { locale: zhCN })}
                          <span className="ml-2">
                            ({screening.status.days > 0 ? `${screening.status.days}天后` : '已逾期'})
                          </span>
                        </p>
                      </div>
                    ),
                  }))
              : [{
                  color: 'green',
                  children: (
                    <div className="pb-2">
                      <p className="font-semibold text-gray-900">暂无近期安排</p>
                      <p className="text-sm text-gray-600">所有筛查均在正常时间范围内</p>
                    </div>
                  ),
                }]}
          />
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            快速链接
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            查看详细的预防保健记录
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/preventive-care/screening"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Shield className="w-6 h-6 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">筛查记录</p>
                <p className="text-sm text-gray-600">查看详细筛查历史</p>
              </div>
            </a>
            <a
              href="/preventive-care/vaccines"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Syringe className="w-6 h-6 text-purple-500" />
              <div>
                <p className="font-medium text-gray-900">疫苗接种</p>
                <p className="text-sm text-gray-600">管理疫苗记录</p>
              </div>
            </a>
            <a
              href="/preventive-care/radiation"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <AlertCircle className="w-6 h-6 text-orange-500" />
              <div>
                <p className="font-medium text-gray-900">辐射剂量</p>
                <p className="text-sm text-gray-600">医学辐射追踪</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
