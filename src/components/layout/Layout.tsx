import { useLocation, Outlet } from 'react-router-dom'
import { SiteNavbar } from './Navbar'
import { SiteFooter } from './Footer'

export function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  if (isHome) {
    return <Outlet />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
