'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/mirsad/app-shell'
import { StatusBadge } from '@/components/mirsad/status-badge'
import {
  TRANSACTIONS,
  countByIndicator,
  INDICATOR_META,
  type RiskIndicator,
  type Transaction,
} from '@/lib/mirsad-data'
import { cn } from '@/lib/utils'
import {
  Layers,
  CircleDot,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Search,
  ChevronLeft,
  FileWarning,
  BarChart3,
  ArrowLeft,
} from 'lucide-react'

type IndicatorFilter = 'all' | RiskIndicator | 'missingDoc'

const SERVICES = Array.from(new Set(TRANSACTIONS.map((t) => t.service)))
const ENTITIES = Array.from(new Set(TRANSACTIONS.map((t) => t.currentEntity)))

export default function EmployeeDashboard() {
  const [filter, setFilter] = useState<IndicatorFilter>('all')
  const [service, setService] = useState<string>('all')
  const [entity, setEntity] = useState<string>('all')
  const [query, setQuery] = useState('')

  const counts = countByIndicator(TRANSACTIONS)
  const missingDocCount = TRANSACTIONS.filter((t) => t.missingDocument).length

  const filtered = useMemo(() => {
    return TRANSACTIONS.filter((t) => {
      if (filter === 'missingDoc' && !t.missingDocument) return false
      if (filter !== 'all' && filter !== 'missingDoc' && t.indicator !== filter) return false
      if (service !== 'all' && t.service !== service) return false
      if (entity !== 'all' && t.currentEntity !== entity) return false
      if (query.trim()) {
        const q = query.trim()
        const hay = `${t.id} ${t.service} ${t.beneficiaryName}`
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [filter, service, entity, query])

  const scrollToTable = () => {
    document.getElementById('transactions')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <AppShell
      role="employee"
      userName="م. تركي الغامدي"
      userMeta="موظف مختص · ديوان الإمارة"
      notifCount={counts.danger + counts.warn}
    >
      <div className="flex flex-col gap-8">
        {/* Heading */}
        <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">لوحة الموظف المختص</p>
            <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">
              ما الذي يحتاج إلى انتباهك الآن؟
            </h1>
          </div>
          <Link
            href="/employee/analytics"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-navy shadow-sm transition-colors hover:border-cyan/50"
          >
            <BarChart3 className="size-4 text-cyan" />
            التحليل والتحسين
          </Link>
        </section>

        {/* KPI row */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatTile label="إجمالي المعاملات" value={counts.total} icon={Layers} accent="var(--navy)" onClick={() => { setFilter('all'); scrollToTable() }} active={filter === 'all'} />
          <StatTile label="المسار الطبيعي" value={counts.normal} icon={CircleDot} accent={INDICATOR_META.normal.color} onClick={() => { setFilter('normal'); scrollToTable() }} active={filter === 'normal'} />
          <StatTile label="مكتملة" value={counts.done} icon={CheckCircle2} accent={INDICATOR_META.done.color} onClick={() => { setFilter('done'); scrollToTable() }} active={filter === 'done'} />
          <StatTile label="بوادر تعثّر" value={counts.warn} icon={AlertTriangle} accent={INDICATOR_META.warn.color} onClick={() => { setFilter('warn'); scrollToTable() }} active={filter === 'warn'} />
          <StatTile label="خطر — تدخّل عاجل" value={counts.danger} icon={ShieldAlert} accent={INDICATOR_META.danger.color} onClick={() => { setFilter('danger'); scrollToTable() }} active={filter === 'danger'} />
        </section>

        {/* Alert center */}
        <section id="alerts" className="scroll-mt-20">
          <h2 className="mb-3 text-lg font-bold text-navy">مركز التنبيهات</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <AlertCard
              count={counts.danger}
              label="معاملات تحتاج إلى تدخّل عاجل"
              icon={ShieldAlert}
              color="var(--status-danger)"
              soft="var(--status-danger-soft)"
              onClick={() => { setFilter('danger'); scrollToTable() }}
            />
            <AlertCard
              count={counts.warn}
              label="معاملات ظهرت عليها بوادر تعثّر"
              icon={AlertTriangle}
              color="var(--status-warn)"
              soft="var(--status-warn-soft)"
              onClick={() => { setFilter('warn'); scrollToTable() }}
            />
            <AlertCard
              count={missingDocCount}
              label="معاملات بانتظار استكمال مستند من المستفيد"
              icon={FileWarning}
              color="var(--cyan)"
              soft="var(--accent)"
              onClick={() => { setFilter('missingDoc'); scrollToTable() }}
            />
          </div>
        </section>

        {/* Transactions table */}
        <section id="transactions" className="scroll-mt-20">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-navy">المعاملات</h2>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="بحث برقم المعاملة أو الخدمة أو المستفيد"
                className="w-full rounded-xl border border-border bg-card py-2.5 pr-9 pl-3 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <FilterChip label="جميع المعاملات" active={filter === 'all'} onClick={() => setFilter('all')} />
              <FilterChip label="المسار الطبيعي" active={filter === 'normal'} onClick={() => setFilter('normal')} dot={INDICATOR_META.normal.color} />
              <FilterChip label="مكتملة" active={filter === 'done'} onClick={() => setFilter('done')} dot={INDICATOR_META.done.color} />
              <FilterChip label="بوادر تعثّر" active={filter === 'warn'} onClick={() => setFilter('warn')} dot={INDICATOR_META.warn.color} />
              <FilterChip label="خطر" active={filter === 'danger'} onClick={() => setFilter('danger')} dot={INDICATOR_META.danger.color} />
              <FilterChip label="بانتظار مستند" active={filter === 'missingDoc'} onClick={() => setFilter('missingDoc')} dot="var(--cyan)" />
            </div>
            <div className="flex flex-wrap gap-2">
              <SelectFilter label="نوع الخدمة" value={service} onChange={setService} options={SERVICES} allLabel="كل الخدمات" />
              <SelectFilter label="الجهة" value={entity} onChange={setEntity} options={ENTITIES} allLabel="كل الجهات" />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-right text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 text-xs text-muted-foreground">
                    <Th>رقم المعاملة</Th>
                    <Th>نوع الخدمة</Th>
                    <Th>المستفيد</Th>
                    <Th>الجهة الحالية</Th>
                    <Th>المرحلة</Th>
                    <Th>الزمن المنقضي</Th>
                    <Th>الحالة</Th>
                    <Th>درجة المخاطر</Th>
                    <Th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                        لا توجد معاملات مطابقة للتصفية الحالية
                      </td>
                    </tr>
                  ) : (
                    filtered.map((t) => <Row key={t.id} tx={t} />)
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground tnum">
            عرض {filtered.length} من {TRANSACTIONS.length} معاملة
          </p>
        </section>
      </div>
    </AppShell>
  )
}

function StatTile({
  label,
  value,
  icon: Icon,
  accent,
  onClick,
  active,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  accent: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col gap-1.5 rounded-2xl border bg-card p-4 text-right shadow-sm transition-all hover:shadow-md',
        active ? 'border-cyan ring-2 ring-cyan/20' : 'border-border hover:border-cyan/40',
      )}
    >
      <span
        className="flex size-9 items-center justify-center rounded-lg"
        style={{ backgroundColor: `color-mix(in oklab, ${accent} 12%, white)`, color: accent }}
      >
        <Icon className="size-4.5" />
      </span>
      <span className="mt-1 text-2xl font-bold tnum" style={{ color: accent }}>
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </button>
  )
}

function AlertCard({
  count,
  label,
  icon: Icon,
  color,
  soft,
  onClick,
}: {
  count: number
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  soft: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-right shadow-sm transition-all hover:shadow-md"
      style={{ borderColor: count > 0 ? `color-mix(in oklab, ${color} 30%, white)` : undefined }}
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: soft, color }}>
        <Icon className="size-6" />
      </span>
      <div className="flex-1">
        <span className="block text-2xl font-bold tnum" style={{ color }}>
          {count}
        </span>
        <span className="block text-xs leading-snug text-muted-foreground">{label}</span>
      </div>
      <ChevronLeft className="size-4 text-muted-foreground transition-transform group-hover:-translate-x-1" />
    </button>
  )
}

function FilterChip({
  label,
  active,
  onClick,
  dot,
}: {
  label: string
  active: boolean
  onClick: () => void
  dot?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
        active
          ? 'border-navy bg-navy text-white'
          : 'border-border bg-card text-muted-foreground hover:border-cyan/40 hover:text-foreground',
      )}
    >
      {dot && <span className="size-1.5 rounded-full" style={{ backgroundColor: active ? '#fff' : dot }} aria-hidden />}
      {label}
    </button>
  )
}

