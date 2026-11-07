const S = { width: '100%', display: 'block' }

function RedDoor() {
  return (
    <svg viewBox="0 0 320 200" style={S} role="img" aria-label="An old house with a red door">
      <rect width="320" height="200" fill="#3b3f58" />
      <circle cx="270" cy="30" r="14" fill="#f4e9c8" opacity="0.9" />
      <rect y="152" width="320" height="48" fill="#46474d" />
      <polygon points="22,50 160,6 298,50" fill="#5b4a42" />
      <rect x="40" y="48" width="240" height="106" fill="#b8a58c" />
      {/* cracks and peeling */}
      <path d="M60 52 L68 80 L58 104 L70 130" stroke="#8a7a66" strokeWidth="2" fill="none" />
      <path d="M250 60 L242 88 L254 110" stroke="#8a7a66" strokeWidth="2" fill="none" />
      <rect x="205" y="120" width="30" height="22" fill="#a08f78" />
      {/* door */}
      <rect x="128" y="70" width="64" height="84" rx="3" fill="#c62828" />
      <rect x="138" y="80" width="18" height="30" fill="#a61f1f" />
      <rect x="164" y="80" width="18" height="30" fill="#a61f1f" />
      <rect x="138" y="118" width="44" height="26" fill="#a61f1f" />
      <circle cx="182" cy="116" r="3.5" fill="#e6c36a" />
      <rect x="118" y="154" width="84" height="8" fill="#8c8c8c" />
      {/* warm lamp */}
      <circle cx="160" cy="60" r="16" fill="#ffd166" opacity="0.25" />
      <circle cx="160" cy="60" r="5" fill="#ffd166" />
      {/* windows */}
      <rect x="58" y="82" width="46" height="40" fill="#f2d279" />
      <path d="M81 82 V122 M58 102 H104" stroke="#7a6a54" strokeWidth="3" />
      <rect x="218" y="82" width="46" height="40" fill="#2f3347" />
      <path d="M241 82 V122 M218 102 H264" stroke="#7a6a54" strokeWidth="3" />
      <polygon points="264,82 276,90 276,126 264,122" fill="#7a6a54" />
    </svg>
  )
}

function OldBook() {
  return (
    <svg viewBox="0 0 320 200" style={S} role="img" aria-label="A very old book on a shelf">
      <rect width="320" height="200" fill="#2d2118" />
      <rect y="168" width="320" height="32" fill="#5a3d28" />
      <rect y="164" width="320" height="6" fill="#74502f" />
      {/* books in background */}
      <rect x="20" y="70" width="22" height="94" fill="#3f5a6b" />
      <rect x="44" y="84" width="18" height="80" fill="#6b3f3f" />
      <rect x="64" y="76" width="20" height="88" fill="#4d6b3f" />
      <rect x="258" y="80" width="24" height="84" fill="#6b5a3f" />
      <rect x="284" y="66" width="20" height="98" fill="#3f4a6b" />
      {/* main book */}
      <rect x="98" y="52" width="128" height="112" rx="4" fill="#7a4a2b" />
      <rect x="98" y="52" width="16" height="112" rx="3" fill="#5e3720" />
      <rect x="226" y="58" width="6" height="100" fill="#efe0b8" />
      <path d="M226 70 H232 M226 84 H232 M226 98 H232 M226 112 H232 M226 126 H232 M226 140 H232" stroke="#cdb98a" strokeWidth="1" />
      <rect x="134" y="80" width="74" height="34" rx="2" fill="#c9a65a" opacity="0.85" />
      <path d="M144 92 H198 M144 102 H182" stroke="#7a5a1f" strokeWidth="3" strokeLinecap="round" />
      {/* wear and ribbon */}
      <path d="M100 150 L112 164 M214 52 L226 64" stroke="#4a2b17" strokeWidth="3" />
      <path d="M196 164 V190 L202 184 L208 190 V164" fill="#a83232" />
      {/* dust */}
      <circle cx="80" cy="40" r="2" fill="#e8d9b0" opacity="0.6" />
      <circle cx="240" cy="36" r="2.5" fill="#e8d9b0" opacity="0.5" />
      <circle cx="170" cy="28" r="1.8" fill="#e8d9b0" opacity="0.6" />
      <circle cx="120" cy="22" r="1.5" fill="#e8d9b0" opacity="0.5" />
    </svg>
  )
}

