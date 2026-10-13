import { SCENARIO_CATEGORIES } from "@/data/emotionShiftData";
import { ScenarioCategoryCard } from "./ScenarioCategoryCard";

export function ScenarioCategoryGrid() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6" id="categories">
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {SCENARIO_CATEGORIES.map((cat) => (
          <ScenarioCategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  );
}
