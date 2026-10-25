import Link from "next/link";

const INK = "#2b1d14";

const TOOLS = [
  {
    href: "/lucky-wheel",
    name: "幸運轉盤抽獎",
    tag: "抽獎",
    desc: "貼上名單，轉盤一轉就決定誰是幸運兒。尾牙、班級活動、決定今天誰請喝飲料都適用。",
    points: ["一行一個名字，即時更新轉盤", "抽中後可自動從名單移除", "燈泡閃爍、結果彈窗超有氣氛"],
    bg: "#ffa514",
    soft: "#fff1d6",
    art: <WheelArt />,
  },
  {
    href: "/pomodoro",
    name: "番茄鐘",
    tag: "專注",
    desc: "25 分鐘專心、5 分鐘休息。把大工作切成一顆顆番茄，一顆一顆吃掉它。",
    points: ["專注 / 短休息 / 長休息自動切換", "時間到有提示音與桌面通知", "可自訂每段時間長度"],
    bg: "#c84b45",
    soft: "#fde4e1",
    art: <TomatoArt />,
  },
  {
    href: "/fortune",
    name: "好運抽籤",
    tag: "運勢",
    desc: "搖一搖籤筒，看看今天是大吉還是大凶。籤詩保證生活化，準不準不知道，但一定好笑。",
    points: ["大吉到大凶共七種籤", "工作、感情、財運、健康一次看", "今日宜忌與幸運物"],
    bg: "#b3121b",
    soft: "#fbe3d3",
    art: <FortuneArt />,
  },
];

/* ---------- Illustrations ---------- */

function WheelArt() {
  const colors = ["#c75cf2", "#2fb8f5", "#f450d6", "#f2453a", "#6cc531", "#ff9f1c"];
  const slice = (i: number) => {
    const a1 = ((i * 60 - 90) * Math.PI) / 180;
    const a2 = (((i + 1) * 60 - 90) * Math.PI) / 180;
    const p = (a: number) => `${(50 * Math.cos(a)).toFixed(2)} ${(50 * Math.sin(a)).toFixed(2)}`;
    return `M 0 0 L ${p(a1)} A 50 50 0 0 1 ${p(a2)} Z`;
  };
  return (
    <svg viewBox="-70 -70 140 145" className="h-full w-full" aria-hidden>
      <circle r="60" fill="#e63d7c" stroke={INK} strokeWidth="3" />
      <g className="origin-center transition-transform [transform-box:fill-box] duration-700 group-hover:rotate-[120deg]">
        {colors.map((c, i) => (
          <path key={c} d={slice(i)} fill={c} stroke="#ff8db6" strokeWidth="2" />
        ))}
      </g>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={(55 * Math.cos(a)).toFixed(2)}
            cy={(55 * Math.sin(a)).toFixed(2)}
            r="2.6"
            fill="#fffbe0"
          />
        );
      })}
      <circle r="14" fill="#ffd21f" stroke="#e63d7c" strokeWidth="4" />
      <path d="M 0 48 C 4 54, 10 60, 10 65 C 10 71, 4 72, 0 72 C -4 72, -10 71, -10 65 C -10 60, -4 54, 0 48 Z" fill="#ffd34d" stroke={INK} strokeWidth="2.5" />
    </svg>
  );
}

function TomatoArt() {
  return (
    <svg viewBox="-70 -75 140 145" className="h-full w-full" aria-hidden>
      <ellipse cx="0" cy="8" rx="58" ry="54" fill="#e2483d" stroke={INK} strokeWidth="3" />
      <ellipse cx="-22" cy="-12" rx="12" ry="7" fill="#fff" opacity="0.35" transform="rotate(-30 -22 -12)" />
      <path
        d="M 0 -44 L -10 -60 L 2 -52 L 8 -66 L 12 -50 L 26 -56 L 16 -42 L 30 -36 L 10 -38 L 0 -30 L -8 -40 L -28 -38 L -14 -46 Z"
        fill="#5cb85c"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="0" cy="12" r="32" fill="#fff5f3" stroke={INK} strokeWidth="2.5" />
      <circle
        cx="0"
        cy="12"
        r="26"
        fill="none"
        stroke="#e2483d"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="163"
        strokeDashoffset="45"
        transform="rotate(-90 0 12)"
      />
      <text x="0" y="13" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="800" fill={INK}>
        25:00
      </text>
    </svg>
  );
}

