/**
 * Synthesizes subtle, premium notification chimes using Web Audio API.
 * Requires zero external audio files.
 */
export function playNotificationSound(type: string = "info") {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Frequency pairs for different notification feelings
    const tones: Record<string, [number, number]> = {
      achievement: [587.33, 880], // D5 -> A5 (triumphant)
      success: [523.25, 659.25], // C5 -> E5 (pleasing)
      warning: [440, 370], // A4 -> F#4 (caution)
      error: [370, 277.18], // F#4 -> C#4 (low alert)
      emotionshift_suggestion: [440, 554.37], // A4 -> C#5 (calming)
      reminder: [493.88, 587.33], // B4 -> D5 (friendly ping)
      info: [523.25, 659.25], // C5 -> E5
    };

    const [freq1, freq2] = tones[type] || [523.25, 659.25];

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";

    osc1.frequency.setValueAtTime(freq1, now);
    osc2.frequency.setValueAtTime(freq2, now + 0.08);

    // Smooth envelope attack and decay
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.2);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.45);

    // Close audio context after playback to save mobile memory
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 600);
  } catch {
    // Gracefully ignore audio errors (e.g. user hasn't interacted with page yet)
  }
}
