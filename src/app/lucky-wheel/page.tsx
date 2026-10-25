import type { Metadata } from "next";
import LuckyWheel from "./LuckyWheel";

export const metadata: Metadata = {
  title: "幸運轉盤抽獎",
  description: "輸入名單，轉動轉盤抽出得獎者",
};

export default function LuckyWheelPage() {
  return (
    <main
      className="lw-page flex flex-1 flex-col items-center px-4 py-8"
    >
      <h1 className="lw-title mb-6 text-4xl sm:text-5xl">
        幸運轉盤抽獎
      </h1>
      <LuckyWheel />
    </main>
  );
}
