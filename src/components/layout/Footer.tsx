import { Link } from 'react-router-dom'
import { SOCIAL_LINKS, SOCIAL_ICONS } from '../../lib/constants'
import { BrandLogo } from './BrandLogo'

const NAV_EXPLORE = [
  { to: '/events', label: 'กิจกรรม' },
  { to: '/news', label: 'ข่าวสาร' },
  { to: '/match', label: 'MSC Connect' },
  { to: '/about', label: 'เกี่ยวกับเรา' },
]

const NAV_JOIN = [
  { to: '/register/startup', label: 'ลงทะเบียน Startup' },
  { to: '/register/partner', label: 'เป็น Mentor' },
  { to: '/match/discover', label: 'ค้นหา Partner' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface text-ink">
      <div className="wrap py-5 md:py-10">
        {/* Mobile View (< md): Sleek minimal design with chip buttons and golden accent */}
        <div className="flex flex-col gap-4 md:hidden">
          {/* Top Row: Brand Logo & Social Icons */}
          <div className="flex items-center justify-between">
            <BrandLogo size="compact" linkToHome />
            <div className="flex items-center gap-2">
              <a
                href={SOCIAL_LINKS.line}
                target="_blank"
                rel="noopener noreferrer"
                title="Line OpenChat"
                aria-label="Line OpenChat"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-line/70 bg-ted-light/60 no-underline shadow-xs transition-all hover:bg-ted-light hover:border-gold/50 active:scale-95"
              >
                <img src={SOCIAL_ICONS.line} alt="Line" className="h-4.5 w-4.5 object-contain" width={18} height={18} />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-line/70 bg-ted-light/60 no-underline shadow-xs transition-all hover:bg-ted-light hover:border-gold/50 active:scale-95"
              >
                <img src={SOCIAL_ICONS.instagram} alt="Instagram" className="h-4.5 w-4.5 object-contain" width={18} height={18} />
              </a>
            </div>
          </div>

          {/* Join Section with Chic Horizontal Chips */}
          <div className="rounded-2xl border border-line/60 bg-gradient-to-r from-ted-light/50 via-surface to-ted-mist/40 p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="font-heading">เข้าร่วมกับเรา</span>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {NAV_JOIN.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="inline-flex items-center rounded-xl border border-line/80 bg-surface px-3 py-1.5 font-heading text-[13.5px] font-medium text-ink shadow-xs no-underline transition-all hover:border-gold hover:text-gold-deep active:scale-95 active:bg-gold-tint/20"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom minimal copyright */}
          <div className="flex items-center justify-between text-[11px] text-ink-soft/80 pt-1">
            <span>© {new Date().getFullYear()} Mahidol Startup Club</span>
            <span>สนับสนุนโดย iNT ม.มหิดล</span>
          </div>
        </div>

        {/* Desktop View (>= md): Full layout with Brand, Explore, Join, Contact, and Credits */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-8">
          {/* Brand Col */}
          <div className="md:col-span-4 lg:col-span-5">
            <BrandLogo size="footer" linkToHome />
            <p className="mt-3.5 max-w-sm text-sm leading-relaxed text-ink-soft">
              Hands-on. Support. Connect. ชมรมสตาร์ตอัพมหิดล สำหรับคนที่อยากลงมือทำและเจอคนที่ใช่
            </p>
            <div className="mt-3.5 flex items-center gap-2 text-xs text-ink-soft">
              <span className="inline-flex h-2 w-2 rounded-full bg-gold" />
              <span>สนับสนุนโดย iNT มหาวิทยาลัยมหิดล</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 lg:col-span-2">
            <p className="font-heading text-sm font-semibold text-ink">สำรวจ</p>
            <ul className="mt-3 space-y-2 text-sm">
              {NAV_EXPLORE.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-ink-soft no-underline transition-colors hover:text-gold-deep"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Join Links */}
          <div className="md:col-span-3 lg:col-span-2">
            <p className="font-heading text-sm font-semibold text-ink">เข้าร่วม</p>
            <ul className="mt-3 space-y-2 text-sm">
              {NAV_JOIN.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-ink-soft no-underline transition-colors hover:text-gold-deep"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-3 lg:col-span-3">
            <p className="font-heading text-sm font-semibold text-ink">ติดตามเรา</p>
            <div className="mt-3 flex items-center gap-2.5">
              <a
                href={SOCIAL_LINKS.line}
                target="_blank"
                rel="noopener noreferrer"
                title="Line OpenChat"
                aria-label="Line OpenChat"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-ted-light/60 no-underline transition-all hover:bg-ted-light hover:scale-105"
              >
                <img src={SOCIAL_ICONS.line} alt="Line" className="h-5 w-5 object-contain" width={20} height={20} />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-ted-light/60 no-underline transition-all hover:bg-ted-light hover:scale-105"
              >
                <img src={SOCIAL_ICONS.instagram} alt="Instagram" className="h-5 w-5 object-contain" width={20} height={20} />
              </a>
            </div>
            <p className="mt-2.5 text-xs text-ink-soft">@mahidolstartup_official</p>
          </div>
        </div>

        {/* Desktop Bottom copyright */}
        <div className="hidden md:flex mt-8 items-center justify-between gap-3 border-t border-line/70 pt-5 text-xs text-ink-soft">
          <span>© {new Date().getFullYear()} Mahidol Startup Club · มหาวิทยาลัยมหิดล</span>
          <span>สนับสนุนโดย iNT — Institute for Technology and Innovation Management</span>
        </div>
      </div>
    </footer>
  )
}

export function HomeCtaSection() {
  return (
    <section className="section-pad bg-surface border-t border-line" id="join">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-ted-light via-surface to-gold-tint/40 p-6 text-center sm:p-10 md:p-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-ted-sky/15 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="eyebrow">Find your people</div>
            <h2 className="mt-2.5 font-heading text-xl font-bold leading-snug text-ink sm:text-2xl md:text-3xl lg:text-[2.4rem]">
              พร้อมหาคนที่ใช่ แล้วเริ่มสร้างเลยหรือยัง?
            </h2>
            <p className="mx-auto mt-2.5 max-w-lg text-sm leading-relaxed text-ink-soft sm:text-base">
              ไม่ว่าจะมีไอเดียอยู่แล้ว หรืออยากเข้ามาซัพพอร์ตคนอื่น เริ่มได้เลยวันนี้
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              <Link to="/match/discover" className="btn-accent w-full sm:w-auto">
                หาเพื่อนร่วมทีม
              </Link>
              <Link to="/events" className="btn-secondary w-full sm:w-auto">
                สำรวจกิจกรรม
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Backward compatibility alias */
export const HomeCtaFooter = HomeCtaSection
