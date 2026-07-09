import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, UserRound, Search, Send, Handshake } from 'lucide-react'
import { HomeHeroNav } from '../../components/layout/Navbar'
import { HomeCtaFooter } from '../../components/layout/Footer'
import { NetworkDiagram } from '../../components/home/NetworkDiagram'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { EventCardGrid } from '../../components/ui/EventCard'
import { FeaturedStartupsSection } from '../../components/home/FeaturedStartupsSection'
import { PartnerLogoMarquee } from '../../components/home/PartnerLogoMarquee'
import { getUpcomingEvents } from '../../data/events'

const flowSteps = [
  {
    step: '01',
    title: 'สร้างโปรไฟล์',
    desc: 'กรอกข้อมูลทีมหรือบทบาทของคุณ พร้อมระบุชัดว่ากำลังมองหาอะไร และให้อะไรได้บ้าง',
    icon: UserRound,
    tone: 'sky',
  },
  {
    step: '02',
    title: 'ค้นหา / กรอง',
    desc: 'เลือกดู Startup หรือ Partner ตามอุตสาหกรรม ระยะธุรกิจ หรือสังกัดที่สนใจ',
    icon: Search,
    tone: 'ink',
  },
  {
    step: '03',
    title: 'ส่งคำขอ',
    desc: 'เขียนข้อความสั้น ๆ แนะนำตัวและเหตุผลที่อยากเชื่อมต่ออย่างมีจุดหมาย',
    icon: Send,
    tone: 'ink',
  },
  {
    step: '04',
    title: 'ตอบรับ',
    desc: 'เมื่อทั้งสองฝ่ายตอบรับ ระบบจะเปิดช่องทางติดต่อให้เห็นทันที',
    icon: Handshake,
    tone: 'mint',
  },
] as const

export function HomePage() {
  const events = getUpcomingEvents(4)

  return (
    <div>
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-line bg-gradient-to-b from-ted-light/70 via-ted-mist/40 to-surface">
        <div className="wrap relative">
          <HomeHeroNav />

          <div className="grid items-center gap-8 pb-10 md:grid-cols-2 md:gap-12 md:pb-14 lg:pb-16">
            <div className="order-1 -mx-1 animate-fade-up md:order-2 md:mx-0">
              <NetworkDiagram />
            </div>

            <div className="order-2 animate-fade-up animate-delay-1 text-center md:order-1 md:text-left">
              <div className="eyebrow">Est. 2018 · Supported by iNT, Mahidol University</div>
              <h1 className="mt-3 font-heading text-[clamp(1.75rem,5.5vw,2.85rem)] leading-[1.28] tracking-tight text-ink md:mt-4">
                เครือข่ายที่ทำให้ไอเดีย
                <br />
                กลายเป็น<span className="text-gold-deep"> สตาร์ตอัพจริง</span>
              </h1>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-[1.75] text-ink-soft md:mx-0 md:mt-5 md:text-[17px]">
                พื้นที่กลางของ Mahidol Startup Club ที่รวมข่าวสาร กิจกรรม และการจับคู่ทางธุรกิจไว้ในที่เดียว
                — เปิดให้ทั้งคนในมหิดลและพันธมิตรภายนอกเชื่อมต่อกันได้ตลอดปี
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
                <Link to="/register/startup" className="btn-accent justify-center">
                  <Sparkles className="h-4 w-4" /> ฉันมี Startup
                </Link>
                <Link to="/register/partner" className="btn-secondary justify-center">
                  ฉันอยากเป็น Mentor/Partner
                </Link>
              </div>
            </div>
          </div>
        </div>

        <PartnerLogoMarquee />
      </header>

      {/* Platform steps — clean 4-card row */}
      <section className="section-pad bg-ted-mist/50" id="matching">
        <div className="wrap">
          <div className="flow-how">
            <div className="flow-how__header">
              <div className="eyebrow">MSC Connect</div>
              <h2 className="flow-how__title">ขั้นตอนการใช้แพลตฟอร์ม</h2>
              <p className="flow-how__desc">
                สร้างโปรไฟล์ ค้นหาคู่เชื่อมต่อ ส่งคำขอ และเริ่มคุยกันเมื่อทั้งสองฝ่ายตอบรับ
              </p>
            </div>

            <ol className="flow-how__grid">
              {flowSteps.map((step) => (
                <li key={step.step} className={`flow-how__card flow-how__card--${step.tone}`}>
                  <div className="flow-how__icon">
                    <step.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="flow-how__num">{step.step}</span>
                  <h3 className="flow-how__card-title">{step.title}</h3>
                  <p className="flow-how__card-desc">{step.desc}</p>
                </li>
              ))}
            </ol>

            <div className="flow-how__cta">
              <Link to="/match/discover" className="flow-how__btn">
                เริ่มค้นหา Partner <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="section-pad bg-surface" id="events">
        <div className="wrap">
          <SectionHeader
            eyebrow="ข่าวสารประชาสัมพันธ์"
            title="กิจกรรม & โครงการ"
            description="Talent Accelerator, Startup Thailand League, TED Youth และ Blue Horizon"
            actionHref="/events"
            actionLabel="ดูทั้งหมด"
          />
          <EventCardGrid events={events} />
        </div>
      </section>

      <FeaturedStartupsSection actionHref="/news" />

      <HomeCtaFooter />
    </div>
  )
}
