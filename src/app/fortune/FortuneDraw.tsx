"use client";

import { useState, type CSSProperties } from "react";
import {
  ASPECTS,
  BAD_TO_DO,
  COUPLETS,
  GOOD_TO_DO,
  LEVELS,
  LUCKY_COLORS,
  LUCKY_ITEMS,
  type Level,
} from "./fortunes";

const SHAKE_MS = 1600;
const INK = "#3d1a0c";

type Fortune = {
  no: number;
  level: Level;
  poem: string[];
  couplet: [string, string];
  aspects: { name: string; icon: string; text: string }[];
  good: string[];
  bad: string[];
  item: string;
  color: string;
  luckyNumber: number;
};

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function pickSome<T>(list: T[], count: number): T[] {
  const copy = [...list];
  const out: T[] = [];
  while (out.length < count && copy.length > 0) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

function pickLevel(): Level {
  const total = LEVELS.reduce((sum, l) => sum + l.weight, 0);
  let roll = Math.random() * total;
  for (const level of LEVELS) {
    roll -= level.weight;
    if (roll < 0) return level;
  }
  return LEVELS[LEVELS.length - 1];
}

function drawFortune(): Fortune {
  const level = pickLevel();
  return {
    no: 1 + Math.floor(Math.random() * 100),
    level,
    poem: pick(level.poems),
    couplet: pick(COUPLETS[level.tier]),
    // Mostly follows the overall luck, with an occasional surprise.
    aspects: ASPECTS.map((a) => {
      const tier = Math.random() < 0.75 ? level.tier : pick(["good", "meh", "bad"] as const);
      return { name: a.name, icon: a.icon, text: pick(a.lines[tier]) };
    }),
    good: pickSome(GOOD_TO_DO, 2),
    bad: pickSome(BAD_TO_DO, 2),
    item: pick(LUCKY_ITEMS),
    color: pick(LUCKY_COLORS),
    luckyNumber: 1 + Math.floor(Math.random() * 99),
  };
}

const NUMERALS = "〇一二三四五六七八九";

function toChineseNumber(n: number) {
  if (n === 100) return "一百";
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  if (tens === 0) return NUMERALS[ones];
  return `${tens === 1 ? "" : NUMERALS[tens]}十${ones ? NUMERALS[ones] : ""}`;
}

const outlined = (color: string, width: number): CSSProperties => ({
  WebkitTextStroke: `${width}px ${color}`,
  paintOrder: "stroke fill",
});

/* ---------- Decorations ---------- */

function Cloud({ className, flip }: { className: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 130 70"
      className={`pointer-events-none absolute ${className}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden
    >
      <path
        d="M12 62 Q-2 60 6 46 Q-4 30 16 28 Q14 8 36 14 Q44 -2 64 8 Q80 -4 92 12 Q114 8 114 28 Q130 32 122 48 Q128 62 110 62 Z"
        fill="#f8d9a6"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M40 44 q0 -12 12 -12 q10 0 10 9 q0 7 -7 7 q-6 0 -6 -5"
        fill="none"
        stroke="#e0a85c"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M78 40 q0 -10 10 -10 q8 0 8 7 q0 6 -6 6"
        fill="none"
        stroke="#e0a85c"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Sparkle({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`pointer-events-none absolute ${className}`} aria-hidden>
      <path
        d="M20 2 Q23 17 38 20 Q23 23 20 38 Q17 23 2 20 Q17 17 20 2 Z"
        fill="#ffd34d"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Couplet({ text, side }: { text: string; side: "left" | "right" }) {
  return (
    <div
      className={`absolute top-32 z-20 flex w-11 flex-col items-center ${
        side === "left" ? "left-1" : "right-1"
      }`}
    >
      <div className="h-8 w-[3px]" style={{ background: INK }} />
      <div
        className="h-4 w-4 rotate-45 rounded-[3px] border-[3px]"
        style={{ background: "#ffd34d", borderColor: INK }}
      />
      <div
        className="mt-2 h-3 w-12 rounded-full border-[3px]"
        style={{ background: "#ffd34d", borderColor: INK }}
      />
      <div
        className="-my-0.5 flex w-10 justify-center border-x-[3px] py-3 text-xl font-black tracking-[0.2em]"
        style={{
          background: "#6e8fe0",
          borderColor: INK,
          boxShadow: "inset 0 0 0 3px #ffd34d",
          color: "#fff6c9",
          writingMode: "vertical-rl",
          ...outlined(INK, 4),
        }}
      >
        {text}
      </div>
      <div
        className="h-3 w-12 rounded-full border-[3px]"
        style={{ background: "#ffd34d", borderColor: INK }}
      />
      <div className="h-5 w-[3px]" style={{ background: INK }} />
      <div className="h-3 w-3 rounded-full" style={{ background: "#e8452c", border: `3px solid ${INK}` }} />
    </div>
  );
}

function Banner({ text }: { text: string }) {
  return (
    <div className="absolute left-1/2 top-5 z-30 flex w-[84%] -translate-x-1/2 items-center">
      <div
        className="h-16 w-4 shrink-0 rounded-full border-[3px]"
        style={{ background: "#ffd34d", borderColor: INK }}
      />
      <div
        className="-mx-1 flex h-14 flex-1 items-center justify-center rounded-md border-[3px] text-3xl font-black tracking-[0.2em] sm:text-4xl"
        style={{
          background: "#6e8fe0",
          borderColor: INK,
          boxShadow: "inset 0 0 0 4px #ffd34d, 0 5px 0 rgb(0 0 0 / 0.25)",
          color: "#23306e",
          ...outlined("#fff", 6),
        }}
      >
        {text}
      </div>
      <div
        className="h-16 w-4 shrink-0 rounded-full border-[3px]"
        style={{ background: "#ffd34d", borderColor: INK }}
      />
    </div>
  );
}

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden>
      <span className="mr-1 flex flex-col gap-1">
        <span className="block h-[3px] w-6 rounded" style={{ background: INK }} />
        <span className="ml-2 block h-[3px] w-4 rounded" style={{ background: INK }} />
      </span>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="flex h-9 w-9 items-center justify-center rounded-full border-[3px]"
          style={{ background: "#f7a531", borderColor: INK }}
        >
          <span className="h-3.5 w-3.5 rotate-45 border-2" style={{ background: "#d71f26", borderColor: INK }} />
        </span>
      ))}
      <span className="ml-1 flex flex-col items-end gap-1">
        <span className="block h-[3px] w-6 rounded" style={{ background: INK }} />
        <span className="mr-2 block h-[3px] w-4 rounded" style={{ background: INK }} />
      </span>
    </div>
  );
}

function DiamondTiles({ chars }: { chars: string }) {
  return (
    <div
      className="mx-auto mt-5 flex w-fit items-center justify-center gap-1 rounded-lg border-[3px] px-4 py-2"
      style={{ background: "#f7a531", borderColor: INK }}
    >
      {[...chars].map((ch, i) => (
        <span key={i} className="relative flex h-14 w-14 items-center justify-center">
          <span
            className="absolute inset-1.5 rotate-45 rounded-md border-[3px]"
            style={{ background: "#ffe08a", borderColor: INK }}
          />
          <span className="relative text-3xl font-black" style={{ color: INK }}>
            {ch}
          </span>
        </span>
      ))}
    </div>
  );
}

function Divider() {
  return (
    <div className="my-4 flex items-center justify-center gap-2" aria-hidden>
      <span className="h-[3px] w-20 rounded" style={{ background: INK }} />
      <span className="h-3 w-3 rotate-45 border-2" style={{ background: "#f7a531", borderColor: INK }} />
      <span className="h-[3px] w-20 rounded" style={{ background: INK }} />
    </div>
  );
}

function Tube({ shaking }: { shaking: boolean }) {
  return (
    <svg viewBox="0 0 160 200" className={`mx-auto w-32 ${shaking ? "fx-shake" : ""}`} aria-hidden>
      {[-30, -18, -6, 6, 18, 30].map((x, i) => (
        <rect
          key={x}
          x={76 + x}
          y={12 + (i % 3) * 8}
          width="9"
          height="100"
          rx="2"
          fill="#ffe08a"
          stroke={INK}
          strokeWidth="2.5"
          transform={`rotate(${x / 4} ${80 + x} 130)`}
        />
      ))}
      <path d="M 34 82 L 126 82 L 120 192 Q 80 202 40 192 Z" fill="#6e8fe0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <ellipse cx="80" cy="82" rx="46" ry="10" fill="#4a68b8" stroke={INK} strokeWidth="4" />
      <rect x="44" y="112" width="72" height="44" rx="6" fill="#ffd34d" stroke={INK} strokeWidth="3" />
      <text x="80" y="134" textAnchor="middle" dominantBaseline="central" fontSize="26" fontWeight="900" fill={INK}>
        籤
      </text>
    </svg>
  );
}

/* ---------- Main ---------- */

export default function FortuneDraw() {
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [shaking, setShaking] = useState(false);
  const [draws, setDraws] = useState(0);

  function shake() {
    if (shaking) return;
    setFortune(null);
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setFortune(drawFortune());
      setDraws((d) => d + 1);
    }, SHAKE_MS);
  }

  const couplet = fortune?.couplet ?? ["誠心誠意", "好運到來"];

  return (
    <div className="flex w-full flex-col items-center">
      <div
        className="relative w-full max-w-[460px] overflow-hidden rounded-[28px] border-4 px-4 pb-24 pt-24 sm:px-6"
        style={{ background: "#c8161d", borderColor: INK }}
      >
        {/* Cloud border */}
        <Cloud className="-left-6 -top-4 w-36" />
        <Cloud className="-right-6 -top-4 w-36" flip />
        <Cloud className="-left-10 top-[38%] w-28" />
        <Cloud className="-right-10 top-[55%] w-28" flip />
        <Cloud className="-bottom-3 -left-6 w-40" />
        <Cloud className="-bottom-5 left-1/2 w-36 -translate-x-1/2" flip />
        <Cloud className="-bottom-3 -right-6 w-40" flip />
        <Sparkle className="left-3 top-[30%] w-6" />
        <Sparkle className="bottom-24 right-2 w-7" />
        <Sparkle className="bottom-10 left-1/4 w-5" />

        <Banner text="今日運勢籤" />
        <Couplet text={couplet[0]} side="left" />
        <Couplet text={couplet[1]} side="right" />

        {/* Center card */}
        <div
          className="relative z-10 rounded-[22px] border-4 px-12 pb-6 pt-8 text-center"
          style={{
            background: "#d71f26",
            borderColor: INK,
            boxShadow: "inset 0 0 0 6px #b3121b, inset 0 0 0 9px #f6a03c",
          }}
        >
          <Ornament />

          {!fortune && (
            <div>
              <DiamondTiles chars="抽籤" />
              <p className="mt-5 text-lg font-bold leading-relaxed text-[#ffd54a]">
                誠心默念你的名字
                <br />
                搖一搖，看看今天的運勢
              </p>
              <Divider />
              <Tube shaking={shaking} />
              <button
                type="button"
                onClick={shake}
                disabled={shaking}
                className="fx-button mt-6 px-10 py-2.5 text-xl"
              >
                {shaking ? "搖籤中…" : "搖一搖"}
              </button>
            </div>
          )}

          {fortune && (
            <div className="fx-reveal">
              <p className="mt-4 text-sm font-bold tracking-[0.3em] text-[#ffd54a]">
                第{toChineseNumber(fortune.no)}籤
              </p>
              <DiamondTiles chars={`${fortune.level.name}籤`} />
              <div className="mt-5 space-y-1 text-lg font-bold leading-snug text-[#ffd54a]">
                {fortune.poem.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <Divider />
              <p className="text-xl font-black leading-relaxed text-white" style={outlined(INK, 3)}>
                {fortune.level.verdict}
              </p>

              <div
                // Below the hanging scrolls, so it can use the card's full width.
                className="-mx-8 mt-5 rounded-2xl border-[3px] p-4 text-left text-sm text-[#4a2410]"
                style={{ background: "#fff4dd", borderColor: INK }}
              >
                <ul className="space-y-2">
                  {fortune.aspects.map((a) => (
                    <li key={a.name}>
                      <span className="font-bold">
                        {a.icon} {a.name}：
                      </span>
                      {a.text}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 grid grid-cols-2 gap-2 text-white">
                  <div className="rounded-lg border-2 p-2" style={{ background: "#d71f26", borderColor: INK }}>
                    <p className="font-bold">宜</p>
                    <p>{fortune.good.join("、")}</p>
                  </div>
                  <div className="rounded-lg border-2 p-2" style={{ background: "#4a68b8", borderColor: INK }}>
                    <p className="font-bold">忌</p>
                    <p>{fortune.bad.join("、")}</p>
                  </div>
                </div>
                <p className="mt-3 text-center">
                  <b>幸運物</b> {fortune.item}　<b>幸運色</b> {fortune.color}　<b>幸運數字</b>{" "}
                  {fortune.luckyNumber}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {fortune && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <button type="button" onClick={shake} className="fx-button px-10 py-3 text-xl">
            再抽一次
          </button>
          <p className="text-sm text-[#f6d98b]">
            {draws >= 3
              ? `已經抽了 ${draws} 次，神明表示：好啦好啦，你開心就好。`
              : "不滿意可以再抽，神明不會說出去的。"}
          </p>
        </div>
      )}
    </div>
  );
}
