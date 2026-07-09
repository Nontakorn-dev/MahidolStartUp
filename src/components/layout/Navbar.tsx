import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Bell, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { TopBar } from './TopBar'

const navLinks = [
  { to: '/events', label: 'กิจกรรม' },
  { to: '/news', label: 'ข่าวสาร' },
  { to: '/match', label: 'MSC Connect' },
  { to: '/about', label: 'เกี่ยวกับเรา' },
]

const homeAnchors = [
  { href: '#pillars', label: 'แพลตฟอร์ม' },
  { href: '#matching', label: 'Match Hub' },
  { href: '#programs', label: 'โครงการ' },
  { href: '#events', label: 'กิจกรรม' },
  { href: '#join', label: 'ติดต่อ' },
]

function useNotifications() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['notifications-unread', user?.id],
    queryFn: async () => {
      if (!user) return 0
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
      return count ?? 0
    },
    enabled: !!user,
    refetchInterval: 30000,
  })
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/"
      className={cn(
        'flex items-center gap-3 font-heading text-base font-semibold tracking-wide no-underline md:text-lg',
        light ? 'text-white' : 'text-ink',
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-sm font-bold text-ink shadow-sm">
        MU
      </span>
      <span className="hidden leading-tight sm:block">
        <span className="block">MAHIDOL STARTUP</span>
        <span className={cn('block text-xs font-medium', light ? 'text-hero-text' : 'text-ink-soft')}>CLUB</span>
      </span>
    </Link>
  )
}

function MobileDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <>
      <div className="mobile-menu-overlay lg:hidden" onClick={onClose} />
      <div className="mobile-menu-panel lg:hidden">
        <div className="mb-6 flex items-center justify-between">
          <Brand />
          <button onClick={onClose} className="rounded-lg p-2 text-ink hover:bg-flow-bg">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </>
  )
}

const siteNavLink = 'rounded-lg px-3.5 py-2.5 text-sm font-medium no-underline transition-colors'
const siteNavIdle = 'text-ink-soft hover:bg-ted-light hover:text-ink'
const siteNavActive = 'bg-ted-light text-ted-blue font-semibold'

export function HomeHeroNav() {
  const [open, setOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const { data: unreadCount = 0 } = useNotifications()
  const isAdmin = !!(profile && ['pr', 'core_team', 'admin'].includes(profile.role))

  return (
    <>
      <div className="flex items-center justify-between py-5 md:py-6">
        <Brand />

        <nav className="hidden items-center gap-0.5 lg:flex">
          {homeAnchors.map((a) => (
            <a key={a.href} href={a.href} className={cn(siteNavLink, siteNavIdle)}>
              {a.label}
            </a>
          ))}
          <div className="mx-2 h-6 w-px bg-line" />
          <AuthLinks user={user} profile={profile} isAdmin={isAdmin} unreadCount={unreadCount} />
        </nav>

        <button
          className="rounded-xl p-2.5 text-ink hover:bg-flow-bg lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="เมนู"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <MobileDrawer open={open} onClose={() => setOpen(false)}>
        <nav className="space-y-1">
          {homeAnchors.map((a) => (
            <a
              key={a.href}
              href={a.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3.5 text-base font-medium text-ink no-underline hover:bg-ted-light"
            >
              {a.label}
            </a>
          ))}
        </nav>
        <div className="mt-4 border-t border-line pt-4">
          <MobileAuth user={user} isAdmin={isAdmin} onClose={() => setOpen(false)} signOut={signOut} />
        </div>
      </MobileDrawer>
    </>
  )
}

function AuthLinks({
  light,
  user,
  profile,
  isAdmin,
  unreadCount,
}: {
  light?: boolean
  user: ReturnType<typeof useAuth>['user']
  profile: ReturnType<typeof useAuth>['profile']
  isAdmin?: boolean
  unreadCount: number
}) {
  const linkClass = light
    ? 'text-sm font-medium text-hero-text-strong no-underline hover:text-gold'
    : 'text-sm font-medium text-ink-soft no-underline hover:text-ink'

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link to="/login" className={cn(linkClass, 'px-2 py-2')}>เข้าสู่ระบบ</Link>
        <Link to="/register" className={light ? 'btn-signup' : 'btn-signup btn-signup--solid'}>
          สมัคร
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {isAdmin && <Link to="/admin" className={cn(linkClass, 'px-2 py-2')}>Admin</Link>}
      <Link to="/match/connections" className={cn('relative px-2 py-2', linkClass)}>
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-ink">
            {unreadCount}
          </span>
        )}
      </Link>
      <Link to="/profile" className={cn('flex items-center gap-2 px-2 py-2', linkClass)}>
        <div className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
          light ? 'bg-gold/25 text-gold' : 'bg-ted-light text-ted-blue',
        )}>
          {profile?.full_name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
        </div>
        <span className="max-w-[80px] truncate">{profile?.full_name?.split(' ')[0]}</span>
      </Link>
    </div>
  )
}

