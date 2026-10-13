import { SESSION_HISTORY } from "@/data/mockData";
import { EmotionBadge } from "./EmotionBadge";
import { GlassCard } from "./GlassCard";

export function SessionHistoryTable() {
  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Course</th>
              <th className="px-5 py-3 font-medium">Duration</th>
              <th className="px-5 py-3 font-medium">Dominant Emotion</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {SESSION_HISTORY.map((row) => (
              <tr
                key={row.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition"
              >
                <td className="px-5 py-3 text-foreground/90">{row.date}</td>
                <td className="px-5 py-3 text-foreground/90">{row.course}</td>
                <td className="px-5 py-3 text-foreground/70">{row.duration}</td>
                <td className="px-5 py-3">
                  <EmotionBadge emotion={row.dominant} />
                </td>
                <td className="px-5 py-3">
                  <span
                    className={
                      "rounded-full px-2.5 py-1 text-xs font-medium border " +
                      (row.status === "Completed"
                        ? "bg-emotion-happy/15 text-emotion-happy border-emotion-happy/30"
                        : row.status === "In Progress"
                          ? "bg-brand/15 text-brand border-brand/30"
                          : "bg-emotion-angry/15 text-emotion-angry border-emotion-angry/30")
                    }
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
