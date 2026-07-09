import { Rocket, Target, Users, BookOpen, Handshake } from 'lucide-react'
import { PageHero } from '../../components/ui/PageHero'
import { SOCIAL_LINKS } from '../../lib/constants'

export function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="Since January 2018"
        title="เกี่ยวกับ Mahidol Startup Club"
        description="ชุมชนที่มหาวิทยาลัยมหิดลสำหรับผู้ที่สนใจ startup, entrepreneurship, technology และ innovation"
      />

      <div className="wrap section-pad !pt-12">
        <div className="card-elevated mb-6 p-6 md:p-8">
          <h2 className="mb-4 font-heading text-xl text-ink">พันธกิจ</h2>
          <p className="leading-relaxed text-ink-soft">
            ชมรมก่อตั้งขึ้นในเดือนมกราคม 2018 ด้วยการสนับสนุนจาก iNT (Institute for Technology
            and Innovation Management) มหาวิทยาลัยมหิดล เพื่อเป็นสะพานเชื่อมนักศึกษาจากสาขาต่าง ๆ
            มาร่วมกันพัฒนา Startup ที่เป็นรูปธรรมและมีโอกาสสำเร็จสูง
          </p>
        </div>

        <div className="mb-6 grid gap-5 sm:grid-cols-2">
          {[
            { icon: Users, title: 'รวมคนเก่งหลายสาขา', desc: 'เชื่อมนักศึกษาที่มี mindset นวัตกรรมและ entrepreneur' },
            { icon: BookOpen, title: 'Workshop & Training', desc: 'Idea generation, Business Model Canvas, Pitching' },
            { icon: Handshake, title: 'Mentorship', desc: 'คำแนะนำจาก mentor ทั้งภายในและภายนอกมหาวิทยาลัย' },
            { icon: Target, title: 'Practical Experience', desc: 'ประสบการณ์จริงในการสร้างและพัฒนา Startup' },
          ].map((item) => (
            <div key={item.title} className="card-elevated p-6">
              <item.icon className="mb-3 h-7 w-7 text-gold" />
              <h3 className="font-heading text-ink">{item.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="card-elevated mb-6 p-6 md:p-8">
          <h2 className="mb-4 font-heading text-xl text-ink">โครงการที่ร่วมมือ</h2>
          <ul className="space-y-2.5 text-ink-soft">
            {[
              'Mahidol Startup Thailand League',
              'Mahidol TED Youth Startup',
              'MU InnoMatch — Business Matching',
              'Mahidol Incubation Program',
            ].map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Rocket className="h-4 w-4 shrink-0 text-gold" /> {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="card-elevated p-6 md:p-8">
          <h2 className="mb-4 font-heading text-xl text-ink">ติดต่อเรา</h2>
          <div className="space-y-2 text-ink-soft">
            <p>Facebook: <a href={SOCIAL_LINKS.facebook} className="text-ted-sky no-underline hover:text-gold">Mahidol Startup</a></p>
            <p>Instagram: <a href={SOCIAL_LINKS.instagram} className="text-ted-sky no-underline hover:text-gold">@mahidolstartup_official</a></p>
            <p>Line OpenChat: <a href={SOCIAL_LINKS.line} className="text-ted-sky no-underline hover:text-gold">เข้าร่วมกลุ่ม</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}
