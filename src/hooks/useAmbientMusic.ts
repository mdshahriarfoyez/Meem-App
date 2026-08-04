import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Procedural ambient music built with the Web Audio API — no audio file, so the
 * app stays tiny and works offline with nothing extra to cache.
 *
 * Two layers:
 *   1. a warm sustained pad (three detuned sines through a low-pass filter)
 *   2. a slow, randomised pentatonic arpeggio of soft plucked notes
 *
 * Muted by default. The AudioContext is created lazily on the first toggle so
 * we always start it from inside a user gesture, which browsers require.
 */

// A major pentatonic set, two octaves — every combination sounds consonant.
const SCALE = [349.23, 392.0, 440.0, 523.25, 587.33, 698.46, 784.0, 880.0];
const PAD_NOTES = [174.61, 261.63, 349.23]; // F2 / C4 / F4

export function useAmbientMusic() {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<OscillatorNode[]>([]);
  const timerRef = useRef<number | null>(null);

  /** One soft plucked note with an exponential decay. */
  const pluck = useCallback((freq: number, when: number) => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const tone = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = freq;
    tone.type = 'lowpass';
    tone.frequency.value = 1800;

    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(0.16, when + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 3.2);

    osc.connect(tone).connect(gain).connect(master);
    osc.start(when);
    osc.stop(when + 3.4);
  }, []);

  const startAudio = useCallback(() => {
    if (ctxRef.current) return;

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    // A short delay tail gives the pad a sense of space without a reverb impulse.
    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.42;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.32;
    const wet = ctx.createGain();
    wet.gain.value = 0.35;

    master.connect(ctx.destination);
    master.connect(delay);
    delay.connect(feedback).connect(delay);
    delay.connect(wet).connect(ctx.destination);
    masterRef.current = master;

    // Sustained pad.
    const padGain = ctx.createGain();
    padGain.gain.value = 0.05;
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 900;
    padGain.connect(padFilter).connect(master);

    // Slow filter sweep so the pad breathes instead of sitting still.
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.05;
    lfoGain.gain.value = 320;
    lfo.connect(lfoGain).connect(padFilter.frequency);
    lfo.start();

    const padOscs = PAD_NOTES.map((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.value = (i - 1) * 6; // gentle chorus
      osc.connect(padGain);
      osc.start();
      return osc;
    });
    nodesRef.current = [...padOscs, lfo];

    // Arpeggio: one note every ~2.2s, wandering through the scale.
    let index = 2;
    timerRef.current = window.setInterval(() => {
      if (!ctxRef.current) return;
      index = Math.max(0, Math.min(SCALE.length - 1, index + Math.round(Math.random() * 4 - 2)));
      pluck(SCALE[index], ctxRef.current.currentTime + 0.05);
    }, 2200);

    pluck(SCALE[index], ctx.currentTime + 0.4);
  }, [pluck]);

  const toggle = useCallback(() => {
    setEnabled((on) => {
      const next = !on;
      if (next) {
        startAudio();
        const ctx = ctxRef.current!;
        void ctx.resume();
        // Fade in rather than snapping on.
        masterRef.current?.gain.cancelScheduledValues(ctx.currentTime);
        masterRef.current?.gain.setValueAtTime(masterRef.current.gain.value, ctx.currentTime);
        masterRef.current?.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2);
      } else {
        const ctx = ctxRef.current;
        if (ctx && masterRef.current) {
          masterRef.current.gain.cancelScheduledValues(ctx.currentTime);
          masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, ctx.currentTime);
          masterRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
        }
      }
      return next;
    });
  }, [startAudio]);

  // Pause playback while the app is backgrounded so it never plays unattended.
  useEffect(() => {
    const onVisibility = () => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      if (document.hidden) void ctx.suspend();
      else if (enabled) void ctx.resume();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [enabled]);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
      nodesRef.current.forEach((node) => {
        try {
          node.stop();
        } catch {
          // already stopped
        }
      });
      void ctxRef.current?.close();
      ctxRef.current = null;
    },
    [],
  );

  return { enabled, toggle };
}
