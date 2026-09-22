import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import FadeIn from './FadeIn';
import LiveProjectButton from './LiveProjectButton';
import { PROJECTS } from '../data/portfolio';
import type { Project } from '../data/portfolio';

// ─── Stacked-card deck ────────────────────────────────────────────────────────
//
// Exact mechanism from reference (review.tsx):
//
//   Each ProjectCard is directly `position:sticky` with
//   `top: BASE_TOP + index * STEP`.
//
//   Because every card is `h-[85vh]` and they are siblings in a normal-flow
//   flex-col container, the container is naturally N×85vh tall — giving every
//   sticky card a full scroll range before the section ends.
//
//   useScroll targets the card itself with offset ['start end','start start']:
//   • 0 = card bottom enters viewport bottom  (card about to scroll in)
//   • 1 = card top reaches viewport top        (card fully scrolled through)
//
//   scale = useTransform([0,1] → [1, targetScale])
//   targetScale = 1 - (total-1-index) * 0.03
//   → last card: scale stays 1 (nothing stacks on it)
//   → first card: compresses most (all others stack on top)
//
//   No wrappers, no margin-bottom hacks — the height of each card IS the
//   scroll range.

const BASE_TOP    = 96;   // px — clears nav bar
const STEP        = 28;   // px — additional offset per card

