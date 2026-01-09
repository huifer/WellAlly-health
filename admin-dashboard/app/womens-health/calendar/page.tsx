'use client';

import { useState, useEffect, useMemo } from 'react';
import { CycleTrackerData, CycleDailyLog } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCyclePhaseForDate, getPhaseColor, getPhaseLabel } from '@/lib/analytics/transformers';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function WomensHealthCalendarPage() {
  const [cycleData, setCycleData] = useState<CycleTrackerData | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data/cycle');
        const data = await response.json();
        setCycleData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Get days for current month
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Get phase info for a date
  const getDatePhaseInfo = (date: Date) => {
    if (!cycleData?.cycles) return null;
    return getCyclePhaseForDate(cycleData.cycles, date);
  };

  // Get daily log for a date
  const getDailyLog = (date: Date): CycleDailyLog | null => {
    if (!cycleData?.cycles) return null;
    const dateStr = format(date, 'yyyy-MM-dd');

    for (const cycle of cycleData.cycles) {
      if (cycle.daily_logs) {
        const log = cycle.daily_logs.find(l => l.date === dateStr);
        if (log) return log;
      }
    }
    return null;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">周期日历</h1>
          <p className="text-gray-600 mt-1">查看月经周期日历</p>
        </div>
        <div className="text-center py-12 text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!cycleData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">周期日历</h1>
          <p className="text-gray-600 mt-1">查看月经周期日历</p>
        </div>
        <div className="text-center py-12 text-gray-500">暂无周期数据</div>
      </div>
    );
  }

  const selectedPhaseInfo = selectedDate ? getDatePhaseInfo(selectedDate) : null;
  const selectedDailyLog = selectedDate ? getDailyLog(selectedDate) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">周期日历</h1>
        <p className="text-gray-600 mt-1">查看月经周期日历和症状记录</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <CardTitle className="text-xl">
                  {format(currentMonth, 'yyyy年MM月', { locale: zhCN })}
                </CardTitle>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Phase Legend */}
              <div className="flex flex-wrap gap-4 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
                  <span>月经期</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#86efac' }}></div>
                  <span>卵泡期</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#a855f7' }}></div>
                  <span>排卵期</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fde047' }}></div>
                  <span>黄体期</span>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}

                {monthDays.map((day) => {
                  const phaseInfo = getDatePhaseInfo(day);
                  const dailyLog = getDailyLog(day);
                  const hasSymptoms = dailyLog?.symptoms && dailyLog.symptoms.length > 0;
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        relative aspect-square p-1 rounded-lg text-xs font-medium
                        transition-all hover:scale-105
                        ${isSelected ? 'ring-2 ring-offset-2 ring-pink-500' : ''}
                        ${isToday ? 'ring-2 ring-blue-500' : ''}
                      `}
                      style={{
                        backgroundColor: phaseInfo ? getPhaseColor(phaseInfo.phase) : '#f3f4f6',
                      }}
                      title={phaseInfo ? getPhaseLabel(phaseInfo.phase) : '未记录'}
                    >
                      <div className="text-center">
                        {format(day, 'd')}
                      </div>
                      {hasSymptoms && (
                        <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
                          <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
                        </div>
                      )}
                      {phaseInfo && (
                        <div className="text-[10px] opacity-75">
                          第{phaseInfo.cycleDay}天
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Day Details */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate ? format(selectedDate, 'MM月dd日 EEEE', { locale: zhCN }) : '选择日期'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDate && selectedPhaseInfo && selectedPhaseInfo.cycle ? (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">周期阶段</p>
                    <div
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: getPhaseColor(selectedPhaseInfo.phase) }}
                    >
                      {getPhaseLabel(selectedPhaseInfo.phase)}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">周期第几天</p>
                    <p className="text-lg font-semibold">{selectedPhaseInfo.cycleDay} 天</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">预计排卵日</p>
                    <p className="text-sm font-medium">
                      {format(parseISO(selectedPhaseInfo.cycle.ovulation_date), 'MM月dd日', { locale: zhCN })}
                    </p>
                  </div>

                  {selectedDailyLog && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">症状记录</p>
                        {selectedDailyLog.symptoms && selectedDailyLog.symptoms.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedDailyLog.symptoms.map((symptom, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs"
                              >
                                {symptom}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400">无症状记录</p>
                        )}
                      </div>

                      {selectedDailyLog.mood && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">情绪</p>
                          <p className="text-sm">{selectedDailyLog.mood}</p>
                        </div>
                      )}

                      {selectedDailyLog.energy_level && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">精力水平</p>
                          <div className="flex items-center gap-1">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-blue-500 rounded-full"
                                style={{ width: `${(selectedDailyLog.energy_level / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{selectedDailyLog.energy_level}/10</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  点击日历查看详细信息
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
