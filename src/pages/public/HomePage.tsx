import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { HomeHeroNav } from '../../components/layout/Navbar'
import { HomeCtaFooter } from '../../components/layout/Footer'
import { NetworkDiagram } from '../../components/home/NetworkDiagram'
import { formatDate, tiptapToText, excerpt } from '../../lib/utils'
import type { Post, Event } from '../../types'

const stats = [
  { num: '100+', lbl: 'โปรไฟล์ startup / mentor เป้าหมาย 6 เดือนแรก' },
  { num: '30+', lbl: 'การจับคู่ที่สำเร็จ' },
  { num: '30%', lbl: 'สัดส่วนโปรไฟล์จากภายนอกมหิดล' },
  { num: '80%', lbl: 'กิจกรรมที่ลงทะเบียนผ่านแพลตฟอร์ม' },
]

const pillars = [
  {
    tag: 'Public hub',
    title: 'หน้าเว็บชมรม',
    desc: 'รวมข่าว กิจกรรม และช่องทางติดต่อไว้ในที่เดียว ให้คนนอกมหิดลตามงานชมรมได้ง่ายกว่าไล่ดูในเฟซบุ๊กหรือไลน์',
  },
  {
    tag: 'PR CMS',
    title: 'โพสต์เองได้ ไม่ต้องรอ dev',
    desc: 'ทีม PR เข้าระบบเขียนข่าว อัปโหลดรูป และเผยแพร่ได้ภายในไม่กี่นาที พร้อมดูตัวอย่างก่อนลงจริง',
  },
  {
    tag: 'Match hub',
    title: 'จับคู่ทางธุรกิจตลอดปี',
    desc: 'สตาร์ตอัพ นักศึกษา เมนเทอร์ และนักลงทุน สร้างโปรไฟล์ ค้นหากันได้ และส่งคำขอเชื่อมต่ออย่างมีโครงสร้าง',
  },
]

