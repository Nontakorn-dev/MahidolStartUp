import { Link } from 'react-router-dom'
import { SOCIAL_LINKS } from '../../lib/constants'

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="wrap py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2 font-heading text-sm font-semibold tracking-wide">
              <span className="inline-block h-2 w-2 rounded-full bg-gold" />
              MAHIDOL STARTUP CLUB
            </div>
            <p className="text-sm leading-relaxed text-hero-text">
              ชุมชนสำหรับผู้ที่สนใจ startup, entrepreneurship, technology และ innovation
              ณ มหาวิทยาลัยมหิดล สนับสนุนโดย iNT
            </p>
          </div>

          <div>
            <p className="eyebrow mb-3 !text-gold">ลิงก์ด่วน</p>
            <ul className="space-y-2 text-sm text-hero-text">
              <li><Link to="/events" className="no-underline hover:text-gold">กิจกรรม</Link></li>
              <li><Link to="/posts" className="no-underline hover:text-gold">ข่าวสาร</Link></li>
              <li><Link to="/match" className="no-underline hover:text-gold">Match Hub</Link></li>
              <li><Link to="/about" className="no-underline hover:text-gold">เกี่ยวกับเรา</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3 !text-gold">ติดต่อเรา</p>
            <ul className="space-y-1.5 text-sm text-hero-text">
              <li><a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-gold">Facebook: Mahidol Startup</a></li>
              <li><a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-gold">Instagram @mahidolstartup_official</a></li>
              <li><a href={SOCIAL_LINKS.line} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-gold">Line OpenChat</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-ink-border pt-6 text-center text-xs text-ink-muted">
          © {new Date().getFullYear()} Mahidol Startup Club
        </div>
      </div>
    </footer>
  )
}

export function HomeCtaFooter() {
  return (
    <footer id="join" className="bg-ink py-[72px] text-center text-paper">
      <div className="wrap">
        <h2 className="font-heading text-[26px] text-white">พร้อมเข้าร่วมเครือข่ายหรือยัง</h2>
        <p className="mx-auto mt-3.5 mb-6 max-w-lg text-hero-text">
          ไม่ว่าจะเป็นนักศึกษา ศิษย์เก่า เมนเทอร์ หรือคนนอกมหิดลที่สนใจร่วมงานกับสตาร์ตอัพ
        </p>
        <Link
          to="/register"
          className="inline-block rounded-md bg-gold px-6 py-3 text-sm font-medium text-ink no-underline hover:bg-gold-tint"
        >
          สร้างโปรไฟล์ ↗
        </Link>
        <div className="mt-10 flex flex-wrap justify-center gap-6 border-t border-ink-border pt-6 text-[13px] text-ink-muted">
          <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-gold">Facebook: Mahidol Startup</a>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-gold">Instagram @mahidolstartup_official</a>
          <a href={SOCIAL_LINKS.line} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-gold">Line OpenChat</a>
        </div>
      </div>
    </footer>
  )
}
