"use client";

import { useEffect, useState } from "react";

type Mode = "focus" | "short" | "long";

const MODES: Record<
  Mode,
  { label: string; hint: string; bg: string; ring: string; button: string }
> = {
  focus: {
    label: "專注",
    hint: "專心做一件事，別分心",
    bg: "bg-[#c84b45]",
    ring: "#ffe1dc",
    button: "text-[#c84b45]",
  },
  short: {
    label: "短休息",
    hint: "起來走走、喝口水",
    bg: "bg-[#3a8f88]",
    ring: "#d6f5f1",
    button: "text-[#3a8f88]",
  },
  long: {
    label: "長休息",
    hint: "好好放鬆一下",
    bg: "bg-[#3d74a8]",
    ring: "#dbeafb",
    button: "text-[#3d74a8]",
  },
};

const MODE_ORDER: Mode[] = ["focus", "short", "long"];
const RING_R = 120;
const RING_C = 2 * Math.PI * RING_R;

function format(ms: number) {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function beep() {
  try {
    const ctx = new AudioContext();
    [0, 0.35, 0.7].forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.25, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.3);
    });
  } catch {
    // Sound is a nice-to-have; ignore if the browser blocks audio.
  }
}

function notify(body: string) {
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification("番茄鐘", { body });
  }
}

export default function Pomodoro() {
  const [minutes, setMinutes] = useState<Record<Mode, number>>({
    focus: 25,
    short: 5,
    long: 15,
  });
  const [longEvery, setLongEvery] = useState(4);
  const [autoStart, setAutoStart] = useState(false);
  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(25 * 60 * 1000);
  // Wall-clock time the current session ends; null while paused.
  const [endAt, setEndAt] = useState<number | null>(null);
  const [completed, setCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const running = endAt !== null;
  const duration = minutes[mode] * 60 * 1000;
  const progress = duration > 0 ? 1 - remaining / duration : 0;
  const theme = MODES[mode];
  // Tomatoes in the current round; stays full during the long break that ends it.
  const cycleDone =
    completed > 0 && completed % longEvery === 0 && mode === "long"
      ? longEvery
      : completed % longEvery;

  useEffect(() => {
    if (endAt === null) return;
    const id = setInterval(() => {
      const left = endAt - Date.now();
      if (left > 0) {
        setRemaining(left);
        return;
      }

      beep();
      let next: Mode = "focus";
      if (mode === "focus") {
        const done = completed + 1;
        setCompleted(done);
        next = done % longEvery === 0 ? "long" : "short";
        notify(`完成第 ${done} 個番茄！該休息了`);
      } else {
        notify("休息結束，回來專注吧");
      }
      const nextMs = minutes[next] * 60 * 1000;
      setMode(next);
      setRemaining(nextMs);
      setEndAt(autoStart ? Date.now() + nextMs : null);
    }, 250);
    return () => clearInterval(id);
  }, [endAt, mode, completed, longEvery, minutes, autoStart]);

  useEffect(() => {
    document.title = `${format(remaining)} · ${theme.label} | 番茄鐘`;
  }, [remaining, theme.label]);

  function toggle() {
    if (endAt !== null) {
      setRemaining(endAt - Date.now());
      setEndAt(null);
    } else {
      if (typeof Notification !== "undefined" && Notification.permission === "default") {
        Notification.requestPermission();
      }
      setEndAt(Date.now() + remaining);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setRemaining(minutes[next] * 60 * 1000);
    setEndAt(null);
  }

  function reset() {
    setRemaining(duration);
    setEndAt(null);
  }

  function skip() {
    if (mode === "focus") {
      switchMode((completed + 1) % longEvery === 0 ? "long" : "short");
    } else {
      switchMode("focus");
    }
  }

  function changeMinutes(m: Mode, value: number) {
    const v = Math.min(120, Math.max(1, Math.round(value) || 1));
    setMinutes({ ...minutes, [m]: v });
    if (m === mode && !running) setRemaining(v * 60 * 1000);
  }

  return (
    <div
      className={`${theme.bg} flex flex-1 flex-col items-center px-4 py-10 text-white transition-colors duration-700`}
    >
      <h1 className="mb-8 text-3xl font-bold tracking-wide">🍅 番茄鐘</h1>

      <div className="flex gap-1 rounded-full bg-black/15 p-1">
        {MODE_ORDER.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              m === mode ? "bg-white/25" : "opacity-75 hover:opacity-100"
            }`}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      <div className="relative my-8 w-[min(80vw,300px)]">
        <svg viewBox="0 0 280 280" className="w-full -rotate-90">
          <circle cx="140" cy="140" r={RING_R} fill="none" stroke="rgb(0 0 0 / 0.15)" strokeWidth="12" />
          <circle
            cx="140"
            cy="140"
            r={RING_R}
            fill="none"
            stroke={theme.ring}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-300 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-6xl font-bold tabular-nums sm:text-7xl">
            {format(remaining)}
          </span>
          <span className="mt-2 text-sm opacity-80">{theme.hint}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="h-12 w-12 rounded-full bg-black/15 text-xl transition hover:bg-black/25"
          title="重設"
          aria-label="重設"
        >
          ↺
        </button>
        <button
          type="button"
          onClick={toggle}
          className={`${theme.button} w-40 rounded-xl bg-white py-3 text-xl font-bold shadow-[0_6px_0_rgb(0_0_0/0.2)] transition active:translate-y-1 active:shadow-[0_2px_0_rgb(0_0_0/0.2)]`}
        >
          {running ? "暫停" : "開始"}
        </button>
        <button
          type="button"
          onClick={skip}
          className="h-12 w-12 rounded-full bg-black/15 text-xl transition hover:bg-black/25"
          title="跳過這一段"
          aria-label="跳過這一段"
        >
          ⏭
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-lg font-semibold">
          已完成 {completed} 個番茄
        </p>
        <p className="mt-1 text-2xl tracking-widest" aria-hidden>
          {Array.from({ length: longEvery }, (_, i) => (i < cycleDone ? "🍅" : "⚪")).join("")}
        </p>
        <p className="mt-1 text-sm opacity-75">每 {longEvery} 個番茄來一次長休息</p>
      </div>

      <button
        type="button"
        onClick={() => setShowSettings(!showSettings)}
        className="mt-8 text-sm underline underline-offset-4 opacity-80 hover:opacity-100"
      >
        {showSettings ? "收起設定" : "⚙ 設定時間"}
      </button>

      {showSettings && (
        <div className="mt-4 w-full max-w-sm rounded-2xl bg-black/15 p-5">
          {MODE_ORDER.map((m) => (
            <label key={m} className="mb-3 flex items-center justify-between">
              <span>{MODES[m].label}（分鐘）</span>
              <input
                type="number"
                min={1}
                max={120}
                value={minutes[m]}
                onChange={(e) => changeMinutes(m, Number(e.target.value))}
                className="w-20 rounded-lg bg-white/90 px-2 py-1 text-right text-zinc-900"
              />
            </label>
          ))}
          <label className="mb-3 flex items-center justify-between">
            <span>幾個番茄後長休息</span>
            <input
              type="number"
              min={2}
              max={10}
              value={longEvery}
              onChange={(e) =>
                setLongEvery(Math.min(10, Math.max(2, Math.round(Number(e.target.value)) || 2)))
              }
              className="w-20 rounded-lg bg-white/90 px-2 py-1 text-right text-zinc-900"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={autoStart}
              onChange={(e) => setAutoStart(e.target.checked)}
              className="h-4 w-4"
            />
            時間到自動開始下一段
          </label>
        </div>
      )}
    </div>
  );
}
