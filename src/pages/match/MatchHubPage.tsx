import { Link } from 'react-router-dom'
import { Rocket, Handshake, Search, Sparkles, Users } from 'lucide-react'
import { PageHero } from '../../components/ui/PageHero'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { FeaturedStartupsSection } from '../../components/home/FeaturedStartupsSection'
import { TED_EVENT_SLUG, peoplePath, applyPath } from '../../lib/ted'

export function MatchHubPage() {
  return (
    <div>
      <PageHero
        eyebrow="MSC Connect"
        title={
          <>
            หาคนที่ใช่
            <br />
            มา<span className="text-gold">ร่วมทางกับคุณ</span>
          </>
        }
        description="ชมรมช่วยจับคู่ทีมนักศึกษากับเมนเทอร์ นักลงทุน และพาร์ทเนอร์ ทำได้ตลอดปี ไม่ต้องรอถึงวัน Demo Day"
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
        <div className="ted-spotlight">
          <div>
            <p className="eyebrow">กำลังเปิดรับ</p>
            <h2 className="mt-2 font-heading text-2xl text-ink md:text-3xl">TED Youth Startup 2026</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft md:text-base">
              สมัครบนเว็บได้เลย มีทีมแล้วก็ลงทะเบียนทีม ยังไม่มีก็กรอกสกิล แนบ CV แล้วให้คนอื่นค้นพบคุณ
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={applyPath(TED_EVENT_SLUG)} className="btn-primary">
                สมัครและหาทีม
              </Link>
              <Link to={peoplePath(TED_EVENT_SLUG)} className="btn-secondary">
                <Users className="h-4 w-4" /> ดูผู้สมัครในโครงการ
              </Link>
            </div>
          </div>
          <p className="rounded-2xl bg-surface/80 p-5 text-sm leading-relaxed text-ink-soft">
            เส้นทางเดียวกับที่ชมรมออกแบบไว้: สำรวจโครงการ → เลือกมีทีมหรือหาทีม → ยื่นใบสมัครในนามทีม → เริ่มสร้างต้นแบบ
          </p>
        </div>
      </section>

      <section className="wrap section-pad !pt-4">
        <SectionHeader
          eyebrow="ทำไมต้อง MSC Connect"
          title="จับคู่ได้ทั้งปี ไม่ต้องรอรอบโครงการ"
          description="iNT มหิดลจัด Business Matching และโครงการบ่มเพาะอยู่แล้ว อย่าง MU InnoMatch และ Mahidol Incubation Program แต่เปิดเป็นรอบ ๆ ชมรมเลยทำช่องทางนี้ขึ้นมาให้ทีมนักศึกษาหาพาร์ทเนอร์ได้ตลอดปี"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: '01', title: 'กรอกฟอร์ม', desc: 'ไม่ต้องสมัครสมาชิก ใช้เวลาไม่เกิน 5 นาที' },
            { step: '02', title: 'ทีมงานอ่าน', desc: 'Core Team ดูข้อมูลแล้วมองหาคนที่เข้ากับทีมคุณ' },
            { step: '03', title: 'แนะนำให้รู้จัก', desc: 'พาทั้งสองฝ่ายมาเจอกันภายใน 7 วันทำการ' },
            { step: '04', title: 'ตามผลให้', desc: 'ถามความคืบหน้า ถ้ายังไม่ลงตัวก็ช่วยหาคนใหม่' },
          ].map((item) => (
            <div key={item.step} className="card-elevated p-6 text-center">
              <span className="font-mono text-3xl font-medium text-gold/40">{item.step}</span>
              <h3 className="mt-3 font-heading text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <FeaturedStartupsSection actionHref="/match/discover" />

      <section className="section-pad bg-gradient-to-b from-ted-light/35 to-ted-mist/20">
        <div className="wrap text-center">
          <Sparkles className="mx-auto mb-4 h-10 w-10 text-gold" />
          <h2 className="font-heading text-2xl text-ink">เริ่มวันนี้เลยก็ได้</h2>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-soft">
            มีทีมอยู่แล้วก็มาหาพาร์ทเนอร์ อยากช่วยทีมนักศึกษาก็มาเป็นเมนเทอร์ได้
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/register/startup" className="btn-primary">
              เริ่มต้นหาพาร์ทเนอร์ของคุณ
            </Link>
            <Link to="/match/discover" className="btn-secondary">
              <Search className="h-4 w-4" /> ดูใครอยู่ในเครือข่ายบ้าง
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
