export function NetworkDiagram() {
  return (
    <div className="relative h-[260px] md:h-[380px]">
      <svg viewBox="0 0 420 380" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <line x1="210" y1="190" x2="70" y2="70" stroke="#3E4E6B" strokeWidth="1" />
        <line x1="210" y1="190" x2="350" y2="60" stroke="#3E4E6B" strokeWidth="1" />
        <line x1="210" y1="190" x2="60" y2="300" stroke="#3E4E6B" strokeWidth="1" />
        <line x1="210" y1="190" x2="360" y2="310" stroke="#3E4E6B" strokeWidth="1" />
        <line x1="210" y1="190" x2="210" y2="40" stroke="#3E4E6B" strokeWidth="1" />
        <line x1="70" y1="70" x2="210" y2="40" stroke="#26364F" strokeWidth="1" />
        <line x1="350" y1="60" x2="210" y2="40" stroke="#26364F" strokeWidth="1" />
        <line x1="60" y1="300" x2="360" y2="310" stroke="#26364F" strokeWidth="1" />

        <circle cx="210" cy="190" r="30" fill="#C9A227" />
        <text x="210" y="195" textAnchor="middle" fill="#12213A" style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, fontWeight: 600 }}>
          คุณ
        </text>

        <circle cx="70" cy="70" r="24" fill="#F1E6BE" />
        <text x="70" y="75" textAnchor="middle" fill="#12213A" style={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }}>
          สตาร์ตอัพ
        </text>

        <circle cx="350" cy="60" r="24" fill="#F1E6BE" />
        <text x="350" y="65" textAnchor="middle" fill="#12213A" style={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }}>
          เมนเทอร์
        </text>

        <circle cx="60" cy="300" r="24" fill="#F1E6BE" />
        <text x="60" y="305" textAnchor="middle" fill="#12213A" style={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }}>
          นักลงทุน
        </text>

        <circle cx="360" cy="310" r="24" fill="#F1E6BE" />
        <text x="360" y="315" textAnchor="middle" fill="#12213A" style={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }}>
          พันธมิตร
        </text>

        <circle cx="210" cy="40" r="20" fill="#25344C" stroke="#3E4E6B" />
        <text x="210" y="45" textAnchor="middle" fill="#EDEFF3" style={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }}>
          PR
        </text>
      </svg>
    </div>
  )
}
