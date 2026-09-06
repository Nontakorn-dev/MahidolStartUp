import { Link } from 'react-router-dom'
import { ArrowRight, UserRound, Search, Send, Handshake } from 'lucide-react'
import { HomeCtaSection } from '../../components/layout/Footer'
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
      <header className="relative overflow-x-clip bg-gradient-to-b from-paper via-surface to-ted-mist/70">
        <div className="wrap relative">
          <div className="home-hero grid items-center gap-4 pb-6 pt-3 sm:gap-8 sm:pb-10 sm:pt-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:pb-16 lg:pt-8 xl:gap-16">
            <div className="home-hero__copy order-1 animate-fade-up text-center lg:text-left">
              <div className="eyebrow eyebrow--plain">Supported by iNT Mahidol</div>
              <h1 className="home-hero__title">
                Find your people.
                <br />
                <span className="text-ted-blue">Start building.</span>
              </h1>
              <p className="home-hero__desc">
                ชมรมสตาร์ตอัพมหาวิทยาลัยมหิดล สำหรับคนที่อยากลงมือทำจริง มีคนซัพพอร์ต
                และได้เจอเพื่อนร่วมทาง — ไม่ใช่แค่ฟังแล้วกลับบ้าน
              </p>
              <div className="home-hero__actions">
                <Link to="/match/discover" className="btn-accent">
                  หาเพื่อนร่วมทีม
                </Link>
                <Link to="/events" className="btn-secondary">
                  สำรวจกิจกรรม
                </Link>
              </div>
            </div>

            <div className="home-hero__visual order-2 animate-fade-up animate-delay-1">
              <NetworkDiagram />
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
              <h2 className="flow-how__title">เริ่มเชื่อมต่อยังไง</h2>
              <p className="flow-how__desc">
                สี่ขั้น ตั้งแต่บอกว่าคุณคือใคร จนได้คุยกับคนที่ใช่ ไม่ต้องรอรอบโครงการ
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
            title={showingPast ? 'โครงการที่ผ่านมา' : 'สนามจริงให้ลงมือทำ'}
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

      <HomeCtaSection />
    </div>
  )
}
