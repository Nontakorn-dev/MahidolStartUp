import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router ไม่รีเซ็ต scroll ให้เอง — ถ้าไม่มีตัวนี้ กดการ์ดจากกลางหน้า
 * แล้วหน้ารายละเอียดจะเปิดค้างอยู่กลางหน้าเหมือนกัน (ดูเหมือนเนื้อหาไม่ตรง)
 */
export function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, search])

  return null
}
