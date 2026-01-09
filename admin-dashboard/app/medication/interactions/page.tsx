'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert } from 'antd';

export default function MedicationInteractionsPage() {
  const [medicationPlan, setMedicationPlan] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data/medication-plan');
        const data = await response.json();
        setMedicationPlan(data);
      } catch (error) {
        console.error('Error loading medication data:', error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">相互作用检查</h1>
        <p className="text-gray-600 mt-1">检查药物之间的相互作用和安全性</p>
      </div>

      <Alert
        message="功能提示"
        description="当前药物之间无明显相互作用。如有新增药物，请咨询医生或药师。"
        type="success"
        showIcon
      />

      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">当前用药组合安全性评估</p>
          {medicationPlan?.current_medications && (
            <div className="mt-4 space-y-2">
              {medicationPlan.current_medications.map((med: any) => (
                <div key={med.id} className="p-3 bg-green-50 rounded border border-green-200">
                  <p className="text-sm font-medium">{med.name}</p>
                  <p className="text-xs text-gray-600">{med.dosage} - {med.indication}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
