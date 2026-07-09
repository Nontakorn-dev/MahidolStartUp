import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Newspaper, ArrowRight, Sparkles } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { HomeHeroNav } from '../../components/layout/Navbar'
import { HomeCtaFooter } from '../../components/layout/Footer'
import { NetworkDiagram } from '../../components/home/NetworkDiagram'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { EventCardGrid } from '../../components/ui/EventCard'
import { NewsCardGrid } from '../../components/ui/NewsCard'
import { FeaturedStartupsSection } from '../../components/home/FeaturedStartupsSection'
import { PartnerLogoMarquee } from '../../components/home/PartnerLogoMarquee'
import { getUpcomingEvents } from '../../data/events'
import type { Post } from '../../types'

const flowSteps = [
  { step: '01', title: 'สร้างโปรไฟล์', desc: 'ระบุสิ่งที่มองหาและสิ่งที่ให้ได้' },
  { step: '02', title: 'ค้นหา / กรอง', desc: 'ตามประเภท อุตสาหกรรม หรือสังกัด' },
  { step: '03', title: 'ส่งคำขอ', desc: 'พร้อมข้อความสั้น ๆ ถึงอีกฝ่าย' },
  { step: '04', title: 'ตอบรับ', desc: 'เห็นช่องทางติดต่อกันทันที' },
]

export function HomePage() {
  const { data: posts = [] } = useQuery({
    queryKey: ['posts-featured'],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3)
      return (data ?? []) as Post[]
    },
  })

  const events = getUpcomingEvents(4)

  return (
    <div>
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-line bg-gradient-to-b from-ted-light/70 via-ted-mist/40 to-surface">
        <div className="wrap relative">
          <HomeHeroNav />

          <div className="grid items-center gap-5 pb-10 md:grid-cols-2 md:gap-12 md:pb-12 lg:pb-14">
            {/* SVG ขึ้นก่อนบนมือถือ — desktop อยู่ขวา */}
            <div className="order-1 -mx-2 animate-fade-up md:order-2 md:mx-0">
              <NetworkDiagram />
            </div>

            <div className="order-2 animate-fade-up animate-delay-1 text-center md:order-1 md:text-left">
              <div className="eyebrow">Est. 2018 · Supported by iNT, Mahidol University</div>
              <h1 className="mt-3 font-heading text-[clamp(1.65rem,6vw,2.75rem)] leading-[1.3] text-ink md:mt-4">
                เครือข่ายที่ทำให้ไอเดีย
                <br />
                กลายเป็น<span className="text-gold-deep"> สตาร์ตอัพจริง</span>
              </h1>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft md:mx-0 md:mt-5 md:text-[17px]">
                พื้นที่กลางของ Mahidol Startup Club ที่รวมข่าวสาร กิจกรรม และการจับคู่ทางธุรกิจไว้ในที่เดียว
                — เปิดให้ทั้งคนในมหิดลและพันธมิตรภายนอกเชื่อมต่อกันได้ตลอดปี
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:mt-7 md:justify-start">
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

      {/* Platform steps */}
      <section className="section-pad bg-gradient-to-b from-ted-light/35 to-ted-mist/20" id="matching">
        <div className="wrap">
          <SectionHeader
            eyebrow="MSC Connect"
            title="ขั้นตอนการใช้แพลตฟอร์ม"
            description="สร้างโปรไฟล์ ค้นหาคู่เชื่อมต่อ ส่งคำขอ และเริ่มคุยกันเมื่อทั้งสองฝ่ายตอบรับ"
          />

          <div className="flow-stepper gap-3 md:gap-0">
            {flowSteps.map((step, i) => (
              <div key={step.step} className="flex flex-1 items-stretch">
                <div className="card-elevated relative flex flex-1 flex-col p-5 md:rounded-none md:border-r-0 md:first:rounded-l-2xl md:last:rounded-r-2xl md:[&:not(:last-child)]:border-r-0">
                  <span className="font-mono text-2xl font-medium text-gold/40">{step.step}</span>
                  <b className="mt-2 block font-heading text-sm text-ink md:text-base">{step.title}</b>
                  <p className="mt-1 flex-1 text-sm text-ink-soft">{step.desc}</p>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className="hidden shrink-0 items-center px-2 text-gold-deep md:flex">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center md:text-left">
            <Link to="/match/discover" className="btn-secondary">
              เริ่มค้นหา Partner <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="section-pad bg-surface" id="events">
        <div className="wrap">
          <SectionHeader
            eyebrow="กิจกรรม & โครงการ"
            title="เปิดรับสมัครแล้ว"
            description="Talent Accelerator, Startup Thailand League, TED Youth และ Blue Horizon"
            actionHref="/events"
            actionLabel="ดูทั้งหมด"
          />
          <EventCardGrid events={events} />
        </div>
      </section>

      <FeaturedStartupsSection actionHref="/news" />

      {/* Posts */}
      <section className="section-pad bg-flow-bg">
        <div className="wrap">
          <SectionHeader
            eyebrow="ข่าวสารประชาสัมพันธ์"
            title="อัปเดตจากทีม PR"
            description="ข่าวสาร กิจกรรม และเรื่องราวความสำเร็จจากชมรม"
            actionHref="/news"
          />
          {posts.length === 0 ? (
            <div className="card-elevated py-16 text-center">
              <Newspaper className="mx-auto mb-3 h-10 w-10 text-line" />
              <p className="text-sm text-ink-soft">ยังไม่มีข่าวสาร</p>
            </div>
          ) : (
            <NewsCardGrid posts={posts} />
          )}
        </div>
      </section>

      <HomeCtaFooter />
    </div>
  )
}
