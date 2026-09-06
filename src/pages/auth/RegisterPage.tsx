import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { isSupabaseConfigured } from '../../lib/supabase'
import { thaiAuthError } from '../../lib/auth-errors'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { BrandLogo } from '../../components/layout/BrandLogo'
import { AFFILIATION_LABELS } from '../../lib/constants'
import type { Affiliation } from '../../types'

function redirectFrom(location: ReturnType<typeof useLocation>) {
  const stateFrom = (location.state as { from?: { pathname: string } } | null)?.from?.pathname
  const queryFrom = new URLSearchParams(location.search).get('redirect')
  return stateFrom || queryFrom || '/'
}

export function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [affiliation, setAffiliation] = useState<Affiliation>('mu_student')
  const [error, setError] = useState('')
  const [needConfirm, setNeedConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = redirectFrom(location)

  useEffect(() => {
    if (!authLoading && user) navigate(from, { replace: true })
  }, [authLoading, user, from, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!isSupabaseConfigured) {
      setError('ระบบสมัครสมาชิกยังไม่พร้อม — ติดต่อทีมชมรมให้ตั้งค่าฐานข้อมูลก่อน')
      return
    }
    setLoading(true)
    const { error, session } = await signUp(email, password, fullName, affiliation)
    setLoading(false)
    if (error) {
      setError(thaiAuthError(error.message))
      return
    }
    if (session) {
      navigate(from, { replace: true })
      return
    }
    setNeedConfirm(true)
  }

  if (needConfirm) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <p className="text-lg font-semibold text-ink">สมัครสำเร็จ</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            ถ้าโปรเจกต์เปิดยืนยันอีเมล ให้เปิดลิงก์ในกล่องจดหมายก่อน แล้วค่อยเข้าสู่ระบบ
            ถ้าไม่ได้รับเมล ให้ลองเข้าสู่ระบบด้วยอีเมลและรหัสผ่านที่เพิ่งตั้งไว้ได้เลย
          </p>
          <Link
            to="/login"
            state={{ from: { pathname: from } }}
            className="btn-primary mt-6"
          >
            ไปหน้าเข้าสู่ระบบ
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <BrandLogo linkToHome size="auth" />
        </div>
        <h1 className="mb-1 font-heading text-2xl text-ink">สมัครสมาชิก</h1>
        <p className="mb-6 text-sm text-ink-soft">
          {from.startsWith('/events/')
            ? 'สร้างบัญชีเพื่อสมัครโครงการและให้คนอื่นค้นพบคุณ'
            : 'เข้าร่วม MU Startup Hub'}
        </p>

        {!isSupabaseConfigured && (
          <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            ยังไม่ได้เชื่อม Supabase — คัดลอก `.env.example` เป็น `.env` แล้วใส่ URL กับ anon key
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="ชื่อ-นามสกุล"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="อีเมล"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="รหัสผ่าน"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            hint="อย่างน้อย 6 ตัวอักษร"
          />
          <Select
            label="สังกัด"
            value={affiliation}
            onChange={(v) => setAffiliation(v as Affiliation)}
            options={Object.entries(AFFILIATION_LABELS).map(([value, label]) => ({ value, label }))}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-ink-soft">
          มีบัญชีแล้ว?{' '}
          <Link
            to="/login"
            state={{ from: { pathname: from } }}
            className="font-semibold text-ink no-underline hover:underline"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </Card>
    </div>
  )
}
