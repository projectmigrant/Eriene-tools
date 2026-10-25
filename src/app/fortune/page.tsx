import type { Metadata } from "next";
import FortuneDraw from "./FortuneDraw";

export const metadata: Metadata = {
  title: "好運抽籤",
  description: "抽一支籤，看看今天的運勢",
};

export default function FortunePage() {
  return (
    <main className="fx-page flex flex-1 flex-col items-center px-4 py-8">
      <FortuneDraw />
    </main>
  );
}
