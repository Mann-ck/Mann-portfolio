import { Mail, Linkedin, Github, ArrowUpRight } from 'lucide-react';
import FadeIn from './FadeIn';
import { CONTACT, PERSONAL } from '../data/portfolio';

// ─── Contact methods ─────────────────────────────────────────────────────────
// Values come from src/data/portfolio.ts → CONTACT object.
// Replace YOUR_EMAIL / YOUR_GITHUB_URL / YOUR_LINKEDIN_URL with real values
// and the cards will populate automatically.

interface ContactMethod {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
  isPlaceholder: boolean;
}

const buildMethods = (): ContactMethod[] => {
  return [
    {
      icon: Mail,
      label: 'Email',
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      isPlaceholder: false,
    },
    {
      icon: Github,
      label: 'GitHub',
      value: CONTACT.github.replace('https://github.com/', '@'),
      href: CONTACT.github,
      isPlaceholder: false,
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: CONTACT.linkedin
        .replace('https://www.linkedin.com/in/', 'in/')
        .replace(/\/$/, ''),
      href: CONTACT.linkedin,
      isPlaceholder: false,
    },
  ];
};

const ContactSection = () => {
  const methods = buildMethods();

  return (
    <section
      id="contact"
      className="relative w-full bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20"
    >
      {/* Heading */}
      <FadeIn y={40}>
        <h2
          className="hero-heading text-center font-black uppercase tracking-tight leading-none mb-4"
          style={{ fontSize: 'clamp(3rem, 12vw, 140px)' }}
        >
          Get in touch
        </h2>
      </FadeIn>

      <FadeIn delay={0.15} y={20}>
        <p
          className="text-center font-light uppercase tracking-widest text-[#D7E2EA]/50 mb-12 sm:mb-16 md:mb-20"
          style={{ fontSize: 'clamp(0.8rem, 1.3vw, 1rem)' }}
        >
          Open to opportunities · collaborations · conversations
        </p>
      </FadeIn>

      {/* Contact cards — 1 col on mobile, 3 on sm+ */}
      <div className="mx-auto grid max-w-4xl grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {methods.map((method, i) => {
          const Icon = method.icon;
          const isExternal = method.href.startsWith('http');

          return (
            <FadeIn key={method.label} delay={i * 0.1} y={30}>
              <a
                href={method.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                aria-label={`Contact via ${method.label}`}
                className={`group relative flex flex-row sm:flex-col justify-between sm:justify-between items-center sm:items-start gap-4 sm:gap-8 rounded-2xl sm:rounded-[28px] border-2 bg-[#111115] px-5 py-4 sm:p-7 transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7E2EA]/30 ${
                  method.isPlaceholder
                    ? 'border-[#D7E2EA]/10 opacity-50 cursor-default pointer-events-none'
                    : 'border-[#D7E2EA]/15 hover:border-[#D7E2EA]/50 hover:bg-[#161620]'
                }`}
              >
                {/* Icon */}
                <div className="rounded-full border border-[#D7E2EA]/15 p-2.5 sm:p-3 transition-colors group-hover:border-[#D7E2EA]/40 flex-shrink-0">
                  <Icon className="text-[#D7E2EA]" size={18} strokeWidth={1.5} />
                </div>

                {/* Label + value — takes remaining space on mobile row */}
                <div className="flex flex-col gap-1 flex-1 min-w-0 sm:mt-auto">
                  <span
                    className="font-light uppercase tracking-widest text-[#D7E2EA]/45"
                    style={{ fontSize: 'clamp(0.6rem, 1vw, 0.8rem)' }}
                  >
                    {method.label}
                  </span>
                  <span
                    className="font-medium text-[#D7E2EA] break-all leading-snug"
                    style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1.05rem)' }}
                  >
                    {method.value}
                  </span>
                </div>

                {/* Arrow — hidden on mobile to avoid clutter */}
                {!method.isPlaceholder && (
                  <ArrowUpRight
                    className="hidden sm:block text-[#D7E2EA]/30 transition-all duration-300 group-hover:text-[#D7E2EA] group-hover:rotate-12 flex-shrink-0"
                    size={18}
                    strokeWidth={1.5}
                  />
                )}
              </a>
            </FadeIn>
          );
        })}
      </div>

      {/* Footer */}
      <FadeIn delay={0.4} y={20}>
        <div className="mx-auto mt-20 sm:mt-24 flex max-w-4xl flex-col items-center gap-3 border-t border-[#D7E2EA]/8 pt-8 text-center sm:flex-row sm:justify-between">
          <span
            className="font-light uppercase tracking-widest text-[#D7E2EA]/35"
            style={{ fontSize: 'clamp(0.65rem, 1vw, 0.85rem)' }}
          >
            © 2026 {PERSONAL.name}
          </span>
          <span
            className="font-light uppercase tracking-widest text-[#D7E2EA]/35"
            style={{ fontSize: 'clamp(0.65rem, 1vw, 0.85rem)' }}
          >
            Built with React · TypeScript · Tailwind
          </span>
        </div>
      </FadeIn>
    </section>
  );
};

export default ContactSection;
