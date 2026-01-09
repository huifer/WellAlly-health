# Next.js + shadcn/ui 健康管理系统设计文档

> 版本: v1.0
> 创建日期: 2025-01-09
> 状态: 设计阶段

---

## 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [色彩系统](#色彩系统)
4. [导航结构](#导航结构)
5. [MVP 功能设计](#mvp-功能设计)
6. [数据结构](#数据结构)
7. [页面布局](#页面布局)
8. [响应式设计](#响应式设计)
9. [文件结构](#文件结构)
10. [实施计划](#实施计划)

---

## 项目概述

### 项目目标
构建一个基于 Next.js 14 和 shadcn/ui 的现代化健康管理系统，通过可视化界面展示个人健康数据，支持健康趋势分析和检查检验结果查看。

### 核心特性
- 📊 **健康数据可视化**: 折线图、柱状图、仪表盘卡片
- 📱 **全设备响应式**: 支持手机、平板、桌面
- 🎨 **暖绿色主题**: 温和友好的视觉体验
- 📁 **JSON 数据加载**: 直接从 data-example 加载数据
- 🔒 **只读模式**: 安全查看健康数据

---

## 技术栈

### 前端框架
```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "typescript": "^5.0.0"
}
```

### UI 组件库
- **shadcn/ui**: 高质量 React 组件库
- **Tailwind CSS**: 原子化 CSS 框架
- **Lucide React**: 图标库

### 数据可视化
- **Recharts**: ^2.12.0
  - 折线图：体重/BMI 趋势
  - 柱状图：检查结果对比
  - 迷你图：仪表盘快速预览

### 工具库
- **date-fns**: ^3.0.0 (日期处理)
- **clsx**: 条件 className
- **tailwind-merge**: Tailwind 类名合并

---

## 色彩系统

### 暖绿色主题定义

```css
:root {
  /* 主色调 - #10B981 Emerald 500 */
  --primary: 158 76% 41%;
  --primary-foreground: 0 0% 100%;

  /* 辅助色 - #34D399 Emerald 400 */
  --secondary: 156 60% 56%;
  --secondary-foreground: 0 0% 100%;

  /* 强调色 - #059669 Emerald 600 */
  --accent: 158 64% 42%;
  --accent-foreground: 0 0% 100%;

  /* 背景色 - #ECFDF5 Emerald 50 */
  --muted: 156 78% 97%;
  --muted-foreground: 222.2 84% 4.9%;

  /* 功能色 */
  --success: 158 76% 41%;    /* 正常指标 */
  --warning: 38 92% 50%;     /* #F59E0B Amber 500 */
  --destructive: 0 84% 60%;  /* 异常指标 #EF4444 */
  --info: 199 89% 48%;       /* #06B6D4 Cyan 500 */

  /* 中性色 - Slate 系列 */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 158 76% 41%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}
```

### 色彩使用规范

| 场景 | 颜色 | 用途 |
|------|------|------|
| 主要按钮 | --primary | 确认、提交、主要操作 |
| 悬停状态 | --secondary | 按钮、链接悬停 |
| 强调元素 | --accent | CTA、重要提示 |
| 正常指标 | --success | 健康状态、正常范围 |
| 警告信息 | --warning | 注意、提醒 |
| 异常指标 | --destructive | 危险、异常值 |
| 页面背景 | --muted | 浅绿色背景 |

### Tailwind 配置

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',  // 主色
          600: '#059669',  // 强调色
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        }
      }
    }
  }
}
```

---

## 导航结构

### 左侧导航栏配置

#### 导航栏规格
- **宽度**: 260px (桌面)
- **折叠宽度**: 70px
- **背景色**: white
- **边框**: 右侧 1px 边框
- **支持**: 展开/收起、移动端抽屉

---

### 一级菜单 + 二级菜单结构

#### 1. 🏠 健康概览 (Dashboard)
- 图标: `LayoutDashboard`
- 路径: `/`

**二级菜单**:
- 健康仪表盘 → `/`
- 健康趋势 → `/dashboard/trends`
- 年度报告 → `/dashboard/annual`

**功能**:
- 基础指标卡片（年龄、BMI、体重、身高）
- 最近检查结果快速访问
- 即将到来的提醒
- 趋势迷你图

---

#### 2. 👤 个人档案 (Profile)
- 图标: `User`
- 路径: `/profile`

**二级菜单**:
- 基本信息 → `/profile`
- 体量管理 → `/profile/weight`
- 过敏史 → `/profile/allergies`
- 用药记录 → `/profile/medications`

**功能**:
- 个人信息查看
- 体重/BMI 历史折线图
- 过敏原列表和严重程度
- 用药清单

---

#### 3. 📊 检查检验 (Lab Tests)
- 图标: `Activity`
- 路径: `/lab-tests`

**二级菜单**:
- 生化检查 → `/lab-tests/blood`
- 影像检查 → `/lab-tests/imaging`
- 检查历史 → `/lab-tests/history`
- 检查对比 → `/lab-tests/compare`

**功能**:
- 时间线视图
- 异常指标红色标记
- 历史结果对比柱状图
- 详细报告弹窗

---

#### 4. 🌸 女性健康 (Women's Health)
- 图标: `Heart`
- 路径: `/womens-health`

**二级菜单**:
- 月经周期 → `/womens-health/cycle`
- 孕期管理 → `/womens-health/pregnancy`
- 更年期 → `/womens-health/menopause`
- 周期日历 → `/womens-health/calendar`

**功能**:
- 月经周期日历
- 排卵期预测
- 孕期检查记录
- 更年期症状追踪

---

#### 5. 🛡️ 预防保健 (Preventive Care)
- 图标: `Shield`
- 路径: `/preventive-care`

**二级菜单**:
- 癌症筛查 → `/preventive-care/screening`
- 疫苗接种 → `/preventive-care/vaccines`
- 筛查计划 → `/preventive-care/plan`
- 辐射安全 → `/preventive-care/radiation`

**功能**:
- 各类筛查记录
- 筛查依从性分析
- 疫苗接种进度
- 累计辐射剂量

---

#### 6. 💊 药物管理 (Medication)
- 图标: `Pill`
- 路径: `/medication`

**二级菜单**:
- 用药计划 → `/medication/plan`
- 相互作用检查 → `/medication/interactions`
- 用药提醒 → `/medication/reminders`
- 用药历史 → `/medication/history`

**功能**:
- 当前用药清单
- 药物相互作用检查
- 用药提醒设置
- 用药依从性统计

---

#### 7. 📈 数据分析 (Analytics)
- 图标: `BarChart3`
- 路径: `/analytics`

**二级菜单**:
- 健康趋势 → `/analytics/health-trends`
- 检查趋势 → `/analytics/lab-trends`
- 统计报告 → `/analytics/statistics`
- 数据导出 → `/analytics/export`

**功能**:
- 多维度健康数据可视化
- 趋势分析和预测
- 个性化报告生成
- 数据导出

---

#### 8. ⚙️ 系统设置 (Settings)
- 图标: `Settings`
- 路径: `/settings`

**二级菜单**:
- 提醒设置 → `/settings/reminders`
- 数据备份 → `/settings/backup`
- 隐私设置 → `/settings/privacy`
- 帮助中心 → `/settings/help`

**功能**:
- 提醒规则配置
- 数据导入导出
- 隐私和安全设置
- 使用帮助

---

## MVP 功能设计

### 第一阶段功能（核心功能）

#### 1. 健康概览仪表盘

**页面**: `app/page.tsx`

**组件结构**:
```
Dashboard
├── BasicMetricsCard        # 基础指标卡片
│   ├── AgeDisplay         # 年龄显示
│   ├── HeightDisplay      # 身高显示
│   ├── WeightDisplay      # 体重显示
│   └── BMIDisplay         # BMI 显示
├── RecentTests            # 最近检查结果
│   └── TestCard           # 检查卡片（×3）
├── UpcomingReminders     # 即将到来的提醒
│   └── ReminderCard       # 提醒卡片
└── TrendMiniCharts       # 趋势迷你图
    ├── WeightMiniChart    # 体重迷你折线图
    └── BMIMiniChart       # BMI 迷你折线图
```

**数据来源**:
- `data-example/profile.json` - 基础指标
- `data-example/生化检查/*.json` - 检查结果
- `data-example/reminders.json` - 提醒数据

**卡片设计**:
```tsx
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle className="text-lg">基础指标</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard label="年龄" value="35" unit="岁" />
      <MetricCard label="身高" value="165" unit="cm" />
      <MetricCard label="体重" value="58.5" unit="kg" />
      <MetricCard label="BMI" value="21.5" status="正常" />
    </div>
  </CardContent>
</Card>
```

---

#### 2. 个人档案管理

**基本信息页面**: `app/profile/page.tsx`

**组件结构**:
```
ProfilePage
├── ProfileCard           # 基本信息卡片
│   ├── PersonalInfo     # 个人信息
│   └── HealthSummary    # 健康总结
└── QuickActions         # 快速操作
    └── ActionLink       # 跳转链接
```

**体量管理页面**: `app/profile/weight/page.tsx`

**组件结构**:
```
WeightPage
├── WeightHistoryChart    # 体重历史折线图
│   └── LineChart       # Recharts 折线图
├── BMIHistoryChart      # BMI 历史折线图
│   └── LineChart       # Recharts 折线图
└── WeightTable          # 历史数据表格
    └── Table           # shadcn/ui Table
```

**过敏史页面**: `app/profile/allergies/page.tsx`

**组件结构**:
```
AllergiesPage
└── AllergiesList        # 过敏原列表
    └── AllergyCard     # 过敏卡片
        ├── SeverityBadge # 严重程度徽章
        ├── SymptomsList # 症状列表
        └── DateInfo     # 日期信息
```

---

#### 3. 检查检验查看

**检查列表页面**: `app/lab-tests/page.tsx`

**组件结构**:
```
LabTestsPage
├── FilterBar            # 筛选栏
│   ├── TypeFilter      # 类型筛选
│   └── DateFilter      # 日期筛选
├── TestTimeline         # 时间线视图
│   └── TimelineItem    # 时间线项目
│       ├── DateBadge   # 日期徽章
│       ├── TestInfo    # 检查信息
│       └── AbnormalCount # 异常指标数
└── ResultComparisonChart # 历史对比图
    └── BarChart        # Recharts 柱状图
```

**检查详情页面**: `app/lab-tests/[id]/page.tsx`

**组件结构**:
```
TestDetailPage
├── TestHeader           # 检查头部信息
│   ├── TestType        # 检查类型
│   └── TestDate        # 检查日期
├── TestSummary          # 检查摘要
│   ├── TotalItems      # 总指标数
│   └── AbnormalItems   # 异常数
└── TestResultsList      # 检查结果列表
    └── TestResultItem  # 单个指标
        ├── IndicatorName # 指标名称
        ├── ValueDisplay # 值显示
        ├── ReferenceRange # 参考范围
        └── AbnormalBadge # 异常标记
```

**异常指标标记**:
- 正常：绿色文字 + 无标记
- 异常：红色文字 + "异常" Badge
- 参考范围：灰色小字

**时间线设计**:
```tsx
<Timeline>
  <TimelineItem>
    <TimelineDot color="primary" />
    <TimelineContent>
      <div className="flex justify-between">
        <h3>血常规检查</h3>
        <Badge>2025-12-15</Badge>
      </div>
      <p>异常指标: 3 项</p>
      <Button variant="outline" size="sm">查看详情</Button>
    </TimelineContent>
  </TimelineItem>
</Timeline>
```

---

## 数据结构

### Profile 数据结构

```typescript
// data-example/profile.json
interface Profile {
  created_at: string;           // "2023-01-15T09:30:00Z"
  last_updated: string;         // "2025-12-20T14:22:00Z"
  basic_info: {
    height: number;             // 165 (cm)
    height_unit: string;        // "cm"
    weight: number;             // 58.5 (kg)
    weight_unit: string;        // "kg"
    birth_date: string;         // "1990-03-22"
  };
  calculated: {
    age: number;                // 35
    age_years: number;          // 35
    bmi: number;                // 21.5
    bmi_status: string;         // "正常"
    body_surface_area: number;  // 1.62 (m²)
    bsa_unit: string;           // "m²"
  };
  history: WeightHistory[];
}

interface WeightHistory {
  date: string;    // "2025-12-20"
  weight: number;  // 58.5
  bmi: number;     // 21.5
  notes: string;   // "体重稳定"
}
```

---

### 生化检查数据结构

```typescript
// data-example/生化检查/blood-routine-2025-12-15.json
interface LabTest {
  id: string;              // "BLOOD_20251215"
  type: string;            // "血常规"
  date: string;            // "2025-12-15"
  hospital?: string;       // 医院名称
  department?: string;     // 科室
  items: LabTestItem[];
  notes?: string;          // 备注
  doctor_advice?: string;  // 医生建议
}

interface LabTestItem {
  name: string;           // "白细胞计数"
  value: number;          // 6.5
  unit: string;           // "×10^9/L"
  min_ref: number;        // 4.0
  max_ref: number;        // 10.0
  is_abnormal: boolean;   // false
  abnormal_type?: "high" | "low"; // "low"
  clinical_significance?: string; // 临床意义
}
```

---

### 过敏史数据结构

```typescript
// data-example/allergies.json
interface AllergyData {
  allergies: Allergy[];
}

interface Allergy {
  allergen: string;           // "青霉素"
  category: string;           // "drug" | "food" | "environmental"
  severity: string;           // "mild" | "moderate" | "severe"
  severity_level: number;     // 1-3
  symptoms: string[];         // ["皮疹", "呼吸困难"]
  onset_date: string;         // "2015-06-10"
  last_occurrence: string;    // "2023-03-15"
  confirmed_by: string;       // "医生诊断"
  notes?: string;
}
```

---

### 提醒数据结构

```typescript
// data-example/reminders.json
interface ReminderData {
  reminders: Reminder[];
  user_settings: {
    notification_enabled: boolean;
    notification_methods: string[];
    default_reminder_time: string; // "09:00"
  };
}

interface Reminder {
  id: string;
  type: "screening" | "vaccine" | "medication" | "checkup";
  title: string;
  description: string;
  due_date: string;
  status: "pending" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  recurring?: {
    frequency: string; // "yearly"
    interval: number;
  };
}
```

---

## 页面布局

### 整体布局结构

```
┌─────────────────────────────────────────────────────────┐
│  Header (固定高度: 64px)                                  │
│  ┌─────────────┬──────────────────┬──────────────────┐  │
│  │ Logo (绿色) │   搜索框         │  头像 | 通知     │  │
│  └─────────────┴──────────────────┴──────────────────┘  │
├──────────┬──────────────────────────────────────────────┤
│          │                                               │
│  左侧    │           主内容区域                          │
│  导航栏   │           (滚动区域)                         │
│ (260px)  │                                               │
│          │  ┌────────────────────────────────────────┐  │
│  ☰ 健康   │  │                                        │  │
│    概览   │  │        页面内容                         │  │
│          │  │                                        │  │
│  👤 个人  │  │                                        │  │
│    档案   │  │                                        │  │
│          │  │                                        │  │
│  📊 检查  │  │                                        │  │
│    检验   │  │                                        │  │
│          │  └────────────────────────────────────────┘  │
│          │                                               │
└──────────┴──────────────────────────────────────────────┘
```

### 响应式断点

```css
/* 移动端: < 768px */
- 侧边栏: 隐藏（抽屉式）
- Header: 显示菜单按钮
- 主内容: 全宽
- 网格: 1 列

/* 平板: 768px - 1024px */
- 侧边栏: 可折叠
- Header: 标准布局
- 主内容: 左边距 260px (展开) / 70px (折叠)
- 网格: 2 列

/* 桌面: > 1024px */
- 侧边栏: 完全展开
- Header: 标准布局
- 主内容: 左边距 260px
- 网格: 3 列
```

---

## 响应式设计

### Tailwind 响应式类

```tsx
// 网格布局示例
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 移动端: 1 列, 平板: 2 列, 桌面: 3 列 */}
</div>

// 导航栏响应式
<div className="
  fixed inset-y-0 left-0 z-50
  w-64
  transform -translate-x-full lg:translate-x-0
  transition-transform
">
  {/* 移动端: 隐藏; 桌面端: 显示 */}
</div>

// 卡片响应式内边距
<Card className="p-4 md:p-6 lg:p-8">
  {/* 移动端: 16px, 平板: 24px, 桌面: 32px */}
</Card>
```

### 移动端优化

#### 侧边栏抽屉
```tsx
// components/layout/MobileNav.tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="lg:hidden">
      <Menu />
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-64">
    <Sidebar /> {/* 复用桌面端侧边栏 */}
  </SheetContent>
</Sheet>
```

#### 图表自适应
```tsx
// Recharts 响应式容器
<div className="w-full h-64 md:h-80 lg:h-96">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      {/* ... */}
    </LineChart>
  </ResponsiveContainer>
</div>
```

#### 表格横向滚动
```tsx
<div className="overflow-x-auto">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="whitespace-nowrap">日期</TableHead>
        {/* ... */}
      </TableRow>
    </TableHeader>
  </Table>
</div>
```

---

## 文件结构

### 完整项目结构

```
admin-dashboard/
├── app/
│   ├── layout.tsx                          # 根布局
│   ├── page.tsx                            # 健康概览仪表盘
│   ├── globals.css                         # 全局样式
│   │
│   ├── profile/                            # 个人档案
│   │   ├── page.tsx                        # 基本信息
│   │   ├── weight/
│   │   │   └── page.tsx                    # 体量管理
│   │   └── allergies/
│   │       └── page.tsx                    # 过敏史
│   │
│   ├── lab-tests/                          # 检查检验
│   │   ├── page.tsx                        # 检查列表
│   │   └── [id]/
│   │       └── page.tsx                    # 检查详情
│   │
│   ├── womens-health/                      # 女性健康（占位）
│   │   └── page.tsx
│   │
│   ├── preventive-care/                    # 预防保健（占位）
│   │   └── page.tsx
│   │
│   ├── medication/                         # 药物管理（占位）
│   │   └── page.tsx
│   │
│   ├── analytics/                          # 数据分析（占位）
│   │   └── page.tsx
│   │
│   └── settings/                           # 系统设置（占位）
│       └── page.tsx
│
├── components/
│   ├── ui/                                 # shadcn/ui 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   └── ... (其他 shadcn 组件)
│   │
│   ├── layout/
│   │   ├── Sidebar.tsx                     # 侧边栏导航
│   │   ├── Header.tsx                      # 顶部栏
│   │   └── MobileNav.tsx                   # 移动端导航
│   │
│   ├── dashboard/
│   │   ├── BasicMetricsCard.tsx            # 基础指标卡片
│   │   ├── RecentTests.tsx                 # 最近检查结果
│   │   ├── UpcomingReminders.tsx           # 即将到来的提醒
│   │   └── TrendMiniCharts.tsx             # 趋势迷你图
│   │
│   ├── profile/
│   │   ├── ProfileCard.tsx                 # 个人信息卡片
│   │   ├── WeightHistoryChart.tsx          # 体重历史图
│   │   ├── BMIHistoryChart.tsx             # BMI 历史图
│   │   └── AllergiesList.tsx               # 过敏原列表
│   │
│   └── lab-tests/
│       ├── TestTimeline.tsx                # 检查时间线
│       ├── AbnormalIndicator.tsx           # 异常指标标记
│       ├── ResultComparisonChart.tsx       # 结果对比图
│       └── TestDetailDialog.tsx            # 检查详情弹窗
│
├── lib/
│   ├── data/
│   │   └── loader.ts                       # JSON 数据加载
│   │
│   ├── types/
│   │   └── index.ts                        # TypeScript 类型
│   │
│   └── utils/
│       ├── cn.ts                           # className 工具
│       └── date.ts                         # 日期格式化
│
├── public/
│   └── images/                             # 静态图片
│
├── tailwind.config.ts                      # Tailwind 配置
├── tsconfig.json                           # TypeScript 配置
├── next.config.js                          # Next.js 配置
├── package.json                            # 依赖配置
└── README.md                               # 项目说明
```

---

## 实施计划

### Phase 1: 项目初始化 (1-2 天)

#### 1.1 创建 Next.js 项目
```bash
cd admin-dashboard
npx create-next-app@latest . --typescript --tailwind --app
```

#### 1.2 配置 package.json
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "recharts": "^2.12.0",
    "date-fns": "^3.0.0",
    "lucide-react": "^0.400.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

#### 1.3 配置暖绿色主题
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 158 76% 41%;          /* #10B981 */
    --primary-foreground: 0 0% 100%;
    --secondary: 156 60% 56%;        /* #34D399 */
    --accent: 158 64% 42%;           /* #059669 */
    --muted: 156 78% 97%;            /* #ECFDF5 */
    --destructive: 0 84% 60%;
    --border: 214.3 31.8% 91.4%;
    --ring: 158 76% 41%;
    --radius: 0.5rem;
  }
}
```

#### 1.4 安装 shadcn/ui
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add card button badge
npx shadcn-ui@latest add dialog dropdown-menu avatar
npx shadcn-ui@latest add table select calendar
npx shadcn-ui@latest add tabs scroll-area separator sheet
```

---

### Phase 2: 数据加载层 (1 天)

#### 2.1 创建数据加载工具
```typescript
// lib/data/loader.ts
import fs from 'fs';
import path from 'path';

const DATA_BASE_PATH = path.resolve(process.cwd(), '../data-example');

export function loadProfileData(): Profile {
  const filePath = path.join(DATA_BASE_PATH, 'profile.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export function loadAllergies(): AllergyData {
  const filePath = path.join(DATA_BASE_PATH, 'allergies.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export function loadLabTests(): LabTest[] {
  const basePath = path.join(DATA_BASE_PATH, '生化检查');
  const files = fs.readdirSync(basePath);
  const tests = files.map(file => {
    const filePath = path.join(basePath, file);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  });
  return tests.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function loadReminders(): ReminderData {
  const filePath = path.join(DATA_BASE_PATH, 'reminders.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}
```

#### 2.2 创建类型定义
```typescript
// lib/types/index.ts
export interface Profile {
  created_at: string;
  last_updated: string;
  basic_info: {
    height: number;
    height_unit: string;
    weight: number;
    weight_unit: string;
    birth_date: string;
  };
  calculated: {
    age: number;
    bmi: number;
    bmi_status: string;
  };
  history: WeightHistory[];
}

export interface WeightHistory {
  date: string;
  weight: number;
  bmi: number;
  notes: string;
}

export interface LabTest {
  id: string;
  type: string;
  date: string;
  items: LabTestItem[];
  notes?: string;
}

export interface LabTestItem {
  name: string;
  value: number;
  unit: string;
  min_ref: number;
  max_ref: number;
  is_abnormal: boolean;
  abnormal_type?: 'high' | 'low';
}
```

---

### Phase 3: 布局组件 (2-3 天)

#### 3.1 创建侧边栏
```typescript
// components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Activity,
  Heart,
  Shield,
  Pill,
  BarChart3,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const menuItems = [
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
  // ... 其他菜单项
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white h-full flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-primary">健康管家</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <SidebarMenuItem item={item} pathname={pathname} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function SidebarMenuItem({ item, pathname }: { item: any; pathname: string }) {
  const Icon = item.icon;
  const isActive = pathname.startsWith(item.path);
  const [isExpanded, setIsExpanded] = useState(isActive);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        <span className="flex items-center">
          <Icon className="w-5 h-5 mr-3" />
          {item.title}
        </span>
        {item.subItems && (
          <ChevronRight
            className={cn(
              "w-4 h-4 transition-transform",
              isExpanded && "rotate-90"
            )}
          />
        )}
      </button>

      {isExpanded && item.subItems && (
        <ul className="mt-1 ml-9 space-y-1">
          {item.subItems.map((subItem: any) => (
            <li key={subItem.path}>
              <Link
                href={subItem.path}
                className={cn(
                  "block px-4 py-2 rounded-lg text-sm transition-colors",
                  pathname === subItem.path
                    ? "text-primary font-medium"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {subItem.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

#### 3.2 创建 Header
```typescript
// components/layout/Header.tsx
'use client';

import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="搜索健康数据..."
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* User Avatar */}
        <Avatar className="w-9 h-9">
          <AvatarImage src="/images/avatar.jpg" />
          <AvatarFallback className="bg-primary text-white">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
```

#### 3.3 创建根布局
```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';

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
        <div className="flex h-screen overflow-hidden bg-gray-50">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />

            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
```

---

### Phase 4: MVP 功能实现 (3-5 天)

#### 4.1 健康概览仪表盘
```typescript
// app/page.tsx
import { loadProfileData, loadLabTests, loadReminders } from '@/lib/data/loader';
import { BasicMetricsCard } from '@/components/dashboard/BasicMetricsCard';
import { RecentTests } from '@/components/dashboard/RecentTests';
import { UpcomingReminders } from '@/components/dashboard/UpcomingReminders';
import { TrendMiniCharts } from '@/components/dashboard/TrendMiniCharts';

export default function HomePage() {
  const profile = loadProfileData();
  const labTests = loadLabTests();
  const reminders = loadReminders();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">健康概览</h1>
        <p className="text-gray-600 mt-1">
          欢迎回来，查看您的健康状况概览
        </p>
      </div>

      {/* Basic Metrics */}
      <BasicMetricsCard profile={profile} />

      {/* Charts and Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendMiniCharts profile={profile} />
        </div>
        <div>
          <UpcomingReminders reminders={reminders} />
        </div>
      </div>

      {/* Recent Tests */}
      <RecentTests tests={labTests.slice(0, 3)} />
    </div>
  );
}
```

#### 4.2 基础指标卡片组件
```typescript
// components/dashboard/BasicMetricsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Profile } from '@/lib/types';
import { Activity, Target, Ruler } from 'lucide-react';

interface Props {
  profile: Profile;
}

export function BasicMetricsCard({ profile }: Props) {
  const { basic_info, calculated } = profile;

  const metrics = [
    {
      label: '年龄',
      value: calculated.age,
      unit: '岁',
      icon: Activity,
      color: 'bg-blue-500',
    },
    {
      label: '身高',
      value: basic_info.height,
      unit: basic_info.height_unit,
      icon: Ruler,
      color: 'bg-purple-500',
    },
    {
      label: '体重',
      value: basic_info.weight,
      unit: basic_info.weight_unit,
      icon: Target,
      color: 'bg-orange-500',
    },
    {
      label: 'BMI',
      value: calculated.bmi,
      unit: calculated.bmi_status,
      icon: Activity,
      color: 'bg-green-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>基础指标</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
              >
                <div className={`w-10 h-10 ${metric.color} rounded-full flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                <div className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-500">{metric.unit}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
```

#### 4.3 趋势迷你图组件
```typescript
// components/dashboard/TrendMiniCharts.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Profile } from '@/lib/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  profile: Profile;
}

export function TrendMiniCharts({ profile }: Props) {
  const chartData = profile.history.slice(-6).map((h) => ({
    date: new Date(h.date).toLocaleDateString('zh-CN', { month: 'short' }),
    weight: h.weight,
    bmi: h.bmi,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>健康趋势</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Weight Chart */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">体重趋势</h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* BMI Chart */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">BMI 趋势</h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bmi"
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={{ fill: '#34d399', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### Phase 5: 响应式优化 (1-2 天)

#### 5.1 移动端导航
```typescript
// components/layout/MobileNav.tsx
'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button size="icon" className="h-14 w-14 shadow-lg bg-primary">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
```

#### 5.2 响应式网格
```tsx
// 示例：仪表盘网格布局
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <BasicMetricsCard /> {/* 占据 1 列 */}
  <RecentTests className="md:col-span-2" /> {/* 平板+桌面占 2 列 */}
  <UpcomingReminders />
  <TrendMiniCharts className="md:col-span-2 lg:col-span-3" /> {/* 大屏占满 */}
</div>
```

---

### Phase 6: 测试和验证 (1 天)

#### 6.1 功能测试清单

- [ ] 健康概览仪表盘
  - [ ] 基础指标卡片正确显示
  - [ ] 最近检查结果加载
  - [ ] 即将到来的提醒显示
  - [ ] 趋势迷你图渲染

- [ ] 个人档案
  - [ ] 基本信息 页面加载
  - [ ] 体量管理折线图显示
  - [ ] 过敏史列表展示

- [ ] 检查检验
  - [ ] 时间线视图正确
  - [ ] 异常指标红色标记
  - [ ] 历史对比柱状图
  - [ ] 检查详情弹窗

- [ ] 导航和布局
  - [ ] 所有菜单项可点击
  - [ ] 二级菜单展开/收起
  - [ ] 移动端抽屉菜单
  - [ ] 暖绿色主题一致

#### 6.2 响应式测试

- [ ] 桌面端 (>1024px)
  - [ ] 侧边栏完整显示
  - [ ] 3 列网格布局
  - [ ] 图表正常渲染

- [ ] 平板端 (768px-1024px)
  - [ ] 侧边栏可折叠
  - [ ] 2 列网格布局
  - [ ] 触摸交互友好

- [ ] 移动端 (<768px)
  - [ ] 侧边栏隐藏
  - [ ] 抽屉式菜单
  - [ ] 1 列布局
  - [ ] 图表自适应

---

## 附录

### 启动命令

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

### 环境要求

- Node.js: >= 18.17.0
- npm: >= 9.0.0

### 浏览器支持

- Chrome: >= 90
- Firefox: >= 88
- Safari: >= 14
- Edge: >= 90

### 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [Recharts 文档](https://recharts.org)
- [Tailwind CSS 文档](https://tailwindcss.com)

---

**文档版本**: v1.0
**最后更新**: 2025-01-09
**维护者**: Claude Code
