import React, { useRef, useState } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Code, Globe } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';

interface Project {
  volume: string;
  category: string;
  name: string;
  problem: string;
  architecture: string;
  impact: string;
  tech: string[];
  image: string;
  liveLink: string;
  githubLink: string;
  telemetry: string;
}

export const ProjectsSection: React.FC = () => {
  const projects: Project[] = [
    {
      volume: 'VOL. 01',
      category: 'AI SPATIAL COMPUTING // VISION',
      name: 'AirDrawer',
      problem: 'Webcam gesture drawing lags.',
      architecture: 'React maps webcam frames to low-latency coordinates.',
      impact: 'Kept motion smooth with minimal lag.',
      tech: ['Computer Vision', 'React.js', 'TypeScript', 'Webcam API', 'Matrix Transformations'],
      image: '/assets/project_ai.png',
      liveLink: 'https://air-drawerr.vercel.app/',
      githubLink: 'https://github.com/shreya-roy1/Air-Drawer',
      telemetry: 'KINEMATIC_MAP: ENGAGED | CANVAS_LATENCY: LOW',
    },
    {
      volume: 'VOL. 02',
      category: 'ACOUSTIC INTELLIGENCE // ML',
      name: 'EchoMind',
      problem: 'Audio threat alerts arrive too slowly.',
      architecture: 'WebSockets deliver telemetry to React and FastAPI.',
      impact: 'Faster alerts and clearer incident visibility.',
      tech: ['React.js', 'FastAPI', 'Python', 'Twilio', 'WebSockets'],
      image: '/assets/project_echomind.png',
      liveLink: 'https://echomind-multi-agent-audio-intelligence.onrender.com/',
      githubLink: 'https://github.com/shreya-roy1/EchoMind---Multi-Agent-Audio-Intelligence',
      telemetry: 'DETECT_LATENCY: 12ms | THREAT_SCAN: ENGAGED',
    },
    {
      volume: 'VOL. 03',
      category: 'SECURE CRYPTOGRAPHY // WEB',
      name: 'Cipher Model',
      problem: 'Encryption workflows are split across tools and add friction.',
      architecture: 'Web Crypto API performs AES-GCM 256 locally in browser.',
      impact: 'Client encryption reduced exposure.',
      tech: ['React.js', 'JavaScript', 'Node.js', 'Web Cryptography'],
      image: '/assets/project_cipher.png',
      liveLink: 'https://cipher-model.vercel.app/',
      githubLink: 'https://github.com/shreya-roy1/cipher-model',
      telemetry: 'KEY_STRENGTH: AES-GCM 256 | ENCRYPT: STABLE',
    },
    {
      volume: 'VOL. 04',
      category: 'BROWSER SECURITY // GO',
      name: 'Phishing Sentinel',
      problem: 'Phishing pages can bypass protections before login.',
      architecture: 'Extension inspects DOM while Go scores page risk.',
      impact: 'Blocked phishing before navigation.',
      tech: ['Go', 'Chrome Extension', 'Machine Learning', 'DOM Parser'],
      image: '/assets/project_phishing.png',
      liveLink: 'https://chromewebstore.google.com/detail/sentinel-suite-phishing-g/ankdnkinpgjkncgjphbjdpjaallligim?utm_source=github-repo',
      githubLink: 'https://github.com/shreya-roy1/Phishing-Sentinel',
      telemetry: 'DOM_SCAN: ACTIVE | GO_SERVICE: ACTIVE',
    },
    {
      volume: 'VOL. 05',
      category: 'BANKING FRAUD INTELLIGENCE // SIMULATION',
      name: 'OmniShield',
      problem: 'Fraud signals are obscured.',
      architecture: 'Dashboard visualizes telemetry and risk score simulations.',
      impact: 'Made hidden fraud paths visible.',
      tech: ['React.js', 'Data Visualization', 'Fraud Detection', 'Compliance'],
      image: '/assets/project_crypto.png',
      liveLink: 'https://github.com/shreya-roy1/OmniShield',
      githubLink: 'https://github.com/shreya-roy1/OmniShield',
      telemetry: 'FRAUD_TRACE: LIVE | COMPLIANCE_MATRIX: ARMED',
    },
    {
      volume: 'VOL. 06',
      category: 'PARAMETRIC INSURANCE // FINTECH',
      name: 'SafeRide Shield',
      problem: 'Weather-triggered payouts are hard to track manually.',
      architecture: 'Firebase stores policy state while weather triggers events.',
      impact: 'Automated visibility and reduced claims review time.',
      tech: ['React.js', 'Node.js', 'Firebase', 'OpenWeather API'],
      image: '/assets/project_saferide.png',
      liveLink: 'https://saferide-shield.vercel.app/',
      githubLink: 'https://github.com/shreya-roy1/SafeRide-Shield',
      telemetry: 'RAIN_CURFEW: ENGAGED | ZERO_TOUCH_PAYOUT: STABLE',
    },
    {
      volume: 'VOL. 07',
      category: 'MULTI-AGENT FINANCIALS // CYBER',
      name: 'ArmorClaw',
      problem: 'Autonomous trading agents act without validation.',
      architecture: 'Enforcement layer validates agent intents before trades.',
      impact: 'Reduced unauthorized execution.',
      tech: ['Python', 'FastAPI', 'Multi-Agent Framework', 'Security Policy'],
      image: '/assets/project_ai.png',
      liveLink: 'https://armorclaw-safe-financial-trading-sy.vercel.app/',
      githubLink: 'https://github.com/shreya-roy1/Delegation-Safe-Financial-Trading-System',
      telemetry: 'INTENT_GATEKEEPER: ENFORCED | ANOMALY_FILTER: ACTIVE',
    },
    {
      volume: 'VOL. 08',
      category: 'ACADEMIC PORTALS // DATABASE',
      name: 'Student Admission Portal',
      problem: 'Admissions workflows are scattered.',
      architecture: 'Responsive UI connects to Node.js + MySQL for tracking.',
      impact: 'Centralized applicant status and cut review time.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'MySQL', 'Node.js'],
      image: '/assets/project_saas.png',
      liveLink: 'https://student-admission-portal-59mf.onrender.com/',
      githubLink: 'https://github.com/shreya-roy1/student-admission-portal',
      telemetry: 'ADMISSION_DB: SECURED | DB_TRANSACTIONS: 100%',
    },
    {
      volume: 'VOL. 09',
      category: 'HR INFRASTRUCTURE // BACKEND',
      name: 'Employee Management System',
      problem: 'HR data in spreadsheets causes inconsistent records.',
      architecture: 'Java backend and SQL store power a secure admin interface.',
      impact: 'Centralized HR operations and cut reconciliation work.',
      tech: ['Java', 'SQL', 'JDBC', 'HTML5', 'Tailwind CSS'],
      image: '/assets/project_cloud.png',
      liveLink: 'https://github.com/shreya-roy1/Employee_Management_system_Website',
      githubLink: 'https://github.com/shreya-roy1/Employee_Management_system_Website',
      telemetry: 'HR_AUTOMATION: ACTIVE | ATTENDANCE_SYNC: STABLE',
    },
  ];

  return (
    <section
      id="projects"
      className="bg-[#030305] text-[#E2E8F0] pt-24 pb-20 relative z-30"
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">

        {/* Section Heading */}
        <div className="max-w-5xl mx-auto flex flex-col gap-3 mb-16 md:mb-24">
          <FadeIn direction="up" distance={20} delay={0}>
            <span className="font-mono text-xs text-quantumCyan uppercase tracking-[0.25em] font-bold">
              03 // SCIENTIFIC COMPILATIONS
            </span>
          </FadeIn>
          <FadeIn direction="up" distance={30} delay={0.1}>
            <h2 className="silver-heading font-black uppercase tracking-tight text-[2.5rem] sm:text-[4rem] md:text-[5rem] leading-none">
              Research & Projects
            </h2>
          </FadeIn>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-5 md:gap-y-14 relative items-stretch">
          {projects.map((project, idx) => (
            <ProjectCard
              key={project.volume}
              project={project}
              index={idx}
              totalCards={projects.length}
            />
          ))}
          <div className="h-[25vh] sm:h-[30vh] pointer-events-none" />
        </div>

      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: Project;
  index: number;
  totalCards: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, totalCards }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Track scroll position of this specific card wrapper
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end start'],
  });

  // Keep a subtle scroll effect without compressing the grid too much.
  const targetScale = 1 - (totalCards - 1 - index) * 0.02;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const translateY = useTransform(scrollYProgress, [0, 1], [0, index * 18]);

  return (
    <article
      ref={cardRef}
      className="w-full h-full"
    >
      <motion.div
        style={{
          scale,
          y: translateY,
          willChange: 'transform, scale',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full h-full min-h-[420px] lg:min-h-[460px] rounded-[26px] md:rounded-[32px] border border-white/10 bg-[#030305] p-4 md:p-5 flex flex-col justify-between shadow-[0_-15px_40px_rgba(0,0,0,0.8)] relative group overflow-hidden glass-card transition-colors duration-500 hover:border-quantumCyan/20 pointer-events-auto"
      >
        {/* Research Paper Styled Header */}
        <div className="flex items-start border-b border-white/10 pb-2.5 md:pb-3">
          <div className="flex flex-col gap-1.5">
            <div className="font-mono text-[9px] md:text-[10px] text-quantumCyan tracking-wider uppercase font-bold flex items-center gap-2">
              <span>{project.volume}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span>{project.category}</span>
            </div>

            <h3 className="font-extrabold uppercase tracking-tight text-lg md:text-xl lg:text-2xl text-white mt-1">
              {project.name}
            </h3>
          </div>
        </div>

        {/* Middle Area: Technology Tags */}
        <div className="flex flex-col gap-2.5 my-3 md:my-4">
          <span className="font-mono text-[9px] text-purple-400/80 uppercase tracking-widest font-bold">
            [ STACK_REGISTRY ]
          </span>
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((pill) => (
              <span key={pill} className="px-2 py-1 rounded-md border border-white/5 text-[7px] md:text-[8px] font-mono text-[#E2E8F0]/80 bg-white/5 uppercase">
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Section: Borderless Screen Image showcasing Zoom Hover */}
        <div className="flex-grow relative overflow-hidden rounded-2xl bg-zinc-950/80 border border-white/5 group-hover:border-quantumCyan/10 min-h-[200px] md:min-h-[230px]">
          <motion.img
            src={project.image}
            alt={`${project.name} Interface Dashboard`}
            animate={{ scale: isHovered ? 1.03 : 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full h-full object-cover select-none pointer-events-none opacity-60 group-hover:opacity-85 transition-opacity duration-500"
            loading="lazy"
          />

          {/* Subtle bottom telemetry overlay lines inside visual */}
          <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center z-10 pointer-events-none select-none">
            <span className="font-mono text-[8px] md:text-[9px] text-quantumCyan/80 tracking-widest uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {project.telemetry}
            </span>
            <span className="font-mono text-[8px] text-white/30 hidden sm:inline uppercase">
              GRID_SCAN: PASS
            </span>
          </div>

          {/* Gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Floating Hover Links Arrow Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/72 backdrop-blur-sm pointer-events-auto px-4 text-center"
              >
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full border border-quantumCyan bg-quantumCyan text-[#030305] text-xs uppercase tracking-widest font-bold shadow-[0_0_24px_rgba(0,240,255,0.28)] hover:bg-white hover:border-white transition-all duration-300 select-none"
                  >
                    <Globe size={13} />
                    <span>LIVE_DEMO</span>
                    <ArrowUpRight size={12} className="shrink-0" />
                  </a>

                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full border border-white/35 bg-black/70 text-[#E2E8F0] text-xs uppercase tracking-widest font-bold shadow-[0_10px_30px_rgba(0,0,0,0.45)] hover:bg-white/15 hover:border-white/70 transition-all duration-300 select-none"
                  >
                    <Code size={13} />
                    <span>REPOSITORY</span>
                    <ArrowUpRight size={12} className="shrink-0" />
                  </a>
                </div>

                <div className="max-w-lg rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-left backdrop-blur-sm">
                  <div className="grid gap-3">
                    <div>
                      <span className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-quantumCyan/80 font-bold">
                        Problem
                      </span>
                      <p className="text-[#E2E8F0] text-[11px] md:text-[13px] leading-relaxed">
                        {project.problem}
                      </p>
                    </div>
                    <div>
                      <span className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-quantumCyan/80 font-bold">
                        Architecture
                      </span>
                      <p className="text-[#E2E8F0] text-[11px] md:text-[13px] leading-relaxed">
                        {project.architecture}
                      </p>
                    </div>
                    <div>
                      <span className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-quantumCyan/80 font-bold">
                        Impact
                      </span>
                      <p className="text-[#E2E8F0] text-[11px] md:text-[13px] leading-relaxed">
                        {project.impact}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </article>
  );
};

export default ProjectsSection;
