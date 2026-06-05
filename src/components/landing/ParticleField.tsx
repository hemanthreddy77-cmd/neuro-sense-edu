export function ParticleField() {
  // Pure CSS animated particles + neural net lines
  const particles = Array.from({ length: 28 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* gradient blobs */}
      <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-brand/25 blur-[120px]" />
      <div className="absolute top-20 -right-20 h-[460px] w-[460px] rounded-full bg-violet/25 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-brand/15 blur-[120px]" />

      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, white 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, white 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* particles */}
      {particles.map((_, i) => {
        const left = (i * 37) % 100;
        const top = (i * 53) % 100;
        const size = 2 + (i % 3);
        const delay = (i % 9) * 0.6;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-brand/70 animate-drift"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animationDelay: `${delay}s`,
              boxShadow: "0 0 12px oklch(0.78 0.16 250 / 0.7)",
            }}
          />
        );
      })}

      {/* neural lines */}
      <svg className="absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="none">
        <defs>
          <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.68 0.18 255)" stopOpacity="0" />
            <stop offset="50%" stopColor="oklch(0.78 0.16 250)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="oklch(0.62 0.14 305)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i}
            x1={`${(i * 13) % 100}%`}
            y1={`${(i * 17) % 100}%`}
            x2={`${(i * 37 + 30) % 100}%`}
            y2={`${(i * 23 + 40) % 100}%`}
            stroke="url(#line)"
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
}
