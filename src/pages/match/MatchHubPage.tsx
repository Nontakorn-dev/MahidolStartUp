import { Link } from 'react-router-dom'
import { Rocket, GraduationCap, Search } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../contexts/AuthContext'

export function MatchHubPage() {
  const { user } = useAuth()

  return (
    <div>
      <section className="bg-ink py-16 text-paper">
        <div className="wrap text-center">
          <div className="eyebrow">Business Matching</div>
          <h1 className="mt-2 font-heading text-3xl md:text-4xl">Match Hub</h1>
          <p className="mx-auto mt-4 max-w-2xl text-hero-text">
            แพลตฟอร์ม business matching ของ Mahidol Startup Club
            เชื่อม startup, mentor, investor และ partner ทั้งในมหิดลและภายนอก
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/match/discover"
              className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-3 text-sm font-medium text-ink no-underline hover:bg-gold-tint"
            >
              <Search className="h-4 w-4" /> ค้นหา Partner
            </Link>
            {user ? (
              <Link
                to="/match/connections"
                className="inline-block rounded-md border border-[#3E4E6B] px-5 py-3 text-sm text-[#EDEFF3] no-underline hover:border-gold"
              >
                การเชื่อมต่อของฉัน
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-block rounded-md border border-[#3E4E6B] px-5 py-3 text-sm text-[#EDEFF3] no-underline hover:border-gold"
              >
                สมัครเพื่อเริ่มต้น
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="wrap py-16">
        <div className="mb-10 text-center">
          <div className="eyebrow">เริ่มต้นอย่างไร</div>
          <h2 className="mt-2 font-heading text-2xl text-ink">สี่ขั้นตอนสู่การเชื่อมต่อ</h2>
        </div>
        <div className="grid gap-px border border-line bg-line md:grid-cols-4">
          {[
            { step: '1', title: 'สร้างโปรไฟล์', desc: 'ลงทะเบียนและสร้าง Startup หรือ Mentor profile' },
            { step: '2', title: 'ค้นหา & Filter', desc: 'ค้นหาคนที่ fit กับ industry และ stage' },
            { step: '3', title: 'เชื่อมต่อ', desc: 'ส่งคำขอเชื่อมต่อพร้อมข้อความ' },
            { step: '4', title: 'ตอบรับ', desc: 'ดูข้อมูลติดต่อหลัง accept' },
          ].map((item) => (
            <div key={item.step} className="bg-paper px-6 py-8 text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold-tint font-heading text-lg font-semibold text-ink">
                {item.step}
              </div>
              <h3 className="font-heading text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-flow-bg py-16">
        <div className="wrap">
          <div className="mb-10 text-center">
            <div className="eyebrow">สร้างโปรไฟล์</div>
            <h2 className="mt-2 font-heading text-2xl text-ink">เลือกประเภทของคุณ</h2>
          </div>
          <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
            <Link to={user ? '/match/startup/new' : '/login'} className="no-underline">
              <Card hover className="text-center">
                <Rocket className="mx-auto mb-3 h-9 w-9 text-gold" />
                <h3 className="font-heading text-ink">Startup Profile</h3>
                <p className="mt-1 text-sm text-muted">สำหรับผู้มีไอเดียหรือโปรเจกต์ startup</p>
              </Card>
            </Link>
            <Link to={user ? '/match/mentor/new' : '/login'} className="no-underline">
              <Card hover className="text-center">
                <GraduationCap className="mx-auto mb-3 h-9 w-9 text-gold" />
                <h3 className="font-heading text-ink">Mentor / Partner</h3>
                <p className="mt-1 text-sm text-muted">สำหรับ mentor, investor หรือ industry partner</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
