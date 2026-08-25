import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Clock } from 'lucide-react'

export function RegisterSuccessPage() {
  const [params] = useSearchParams()
  const type = params.get('type') ?? 'startup'
  const isStartup = type === 'startup'

  return (
    <div className="wrap section-pad">
      <div className="mx-auto max-w-lg text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-600" />
        <h1 className="font-heading text-2xl text-ink md:text-3xl">ได้รับข้อมูลแล้ว</h1>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-soft">
          {isStartup
            ? 'ทีมงานจะช่วยมองหาคนที่เข้ากับทีมคุณ แล้วติดต่อกลับภายใน 7 วันทำการ'
            : 'ทีมงานจะตรวจสอบข้อมูลแล้วติดต่อกลับภายใน 7 วันทำการ'}
        </p>

        <div className="card-elevated mt-8 space-y-4 p-8 text-left">
          <h2 className="font-heading text-lg text-ink">หลังจากนี้จะเกิดอะไรขึ้น</h2>
          <ol className="space-y-3.5 text-sm leading-relaxed text-ink-soft">
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>Core Team อ่านข้อมูลที่คุณกรอก ใช้เวลาราว 1–2 วันทำการ</span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>
                {isStartup
                  ? 'ทีมงานมองหาพาร์ทเนอร์ที่ตรงกับสิ่งที่คุณกำลังต้องการ'
                  : 'ทีมงานยืนยันข้อมูลแล้วเพิ่มชื่อคุณเข้ารายชื่อพาร์ทเนอร์'}
              </span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>ติดต่อกลับทางอีเมลหรือ Line ที่คุณให้ไว้</span>
            </li>
          </ol>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-secondary">กลับหน้าแรก</Link>
          <Link to="/events" className="btn-primary">ดูกิจกรรมที่เปิดรับ</Link>
        </div>
      </div>
    </div>
  )
}
