import FadeIn from './FadeIn';
import AnimatedText from './AnimatedText';
import { PERSONAL } from '../data/portfolio';

const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-32"
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, #6c21b0 0%, transparent 70%)',
        }}
      />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-12 sm:gap-16 md:gap-20 text-center w-full max-w-3xl mx-auto">

        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 140px)' }}
          >
            About me
          </h2>
        </FadeIn>

        <AnimatedText
          text={PERSONAL.aboutText}
          className="font-medium leading-relaxed w-full text-left sm:text-center"
          style={{ fontSize: 'clamp(0.92rem, 2.2vw, 1.3rem)' }}
        />

        {/* Role / focus tags */}
        <FadeIn delay={0.1} y={20}>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Computer Science Graduate',
              'Backend Development',
              'Java & Python',
              'AI / ML',
              'Generative AI',
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#D7E2EA]/15 bg-[#D7E2EA]/[0.04] px-4 py-1.5 text-sm text-[#D7E2EA]/75 hover:border-[#D7E2EA]/35 hover:text-[#D7E2EA] transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={0.2} y={20}>
          {/* Mobile: full-width stacked pair, capped at 320px so they never
              touch screen edges even on a 320px phone.
              sm+: revert to auto-width side-by-side — desktop unchanged. */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-4 w-full sm:w-auto">

            {/* Get in Touch — unchanged on desktop */}
            <a
              href="#contact"
              className="w-full sm:w-auto max-w-xs sm:max-w-none inline-flex items-center justify-center rounded-full px-10 py-4 sm:px-12 sm:py-4 text-xs sm:text-sm font-medium uppercase tracking-widest text-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={{
                background:
                  'linear-gradient(135deg, #1a0a2e 0%, #6c21b0 45%, #4a1a80 75%, #8b3a00 100%)',
                boxShadow: '0 4px 20px rgba(108, 33, 176, 0.3)',
                outline: '1.5px solid rgba(255,255,255,0.2)',
                outlineOffset: '-1.5px',
              }}
            >
              Get in Touch
            </a>

            {/* View Resume — dark charcoal gradient */}
            <a
              href="/MannBasicResume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto max-w-xs sm:max-w-none inline-flex items-center justify-center rounded-full border border-white/20 px-10 py-4 sm:px-12 sm:py-4 text-xs sm:text-sm font-medium uppercase tracking-widest text-white transition-all duration-200 hover:scale-[1.02] hover:border-white/35 hover:shadow-[0_0_28px_rgba(255,255,255,0.1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={{
                background: 'linear-gradient(135deg, #111111 0%, #3a3a3a 50%, #111111 100%)',
                boxShadow: '0 0 20px rgba(255,255,255,0.08)',
              }}
            >
              View Resume
            </a>

          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default AboutSection;
