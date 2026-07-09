import { Link } from 'react-router-dom'
import { Rocket, Handshake, Search, Sparkles } from 'lucide-react'
import { PageHero } from '../../components/ui/PageHero'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { FeaturedStartupsSection } from '../../components/home/FeaturedStartupsSection'

export function MatchHubPage() {
  return (
    <div>
      <PageHero
        eyebrow="MSC Connect"
        title={
          <>
            เชื่อมไอเดียของคุณ
            <br />
            เข้ากับ<span className="text-gold"> คนที่ใช่</span>
          </>
        }
        description="จากห้องเรียนสู่ตลาดจริง — Mahidol Startup Club ช่วยจับคู่ Startup กับ Mentor, นักลงทุน และ Partner ตลอดทั้งปี ไม่ใช่แค่ช่วง Demo Day"
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/register/startup" className="btn-accent">
            <Rocket className="h-4 w-4" /> ฉันมี Startup
          </Link>
          <Link to="/register/partner" className="btn-secondary">
            <Handshake className="h-4 w-4" /> ฉันอยากเป็น Mentor/Partner
          </Link>
        </div>
      </PageHero>

      <section className="wrap section-pad !pt-12">
        <SectionHeader
          eyebrow="ทำไมต้อง MSC Connect"
          title="ความต้องการมีจริง — ecosystem มหิดลพิสูจน์แล้ว"
          description="iNT มหิดลจัด Business Matching และ Incubation Program อย่างต่อเนื่อง (เช่น MU InnoMatch, Mahidol Incubation Program) ชมรมเราทำให้กระบวนการนี้เกิดได้ตลอดปีในระดับนักศึกษา"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: '01', title: 'กรอกฟอร์ม', desc: 'ไม่ต้อง login — ใช้เวลาไม่เกิน 5 นาที' },
            { step: '02', title: 'ทีมตรวจสอบ', desc: 'Core Team ดูข้อมูลและค้นหา Partner ที่ fit' },
            { step: '03', title: 'จับคู่', desc: 'แนะนำตัวให้ทั้งสองฝ่ายภายใน 7 วัน' },
            { step: '04', title: 'Follow-up', desc: 'ติดตามผลและปรับปรุงการจับคู่' },
          ].map((item) => (
            <div key={item.step} className="card-elevated p-6 text-center">
              <span className="font-mono text-3xl font-medium text-gold/40">{item.step}</span>
              <h3 className="mt-3 font-heading text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <FeaturedStartupsSection actionHref="/news" />

      <section className="bg-ted-light/60 section-pad">
        <div className="wrap text-center">
          <Sparkles className="mx-auto mb-4 h-10 w-10 text-gold" />
          <h2 className="font-heading text-2xl text-ink">พร้อมเริ่มต้นแล้วหรือยัง?</h2>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">
            ไม่ว่าคุณจะมี Startup หรืออยากช่วยเหลือทีมนักศึกษา — เริ่มได้วันนี้
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/register/startup" className="btn-primary">
              เริ่มต้นหาพาร์ทเนอร์ของคุณ
            </Link>
            <Link to="/match/discover" className="btn-secondary">
              <Search className="h-4 w-4" /> ค้นหา Partner (สมาชิก)
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
