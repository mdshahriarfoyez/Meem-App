/**
 * Tiny vibration helper. Silently no-ops where the API is unavailable
 * (notably iOS Safari), so callers never need to feature-detect.
 */
type Strength = 'tick' | 'soft' | 'double' | 'celebrate';

const PATTERNS: Record<Strength, number | number[]> = {
  tick: 8,
  soft: 18,
  double: [14, 60, 14],
  celebrate: [18, 50, 24, 50, 40],
};

export function haptic(strength: Strength = 'tick') {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  try {
    navigator.vibrate(PATTERNS[strength]);
  } catch {
    // Some browsers throw when the document is not focused; nothing to do.
  }
}