function WorriedElder() {
  return (
    <svg viewBox="0 0 320 200" style={S} role="img" aria-label="A worried elderly person leaning on a cane">
      <rect width="320" height="200" fill="#cfd8e3" />
      <rect y="160" width="320" height="40" fill="#8d99a6" />
      <rect x="30" y="50" width="50" height="110" fill="#b7c2d0" />
      <rect x="250" y="60" width="40" height="100" fill="#b7c2d0" />
      {/* legs */}
      <rect x="146" y="140" width="12" height="28" fill="#4a4458" />
      <rect x="166" y="140" width="12" height="28" fill="#4a4458" />
      <ellipse cx="152" cy="170" rx="11" ry="5" fill="#2f2b38" />
      <ellipse cx="172" cy="170" rx="11" ry="5" fill="#2f2b38" />
      {/* coat */}
      <rect x="132" y="92" width="60" height="56" rx="18" fill="#6b5b73" />
      {/* cane and arm */}
      <path d="M192 112 L212 124" stroke="#6b5b73" strokeWidth="11" strokeLinecap="round" />
      <path d="M214 120 V170" stroke="#7a4a2b" strokeWidth="6" strokeLinecap="round" />
      <path d="M206 118 Q214 108 222 118" stroke="#7a4a2b" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="213" cy="123" r="6" fill="#f0cfb0" />
      <path d="M132 112 L118 134" stroke="#6b5b73" strokeWidth="11" strokeLinecap="round" />
      {/* head */}
      <circle cx="162" cy="68" r="24" fill="#f0cfb0" />
      <path d="M138 66 Q140 40 162 42 Q184 40 186 66 Q176 52 162 52 Q148 52 138 66Z" fill="#d9dde2" />
      {/* worried face */}
      <path d="M149 62 L158 58 M175 58 L184 62" stroke="#5a4a3a" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="154" cy="68" r="2.2" fill="#3a2e28" />
      <circle cx="180" cy="68" r="2.2" fill="#3a2e28" />
      <path d="M154 83 Q167 76 180 83" stroke="#8a4a4a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M192 52 Q197 60 192 64 Q187 60 192 52Z" fill="#7ec8f0" />
    </svg>
  )
}

function BeachPhoto() {
  const person = (x, h, body, hair) => (
    <g key={x}>
      <circle cx={x} cy={128 - h} r="7" fill="#f0cfb0" />
      <path d={`M${x - 7} ${126 - h} Q${x} ${116 - h} ${x + 7} ${126 - h}Z`} fill={hair} />
      <rect x={x - 8} y={135 - h} width="16" height={h - 5} rx="5" fill={body} />
    </g>
  )
  return (
    <svg viewBox="0 0 320 200" style={S} role="img" aria-label="A family photo of four people at the beach">
      <rect width="320" height="200" fill="#e9e2d4" />
      <g transform="rotate(-3 160 100)">
        <rect x="48" y="14" width="224" height="172" fill="#fbfbf8" />
        <rect x="48" y="14" width="224" height="172" fill="none" stroke="#d4cfc2" />
        <rect x="60" y="26" width="200" height="126" fill="#8ecae6" />
        <circle cx="228" cy="52" r="13" fill="#ffd166" />
        <rect x="60" y="88" width="200" height="40" fill="#219ebc" />
        <path d="M60 100 Q80 94 100 100 T140 100 T180 100 T220 100 T260 100" stroke="#8ecae6" strokeWidth="2" fill="none" />
        <rect x="60" y="124" width="200" height="28" fill="#f4e3b2" />
        {person(112, 46, '#e76f51', '#3a2e28')}
        {person(146, 50, '#2a9d8f', '#5a3a28')}
        {person(180, 32, '#f4a261', '#3a2e28')}
        {person(210, 34, '#e9c46a', '#2a2a2a')}
        <rect x="104" y="160" width="112" height="6" rx="3" fill="#d4cfc2" />
      </g>
    </svg>
  )
}

const ART = { 1: RedDoor, 2: OldBook, 3: WorriedElder, 4: BeachPhoto }

export default function Art({ id }) {
  const Piece = ART[id]
  return Piece ? <Piece /> : null
}