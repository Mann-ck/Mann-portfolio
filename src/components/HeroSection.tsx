import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from './FadeIn';
import { PERSONAL, CONTACT, NAV_LINKS } from '../data/portfolio';

// ─── Hero Section ─────────────────────────────────────────────────────────────
// Responsive: hamburger nav on mobile, full inline nav on desktop.
// Video: object-cover + face-centred position on mobile, object-contain on desktop.
// Audio: unmuted intent, browser-forced-mute fallback with persistent prompt.

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [browserForcedMute, setBrowserForcedMute] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ── Autoplay: unmuted intent, muted fallback ────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    const attempt = async () => {
      try {
        await v.play();
        setMuted(false);
        setBrowserForcedMute(false);
      } catch {
        v.muted = true;
        setMuted(true);
        setBrowserForcedMute(true);
        try { await v.play(); } catch { /* fully blocked */ }
      }
    };
    attempt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-mute when hero scrolls out of view ─────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          const v = videoRef.current;
          if (v && !v.muted) { v.muted = true; setMuted(true); }
        }
      },
      { threshold: 0, rootMargin: '-50% 0px 0px 0px' }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // ── Smooth first-scroll ─────────────────────────────────────────────────
  useEffect(() => {
    let fired = false;
    const goToAbout = () => {
      if (fired) return;
      fired = true;
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const onWheel = (e: WheelEvent) => {
      if (fired || e.deltaY <= 0 || window.scrollY > 50) return;
      e.preventDefault(); goToAbout();
    };
    const onKey = (e: KeyboardEvent) => {
      if (fired || window.scrollY > 50) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault(); goToAbout();
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // ── Close menu on nav click ─────────────────────────────────────────────
  const handleNavClick = () => setMenuOpen(false);

  // ── Sound toggle ─────────────────────────────────────────────────────────
  const handleSoundButton = () => {
    const v = videoRef.current;
    if (!v) return;
    if (browserForcedMute) {
      v.muted = false;
      setMuted(false);
      setBrowserForcedMute(false);
      if (v.paused) v.play().catch(() => {});
    } else {
      v.muted = !v.muted;
      setMuted(v.muted);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full overflow-hidden bg-[#0C0C0C]"
      // 100svh respects mobile browser chrome; falls back to 100vh on older browsers
      style={{ height: '100svh', minHeight: '560px' }}
    >
      {/* ── Video background ────────────────────────────────────────────────
          Desktop: object-contain shows full frame
          Mobile:  object-cover + top-aligned position shows face/upper body
          Both handled via CSS classes + inline override below.            */}
      <video
        ref={videoRef}
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setVideoLoaded(true)}
        className="absolute inset-0 w-full h-full transition-opacity duration-1000 video-bg"
        style={{ opacity: videoLoaded ? 1 : 0 }}
        aria-hidden="true"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>

      {/* Cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(#D7E2EA 1px, transparent 1px), linear-gradient(90deg, #D7E2EA 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Content layer ─────────────────────────────────────────────────── */}
      <div className="relative z-10 flex h-full flex-col">

        {/* ── NAV ─────────────────────────────────────────────────────────── */}
        <FadeIn delay={0} y={-20} className="relative flex-shrink-0">
          <nav
            aria-label="Main navigation"
            className="flex items-center justify-between px-5 sm:px-6 md:px-10 pt-5 md:pt-8"
          >

            {/* Desktop nav links — hidden on mobile */}
            <ul className="hidden md:flex items-center gap-8 md:gap-12" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile: logo text on the left */}
            <span className="md:hidden text-xs font-bold uppercase tracking-[0.25em] text-white/80">
              {PERSONAL.name.split(' ')[0]}
            </span>

            {/* Desktop: email pill */}
            <a
              href={`mailto:${CONTACT.email}`}
              className="hidden md:inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur-md transition hover:bg-white/20 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Email me
            </a>

            {/* Mobile: hamburger button */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <span
                className="block w-4 h-px bg-white transition-all duration-300 origin-center"
                style={menuOpen ? { transform: 'translateY(4px) rotate(45deg)' } : {}}
              />
              <span
                className="block w-4 h-px bg-white transition-all duration-300"
                style={menuOpen ? { opacity: 0, transform: 'scaleX(0)' } : {}}
              />
              <span
                className="block w-4 h-px bg-white transition-all duration-300 origin-center"
                style={menuOpen ? { transform: 'translateY(-4px) rotate(-45deg)' } : {}}
              />
            </button>
          </nav>

          {/* ── Mobile dropdown menu ──────────────────────────────────────── */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="md:hidden absolute top-full left-0 right-0 mx-4 mt-2 rounded-2xl border border-white/12 bg-black/80 backdrop-blur-xl overflow-hidden z-50"
              >
                <ul className="flex flex-col" role="list">
                  {NAV_LINKS.map((link, i) => (
                    <li
                      key={link.label}
                      style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.06)' : undefined }}
                    >
                      <a
                        href={link.href}
                        onClick={handleNavClick}
                        className="block px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-white/70 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-none"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                  <li style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      onClick={handleNavClick}
                      className="block px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-white/70 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-none"
                    >
                      Email me
                    </a>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </FadeIn>

        {/* ── Hero content ──────────────────────────────────────────────────
            Layout: flex column, space-between.
            Nav sits at top. Content block sits in the middle-lower area using
            auto margins (mt-auto pushes it down from nav, mb adjusts per screen).
            Sound bar is pinned at the bottom — never overlaps content.
            No fixed px padding — spacing is driven by viewport-relative units. */}
        <div className="flex flex-1 flex-col">
          {/* Spacer: pushes content down past the upper half (face area).
              On very short phones (svh < 600) the spacer shrinks automatically
              because flex children share available space.                    */}
          <div className="flex-[1.2] min-h-0" aria-hidden="true" />

          {/* Content */}
          <div className="w-full max-w-7xl px-5 sm:px-6 md:px-10">

            <FadeIn delay={0.2} y={20}>
              <p className="mb-3 text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.35em] text-white/50">
                Portfolio · 2026
              </p>
            </FadeIn>

            <FadeIn delay={0.4} y={30}>
              <h1
                className="font-black uppercase leading-[0.9] tracking-tight text-white"
                style={{ fontSize: 'clamp(2rem, 9vw, 3.8rem)' }}
              >
                {PERSONAL.name}
              </h1>
            </FadeIn>

            <FadeIn delay={0.6} y={20}>
              <p
                className="mt-3 md:mt-5 font-medium uppercase text-white/65 leading-snug"
                style={{
                  fontSize: 'clamp(0.6rem, 2.2vw, 0.95rem)',
                  letterSpacing: 'clamp(0.05em, 0.25vw, 0.25em)',
                  maxWidth: '100%',
                }}
              >
                Software Developer &nbsp;·&nbsp; Backend &amp; AI/ML
              </p>
            </FadeIn>

            <FadeIn delay={0.75} y={20}>
              <p
                className="mt-3 md:mt-4 font-light text-white/78 leading-relaxed max-w-sm md:max-w-xl"
                style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1.15rem)' }}
              >
                {PERSONAL.shortBio}
              </p>
            </FadeIn>

            {/* CTA buttons */}
            <FadeIn delay={0.9} y={20}>
              <div className="mt-5 md:mt-9 flex flex-col sm:flex-row flex-wrap gap-3">
                {/* Primary */}
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center rounded-full px-7 py-3 text-xs font-medium uppercase tracking-widest text-white transition-transform hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  style={{
                    background: 'linear-gradient(135deg, #1a0a2e 0%, #6c21b0 45%, #4a1a80 75%, #8b3a00 100%)',
                    boxShadow: '0 4px 20px rgba(108, 33, 176, 0.35)',
                    outline: '1.5px solid rgba(255,255,255,0.25)',
                    outlineOffset: '-1.5px',
                  }}
                >
                  View Projects
                </a>

                {/* Secondary row */}
                <div className="flex gap-3">
                  <a
                    href={CONTACT.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.08] px-6 py-3 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-md transition hover:bg-white/15 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    <GithubIcon />
                    GitHub
                  </a>

                  <a
                    href="#contact"
                    className="inline-flex items-center rounded-full border border-white/25 bg-transparent px-6 py-3 text-xs font-medium uppercase tracking-widest text-white/80 backdrop-blur-md transition hover:border-white/50 hover:text-white hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    Contact Me
                  </a>
                </div>
              </div>
            </FadeIn>

          </div>

          {/* Spacer below content — gives breathing room above the sound bar.
              flex-1 here is smaller than the top spacer so content sits in the
              lower-middle zone rather than dead-centre.                      */}
          <div className="flex-1 min-h-0" aria-hidden="true" />
        </div>

        {/* ── Bottom bar: scroll + sound ──────────────────────────────────── */}
        <div className="flex-shrink-0 flex items-end justify-between px-5 sm:px-6 md:px-10 pb-5 sm:pb-8 md:pb-10">

          {/* Scroll indicator — hidden on small screens to save space */}
          <FadeIn delay={1.2} y={20}>
            <a
              href="#about"
              aria-label="Scroll to About section"
              className="hidden sm:flex group flex-col items-center gap-2 focus-visible:outline-none"
            >
              <span className="text-[9px] font-medium uppercase tracking-[0.35em] text-white/55 transition group-hover:text-white">
                Scroll
              </span>
              <div className="relative h-10 w-px overflow-hidden bg-white/20">
                <motion.span
                  className="absolute inset-x-0 top-0 h-1/2 w-full bg-white"
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </a>
            {/* Mobile: invisible placeholder to keep justify-between working */}
            <span className="sm:hidden w-px" aria-hidden="true" />
          </FadeIn>

          {/* Sound control */}
          <FadeIn delay={1.2} y={20}>
            <div className="flex items-center">
              {browserForcedMute ? (
                <button
                  onClick={handleSoundButton}
                  aria-label="Enable sound"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-md transition hover:bg-white/20 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  style={{ animation: 'pulseFade 2.5s ease-in-out infinite' }}
                >
                  <UnmutedIcon />
                  Enable sound
                </button>
              ) : (
                <button
                  onClick={handleSoundButton}
                  aria-label={muted ? 'Unmute video' : 'Mute video'}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  {muted ? <MutedIcon /> : <UnmutedIcon />}
                </button>
              )}
            </div>
          </FadeIn>

        </div>
      </div>

      <style>{`
        @keyframes pulseFade {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* Desktop: preserve full frame with contain */
        .video-bg {
          object-fit: contain;
          object-position: center center;
        }

        /* Mobile: cover + position to show face and upper body clearly */
        @media (max-width: 767px) {
          .video-bg {
            object-fit: cover;
            object-position: center 18%;
          }
        }
      `}</style>
    </section>
  );
};

// ── Icons ─────────────────────────────────────────────────────────────────────

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
  </svg>
);

const MutedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const UnmutedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

export default HeroSection;
