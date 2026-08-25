import { Link } from 'react-router-dom'
import { Rocket, Target, Users, BookOpen, Handshake, ArrowRight } from 'lucide-react'
import { PageHero } from '../../components/ui/PageHero'
import { SOCIAL_LINKS, SOCIAL_ICONS } from '../../lib/constants'

const WHAT_WE_DO = [
  {
    icon: Users,
    title: 'มาเจอคนที่คิดคล้ายกัน',
    desc: 'รวมนักศึกษาต่างคณะที่อยากลองสร้างอะไรของตัวเองมาไว้ที่เดียวกัน',
  },
  {
    icon: BookOpen,
    title: 'เวิร์กช็อปและการอบรม',
    desc: 'ตั้งแต่หาไอเดีย วางโมเดลธุรกิจ ไปจนถึงซ้อมนำเสนอให้คนฟังเข้าใจ',
  },
  {
    icon: Handshake,
    title: 'มีพี่เลี้ยงคอยแนะนำ',
    desc: 'เมนเทอร์ทั้งในและนอกมหาวิทยาลัยช่วยดูให้ตั้งแต่เริ่มจนทีมตั้งตัวได้',
  },
  {
    icon: Target,
    title: 'ได้ลงมือทำจริง',
    desc: 'เรียนรู้จากการทำโครงการและลงแข่งจริง ไม่ได้อยู่แค่ในห้องเรียน',
  },
]

const PROGRAMS = [
  { name: 'Mahidol Startup Thailand League', desc: 'เวทีแข่งขันสตาร์ตอัพระดับประเทศสำหรับนักศึกษา' },
  { name: 'Mahidol TED Youth Startup', desc: 'ทุนพัฒนาไอเดียและต้นแบบจาก TED Fund' },
  { name: 'MU InnoMatch', desc: 'งานจับคู่ธุรกิจระหว่างงานวิจัยกับภาคเอกชน' },
  { name: 'Mahidol Incubation Program', desc: 'โครงการบ่มเพาะธุรกิจนวัตกรรมโดย iNT' },
]

const CONTACTS = [
  { href: SOCIAL_LINKS.line, icon: SOCIAL_ICONS.line, label: 'Line OpenChat', value: 'เข้ากลุ่มมาคุยกันได้เลย' },
  { href: SOCIAL_LINKS.instagram, icon: SOCIAL_ICONS.instagram, label: 'Instagram', value: '@mahidolstartup_official' },
]

export function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="ก่อตั้งเมื่อมกราคม 2561"
        title="เกี่ยวกับ Mahidol Startup Club"
        description="ชมรมของนักศึกษามหิดลที่สนใจการสร้างธุรกิจ เทคโนโลยี และนวัตกรรม มาเจอกันเพื่อลงมือทำจริง"
      />

      <div className="wrap section-pad !pt-12">
        {/* พันธกิจ */}
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          <div>
            <div className="eyebrow">สิ่งที่เราตั้งใจทำ</div>
            <h2 className="mt-3 font-heading text-2xl leading-snug text-ink md:text-[1.75rem]">
              พาคนต่างคณะมาเจอกัน แล้วสร้างธุรกิจที่ทำได้จริง
            </h2>
            <p className="mt-4 leading-[1.85] text-ink-soft">
              ชมรมตั้งขึ้นเมื่อเดือนมกราคม 2561 โดยมี iNT (สถาบันบริหารจัดการเทคโนโลยีและนวัตกรรม)
              มหาวิทยาลัยมหิดล เป็นผู้สนับสนุน เราอยากให้นักศึกษาจากคณะต่าง ๆ ได้มาเจอกัน
              แล้วช่วยกันพัฒนาไอเดียให้กลายเป็นธุรกิจที่ไปต่อได้จริง ไม่ใช่แค่จบที่การนำเสนอ
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/events" className="btn-primary">ดูกิจกรรมของชมรม</Link>
              <Link to="/match" className="btn-secondary">รู้จัก MSC Connect</Link>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-ted-mist/60 p-6 md:p-7">
            <p className="font-heading text-sm font-semibold text-ink-soft">ข้อมูลชมรม</p>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-ink-soft">ก่อตั้ง</dt>
                <dd className="font-heading text-lg text-ink">มกราคม 2018</dd>
              </div>
              <div>
                <dt className="text-ink-soft">สังกัด</dt>
                <dd className="font-heading text-lg text-ink">มหาวิทยาลัยมหิดล</dd>
              </div>
              <div>
                <dt className="text-ink-soft">สนับสนุนโดย</dt>
                <dd className="font-heading text-lg leading-snug text-ink">
                  iNT — Institute for Technology and Innovation Management
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* สิ่งที่เราทำ */}
        <section className="mt-16 border-t border-line pt-12">
          <div className="eyebrow">สิ่งที่เราทำ</div>
          <h2 className="mt-3 font-heading text-2xl text-ink">เข้าชมรมแล้วได้อะไร</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {WHAT_WE_DO.map((item) => (
              <div key={item.title} className="rounded-2xl border border-line bg-surface p-6 transition-shadow hover:shadow-card">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-tint text-gold-deep">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* โครงการ */}
        <section className="mt-16 border-t border-line pt-12">
          <div className="eyebrow">เครือข่ายและความร่วมมือ</div>
          <h2 className="mt-3 font-heading text-2xl text-ink">โครงการที่เราร่วมจัด</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {PROGRAMS.map((p) => (
              <li key={p.name} className="flex gap-3 rounded-xl border border-line bg-surface p-5">
                <Rocket className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <div>
                  <p className="font-heading font-semibold text-ink">{p.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            to="/events"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ted-blue no-underline hover:underline"
          >
            ดูโครงการที่กำลังเปิดรับสมัคร <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* ติดต่อ */}
        <section className="mt-16 border-t border-line pt-12">
          <div className="eyebrow">ติดต่อเรา</div>
          <h2 className="mt-3 font-heading text-2xl text-ink">คุยกับทีมชมรม</h2>
          <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
            สงสัยเรื่องกิจกรรม อยากมาร่วมงานกับชมรม หรือสนใจมาเป็นเมนเทอร์ ทักมาช่องทางไหนก็ได้
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {CONTACTS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-line bg-surface p-5 no-underline transition-colors hover:border-gold/50"
              >
                <img src={c.icon} alt="" className="h-9 w-9 object-contain" width={36} height={36} />
                <div className="min-w-0">
                  <p className="font-heading font-semibold text-ink">{c.label}</p>
                  <p className="truncate text-sm text-ink-soft">{c.value}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
