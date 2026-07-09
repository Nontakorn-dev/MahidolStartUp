import { Link } from 'react-router-dom'
import { SOCIAL_LINKS } from '../../lib/constants'
import { Globe, Camera, MessageCircle } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="wrap py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-sm font-bold text-ink">MU</span>
              <span className="font-heading text-sm font-semibold tracking-wide">MAHIDOL STARTUP CLUB</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-hero-text md:text-base">
              ชุมชนสำหรับผู้ที่สนใจ startup, entrepreneurship, technology และ innovation
              ณ มหาวิทยาลัยมหิดล สนับสนุนโดย iNT
            </p>
          </div>

          <div>
            <p className="eyebrow mb-4 !text-gold">ลิงก์ด่วน</p>
            <ul className="space-y-2.5 text-sm text-hero-text">
              {[
                { to: '/events', label: 'กิจกรรม' },
                { to: '/news', label: 'ข่าวสาร' },
                { to: '/match', label: 'Match Hub' },
                { to: '/about', label: 'เกี่ยวกับเรา' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="no-underline transition-colors hover:text-gold">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4 !text-gold">ติดต่อเรา</p>
            <div className="flex gap-3">
              {[
                { href: SOCIAL_LINKS.facebook, icon: Globe, label: 'Facebook' },
                { href: SOCIAL_LINKS.instagram, icon: Camera, label: 'Instagram' },
                { href: SOCIAL_LINKS.line, icon: MessageCircle, label: 'Line' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/80 no-underline transition-colors hover:bg-gold hover:text-ink"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="mt-4 text-xs text-ink-muted">@mahidolstartup_official</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink-border pt-6 text-xs text-ink-muted md:flex-row">
          <span>© {new Date().getFullYear()} Mahidol Startup Club · มหาวิทยาลัยมหิดล</span>
          <span>สนับสนุนโดย iNT — Institute for Technology and Innovation Management</span>
        </div>
      </div>
    </footer>
  )
}

export function HomeCtaFooter() {
  return (
    <footer id="join" className="hero-gradient hero-grid-bg relative overflow-hidden py-16 text-center text-paper md:py-20">
      <div className="wrap relative">
        <div className="eyebrow eyebrow-light">เข้าร่วมเครือข่าย</div>
        <h2 className="mt-3 font-heading text-2xl text-white md:text-3xl">พร้อมเข้าร่วมเครือข่ายหรือยัง</h2>
        <p className="mx-auto mt-4 mb-8 max-w-lg text-base text-hero-text">
          ไม่ว่าจะเป็นนักศึกษา ศิษย์เก่า เมนเทอร์ หรือคนนอกมหิดลที่สนใจร่วมงานกับสตาร์ตอัพ
        </p>
        <Link to="/register/startup" className="btn-accent">
          ฉันมี Startup ↗
        </Link>
        <div className="mt-10 flex flex-wrap justify-center gap-4 border-t border-white/10 pt-8 text-xs text-ink-muted md:gap-8 md:text-sm">
          <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-gold">Facebook: Mahidol Startup</a>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-gold">@mahidolstartup_official</a>
          <a href={SOCIAL_LINKS.line} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-gold">Line OpenChat</a>
        </div>
      </div>
    </footer>
  )
}
