'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, Timeline, Alert } from 'antd';
import { format, differenceInYears, differenceInDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ClipboardList, Calendar, CheckCircle, Info } from 'lucide-react';

export default function PreventiveCarePlanPage() {
  const [profile, setProfile] = useState<any>(null);
  const [screeningData, setScreeningData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const responses = await Promise.all([
          fetch('/api/data/profile'),
          fetch('/api/data/screening'),
        ]);
        const data0 = await responses[0].json();
        const data1 = await responses[1].json();
        setProfile(data0);
        setScreeningData(data1);
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
          <h1 className="text-3xl font-bold text-gray-900">筛查计划</h1>
          <p className="text-gray-600 mt-1">管理您的预防保健筛查计划</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  const age = profile?.calculated?.age_years || 35;

  // Age-based screening recommendations
  const screeningRecommendations = [
    {
      category: '宫颈癌筛查',
      icon: '🩺',
      ageRange: '21-65岁',
      frequency: '每3年一次 (TCT) 或 每5年一次 (TCT+HPV)',
      recommendation: age >= 21 && age <= 65,
      status: screeningData?.cancer_screening?.cervical?.length > 0 ? 'completed' : 'due',
      lastDone: screeningData?.cancer_screening?.cervical?.[0]?.date,
      nextDue: screeningData?.statistics?.next_cervical_screening,
      description: '巴氏涂片(Pap smear)检查，用于检测宫颈癌前病变和宫颈癌',
    },
    {
      category: '乳腺癌筛查',
      icon: '🎀',
      ageRange: '40-70岁',
      frequency: '每1-2年一次 (乳腺钼靶)',
      recommendation: age >= 40 && age <= 70,
      status: screeningData?.cancer_screening?.breast?.length > 0 ? 'completed' : 'due',
      lastDone: screeningData?.cancer_screening?.breast?.[0]?.date,
      nextDue: screeningData?.statistics?.next_breast_screening,
      description: '乳腺钼靶X线检查，用于早期发现乳腺癌',
    },
    {
      category: '结肠癌筛查',
      icon: '🔬',
      ageRange: '45-75岁',
      frequency: '每10年一次 (结肠镜) 或 每年一次 (粪便潜血)',
      recommendation: age >= 45 && age <= 75,
      status: screeningData?.cancer_screening?.colon?.length > 0 ? 'completed' : 'due',
      lastDone: screeningData?.cancer_screening?.colon?.[0]?.date,
      nextDue: screeningData?.statistics?.next_colon_screening,
      description: '结肠镜检查或粪便潜血试验，用于检测结肠癌和息肉',
    },
    {
      category: '骨密度检查',
      icon: '🦴',
      ageRange: '65岁以上 或 绝经后女性',
      frequency: '每2年一次',
      recommendation: age >= 65,
      status: screeningData?.cancer_screening?.bone_density?.length > 0 ? 'completed' : 'due',
      lastDone: screeningData?.cancer_screening?.bone_density?.[0]?.date,
      nextDue: '2027-11-20',
      description: '双能X线骨密度检查(DXA)，用于诊断骨质疏松',
    },
    {
      category: '甲状腺超声',
      icon: '🦋',
      ageRange: '35岁以上',
      frequency: '每年体检时建议',
      recommendation: age >= 35,
      status: screeningData?.cancer_screening?.thyroid?.length > 0 ? 'completed' : 'due',
      lastDone: screeningData?.cancer_screening?.thyroid?.[0]?.date,
      nextDue: null,
      description: '甲状腺超声检查，用于检测甲状腺结节和肿瘤',
    },
    {
      category: '皮肤科检查',
      icon: '🧴',
      ageRange: '所有年龄',
      frequency: '每年一次',
      recommendation: true,
      status: screeningData?.cancer_screening?.skin?.length > 0 ? 'completed' : 'due',
      lastDone: screeningData?.cancer_screening?.skin?.[0]?.date,
      nextDue: null,
      description: '皮肤科医生检查，用于检测皮肤癌和可疑病变',
    },
    {
      category: '眼科检查',
      icon: '👁️',
      ageRange: '40岁以上',
      frequency: '每2年一次',
      recommendation: age >= 40,
      status: 'unknown',
      lastDone: null,
      nextDue: null,
      description: '全面眼科检查，包括眼底检查，早期发现青光眼、白内障等',
    },
    {
      category: '口腔检查',
      icon: '🦷',
      ageRange: '所有年龄',
      frequency: '每年1-2次',
      recommendation: true,
      status: 'unknown',
      lastDone: null,
      nextDue: null,
      description: '口腔科检查和洁牙，预防龋齿、牙周病和口腔癌',
    },
  ];

  // Get status color and label
  const getStatusInfo = (status: string, lastDone: string | null, nextDue: string | null) => {
    if (status === 'completed' && lastDone) {
      const daysSince = differenceInDays(new Date(), new Date(lastDone));
      if (daysSince > 365 * 2) {
        return { color: 'warning' as const, label: '即将到期' };
      }
      return { color: 'success' as const, label: '已完成' };
    }
    if (status === 'due') {
      return { color: 'processing' as const, label: '待安排' };
    }
    return { color: 'default' as const, label: '建议' };
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">筛查计划</h1>
        <p className="text-gray-600 mt-1">基于年龄的预防保健筛查建议</p>
      </div>

      {/* User Info Alert */}
      <Alert
        message="个人信息"
        description={
          <div>
            <p>年龄: {age}岁</p>
            <p className="text-sm text-gray-600 mt-1">
              以下是根据您的年龄推荐的筛查项目，具体请咨询医生
            </p>
          </div>
        }
        type="info"
        showIcon
      />

      {/* Age-Based Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            年龄相关筛查建议
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            当前推荐 {screeningRecommendations.filter(r => r.recommendation).length} 项筛查
          </p>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-6">
          {screeningRecommendations
            .filter(r => r.recommendation)
            .map((rec) => {
              const statusInfo = getStatusInfo(rec.status, rec.lastDone, rec.nextDue);
              return (
                <Card key={rec.category} className="border-l-4" style={{ borderLeftColor: statusInfo.color === 'success' ? '#22c55e' : statusInfo.color === 'warning' ? '#f97316' : statusInfo.color === 'processing' ? '#3b82f6' : '#d1d5db' }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{rec.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{rec.category}</h3>
                          <p className="text-xs text-gray-500">{rec.ageRange}</p>
                        </div>
                      </div>
                      <Badge status={statusInfo.color} text={statusInfo.label} />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">推荐频率:</span>
                        <span className="font-medium">{rec.frequency}</span>
                      </div>
                      {rec.lastDone && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">上次检查:</span>
                          <span className="font-medium">
                            {format(new Date(rec.lastDone), 'yyyy年MM月', { locale: zhCN })}
                          </span>
                        </div>
                      )}
                      {rec.nextDue && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">下次检查:</span>
                          <span className="font-medium">
                            {format(new Date(rec.nextDue), 'yyyy年MM月', { locale: zhCN })}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </Card>

      {/* Upcoming Schedule Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            {currentYear}年度筛查计划
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            建议在{currentYear}年完成的筛查项目
          </p>
        </CardHeader>
        <CardContent>
          <Timeline
            items={screeningRecommendations
              .filter(r => r.recommendation && r.nextDue && new Date(r.nextDue).getFullYear() === currentYear)
              .map(rec => ({
                color: 'blue',
                dot: <Calendar className="w-4 h-4 text-blue-500" />,
                children: (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{rec.icon}</span>
                      <p className="font-semibold text-gray-900">{rec.category}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {format(new Date(rec.nextDue || ''), 'yyyy年MM月dd日', { locale: zhCN })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{rec.description}</p>
                  </div>
                ),
              }))}
          />
        </CardContent>
      </Card>

      {/* General Health Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            一般健康维护建议
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            适用于所有年龄段的基础健康管理
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">定期体检</p>
                <p className="text-sm text-gray-600">每年进行一次全面健康体检，包括血压、血糖、血脂、肝肾功能等基础检查</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">健康生活方式</p>
                <p className="text-sm text-gray-600">保持均衡饮食、规律运动、充足睡眠，避免吸烟和过量饮酒</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">心理健康关注</p>
                <p className="text-sm text-gray-600">关注心理健康，必要时寻求心理咨询或治疗</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <Info className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">体重管理</p>
                <p className="text-sm text-gray-600">保持健康体重范围，定期监测BMI变化</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert
        message="重要提示"
        description="以上筛查建议仅供参考，具体筛查计划和频率应根据个人健康状况、家族史和医生建议进行调整。如有疑问，请咨询专业医生。"
        type="warning"
        showIcon
      />
    </div>
  );
}
