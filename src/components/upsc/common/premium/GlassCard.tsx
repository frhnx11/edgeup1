import { motion } from 'framer-motion';
import { ReactNode, ComponentPropsWithoutRef } from 'react';

interface GlassCardProps {
  children: ReactNode;
  hover?: boolean;
  delay?: number;
  className?: string;
}

export function GlassCard({ children, hover = true, delay = 0, className = '', ...props }: GlassCardProps) {
  const hoverAnimation = hover ? {
    scale: 1.02,
    y: -4,
    boxShadow: '0 20px 40px rgba(9, 77, 136, 0.15)',
  } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={hoverAnimation}
      className={`
        bg-white/80 backdrop-blur-xl rounded-xl
        border border-white/20
        shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]
        ${className}
      `}
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
