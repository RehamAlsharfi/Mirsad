'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/mirsad/app-shell'
import { ProgressBar } from '@/components/mirsad/progress-bar'
import {
  getBeneficiaryTransactions,
  BENEFICIARY_NAME,
  BENEFICIARY_MASKED_ID,
  type Transaction,
  type HumanStatus,
} from '@/lib/mirsad-data'
import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  Info,
  FileWarning,
  CheckCircle2,
  Clock,
  Bell,
  MapPin,
  ChevronLeft,
  CircleDot,
} from 'lucide-react'

const HUMAN_STATUS_STYLE: Record<string, { color: string; soft: string }> = {
  'تسير بشكل طبيعي': { color: 'var(--status-normal)', soft: 'var(--status-normal-soft)' },
  'قيد المعالجة': { color: 'var(--status-normal)', soft: 'var(--status-normal-soft)' },
  'قد تستغرق وقتًا أطول من المتوقع': { color: 'var(--status-warn)', soft: 'var(--status-warn-soft)' },
  'بانتظار استكمال مستند': { color: 'var(--status-warn)', soft: 'var(--status-warn-soft)' },
  'مكتملة': { color: 'var(--status-done)', soft: 'var(--status-done-soft)' },
}

function HumanStatusPill({ status }: { status: HumanStatus }) {
  const s = HUMAN_STATUS_STYLE[status] ?? HUMAN_STATUS_STYLE['قيد المعالجة']
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: s.soft, color: s.color }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: s.color }} aria-hidden />
      {status}
    </span>
  )
}

export default function BeneficiaryDashboard() {
  const txs = getBeneficiaryTransactions()
  const active = txs.filter((t) => t.humanStatus !== 'مكتملة')
  const completed = txs.filter((t) => t.humanStatus === 'مكتملة')
  const alerts = txs.filter((t) => t.beneficiaryAlert || t.missingDocument)

  return (
    <AppShell
      role="beneficiary"
      userName={BENEFICIARY_NAME}
      userMeta={`مستفيد · ${BENEFICIARY_MASKED_ID}`}
      notifCount={alerts.length}
    >
      <div className="flex flex-col gap-8">
        {/* Welcome */}
        <section id="account">
          <p className="text-sm text-muted-foreground">مرحبًا بك في مِرْصاد</p>
          <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">{BENEFICIARY_NAME}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            تابع رحلة طلباتك وتعرّف على حالتها بشكل استباقي. نرصد مسار معاملاتك ونتابع مستجداتها
            لإشعارك بما يلزم.
          </p>
        </section>

        {/* Summary */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryTile label="إجمالي معاملاتي" value={txs.length} icon={CircleDot} accent="var(--navy)" />
          <SummaryTile label="قيد المتابعة" value={active.length} icon={Clock} accent="var(--cyan)" />
          <SummaryTile label="مكتملة" value={completed.length} icon={CheckCircle2} accent="var(--status-done)" />
          <SummaryTile label="تحتاج انتباهك" value={alerts.length} icon={Bell} accent="var(--status-warn)" />
        </section>

        {/* Alerts */}
        <section id="alerts" className="scroll-mt-20">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-navy">
            <Bell className="size-5 text-cyan" />
            تنبيهات تحتاج انتباهك
          </h2>
          {alerts.length === 0 ? (
            <EmptyState text="لا توجد تنبيهات تحتاج إلى إجراء حاليًا" />
          ) : (
            <div className="flex flex-col gap-3">
              {alerts.map((t) => (
                <BeneficiaryAlert key={t.id} tx={t} />
              ))}
            </div>
          )}
        </section>

        {/* Active transactions */}
        <section id="transactions" className="scroll-mt-20">
          <h2 className="mb-3 text-lg font-bold text-navy">معاملاتي</h2>
          {txs.length === 0 ? (
            <EmptyState text="لا توجد معاملات حالية" />
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {txs.map((t) => (
                <TransactionCard key={t.id} tx={t} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  )
}

function SummaryTile({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  accent: string
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-4 shadow-sm">
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
    </div>
  )
}

function BeneficiaryAlert({ tx }: { tx: Transaction }) {
  const isDoc = Boolean(tx.missingDocument)
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center',
        isDoc ? 'border-status-warn/30 bg-status-warn-soft' : 'border-cyan/25 bg-accent/50',
      )}
    >
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-xl',
          isDoc ? 'bg-status-warn/15 text-status-warn' : 'bg-cyan/15 text-cyan',
        )}
      >
        {isDoc ? <FileWarning className="size-5" /> : <Info className="size-5" />}
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold" style={{ color: isDoc ? 'var(--status-warn)' : 'var(--cyan)' }}>
            {isDoc ? 'مطلوب إجراء' : 'تنبيه استباقي'}
          </span>
          <span className="text-xs text-muted-foreground">· {tx.service} — {tx.id}</span>
        </div>
        <p className="mt-1 text-sm text-foreground/90">
          {isDoc
            ? `لاستكمال رحلة طلبك، يرجى إرفاق المستند التالي: ${tx.missingDocument?.name}.`
            : tx.beneficiaryAlert}
        </p>
      </div>
      <Link
        href={`/beneficiary/transactions/${tx.id}`}
        className={cn(
          'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold',
          isDoc
            ? 'bg-status-warn text-white hover:bg-status-warn/90'
            : 'bg-cyan text-cyan-foreground hover:bg-cyan/90',
        )}
      >
        {isDoc ? 'إرفاق المستند' : 'متابعة الطلب'}
        <ArrowLeft className="size-4" />
      </Link>
    </div>
  )
}

function TransactionCard({ tx }: { tx: Transaction }) {
  return (
    <Link
      href={`/beneficiary/transactions/${tx.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-cyan/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-navy">{tx.service}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground tnum">{tx.id}</p>
        </div>
        <HumanStatusPill status={tx.humanStatus} />
      </div>

      <div className="grid grid-cols-2 gap-y-2 text-xs">
        <Meta label="تاريخ التقديم" value={tx.submittedAt} />
        <Meta label="آخر تحديث" value={tx.lastUpdate} />
        <div className="col-span-2 flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span>المرحلة الحالية: </span>
          <span className="font-medium text-foreground">{tx.currentStage}</span>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>تقدّم رحلة الطلب</span>
          <span className="tnum">{tx.progress}%</span>
        </div>
        <ProgressBar
          value={tx.progress}
          color={tx.humanStatus === 'مكتملة' ? 'var(--status-done)' : 'var(--cyan)'}
        />
      </div>

      <span className="inline-flex items-center gap-1 self-start text-sm font-semibold text-cyan">
        عرض رحلة الطلب
        <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
      </span>
    </Link>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground tnum">{value}</span>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-10 text-center">
      <CheckCircle2 className="size-8 text-muted-foreground/50" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
