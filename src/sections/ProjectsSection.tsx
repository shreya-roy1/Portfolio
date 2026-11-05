import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, Code, Globe, RefreshCw } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { formatImageUrl } from '../utils/imageUrl';

interface ProjectItem {
  id: string | number;
  name: string;
  repo_name?: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  custom_image_url?: string | null;
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'Phishing-Sentinel',
    name: 'Phishing-Sentinel',
    description: 'A cybersecurity tool to detect and prevent phishing attacks using machine learning.',
    html_url: 'https://github.com/shreya-roy1/Phishing-Sentinel',
    homepage: null,
    topics: ['machine-learning', 'cybersecurity', 'python'],
    stargazers_count: 0,
    forks_count: 0,
    language: 'Python'
  },
  {
    id: 'EchoMind',
    name: 'EchoMind',
    description: 'A platform leveraging AI for conversational insights and intelligence.',
    html_url: 'https://github.com/shreya-roy1/EchoMind',
    homepage: null,
    topics: ['ai', 'nlp', 'react', 'typescript'],
    stargazers_count: 0,
    forks_count: 0,
    language: 'TypeScript'
  },
  {
    id: 'OmniShield',
    name: 'OmniShield',
    description: 'Comprehensive endpoint system protection and threat interception suite.',
    html_url: 'https://github.com/shreya-roy1/OmniShield',
    homepage: null,
    topics: ['security', 'shield', 'python'],
    stargazers_count: 0,
    forks_count: 0,
    language: 'Python'
  },
  {
    id: 'websocket-kanban',
    name: 'websocket-kanban',
    description: 'Real-time collaborative kanban board using WebSockets with optimistic state updates.',
    html_url: 'https://github.com/shreya-roy1/websocket-kanban',
    homepage: null,
    topics: ['websocket', 'react', 'real-time'],
    stargazers_count: 0,
    forks_count: 0,
    language: 'TypeScript'
  },
  {
    id: 'ArmorClaw',
    name: 'ArmorClaw',
    description: 'Advanced cybersecurity tool for threat detection, real-time analysis, and system defense.',
    html_url: 'https://github.com/shreya-roy1/ArmorClaw',
    homepage: null,
    topics: ['cybersecurity', 'threat-detection'],
    stargazers_count: 0,
    forks_count: 0,
    language: 'TypeScript'
  },
  {
    id: 'student-admission-portal',
    name: 'student-admission-portal',
    description: 'A comprehensive portal for managing student admissions and academic telemetry.',
    html_url: 'https://github.com/shreya-roy1/student-admission-portal',
    homepage: null,
    topics: ['web-development', 'react', 'nodejs'],
    stargazers_count: 0,
    forks_count: 0,
    language: 'JavaScript'
  }
];

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLiveProjects();
  }, []);

  const fetchLiveProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: ProjectItem[] = data
            .filter((p: any) => p.is_visible !== false)
            .sort((a: any, b: any) => (a.priority ?? 0) - (b.priority ?? 0))
            .map((p: any) => ({
              id: p.repo_name,
              repo_name: p.repo_name,
              name: p.display_title || p.repo_name,
              description: p.custom_description || p.description || 'No description provided.',
              html_url: p.html_url || `https://github.com/shreya-roy1/${p.repo_name}`,
              homepage: p.demo_url || p.homepage_url || null,
              topics: Array.isArray(p.topics) ? p.topics : [],
              stargazers_count: p.stars_count || 0,
              forks_count: p.forks_count || 0,
              language: p.language || 'Code',
              custom_image_url: p.custom_image_url ? formatImageUrl(p.custom_image_url) : null,
            }));

          if (mapped.length > 0) {
            setProjects(mapped);
          }
        }
      }
    } catch (e) {
      console.warn('Could not load dynamic projects, using static fallback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="projects" className="bg-[#030305] text-[#E2E8F0] pt-24 pb-20 relative z-30 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col gap-3 mb-16 md:mb-20">
          <FadeIn direction="up" distance={20} delay={0}>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-indigo-400 uppercase tracking-wider">
                Selected Works
              </span>
              {loading && <RefreshCw size={12} className="animate-spin text-indigo-400" />}
            </div>
          </FadeIn>
          <FadeIn direction="up" distance={30} delay={0.1}>
            <h2 className="font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-white">
              Projects & Research
            </h2>
          </FadeIn>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard: React.FC<{ project: ProjectItem; index: number }> = ({ project, index }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="flex flex-col h-full bg-[#0a0a0f] rounded-2xl border border-white/10 overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-indigo-500/30 transition-all duration-300 group"
    >
      {/* Optional Custom Cover Image */}
      {project.custom_image_url && (
        <div className="w-full h-44 overflow-hidden bg-black/50 border-b border-white/10 relative">
          <img
            src={project.custom_image_url}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-400 shrink-0" />
            <h3 className="font-bold text-xl text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
              {project.name}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#94a3b8] text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
          {project.description || 'No description provided.'}
        </p>

        {/* Tags */}
        {project.topics && project.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.topics.slice(0, 4).map((topic) => (
              <span 
                key={topic} 
                className="px-2.5 py-1 text-xs font-medium rounded-full bg-white/5 text-slate-300 border border-white/10"
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Footer Metrics & Links */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-4 text-sm text-slate-400">
            {project.language && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span>{project.language}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-slate-500" />
              <span>{project.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-4 h-4 text-slate-500" />
              <span>{project.forks_count}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <a 
              href={project.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-indigo-400 transition-colors rounded-lg hover:bg-white/5"
              aria-label="View Source Code"
            >
              <Code className="w-5 h-5" />
            </a>
            {project.homepage && (
              <a 
                href={project.homepage} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-indigo-400 transition-colors rounded-lg hover:bg-white/5"
                aria-label="View Live Project"
              >
                <Globe className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectsSection;
