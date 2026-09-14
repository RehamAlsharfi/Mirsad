import Link from 'next/link'
import { MirsadMark, MirsadWordmark } from '@/components/mirsad/logo'
import {
  ArrowLeft,
  ShieldCheck,
  Building2,
  HeartPulse,
  Landmark,
  Users,
  Briefcase,
  FileText,
  Radar,
  Bell,
  Route,
} from 'lucide-react'

const SERVICES = [
  { title: 'طلب علاج خارجي', desc: 'خدمة صحية', icon: HeartPulse },
  { title: 'طلب متعلق بالعقار', desc: 'خدمة عقارية', icon: Building2 },
  { title: 'طلب تكوين لجنة', desc: 'خدمة إدارية', icon: Users },
  { title: 'طلب استثمار', desc: 'خدمة استثمارية', icon: Briefcase },
  { title: 'طلب دعم خيري', desc: 'خدمة اجتماعية', icon: Landmark },
  { title: 'طلب إصدار صك', desc: 'خدمة عدلية', icon: FileText },
]

export default function PortalLanding() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Government top strip */}
      <div className="bg-navy text-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[11px] sm:text-xs">
          <span>المملكة العربية السعودية — إمارة منطقة الباحة</span>
          <span className="hidden sm:inline">البوابة الإلكترونية</span>
        </div>
      </div>

      {/* Portal header */}
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-navy text-white">
              <Landmark className="size-5" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold text-navy">إمارة منطقة الباحة</span>
              <span className="text-[11px] text-muted-foreground">البوابة الإلكترونية للخدمات الحكومية</span>
            </div>
          </div>
          <nav className="hidden items-center gap-1 text-sm md:flex">
            <span className="rounded-lg bg-accent px-3 py-2 font-medium text-accent-foreground">الرئيسية</span>
            <span className="px-3 py-2 text-muted-foreground">الخدمات الإلكترونية</span>
            <span className="px-3 py-2 text-muted-foreground">عن الإمارة</span>
            <span className="px-3 py-2 text-muted-foreground">تواصل معنا</span>
          </nav>
          <Link
            href="/login"
            className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-cyan-foreground transition-colors hover:bg-cyan/90"
          >
            تسجيل الدخول
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src="/albaha-hero.png"
          alt="مرتفعات منطقة الباحة الخضراء"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-navy/90 via-navy/80 to-navy/55" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-5 px-4 py-16 sm:py-20">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/20">
            <ShieldCheck className="size-3.5" />
            منصة حكومية موثوقة
          </span>
          <h1 className="max-w-2xl text-3xl font-bold leading-snug text-white sm:text-4xl">
            الخدمات الإلكترونية لإمارة منطقة الباحة
          </h1>
          <p className="max-w-xl text-white/85">
            قدّم معاملاتك الحكومية وتابع حالتها إلكترونيًا في بيئة رقمية آمنة وموثوقة.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan px-5 py-3 text-sm font-semibold text-cyan-foreground transition-colors hover:bg-cyan/90"
            >
              الدخول إلى الخدمات
              <ArrowLeft className="size-4" />
            </Link>
            <a
              href="#mirsad"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/25 transition-colors hover:bg-white/15"
            >
              تعرّف على مِرْصاد
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12">
        {/* E-services */}
        <section aria-labelledby="services-title">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 id="services-title" className="text-xl font-bold text-navy">
                الخدمات الإلكترونية
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                اختر الخدمة لبدء تقديم الطلب إلكترونيًا
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => {
              const Icon = s.icon
              return (
                <Link
                  key={s.title}
                  href="/login"
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-cyan/50 hover:shadow-md"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Icon className="size-6" />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-navy">{s.title}</h3>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <ArrowLeft className="size-4 text-muted-foreground transition-transform group-hover:-translate-x-1 group-hover:text-cyan" />
                </Link>
              )
            })}
          </div>
        </section>

        {/* Mirsad entry point */}
        <section id="mirsad" className="mt-14 scroll-mt-20">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
              <div className="flex flex-col gap-5 p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <MirsadWordmark />
                  <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
                    خدمة ذكية ضمن البوابة
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-navy">
                  تابع رحلة طلبك وتعرّف على حالته بشكل استباقي
                </h2>
                <p className="text-muted-foreground">
                  مِرْصاد طبقة ذكية تعمل خلف الخدمات الإلكترونية لرصد مسار معاملتك، وكشف بوادر
                  التعثّر مبكرًا، وتمكين التدخّل الاستباقي قبل تفاقم المشكلة — من رصد بوادر التعثّر إلى
                  التدخّل الاستباقي.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { icon: Route, t: 'رحلة الطلب', d: 'تتبّع مراحل معاملتك' },
                    { icon: Radar, t: 'رصد استباقي', d: 'كشف بوادر التعثّر مبكرًا' },
                    { icon: Bell, t: 'تنبيهات', d: 'إشعارك بما يلزم' },
                  ].map((f) => {
                    const Icon = f.icon
                    return (
                      <div key={f.t} className="rounded-xl bg-secondary/60 p-3">
                        <Icon className="size-5 text-cyan" />
                        <p className="mt-2 text-sm font-semibold text-navy">{f.t}</p>
                        <p className="text-xs text-muted-foreground">{f.d}</p>
                      </div>
                    )
                  })}
                </div>
                <Link
                  href="/login"
                  className="inline-flex w-fit items-center gap-2 rounded-xl bg-cyan px-5 py-3 text-sm font-semibold text-cyan-foreground transition-colors hover:bg-cyan/90"
                >
                  الدخول إلى مِرْصاد
                  <ArrowLeft className="size-4" />
                </Link>
              </div>
              <div className="relative hidden items-center justify-center bg-navy p-8 md:flex">
                <div className="absolute inset-0 opacity-15 [background:radial-gradient(circle_at_50%_50%,var(--cyan),transparent_60%)]" />
                <div className="relative flex flex-col items-center gap-4 text-center">
                  <span className="flex size-24 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                    <MirsadMark className="h-14 w-14" />
                  </span>
                  <p className="max-w-[16rem] text-sm text-white/80">
                    مِرْصاد يحوّل متابعة المعاملات من رصدٍ بعد التعثّر إلى تدخّلٍ استباقي قبله.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row">
          <span>© إمارة منطقة الباحة — البوابة الإلكترونية</span>
          <span>نموذج أولي تجريبي لعرض مفهوم مِرْصاد · بيانات افتراضية</span>
        </div>
      </footer>
    </div>
  )
}
