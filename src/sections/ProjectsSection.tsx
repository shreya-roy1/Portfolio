import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Code, Globe, Star, GitFork } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';

interface GithubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  language: string;
}

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://api.github.com/users/shreya-roy1/repos?sort=updated&per_page=100');
        const data: GithubRepo[] = await response.json();
        
        // Define the list of projects to feature (including the new ones requested)
        const featuredNames = [
          'Air-Drawer', 
          'EchoMind', 
          'Phishing-Sentinel', 
          'cipher-model', 
          'OmniShield', 
          'SafeRide-Shield', 
          'ArmorClaw', 
          'student-admission-portal',
          'lexitrace',
          'websocket-kanban'
        ];

        // Filter and sort by the order of featuredNames
        const filtered = data
          .filter(repo => featuredNames.includes(repo.name) || featuredNames.includes(repo.name.replace('---Multi-Agent-Audio-Intelligence', '')))
          .map(repo => {
            if (repo.name.toLowerCase() === 'armorclaw' || repo.name.toLowerCase() === 'amourclaw') {
              return {
                ...repo,
                description: 'Advanced cybersecurity tool for threat detection, real-time analysis, and system defense. ' + (repo.description || '')
              };
            }
            return repo;
          })
          .sort((a, b) => {
            const indexA = featuredNames.findIndex(n => a.name.includes(n));
            const indexB = featuredNames.findIndex(n => b.name.includes(n));
            return indexA - indexB;
          });

        setProjects(filtered.length > 0 ? filtered : data.filter(repo => !repo.fork).slice(0, 8));
      } catch (error) {
        console.error('Error fetching github projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="bg-[#030305] text-[#E2E8F0] pt-24 pb-20 relative z-30 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col gap-3 mb-16 md:mb-20">
          <FadeIn direction="up" distance={20} delay={0}>
            <span className="font-semibold text-sm text-indigo-400 uppercase tracking-wider">
              Selected Works
            </span>
          </FadeIn>
          <FadeIn direction="up" distance={30} delay={0.1}>
            <h2 className="font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-white">
              Projects & Research
            </h2>
          </FadeIn>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const ProjectCard: React.FC<{ project: GithubRepo; index: number }> = ({ project, index }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex flex-col h-full bg-[#0a0a0f] rounded-2xl border border-white/10 overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 group"
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-xl text-white group-hover:text-indigo-400 transition-colors">
              {project.name}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#94a3b8] text-sm mb-6 flex-grow line-clamp-3">
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
              <Star className="w-4 h-4" />
              <span>{project.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-4 h-4" />
              <span>{project.forks_count}</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <a 
              href={project.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"
              aria-label="View Source Code"
            >
              <Code className="w-5 h-5" />
            </a>
            {project.homepage && (
              <a 
                href={project.homepage} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"
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