// ─── Screenshot carousel ─────────────────────────────────────────────────────
const ScreenshotCarousel = ({
  screenshots,
  title,
}: {
  screenshots: string[];
  title: string;
}) => {
  const [current, setCurrent] = useState(0);
  const total = screenshots.length;
  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setCurrent(c => (c - 1 + total) % total); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setCurrent(c => (c + 1) % total); };

  return (
    <div className="relative w-full h-full group/cs">
      <img
        key={current}
        src={screenshots[current]}
        alt={`${title} screenshot ${current + 1} of ${total}`}
        className="h-full w-full object-cover"
        loading="lazy"
        draggable={false}
      />
      {total > 1 && (
        <>
          <button onClick={prev} aria-label="Previous"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-black/70 border border-white/20 text-white opacity-0 group-hover/cs:opacity-100 transition-opacity backdrop-blur-sm focus-visible:opacity-100 focus-visible:outline-none">
            <ChevronLeft size={14} />
          </button>
          <button onClick={next} aria-label="Next"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-black/70 border border-white/20 text-white opacity-0 group-hover/cs:opacity-100 transition-opacity backdrop-blur-sm focus-visible:opacity-100 focus-visible:outline-none">
            <ChevronRight size={14} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {screenshots.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }}
                aria-label={`Screenshot ${i + 1}`}
                className={`h-1.5 rounded-full transition-all focus-visible:outline-none ${i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Placeholder (no image) ───────────────────────────────────────────────────
const GRADIENTS = [
  'from-[#12071f] via-[#1e0a3c] to-[#0a0a14]',
  'from-[#071220] via-[#0d2040] to-[#050f1a]',
  'from-[#1a0707] via-[#2d0f0f] to-[#0a0505]',
];

const Placeholder = ({ title, index }: { title: string; index: number }) => {
  const initials = title.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className={`relative w-full h-full bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} flex flex-col items-center justify-center gap-3`} aria-hidden="true">
      {[240, 160, 80].map(s => (
        <div key={s} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" style={{ width: s, height: s }} />
      ))}
      <span className="relative z-10 font-black leading-none select-none" style={{ fontSize: 'clamp(4rem,12vw,7rem)', color: 'rgba(215,226,234,0.07)' }}>{initials}</span>
      <span className="relative z-10 text-xs font-medium uppercase tracking-[0.25em] text-white/20 text-center px-6">{title}</span>
    </div>
  );
};

// ─── ProjectCard ──────────────────────────────────────────────────────────────
interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
}

const ProjectCard = ({ project, index, total }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Reference pattern: track each card's own scroll progress.
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  });

  // Reference formula: earlier cards compress as later ones stack on them.
  // Last card → targetScale = 1 (no compression).
  // First card → maximum compression.
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  const hasLive        = Boolean(project.liveUrl);
  const hasGithub      = Boolean(project.githubUrl);
  const hasTech        = (project.technologies?.length ?? 0) > 0;
  const hasScreenshots = (project.screenshots?.length ?? 0) > 0;
  const hasImage       = Boolean(project.image);

  // Sticky top: BASE_TOP + index * STEP (exact reference pattern).
  const top = BASE_TOP + index * STEP;

  return (
    // Directly sticky — height h-[85vh] IS the scroll range.
    // No wrapper, no margin-bottom.
    <div
      ref={cardRef}
      className="sticky w-full h-[85vh]"
      style={{ top: `${top}px`, zIndex: 10 + index }}
    >
      <motion.article
        style={{ scale }}
        className="origin-top mx-auto h-full w-full flex flex-col gap-4 sm:gap-5 md:gap-6 rounded-[32px] sm:rounded-[44px] md:rounded-[56px] border-2 border-[#D7E2EA]/20 bg-[#0C0C0C] p-5 sm:p-7 md:p-9 lg:p-10 overflow-hidden"
        aria-label={`Project: ${project.title}`}
      >

        {/* ── Top row: number + category/title + Live button ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 flex-shrink-0">

          <div className="flex items-start gap-3 sm:gap-5 md:gap-8 min-w-0">
            {/* Large ghost project number */}
            <span
              className="shrink-0 font-black text-[#D7E2EA] leading-none select-none"
              style={{ fontSize: 'clamp(2.2rem, 7vw, 6.5rem)' }}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className="flex flex-col gap-1 pt-0.5 sm:pt-1 md:pt-2 min-w-0">
              {project.category && (
                <span
                  className="font-light uppercase tracking-widest text-[#D7E2EA]/55"
                  style={{ fontSize: 'clamp(0.6rem, 1.1vw, 0.9rem)' }}
                >
                  {project.category}
                </span>
              )}
              <h3
                className="font-medium uppercase text-[#D7E2EA] leading-tight"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2rem)' }}
              >
                {project.title}
              </h3>
            </div>
          </div>

          {/* Primary CTA — Live Project button (reference style) */}
          {hasLive && (
            <div className="shrink-0 self-start sm:self-auto">
              <LiveProjectButton href={project.liveUrl!} />
            </div>
          )}
        </div>

        {/* ── Description + tech pills (compact row below header) ── */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          {project.description && (
            <p
              className="font-light leading-relaxed text-[#D7E2EA]/60 max-w-2xl"
              style={{ fontSize: 'clamp(0.78rem, 1.3vw, 0.98rem)' }}
            >
              {project.description}
            </p>
          )}

          {hasTech && (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies!.map(tech => (
                <span
                  key={tech}
                  className="rounded-full border border-[#D7E2EA]/20 bg-[#D7E2EA]/[0.04] px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/55"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Main visual — takes remaining height ── */}
        <div className="flex-1 min-h-0 flex flex-col gap-3">

          {/* Primary image area */}
          <div className="flex-1 min-h-0 overflow-hidden rounded-[20px] sm:rounded-[28px] md:rounded-[36px] bg-[#111115]">
            {hasScreenshots ? (
              <ScreenshotCarousel screenshots={project.screenshots!} title={project.title} />
            ) : hasImage ? (
              <img
                src={project.image}
                alt={`${project.title} screenshot`}
                className="h-full w-full object-cover"
                loading="lazy"
                draggable={false}
              />
            ) : (
              <Placeholder title={project.title} index={index} />
            )}
          </div>

          {/* Secondary action row (View Code) */}
          {hasGithub && (
            <div className="flex-shrink-0 flex items-center gap-3">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} source on GitHub`}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#D7E2EA]/25 bg-[#D7E2EA]/[0.04] px-5 py-2 text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/75 transition-all hover:border-[#D7E2EA]/55 hover:text-[#D7E2EA] hover:bg-[#D7E2EA]/[0.08] hover:scale-[1.02] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7E2EA]/30"
              >
                <Github size={12} strokeWidth={2} />
                View Code
              </a>
              {/* Show live button here too if no live button in header (safety) */}
              {hasLive && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.title} live`}
                  className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-medium uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  style={{ background: 'linear-gradient(135deg,#1a0a2e 0%,#6c21b0 50%,#4a1a80 100%)', boxShadow: '0 2px 12px rgba(108,33,176,0.3)' }}
                >
                  <ExternalLink size={12} strokeWidth={2} />
                  Live
                </a>
              )}
            </div>
          )}
        </div>

      </motion.article>
    </div>
  );
};

// ─── Section ──────────────────────────────────────────────────────────────────
// No fixed container height needed — the flex-col of N×h-[85vh] sticky cards
// gives the container its natural height, which is the correct scroll range.

const ProjectsSection = () => (
  <section
    id="projects"
    className="relative z-10 w-full bg-[#0C0C0C] px-4 sm:px-6 md:px-10 pt-16 sm:pt-20 md:pt-28 pb-24 sm:pb-32 md:pb-40"
  >
    <FadeIn y={40}>
      <h2
        className="hero-heading text-center font-black uppercase tracking-tight leading-none mb-3"
        style={{ fontSize: 'clamp(2.8rem, 12vw, 140px)' }}
      >
        Projects
      </h2>
    </FadeIn>

    <FadeIn delay={0.1} y={20}>
      <p
        className="text-center font-light uppercase tracking-widest text-[#D7E2EA]/40 mb-12 sm:mb-16 md:mb-20"
        style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.9rem)' }}
      >
        Featured work · More coming soon
      </p>
    </FadeIn>

    {/* Direct sticky siblings — reference pattern */}
    <div className="mx-auto max-w-7xl flex flex-col">
      {PROJECTS.map((project, i) => (
        <ProjectCard
          key={project.title}
          project={project}
          index={i}
          total={PROJECTS.length}
        />
      ))}
    </div>
  </section>
);

export default ProjectsSection;