function SelectFilter({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  allLabel: string
}) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-xs">
      <span className="text-muted-foreground">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-medium text-foreground outline-none"
      >
        <option value="all">{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-4 py-3 font-semibold whitespace-nowrap">{children}</th>
}

function Row({ tx }: { tx: Transaction }) {
  const meta = INDICATOR_META[tx.indicator]
  return (
    <tr className="border-b border-border last:border-0 transition-colors hover:bg-secondary/40">
      <td className="px-4 py-3 font-medium text-navy tnum whitespace-nowrap">{tx.id}</td>
      <td className="px-4 py-3 whitespace-nowrap">{tx.service}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{tx.beneficiaryName}</span>
          <span className="text-xs text-muted-foreground tnum">{tx.beneficiaryMaskedId}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">{tx.currentEntity}</td>
      <td className="px-4 py-3 text-xs whitespace-nowrap">{tx.currentStage}</td>
      <td className="px-4 py-3 tnum whitespace-nowrap">
        <span className={cn(tx.indicator === 'danger' && 'font-semibold text-status-danger')}>
          {tx.elapsedLabel}
        </span>
        {tx.elapsedLabel !== '—' && (
          <span className="text-xs text-muted-foreground"> / {tx.expectedLabel}</span>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge indicator={tx.indicator} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {tx.indicator === 'done' ? (
          <span className="text-xs text-muted-foreground">—</span>
        ) : (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{ width: `${tx.riskScore}%`, backgroundColor: meta.color }}
              />
            </div>
            <span className="text-xs font-bold tnum" style={{ color: meta.text }}>
              {tx.riskScore}%
            </span>
          </div>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <Link
          href={`/employee/transactions/${tx.id}`}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-cyan hover:bg-accent"
        >
          التفاصيل
          <ArrowLeft className="size-3.5" />
        </Link>
      </td>
    </tr>
  )
}
