export function thaiAuthError(message: string) {
  const m = message.toLowerCase()
  if (m.includes('invalid login') || m.includes('invalid credentials')) {
    return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  }
  if (m.includes('email not confirmed')) {
    return 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ — ตรวจกล่องจดหมายของคุณ'
  }
  if (m.includes('already registered') || m.includes('already been registered') || m.includes('user already')) {
    return 'อีเมลนี้มีบัญชีอยู่แล้ว — เข้าสู่ระบบได้เลย'
  }
  if (m.includes('password should') || m.includes('password is') || m.includes('weak password')) {
    return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
  }
  if (m.includes('rate limit') || m.includes('too many')) {
    return 'พยายามบ่อยเกินไป รอสักครู่แล้วลองใหม่'
  }
  if (m.includes('failed to fetch') || m.includes('network') || m.includes('fetch')) {
    return 'เชื่อมต่อระบบไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่'
  }
  if (m.includes('invalid api') || m.includes('placeholder')) {
    return 'ระบบล็อกอินยังไม่พร้อม — ติดต่อทีมชมรม'
  }
  return message
}
