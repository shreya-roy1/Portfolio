import React from 'react';
import { Layout, Cpu, Database, BarChart3, Palette, GitBranch } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { Magnet } from '../components/Magnet';

interface TechCategory {
  index: string;
  name: string;
  description: string;
  tech: string[];
  icon: any;
}

export const TechMatrixSection: React.FC = () => {
  const categories: TechCategory[] = [
    {
      index: '01',
      name: 'Frontend',
      description: 'Developing responsive, pixel-perfect interfaces and dynamic single-page web applications.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Angular.js'],
      icon: Layout,
    },
    {
      index: '02',
      name: 'Backend',
      description: 'Architecting secure, high-performance logic servers, session models, and database endpoints.',
      tech: ['Node.js', 'FastAPI', 'Python', 'Java', 'C++', 'C'],
      icon: Cpu,
    },
    {
      index: '03',
      name: 'Database & Cloud',
      description: 'Structuring relational databases and connecting distributed firebase / cloud repositories.',
      tech: ['MySQL', 'Microsoft SQL Server', 'Firebase', 'Google Cloud'],
      icon: Database,
    },
    {
      index: '04',
      name: 'Data Science',
      description: 'Analyzing heavy scientific data matrices, statistical correlations, and training ML models.',
      tech: ['Pandas', 'NumPy'],
      icon: BarChart3,
    },
    {
      index: '05',
      name: 'Design',
      description: 'Designing interactive visual flow diagrams, user interface prototypes, and graphics assets.',
      tech: ['Figma', 'Canva', 'Adobe Photoshop'],
      icon: Palette,
    },
    {
      index: '06',
      name: 'Deployment & Git',
      description: 'Managing version controls, hosting CI/CD triggers, and deploying live applications.',
      tech: ['GitHub', 'Git', 'Vercel', 'Netlify', 'Render'],
      icon: GitBranch,
    },
  ];

  return (
    <section 
      id="architecture" 
      className="py-24 sm:py-32 bg-[#030305] text-[#E2E8F0] relative z-30"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-24 w-full">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-16 md:mb-20">
          <div className="flex flex-col gap-3">
            <FadeIn direction="up" distance={20} delay={0}>
              <span className="font-semibold text-sm text-indigo-400 uppercase tracking-wider">
                My Skills
              </span>
            </FadeIn>
            <FadeIn direction="up" distance={30} delay={0.1}>
              <h2 className="font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-white">
                Technical Stack
              </h2>
            </FadeIn>
          </div>
          
          {/* Glowing Horizontal Rule Line */}
          <FadeIn direction="none" delay={0.25} className="w-full">
            <div className="w-full h-[1px] bg-gradient-to-r from-indigo-500/40 via-indigo-400/30 to-transparent relative mt-2">
              <div className="absolute top-[-1.5px] left-0 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse" />
            </div>
          </FadeIn>
        </div>

        {/* Stacked Bento Rows */}
        <div className="flex flex-col gap-6 w-full">
          {categories.map((category, idx) => {
            const Icon = category.icon;
            
            return (
              <FadeIn
                key={category.index}
                direction="up"
                distance={35}
                delay={idx * 0.1}
                className="w-full"
              >
                <div 
                  className="w-full rounded-2xl md:rounded-3xl border border-white/5 bg-[#0a0a0f] p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-indigo-500/20"
                >
                  {/* Left Column: Metadata & Descriptions */}
                  <div className="flex flex-col gap-2 max-w-md">
                    <div className="flex items-center gap-2.5">
                      <Icon size={20} className="text-indigo-400 shrink-0" />
                      <h3 className="text-lg md:text-xl font-bold tracking-tight text-white">
                        {category.name}
                      </h3>
                    </div>
                    <p className="text-[#E2E8F0]/60 text-xs md:text-sm font-light leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Right Column: Floating Magnetic Technology Chips */}
                  <div className="flex flex-wrap gap-2 md:gap-3 lg:justify-end">
                    {category.tech.map((skill) => (
                      <Magnet 
                        key={skill} 
                        padding={60} 
                        strength={8} 
                        className="pointer-events-auto"
                      >
                        <span 
                          className="text-xs md:text-sm font-medium text-slate-300 border border-white/10 bg-white/5 px-3.5 py-1.5 rounded-full select-none cursor-pointer hover:border-indigo-400 hover:text-indigo-400 transition-colors block"
                        >
                          {skill}
                        </span>
                      </Magnet>
                    ))}
                  </div>

                </div>
              </FadeIn>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TechMatrixSection;
