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

        {/* CTA */}
        <FadeIn delay={0.2} y={20}>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full px-10 py-3.5 sm:px-12 sm:py-4 text-xs sm:text-sm font-medium uppercase tracking-widest text-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
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
        </FadeIn>

      </div>
    </section>
  );
};

export default AboutSection;
