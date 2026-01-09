'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, Alert } from 'antd';
import { BarChart3, TrendingUp, Activity, Calendar, Heart, Pill, AlertCircle } from 'lucide-react';

export default function AnalyticsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data/profile');
        const profileData = await response.json();
        setProfile(profileData);
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
          <h1 className="text-3xl font-bold text-gray-900">数据分析</h1>
          <p className="text-gray-600 mt-1">查看您的健康数据分析报告</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  const bmi = profile?.calculated?.bmi || 0;
  const bmiStatus = profile?.calculated?.bmi_status || '未知';

  // Quick stats (would load from actual data)
  const stats = {
    labTests: 12,
    abnormalRate: 15,
    medications: 3,
    adherence: 92,
    radiationDose: 9.18,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">数据分析</h1>
        <p className="text-gray-600 mt-1">查看您的健康数据分析报告</p>
      </div>

      {/* Health Overview Alert */}
      <Alert
        message="健康状态总览"
        description={
          <div>
            <p>BMI: {bmi} ({bmiStatus})</p>
            <p className="text-sm text-gray-600 mt-1">
              基于您的基本信息生成的健康指标
            </p>
          </div>
        }
        type="info"
        showIcon
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">检查次数</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {stats.labTests}
                </p>
                <p className="text-xs text-blue-600 mt-1">次检查</p>
              </div>
              <Activity className="w-10 h-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">用药依从性</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {stats.adherence}%
                </p>
                <p className="text-xs text-green-600 mt-1">过去30天</p>
              </div>
              <Pill className="w-10 h-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">异常指标</p>
                <p className="text-3xl font-bold text-orange-700 mt-2">
                  {stats.abnormalRate}%
                </p>
                <p className="text-xs text-orange-600 mt-1">近期检查</p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">辐射剂量</p>
                <p className="text-3xl font-bold text-purple-700 mt-2">
                  {stats.radiationDose}
                </p>
                <p className="text-xs text-purple-600 mt-1">mSv 累计</p>
              </div>
              <Heart className="w-10 h-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            分析报告
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            选择您想要查看的分析报告类型
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/analytics/health-trends"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="w-6 h-6 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">健康趋势</p>
                <p className="text-sm text-gray-600">查看各项指标的变化趋势</p>
              </div>
            </a>

            <a
              href="/analytics/lab-trends"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Activity className="w-6 h-6 text-green-500" />
              <div>
                <p className="font-medium text-gray-900">化验趋势</p>
                <p className="text-sm text-gray-600">分析生化检查指标趋势</p>
              </div>
            </a>

            <a
              href="/analytics/statistics"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="w-6 h-6 text-purple-500" />
              <div>
                <p className="font-medium text-gray-900">统计分析</p>
                <p className="text-sm text-gray-600">全面的健康数据统计</p>
              </div>
            </a>

            <a
              href="/analytics/export"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-6 h-6 text-orange-500" />
              <div>
                <p className="font-medium text-gray-900">年度报告</p>
                <p className="text-sm text-gray-600">年度健康总结报告</p>
              </div>
            </a>

            <a
              href="/lab-tests/compare"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Activity className="w-6 h-6 text-cyan-500" />
              <div>
                <p className="font-medium text-gray-900">检查对比</p>
                <p className="text-sm text-gray-600">对比不同时期的检查结果</p>
              </div>
            </a>

            <a
              href="/preventive-care/radiation"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Heart className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-medium text-gray-900">辐射追踪</p>
                <p className="text-sm text-gray-600">医学辐射剂量追踪</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Recent Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">
              数据更新状态
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">基本信息</span>
                <Badge status="success" text="已更新" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">生化检查</span>
                <Badge status="success" text="已更新" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">用药记录</span>
                <Badge status="success" text="已更新" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">筛查记录</span>
                <Badge status="success" text="已更新" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">
              快速链接
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a href="/report" className="block text-sm text-blue-600 hover:text-blue-800">
                生成综合健康报告 →
              </a>
              <a href="/lab-tests/history" className="block text-sm text-blue-600 hover:text-blue-800">
                查看检查历史 →
              </a>
              <a href="/medication" className="block text-sm text-blue-600 hover:text-blue-800">
                管理用药计划 →
              </a>
              <a href="/preventive-care" className="block text-sm text-blue-600 hover:text-blue-800">
                预防保健计划 →
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
