'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/mirsad/app-shell'
import { JourneyTimeline } from '@/components/mirsad/journey-timeline'
import { RiskGauge } from '@/components/mirsad/risk-gauge'
import { StatusBadge } from '@/components/mirsad/status-badge'
import {
  getTransaction,
  countByIndicator,
  TRANSACTIONS,
  INDICATOR_META,
  RISK_SIGNALS,
} from '@/lib/mirsad-data'
import { cn } from '@/lib/utils'
import {
  ChevronRight,
  Building2,
  Clock,
  User,
  Lightbulb,
  AlertTriangle,
  ShieldAlert,
  MapPin,
  MessageSquareText,
  Mail,
  Smartphone,
  Check,
  X,
  BellRing,
  ListChecks,
} from 'lucide-react'

export default function EmployeeTransactionDetail() {
  const params = useParams<{ id: string }>()
  const tx = getTransaction(params.id)
  const counts = countByIndicator(TRANSACTIONS)

  const [notifyOpen, setNotifyOpen] = useState(false)
  const [channel, setChannel] = useState<'sms' | 'email' | null>(null)
  const [sent, setSent] = useState(false)

  if (!tx) {
    return (
      <AppShell role="employee" userName="م. تركي الغامدي" userMeta="موظف مختص · ديوان الإمارة">
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <p className="text-muted-foreground">لم يتم العثور على المعاملة المطلوبة.</p>
          <Link href="/employee" className="text-cyan hover:underline">
            العودة إلى المعاملات
          </Link>
        </div>
      </AppShell>
    )
  }

  const meta = INDICATOR_META[tx.indicator]
  const isRisky = tx.indicator === 'warn' || tx.indicator === 'danger'
  const reasonTitle = tx.indicator === 'danger' ? 'سبب الخطر' : 'سبب بوادر التعثّر'

  const closeNotify = () => {
    setNotifyOpen(false)
    if (!sent) setChannel(null)
  }

  return (
    <AppShell
      role="employee"
      userName="م. تركي الغامدي"
      userMeta="موظف مختص · ديوان الإمارة"
      notifCount={counts.danger + counts.warn}
    >
      <div className="flex flex-col gap-6">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/employee" className="hover:text-foreground">
            المعاملات
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground tnum">{tx.id}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold text-navy sm:text-2xl">{tx.service}</h1>
              <StatusBadge indicator={tx.indicator} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground tnum">رقم المعاملة: {tx.id}</p>
            <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2.5 text-sm sm:grid-cols-2">
              <InfoItem icon={User} label="المستفيد" value={`${tx.beneficiaryName} · ${tx.beneficiaryMaskedId}`} />
              <InfoItem icon={Clock} label="تاريخ التقديم" value={tx.submittedAt} />
              <InfoItem icon={Building2} label="الجهة الحالية" value={tx.currentEntity} />
              <InfoItem icon={MapPin} label="المرحلة الحالية" value={tx.currentStage} />
              <InfoItem icon={Clock} label="الزمن المنقضي بالمرحلة" value={tx.elapsedLabel} />
              <InfoItem icon={Clock} label="الزمن المتوقع للمرحلة" value={tx.expectedLabel} />
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
              <span>الحالة لدى المستفيد:</span>
              <span className="font-medium text-foreground">{tx.humanStatus}</span>
              <span className="mx-1">·</span>
              <span>مؤشر مِرْصاد:</span>
              <span className="font-semibold" style={{ color: meta.text }}>
                {meta.label}
              </span>
            </div>
          </div>

          {/* Risk gauge (employee only) */}
          {tx.indicator !== 'done' && (
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-secondary/40 p-4">
              <RiskGauge score={tx.riskScore} indicator={tx.indicator} />
              <span className="text-xs text-muted-foreground">درجة المخاطر {tx.riskScore} / 100</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* Journey */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <MapPin className="size-5 text-cyan" />
              <h2 className="text-lg font-bold text-navy">رحلة الطلب</h2>
            </div>
            <JourneyTimeline stages={tx.journey} />
          </section>

          {/* Intelligence sidebar */}
          <div className="flex flex-col gap-5">
            {/* How risk is derived */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <ListChecks className="size-5 text-cyan" />
                <h3 className="font-bold text-navy">إشارات احتساب المؤشر</h3>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                يحتسب مِرْصاد المؤشر من عدة إشارات مجتمعة وليس من مجرد مرور الوقت.
              </p>
              <ul className="flex flex-col gap-1.5 text-sm">
                {RISK_SIGNALS.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-foreground/90">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan" aria-hidden />
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            {/* Reasons */}
            {isRisky && tx.riskReasons && (
              <section
                className="rounded-2xl border p-5 shadow-sm"
                style={{
                  borderColor: `color-mix(in oklab, ${meta.color} 30%, white)`,
                  backgroundColor: meta.soft,
                }}
              >
                <div className="mb-3 flex items-center gap-2" style={{ color: meta.text }}>
                  {tx.indicator === 'danger' ? (
                    <ShieldAlert className="size-5" />
                  ) : (
                    <AlertTriangle className="size-5" />
                  )}
                  <h3 className="font-bold">{reasonTitle}</h3>
                </div>
                <ul className="flex flex-col gap-2 text-sm">
                  {tx.riskReasons.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-foreground/90">
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: meta.color }}
                        aria-hidden
                      />
                      {r}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Recommendation */}
            {tx.recommendation && (
              <section className="rounded-2xl border border-cyan/25 bg-accent/40 p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-cyan">
                  <Lightbulb className="size-5" />
                  <h3 className="font-bold">التوصية</h3>
                </div>
                <p className="text-sm text-foreground/90">{tx.recommendation}</p>
              </section>
            )}

            {/* Notify beneficiary */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <BellRing className="size-5 text-cyan" />
                <h3 className="font-bold text-navy">إشعار المستفيد</h3>
              </div>
              {sent ? (
                <div className="flex items-center gap-3 rounded-xl bg-status-done-soft p-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-status-done text-white">
                    <Check className="size-5" strokeWidth={3} />
                  </span>
                  <div className="text-sm">
                    <p className="font-semibold text-status-done">تم إرسال الإشعار للمستفيد</p>
                    <p className="text-xs text-muted-foreground">
                      عبر {channel === 'sms' ? 'الرسائل النصية' : 'البريد الإلكتروني'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mb-3 text-xs text-muted-foreground">
                    إرسال إشعار للمستفيد عند الحاجة إلى إجراء من طرفه.
                  </p>
                  <button
                    type="button"
                    onClick={() => setNotifyOpen(true)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan px-4 py-2.5 text-sm font-semibold text-cyan-foreground transition-colors hover:bg-cyan/90"
                  >
                    <MessageSquareText className="size-4" />
                    إشعار المستفيد
                  </button>
                </>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Notify modal */}
      {notifyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={closeNotify} aria-hidden />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-navy">إشعار المستفيد</h3>
              <button
                type="button"
                onClick={closeNotify}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="إغلاق"
              >
                <X className="size-5" />
              </button>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              اختر قناة الإرسال المناسبة لإشعار المستفيد {tx.beneficiaryName}.
            </p>
            <div className="flex flex-col gap-2.5">
              <ChannelOption
                icon={Smartphone}
                title="رسالة نصية (SMS)"
                desc="إشعار مباشر إلى جوال المستفيد"
                selected={channel === 'sms'}
                onClick={() => setChannel('sms')}
              />
              <ChannelOption
                icon={Mail}
                title="البريد الإلكتروني"
                desc="إشعار تفصيلي إلى بريد المستفيد"
                selected={channel === 'email'}
                onClick={() => setChannel('email')}
              />
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                disabled={!channel}
                onClick={() => {
                  setSent(true)
                  setNotifyOpen(false)
                }}
                className="flex-1 rounded-xl bg-cyan px-4 py-2.5 text-sm font-semibold text-cyan-foreground transition-colors hover:bg-cyan/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                إرسال الإشعار
              </button>
              <button
                type="button"
                onClick={closeNotify}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="size-4 shrink-0" />
      <span className="shrink-0">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}

function ChannelOption({
  icon: Icon,
  title,
  desc,
  selected,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-xl border p-3 text-right transition-colors',
        selected ? 'border-cyan bg-accent/60 ring-2 ring-cyan/20' : 'border-border hover:border-cyan/40',
      )}
    >
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-lg',
          selected ? 'bg-cyan text-white' : 'bg-muted text-muted-foreground',
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-navy">{title}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
      <span
        className={cn(
          'flex size-5 items-center justify-center rounded-full border',
          selected ? 'border-cyan bg-cyan text-white' : 'border-border',
        )}
      >
        {selected && <Check className="size-3.5" strokeWidth={3} />}
      </span>
    </button>
  )
}
