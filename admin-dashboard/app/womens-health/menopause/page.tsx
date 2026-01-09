'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Activity, TrendingUp } from 'lucide-react';

interface MenopauseMonthlyRecord {
  year: number;
  month: number;
  date: string;
  age: number;
  stage: string;
  symptoms: {
    hot_flashes: { present: boolean; frequency: number | null; severity: string | null };
    night_sweats: { present: boolean; severity: string | null };
    mood_changes: { symptoms: string[]; severity: string; impact_on_daily_life: string };
    sleep_disturbance: { present: boolean; sleep_quality: string };
    menstrual_changes: { cycle_length: number; flow_changes: string };
  };
  supplements: Array<{ name: string; dosage: string; frequency: string }>;
  health_score: number;
  trend_analysis: {
    three_month_summary: string;
    overall_health: string;
    recommendations: string[];
  };
}

export default function WomensHealthMenopausePage() {
  const [monthlyRecords, setMonthlyRecords] = useState<MenopauseMonthlyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data/menopause');
        const data = await response.json();
        setMonthlyRecords(data);
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
          <h1 className="text-3xl font-bold text-gray-900">更年期追踪</h1>
          <p className="text-gray-600 mt-1">记录和管理更年期健康</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!monthlyRecords || monthlyRecords.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">更年期追踪</h1>
          <p className="text-gray-600 mt-1">记录和管理更年期健康</p>
        </div>
        <div className="text-center py-12 text-gray-500">暂无更年期追踪数据</div>
      </div>
    );
  }

  const latestRecord = monthlyRecords[monthlyRecords.length - 1];

  const stageLabelMap: Record<string, string> = {
    'early_perimenopausal': '早期更年期',
    'late_perimenopausal': '晚期更年期',
    'postmenopausal': '绝经后',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">更年期追踪</h1>
        <p className="text-gray-600 mt-1">记录和管理更年期健康</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">健康评分</p>
                <p className="text-3xl font-bold text-orange-700 mt-2">
                  {latestRecord.health_score.toFixed(1)}
                </p>
                <p className="text-xs text-orange-600 mt-1">满分 10 分</p>
              </div>
              <Activity className="w-10 h-10 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">当前阶段</p>
                <p className="text-lg font-bold text-purple-700 mt-2">
                  {stageLabelMap[latestRecord.stage] || latestRecord.stage}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  跟踪 {monthlyRecords.length} 个月
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">周期长度</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {latestRecord.symptoms.menstrual_changes.cycle_length} 天
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {latestRecord.symptoms.menstrual_changes.flow_changes}
                </p>
              </div>
              <Activity className="w-10 h-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            本月总结 ({format(new Date(latestRecord.date), 'yyyy年MM月', { locale: zhCN })})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{latestRecord.trend_analysis.three_month_summary}</p>
        </CardContent>
      </Card>

      {/* Symptoms Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">
              当前症状状态
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">潮热</span>
              <span className={`text-sm font-medium ${latestRecord.symptoms.hot_flashes.present ? 'text-orange-600' : 'text-green-600'}`}>
                {latestRecord.symptoms.hot_flashes.present ? '有' : '无'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">夜汗</span>
              <span className={`text-sm font-medium ${latestRecord.symptoms.night_sweats.present ? 'text-orange-600' : 'text-green-600'}`}>
                {latestRecord.symptoms.night_sweats.present ? '有' : '无'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">睡眠质量</span>
              <span className="text-sm font-medium text-blue-600">
                {latestRecord.symptoms.sleep_disturbance.sleep_quality}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-600">情绪症状</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {latestRecord.symptoms.mood_changes.symptoms.map((symptom, index) => (
                  <span key={index} className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">
              当前补充剂
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {latestRecord.supplements.map((supplement, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium">{supplement.name}</span>
                  <span className="text-xs text-gray-500">{supplement.dosage} / {supplement.frequency}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            健康建议
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {latestRecord.trend_analysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-sm text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Monthly History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            月度记录历史
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyRecords.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{format(new Date(record.date), 'yyyy年MM月', { locale: zhCN })}</p>
                  <p className="text-xs text-gray-500">健康评分: {record.health_score.toFixed(1)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{stageLabelMap[record.stage] || record.stage}</p>
                  <p className="text-xs text-gray-500">
                    周期: {record.symptoms.menstrual_changes.cycle_length}天
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
