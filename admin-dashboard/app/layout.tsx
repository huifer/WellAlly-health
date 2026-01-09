import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import locale from 'antd/locale/zh_CN';
import './globals.css';
import { AppLayout } from '@/components/layout/AppLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '健康管理系统',
  description: '个人健康管理数据可视化平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            locale={locale}
            theme={{
              token: {
                colorPrimary: '#84cc16',
                colorSuccess: '#84cc16',
                colorInfo: '#06b6d4',
                colorWarning: '#f59e0b',
                colorError: '#ef4444',
                borderRadius: 8,
                fontSize: 14,
                fontFamily: inter.style.fontFamily,
              },
              components: {
                Layout: {
                  siderBg: '#ffffff',
                  headerBg: '#ffffff',
                  bodyBg: '#f9fafb',
                },
                Menu: {
                  itemBg: 'transparent',
                  itemSelectedBg: '#ecfccb',
                  itemSelectedColor: '#4d7c0f',
                  itemHoverBg: '#f7fee7',
                  itemHoverColor: '#65a30d',
                },
              },
            }}
          >
            <AppLayout>{children}</AppLayout>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
