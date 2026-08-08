import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

// ─── AnimatedText — word-by-word cinematic reveal ────────────────────────────
//
// The paragraph is rendered twice:
//   Base layer   — always visible, muted color, drives layout height.
//   Reveal layer — white words, each revealed with a staggered CSS transition.
//
// Each word in the reveal layer starts at opacity 0 (invisible).
// When the IntersectionObserver fires (once), a CSS class is added to the
// container that drives all word spans to opacity 1 via CSS transitions.
// Every word has a unique `transition-delay` calculated from its position in
// the text, so the first word transitions first and the last word transitions
// last — producing one continuous left-to-right sweep through the text.
//
// The transition between consecutive words overlaps slightly (each word's
// transition duration is longer than the gap between delays) so the effect
// reads as one smooth sweep, not independent pops.
//
// After the animation finishes (~reveal duration), we flip to a simple
// "fully revealed" state with no ongoing transition overhead.
//
// One-time: the observer disconnects immediately on first trigger.
// prefers-reduced-motion: skips straight to the final white state.
// Mobile: works correctly across any number of wrapped lines because each
// word span is independent — there is no bounding-box mask to misalign.

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

// Total duration of the full sweep animation (ms).
const SWEEP_MS = 1600;
// Duration of each individual word's opacity transition (ms).
// Longer than the inter-word delay so adjacent words overlap smoothly.
const WORD_TRANSITION_MS = 420;

const AnimatedText = ({ text, className, style }: AnimatedTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'idle' | 'animating' | 'done'>('idle');

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReduced) {
      setPhase('done');
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPhase('animating');
          observer.disconnect();
          // After the full sweep completes, move to done so we shed the
          // per-word transition overhead and keep the white text permanently.
          setTimeout(() => setPhase('done'), SWEEP_MS + WORD_TRANSITION_MS + 100);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Split text into words, preserving spaces between them.
  const words = text.split(' ');
  const totalWords = words.length;

  return (
    // overflow:hidden prevents any sub-pixel edge from causing a horizontal
    // scrollbar on narrow mobile screens.
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className ?? ''}`}
      style={style}
    >
      {/* ── Base layer ────────────────────────────────────────────────────
          Always visible, muted color. Drives the container height so the
          absolutely-positioned reveal layer always has the right dimensions. */}
      <p
        className="w-full"
        style={{ color: 'rgba(215, 226, 234, 0.28)' }}
        aria-hidden="true"
      >
        {text}
      </p>

      {/* ── Reveal layer ──────────────────────────────────────────────────
          Words start transparent. When phase === 'animating', each word
          transitions to opacity 1 with a staggered delay proportional to its
          position in the sentence — first word first, last word last.
          When phase === 'done', all words are solidly white with no ongoing
          transition (clean steady state). */}
      <p
        className="absolute inset-0 w-full"
        style={{ color: '#D7E2EA' }}
        aria-live="off"
      >
        {words.map((word, i) => {
          // Fraction through the sentence (0 = first word, 1 = last word).
          const fraction = totalWords > 1 ? i / (totalWords - 1) : 0;
          // Delay spreads linearly from 0 ms to SWEEP_MS.
          const delayMs = fraction * SWEEP_MS;

          const wordStyle: CSSProperties =
            phase === 'done'
              ? { opacity: 1 }
              : phase === 'animating'
              ? {
                  opacity: 1,
                  transition: `opacity ${WORD_TRANSITION_MS}ms ease`,
                  transitionDelay: `${delayMs}ms`,
                }
              : {
                  // idle — fully hidden, no transition yet
                  opacity: 0,
                };

          return (
            <span key={i} style={wordStyle}>
              {word}
              {i < totalWords - 1 ? ' ' : ''}
            </span>
          );
        })}
      </p>

      {/* Screen-reader text */}
      <span className="sr-only">{text}</span>
    </div>
  );
};

export default AnimatedText;
