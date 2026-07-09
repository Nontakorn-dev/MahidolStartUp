export interface ClubEvent {
  id: string
  slug: string
  title: string
  shortTitle: string
  tagline: string
  coverImage: string
  category: string
  status: 'open' | 'upcoming' | 'closed'
  deadline: string
  deadlineLabel: string
  startAt: string
  location: string
  registrationUrl: string | null
  highlights: string[]
  body: string[]
  eligibility?: string[]
  roles?: string[]
  organizer: string
}

export const CLUB_EVENTS: ClubEvent[] = [
  {
    id: 'tap-2026',
    slug: 'talent-accelerator-program-2026',
    title: 'Talent Accelerator Program 2026',
    shortTitle: 'Talent Accelerator',
    tagline: 'เปิดรับสมัคร Core Team รุ่นใหม่ — ปีแรกที่ได้ร่วมปฏิบัติงานกับ iNT Mahidol',
    coverImage: '/content/TalentAcceleratorProgram.png',
    category: 'Core Team',
    status: 'open',
    deadline: '2026-12-31',
    deadlineLabel: 'เปิดรับสมัครแล้ว',
    startAt: '2026-01-01',
    location: 'Mahidol University · iNT',
    registrationUrl: null,
    organizer: 'Mahidol Startup Club × iNT',
    roles: ['Finance', 'Operation', 'Partnership', 'Content', 'Graphic', 'Video', 'Activity'],
    highlights: [
      'ร่วมปฏิบัติงานกับ iNT Mahidol ตลอดโครงการ',
      'จัด Hackathon, Workshop และกิจกรรม Startup & Innovation',
      'สร้าง Portfolio จาก Project จริงตลอด 1 ปี',
      'เรียนรู้จากผู้ประกอบการและ Ecosystem ของมหาวิทยาลัย',
    ],
    body: [
      'ปีนี้เป็นปีแรกที่ Talent Accelerator Program เปิดโอกาสให้ Core Team ได้ร่วมปฏิบัติงานกับ iNT Mahidol ตลอดโครงการ ผ่านการจัด Hackathon, Workshop และกิจกรรมด้าน Startup & Innovation ของมหาวิทยาลัย',
      'ไม่ต้องมีไอเดีย Startup ไม่ต้องเคยจัดงาน ไม่ต้องมีประสบการณ์ — ขอแค่มีไฟ พร้อมเรียนรู้ และกล้าลงมือทำ',
      'ตลอดระยะเวลา 1 ปี คุณจะได้ทำงานใน Project จริง สร้าง Portfolio และพัฒนาทักษะการทำงานร่วมกับทีม รวมถึงมีโอกาสเรียนรู้จากผู้ประกอบการ พาร์ทเนอร์ และ Ecosystem ด้าน Startup & Innovation ของมหาวิทยาลัย',
    ],
  },
  {
    id: 'stl-2026',
    slug: 'mahidol-startup-thailand-league-2026',
    title: 'Mahidol Startup Thailand League 2026',
    shortTitle: 'Startup Thailand League',
    tagline: 'เวทีแข่งขัน Startup สำหรับนักศึกษามหิดล — ทุนต่อยอด เมนเทอร์ และเครือข่าย',
    coverImage: '/content/STL2025-01.jpg',
    category: 'Competition',
    status: 'open',
    deadline: '2026-03-15',
    deadlineLabel: 'สมัครถึง 15 มี.ค. 2569',
    startAt: '2026-03-15',
    location: 'Mahidol University',
    registrationUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSfGMz8HAaq0f4u2FOuc0u2tF95_7kf502WhRQzbiwQiyAmArw/viewform',
    organizer: 'iNT Mahidol',
    eligibility: [
      'นักศึกษาระดับปริญญาตรี – ปริญญาเอก ทุกสาขา',
      'ทีมละ 3–5 คน',
      'มีความสนใจในธุรกิจ Startup และมีไอเดียที่พร้อมจะต่อยอด',
    ],
    highlights: [
      'ทุนต่อยอดไอเดีย',
      'คำแนะนำจากที่ปรึกษา / ผู้เชี่ยวชาญ',
      'พบปะ แลกเปลี่ยนไอเดีย สร้างเครือข่ายความร่วมมือ',
    ],
    body: [
      'สถาบันบริหารจัดการเทคโนโลยีและนวัตกรรม (iNT) เชิญชวนนักศึกษามหาวิทยาลัยมหิดลที่มีไอเดียสร้างสรรค์ อยากสร้างธุรกิจของตัวเอง เข้าร่วมโครงการ Mahidol Startup Thailand League 2026',
      'โอกาสที่จะได้รับ: ทุนต่อยอดไอเดีย คำแนะนำจากที่ปรึกษา/ผู้เชี่ยวชาญ และพบปะแลกเปลี่ยนไอเดียเพื่อสร้างเครือข่ายความร่วมมือต่าง ๆ',
    ],
  },
  {
    id: 'ted-2026',
    slug: 'mahidol-ted-youth-startup-2026',
    title: 'Mahidol TED Youth Startup 2026',
    shortTitle: 'TED Youth Startup',
    tagline: 'ทุนพัฒนาไอเดียและต้นแบบสูงสุด 1.5 ล้านบาท สำหรับนิสิต–นักศึกษา และบัณฑิตจบใหม่',
    coverImage: '/content/Mahidol-TED.jpg',
    category: 'Funding',
    status: 'open',
    deadline: '2026-02-28',
    deadlineLabel: 'สมัครถึง 28 ก.พ. 2569',
    startAt: '2026-02-28',
    location: 'TED Fund × Mahidol',
    registrationUrl: 'https://forms.gle/tt4BjaRnfRyefmjeA',
    organizer: 'TED Fund × Mahidol',
    eligibility: [
      'นิสิต–นักศึกษา และบัณฑิตจบใหม่ไม่เกิน 5 ปี',
    ],
    highlights: [
      'ทุนสนับสนุนสูงสุด 1.5 ล้านบาท',
      'Mentoring จากผู้เชี่ยวชาญ',
      'Co-working Space และสนับสนุนด้านธุรกิจ',
      'พัฒนาต้นแบบ (Prototyping) และเตรียม Proposal',
    ],
    body: [
      'Mahidol TED Youth Startup 2026 ครั้งที่ 2 เปิดรับสมัครแล้ว — โครงการสนับสนุนนิสิต นักศึกษา และบัณฑิตจบใหม่ เพื่อพัฒนาธุรกิจบนฐานเทคโนโลยีและนวัตกรรม',
      'ผู้เข้าร่วมจะได้รับ Funding สำหรับพัฒนาไอเดียและต้นแบบ Mentoring จากผู้เชี่ยวชาญ พื้นที่ Co-working Space การสนับสนุนด้านธุรกิจ การพัฒนาต้นแบบ (Prototyping) และการเตรียม Proposal ให้พร้อมยื่นทุน',
    ],
  },
  {
    id: 'blue-horizon-2026',
    slug: 'blue-horizon-incubation-2026',
    title: 'Blue Horizon by iNT',
    shortTitle: 'Blue Horizon',
    tagline: 'Mahidol Incubation Program 2026 — เชื่อมคน เทคโนโลยี และโอกาสทางธุรกิจ',
    coverImage: '/content/BlueHorizon.jpeg',
    category: 'Incubation',
    status: 'open',
    deadline: '2026-06-20',
    deadlineLabel: 'สมัครถึง 20 มิ.ย. 2569',
    startAt: '2026-06-20',
    location: 'iNT Mahidol',
    registrationUrl: 'https://int.mahidol.ac.th/2026/05/25/blue-horizon/',
    organizer: 'iNT Mahidol',
    eligibility: [
      'บุคลากรภายในมหาวิทยาลัยมหิดล',
      'บุคคลทั่วไป',
    ],
    highlights: [
      'สร้างทีม Startup ที่แข็งแรง',
      'เชื่อมต่อเครือข่ายระดับสากลและพันธมิตรธุรกิจ',
      'เรียนรู้การพัฒนาธุรกิจจากผู้เชี่ยวชาญตัวจริง',
      'โอกาสรับทุนสนับสนุนกว่า 500,000 บาท',
    ],
    body: [
      'Blue Horizon by iNT — Mahidol Incubation Program 2026 เป็นโครงการบ่มเพาะที่จะช่วยเชื่อมคน เทคโนโลยี และโอกาสทางธุรกิจ เพื่อเปลี่ยนไอเดียนวัตกรรมให้เติบโตสู่ตลาดจริง',
      'ไม่ว่าคุณจะมีไอเดีย งานวิจัย เทคโนโลยี นวัตกรรม หรือทักษะที่อยากต่อยอดให้เกิดขึ้นจริง นี่คือพื้นที่สำหรับคุณ',
      'เปิดรับสมัครทั้งบุคลากรภายในมหาวิทยาลัยมหิดล และบุคคลทั่วไป',
    ],
  },
]

export function getEventBySlug(slug: string) {
  return CLUB_EVENTS.find((e) => e.slug === slug)
}

export function getUpcomingEvents(limit?: number) {
  const sorted = [...CLUB_EVENTS].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
  )
  return limit ? sorted.slice(0, limit) : sorted
}
