import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Globe, Users, Newspaper, ArrowRight, Sparkles } from 'lucide-react'
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

const pillars = [
  {
    icon: Globe,
    tag: 'Public hub',
    title: 'หน้าเว็บชมรม',
    desc: 'รวมข่าว กิจกรรม และช่องทางติดต่อไว้ในที่เดียว ให้คนนอกมหิดลตามงานชมรมได้ง่าย',
    color: 'bg-ted-light/80 text-ted-sky',
  },
  {
    icon: Newspaper,
    tag: 'PR CMS',
    title: 'โพสต์เองได้ ไม่ต้องรอ dev',
    desc: 'ทีม PR เขียนข่าว อัปโหลดรูป และเผยแพร่ได้ภายในไม่กี่นาที พร้อมดูตัวอย่างก่อนลงจริง',
    color: 'bg-gold-tint text-gold-deep',
  },
  {
    icon: Users,
    tag: 'Match hub',
    title: 'จับคู่ทางธุรกิจตลอดปี',
    desc: 'สตาร์ตอัพ เมนเทอร์ และนักลงทุน สร้างโปรไฟล์ ค้นหากัน และส่งคำขอเชื่อมต่ออย่างมีโครงสร้าง',
    color: 'bg-ink/5 text-ink',
  },
]

const flowSteps = [
  { step: '01', title: 'สร้างโปรไฟล์', desc: 'ระบุสิ่งที่มองหาและสิ่งที่ให้ได้' },
  { step: '02', title: 'ค้นหา / กรอง', desc: 'ตามประเภท อุตสาหกรรม หรือสังกัด' },
  { step: '03', title: 'ส่งคำขอ', desc: 'พร้อมข้อความสั้น ๆ ถึงอีกฝ่าย' },
  { step: '04', title: 'ตอบรับ', desc: 'เห็นช่องทางติดต่อกันทันที' },
]

const programs = [
  { title: 'Mahidol Startup Thailand League', desc: 'เวทีแข่งขันระดับประเทศสำหรับทีมมหิดล' },
  { title: 'Mahidol TED Youth Startup', desc: 'โครงการบ่มเพาะไอเดียรุ่นเยาว์' },
  { title: 'Mahidol Incubation Program', desc: 'พาไอเดียสู่ต้นแบบธุรกิจที่ใช้งานได้จริง' },
  { title: 'MU InnoMatch', desc: 'งาน business matching กับนักลงทุนและภาคธุรกิจ' },
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

      {/* Pillars */}
      <section className="section-pad bg-surface" id="pillars">
        <div className="wrap">
          <SectionHeader
            eyebrow="สามส่วนหลัก"
            title="แพลตฟอร์มเดียว ครบทั้งข่าวสารและเครือข่าย"
            description="ออกแบบมาให้ทีม PR โพสต์เองได้ และให้การจับคู่ธุรกิจเกิดขึ้นได้ทุกวัน ไม่ใช่แค่ในงานอีเวนต์"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {pillars.map((p) => (
              <article key={p.tag} className="card-elevated group p-6 md:p-8">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${p.color}`}>
                  <p.icon className="h-6 w-6" />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">{p.tag}</div>
                <h3 className="mt-2 font-heading text-lg text-ink md:text-xl">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.desc}</p>              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Matching flow */}
      <section className="section-pad bg-gradient-to-b from-ted-light/35 to-ted-mist/20" id="matching">
        <div className="wrap">
          <SectionHeader
            eyebrow="กลไกการจับคู่"
            title="ลดข้อความทักไปแบบไม่มีจุดหมาย"
            description='ทุกโปรไฟล์ต้องระบุชัดว่า "กำลังมองหาอะไร" และ "ให้อะไรได้" ก่อนส่งคำขอเชื่อมต่อ — ข้อมูลติดต่อจะแสดงก็ต่อเมื่อทั้งสองฝ่ายตอบรับ'
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

      {/* Programs */}
      <section className="section-pad" id="programs">
        <div className="wrap">
          <SectionHeader
            eyebrow="โครงการร่วมกับ iNT"
            title="สนามจริงสำหรับทดสอบไอเดีย"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {programs.map((p) => (
              <div
                key={p.title}
                className="card-elevated flex gap-4 p-5 md:p-6"
              >
                <div className="mt-1 h-full w-1 shrink-0 rounded-full bg-gradient-to-b from-gold/80 to-ted-sky/50" />
                <div>
                  <b className="block font-heading text-base text-ink md:text-lg">{p.title}</b>
                  <span className="mt-1 block text-sm text-ink-soft">{p.desc}</span>
                </div>
              </div>
            ))}
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
