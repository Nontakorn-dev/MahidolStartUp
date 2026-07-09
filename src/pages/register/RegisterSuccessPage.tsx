import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Clock } from 'lucide-react'
import { PageHero } from '../../components/ui/PageHero'

export function RegisterSuccessPage() {
  const [params] = useSearchParams()
  const type = params.get('type') ?? 'startup'
  const isStartup = type === 'startup'

  return (
    <div>
      <PageHero
        eyebrow="MSC Connect"
        title="รับข้อมูลแล้ว!"
        description={
          isStartup
            ? 'ทีมงานจะช่วยจับคู่คุณกับคนที่ใช่ภายใน 7 วันทำการ'
            : 'ทีมงานจะตรวจสอบและติดต่อกลับภายใน 7 วันทำการ'
        }
      />

      <div className="wrap section-pad !pt-10">
        <div className="mx-auto max-w-lg text-center">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-600" />

          <div className="card-elevated space-y-4 p-8 text-left">
            <h2 className="font-heading text-lg text-ink">ขั้นตอนถัดไป</h2>
            <ol className="space-y-3 text-sm text-ink-soft">
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>ทีม Core Team ตรวจสอบข้อมูลของคุณ (1–2 วันทำการ)</span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>
                  {isStartup
                    ? 'ทีมงานค้นหา Partner ที่ตรงกับความต้องการของคุณ'
                    : 'ทีมงานอนุมัติและเพิ่มคุณเข้า matching pool'}
                </span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>ติดต่อกลับทางอีเมล / Line ที่ระบุไว้</span>
              </li>
            </ol>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-secondary">กลับหน้าแรก</Link>
            <Link to="/news" className="btn-primary">ดูข่าวสาร</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
