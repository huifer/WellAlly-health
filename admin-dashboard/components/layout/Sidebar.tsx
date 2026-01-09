'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  Activity,
  Heart,
  Shield,
  Pill,
  BarChart3,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  title: string;
  icon: any;
  path: string;
  subItems?: { title: string; path: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: '健康概览',
    icon: LayoutDashboard,
    path: '/',
    subItems: [
      { title: '健康仪表盘', path: '/' },
      { title: '健康趋势', path: '/dashboard/trends' },
      { title: '年度报告', path: '/dashboard/annual' },
    ],
  },
  {
    title: '个人档案',
    icon: User,
    path: '/profile',
    subItems: [
      { title: '基本信息', path: '/profile' },
      { title: '体量管理', path: '/profile/weight' },
      { title: '过敏史', path: '/profile/allergies' },
      { title: '用药记录', path: '/profile/medications' },
    ],
  },
  {
    title: '检查检验',
    icon: Activity,
    path: '/lab-tests',
    subItems: [
      { title: '生化检查', path: '/lab-tests/blood' },
      { title: '影像检查', path: '/lab-tests/imaging' },
      { title: '检查历史', path: '/lab-tests/history' },
      { title: '检查对比', path: '/lab-tests/compare' },
    ],
  },
  {
    title: '女性健康',
    icon: Heart,
    path: '/womens-health',
    subItems: [
      { title: '月经周期', path: '/womens-health/cycle' },
      { title: '孕期管理', path: '/womens-health/pregnancy' },
      { title: '更年期', path: '/womens-health/menopause' },
      { title: '周期日历', path: '/womens-health/calendar' },
    ],
  },
  {
    title: '预防保健',
    icon: Shield,
    path: '/preventive-care',
    subItems: [
      { title: '癌症筛查', path: '/preventive-care/screening' },
      { title: '疫苗接种', path: '/preventive-care/vaccines' },
      { title: '筛查计划', path: '/preventive-care/plan' },
      { title: '辐射安全', path: '/preventive-care/radiation' },
    ],
  },
  {
    title: '药物管理',
    icon: Pill,
    path: '/medication',
    subItems: [
      { title: '用药计划', path: '/medication/plan' },
      { title: '相互作用检查', path: '/medication/interactions' },
      { title: '用药提醒', path: '/medication/reminders' },
      { title: '用药历史', path: '/medication/history' },
    ],
  },
  {
    title: '数据分析',
    icon: BarChart3,
    path: '/analytics',
    subItems: [
      { title: '健康趋势', path: '/analytics/health-trends' },
      { title: '检查趋势', path: '/analytics/lab-trends' },
      { title: '统计报告', path: '/analytics/statistics' },
      { title: '数据导出', path: '/analytics/export' },
    ],
  },
  {
    title: '系统设置',
    icon: Settings,
    path: '/settings',
    subItems: [
      { title: '提醒设置', path: '/settings/reminders' },
      { title: '数据备份', path: '/settings/backup' },
      { title: '隐私设置', path: '/settings/privacy' },
      { title: '帮助中心', path: '/settings/help' },
    ],
  },
];

function SidebarMenuItem({ item, pathname }: { item: MenuItem; pathname: string }) {
  const Icon = item.icon;

  // 检查是否有子菜单项处于激活状态
  const hasActiveChild = item.subItems?.some(subItem => {
    if (subItem.path === '/' && pathname === '/') return true;
    if (subItem.path !== '/' && pathname === subItem.path) return true;
    if (subItem.path !== '/' && pathname.startsWith(subItem.path + '/')) return true;
    return false;
  });

  // 确定菜单部分是否应该展开 - 默认展开有激活子项的菜单
  const shouldExpand = hasActiveChild;
  const [isExpanded, setIsExpanded] = useState(shouldExpand);

  // 在 pathname 变化时更新展开状态
  useEffect(() => {
    if (shouldExpand) {
      setIsExpanded(true);
    }
  }, [shouldExpand]);

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          hasActiveChild
            ? 'bg-primary-500 text-white shadow-sm'
            : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
        )}
      >
        <span className="flex items-center gap-3">
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{item.title}</span>
        </span>
        {item.subItems && (
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform duration-200 flex-shrink-0',
              isExpanded && 'rotate-180'
            )}
          />
        )}
      </button>

      {item.subItems && (
        <div
          className={cn(
            'overflow-hidden transition-all duration-200 ease-in-out',
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <ul className="mt-1 ml-3 pl-6 border-l-2 border-gray-200 space-y-0.5">
            {item.subItems.map((subItem) => {
              const isActive =
                (subItem.path === '/' && pathname === '/') ||
                (subItem.path !== '/' && pathname === subItem.path) ||
                (subItem.path !== '/' && pathname.startsWith(subItem.path + '/'));

              return (
                <li key={subItem.path}>
                  <Link
                    href={subItem.path}
                    className={cn(
                      'block px-3 py-2 rounded-md text-sm transition-all duration-150',
                      isActive
                        ? 'text-primary-700 font-semibold bg-primary-100'
                        : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'
                    )}
                  >
                    {subItem.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-200 bg-white h-full flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div className="ml-3">
          <h1 className="text-base font-bold text-gray-900">健康管家</h1>
          <p className="text-xs text-gray-500">Health Manager</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path} item={item} pathname={pathname} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          © 2026 健康管家
        </p>
      </div>
    </aside>
  );
}
