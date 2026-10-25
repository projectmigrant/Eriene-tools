import type { Metadata } from "next";
import Pomodoro from "./Pomodoro";

export const metadata: Metadata = {
  title: "番茄鐘",
  description: "專注工作、適時休息的番茄鐘計時器",
};

export default function PomodoroPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Pomodoro />
    </main>
  );
}
