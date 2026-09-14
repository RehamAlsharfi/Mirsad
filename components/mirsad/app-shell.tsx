'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MirsadWordmark } from './logo'
import {
  Bell,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Home,
  FileText,
  BarChart3,
  Settings,
  User,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const BENEFICIARY_NAV: NavItem[] = [
  { label: 'الرئيسية', href: '/beneficiary', icon: Home },
  { label: 'معاملاتي', href: '/beneficiary#transactions', icon: FileText },
  { label: 'الإشعارات', href: '/beneficiary#alerts', icon: Bell },
  { label: 'حسابي', href: '/beneficiary#account', icon: User },
]

const EMPLOYEE_NAV: NavItem[] = [
  { label: 'الرئيسية', href: '/employee', icon: Home },
  { label: 'المعاملات', href: '/employee#transactions', icon: FileText },
  { label: 'التنبيهات', href: '/employee#alerts', icon: Bell },
  { label: 'التحليل والتحسين', href: '/employee/analytics', icon: BarChart3 },
  { label: 'الإعدادات', href: '/employee#settings', icon: Settings },
]

export function AppShell({
  role,
  userName,
  userMeta,
  notifCount = 0,
  children,
}: {
  role: 'beneficiary' | 'employee'
  userName: string
  userMeta: string
  notifCount?: number
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = role === 'beneficiary' ? BENEFICIARY_NAV : EMPLOYEE_NAV
  const homeHref = role === 'beneficiary' ? '/beneficiary' : '/employee'

  const isActive = (href: string) => {
    const base = href.split('#')[0]
    if (base === homeHref) return pathname === base
    return pathname.startsWith(base)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Government context strip */}
      <div className="bg-navy text-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[11px] sm:text-xs">
          <span>المملكة العربية السعودية — إمارة منطقة الباحة</span>
          <span className="hidden sm:inline">البوابة الإلكترونية · الخدمات الحكومية</span>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link href={homeHref} aria-label="مِرْصاد — الرئيسية">
            <MirsadWordmark showTagline />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <Link
              href={`${homeHref}#alerts`}
              className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="الإشعارات"
            >
              <Bell className="size-5" />
              {notifCount > 0 && (
                <span className="absolute top-0.5 left-0.5 flex size-4 items-center justify-center rounded-full bg-status-danger text-[10px] font-bold text-white tnum">
                  {notifCount}
                </span>
              )}
            </Link>

            <div className="hidden items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 sm:flex">
              <span className="flex size-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                {userName.trim().charAt(0)}
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold text-navy">{userName}</span>
                <span className="text-[10px] text-muted-foreground">{userMeta}</span>
              </div>
            </div>

            <Link
              href="/"
              className="hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:inline-flex"
              aria-label="العودة إلى البوابة الحكومية"
              title="العودة إلى البوابة الحكومية"
            >
              <ExternalLink className="size-5" />
            </Link>
            <Link
              href="/"
              className="rounded-lg p-2 text-muted-foreground hover:bg-status-danger-soft hover:text-status-danger"
              aria-label="تسجيل الخروج"
              title="تسجيل الخروج"
            >
              <LogOut className="size-5" />
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
              aria-label="القائمة"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav
            className="border-t border-border bg-white px-4 py-2 lg:hidden"
            aria-label="التنقل الرئيسي"
          >
            {nav.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium',
                    isActive(item.href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted',
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:py-8">{children}</main>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
          <span>مِرْصاد — طبقة ذكية ضمن منظومة الخدمات الرقمية لإمارة منطقة الباحة</span>
          <span>نموذج أولي تجريبي · بيانات افتراضية</span>
        </div>
      </footer>
    </div>
  )
}
