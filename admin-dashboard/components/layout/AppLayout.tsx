'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Layout, Menu, Avatar, Badge, Input, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ExperimentOutlined,
  HeartOutlined,
  SafetyOutlined,
  MedicineBoxOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const menuItems: MenuItem[] = [
  getItem('健康概览', 'dashboard', <DashboardOutlined />, [
    getItem(<Link href="/">健康仪表盘</Link>, '/'),
    getItem(<Link href="/dashboard/trends">健康趋势</Link>, '/dashboard/trends'),
    getItem(<Link href="/dashboard/annual">年度报告</Link>, '/dashboard/annual'),
  ]),
  getItem('个人档案', 'profile', <UserOutlined />, [
    getItem(<Link href="/profile">基本信息</Link>, '/profile'),
    getItem(<Link href="/profile/weight">体量管理</Link>, '/profile/weight'),
    getItem(<Link href="/profile/allergies">过敏史</Link>, '/profile/allergies'),
    getItem(<Link href="/profile/medications">用药记录</Link>, '/profile/medications'),
  ]),
  getItem('检查检验', 'lab-tests', <ExperimentOutlined />, [
    getItem(<Link href="/lab-tests/blood">生化检查</Link>, '/lab-tests/blood'),
    getItem(<Link href="/lab-tests/imaging">影像检查</Link>, '/lab-tests/imaging'),
    getItem(<Link href="/lab-tests/history">检查历史</Link>, '/lab-tests/history'),
    getItem(<Link href="/lab-tests/compare">检查对比</Link>, '/lab-tests/compare'),
  ]),
  getItem('女性健康', 'womens-health', <HeartOutlined />, [
    getItem(<Link href="/womens-health/cycle">月经周期</Link>, '/womens-health/cycle'),
    getItem(<Link href="/womens-health/pregnancy">孕期管理</Link>, '/womens-health/pregnancy'),
    getItem(<Link href="/womens-health/menopause">更年期</Link>, '/womens-health/menopause'),
    getItem(<Link href="/womens-health/calendar">周期日历</Link>, '/womens-health/calendar'),
  ]),
  getItem('预防保健', 'preventive-care', <SafetyOutlined />, [
    getItem(<Link href="/preventive-care/screening">癌症筛查</Link>, '/preventive-care/screening'),
    getItem(<Link href="/preventive-care/vaccines">疫苗接种</Link>, '/preventive-care/vaccines'),
    getItem(<Link href="/preventive-care/plan">筛查计划</Link>, '/preventive-care/plan'),
    getItem(<Link href="/preventive-care/radiation">辐射安全</Link>, '/preventive-care/radiation'),
  ]),
  getItem('药物管理', 'medication', <MedicineBoxOutlined />, [
    getItem(<Link href="/medication/plan">用药计划</Link>, '/medication/plan'),
    getItem(<Link href="/medication/interactions">相互作用检查</Link>, '/medication/interactions'),
    getItem(<Link href="/medication/reminders">用药提醒</Link>, '/medication/reminders'),
    getItem(<Link href="/medication/history">用药历史</Link>, '/medication/history'),
  ]),
  getItem('数据分析', 'analytics', <BarChartOutlined />, [
    getItem(<Link href="/analytics/health-trends">健康趋势</Link>, '/analytics/health-trends'),
    getItem(<Link href="/analytics/lab-trends">检查趋势</Link>, '/analytics/lab-trends'),
    getItem(<Link href="/analytics/statistics">统计报告</Link>, '/analytics/statistics'),
    getItem(<Link href="/analytics/export">数据导出</Link>, '/analytics/export'),
  ]),
  getItem('系统设置', 'settings', <SettingOutlined />, [
    getItem(<Link href="/settings/reminders">提醒设置</Link>, '/settings/reminders'),
    getItem(<Link href="/settings/backup">数据备份</Link>, '/settings/backup'),
    getItem(<Link href="/settings/privacy">隐私设置</Link>, '/settings/privacy'),
    getItem(<Link href="/settings/help">帮助中心</Link>, '/settings/help'),
  ]),
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // 根据当前路径确定选中的菜单项和打开的子菜单
  const selectedKey = pathname;
  const openKeys = (() => {
    if (pathname === '/') return ['dashboard'];
    if (pathname.startsWith('/profile')) return ['profile'];
    if (pathname.startsWith('/lab-tests')) return ['lab-tests'];
    if (pathname.startsWith('/womens-health')) return ['womens-health'];
    if (pathname.startsWith('/preventive-care')) return ['preventive-care'];
    if (pathname.startsWith('/medication')) return ['medication'];
    if (pathname.startsWith('/analytics')) return ['analytics'];
    if (pathname.startsWith('/settings')) return ['settings'];
    return [];
  })();

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人资料',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: '设置',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={256}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #f0f0f0',
            padding: '0 16px',
          }}
        >
          {!collapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(132, 204, 22, 0.3)',
                }}
              >
                <HeartOutlined style={{ fontSize: 24, color: '#fff' }} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>
                  健康管家
                </div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Health Manager</div>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(132, 204, 22, 0.3)',
              }}
            >
              <HeartOutlined style={{ fontSize: 24, color: '#fff' }} />
            </div>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          items={menuItems}
          style={{ borderRight: 0, marginTop: 8 }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 256, transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: 20,
                cursor: 'pointer',
                transition: 'color 0.3s',
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>

            <Input
              placeholder="搜索健康数据..."
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              variant="filled"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar
                size={36}
                style={{ backgroundColor: '#84cc16', cursor: 'pointer' }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: '24px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: 8,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
