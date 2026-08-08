import FadeIn from './FadeIn';
import { SKILL_GROUPS } from '../data/portfolio';

// ─── Skills Section ───────────────────────────────────────────────────────────
// Dark theme — matches the Projects section visual system.
// Same bg-[#0C0C0C] base, same border / pill treatment, same typography scale.

const SkillsSection = () => {
  return (
    <section
      id="skills"
      className="relative w-full bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      {/* Subtle ambient glow — same depth as Projects */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] opacity-[0.04] blur-3xl rounded-full"
        style={{ background: 'radial-gradient(ellipse, #6c21b0 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <FadeIn y={40}>
          <h2
            className="hero-heading text-center font-black uppercase tracking-tight leading-none mb-16 sm:mb-20 md:mb-28"
            style={{ fontSize: 'clamp(3rem, 12vw, 140px)' }}
          >
            Skills
          </h2>
        </FadeIn>

        <div className="mx-auto max-w-4xl">
          {SKILL_GROUPS.map((group, i) => (
            <FadeIn key={group.label} delay={i * 0.07} y={25}>
              <div
                className="group flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10 py-7 sm:py-8 md:py-9 transition-colors duration-200 hover:bg-[#D7E2EA]/[0.02]"
                style={{
                  borderTop: '1px solid rgba(215, 226, 234, 0.08)',
                  ...(i === SKILL_GROUPS.length - 1
                    ? { borderBottom: '1px solid rgba(215, 226, 234, 0.08)' }
                    : {}),
                }}
              >
                {/* Category label */}
                <span
                  className="shrink-0 font-light uppercase tracking-widest text-[#D7E2EA]/40 sm:w-40 sm:pt-1 sm:text-right transition-colors duration-200 group-hover:text-[#D7E2EA]/55"
                  style={{ fontSize: 'clamp(0.6rem, 1vw, 0.8rem)' }}
                >
                  {group.label}
                </span>

                {/* Skill pills */}
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {group.items.map((item) => (
                    <SkillPill key={item} label={item} />
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

interface SkillPillProps {
  label: string;
}

const SkillPill = ({ label }: SkillPillProps) => (
  <span
    className="rounded-full border border-[#D7E2EA]/15 bg-[#D7E2EA]/[0.04] px-4 py-1.5 font-medium text-[#D7E2EA]/65 transition-all duration-200 hover:border-[#D7E2EA]/40 hover:bg-[#D7E2EA]/[0.08] hover:text-[#D7E2EA] cursor-default select-none"
    style={{ fontSize: 'clamp(0.78rem, 1.2vw, 0.92rem)' }}
  >
    {label}
  </span>
);

export default SkillsSection;
