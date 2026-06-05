import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { GradientButton } from "../common/GradientButton";

export function CtaSection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="glass-strong relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/25 via-violet/20 to-transparent" />
          <div className="absolute -top-20 left-1/2 -z-10 h-60 w-[80%] -translate-x-1/2 rounded-full bg-brand/30 blur-3xl" />
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            Your turn
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to experience <span className="text-gradient">intelligent learning?</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            Join the future of education where AI understands how you feel and helps you
            learn better.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register"><GradientButton>Get Started Free <ArrowRight className="h-4 w-4" /></GradientButton></Link>
            <Link to="/register"><GradientButton variant="outline">Create Account</GradientButton></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
