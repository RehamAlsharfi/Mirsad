'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MirsadWordmark } from '@/components/mirsad/logo'
import { cn } from '@/lib/utils'
import {
  User,
  Briefcase,
  ShieldCheck,
  Smartphone,
  Check,
  Loader2,
  ArrowLeft,
  Landmark,
} from 'lucide-react'

type Role = 'beneficiary' | 'employee'
type Step = 'role' | 'nafath' | 'done'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('role')
  const [role, setRole] = useState<Role | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [nafathNumber] = useState(() => Math.floor(10 + Math.random() * 89))

  const startNafath = (r: Role) => {
    setRole(r)
    setStep('nafath')
  }

  const confirmNafath = () => {
    setVerifying(true)
  }

  // Simulated verification then success. Purely a prototype representation —
  // no real credentials, OTPs, or national IDs are ever requested.
  useEffect(() => {
    if (!verifying) return
    const t = setTimeout(() => {
      setVerifying(false)
      setStep('done')
    }, 2200)
    return () => clearTimeout(t)
  }, [verifying])

  useEffect(() => {
    if (step !== 'done' || !role) return
    const t = setTimeout(() => {
      router.push(role === 'beneficiary' ? '/beneficiary' : '/employee')
    }, 1400)
    return () => clearTimeout(t)
  }, [step, role, router])

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand / context side */}
      <div className="relative hidden overflow-hidden bg-navy lg:block">
        <img
          src="/albaha-hero.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/60" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <div className="flex items-center gap-3 text-white">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <Landmark className="size-5" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-bold">إمارة منطقة الباحة</span>
              <span className="text-xs text-white/70">البوابة الإلكترونية</span>
            </div>
          </div>
          <div className="max-w-md">
            <MirsadWordmark onDark showTagline />
            <p className="mt-6 text-lg leading-relaxed text-white/85">
              الدخول إلى الخدمات الإلكترونية للإمارة عبر النفاذ الوطني الموحد، ومتابعة رحلة معاملاتك
              بشكل استباقي مع مِرْصاد.
            </p>
          </div>
          <p className="text-xs text-white/60">
            نموذج أولي تجريبي — محاكاة آمنة لتجربة الدخول دون بيانات دخول حقيقية.
          </p>
        </div>
      </div>

      {/* Interaction side */}
      <div className="flex flex-col bg-background">
        <div className="flex items-center justify-between border-b border-border px-6 py-4 lg:hidden">
          <MirsadWordmark />
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            العودة
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md">
            {step === 'role' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-2xl font-bold text-navy">تسجيل الدخول</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    اختر نوع المستخدم للمتابعة عبر النفاذ الوطني الموحد
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <RoleCard
                    icon={User}
                    title="مستفيد"
                    desc="متابعة معاملاتي ورحلة طلباتي"
                    onClick={() => startNafath('beneficiary')}
                  />
                  <RoleCard
                    icon={Briefcase}
                    title="موظف مختص"
                    desc="متابعة المعاملات وإدارة التدخّل الاستباقي"
                    onClick={() => startNafath('employee')}
                  />
                </div>

                <p className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2.5 text-xs text-muted-foreground">
                  <ShieldCheck className="size-4 shrink-0 text-cyan" />
                  بيئة محاكاة آمنة — لا يتم طلب أي كلمات مرور أو رموز تحقق أو أرقام هوية حقيقية.
                </p>

                <Link
                  href="/"
                  className="text-center text-sm text-muted-foreground hover:text-foreground"
                >
                  العودة إلى البوابة
                </Link>
              </div>
            )}

            {step === 'nafath' && (
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="flex items-center gap-2 rounded-full bg-[#0a7d3c]/10 px-3 py-1.5 text-sm font-semibold text-[#0a7d3c]">
                  <ShieldCheck className="size-4" />
                  النفاذ الوطني الموحد
                </div>
                <h1 className="text-xl font-bold text-navy">تسجيل الدخول عبر النفاذ الوطني الموحد</h1>

                {!verifying ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      لإتمام المحاكاة، اختر الرقم التالي في تطبيق النفاذ على جهازك
                    </p>
                    <div className="flex size-28 items-center justify-center rounded-3xl bg-navy text-5xl font-bold text-white tnum">
                      {nafathNumber}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Smartphone className="size-4" />
                      محاكاة — لا حاجة لتطبيق حقيقي
                    </div>
                    <button
                      type="button"
                      onClick={confirmNafath}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan px-5 py-3 text-sm font-semibold text-cyan-foreground transition-colors hover:bg-cyan/90"
                    >
                      تأكيد المحاكاة
                      <ArrowLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('role')}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      رجوع
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-6">
                    <Loader2 className="size-10 animate-spin text-cyan" />
                    <p className="font-medium text-navy">جارٍ التحقق من الهوية…</p>
                    <p className="text-sm text-muted-foreground">يتم التحقق عبر النفاذ الوطني الموحد</p>
                  </div>
                )}
              </div>
            )}

            {step === 'done' && (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-status-done-soft text-status-done">
                  <Check className="size-8" strokeWidth={3} />
                </span>
                <h1 className="text-xl font-bold text-navy">تم التحقق من الهوية بنجاح</h1>
                <p className="text-sm text-muted-foreground">
                  المستخدم: {role === 'beneficiary' ? 'مستفيد' : 'موظف مختص'} — جارٍ الدخول إلى مِرْصاد…
                </p>
                <Loader2 className="size-6 animate-spin text-cyan" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function RoleCard({
  icon: Icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-right shadow-sm transition-all',
        'hover:border-cyan/60 hover:shadow-md',
      )}
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-cyan group-hover:text-white">
        <Icon className="size-6" />
      </span>
      <span className="flex-1">
        <span className="block font-semibold text-navy">{title}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
      <ArrowLeft className="size-4 text-muted-foreground transition-transform group-hover:-translate-x-1 group-hover:text-cyan" />
    </button>
  )
}
