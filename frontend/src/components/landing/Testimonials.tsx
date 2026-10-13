import { TESTIMONIALS } from "@/data/mockData";
import { Star, Quote } from "lucide-react";
import { GlassCard } from "../common/GlassCard";

export function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by <span className="text-gradient">curious minds</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Real stories from students and instructors using NeuroLearn AI every day.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => (
            <GlassCard key={t.id} className="relative p-6 animate-fade-in-up" strong={idx === 1}>
              <Quote className="h-6 w-6 text-brand/60" />
              <p className="mt-3 text-sm text-foreground/90 leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full border border-white/15"
                />
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
                <div className="ml-auto flex">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-emotion-confused text-emotion-confused"
                    />
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
