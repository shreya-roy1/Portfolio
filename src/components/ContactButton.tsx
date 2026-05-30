import React from 'react';
import { motion } from 'framer-motion';

interface ContactButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  children = 'Get In Touch',
  onClick,
  className = '',
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`relative px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-white text-sm md:text-base transition-all duration-300 outline outline-2 outline-white outline-offset-[-3px] select-none ${className}`}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: 'inset 0 4px 12px rgba(255, 255, 255, 0.25), 0 8px 24px rgba(182, 0, 168, 0.3)',
      }}
    >
      {children}
    </motion.button>
  );
};

export default ContactButton;