function FortuneArt() {
  return (
    <svg viewBox="-70 -75 140 150" className="h-full w-full" aria-hidden>
      <g className="origin-bottom transition-transform [transform-box:fill-box] duration-500 group-hover:rotate-[-8deg]">
        {[-24, -14, -4, 6, 16, 26].map((x, i) => (
          <rect
            key={x}
            x={x - 3}
            y={-62 + (i % 3) * 7}
            width="7"
            height="80"
            rx="2"
            fill="#ffe08a"
            stroke={INK}
            strokeWidth="2"
            transform={`rotate(${x / 4} ${x} 40)`}
          />
        ))}
        <rect x="-3" y="-72" width="7" height="30" rx="2" fill="#e8452c" stroke={INK} strokeWidth="2" />
        <path d="M -38 -8 L 38 -8 L 33 66 Q 0 74 -33 66 Z" fill="#6e8fe0" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <ellipse cx="0" cy="-8" rx="38" ry="8" fill="#4a68b8" stroke={INK} strokeWidth="3" />
        <rect x="-20" y="16" width="40" height="30" rx="5" fill="#ffd34d" stroke={INK} strokeWidth="2.5" />
        <text x="0" y="32" textAnchor="middle" dominantBaseline="central" fontSize="18" fontWeight="900" fill={INK}>
          籤
        </text>
      </g>
    </svg>
  );
}

