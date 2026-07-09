import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Calendar, Users, ArrowLeft, Rocket, Handshake, Kanban } from 'lucide-react'
import { cn } from '../../lib/utils'
import { BrandLogo } from './BrandLogo'

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/requests', label: 'จับคู่', icon: Kanban },
  { to: '/admin/startups', label: 'Startups', icon: Rocket },
  { to: '/admin/partners', label: 'Partners', icon: Handshake },
  { to: '/admin/posts', label: 'ข่าวสาร', icon: FileText },
  { to: '/admin/events', label: 'กิจกรรม', icon: Calendar },
  { to: '/admin/users', label: 'ผู้ใช้', icon: Users },
]

export function AdminLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-flow-bg">
      <div className="border-b border-line bg-paper">
        <div className="wrap flex h-14 items-center gap-4">
          <BrandLogo linkToHome size="compact" />
          <span className="text-line">|</span>
          <Link to="/" className="flex items-center gap-2 text-sm text-ink-soft no-underline hover:text-ink">
            <ArrowLeft className="h-4 w-4" />
            กลับเว็บไซต์
          </Link>
          <span className="text-line">|</span>
          <span className="font-heading text-sm font-semibold text-ink">Admin Panel</span>
        </div>
      </div>

      <div className="wrap flex gap-6 py-6">
        <aside className="hidden w-52 shrink-0 md:block">
          <nav className="space-y-1">
            {adminLinks.map((link) => {
              const active = link.exact
                ? location.pathname === link.to
                : location.pathname.startsWith(link.to)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium no-underline transition-colors',
                    active
                      ? 'bg-ink text-paper'
                      : 'text-ink-soft hover:bg-paper hover:text-ink',
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
