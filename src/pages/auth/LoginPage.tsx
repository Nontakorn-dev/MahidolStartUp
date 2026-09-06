import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { isSupabaseConfigured } from '../../lib/supabase'
import { thaiAuthError } from '../../lib/auth-errors'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { BrandLogo } from '../../components/layout/BrandLogo'

function redirectFrom(location: ReturnType<typeof useLocation>) {
  const stateFrom = (location.state as { from?: { pathname: string } } | null)?.from?.pathname
  const queryFrom = new URLSearchParams(location.search).get('redirect')
  return stateFrom || queryFrom || '/'
}

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, user, loading: authLoading } = useAuth()
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
      setError('ระบบล็อกอินยังไม่พร้อม — ติดต่อทีมชมรมให้ตั้งค่าฐานข้อมูลก่อน')
      return
    }
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(thaiAuthError(error.message))
    } else {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <BrandLogo linkToHome size="auth" />
        </div>
        <h1 className="mb-1 font-heading text-2xl text-ink">เข้าสู่ระบบ</h1>
        <p className="mb-6 text-sm text-ink-soft">
          {from.startsWith('/events/') ? 'เข้าสู่ระบบเพื่อสมัครและหาทีมในโครงการ' : 'MU Startup Hub'}
        </p>

        {!isSupabaseConfigured && (
          <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            ยังไม่ได้เชื่อม Supabase — คัดลอก `.env.example` เป็น `.env` แล้วใส่ URL กับ anon key
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-ink-soft">
          ยังไม่มีบัญชี?{' '}
          <Link
            to="/register"
            state={{ from: { pathname: from } }}
            className="font-semibold text-ink no-underline hover:underline"
          >
            สมัครสมาชิก
          </Link>
        </p>
      </Card>
    </div>
  )
}
