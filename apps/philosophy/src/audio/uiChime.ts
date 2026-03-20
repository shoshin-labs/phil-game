/** Tiny UI blip — no external assets; fails silently if AudioContext is blocked. */
export function playUiChime(): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 392;
    gain.gain.value = 0.035;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.055);
    osc.onended = () => void ctx.close();
  } catch {
    /* ignore */
  }
}
