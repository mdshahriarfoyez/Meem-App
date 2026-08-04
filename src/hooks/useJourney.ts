import { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { CHAPTER_ORDER, EMPTY_PROGRESS, type ChapterId, type Progress } from '../types';

const STORAGE_KEY = 'meem.journey.v1';

/**
 * Owns navigation and the persisted progress record.
 *
 * `stage` is where she is right now; `progress.furthest` is the deepest chapter
 * she has ever reached. Keeping them separate is what lets her wander back to
 * an earlier chapter without locking the later ones again.
 */
export function useJourney() {
  const [progress, setProgress, resetProgress] = useLocalStorage<Progress>(
    STORAGE_KEY,
    EMPTY_PROGRESS,
  );

  // Resume where she left off, but never past the end of the journey.
  const [stage, setStage] = useState(() =>
    Math.min(progress.furthest, CHAPTER_ORDER.length - 1),
  );

  const chapter = CHAPTER_ORDER[stage];

  const patch = useCallback(
    (changes: Partial<Progress>) => setProgress((prev) => ({ ...prev, ...changes })),
    [setProgress],
  );

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(CHAPTER_ORDER.length - 1, next));
      setStage(clamped);
      setProgress((prev) =>
        clamped > prev.furthest ? { ...prev, furthest: clamped } : prev,
      );
    },
    [setProgress],
  );

  const advance = useCallback(() => goTo(stage + 1), [goTo, stage]);

  const restart = useCallback(() => {
    resetProgress();
    setStage(0);
  }, [resetProgress]);

  const unlocked = useMemo(
    () => CHAPTER_ORDER.slice(0, progress.furthest + 1),
    [progress.furthest],
  );

  return {
    stage,
    chapter: chapter as ChapterId,
    progress,
    unlocked,
    goTo,
    advance,
    patch,
    restart,
  };
}
