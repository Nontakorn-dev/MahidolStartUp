import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Bell, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { SOCIAL_LINKS, SOCIAL_ICONS } from '../../lib/constants'
import { TED_EVENT_SLUG } from '../../lib/ted'
import { BrandLogo } from './BrandLogo'

const navLinks = [
  { to: `/events/${TED_EVENT_SLUG}`, label: 'TED Youth' },
  { to: '/events', label: 'กิจกรรม' },
  { to: '/news', label: 'ข่าวสาร' },
  { to: '/match', label: 'MSC Connect' },
  { to: '/about', label: 'เกี่ยวกับเรา' },
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

/** โลโก้เต็มตอนอยู่บนสุด แล้วย่อลงเมื่อเลื่อนหน้า เพื่อให้แถบเมนูติดบนได้โดยไม่กินจอ */
const COMPACT_LOGO = 'h-9 max-w-[160px] sm:h-11 sm:max-w-[220px] md:h-14 md:max-w-[300px] lg:h-14 lg:max-w-[320px]'

function HeaderBrand({ compact = false }: { compact?: boolean }) {
  return (
    <BrandLogo
      linkToHome
      size="nav"
      imageClassName={cn('transition-all duration-300', compact && COMPACT_LOGO)}
    />
  )
}

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}

function HeaderSocialLinks({ className }: { className?: string }) {
  const iconClass = 'flex h-8 w-8 items-center justify-center rounded-lg no-underline transition-colors hover:bg-ted-light/70 sm:h-9 sm:w-9'

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      <a
        href={SOCIAL_LINKS.line}
        target="_blank"
        rel="noopener noreferrer"
        className={iconClass}
        title="Line OpenChat"
        aria-label="Line OpenChat"
      >
        <img src={SOCIAL_ICONS.line} alt="" className="h-4 w-4 object-contain sm:h-5 sm:w-5" width={20} height={20} />
      </a>
      <a
        href={SOCIAL_LINKS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className={iconClass}
        title="@mahidolstartup_official"
        aria-label="Instagram"
      >
        <img src={SOCIAL_ICONS.instagram} alt="" className="h-4 w-4 object-contain sm:h-5 sm:w-5" width={20} height={20} />
      </a>
    </div>
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
        <div className="mb-6 flex items-start justify-between gap-3">
          <HeaderBrand />
          <button onClick={onClose} className="rounded-lg p-2 text-ink hover:bg-flow-bg">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </>
  )
}

const siteNavLink = 'rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors'
const siteNavIdle = 'text-ink-soft hover:text-ink'
const siteNavActive = 'text-ted-blue font-semibold'

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
      <div className="flex items-center gap-2 sm:gap-3">
        <Link to="/login" className={cn(linkClass, 'px-2 py-2')}>เข้าสู่ระบบ</Link>
        <Link to="/register" className={light ? 'btn-signup' : 'btn-signup btn-signup--solid'}>
          สมัครสมาชิก
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

function MobileSocialLinks() {
  return (
    <div className="mt-6 border-t border-line pt-4">
      <p className="mb-3 text-sm font-semibold text-ink-soft">ติดตามเรา</p>
      <div className="flex gap-2">
        <a
          href={SOCIAL_LINKS.line}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line py-3 text-sm font-medium text-ink no-underline hover:bg-ted-light"
        >
          <img src={SOCIAL_ICONS.line} alt="" className="h-5 w-5 object-contain" width={20} height={20} />
          Line
        </a>
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line py-3 text-sm font-medium text-ink no-underline hover:bg-ted-light"
        >
          <img src={SOCIAL_ICONS.instagram} alt="" className="h-5 w-5 object-contain" width={20} height={20} />
          Instagram
        </a>
      </div>
    </div>
  )
}

export function SiteNavbar() {
  const [open, setOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const { data: unreadCount = 0 } = useNotifications()
  const isAdmin = !!(profile && ['pr', 'core_team', 'admin'].includes(profile.role))
  const scrolled = useScrolled()

  return (
    <>
      <a href="#main-content" className="skip-link">ข้ามไปยังเนื้อหาหลัก</a>

      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-300',
          scrolled
            ? 'border-b border-line/50 bg-surface/90 shadow-nav backdrop-blur-md'
            : 'border-b border-transparent bg-paper',
        )}
      >
        <div className="wrap">
          <div
            className={cn(
              'flex items-center justify-between gap-2 transition-all duration-300 md:gap-4',
              scrolled ? 'py-2 md:py-2.5' : 'py-2.5 md:py-3.5',
            )}
          >
            <div className="min-w-0 shrink">
              <HeaderBrand compact={scrolled} />
            </div>

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
              <HeaderSocialLinks />
              <AuthLinks user={user} profile={profile} isAdmin={isAdmin} unreadCount={unreadCount} />
              {user && (
                <button onClick={() => signOut()} className="px-2 py-2 text-sm font-medium text-ink-soft hover:text-ink">ออก</button>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-0.5 lg:hidden">
              <HeaderSocialLinks />
              <button
                className="rounded-lg p-2 text-ink hover:bg-flow-bg"
                onClick={() => setOpen(true)}
                aria-label="เมนู"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
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
        <MobileSocialLinks />
      </MobileDrawer>
    </>
  )
}
