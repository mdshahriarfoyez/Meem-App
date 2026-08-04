import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Backdrop, type Mood } from './components/background/Backdrop';
import { BootSplash } from './components/BootSplash';
import { MusicToggle } from './components/MusicToggle';
import { ProgressDots } from './components/ProgressDots';
import { SecretPage } from './components/SecretPage';

import { Opening } from './chapters/Opening';
import { LoveStory } from './chapters/LoveStory';
import { MemoryGame } from './chapters/MemoryGame';
import { Adventure } from './chapters/Adventure';
import { LoveMeter } from './chapters/LoveMeter';
import { ImpossibleQuestion } from './chapters/ImpossibleQuestion';
import { SecretLetter } from './chapters/SecretLetter';
import { Finale } from './chapters/Finale';

import { useJourney } from './hooks/useJourney';
import { useAmbientMusic } from './hooks/useAmbientMusic';
import { silkSpring } from './lib/motion';
import { haptic } from './lib/haptics';

export default function App() {
  const { stage, chapter, progress, goTo, advance, patch, restart } = useJourney();
  const music = useAmbientMusic();

  const [booting, setBooting] = useState(true);
  const [secretOpen, setSecretOpen] = useState(false);
  const [celebrated, setCelebrated] = useState(false);
  const stageRef = useRef<HTMLElement>(null);

  // A tall chapter can leave the stage scrolled; every new chapter starts at the top.
  useEffect(() => {
    stageRef.current?.scrollTo({ top: 0 });
  }, [stage]);

  // Hold the splash briefly so the first chapter never pops in mid-layout.
  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Escape closes the easter egg on desktop.
  useEffect(() => {
    if (!secretOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSecretOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [secretOpen]);

  const openSecret = useCallback(() => {
    setSecretOpen(true);
    patch({ secretFound: true });
  }, [patch]);

  /** Warm through the second half, sunrise once she says yes at the end. */
  const mood: Mood = celebrated ? 'sunrise' : stage >= 5 ? 'warm' : 'night';

  const renderChapter = () => {
    switch (chapter) {
      case 'opening':
        return (
          <Opening
            key="opening"
            onContinue={advance}
            onSecret={openSecret}
            secretFound={progress.secretFound}
          />
        );
      case 'story':
        return <LoveStory key="story" onContinue={advance} />;
      case 'memory':
        return <MemoryGame key="memory" onContinue={advance} />;
      case 'adventure':
        return (
          <Adventure
            key="adventure"
            chosen={progress.adventure}
            onChoose={(id) => patch({ adventure: id })}
            onContinue={advance}
          />
        );
      case 'meter':
        return <LoveMeter key="meter" onContinue={advance} />;
      case 'question':
        return (
          <ImpossibleQuestion
            key="question"
            onYes={() => {
              patch({ saidYes: true });
              advance();
            }}
          />
        );
      case 'letter':
        return <SecretLetter key="letter" onContinue={advance} />;
      case 'finale':
        return (
          <Finale
            key="finale"
            onCelebrate={() => setCelebrated(true)}
            hiddenFound={progress.hiddenFound}
            onHiddenFound={() => patch({ hiddenFound: true })}
          />
        );
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Backdrop mood={mood} />

      {/* --- chapter stage --------------------------------------------- */}
      <main
        ref={stageRef}
        className="soft-scroll relative z-10 h-full overflow-x-hidden overflow-y-auto"
      >
        <AnimatePresence mode="wait">{renderChapter()}</AnimatePresence>
      </main>

      {/* --- chrome ------------------------------------------------------ */}
      <div className="pad-safe pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between px-5">
        <div className="pointer-events-auto">
          <AnimatePresence>
            {progress.furthest > 0 && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileTap={{ scale: 0.9 }}
                transition={silkSpring}
                onClick={() => {
                  haptic('soft');
                  setCelebrated(false);
                  restart();
                }}
                aria-label="Start again from the beginning"
                className="glass flex h-11 w-11 items-center justify-center rounded-full text-cream/70"
              >
                <span aria-hidden className="text-base leading-none">
                  ↺
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="pointer-events-auto">
          <MusicToggle enabled={music.enabled} onToggle={music.toggle} />
        </div>
      </div>

      <AnimatePresence>
        {progress.furthest > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={silkSpring}
            className="fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-20 flex justify-center"
          >
            <ProgressDots stage={stage} furthest={progress.furthest} onJump={goTo} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- overlays ---------------------------------------------------- */}
      <AnimatePresence>
        {secretOpen && <SecretPage onClose={() => setSecretOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>{booting && <BootSplash />}</AnimatePresence>
    </div>
  );
}
