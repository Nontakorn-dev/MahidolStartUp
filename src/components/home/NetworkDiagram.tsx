export function NetworkDiagram() {
  return (
    <div className="relative mx-auto h-[240px] w-full max-w-[360px] sm:h-[280px] sm:max-w-[400px] md:h-[400px] md:max-w-[440px]">
      <svg
        viewBox="0 0 440 400"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        role="img"
        aria-label="เครือข่าย MSC Connect — คุณอยู่ตรงกลาง เชื่อมกับสตาร์ตอัพ เมนเทอร์ นักลงทุน พันธมิตร และ PR"
      >
        <defs>
          {/* Soft gold glow for center */}
          <radialGradient id="nd-gold-fill" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#E8C84A" />
            <stop offset="55%" stopColor="#C9A227" />
            <stop offset="100%" stopColor="#8A6D14" />
          </radialGradient>

          <radialGradient id="nd-navy-fill" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#2C4A6E" />
            <stop offset="100%" stopColor="#12213A" />
          </radialGradient>

          <radialGradient id="nd-cream-fill" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFEF9" />
            <stop offset="100%" stopColor="#F1E6BE" />
          </radialGradient>

          <linearGradient id="nd-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9A227" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#3A7DB5" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#C9A227" stopOpacity="0.15" />
          </linearGradient>

          <filter id="nd-soft-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#12213A" floodOpacity="0.12" />
          </filter>

          <filter id="nd-gold-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Animated dash for orbital ring */}
          <style>{`
            @keyframes nd-orbit {
              from { stroke-dashoffset: 0; }
              to { stroke-dashoffset: -120; }
            }
            @keyframes nd-pulse-ring {
              0%, 100% { opacity: 0.35; transform: scale(1); }
              50% { opacity: 0.15; transform: scale(1.08); }
            }
            @keyframes nd-float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
            .nd-orbit-ring {
              animation: nd-orbit 28s linear infinite;
            }
            .nd-pulse-ring {
              transform-origin: 220px 200px;
              animation: nd-pulse-ring 3.2s ease-in-out infinite;
            }
            .nd-node-float {
              animation: nd-float 5s ease-in-out infinite;
            }
            .nd-node-float-2 { animation-delay: 0.8s; }
            .nd-node-float-3 { animation-delay: 1.6s; }
            .nd-node-float-4 { animation-delay: 2.4s; }
            .nd-node-float-5 { animation-delay: 1.2s; }
          `}</style>
        </defs>

        {/* Soft ambient backdrop */}
        <circle cx="220" cy="200" r="168" fill="#F0F5FA" fillOpacity="0.35" />
        <circle cx="220" cy="200" r="132" fill="#FAF7F0" fillOpacity="0.7" />

        {/* Orbital rings */}
        <circle
          cx="220"
          cy="200"
          r="118"
          fill="none"
          stroke="#C9A227"
          strokeWidth="1"
          strokeOpacity="0.25"
          strokeDasharray="4 10"
          className="nd-orbit-ring"
        />
        <circle
          cx="220"
          cy="200"
          r="148"
          fill="none"
          stroke="#3A7DB5"
          strokeWidth="1"
          strokeOpacity="0.12"
          strokeDasharray="2 14"
          className="nd-orbit-ring"
          style={{ animationDuration: '40s', animationDirection: 'reverse' }}
        />

        {/* Pulse ring around center */}
        <circle
          cx="220"
          cy="200"
          r="48"
          fill="none"
          stroke="#C9A227"
          strokeWidth="1.5"
          className="nd-pulse-ring"
        />

        {/* Connection lines — soft gradient strokes */}
        <g stroke="url(#nd-line)" strokeWidth="1.5" strokeLinecap="round" fill="none">
          {/* Center → nodes */}
          <line x1="220" y1="200" x2="95" y2="88" />
          <line x1="220" y1="200" x2="345" y2="78" />
          <line x1="220" y1="200" x2="78" y2="312" />
          <line x1="220" y1="200" x2="358" y2="318" />
          <line x1="220" y1="200" x2="220" y2="58" />
          {/* Outer mesh */}
          <line x1="95" y1="88" x2="220" y2="58" strokeOpacity="0.5" />
          <line x1="345" y1="78" x2="220" y2="58" strokeOpacity="0.5" />
          <line x1="78" y1="312" x2="358" y2="318" strokeOpacity="0.5" />
          <line x1="95" y1="88" x2="78" y2="312" strokeOpacity="0.35" />
          <line x1="345" y1="78" x2="358" y2="318" strokeOpacity="0.35" />
        </g>

        {/* Connection dots (journey markers) */}
        <g fill="#C9A227">
          <circle cx="158" cy="144" r="2.5" opacity="0.7" />
          <circle cx="282" cy="139" r="2.5" opacity="0.7" />
          <circle cx="149" cy="256" r="2.5" opacity="0.7" />
          <circle cx="289" cy="259" r="2.5" opacity="0.7" />
          <circle cx="220" cy="129" r="2.5" opacity="0.7" />
        </g>

        {/* ── Outer nodes ── */}
        {/* Startup — top left */}
        <g className="nd-node-float" filter="url(#nd-soft-shadow)">
          <circle cx="95" cy="88" r="32" fill="url(#nd-cream-fill)" stroke="#C9A227" strokeWidth="1.5" strokeOpacity="0.4" />
          <text
            x="95"
            y="92"
            textAnchor="middle"
            fill="#12213A"
            style={{ fontFamily: 'Kanit, sans-serif', fontSize: 12, fontWeight: 600 }}
          >
            สตาร์ตอัพ
          </text>
        </g>

        {/* Mentor — top right */}
        <g className="nd-node-float nd-node-float-2" filter="url(#nd-soft-shadow)">
          <circle cx="345" cy="78" r="32" fill="url(#nd-cream-fill)" stroke="#C9A227" strokeWidth="1.5" strokeOpacity="0.4" />
          <text
            x="345"
            y="82"
            textAnchor="middle"
            fill="#12213A"
            style={{ fontFamily: 'Kanit, sans-serif', fontSize: 12, fontWeight: 600 }}
          >
            เมนเทอร์
          </text>
        </g>

        {/* Investor — bottom left */}
        <g className="nd-node-float nd-node-float-3" filter="url(#nd-soft-shadow)">
          <circle cx="78" cy="312" r="32" fill="url(#nd-cream-fill)" stroke="#C9A227" strokeWidth="1.5" strokeOpacity="0.4" />
          <text
            x="78"
            y="316"
            textAnchor="middle"
            fill="#12213A"
            style={{ fontFamily: 'Kanit, sans-serif', fontSize: 12, fontWeight: 600 }}
          >
            นักลงทุน
          </text>
        </g>

        {/* Partner — bottom right */}
        <g className="nd-node-float nd-node-float-4" filter="url(#nd-soft-shadow)">
          <circle cx="358" cy="318" r="32" fill="url(#nd-cream-fill)" stroke="#C9A227" strokeWidth="1.5" strokeOpacity="0.4" />
          <text
            x="358"
            y="322"
            textAnchor="middle"
            fill="#12213A"
            style={{ fontFamily: 'Kanit, sans-serif', fontSize: 12, fontWeight: 600 }}
          >
            พันธมิตร
          </text>
        </g>

        {/* PR — top center (navy) */}
        <g className="nd-node-float nd-node-float-5" filter="url(#nd-soft-shadow)">
          <circle cx="220" cy="58" r="26" fill="url(#nd-navy-fill)" stroke="#C9A227" strokeWidth="1.5" />
          <text
            x="220"
            y="62"
            textAnchor="middle"
            fill="#FAF7F0"
            style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 600, letterSpacing: '0.5px' }}
          >
            PR
          </text>
        </g>

        {/* ── Center: คุณ ── */}
        <g filter="url(#nd-gold-glow)">
          <circle cx="220" cy="200" r="42" fill="url(#nd-gold-fill)" className="net-pulse" />
          {/* Inner highlight ring */}
          <circle cx="220" cy="200" r="42" fill="none" stroke="#FFFEF9" strokeWidth="1.5" strokeOpacity="0.35" />
          <text
            x="220"
            y="206"
            textAnchor="middle"
            fill="#12213A"
            style={{ fontFamily: 'Kanit, sans-serif', fontSize: 16, fontWeight: 700 }}
          >
            คุณ
          </text>
        </g>

        {/* Tiny label under center */}
        <text
          x="220"
          y="258"
          textAnchor="middle"
          fill="#2C3C57"
          style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, letterSpacing: '1.5px', fontWeight: 500 }}
        >
          MSC CONNECT
        </text>
      </svg>
    </div>
  )
}
