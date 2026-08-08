import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, ExternalLink, Play } from 'lucide-react';
import FadeIn from './FadeIn';
import { PROJECTS } from '../data/portfolio';
import type { Project } from '../data/portfolio';

// ─── Deck mechanics ───────────────────────────────────────────────────────────
//
// All breakpoints — sticky cards that stack as the user scrolls.
//
// With only 2 cards the effect must be more pronounced than a multi-card deck:
//   • The second card starts partially visible behind the first immediately.
//   • The STEP between card tops is kept small so both are in the viewport
//     at the same time, making the layered relationship obvious.
//   • The first card compresses noticeably (larger scale shrink) so the
//     depth between the two layers is clearly perceptible.
//   • A box-shadow on the upper card edge of later cards separates the layers
//     visually, like a physical card being lifted from a stack.
//
// Desktop: larger step for breathing room.
// Mobile: smaller step — both cards visible, lighter compression.

// px distance between sticky top values (desktop / mobile).
const DESKTOP_STEP = 22;
const MOBILE_STEP  = 16;
// Base top for card[0] — clears the nav bar.
const BASE_TOP_DESKTOP = 72;
const BASE_TOP_MOBILE  = 58;
// How much earlier cards compress per layer (0–1 fraction).
// Higher = more obvious depth. Tuned for 2-card deck.
const SCALE_SHRINK_PER_LAYER = 0.05;

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
}

