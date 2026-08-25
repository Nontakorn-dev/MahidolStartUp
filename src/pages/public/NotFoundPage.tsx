import { Link } from 'react-router-dom'
import { Compass, Calendar, Newspaper, Handshake } from 'lucide-react'

const SUGGESTIONS = [
  { to: '/events', label: 'กิจกรรม & โครงการ', desc: 'โครงการที่กำลังเปิดรับสมัคร', icon: Calendar },
  { to: '/news', label: 'ข่าวสาร', desc: 'อัปเดตล่าสุดจากชมรม', icon: Newspaper },
  { to: '/match', label: 'MSC Connect', desc: 'จับคู่ Startup กับ Mentor/Partner', icon: Handshake },
]

export function NotFoundPage() {
  return (
    <div className="wrap section-pad">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-tint text-gold-deep">
          <Compass className="h-8 w-8" />
        </div>
        <p className="font-mono text-sm font-semibold tracking-widest text-ink-soft">404</p>
        <h1 className="mt-2 font-heading text-2xl text-ink md:text-3xl">ไม่พบหน้าที่คุณกำลังหา</h1>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-soft">
          ลิงก์อาจหมดอายุ พิมพ์ผิด หรือเนื้อหาถูกย้ายไปแล้ว — ลองเริ่มจากหน้าเหล่านี้ดู
        </p>

        <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
          {SUGGESTIONS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-xl border border-line bg-surface p-4 no-underline transition-colors hover:border-gold/50"
            >
              <item.icon className="mb-2 h-5 w-5 text-gold" />
              <p className="font-heading text-sm font-semibold text-ink">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">{item.desc}</p>
            </Link>
          ))}
        </div>

        <Link to="/" className="btn-primary mt-8">กลับหน้าแรก</Link>
      </div>
    </div>
  )
}
