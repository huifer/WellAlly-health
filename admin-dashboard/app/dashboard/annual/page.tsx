'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from 'antd';
import { FileText, Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function DashboardAnnualPage() {
  const [report, setReport] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2025);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, reportRes] = await Promise.all([
          fetch('/api/data/profile'),
          fetch(`/api/data/health-report?year=${selectedYear}`)
        ]);
        const profileData = await profileRes.json();
        const reportData = await reportRes.json();
        setProfile(profileData);
        setReport(reportData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedYear]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">年度报告</h1>
          <p className="text-gray-600 mt-1">查看您的年度健康报告</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  const age = profile?.calculated?.age_years || 35;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">年度健康报告</h1>
        <p className="text-gray-600 mt-1">查看您的年度健康报告</p>
      </div>

      {/* Year Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">选择年份:</span>
            <div className="flex gap-2">
              {[2025, 2024, 2023].map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedYear === year
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {year}年
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {report ? (
        <>
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                {selectedYear}年度健康概览
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">年龄</p>
                  <p className="text-2xl font-bold text-blue-700">{age}岁</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">BMI</p>
                  <p className="text-2xl font-bold text-green-700">
                    {profile?.calculated?.bmi || 0}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {profile?.calculated?.bmi_status || '未知'}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600">检查次数</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {report?.total_tests || 12}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">次检查</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Findings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                主要健康发现
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">整体健康状况良好</p>
                    <p className="text-sm text-gray-600">大部分指标在正常范围内</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">定期体检完成</p>
                    <p className="text-sm text-gray-600">年度体检和筛查项目已完成</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">健康趋势平稳</p>
                    <p className="text-sm text-gray-600">关键指标保持稳定</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                健康建议
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-sm text-gray-700">继续保持健康的生活方式</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-sm text-gray-700">按时完成年度筛查计划</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-sm text-gray-700">遵医嘱按时服药</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-sm text-gray-700">定期监测血压和血糖</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">暂无{selectedYear}年度报告</p>
              <p className="text-sm mt-1">请选择其他年份</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
