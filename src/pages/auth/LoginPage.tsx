import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <h1 className="mb-1 font-heading text-2xl text-ink">เข้าสู่ระบบ</h1>
        <p className="mb-6 text-sm text-ink-soft">MU Startup Hub</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="อีเมล" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="รหัสผ่าน" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-ink-soft">
          ยังไม่มีบัญชี? <Link to="/register" className="font-semibold text-ink no-underline hover:underline">สมัครสมาชิก</Link>
        </p>
      </Card>
    </div>
  )
}
