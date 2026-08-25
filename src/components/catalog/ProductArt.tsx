import { cn } from "@/lib/utils"
import type { ProductArtKind, ProductFinish } from "@/types"

interface ProductArtProps {
  kind: ProductArtKind
  finish: ProductFinish
  label?: string
  className?: string
}

export function ProductArt({ kind, finish, label, className }: ProductArtProps) {
  return (
    <svg
      viewBox="0 0 400 300"
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id={`sheen-${kind}-${finish.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {kind === "synthesizer" && <Synthesizer finish={finish} uid={`${kind}-${finish.id}`} />}
      {kind === "controller" && <Controller finish={finish} uid={`${kind}-${finish.id}`} />}
      {kind === "interface" && <Interface finish={finish} uid={`${kind}-${finish.id}`} />}
      {kind === "modular" && <Modular finish={finish} uid={`${kind}-${finish.id}`} />}
      {kind === "accessory" && <Accessory finish={finish} uid={`${kind}-${finish.id}`} />}
    </svg>
  )
}

interface ArtProps {
  finish: ProductFinish
  uid?: string
}

function Synthesizer({ finish, uid }: ArtProps) {
  const keys = Array.from({ length: 10 })
  return (
    <g>
      <rect x="48" y="86" width="304" height="128" rx="14" fill={finish.body} />
      <rect x="48" y="86" width="304" height="128" rx="14" fill={`url(#sheen-${uid})`} />
      <rect x="62" y="100" width="180" height="58" rx="8" fill={finish.panel} />
      {[76, 102, 128, 154, 180, 206].map((x) => (
        <circle key={x} cx={x + 6} cy={129} r={9} fill={finish.accent} opacity="0.85" />
      ))}
      {[70, 96, 122, 148, 174].map((x) => (
        <line key={x} x1={x} y1={106} x2={x} y2={112} stroke={finish.accent} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      ))}
      {keys.map((_, i) => (
        <rect key={i} x={64 + i * 28} y={166} width="22" height="40" rx="3" fill="#f4f2ec" />
      ))}
      {[0, 1, 3, 4, 5, 7, 8].map((i) => (
        <rect key={i} x={80 + i * 28} y={166} width="13" height="25" rx="2" fill="#22242a" />
      ))}
      <circle cx="278" cy="182" r="12" fill={finish.accent} />
      <circle cx="310" cy="182" r="12" fill={finish.panel} stroke={finish.accent} strokeWidth="2" />
      <rect x="264" y="98" width="74" height="52" rx="6" fill="#14161b" />
      <text x="301" y="130" textAnchor="middle" fontSize="13" fontFamily="ui-monospace, monospace" fill={finish.accent}>
        PRO·8
      </text>
    </g>
  )
}

function Controller({ finish, uid }: ArtProps) {
  const pads = Array.from({ length: 16 })
  return (
    <g>
      <rect x="60" y="92" width="280" height="118" rx="14" fill={finish.body} />
      <rect x="60" y="92" width="280" height="118" rx="14" fill={`url(#sheen-${uid})`} />
      {pads.map((_, i) => (
        <rect
          key={i}
          x={78 + (i % 4) * 34}
          y={108 + Math.floor(i / 4) * 24}
          width="26"
          height="17"
          rx="4"
          fill={i % 5 === 0 ? finish.accent : finish.panel}
          opacity={i % 5 === 0 ? 0.95 : 1}
        />
      ))}
      {[214, 240, 266, 292, 318].map((x) => (
        <line key={x} x1={x} y1={104} x2={x} y2={168} stroke={finish.accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      ))}
      <rect x="76" y="188" width="120" height="10" rx="5" fill={finish.panel} />
      <rect x="76" y="188" width="72" height="10" rx="5" fill={finish.accent} opacity="0.8" />
    </g>
  )
}

function Interface({ finish, uid }: ArtProps) {
  return (
    <g>
      <rect x="88" y="84" width="224" height="132" rx="16" fill={finish.body} />
      <rect x="88" y="84" width="224" height="132" rx="16" fill={`url(#sheen-${uid})`} />
      <rect x="104" y="100" width="192" height="44" rx="8" fill="#101216" />
      <polyline points="116,126 136,126 146,110 158,138 170,120 186,126 288,126" fill="none" stroke={finish.accent} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {[136, 172, 208].map((x) => (
        <circle key={x} cx={x} cy={176} r="15" fill={finish.panel} stroke={finish.accent} strokeWidth="2" />
      ))}
      {[136, 172, 208].map((x) => (
        <line key={`m${x}`} x1={x} y1={165} x2={x} y2={172} stroke={finish.accent} strokeWidth="2" strokeLinecap="round" />
      ))}
      <circle cx="264" cy="176" r="11" fill={finish.accent} opacity="0.9" />
      <circle cx="292" cy="176" r="11" fill="none" stroke={finish.accent} strokeWidth="2.5" />
    </g>
  )
}

function Modular({ finish, uid }: ArtProps) {
  return (
    <g>
      <rect x="64" y="72" width="272" height="156" rx="10" fill={finish.body} />
      <rect x="64" y="72" width="272" height="156" rx="10" fill={`url(#sheen-${uid})`} />
      <rect x="78" y="84" width="76" height="132" rx="5" fill={finish.panel} />
      <rect x="162" y="84" width="76" height="132" rx="5" fill={finish.body} stroke={finish.accent} strokeOpacity="0.35" />
      <rect x="246" y="84" width="76" height="132" rx="5" fill={finish.panel} opacity="0.75" />
      {[96, 122, 148].map((y) => (
        <circle key={`a${y}`} cx="116" cy={y} r="11" fill={finish.accent} />
      ))}
      <circle cx="200" cy="104" r="14" fill="none" stroke={finish.accent} strokeWidth="2.5" />
      <path d="M193 104 L200 94 L207 104" fill="none" stroke={finish.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {[178, 196].map((y) => (
        <circle key={`j${y}`} cx="200" cy={y} r="6" fill="#101216" stroke={finish.accent} strokeWidth="2" />
      ))}
      {[100, 124, 148, 172].map((y) => (
        <circle key={`c${y}`} cx="284" cy={y} r="6" fill="#101216" stroke={finish.accent} strokeWidth="2" />
      ))}
    </g>
  )
}

function Accessory({ finish }: ArtProps) {
  const coils = [56, 68, 80]
  return (
    <g>
      {coils.map((r, i) => (
        <circle key={r} cx="164" cy="150" r={r} fill="none" stroke={finish.body} strokeWidth="11" opacity={0.55 + i * 0.15} />
      ))}
      <circle cx="164" cy="150" r="56" fill="none" stroke={finish.accent} strokeWidth="11" strokeDasharray="30 220" strokeLinecap="round" />
      <rect x="204" y="140" width="34" height="20" rx="5" fill={finish.panel} />
      <rect x="238" y="145" width="14" height="10" rx="3" fill={finish.accent} />
      <rect x="120" y="142" width="30" height="16" rx="4" fill={finish.panel} transform="rotate(-18 135 150)" />
    </g>
  )
}
