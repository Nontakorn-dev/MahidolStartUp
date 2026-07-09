import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { BrandLogo } from '../../components/layout/BrandLogo'
import { AFFILIATION_LABELS } from '../../lib/constants'
import type { Affiliation } from '../../types'

export function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [affiliation, setAffiliation] = useState<Affiliation>('mu_student')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signUp(email, password, fullName)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <Card className="text-center">
          <p className="text-lg font-semibold text-green-600">สมัครสำเร็จ!</p>
          <p className="mt-2 text-sm text-ink-soft">กำลังพาไปหน้าเข้าสู่ระบบ...</p>
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
        <p className="mb-6 text-sm text-ink-soft">เข้าร่วม MU Startup Hub</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="ชื่อ-นามสกุล" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Input label="อีเมล" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="รหัสผ่าน" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
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
          มีบัญชีแล้ว? <Link to="/login" className="font-semibold text-ink no-underline hover:underline">เข้าสู่ระบบ</Link>
        </p>
      </Card>
    </div>
  )
}