function Logo() {
  return (
    <span
      className="flex h-9 w-9 items-center justify-center rounded-xl border-[2.5px] shadow-[2px_2px_0_#2b1d14]"
      style={{ background: "#ffd34d", borderColor: INK }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <rect x="3" y="9" width="18" height="11" rx="2" fill="#e2483d" stroke={INK} strokeWidth="2" />
        <path d="M9 9 V6.5 A1.5 1.5 0 0 1 10.5 5 H13.5 A1.5 1.5 0 0 1 15 6.5 V9" fill="none" stroke={INK} strokeWidth="2" />
        <path d="M3 13.5 H21" stroke={INK} strokeWidth="2" />
        <rect x="10.5" y="12" width="3" height="3" rx="0.5" fill="#ffd34d" stroke={INK} strokeWidth="1.5" />
      </svg>
    </span>
  );
}

/* ---------- Page ---------- */

export default function Home() {
  return (
    <div
      className="flex flex-1 flex-col font-sans"
      style={{
        color: INK,
        background: "#fbf6ee",
        backgroundImage: "radial-gradient(#e9dccb 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 border-b-[2.5px] bg-[#fbf6ee]/85 backdrop-blur" style={{ borderColor: INK }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 text-lg font-black tracking-wide">
            <Logo />
            Eriene的小工具箱
          </Link>
          <nav className="hidden items-center gap-1 text-sm font-bold md:flex">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className="rounded-full px-4 py-2 transition hover:bg-[#2b1d14] hover:text-[#fbf6ee]">
                {t.name}
              </Link>
            ))}
          </nav>
          <a
            href="#tools"
            className="rounded-full border-[2.5px] bg-[#ffd34d] px-4 py-1.5 text-sm font-black shadow-[3px_3px_0_#2b1d14] transition hover:-translate-y-0.5 hover:shadow-[4px_5px_0_#2b1d14] md:hidden"
            style={{ borderColor: INK }}
          >
            看工具
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pt-20">
          <div>
            <p
              className="mb-5 inline-flex items-center gap-2 rounded-full border-2 bg-white px-3 py-1 text-xs font-bold tracking-wider"
              style={{ borderColor: INK }}
            >
              <span className="h-2 w-2 rounded-full bg-[#6cc531]" />
              免安裝・免登入・手機也能用
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              生活裡的小事，
              <br />
              交給
              <span className="relative mx-1 inline-block">
                <span className="relative z-10">小工具</span>
                <span className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 rounded bg-[#ffd34d] sm:h-4" />
              </span>
              就好。
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#5c4a3c]">
              抽獎不吵架、工作不分心、每天來抽支籤笑一下。
              Eriene的小工具箱收集了三個打開就能用的小幫手。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#tools"
                className="rounded-2xl border-[2.5px] bg-[#e2483d] px-6 py-3 font-black text-white shadow-[4px_4px_0_#2b1d14] transition hover:-translate-y-0.5 hover:shadow-[5px_6px_0_#2b1d14] active:translate-y-0.5 active:shadow-[2px_2px_0_#2b1d14]"
                style={{ borderColor: INK }}
              >
                打開工具箱 ↓
              </a>
              <Link
                href="/fortune"
                className="rounded-2xl border-[2.5px] bg-white px-6 py-3 font-black shadow-[4px_4px_0_#2b1d14] transition hover:-translate-y-0.5 hover:shadow-[5px_6px_0_#2b1d14] active:translate-y-0.5 active:shadow-[2px_2px_0_#2b1d14]"
                style={{ borderColor: INK }}
              >
                先抽支籤 🙏
              </Link>
            </div>
          </div>

          {/* Collage */}
          <div className="relative mx-auto h-80 w-full max-w-sm sm:h-96">
            {TOOLS.map((t, i) => (
              <Link
                key={t.href}
                href={t.href}
                aria-label={t.name}
                className={`group absolute flex h-44 w-44 items-center justify-center rounded-[28px] border-[2.5px] p-5 shadow-[6px_6px_0_#2b1d14] transition duration-300 hover:z-20 hover:-translate-y-2 hover:rotate-0 sm:h-52 sm:w-52 ${
                  ["left-0 top-0 -rotate-6", "right-0 top-12 rotate-6", "bottom-0 left-1/2 -translate-x-1/2 -rotate-2"][i]
                }`}
                style={{ background: t.bg, borderColor: INK }}
              >
                {t.art}
              </Link>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section id="tools" className="scroll-mt-20 border-y-[2.5px] bg-white/70 py-20" style={{ borderColor: INK }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="text-sm font-black tracking-[0.3em] text-[#e2483d]">TOOLS</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">工具箱裡有什麼？</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {TOOLS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group flex flex-col overflow-hidden rounded-3xl border-[2.5px] bg-white shadow-[6px_6px_0_#2b1d14] transition duration-300 hover:-translate-y-1.5 hover:shadow-[8px_10px_0_#2b1d14]"
                  style={{ borderColor: INK }}
                >
                  <div className="flex h-52 items-center justify-center border-b-[2.5px] p-6" style={{ background: t.soft, borderColor: INK }}>
                    <div className="h-40 w-40 transition duration-300 group-hover:scale-105">{t.art}</div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span
                      className="mb-3 w-fit rounded-full border-2 px-3 py-0.5 text-xs font-black text-white"
                      style={{ background: t.bg, borderColor: INK }}
                    >
                      {t.tag}
                    </span>
                    <h3 className="text-2xl font-black">{t.name}</h3>
                    <p className="mt-2 leading-relaxed text-[#5c4a3c]">{t.desc}</p>
                    <ul className="mt-4 space-y-1.5 text-sm">
                      {t.points.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span style={{ color: t.bg }}>✦</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-6 inline-flex items-center gap-1 font-black">
                      開始使用
                      <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: "⚡", title: "打開就能用", text: "不用下載 App、不用註冊帳號，點進網址馬上開始。" },
              { icon: "📱", title: "手機電腦都行", text: "版面會自動調整，聚會時用手機抽獎也沒問題。" },
              { icon: "🔒", title: "資料不外流", text: "名單和設定都只在你的瀏覽器裡，不會上傳到任何地方。" },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border-[2.5px] border-dashed p-6" style={{ borderColor: INK }}>
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="text-lg font-black">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#5c4a3c]">{f.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-[2.5px] bg-[#2b1d14] text-[#fbf6ee]" style={{ borderColor: INK }}>
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5 text-lg font-black">
              <Logo />
              Eriene的小工具箱
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#cbbfb2]">
              把生活裡的小麻煩，變成幾個好玩又好用的小工具。
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-black tracking-widest text-[#ffd34d]">工具</p>
            <ul className="space-y-2 text-sm">
              {TOOLS.map((t) => (
                <li key={t.href}>
                  <Link href={t.href} className="text-[#cbbfb2] transition hover:text-white">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-black tracking-widest text-[#ffd34d]">關於</p>
            <ul className="space-y-2 text-sm text-[#cbbfb2]">
              <li>使用 Next.js 打造</li>
              <li>免費使用，歡迎分享</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-[#9c8f83]">
          © 2026 Eriene的小工具箱. Made with ♥ and a lot of 🍅.
        </div>
      </footer>
    </div>
  );
}
