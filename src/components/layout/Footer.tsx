import { Link } from 'react-router-dom'
import { SOCIAL_LINKS, SOCIAL_ICONS } from '../../lib/constants'
import { BrandLogo } from './BrandLogo'

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="wrap py-12 md:py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            {/* โลโก้เป็นตัวอักษรสีน้ำเงินเข้ม ต้องวางบนพื้นขาวไม่งั้นจมหายไปกับพื้นหลัง footer */}
            <div className="mb-5">
              <BrandLogo size="footer" className="rounded-xl bg-white px-4 py-2.5" />
            </div>
            <p className="text-sm leading-[1.8] text-hero-text md:text-base">
              ชมรมของนักศึกษามหิดลที่สนใจการสร้างธุรกิจ เทคโนโลยี และนวัตกรรม
              สนับสนุนโดย iNT มหาวิทยาลัยมหิดล
            </p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            <div>
              <p className="eyebrow eyebrow-light mb-4">สำรวจ</p>
              <ul className="space-y-2.5 text-sm text-hero-text">
                {[
                  { to: '/events', label: 'กิจกรรม & โครงการ' },
                  { to: '/news', label: 'ข่าวสาร' },
                  { to: '/match', label: 'MSC Connect' },
                  { to: '/about', label: 'เกี่ยวกับเรา' },
                ].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="no-underline transition-colors hover:text-gold">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow eyebrow-light mb-4">เข้าร่วม</p>
              <ul className="space-y-2.5 text-sm text-hero-text">
                {[
                  { to: '/register/startup', label: 'ฉันมี Startup' },
                  { to: '/register/partner', label: 'เป็น Mentor / Partner' },
                  { to: '/match/discover', label: 'ค้นหา Partner' },
                ].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="no-underline transition-colors hover:text-gold">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow eyebrow-light mb-4">ติดต่อเรา</p>
              <div className="flex gap-3">
                <a
                  href={SOCIAL_LINKS.line}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Line"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 no-underline transition-opacity hover:bg-white/20 hover:opacity-90"
                >
                  <img src={SOCIAL_ICONS.line} alt="Line" className="h-5 w-5 object-contain" width={20} height={20} />
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 no-underline transition-opacity hover:bg-white/20 hover:opacity-90"
                >
                  <img src={SOCIAL_ICONS.instagram} alt="Instagram" className="h-5 w-5 object-contain" width={20} height={20} />
                </a>
              </div>
              <p className="mt-4 text-xs text-ink-muted">@mahidolstartup_official</p>
            </div>
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
        <div className="eyebrow eyebrow-light">เข้าร่วมกับเรา</div>
        <h2 className="mt-3 font-heading text-2xl leading-snug text-white md:text-3xl">พร้อมเริ่มแล้วหรือยัง</h2>
        <p className="mx-auto mt-4 mb-8 max-w-lg text-[15px] leading-[1.8] text-hero-text md:text-base">
          นักศึกษา ศิษย์เก่า เมนเทอร์ หรือคนนอกมหิดล เข้าร่วมได้หมด กรอกข้อมูลใช้เวลาไม่ถึง 5 นาที
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/register/startup" className="btn-accent">
            ฉันมี Startup ↗
          </Link>
          <Link to="/register/partner" className="btn-signup">
            ฉันอยากเป็น Mentor/Partner
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4 border-t border-white/10 pt-8 text-xs text-ink-muted md:gap-8 md:text-sm">
          {SOCIAL_LINKS.facebook && (
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-gold">Facebook: Mahidol Startup</a>
          )}
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-gold">@mahidolstartup_official</a>
          <a href={SOCIAL_LINKS.line} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-gold">Line OpenChat</a>
        </div>
      </div>
    </footer>
  )
}