const ProjectCard = ({ project, index, total }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  });

  // Earlier cards compress noticeably as later ones slide over them.
  // With 2 cards, card[0] compresses by SCALE_SHRINK_PER_LAYER = 5%,
  // which is clearly visible. Card[1] (last) stays at 1.
  const layersAbove = total - 1 - index; // how many cards will stack on top
  const targetScale = 1 - layersAbove * SCALE_SHRINK_PER_LAYER;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  // Push earlier cards slightly upward as later ones approach — adds parallax depth.
  // Gentle enough not to clip text; strong enough to be felt.
  const yUp = useTransform(scrollYProgress, [0, 1], [0, -(layersAbove * 8)]);

  const hasGithub =
    project.githubUrl &&
    project.githubUrl !== 'YOUR_DUAL_FACTOR_AUTH_GITHUB_URL' &&
    project.githubUrl !== 'YOUR_MEDISCRIBE_GITHUB_URL';
  const hasLive  = Boolean(project.liveUrl);
  const hasVideo = Boolean(project.videoUrl);
  const hasTech  = project.technologies && project.technologies.length > 0;

  // Responsive sticky top via clamp — tighter on mobile, wider on desktop.
  const mobileTop  = BASE_TOP_MOBILE  + index * MOBILE_STEP;
  const desktopTop = BASE_TOP_DESKTOP + index * DESKTOP_STEP;
  const stickyTop  = `clamp(${mobileTop}px, ${(mobileTop + desktopTop) / 2}px + 1vw, ${desktopTop}px)`;

  // Later cards get a top shadow to visually "lift" off the card below.
  const cardShadow = index > 0
    ? '0 -6px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(215,226,234,0.08)'
    : 'none';

  return (
    <div
      ref={cardRef}
      className="sticky w-full"
      style={{ top: stickyTop, zIndex: index + 1 }}
    >
      <motion.article
        style={{ scale, y: yUp, boxShadow: cardShadow }}
        className="origin-top mx-auto w-full rounded-2xl sm:rounded-[32px] md:rounded-[40px] border border-[#D7E2EA]/15 bg-[#111115] overflow-hidden"
        aria-label={`Project: ${project.title}`}
      >
        <div className="flex flex-col md:flex-row">

          {/* Visual panel — shorter on mobile to leave room for next card */}
          <div className="relative flex-shrink-0 w-full md:w-[42%] min-h-[130px] sm:min-h-[180px] md:min-h-[320px] bg-[#0C0C0C] flex items-center justify-center overflow-hidden">
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.title} screenshot`}
                className="h-full w-full object-cover"
                loading="lazy"
                draggable={false}
              />
            ) : (
              <ProjectPlaceholder title={project.title} index={index} />
            )}
          </div>

          {/* Content panel */}
          <div className="flex flex-col justify-between gap-4 p-4 sm:p-6 md:p-10 flex-1">

            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                  {project.category && (
                    <span
                      className="font-light uppercase tracking-[0.18em] text-[#D7E2EA]/50"
                      style={{ fontSize: 'clamp(0.55rem, 1.2vw, 0.8rem)' }}
                    >
                      {project.category}
                    </span>
                  )}
                  <h3
                    className="font-bold uppercase text-[#D7E2EA] leading-tight"
                    style={{ fontSize: 'clamp(0.95rem, 3vw, 2rem)' }}
                  >
                    {project.title}
                  </h3>
                </div>

                <span
                  className="shrink-0 font-black text-[#D7E2EA]/10 leading-none select-none"
                  style={{ fontSize: 'clamp(1.8rem, 7vw, 5rem)' }}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <p
                className="font-light leading-relaxed text-[#D7E2EA]/65"
                style={{ fontSize: 'clamp(0.8rem, 1.6vw, 1.05rem)' }}
              >
                {project.description}
              </p>
            </div>

            {hasTech && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.technologies!.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[#D7E2EA]/15 bg-[#D7E2EA]/[0.04] px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D7E2EA]/8">
              {hasGithub && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#D7E2EA]/25 bg-[#D7E2EA]/[0.05] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/80 transition-all hover:border-[#D7E2EA]/55 hover:text-[#D7E2EA] hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7E2EA]/30"
                  aria-label={`View ${project.title} on GitHub`}
                >
                  <Github size={12} strokeWidth={2} />
                  GitHub
                </a>
              )}
              {hasLive && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider text-white transition-all hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  style={{
                    background: 'linear-gradient(135deg, #1a0a2e 0%, #6c21b0 50%, #4a1a80 100%)',
                    boxShadow: '0 2px 12px rgba(108,33,176,0.3)',
                  }}
                  aria-label={`View live demo of ${project.title}`}
                >
                  <ExternalLink size={12} strokeWidth={2} />
                  Live Demo
                </a>
              )}
              {hasVideo && (
                <a
                  href={project.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#D7E2EA]/25 bg-[#D7E2EA]/[0.05] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/80 transition-all hover:border-[#D7E2EA]/55 hover:text-[#D7E2EA] hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7E2EA]/30"
                  aria-label={`Watch demo video for ${project.title}`}
                >
                  <Play size={12} strokeWidth={2} />
                  Watch Demo
                </a>
              )}
            </div>

          </div>
        </div>
      </motion.article>
    </div>
  );
};

// ─── Placeholder ──────────────────────────────────────────────────────────────
const PLACEHOLDER_GRADIENTS = [
  'from-[#1a0a2e] via-[#2d1060] to-[#0a0a14]',
  'from-[#0a1a2e] via-[#103060] to-[#050f1a]',
  'from-[#1a0a0a] via-[#401010] to-[#0a0505]',
  'from-[#0a1a0a] via-[#103010] to-[#050a05]',
];

const ProjectPlaceholder = ({ title, index }: { title: string; index: number }) => {
  const gradient = PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];
  const initials = title.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div
      className={`relative w-full h-full min-h-[130px] sm:min-h-[180px] md:min-h-[320px] bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-3 p-6`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-white/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-white/15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5" />
      </div>
      <span className="relative z-10 text-3xl font-black text-white/20 tracking-tight">{initials}</span>
      <span className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-white/20 text-center">{title}</span>
    </div>
  );
};

// ─── Section ──────────────────────────────────────────────────────────────────
// paddingBottom must give every sticky card enough scroll travel.
// Generous clamp: works for 2–8 cards at any viewport width.

const ProjectsSection = () => (
  <section
    id="projects"
    className="relative z-10 w-full bg-[#0C0C0C] px-4 sm:px-6 md:px-10 pt-16 sm:pt-20 md:pt-32"
    style={{ paddingBottom: 'clamp(120px, 25vw, 360px)' }}
  >
    <FadeIn y={40}>
      <h2
        className="hero-heading text-center font-black uppercase tracking-tight leading-none mb-3 sm:mb-4"
        style={{ fontSize: 'clamp(2.8rem, 12vw, 140px)' }}
      >
        Projects
      </h2>
    </FadeIn>

    <FadeIn delay={0.1} y={20}>
      <p
        className="text-center font-light uppercase tracking-widest text-[#D7E2EA]/40 mb-10 sm:mb-14 md:mb-20"
        style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.9rem)' }}
      >
        Featured work · More coming soon
      </p>
    </FadeIn>

    <div className="mx-auto max-w-6xl flex flex-col">
      {PROJECTS.map((project, i) => (
        <ProjectCard key={project.title} project={project} index={i} total={PROJECTS.length} />
      ))}
    </div>
  </section>
);

export default ProjectsSection;
