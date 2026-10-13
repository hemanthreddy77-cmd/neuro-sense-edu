import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ScenarioCard } from "@/components/emotion-shift/ScenarioCard";
import { SCENARIOS, SCENARIO_CATEGORIES } from "@/data/emotionShiftData";
import type { ScenarioCategorySlug, ScenarioDifficulty } from "@/data/emotionShiftData";
import { Search, Filter, RotateCcw, Sparkles } from "lucide-react";

export type ScenariosSearchCriteria = {
  category?: string;
  search?: string;
};

export const Route = createFileRoute("/_authenticated/emotion-shift/scenarios")({
  validateSearch: (search: Record<string, unknown>): ScenariosSearchCriteria => {
    return {
      category: search.category ? String(search.category) : undefined,
      search: search.search ? String(search.search) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "All Scenarios — EmotionShift AI" },
      {
        name: "description",
        content: "Browse and filter interactive emotion-adaptive scenarios and experiences.",
      },
    ],
  }),
  component: ScenariosListingPage,
});

function ScenariosListingPage() {
  const { category: initialCategory, search: initialSearch } = Route.useSearch();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const filteredScenarios = useMemo(() => {
    return SCENARIOS.filter((sc) => {
      if (!sc.published) return false;

      // Category filter
      if (selectedCategory !== "all" && sc.categorySlug !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== "all" && sc.difficulty !== selectedDifficulty) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = sc.title.toLowerCase().includes(q);
        const matchesDesc = sc.description.toLowerCase().includes(q);
        const matchesType = sc.interactionType.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesType) return false;
      }

      return true;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    navigate({
      to: "/emotion-shift/scenarios",
      search: {
        category: slug === "all" ? undefined : slug,
        search: searchQuery || undefined,
      },
    });
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedDifficulty("all");
    navigate({
      to: "/emotion-shift/scenarios",
      search: {
        category: undefined,
        search: undefined,
      },
    });
  };

  const activeCategoryObj = SCENARIO_CATEGORIES.find((c) => c.slug === selectedCategory);

  return (
    <AppShell title="Scenario Catalog">
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {activeCategoryObj ? activeCategoryObj.title : "Interactive Experiences"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeCategoryObj
                ? activeCategoryObj.description
                : "Choose an activity based on your energy, mood, or curiosity."}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
        </div>

        {/* Category Pills Carousel/Wrap */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategorySelect("all")}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-brand text-brand-foreground shadow-md font-semibold"
                : "border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
            }`}
          >
            All Categories ({SCENARIOS.length})
          </button>

          {SCENARIO_CATEGORIES.map((cat) => {
            const count = SCENARIOS.filter((s) => s.categorySlug === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`whitespace-nowrap flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "font-semibold shadow-md"
                    : "border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                }`}
                style={
                  isSelected
                    ? {
                        background: cat.accentColor,
                        color: "#fff",
                      }
                    : {}
                }
              >
                <cat.icon className="h-3.5 w-3.5" />
                <span>{cat.title}</span>
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Difficulty Filter row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            <span>Difficulty:</span>
          </div>
          <div className="flex gap-1.5">
            {["all", "easy", "medium", "hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`capitalize px-2.5 py-1 rounded-md transition-colors ${
                  selectedDifficulty === diff
                    ? "bg-white/15 text-foreground font-semibold"
                    : "hover:text-foreground"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {(selectedCategory !== "all" || searchQuery || selectedDifficulty !== "all") && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 text-[11px] text-brand hover:underline"
            >
              <RotateCcw className="h-3 w-3" /> Reset filters
            </button>
          )}
        </div>

        {/* Results Grid */}
        {filteredScenarios.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredScenarios.map((sc) => (
              <ScenarioCard key={sc.id} scenario={sc} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-white/10 bg-white/5">
            <Sparkles className="h-10 w-10 text-muted-foreground mb-3 opacity-40" />
            <h3 className="text-base font-semibold text-foreground">No scenarios found</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
              We couldn't find any activities matching your active filters or search terms.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-foreground hover:bg-white/10"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
