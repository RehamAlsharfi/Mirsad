'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/mirsad/app-shell'
import { JourneyTimeline } from '@/components/mirsad/journey-timeline'
import { ProgressBar } from '@/components/mirsad/progress-bar'
import {
  getTransaction,
  getBeneficiaryTransactions,
  BENEFICIARY_NAME,
  BENEFICIARY_MASKED_ID,
} from '@/lib/mirsad-data'
import { cn } from '@/lib/utils'
import {
  ChevronRight,
  Info,
  FileWarning,
  UploadCloud,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  MessageSquareText,
} from 'lucide-react'

export default function BeneficiaryTransactionDetail() {
  const params = useParams<{ id: string }>()
  const tx = getTransaction(params.id)
  const [attached, setAttached] = useState(false)

  const alerts = getBeneficiaryTransactions().filter((t) => t.beneficiaryAlert || t.missingDocument)

  if (!tx) {
    return (
      <AppShell role="beneficiary" userName={BENEFICIARY_NAME} userMeta={`مستفيد · ${BENEFICIARY_MASKED_ID}`}>
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <p className="text-muted-foreground">لم يتم العثور على المعاملة المطلوبة.</p>
          <Link href="/beneficiary" className="text-cyan hover:underline">
            العودة إلى معاملاتي
          </Link>
        </div>
      </AppShell>
    )
  }

  const isDone = tx.humanStatus === 'مكتملة'

  return (
    <AppShell
      role="beneficiary"
      userName={BENEFICIARY_NAME}
      userMeta={`مستفيد · ${BENEFICIARY_MASKED_ID}`}
      notifCount={alerts.length}
    >
      <div className="flex flex-col gap-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/beneficiary" className="hover:text-foreground">
            معاملاتي
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground">{tx.service}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-navy sm:text-2xl">{tx.service}</h1>
            <p className="mt-1 text-sm text-muted-foreground tnum">رقم المعاملة: {tx.id}</p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <InfoItem icon={Clock} label="تاريخ التقديم" value={tx.submittedAt} />
              <InfoItem icon={Clock} label="آخر تحديث" value={tx.lastUpdate} />
              <InfoItem icon={Building2} label="الجهة الحالية" value={tx.currentEntity} />
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="text-xs text-muted-foreground">الحالة</span>
            <span
              className="rounded-full px-3 py-1.5 text-sm font-semibold"
              style={{
                backgroundColor: isDone ? 'var(--status-done-soft)' : 'var(--accent)',
                color: isDone ? 'var(--status-done)' : 'var(--accent-foreground)',
              }}
            >
              {tx.humanStatus}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-navy">تقدّم رحلة الطلب</span>
            <span className="tnum text-muted-foreground">{tx.progress}%</span>
          </div>
          <ProgressBar value={tx.progress} color={isDone ? 'var(--status-done)' : 'var(--cyan)'} />
        </div>

        {/* Proactive alert */}
        {tx.beneficiaryAlert && !tx.missingDocument && (
          <div className="flex gap-3 rounded-2xl border border-cyan/25 bg-accent/50 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cyan/15 text-cyan">
              <Info className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-cyan">تنبيه استباقي</p>
              <p className="mt-1 text-sm text-foreground/90">{tx.beneficiaryAlert}</p>
            </div>
          </div>
        )}

        {/* Missing document */}
        {tx.missingDocument && (
          <div className="rounded-2xl border border-status-warn/30 bg-status-warn-soft p-5">
            {!attached ? (
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-status-warn/15 text-status-warn">
                    <FileWarning className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-status-warn">مطلوب إجراء لاستكمال رحلة طلبك</p>
                    <p className="mt-1 text-sm text-foreground/90">
                      لاستكمال رحلة طلبك، يرجى إرفاق المستند التالي:
                    </p>
                    <p className="mt-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-navy">
                      {tx.missingDocument.name}
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground">{tx.missingDocument.note}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttached(true)}
                  className="inline-flex w-fit items-center gap-2 rounded-xl bg-status-warn px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-status-warn/90"
                >
                  <UploadCloud className="size-4" />
                  إرفاق المستند
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-status-done-soft text-status-done">
                  <CheckCircle2 className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-status-done">تم إرفاق المستند بنجاح</p>
                  <p className="mt-1 text-sm text-foreground/90">
                    سيتم متابعة معالجة طلبك، وستصلك الإشعارات عند تحديث حالته.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notification status */}
        {tx.beneficiaryAlert && (
          <div className="flex items-center gap-2 rounded-xl bg-secondary/60 px-4 py-2.5 text-xs text-muted-foreground">
            <MessageSquareText className="size-4 text-cyan" />
            تم إرسال إشعار إلى المستفيد عبر الرسائل النصية والبريد الإلكتروني.
          </div>
        )}

        {/* Journey */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <MapPin className="size-5 text-cyan" />
            <h2 className="text-lg font-bold text-navy">رحلة الطلب</h2>
          </div>
          <JourneyTimeline stages={tx.journey} />
        </section>
      </div>
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
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <Icon className="size-4" />
      <span>{label}:</span>
      <span className={cn('font-medium text-foreground')}>{value}</span>
    </span>
  )
}
