import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface GhostActionButtonProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  href?: string;
  download?: boolean | string;
  className?: string;
}

export const GhostActionButton: React.FC<GhostActionButtonProps> = ({
  children,
  icon: Icon,
  onClick,
  href,
  download,
  className = '',
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2.5 px-6 py-3
    rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA]
    font-semibold uppercase tracking-wider text-xs md:text-sm
    transition-all duration-300 ease-out select-none
    hover:bg-[#D7E2EA]/10 active:scale-95
    ${className}
  `;

  if (href) {
    return (
      <a
        href={href}
        download={download}
        target={href.startsWith('#') ? undefined : "_blank"}
        rel={href.startsWith('#') ? undefined : "noopener noreferrer"}
        className={baseClasses}
      >
        {children}
        {Icon && <Icon size={16} className="shrink-0" />}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {children}
      {Icon && <Icon size={16} className="shrink-0" />}
    </button>
  );
};

export default GhostActionButton;
