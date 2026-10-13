import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustBar, FeatureGrid } from "@/components/landing/FeatureGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CourseShowcase } from "@/components/landing/CourseShowcase";
import { LiveAnalyticsPreview } from "@/components/landing/LiveAnalyticsPreview";
import { Testimonials } from "@/components/landing/Testimonials";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NeuroLearn AI — Learning That Understands You" },
      {
        name: "description",
        content:
          "Smart emotion-based learning platform that adapts lessons in real time using AI-powered emotion intelligence.",
      },
      { property: "og:title", content: "NeuroLearn AI — Learning That Understands You" },
      {
        property: "og:description",
        content:
          "Adaptive online education powered by real-time emotion recognition. Learn smarter — your emotions guide the way.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background hero-grid-bg">
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <FeatureGrid />
        <HowItWorks />
        <CourseShowcase />
        <LiveAnalyticsPreview />
        <Testimonials />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