const flowSteps = [
  { title: '1. สร้างโปรไฟล์', desc: 'ระบุสิ่งที่มองหาและสิ่งที่ให้ได้' },
  { title: '2. ค้นหา / กรอง', desc: 'ตามประเภท อุตสาหกรรม หรือสังกัด' },
  { title: '3. ส่งคำขอ', desc: 'พร้อมข้อความสั้น ๆ ถึงอีกฝ่าย' },
  { title: '4. ตอบรับ', desc: 'เห็นช่องทางติดต่อกันทันที' },
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

  const { data: events = [] } = useQuery({
    queryKey: ['events-upcoming'],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .gte('start_at', new Date().toISOString())
        .order('start_at', { ascending: true })
        .limit(3)
      return (data ?? []) as Event[]
    },
  })

  return (
    <div>
      {/* Hero */}
      <header className="overflow-hidden bg-ink text-paper">
        <div className="wrap pt-16">
          <HomeHeroNav />

          <div className="grid items-center gap-10 pb-10 md:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="eyebrow">Est. 2018 · Supported by iNT, Mahidol University</div>
              <h1 className="mt-4 font-heading text-[32px] leading-[1.28] text-white md:text-[44px]">
                เครือข่ายที่ทำให้ไอเดีย
                <br />
                กลายเป็น<span className="text-gold"> สตาร์ตอัพจริง</span>
              </h1>
              <p className="mt-5 max-w-[440px] text-base text-hero-text">
                พื้นที่กลางของ Mahidol Startup Club ที่รวมข่าวสาร กิจกรรม และการจับคู่ทางธุรกิจไว้ในที่เดียว
                — เปิดให้ทั้งคนในมหิดลและพันธมิตรภายนอกเชื่อมต่อกันได้ตลอดปี ไม่ใช่แค่ในวันงาน
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/match/startup/new"
                  className="inline-block rounded-md bg-gold px-5 py-3 text-sm font-medium text-ink no-underline hover:bg-gold-tint"
                >
                  สร้างโปรไฟล์ของคุณ
                </Link>
                <a
                  href="#programs"
                  className="inline-block rounded-md border border-[#3E4E6B] px-5 py-3 text-sm font-medium text-[#EDEFF3] no-underline hover:border-gold hover:text-gold"
                >
                  ดูกิจกรรมทั้งหมด
                </a>
              </div>
            </div>
            <NetworkDiagram />
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-ink-border">
          <div className="wrap !px-0">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={s.num}
                  className={`px-8 py-5 ${i < stats.length - 1 ? 'border-r border-ink-border max-md:[&:nth-child(odd)]:border-r max-md:[&:nth-child(even)]:border-r-0 md:border-r' : ''}`}
                >
                  <div className="font-heading text-[28px] font-semibold text-gold">{s.num}</div>
                  <div className="mt-1 text-xs text-ink-muted">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Pillars */}
      <section className="py-[88px]" id="pillars">
        <div className="wrap">
          <div className="mb-12 max-w-[560px]">
            <div className="eyebrow">สามส่วนหลัก</div>
            <h2 className="mt-2.5 font-heading text-[28px] text-ink">แพลตฟอร์มเดียว ครบทั้งข่าวสารและเครือข่าย</h2>
            <p className="mt-3 text-[15px] text-muted">
              ออกแบบมาให้ทีม PR โพสต์เองได้ และให้การจับคู่ธุรกิจเกิดขึ้นได้ทุกวัน ไม่ใช่แค่ในงานอีเวนต์
            </p>
          </div>
          <div className="grid gap-px border border-line bg-line md:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.tag} className="bg-paper px-7 py-8">
                <div className="font-mono text-[11px] uppercase tracking-wide text-gold-deep">{p.tag}</div>
                <h3 className="mt-3.5 font-heading text-[19px] text-ink">{p.title}</h3>
                <p className="mt-2.5 text-sm text-muted">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Matching flow */}
      <section className="bg-flow-bg py-[88px]" id="matching">
        <div className="wrap">
          <div className="mb-12 max-w-[560px]">
            <div className="eyebrow">กลไกการจับคู่</div>
            <h2 className="mt-2.5 font-heading text-[28px] text-ink">ลดข้อความทักไปแบบไม่มีจุดหมาย</h2>
            <p className="mt-3 text-[15px] text-muted">
              ทุกโปรไฟล์ต้องระบุชัดว่า &quot;กำลังมองหาอะไร&quot; และ &quot;ให้อะไรได้&quot; ก่อนส่งคำขอเชื่อมต่อ
              — ข้อมูลติดต่อจะแสดงก็ต่อเมื่อทั้งสองฝ่ายตอบรับ
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-0">
            {flowSteps.map((step, i) => (
              <div key={step.title} className="flex flex-1 items-center max-md:min-w-full max-md:mb-2">
                <div className="min-w-[150px] flex-1 rounded-lg border border-line bg-paper px-5 py-4 text-[13.5px]">
                  <b className="mb-1 block font-heading text-sm">{step.title}</b>
                  {step.desc}
                </div>
                {i < flowSteps.length - 1 && (
                  <span className="hidden shrink-0 px-3.5 text-lg text-gold-deep md:inline">→</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              to="/match/discover"
              className="inline-block rounded-md bg-ink px-5 py-3 text-sm font-medium text-paper no-underline hover:bg-ink-soft"
            >
              เริ่มค้นหา Partner →
            </Link>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-[88px]" id="programs">
        <div className="wrap">
          <div className="mb-12 max-w-[560px]">
            <div className="eyebrow">โครงการร่วมกับ iNT</div>
            <h2 className="mt-2.5 font-heading text-[28px] text-ink">สนามจริงสำหรับทดสอบไอเดีย</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {programs.map((p) => (
              <div key={p.title} className="border-l-[3px] border-gold py-1.5 pl-[18px]">
                <b className="block font-heading text-[15px] text-ink">{p.title}</b>
                <span className="text-[13px] text-muted">{p.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live events */}
      <section className="border-t border-line bg-paper py-[88px]" id="events">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="eyebrow">กิจกรรมล่าสุด</div>
              <h2 className="mt-2 font-heading text-[28px] text-ink">ที่กำลังจะมา</h2>
            </div>
            <Link to="/events" className="text-sm text-gold-deep no-underline hover:text-gold">ดูทั้งหมด →</Link>
          </div>
          {events.length === 0 ? (
            <p className="text-sm text-muted">ยังไม่มีกิจกรรมที่กำลังจะมา — ติดตามข่าวสารเร็ว ๆ นี้</p>
          ) : (
            <div className="grid gap-px border border-line bg-line md:grid-cols-3">
              {events.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.slug}`}
                  className="block bg-paper px-6 py-6 no-underline transition-colors hover:bg-gold-tint/30"
                >
                  <div className="font-mono text-[11px] uppercase tracking-wide text-gold-deep">
                    {formatDate(event.start_at)}
                  </div>
                  <h3 className="mt-2 font-heading text-base text-ink">{event.title}</h3>
                  {event.location && <p className="mt-1 text-[13px] text-muted">{event.location}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Live posts */}
      <section className="border-t border-line bg-flow-bg py-[88px]">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="eyebrow">ข่าวสาร</div>
              <h2 className="mt-2 font-heading text-[28px] text-ink">จากทีม PR</h2>
            </div>
            <Link to="/posts" className="text-sm text-gold-deep no-underline hover:text-gold">ดูทั้งหมด →</Link>
          </div>
          {posts.length === 0 ? (
            <p className="text-sm text-muted">ยังไม่มีข่าวสาร</p>
          ) : (
            <div className="grid gap-px border border-line bg-line md:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.slug}`}
                  className="block bg-paper px-6 py-6 no-underline transition-colors hover:bg-gold-tint/30"
                >
                  {post.category && (
                    <div className="font-mono text-[11px] uppercase tracking-wide text-gold-deep">{post.category}</div>
                  )}
                  <h3 className="mt-2 font-heading text-base text-ink">{post.title}</h3>
                  <p className="mt-2 text-[13px] text-muted">{excerpt(tiptapToText(post.content), 100)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <HomeCtaFooter />
    </div>
  )
}
