import { Rocket, Target, Users, BookOpen, Handshake } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { SOCIAL_LINKS } from '../../lib/constants'

export function AboutPage() {
  return (
    <div className="wrap py-12">
      <div className="mb-10 max-w-2xl">
        <div className="eyebrow">Since January 2018</div>
        <h1 className="mt-2 font-heading text-3xl text-ink md:text-4xl">เกี่ยวกับ Mahidol Startup Club</h1>
        <p className="mt-4 text-muted">
          ชุมชนที่มหาวิทยาลัยมหิดลสำหรับผู้ที่สนใจ startup, entrepreneurship,
          technology และ innovation
        </p>
      </div>

      <Card className="mb-6">
        <h2 className="mb-4 font-heading text-xl text-ink">พันธกิจ</h2>
        <p className="leading-relaxed text-muted">
          ชมรมก่อตั้งขึ้นในเดือนมกราคม 2018 ด้วยการสนับสนุนจาก iNT (Institute for Technology
          and Innovation Management) มหาวิทยาลัยมหิดล เพื่อเป็นสะพานเชื่อมนักศึกษาจากสาขาต่าง ๆ
          มาร่วมกันพัฒนา Startup ที่เป็นรูปธรรมและมีโอกาสสำเร็จสูง
        </p>
      </Card>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {[
          { icon: Users, title: 'รวมคนเก่งหลายสาขา', desc: 'เชื่อมนักศึกษาที่มี mindset นวัตกรรมและ entrepreneur' },
          { icon: BookOpen, title: 'Workshop & Training', desc: 'Idea generation, Business Model Canvas, Pitching' },
          { icon: Handshake, title: 'Mentorship', desc: 'คำแนะนำจาก mentor ทั้งภายในและภายนอกมหาวิทยาลัย' },
          { icon: Target, title: 'Practical Experience', desc: 'ประสบการณ์จริงในการสร้างและพัฒนา Startup' },
        ].map((item) => (
          <Card key={item.title}>
            <item.icon className="mb-3 h-7 w-7 text-gold" />
            <h3 className="font-heading text-ink">{item.title}</h3>
            <p className="mt-1 text-sm text-muted">{item.desc}</p>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <h2 className="mb-4 font-heading text-xl text-ink">โครงการที่ร่วมมือ</h2>
        <ul className="space-y-2 text-muted">
          <li className="flex items-center gap-2"><Rocket className="h-4 w-4 text-gold" /> Mahidol Startup Thailand League</li>
          <li className="flex items-center gap-2"><Rocket className="h-4 w-4 text-gold" /> Mahidol TED Youth Startup</li>
          <li className="flex items-center gap-2"><Rocket className="h-4 w-4 text-gold" /> MU InnoMatch — Business Matching</li>
          <li className="flex items-center gap-2"><Rocket className="h-4 w-4 text-gold" /> Mahidol Incubation Program</li>
        </ul>
      </Card>

      <Card>
        <h2 className="mb-4 font-heading text-xl text-ink">ติดต่อเรา</h2>
        <div className="space-y-2 text-muted">
          <p>Facebook: <a href={SOCIAL_LINKS.facebook} className="text-gold-deep no-underline hover:text-gold">Mahidol Startup</a></p>
          <p>Instagram: <a href={SOCIAL_LINKS.instagram} className="text-gold-deep no-underline hover:text-gold">@mahidolstartup_official</a></p>
          <p>Line OpenChat: <a href={SOCIAL_LINKS.line} className="text-gold-deep no-underline hover:text-gold">เข้าร่วมกลุ่ม</a></p>
        </div>
      </Card>
    </div>
  )
}
