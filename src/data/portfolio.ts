// ============================================================
// MANN'S PORTFOLIO — CENTRAL DATA FILE
// Edit this file to update all content across the portfolio.
// ============================================================

// ── Personal Info ────────────────────────────────────────────
export const PERSONAL = {
  name: 'Mann Checker',
  role: 'Fresher',
  tagline: 'Computer Science Graduate | Backend & AI/ML Enthusiast',
  shortBio:
    'I build practical software, backend systems and AI-powered applications.',
  aboutText:
    "I'm a Computer Science graduate with a strong interest in software development, backend engineering, and AI/ML. I enjoy building practical applications and solving real-world problems using Java, Python, backend technologies, and modern AI tools. I'm continuously learning and improving my development skills by working on real projects.",
} as const;

// ── Contact ──────────────────────────────────────────────────
// Replace placeholder values with your real details when ready.
export const CONTACT = {
  email: 'mannchecker77@gmail.com',
  github: 'https://github.com/Mann-ck',
  linkedin: 'https://www.linkedin.com/in/mann-checker-06aa4032a/',
};

// ── Navigation ───────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
] as const;

// ── Skills ───────────────────────────────────────────────────
export const SKILL_GROUPS = [
  {
    label: 'Programming',
    items: ['Java', 'Python', 'C'],
  },
  {
    label: 'Backend',
    items: ['FastAPI', 'Flask', 'REST APIs', 'Node.js'],
  },
  {
    label: 'Frontend',
    items: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'],
  },
  {
    label: 'AI / ML',
    items: [
      'Pandas',
      'NumPy',
      'Scikit-learn',
      'TensorFlow',
      'PyTorch',
      'Transformers',
      'NLP',
      'Generative AI',
    ],
  },
  {
    label: 'Databases',
    items: ['MySQL', 'SQL'],
  },
  {
    label: 'Development',
    items: ['Git', 'GitHub'],
  },
  {
    label: 'AI Tools',
    items: ['Kiro', 'Claude', 'ChatGPT'],
  },
] as const;

// ── Projects ─────────────────────────────────────────────────
// All fields except `title` and `description` are optional.
// If a field is not provided (undefined / empty string), its
// corresponding UI element will be hidden automatically.
//
// To add a new project in the future:
//   1. Add a new entry to this array.
//   2. Provide as many fields as you have available.
//   3. Save — the project card renders itself from this data.
//
// Fields:
//   title        — project name (required)
//   description  — short description (required)
//   category     — category label shown above the title
//   technologies — array of tech tags
//   githubUrl    — GitHub repository URL  → shows "GitHub" button
//   liveUrl      — Live deployed URL      → shows "Live Demo" button
//   videoUrl     — Demo video URL         → shows "Watch Demo" button
//   image        — path relative to /public, e.g. '/my-project.png'
//   featured     — true to mark as featured (future use)

export interface Project {
  title: string;
  description: string;
  category?: string;
  technologies?: string[];
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  image?: string;
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  {
    title: 'Dual Factor Authentication System',
    description:
      'A secure two-step authentication system combining facial recognition with OTP verification to provide an additional layer of authentication.',
    category: 'Security · Python',
    technologies: ['Python', 'Facial Recognition', 'OTP', 'Authentication'],
    githubUrl: 'https://github.com/Mann-ck/Dual-Factor-Authentication1.git',
    // liveUrl: undefined  — no live demo yet
    // videoUrl: undefined — no demo video yet
    // image: undefined    — no screenshot yet
    featured: true,
  },
  {
    title: 'MediScribe',
    description:
      'A medical documentation tool designed to streamline the process of creating and managing medical records.',
    category: 'Healthcare · AI',
    technologies: [],
    githubUrl: 'https://github.com/Mann-ck/MediScribe.git',
    // liveUrl: undefined  — no live demo yet
    // videoUrl: undefined — no demo video yet
    // image: undefined    — no screenshot yet
    featured: true,
  },
];
