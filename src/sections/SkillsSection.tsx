import React from 'react';
import { FadeIn } from '../components/FadeIn';

interface SkillItem {
  id: string;
  name: string;
  skills: string[];
}

export const SkillsSection: React.FC = () => {
  const skillCategories: SkillItem[] = [
    {
      id: '01',
      name: 'Frontend Development',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    },
    {
      id: '02',
      name: 'Backend Engineering',
      skills: ['Node.js', 'Express', 'Python', 'RESTful APIs', 'GraphQL'],
    },
    {
      id: '03',
      name: 'Database Management',
      skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma ORM'],
    },
    {
      id: '04',
      name: 'Cloud & DevOps',
      skills: ['AWS', 'Docker', 'CI/CD pipelines', 'Vercel'],
    },
    {
      id: '05',
      name: 'Architecture & Tools',
      skills: ['Microservices', 'Git', 'Jest', 'System Design'],
    },
  ];

  return (
    <section 
      id="skills"
      className="bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-25"
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Section Heading */}
        <FadeIn
          direction="up"
          distance={45}
          delay={0}
          className="text-center mb-16 sm:mb-20 md:mb-28"
        >
          <h2 
            className="text-[#0C0C0C] font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
          >
            Technical Skills
          </h2>
        </FadeIn>

        {/* Skill Items List */}
        <div className="flex flex-col border-t border-[#0C0C0C]/15">
          {skillCategories.map((category, idx) => (
            <FadeIn
              key={category.id}
              direction="up"
              distance={25}
              delay={idx * 0.1}
              className="w-full"
            >
              <div 
                className="flex flex-col md:flex-row md:items-center py-8 md:py-10 border-b border-[#0C0C0C]/15 gap-4 md:gap-12"
              >
                {/* Left side: Number */}
                <div 
                  className="font-black text-[#0C0C0C]/20 leading-none select-none text-[3.5rem] md:text-[5rem] tracking-tight shrink-0 min-w-[70px]"
                >
                  {category.id}
                </div>

                {/* Right side: Stacked name + tech stack pills */}
                <div className="flex-grow flex flex-col gap-3">
                  <h3 className="text-xl md:text-3xl font-extrabold uppercase tracking-tight">
                    {category.name}
                  </h3>
                  
                  {/* Technology Pills */}
                  <div className="flex flex-wrap gap-2 md:gap-2.5 mt-1">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3.5 py-1.5 rounded-full border border-[#0C0C0C]/15 text-xs md:text-sm font-semibold tracking-wide text-[#0C0C0C]/80 bg-[#0C0C0C]/5 hover:bg-[#0C0C0C]/10 transition-colors duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
