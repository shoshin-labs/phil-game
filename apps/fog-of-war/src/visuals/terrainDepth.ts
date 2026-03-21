/**
 * Fake depth on a flat grid: rows nearer the bottom read as "closer" (slightly brighter).
 */
export function cellTintByRowDepth(
  hex: number,
  row: number,
  gridH: number,
): number {
  if (gridH <= 1) return hex;
  const t = row / (gridH - 1);
  const factor = 0.78 + t * 0.22;
  const r = ((hex >> 16) & 0xff) * factor;
  const g = ((hex >> 8) & 0xff) * factor;
  const b = (hex & 0xff) * factor;
  return (
    (Math.min(255, Math.round(r)) << 16) |
    (Math.min(255, Math.round(g)) << 8) |
    Math.min(255, Math.round(b))
  );
}
