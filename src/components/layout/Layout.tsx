import { Outlet } from 'react-router-dom'
import { SiteNavbar } from './Navbar'
import { SiteFooter } from './Footer'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
