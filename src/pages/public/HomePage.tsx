import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, UserRound, Search, Send, Handshake } from 'lucide-react'
import { HomeCtaFooter } from '../../components/layout/Footer'
import { NetworkDiagram } from '../../components/home/NetworkDiagram'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { EventCardGrid } from '../../components/ui/EventCard'
import { FeaturedStartupsSection } from '../../components/home/FeaturedStartupsSection'
import { PartnerLogoMarquee } from '../../components/home/PartnerLogoMarquee'
import { CardGridSkeleton } from '../../components/ui/Skeleton'
import { useClubEvents } from '../../lib/events'

const flowSteps = [
  {
    step: '01',
    title: 'บอกว่าคุณคือใคร',
    desc: 'กรอกข้อมูลทีมหรือบทบาทของคุณ พร้อมบอกว่ากำลังมองหาอะไร และช่วยคนอื่นได้เรื่องไหน',
    icon: UserRound,
    tone: 'sky',
  },
  {
    step: '02',
    title: 'มองหาคนที่ใช่',
    desc: 'เลือกดูทีมหรือพาร์ทเนอร์ตามอุตสาหกรรม ช่วงที่ธุรกิจกำลังอยู่ หรือสังกัดที่สนใจ',
    icon: Search,
    tone: 'ink',
  },
  {
    step: '03',
    title: 'ทักไปคุย',
    desc: 'เขียนแนะนำตัวสั้น ๆ บอกให้ชัดว่าทำไมถึงอยากคุยกับเขา',
    icon: Send,
    tone: 'ink',
  },
  {
    step: '04',
    title: 'ได้เริ่มคุยกันจริง',
    desc: 'พอตกลงกันทั้งสองฝ่าย ช่องทางติดต่อจะขึ้นให้เห็นทันที',
    icon: Handshake,
    tone: 'mint',
  },
] as const

export function HomePage() {
  const { active, past, isLoading } = useClubEvents()
  // หน้าแรกโชว์เฉพาะที่ยังเปิดรับ ถ้าไม่มีเลยค่อย fallback เป็นโครงการล่าสุดที่ผ่านมา
  const events = (active.length > 0 ? active : past).slice(0, 4)
  const showingPast = active.length === 0 && past.length > 0

  return (
    <div>
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-line bg-gradient-to-b from-ted-light/70 via-ted-mist/40 to-surface">
        <div className="wrap relative">
          <div className="grid items-center gap-8 pb-10 pt-8 md:grid-cols-2 md:gap-12 md:pb-14 md:pt-10 lg:pb-16">
            <div className="order-1 -mx-1 animate-fade-up md:order-2 md:mx-0">
              <NetworkDiagram />
            </div>

            <div className="order-2 animate-fade-up animate-delay-1 text-center md:order-1 md:text-left">
              <div className="eyebrow">ก่อตั้งปี 2561 · สนับสนุนโดย iNT มหาวิทยาลัยมหิดล</div>
              <h1 className="mt-3 font-heading text-[clamp(1.75rem,5.5vw,2.85rem)] leading-[1.32] text-ink md:mt-4">
                จากไอเดียในห้องเรียน
                <br />
                สู่<span className="text-gold-deep">สตาร์ตอัพจริง</span>
              </h1>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-[1.8] text-ink-soft md:mx-0 md:mt-5 md:text-[17px]">
                ชมรมสตาร์ตอัพของมหาวิทยาลัยมหิดล รวมกิจกรรม ข่าวสาร และการหาพาร์ทเนอร์ไว้ที่เดียว
                เปิดให้ทั้งคนมหิดลและคนนอกเข้าร่วมได้ตลอดปี
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
              <h2 className="flow-how__title">หาพาร์ทเนอร์ยังไง</h2>
              <p className="flow-how__desc">
                สี่ขั้นตอน ตั้งแต่กรอกข้อมูลจนได้เริ่มคุยกับคนที่ใช่ ไม่ต้องรอรอบโครงการ
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
            eyebrow="กิจกรรมและโครงการ"
            title={showingPast ? 'โครงการที่ผ่านมา' : 'กำลังเปิดรับสมัคร'}
            description={
              showingPast
                ? 'ตอนนี้ยังไม่มีรอบที่เปิดรับสมัคร ระหว่างนี้ดูโครงการที่ผ่านมาไปพลางก่อนได้'
                : 'โครงการบ่มเพาะ การแข่งขัน และทุนสนับสนุน ที่ชมรมจัดร่วมกับ iNT มหิดล'
            }
            actionHref="/events"
            actionLabel="ดูทั้งหมด"
          />
          {isLoading && events.length === 0 ? (
            <CardGridSkeleton count={3} />
          ) : (
            <EventCardGrid events={events} />
          )}
        </div>
      </section>

      <FeaturedStartupsSection actionHref="/match/discover" />

      <HomeCtaFooter />
    </div>
  )
}
