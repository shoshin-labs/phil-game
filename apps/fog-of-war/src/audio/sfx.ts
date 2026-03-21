import Phaser from "phaser";
import type { Scene } from "phaser";

function getAudioContext(scene: Scene): AudioContext | null {
  const sm = scene.sound;
  if (!(sm instanceof Phaser.Sound.WebAudioSoundManager)) return null;
  const ctx = sm.context;
  if (!ctx || ctx.state === "closed") return null;
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function playTone(
  scene: Scene,
  freq: number,
  durationSec: number,
  gain: number,
  type: OscillatorType = "sine",
) {
  const ac = getAudioContext(scene);
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = ac.currentTime;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + durationSec);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + durationSec + 0.04);
}

/** Short shell launch. */
export function playShoot(scene: Scene) {
  playTone(scene, 420, 0.07, 0.055, "triangle");
}

/** Two-tone ping. */
export function playSonar(scene: Scene) {
  playTone(scene, 200, 0.14, 0.05, "sine");
  globalThis.setTimeout(() => {
    playTone(scene, 320, 0.1, 0.038, "sine");
  }, 55);
}

/** Game over / bunker breach sting. */
export function playGameEnd(scene: Scene) {
  playTone(scene, 180, 0.25, 0.06, "sine");
  globalThis.setTimeout(() => {
    playTone(scene, 120, 0.35, 0.05, "sine");
  }, 90);
}