function MobileAuth({
  user,
  isAdmin,
  onClose,
  signOut,
}: {
  user: ReturnType<typeof useAuth>['user']
  isAdmin?: boolean
  onClose: () => void
  signOut: () => void
}) {
  if (!user) {
    return (
      <div className="flex flex-col gap-2">
        <Link to="/login" onClick={onClose} className="rounded-xl border-2 border-ink py-3.5 text-center text-base font-semibold text-ink no-underline">เข้าสู่ระบบ</Link>
        <Link to="/register" onClick={onClose} className="btn-primary w-full !py-3.5 !text-base">สมัครสมาชิก</Link>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <Link to="/profile" onClick={onClose} className="block rounded-lg px-3 py-3.5 text-base font-medium text-ink no-underline hover:bg-ted-light">โปรไฟล์</Link>
      <Link to="/match/connections" onClick={onClose} className="block rounded-lg px-3 py-3.5 text-base font-medium text-ink no-underline hover:bg-ted-light">การเชื่อมต่อ</Link>
      {isAdmin && <Link to="/admin" onClick={onClose} className="block rounded-lg px-3 py-3.5 text-base font-medium text-ink no-underline hover:bg-ted-light">Admin</Link>}
      <button onClick={() => { signOut(); onClose() }} className="w-full rounded-lg px-3 py-3.5 text-left text-base font-medium text-red-600 hover:bg-red-50">ออกจากระบบ</button>
    </div>
  )
}

export function SiteNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const { data: unreadCount = 0 } = useNotifications()
  const isAdmin = !!(profile && ['pr', 'core_team', 'admin'].includes(profile.role))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <TopBar />

      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-300',
          scrolled
            ? 'border-b border-line bg-surface/98 shadow-nav backdrop-blur-md'
            : 'border-b border-line bg-surface',
        )}
      >
        <div className="wrap flex min-h-[68px] items-center justify-between md:min-h-[72px]">
          <Brand />

          <nav className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => {
              const active = location.pathname === link.to || location.pathname.startsWith(link.to + '/')
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(siteNavLink, active ? siteNavActive : siteNavIdle)}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <AuthLinks user={user} profile={profile} isAdmin={isAdmin} unreadCount={unreadCount} />
            {user && (
              <button onClick={() => signOut()} className="ml-1 px-2 py-2 text-sm font-medium text-ink-soft hover:text-ink">ออก</button>
            )}
          </div>

          <button
            className="rounded-xl p-2.5 text-ink hover:bg-flow-bg lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="เมนู"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <MobileDrawer open={open} onClose={() => setOpen(false)}>
        <nav className="space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3.5 text-base font-medium text-ink no-underline hover:bg-ted-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4 border-t border-line pt-4">
          <MobileAuth user={user} isAdmin={isAdmin} onClose={() => setOpen(false)} signOut={signOut} />
        </div>
      </MobileDrawer>
    </>
  )
}
