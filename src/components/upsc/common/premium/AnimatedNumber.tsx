import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

export function AnimatedNumber({
  value,
  duration = 2,
  delay = 0,
  className = '',
  decimals = 0,
  suffix = '',
  prefix = ''
}: AnimatedNumberProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (current) =>
    (prefix + current.toFixed(decimals) + suffix)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAnimated) {
        spring.set(value);
        setHasAnimated(true);
      }
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [spring, value, delay, hasAnimated]);

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  );
}
