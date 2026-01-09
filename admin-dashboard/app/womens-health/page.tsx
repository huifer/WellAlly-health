'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CycleTrackerData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, Activity, Baby, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function WomensHealthPage() {
  const [cycleData, setCycleData] = useState<CycleTrackerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data/cycle');
        const cycle = await response.json();
        setCycleData(cycle);
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
          <h1 className="text-3xl font-bold text-gray-900">女性健康</h1>
          <p className="text-gray-600 mt-1">管理您的女性健康相关信息</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  // Calculate current cycle day
  const getCurrentCycleDay = () => {
    if (!cycleData?.cycles || cycleData.cycles.length === 0) return null;
    const currentCycle = cycleData.cycles.find(c => c.id === cycleData.current_cycle);
    if (!currentCycle) return null;

    const today = new Date();
    const startDate = new Date(currentCycle.period_start);
    const dayDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(Math.max(dayDiff, 1), currentCycle.cycle_length);
  };

  const currentCycleDay = getCurrentCycleDay();

  const quickLinks = [
    {
      title: '周期日历',
      description: '查看月经周期日历和症状记录',
      icon: Calendar,
      href: '/womens-health/calendar',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      title: '周期趋势',
      description: '分析周期变化和症状趋势',
      icon: TrendingUp,
      href: '/womens-health/cycle',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: '更年期追踪',
      description: '记录更年期症状和健康评分',
      icon: Activity,
      href: '/womens-health/menopause',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: '孕期记录',
      description: '查看孕期历史和检查记录',
      icon: Baby,
      href: '/womens-health/pregnancy',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">女性健康</h1>
        <p className="text-gray-600 mt-1">管理您的女性健康相关信息</p>
      </div>

      {/* Current Cycle Stats */}
      {cycleData && currentCycleDay && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-pink-600">当前周期第几天</p>
                  <p className="text-3xl font-bold text-pink-700 mt-2">{currentCycleDay}</p>
                  <p className="text-xs text-pink-600 mt-1">共 {cycleData.statistics.average_cycle_length} 天</p>
                </div>
                <Calendar className="w-10 h-10 text-pink-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">预计下次月经</p>
                  <p className="text-lg font-bold text-purple-700 mt-2">
                    {format(new Date(cycleData.predictions.next_period), 'MM月dd日', { locale: zhCN })}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    置信度 {Math.round(cycleData.predictions.next_period_confidence * 100)}%
                  </p>
                </div>
                <Clock className="w-10 h-10 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">周期规律度</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">
                    {cycleData.statistics.regularity_score.toFixed(1)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    范围 {cycleData.statistics.cycle_length_range[0]}-{cycleData.statistics.cycle_length_range[1]} 天
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">已跟踪周期</p>
                  <p className="text-3xl font-bold text-blue-700 mt-2">
                    {cycleData.statistics.total_cycles_tracked}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">个周期</p>
                </div>
                <Activity className="w-10 h-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card className={`hover:shadow-lg transition-shadow cursor-pointer h-full ${link.bgColor} border-0`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`${link.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${link.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${link.color}`}>{link.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Predictions */}
      {cycleData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              本月预测
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <p className="text-sm text-gray-600">下次月经</p>
                <p className="text-lg font-semibold text-pink-700 mt-1">
                  {format(new Date(cycleData.predictions.next_period), 'yyyy年MM月dd日', { locale: zhCN })}
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">排卵日</p>
                <p className="text-lg font-semibold text-purple-700 mt-1">
                  {format(new Date(cycleData.predictions.ovulation_date), 'yyyy年MM月dd日', { locale: zhCN })}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">易受孕期</p>
                <p className="text-lg font-semibold text-blue-700 mt-1">
                  {format(new Date(cycleData.predictions.fertile_window_start), 'MM月dd日', { locale: zhCN })}
                  {' - '}
                  {format(new Date(cycleData.predictions.fertile_window_end), 'MM月dd日', { locale: zhCN })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
