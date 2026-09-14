'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/mirsad/app-shell'
import { KpiCard } from '@/components/mirsad/kpi-card'
import {
  ANALYTICS,
  PERIOD_LABELS,
  INDICATOR_META,
  countByIndicator,
  TRANSACTIONS,
  type Period,
} from '@/lib/mirsad-data'
import { cn } from '@/lib/utils'
import {
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts'

const STATUS_COLORS: Record<string, string> = {
  normal: '#64748b',
  done: '#15803d',
  warn: '#b45309',
  danger: '#c62828',
}

const AXIS = { fontSize: 12, fill: '#5b6b7b', fontFamily: 'inherit' }

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('month')
  const d = ANALYTICS[period]
  const counts = countByIndicator(TRANSACTIONS)

  return (
    <AppShell
      role="employee"
      userName="م. تركي الغامدي"
      userMeta="موظف مختص · ديوان الإمارة"
      notifCount={counts.danger + counts.warn}
    >
      <div className="flex flex-col gap-7">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/employee" className="hover:text-foreground">
            الرئيسية
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground">التحليل والتحسين</span>
        </nav>

        {/* Header + period selector */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy sm:text-3xl">التحليل والتحسين</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              فهم أداء الخدمات بشكل عام، والتعرّف على أنماط التعثّر لتمكين التحسين المستمر.
            </p>
          </div>
          <div className="inline-flex rounded-xl border border-border bg-card p-1 shadow-sm">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                  period === p ? 'bg-navy text-white' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </section>

        {/* KPI cards */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard label="إجمالي المعاملات" value={d.total.toLocaleString('ar-EG')} icon={Layers} accent="var(--navy)" hint={`خلال ${PERIOD_LABELS[period]}`} />
          <KpiCard label="المعاملات المكتملة" value={d.done.toLocaleString('ar-EG')} icon={CheckCircle2} accent={STATUS_COLORS.done} hint={`نسبة الإنجاز ${d.completionRate}%`} />
          <KpiCard label="بوادر تعثّر" value={d.warn.toLocaleString('ar-EG')} icon={AlertTriangle} accent={STATUS_COLORS.warn} hint={`نسبة التعثّر ${d.stallRate}%`} />
          <KpiCard label="عالية الخطورة" value={d.danger.toLocaleString('ar-EG')} icon={ShieldAlert} accent={STATUS_COLORS.danger} hint="تحتاج تدخّلًا عاجلًا" />
          <KpiCard label="المعاملات المتأخرة" value={d.delayed.toLocaleString('ar-EG')} icon={Clock} accent="var(--cyan)" />
          <KpiCard label="متوسط زمن الإنجاز" value={`${d.avgCompletionDays} يوم`} icon={Clock} accent="var(--navy)" />
          <KpiCard label="نسبة الإنجاز" value={`${d.completionRate}%`} icon={CheckCircle2} accent={STATUS_COLORS.done} />
          <div className="flex flex-col gap-1 rounded-2xl border border-status-done/25 bg-status-done-soft p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">نسبة التحسّن</span>
              <TrendingUp className="size-4 text-status-done" />
            </div>
            <span className="text-2xl font-bold tnum text-status-done sm:text-3xl">
              {d.improvement}%
            </span>
            <span className="text-xs text-muted-foreground">انخفاض المعاملات المتعثّرة مقارنةً بالفترة السابقة</span>
          </div>
        </section>

        {/* Charts row 1 */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Status distribution */}
          <ChartCard title="توزيع حالات المعاملات" subtitle={`إجمالي ${d.total.toLocaleString('ar-EG')} معاملة`}>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <ResponsiveContainer width="100%" height={220} className="max-w-[260px]">
                <PieChart>
                  <Pie
                    data={d.statusDistribution}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    stroke="none"
                    isAnimationActive={false}
                  >
                    {d.statusDistribution.map((s) => (
                      <Cell key={s.key} fill={STATUS_COLORS[s.key]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number, n) => [v.toLocaleString('ar-EG'), n as string]}
                    contentStyle={tooltipStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
              <ul className="flex flex-1 flex-col gap-2.5">
                {d.statusDistribution.map((s) => {
                  const pct = Math.round((s.value / d.total) * 100)
                  return (
                    <li key={s.key} className="flex items-center gap-2 text-sm">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.key] }} />
                      <span className="flex-1 text-foreground/90">{s.label}</span>
                      <span className="font-semibold tnum text-navy">{s.value.toLocaleString('ar-EG')}</span>
                      <span className="w-10 text-left text-xs text-muted-foreground tnum">{pct}%</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </ChartCard>

          {/* Trend */}
          <ChartCard title="اتجاه الأداء عبر الفترة" subtitle="الإنجاز مقابل التأخّر وبوادر التعثّر">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={d.trend} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f4" vertical={false} />
                <XAxis dataKey="label" reversed tick={AXIS} tickLine={false} axisLine={{ stroke: '#e2e8ec' }} />
                <YAxis orientation="right" tick={AXIS} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="completed" name="مكتملة" stroke="#15803d" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
                <Line type="monotone" dataKey="delayed" name="متأخرة" stroke="#b45309" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
                <Line type="monotone" dataKey="risk" name="عالية الخطورة" stroke="#c62828" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        {/* Charts row 2 */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Causes of delay */}
          <ChartCard title="أبرز أسباب التأخّر" subtitle="النسبة من إجمالي حالات التعثّر">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={d.causes} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f4" horizontal={false} />
                <XAxis type="number" orientation="top" tick={AXIS} tickLine={false} axisLine={false} unit="٪" />
                <YAxis
                  type="category"
                  dataKey="label"
                  orientation="right"
                  width={120}
                  tick={AXIS}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip formatter={(v: number) => [`${v}%`, 'النسبة']} contentStyle={tooltipStyle} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="value" fill="#009ca5" radius={[6, 0, 0, 6]} barSize={18} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Processing time expected vs actual */}
          <ChartCard title="متوسط زمن المعالجة" subtitle="المدة المتوقعة مقابل الفعلية (بالأيام)">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={d.processingTime} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f4" vertical={false} />
                <XAxis dataKey="label" reversed tick={AXIS} tickLine={false} axisLine={{ stroke: '#e2e8ec' }} />
                <YAxis orientation="right" tick={AXIS} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f1f5f9' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="expected" name="المتوقعة" fill="#1a293c" radius={[6, 6, 0, 0]} barSize={16} isAnimationActive={false} />
                <Bar dataKey="actual" name="الفعلية" fill="#009ca5" radius={[6, 6, 0, 0]} barSize={16} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        {/* Services table */}
        <section>
          <h2 className="mb-3 text-lg font-bold text-navy">تفصيل الخدمات — {PERIOD_LABELS[period]}</h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-right text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 text-xs text-muted-foreground">
                    <Th>الخدمة</Th>
                    <Th>إجمالي المعاملات</Th>
                    <Th>المكتملة</Th>
                    <Th>المتأخرة</Th>
                    <Th>بوادر التعثّر</Th>
                    <Th>الخطر</Th>
                    <Th>متوسط الإنجاز</Th>
                    <Th>نسبة التعثّر</Th>
                    <Th>التغيّر عن الفترة السابقة</Th>
                  </tr>
                </thead>
                <tbody>
                  {d.services.map((s) => (
                    <tr key={s.service} className="border-b border-border last:border-0 hover:bg-secondary/40">
                      <td className="px-4 py-3 font-medium text-navy whitespace-nowrap">{s.service}</td>
                      <td className="px-4 py-3 tnum">{s.total.toLocaleString('ar-EG')}</td>
                      <td className="px-4 py-3 tnum text-status-done">{s.done.toLocaleString('ar-EG')}</td>
                      <td className="px-4 py-3 tnum">{s.delayed.toLocaleString('ar-EG')}</td>
                      <td className="px-4 py-3 tnum text-status-warn">{s.warn.toLocaleString('ar-EG')}</td>
                      <td className="px-4 py-3 tnum text-status-danger">{s.danger.toLocaleString('ar-EG')}</td>
                      <td className="px-4 py-3 tnum">{s.avgDays} يوم</td>
                      <td className="px-4 py-3 tnum">{s.stallRate}%</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tnum',
                            s.change <= 0 ? 'bg-status-done-soft text-status-done' : 'bg-status-danger-soft text-status-danger',
                          )}
                        >
                          {s.change <= 0 ? <TrendingDown className="size-3.5" /> : <TrendingUp className="size-3.5" />}
                          {Math.abs(s.change)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-3 rounded-xl bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">
            القيم أعلاه بيانات افتراضية للنموذج الأولي، ومترابطة داخليًا مع إجمالي معاملات الفترة
            المختارة. التغيّر بالسالب يعني تحسّنًا (انخفاض التعثّر) مقارنةً بالفترة السابقة.
          </p>
        </section>
      </div>
    </AppShell>
  )
}

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid #e2e8ec',
  fontSize: 12,
  fontFamily: 'inherit',
  boxShadow: '0 4px 16px rgba(26,41,60,0.08)',
} as const

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-bold text-navy">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-4 py-3 font-semibold whitespace-nowrap">{children}</th>
}
