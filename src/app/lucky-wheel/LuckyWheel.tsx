"use client";

import { useState } from "react";

// [fill, inset highlight, text outline]
const SLICE_COLORS = [
  ["#c75cf2", "#e7a6ff", "#7a1fa8"],
  ["#2fb8f5", "#8fdcff", "#0b6fa6"],
  ["#f450d6", "#ff9fec", "#9c1683"],
  ["#f2453a", "#ff9a92", "#99170f"],
  ["#6cc531", "#b2ec85", "#357a0c"],
  ["#ff9f1c", "#ffd08a", "#a85a00"],
];

const SPIN_MS = 5000;
const BULBS = 18;
const HUB_R = 34;
const SLICE_R = 100;

function parseNames(text: string) {
  return text
    .split("\n")
    .map((name) => name.trim())
    .filter(Boolean);
}

// Point on the wheel at `deg` degrees clockwise from 12 o'clock.
// Rounded so server and browser render identical numbers (avoids hydration mismatch).
function point(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  const round = (v: number) => Math.round(v * 1000) / 1000;
  return [round(r * Math.sin(rad)), round(-r * Math.cos(rad))];
}

function slicePath(start: number, end: number, r: number) {
  const [x1, y1] = point(start, r);
  const [x2, y2] = point(end, r);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

// Annular sector, used for the lighter inset edge inside each slice.
function ringSlicePath(start: number, end: number, r1: number, r2: number) {
  const [ax, ay] = point(start, r2);
  const [bx, by] = point(end, r2);
  const [cx, cy] = point(end, r1);
  const [dx, dy] = point(start, r1);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${ax} ${ay} A ${r2} ${r2} 0 ${largeArc} 1 ${bx} ${by} L ${cx} ${cy} A ${r1} ${r1} 0 ${largeArc} 0 ${dx} ${dy} Z`;
}

function sliceColor(i: number, n: number) {
  // Avoid the first and last slice sharing a color.
  if (n > 1 && i === n - 1 && i % SLICE_COLORS.length === 0) {
    return SLICE_COLORS[1];
  }
  return SLICE_COLORS[i % SLICE_COLORS.length];
}

// Rough rendered width in em: CJK glyphs are full width, others about half.
function textWidth(s: string) {
  let w = 0;
  for (const ch of s) w += /[⺀-￿]/.test(ch) ? 1 : 0.6;
  return Math.max(w, 1);
}

function truncate(s: string, max: number) {
  const chars = [...s];
  return chars.length > max ? `${chars.slice(0, max).join("")}…` : s;
}

function starPath(r: number) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const [x, y] = point(i * 36, i % 2 === 0 ? r : r * 0.55);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

export default function LuckyWheel() {
  const [text, setText] = useState("小明\n小華\n小美\n阿強\n大雄\n靜香");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [removeWinner, setRemoveWinner] = useState(false);

  const names = parseNames(text);
  const n = names.length;
  const seg = n > 0 ? 360 / n : 360;
  // Few slices: names sit across the slice like the reference design.
  // Many slices: names run along the radius so they still fit.
  const across = n <= 8;

  function spin() {
    if (spinning || n < 2) return;
    const index = Math.floor(Math.random() * n);
    // Land somewhere inside the slice, not exactly on its edge.
    const target = (index + 0.5 + (Math.random() - 0.5) * 0.8) * seg;
    // The pointer sits at 6 o'clock, so the wheel must end at 180 - target.
    const current = ((rotation % 360) + 360) % 360;
    const delta = (((180 - target - current) % 360) + 360) % 360;
    setRotation(rotation + 360 * 6 + delta);
    setWinnerIndex(null);
    setSpinning(true);

    setTimeout(() => {
      setSpinning(false);
      setWinnerIndex(index);
    }, SPIN_MS);
  }

  function closeResult() {
    if (removeWinner && winnerIndex !== null) {
      setText(names.filter((_, i) => i !== winnerIndex).join("\n"));
    }
    setWinnerIndex(null);
  }

  const winner = winnerIndex !== null ? names[winnerIndex] : null;

  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
      <section className="flex flex-col items-center gap-8">
        <div className={`relative w-[min(90vw,460px)] ${spinning ? "lw-fast" : ""}`}>
          {/* Spinning part: the slices */}
          <svg
            viewBox="-125 -125 250 250"
            className="absolute inset-0 w-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? `transform ${SPIN_MS}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
                : "none",
            }}
          >
            {n === 0 && <circle r={SLICE_R} fill="#ffe7b3" />}
            {n === 1 && <circle r={SLICE_R} fill={SLICE_COLORS[0][0]} />}
            {n > 1 &&
              names.map((_, i) => {
                const [fill, light] = sliceColor(i, n);
                const start = i * seg;
                const end = (i + 1) * seg;
                const inset = Math.min(seg * 0.12, 3);
                return (
                  <g key={i}>
                    <path d={slicePath(start, end, SLICE_R)} fill={fill} />
                    <path
                      d={ringSlicePath(start + inset, end - inset, HUB_R + 6, SLICE_R - 4)}
                      fill="none"
                      stroke={light}
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      opacity="0.9"
                    />
                    {winnerIndex === i && (
                      <path
                        d={slicePath(start, end, SLICE_R)}
                        fill="#fff"
                        className="lw-winnerSlice"
                      />
                    )}
                  </g>
                );
              })}
            {/* Pink dividers between slices */}
            {n > 1 &&
              names.map((_, i) => {
                const [x1, y1] = point(i * seg, HUB_R);
                const [x2, y2] = point(i * seg, SLICE_R);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#ff6fa0"
                    strokeWidth="3"
                  />
                );
              })}
            {names.map((name, i) => {
              const mid = (i + 0.5) * seg;
              const outline = n === 1 ? SLICE_COLORS[0][2] : sliceColor(i, n)[2];
              let label: string;
              let fontSize: number;
              let transform: string;
              let anchor: "middle" | "end";
              if (across) {
                label = truncate(name, 6);
                const arc = ((2 * Math.PI * 70) / Math.max(n, 2)) * 0.75;
                fontSize = Math.max(7, Math.min(16, arc / textWidth(label)));
                // Where the label ends up on screen once the wheel stops.
                // Bottom half: glyph tops face the hub, so the slice under the
                // pointer reads upright. Top half: tops face out, so nothing is upside down.
                const screen = (((mid + rotation) % 360) + 360) % 360;
                const flip = screen > 90 && screen < 270 ? 180 : 0;
                transform = `rotate(${mid}) translate(0 -70) rotate(${flip})`;
                anchor = "middle";
              } else {
                label = truncate(name, 8);
                const arc = ((2 * Math.PI * 62) / n) * 0.7;
                const room = SLICE_R - HUB_R - 14;
                fontSize = Math.max(4, Math.min(13, arc, room / textWidth(label)));
                transform = `rotate(${mid - 90}) translate(${SLICE_R - 8} 0)`;
                anchor = "end";
              }
              return (
                <text
                  key={i}
                  transform={transform}
                  textAnchor={anchor}
                  dominantBaseline="central"
                  fontSize={fontSize}
                  fontWeight="900"
                  fill="#fff"
                  stroke={outline}
                  strokeWidth={fontSize * 0.22}
                  strokeLinejoin="round"
                  paintOrder="stroke"
                >
                  {label}
                </text>
              );
            })}
          </svg>

          {/* Static frame: rim, bulbs, hub, pointer */}
          <svg viewBox="-125 -125 250 250" className="relative w-full drop-shadow-xl">
            <defs>
              <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ff8db6" />
                <stop offset="1" stopColor="#e63d7c" />
              </linearGradient>
              <radialGradient id="hub" cx="0.4" cy="0.35" r="0.75">
                <stop offset="0" stopColor="#fff27a" />
                <stop offset="0.6" stopColor="#ffd21f" />
                <stop offset="1" stopColor="#ffb300" />
              </radialGradient>
              <linearGradient id="drop" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff59a" />
                <stop offset="1" stopColor="#ffc400" />
              </linearGradient>
              <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#8a1340" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* Rim */}
            <circle r="108" fill="none" stroke="url(#rim)" strokeWidth="16" />
            <circle r="116" fill="none" stroke="#c42a63" strokeWidth="1.5" />
            <circle r="100" fill="none" stroke="#c42a63" strokeWidth="2" />
            {Array.from({ length: BULBS }, (_, i) => {
              const [x, y] = point((i * 360) / BULBS, 108);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3.6"
                  className={i % 2 === 0 ? "lw-bulb" : "lw-bulbAlt"}
                />
              );
            })}

            {/* Hub */}
            <circle r={HUB_R + 5} fill="url(#rim)" filter="url(#soft)" />
            <circle r={HUB_R} fill="url(#hub)" />
            <ellipse cx="-10" cy="-16" rx="14" ry="6" fill="#fff" opacity="0.35" />
            <text
              y="-8"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="13"
              fontWeight="900"
              fill="#fff"
              stroke="#e8457a"
              strokeWidth="3.5"
              strokeLinejoin="round"
              paintOrder="stroke"
            >
              抽獎
            </text>
            <g transform="translate(0 13)">
              <path d={starPath(15)} fill="#ffe14d" stroke="#e8a000" strokeWidth="2" strokeLinejoin="round" />
              <text
                y="1"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="8"
                fontWeight="900"
                fill="#fff"
                stroke="#b86e00"
                strokeWidth="2.2"
                strokeLinejoin="round"
                paintOrder="stroke"
              >
                {n}人
              </text>
            </g>

            {/* Pointer at 6 o'clock, pointing up */}
            <g filter="url(#soft)">
              <path
                d="M 0 88 C 4 96, 15 106, 15 113 C 15 120, 8 122, 0 122 C -8 122, -15 120, -15 113 C -15 106, -4 96, 0 88 Z"
                fill="url(#drop)"
                stroke="#e8a000"
                strokeWidth="1.5"
              />
              <ellipse cx="-5" cy="110" rx="3" ry="5" fill="#fff" opacity="0.6" />
            </g>
          </svg>
        </div>

        <button
          type="button"
          onClick={spin}
          disabled={spinning || n < 2}
          className="lw-spinButton px-14 py-3 text-2xl"
        >
          {spinning ? "轉動中…" : "開始抽獎"}
        </button>
        {n < 2 && (
          <p className="-mt-4 font-bold text-white drop-shadow">
            請至少輸入 2 個名字
          </p>
        )}
      </section>

      <section className="lw-card w-full max-w-sm p-5">
        <label htmlFor="names" className="mb-2 block text-lg font-black text-[#c9346a]">
          抽獎名單（一行一個）
        </label>
        <textarea
          id="names"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={spinning}
          rows={12}
          className="lw-textarea w-full resize-y p-3 disabled:opacity-60"
        />
        <div className="mt-3 flex items-center justify-between text-sm font-bold text-[#a85a00]">
          <span>目前共 {n} 人</span>
          <button
            type="button"
            onClick={() => setText("")}
            disabled={spinning}
            className="rounded-full bg-[#ffe1a8] px-3 py-1 hover:bg-[#ffd27a] disabled:opacity-50"
          >
            清空名單
          </button>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-bold text-[#a85a00]">
          <input
            type="checkbox"
            checked={removeWinner}
            onChange={(e) => setRemoveWinner(e.target.checked)}
            className="h-4 w-4 accent-[#f05d8f]"
          />
          抽中後從名單移除
        </label>
      </section>

      {winner !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={closeResult}
        >
          <div
            className="lw-card lw-popIn w-full max-w-sm p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-black text-[#c9346a]">🎉 恭喜得獎者 🎉</p>
            <p className="lw-title my-5 break-words text-5xl">{winner}</p>
            <button
              type="button"
              onClick={closeResult}
              className="lw-spinButton px-10 py-2 text-xl"
            >
              確定
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
