import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Bell, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

const navLinks = [
  { to: '/events', label: 'กิจกรรม' },
  { to: '/posts', label: 'ข่าวสาร' },
  { to: '/match', label: 'Match Hub' },
  { to: '/about', label: 'เกี่ยวกับเรา' },
]

export function HomeHeroNav() {
  const [open, setOpen] = useState(false)
  const { user, profile, signOut } = useAuth()

  const { data: unreadCount = 0 } = useQuery({
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

  const isAdmin = profile && ['pr', 'core_team', 'admin'].includes(profile.role)

  return (
    <>
      <div className="flex items-center justify-between pb-14">
        <Link to="/" className="flex items-center gap-2 font-heading text-base font-semibold tracking-wide text-paper">
          <span className="inline-block h-2 w-2 rounded-full bg-gold" />
          MAHIDOL STARTUP CLUB
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-[#C7CEDA] md:flex">
          <a href="#pillars" className="no-underline hover:text-gold">แพลตฟอร์ม</a>
          <a href="#matching" className="no-underline hover:text-gold">Match Hub</a>
          <a href="#programs" className="no-underline hover:text-gold">โครงการ</a>
          <a href="#events" className="no-underline hover:text-gold">กิจกรรม</a>
          <a href="#join" className="no-underline hover:text-gold">ติดต่อ</a>
          {user ? (
            <>
              {isAdmin && <Link to="/admin" className="hover:text-gold">Admin</Link>}
              <Link to="/match/connections" className="relative hover:text-gold">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold text-[9px] text-ink">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="hover:text-gold">{profile?.full_name?.split(' ')[0]}</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gold">เข้าสู่ระบบ</Link>
              <Link to="/register" className="rounded-md bg-gold px-3 py-1.5 text-ink no-underline hover:bg-gold-tint">สมัคร</Link>
            </>
          )}
        </nav>

        <button className="text-paper md:hidden" onClick={() => setOpen(!open)} aria-label="เมนู">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="mb-6 space-y-2 border-t border-ink-border pt-4 md:hidden">
          {['#pillars', '#matching', '#programs', '#events', '#join'].map((hash) => (
            <a
              key={hash}
              href={hash}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-[#C7CEDA] no-underline hover:text-gold"
            >
              {hash.replace('#', '')}
            </a>
          ))}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} className="block py-2 text-sm text-[#C7CEDA]">โปรไฟล์</Link>
              {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="block py-2 text-sm text-[#C7CEDA]">Admin</Link>}
              <button onClick={() => { signOut(); setOpen(false) }} className="block py-2 text-sm text-red-400">ออกจากระบบ</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setOpen(false)} className="flex-1 rounded-md border border-ink-border py-2 text-center text-sm text-paper">เข้าสู่ระบบ</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="flex-1 rounded-md bg-gold py-2 text-center text-sm text-ink">สมัคร</Link>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export function SiteNavbar() {
  const [open, setOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const location = useLocation()

  const { data: unreadCount = 0 } = useQuery({
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

  const isAdmin = profile && ['pr', 'core_team', 'admin'].includes(profile.role)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="wrap flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading text-sm font-semibold tracking-wide text-ink">
          <span className="inline-block h-2 w-2 rounded-full bg-gold" />
          MAHIDOL STARTUP CLUB
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'no-underline transition-colors hover:text-gold-deep',
                location.pathname === link.to || location.pathname.startsWith(link.to + '/')
                  ? 'text-ink font-medium'
                  : 'text-muted',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="text-sm text-muted no-underline hover:text-ink">Admin</Link>
              )}
              <Link to="/match/connections" className="relative text-muted hover:text-ink">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold text-[9px] text-ink">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="flex items-center gap-2 text-sm text-ink no-underline">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs text-paper">
                  {profile?.full_name?.[0]?.toUpperCase() || <User className="h-3.5 w-3.5" />}
                </div>
                {profile?.full_name?.split(' ')[0]}
              </Link>
              <button onClick={() => signOut()} className="text-sm text-muted hover:text-ink">ออก</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-muted no-underline hover:text-ink">เข้าสู่ระบบ</Link>
              <Link to="/register" className="rounded-md bg-gold px-3.5 py-1.5 text-sm font-medium text-ink no-underline hover:bg-gold-tint">
                สมัคร
              </Link>
            </>
          )}
        </div>

        <button className="text-ink md:hidden" onClick={() => setOpen(!open)} aria-label="เมนู">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line px-5 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm text-ink-soft no-underline"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 border-t border-line pt-3">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="block py-2 text-sm">โปรไฟล์</Link>
                {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="block py-2 text-sm">Admin</Link>}
                <button onClick={() => { signOut(); setOpen(false) }} className="block py-2 text-sm text-red-600">ออกจากระบบ</button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setOpen(false)} className="flex-1 rounded-md border border-line py-2 text-center text-sm">เข้าสู่ระบบ</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="flex-1 rounded-md bg-gold py-2 text-center text-sm text-ink">สมัคร</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
