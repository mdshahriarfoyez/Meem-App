import { useCallback, useEffect, useRef, useState } from 'react';

interface Options {
  /** How long the press must be held, in ms. */
  duration?: number;
  onComplete: () => void;
}

/**
 * Press-and-hold detector that also reports live progress (0 → 1) so the UI can
 * draw a filling ring. Handles pointer, touch and mouse through pointer events,
 * and cancels cleanly if the finger slides off or the component unmounts.
 */
export function useLongPress({ duration = 3000, onComplete }: Options) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setHolding(false);
    if (!doneRef.current) setProgress(0);
  }, []);

  const tick = useCallback(() => {
    const elapsed = performance.now() - startRef.current;
    const next = Math.min(1, elapsed / duration);
    setProgress(next);
    if (next >= 1) {
      doneRef.current = true;
      setHolding(false);
      onCompleteRef.current();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [duration]);

  const start = useCallback(() => {
    if (doneRef.current) return;
    startRef.current = performance.now();
    setHolding(true);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return {
    progress,
    holding,
    /** Spread onto the element that should respond to the hold. */
    handlers: {
      onPointerDown: start,
      onPointerUp: stop,
      onPointerLeave: stop,
      onPointerCancel: stop,
      // Stop iOS from firing the text-selection / callout gesture mid-hold.
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    },
  };
}
